import Razorpay from 'razorpay';
import { formatUniqueRegId } from './_lib/events.js';
import {
  applyCors,
  checkRateLimit,
  clampString,
  getSupabaseAdmin,
  verifyPassToken,
} from './_lib/security.js';

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
        .select(
          'id, unique_id, participant_name, event_name, team_name, amount, theme, accommodation, razorpay_order_id, razorpay_payment_id, payment_status'
        )
        .eq('razorpay_order_id', orderId)
        .eq('razorpay_payment_id', paymentId)
        .eq('payment_status', 'paid')
        .maybeSingle();

      // Handle fallback if unique_id column wasn't migrated on live Supabase yet
      let verifiedRecord = record;
      if (error && /unique_id/i.test(String(error.message || ''))) {
        const retry = await supabase
          .from('registrations')
          .select(
            'id, participant_name, event_name, team_name, amount, razorpay_order_id, razorpay_payment_id, payment_status'
          )
          .eq('razorpay_order_id', orderId)
          .eq('razorpay_payment_id', paymentId)
          .eq('payment_status', 'paid')
          .maybeSingle();
        verifiedRecord = retry.data || null;
      }

      if (verifiedRecord) {
        const uniqueId = formatUniqueRegId(
          verifiedRecord.unique_id || verifiedRecord.id,
          verifiedRecord.event_name
        );
        return res.status(200).json({
          verified: true,
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

    // 2. Secondary check: Direct Razorpay API lookup (if DB missed or unavailable)
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

