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
  signPassToken,
  updateRegistrationSafe,
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
  } catch (err) {
    console.error('Sheets sync error during pass retrieval:', err?.message || err);
  }
  return false;
}

export default async function handler(req, res) {
  applyCors(req, res, 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting: 25 requests per minute per IP
  const limit = checkRateLimit(req, 'retrieve-pass', 25, 60_000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const rawInput =
    req.method === 'POST'
      ? req.body?.email || req.body?.query || ''
      : req.query?.email || req.query?.query || '';

  const query = clampString(rawInput, 120).trim().toLowerCase();

  if (!query || query.length < 3) {
    return res.status(400).json({
      error: 'Please enter a valid Team Leader email address or registered mobile number.',
    });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: 'Database service is currently unreachable.' });
  }

  try {
    // Digits only version for phone lookup
    const digits = query.replace(/\D/g, '');

    // Search by email, phone, or team_name
    let builder = supabase.from('registrations').select('*');

    if (query.includes('@')) {
      builder = builder.ilike('email', `%${query}%`);
    } else if (digits.length >= 6) {
      builder = builder.ilike('phone', `%${digits}%`);
    } else {
      builder = builder.or(`email.ilike.%${query}%,team_name.ilike.%${query}%`);
    }

    const { data: records, error } = await builder.order('created_at', { ascending: false }).limit(5);

    if (error) {
      console.error('Supabase query error in retrieve-pass:', error?.message || error);
      return res.status(500).json({ error: 'Failed to search registrations: ' + (error?.message || '') });
    }

    if (!records || records.length === 0) {
      return res.status(404).json({
        found: false,
        message: 'No registration found matching this email or phone. Please verify your details or register below.',
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let razorpay = null;
    if (keyId && keySecret) {
      try {
        razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      } catch (rzpErr) {
        console.warn('Razorpay init warning in retrieve-pass:', rzpErr?.message);
      }
    }

    const results = [];

    for (const record of records) {
      let isPaid = String(record.payment_status || '').toLowerCase() === 'paid';
      let orderId = record.razorpay_order_id || '';
      let paymentId = record.razorpay_payment_id || '';

      // Auto-reconciliation: If record is still pending but has an order, check Razorpay directly
      if (!isPaid && orderId && razorpay) {
        try {
          const orderPayments = await razorpay.orders.fetchPayments(orderId);
          const capturedPayment = orderPayments?.items?.find(
            (p) => p.status === 'captured' || p.status === 'authorized'
          );

          if (capturedPayment) {
            paymentId = capturedPayment.id;
            isPaid = true;

            // Update Supabase to paid
            await updateRegistrationSafe(supabase, orderId, {
              payment_status: 'paid',
              razorpay_payment_id: paymentId,
              updated_at: new Date().toISOString(),
            });

            record.payment_status = 'paid';
            record.razorpay_payment_id = paymentId;

            // Sync to sheets reliably before responding
            await syncRecordToSheets(supabase, record, orderId, paymentId);
          }
        } catch (rzpFetchErr) {
          console.warn('Razorpay order payments fetch error in retrieve-pass:', rzpFetchErr?.message);
        }
      }

      const eventName = record.event_name || 'Official Event';
      const uniqueId = formatUniqueRegId(record.unique_id || record.id, eventName);

      let passUrl = null;
      if (isPaid && orderId && paymentId) {
        const token = signPassToken(orderId, paymentId);
        const params = new URLSearchParams({
          order_id: orderId,
          event: eventName,
          payment_id: paymentId,
          name: record.participant_name || '',
          team: record.team_name || '',
          theme: record.theme || '',
          amount: String(record.amount || ''),
          reg_id: record.id || '',
          unique_id: uniqueId,
          token: token,
        });
        passUrl = `/registration-success?${params.toString()}`;
      }

      results.push({
        id: record.id,
        uniqueId,
        eventName,
        participantName: record.participant_name || '',
        teamName: record.team_name || '',
        theme: record.theme || '',
        college: record.college || '',
        amount: record.amount || 0,
        paymentStatus: isPaid ? 'paid' : 'pending',
        passUrl,
        createdAt: record.created_at,
      });
    }

    return res.status(200).json({
      found: true,
      count: results.length,
      passes: results,
    });
  } catch (err) {
    console.error('Unexpected exception in retrieve-pass:', err);
    return res.status(500).json({ error: 'An unexpected error occurred while retrieving your pass.' });
  }
}
