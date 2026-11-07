import crypto from 'crypto';
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
      return res.status(400).json({ error: 'Missing payment verification credentials' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ error: 'Razorpay secret key not configured on server' });
    }

    // 1. Verify HMAC SHA256 signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' });
    }

    // 2. Update or Upsert in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    let savedToSupabase = false;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: existing } = await supabase
          .from('registrations')
          .select('id')
          .eq('razorpay_order_id', razorpay_order_id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('registrations')
            .update({
              razorpay_payment_id,
              payment_status: 'paid',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpay_order_id);
        } else if (registrationData) {
          await supabase.from('registrations').insert([
            {
              event_id: registrationData.eventId,
              event_name: registrationData.eventName,
              participation_type: registrationData.type || 'individual',
              name: registrationData.name,
              email: registrationData.email,
              phone: registrationData.phone,
              college: registrationData.college,
              team_name: registrationData.teamName || null,
              team_members: registrationData.members || null,
              fee: Number(registrationData.fee || 0),
              razorpay_order_id,
              razorpay_payment_id,
              payment_status: 'paid',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
        }
        savedToSupabase = true;
      } catch (dbErr) {
        console.error('Supabase registration update error:', dbErr);
      }
    }

    // 3. Sync to Google Sheets via Webhook (Google Apps Script)
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let savedToSheets = false;

    if (sheetsWebhookUrl && registrationData) {
      try {
        const membersList = Array.isArray(registrationData.members)
          ? registrationData.members
              .map((m, i) => {
                if (typeof m === 'string') return m;
                return `${m.name || `Member ${i + 1}`}${m.phone ? ` (${m.phone})` : ''}`;
              })
              .join(', ')
          : '';

        const payload = {
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          eventId: registrationData.eventId || '',
          eventName: registrationData.eventName || '',
          type: registrationData.type || 'individual',
          name: registrationData.name || '',
          email: registrationData.email || '',
          phone: registrationData.phone || '',
          college: registrationData.college || '',
          teamName: registrationData.teamName || 'N/A',
          members: membersList || 'N/A',
          fee: registrationData.fee || 0,
          status: 'PAID',
        };

        const sheetRes = await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (sheetRes.ok) {
          savedToSheets = true;
        }
      } catch (sheetErr) {
        console.error('Google Sheets sync error:', sheetErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and registration recorded successfully',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      savedToSupabase,
      savedToSheets,
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
}

