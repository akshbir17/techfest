import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  // Allow CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, college, eventId, eventName, fee } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !college || !eventId || !fee) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:5173';
  const isProduction = process.env.NODE_ENV === 'production';
  const cashfreeBase = isProduction
    ? 'https://api.cashfree.com'
    : 'https://sandbox.cashfree.com';

  if (!appId || !secretKey) {
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }

  // Generate a unique order ID
  const orderId = `SPEC_${eventId.toUpperCase()}_${randomUUID().slice(0, 8).toUpperCase()}`;

  try {
    const response = await fetch(`${cashfreeBase}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: fee,
        order_currency: 'INR',
        customer_details: {
          customer_id: email.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 50),
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
        },
        order_meta: {
          return_url: `${siteUrl}/registration-success?order_id={order_id}&event=${encodeURIComponent(eventName)}`,
          notify_url: `${siteUrl}/api/cashfree-webhook`,
        },
        order_note: `Spectrum 1.0 Registration - ${eventName} | College: ${college}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree error:', data);
      return res.status(response.status).json({ error: data.message || 'Payment order creation failed' });
    }

    return res.status(200).json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
