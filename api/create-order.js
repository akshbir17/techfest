import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
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
      name,
      email,
      phone,
      college,
      eventId,
      eventName,
      fee,
      type = 'individual',
      teamName = null,
      members = [],
    } = req.body || {};

    if (!name || !email || !phone || !college || !eventId || fee === undefined) {
      return res.status(400).json({ error: 'Missing required participant fields' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({
        error: 'Razorpay keys not configured on server. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(Number(fee) * 100);
    const shortReceipt = `rcpt_${Date.now().toString().slice(-6)}_${Math.floor(Math.random() * 1000)}`;

    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: shortReceipt,
      notes: {
        eventId: String(eventId),
        eventName: String(eventName),
        name: String(name),
        email: String(email),
        phone: String(phone),
        college: String(college),
        type: String(type),
        teamName: teamName ? String(teamName) : '',
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // If Supabase is configured, record pending registration
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('registrations').insert([
          {
            event_id: eventId,
            event_name: eventName,
            participation_type: type,
            name: name,
            email: email,
            phone: phone,
            college: college,
            team_name: teamName || null,
            team_members: members && members.length > 0 ? members : null,
            fee: Number(fee),
            razorpay_order_id: order.id,
            payment_status: 'pending',
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn('Supabase insert warning:', dbErr?.message || dbErr);
        // Do not block checkout if DB insert fails; verified record will be handled in verify-payment
      }
    }

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create payment order',
    });
  }
}
