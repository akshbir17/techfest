import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationData,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment verification parameters.' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(500).json({ error: 'Razorpay secret key not configured on server.' });
    }

    // 1. Cryptographic HMAC SHA256 Signature Verification
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment signature verification failed. Tampering detected.' });
    }

    // 2. Fetch Payment from Razorpay API to verify status and order association
    let fetchedPayment = null;
    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        fetchedPayment = await razorpay.payments.fetch(razorpay_payment_id);

        if (fetchedPayment.order_id !== razorpay_order_id) {
          return res.status(400).json({ error: 'Payment does not belong to the referenced order ID.' });
        }

        if (fetchedPayment.status !== 'captured' && fetchedPayment.status !== 'authorized') {
          return res.status(400).json({ error: `Payment is not in a valid paid state (status: ${fetchedPayment.status}).` });
        }
      } catch (rzpErr) {
        console.error('Razorpay payment fetch check failed:', rzpErr.message);
        // If API fails due to temporary network, HMAC signature was already cryptographically verified
      }
    }

    // 3. Supabase Database Operations (Idempotent update)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    let registrationRecord = null;
    let alreadyProcessed = false;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Check existing registration
      const { data: existing, error: fetchErr } = await supabase
        .from('registrations')
        .select('*')
        .eq('razorpay_order_id', razorpay_order_id)
        .maybeSingle();

      if (existing) {
        registrationRecord = existing;

        if (existing.payment_status === 'paid' && existing.razorpay_payment_id === razorpay_payment_id) {
          alreadyProcessed = true;
        } else {
          // Verify payment amount matches registered amount if available
          if (fetchedPayment && existing.amount) {
            const expectedPaise = Math.round(Number(existing.amount) * 100);
            if (fetchedPayment.amount !== expectedPaise) {
              return res.status(400).json({ error: 'Paid amount does not match expected registration fee.' });
            }
          }

          // Update record to paid
          const { data: updated, error: updateErr } = await supabase
            .from('registrations')
            .update({
              payment_status: 'paid',
              razorpay_payment_id: razorpay_payment_id,
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpay_order_id)
            .select()
            .single();

          if (!updateErr && updated) {
            registrationRecord = updated;
          }
        }
      } else if (registrationData) {
        // Fallback: If pending record was missed, insert verified record
        const { data: inserted, error: insertErr } = await supabase
          .from('registrations')
          .insert([
            {
              participant_name: registrationData.name,
              email: registrationData.email,
              phone: registrationData.phone,
              college: registrationData.college,
              event_id: registrationData.eventId,
              event_name: registrationData.eventName,
              team_name: registrationData.teamName || null,
              team_members: registrationData.members || null,
              amount: registrationData.fee || 0,
              razorpay_order_id: razorpay_order_id,
              razorpay_payment_id: razorpay_payment_id,
              payment_status: 'paid',
              synced_to_sheets: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (!insertErr && inserted) {
          registrationRecord = inserted;
        }
      }
    }

    // 4. Google Sheets Live Webhook Sync (with secret and exact JSON schema)
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const sheetsSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || '';
    let sheetsSynced = registrationRecord?.synced_to_sheets || false;

    if (sheetsWebhookUrl && (!alreadyProcessed || !sheetsSynced)) {
      try {
        const participantName = registrationRecord?.participant_name || registrationRecord?.name || registrationData?.name || '';
        const email = registrationRecord?.email || registrationData?.email || '';
        const phone = registrationRecord?.phone || registrationData?.phone || '';
        const eventName = registrationRecord?.event_name || registrationData?.eventName || '';
        const teamName = registrationRecord?.team_name || registrationData?.teamName || 'N/A';
        const amountPaid = Number(registrationRecord?.amount || registrationRecord?.fee || registrationData?.fee || 0);

        let membersFormatted = 'N/A';
        const rawMembers = registrationRecord?.team_members || registrationData?.members;
        if (Array.isArray(rawMembers) && rawMembers.length > 0) {
          membersFormatted = rawMembers
            .map((m, i) => {
              if (typeof m === 'string') return m;
              return `${m.name || `Member ${i + 2}`}${m.phone ? ` (${m.phone})` : ''}`;
            })
            .join(', ');
        }

        // Required JSON fields as requested by Apps Script specification
        const sheetPayload = {
          secret: sheetsSecret,
          registration_id: registrationRecord?.id || razorpay_order_id,
          participant_name: participantName,
          email: email,
          phone: phone,
          event_name: eventName,
          team_name: teamName,
          team_members: membersFormatted,
          amount_paid: amountPaid,
          razorpay_payment_id: razorpay_payment_id,
          payment_status: 'PAID',
        };

        const sheetResponse = await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload),
        });

        if (sheetResponse.ok) {
          sheetsSynced = true;

          // Mark synced in Supabase
          if (supabaseUrl && supabaseServiceKey && registrationRecord?.id) {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            await supabase
              .from('registrations')
              .update({ synced_to_sheets: true })
              .eq('id', registrationRecord.id);
          }
        } else {
          console.warn('Google Sheets Webhook non-200 response:', sheetResponse.status);
        }
      } catch (sheetErr) {
        console.error('Google Sheets sync exception:', sheetErr.message);
        // Do not fail the transaction; Supabase remains the primary source of truth
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and registration confirmed successfully',
      registrationId: registrationRecord?.id || null,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      sheetsSynced: sheetsSynced,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: error.message || 'Payment verification encountered an internal server error',
    });
  }
}
