import Razorpay from 'razorpay';
import {
  formatTeamMembers,
  formatUniqueRegId,
  isTeamEventName,
  postToSheetsWebhook,
} from './_lib/events.js';
import {
  applyCors,
  checkRateLimit,
  clampString,
  getSupabaseAdmin,
  updateRegistrationSafe,
  verifyPassToken,
} from './_lib/security.js';

async function syncRecordToSheets(supabase, record, orderId, paymentId) {
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const sheetsSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || '';
  if (!sheetsWebhookUrl || !record || record.synced_to_sheets) {
    return Boolean(record?.synced_to_sheets);
  }

  try {
    const eventName = record.event_name || 'Official Event';
    const uniqueRegId = formatUniqueRegId(record.unique_id || record.id, eventName);
    const rawTeamName = record.team_name || 'N/A';
    const isTeamEvent = isTeamEventName(eventName, rawTeamName);
    const membersFormatted = formatTeamMembers(record.team_members);

    const payload = {
      secret: sheetsSecret,
      registration_id: uniqueRegId,
      order_id: orderId || record.razorpay_order_id || record.id || 'N/A',
      participant_name: record.participant_name || record.name || '',
      email: record.email || '',
      phone: record.phone || '',
      college: record.college || 'N/A',
      event_name: eventName,
      theme: record.theme || 'General',
      accommodation:
        record.accommodation || (String(eventName).toLowerCase().includes('hackathon') ? 'Yes' : 'N/A'),
      team_name: isTeamEvent ? String(rawTeamName).trim() : 'N/A',
      team_members: isTeamEvent ? membersFormatted : 'N/A',
      amount_paid: Number(record.amount || record.fee || 0),
      razorpay_payment_id: paymentId || record.razorpay_payment_id || 'N/A',
      payment_status: 'PAID',
    };

    const sheetResult = await postToSheetsWebhook(sheetsWebhookUrl, payload);
    if (sheetResult.ok) {
      if (supabase && record.id) {
        await supabase
          .from('registrations')
          .update({ synced_to_sheets: true, updated_at: new Date().toISOString() })
          .eq('id', record.id);
      }
      return true;
    }
    console.warn('Sheets reconciliation webhook error:', sheetResult.status, sheetResult.error);
  } catch (err) {
    console.error('Sheets reconciliation exception:', err.message);
  }

  return false;
}

export default async function handler(req, res) {
  applyCors(req, res, 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = checkRateLimit(req, 'reg-status', 60, 60_000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many status requests. Please wait a moment.' });
  }

  const orderId = clampString(req.query?.order_id, 80);
  const paymentId = clampString(req.query?.payment_id, 80);
  const token = clampString(req.query?.token, 128);

  if (!orderId || !paymentId) {
    return res.status(400).json({ verified: false, error: 'Missing order_id or payment_id.' });
  }

  try {
    // 1. Primary source of truth: verified paid record in Supabase
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: record, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .eq('razorpay_payment_id', paymentId)
        .eq('payment_status', 'paid')
        .maybeSingle();

      // Handle fallback if optional columns aren't migrated yet
      let verifiedRecord = record;
      if (error && (error.code === 'PGRST204' || /column|schema cache/i.test(String(error.message || '')))) {
        const retry = await supabase
          .from('registrations')
          .select(
            'id, participant_name, email, phone, college, event_name, team_name, team_members, amount, razorpay_order_id, razorpay_payment_id, payment_status, synced_to_sheets'
          )
          .eq('razorpay_order_id', orderId)
          .eq('razorpay_payment_id', paymentId)
          .eq('payment_status', 'paid')
          .maybeSingle();
        verifiedRecord = retry.data || null;
      }

      if (verifiedRecord) {
        const sheetsSynced = await syncRecordToSheets(supabase, verifiedRecord, orderId, paymentId);
        const uniqueId = formatUniqueRegId(
          verifiedRecord.unique_id || verifiedRecord.id,
          verifiedRecord.event_name
        );
        return res.status(200).json({
          verified: true,
          sheetsSynced,
          registration: {
            uniqueId,
            orderId: verifiedRecord.razorpay_order_id,
            paymentId: verifiedRecord.razorpay_payment_id,
            eventName: verifiedRecord.event_name || 'Official Event',
            participantName: verifiedRecord.participant_name || '',
            teamName: verifiedRecord.team_name || '',
            amount: verifiedRecord.amount ?? '',
            theme: verifiedRecord.theme || '',
            accommodation: verifiedRecord.accommodation || '',
          },
        });
      }
    }

    // 2. Secondary check: Direct Razorpay API lookup & automatic reconciliation if callback was missed
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const payment = await razorpay.payments.fetch(paymentId);
        if (
          payment &&
          payment.order_id === orderId &&
          (payment.status === 'captured' || payment.status === 'authorized')
        ) {
          // Reconcile pending Supabase record and sync to Google Sheets
          if (supabase) {
            const { data: pendingRecord } = await supabase
              .from('registrations')
              .select('*')
              .eq('razorpay_order_id', orderId)
              .maybeSingle();

            if (pendingRecord) {
              const expectedFee = Number(pendingRecord.amount || 0);
              const amountMatches =
                expectedFee <= 0 || payment.amount === Math.round(expectedFee * 100);

              if (amountMatches) {
                const { data: updated, error: updateErr } = await updateRegistrationSafe(
                  supabase,
                  orderId,
                  {
                    payment_status: 'paid',
                    razorpay_payment_id: paymentId,
                    updated_at: new Date().toISOString(),
                  }
                );

                if (updateErr) {
                  console.error('Supabase reconciliation update error:', updateErr.message);
                }

                const reconciledRecord = updated || {
                  ...pendingRecord,
                  payment_status: 'paid',
                  razorpay_payment_id: paymentId,
                };

                const sheetsSynced = await syncRecordToSheets(
                  supabase,
                  reconciledRecord,
                  orderId,
                  paymentId
                );

                const uniqueId = formatUniqueRegId(
                  reconciledRecord.unique_id || reconciledRecord.id,
                  reconciledRecord.event_name
                );

                return res.status(200).json({
                  verified: true,
                  reconciled: true,
                  sheetsSynced,
                  registration: {
                    uniqueId,
                    orderId,
                    paymentId,
                    eventName: reconciledRecord.event_name || 'Official Event',
                    participantName: reconciledRecord.participant_name || '',
                    teamName: reconciledRecord.team_name || '',
                    amount: reconciledRecord.amount ?? Math.round(Number(payment.amount) / 100),
                    theme: reconciledRecord.theme || '',
                    accommodation: reconciledRecord.accommodation || '',
                  },
                });
              }
            }
          }

          const order = await razorpay.orders.fetch(orderId);
          const notes = order?.notes || {};
          const eventName = notes.eventName || 'Official Event';
          const uniqueId = formatUniqueRegId(null, eventName, orderId.slice(-6));

          return res.status(200).json({
            verified: true,
            registration: {
              uniqueId,
              orderId,
              paymentId,
              eventName,
              participantName: notes.participantName || '',
              teamName: notes.teamName || '',
              amount: payment.amount ? Math.round(Number(payment.amount) / 100) : '',
              theme: notes.theme || '',
              accommodation: notes.accommodation || '',
            },
          });
        }
      } catch (rzpErr) {
        console.warn('Razorpay status verification lookup failed:', rzpErr.message);
      }
    }

    // 3. Cryptographic pass token issued right after verify-payment succeeded
    if (token && verifyPassToken(orderId, paymentId, token)) {
      return res.status(200).json({
        verified: true,
        registration: {
          orderId,
          paymentId,
        },
      });
    }

    return res.status(404).json({
      verified: false,
      error: 'No verified paid registration found for this Order ID and Payment ID.',
    });
  } catch (err) {
    console.error('Registration status error:', err);
    return res.status(500).json({
      verified: false,
      error: 'Unable to verify registration status right now.',
    });
  }
}
