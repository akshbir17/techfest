import crypto from 'crypto';
import Razorpay from 'razorpay';
import { getEventConfig, formatUniqueRegId } from './_lib/events.js';
import {
  applyCors,
  checkRateLimit,
  clampString,
  getSupabaseAdmin,
  insertRegistrationSafe,
} from './_lib/security.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+91|0)?[6-9]\d{9}$/;

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = checkRateLimit(req, 'create-order', 20, 60_000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  try {
    const {
      name,
      email,
      phone,
      college,
      eventId,
      teamName = null,
      theme = null,
      accommodation = null,
      members = [],
    } = req.body || {};

    // 1. Validate and sanitize required participant fields
    if (!name || !email || !phone || !college || !eventId) {
      return res.status(400).json({ error: 'Missing required participant fields (name, email, phone, college, eventId).' });
    }

    const trimmedName = clampString(name, 120);
    const trimmedEmail = clampString(email, 160).toLowerCase();
    const trimmedPhone = clampString(String(phone).replace(/[\s-]+/g, ''), 20);
    const trimmedCollege = clampString(college, 200);
    const cleanEventId = clampString(eventId, 50).toLowerCase();

    if (!trimmedName || !trimmedCollege) {
      return res.status(400).json({ error: 'Participant name and college cannot be empty.' });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email address provided.' });
    }

    if (!PHONE_REGEX.test(trimmedPhone)) {
      return res.status(400).json({ error: 'Invalid 10-digit Indian mobile number provided.' });
    }

    // 2. Authoritative event lookup & price calculation on backend
    const eventConfig = getEventConfig(cleanEventId);
    if (!eventConfig) {
      return res.status(400).json({ error: 'Selected event is not recognized in official event catalog.' });
    }

    const cleanTeamName = teamName ? clampString(teamName, 100) : null;
    if (eventConfig.type === 'team' && !cleanTeamName) {
      return res.status(400).json({ error: 'Team name is required for team events.' });
    }

    const cleanMembers = Array.isArray(members)
      ? members
          .slice(0, 6)
          .filter((m) => m && typeof m === 'object' && clampString(m.name, 120))
          .map((m) => ({
            name: clampString(m.name, 120),
            phone: clampString(String(m.phone || '').replace(/[\s-]+/g, ''), 20),
          }))
      : [];

    for (const member of cleanMembers) {
      if (member.phone && !PHONE_REGEX.test(member.phone)) {
        return res.status(400).json({ error: `Invalid phone number for team member '${member.name}'.` });
      }
    }

    const verifiedFee = eventConfig.fee;
    const officialEventName = eventConfig.name;
    const eventType = eventConfig.type;
    const amountInPaise = Math.round(verifiedFee * 100);
    const cleanTheme = clampString(theme, 160) || 'General';
    const cleanAccommodation =
      clampString(accommodation, 40) || (cleanEventId.includes('hackathon') ? 'Yes' : 'N/A');

    // 3. Initialize Razorpay SDK
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: 'Payment gateway is temporarily unavailable.' });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // 4. Create Razorpay Order
    const shortReceipt = `spec_${cleanEventId.slice(0, 4)}_${Date.now().toString().slice(-6)}`;
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: shortReceipt,
      notes: {
        eventId: cleanEventId,
        eventName: officialEventName,
        participantName: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        college: trimmedCollege,
        type: eventType,
        teamName: cleanTeamName || '',
        theme: cleanTheme,
        accommodation: cleanAccommodation,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Authoritative Unique Registration ID persisted upfront
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const uniqueRegId = formatUniqueRegId(null, officialEventName, randomSuffix);

    // 5. Store pending registration record in Supabase
    let registrationId = uniqueRegId;
    const supabase = getSupabaseAdmin();

    if (supabase) {
      try {
        const recordPayload = {
          unique_id: uniqueRegId,
          participant_name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          college: trimmedCollege,
          event_id: cleanEventId,
          event_name: officialEventName,
          team_name: cleanTeamName,
          team_members: cleanMembers.length > 0 ? cleanMembers : null,
          amount: verifiedFee,
          theme: cleanTheme,
          accommodation: cleanAccommodation,
          razorpay_order_id: order.id,
          razorpay_payment_id: null,
          payment_status: 'pending',
          synced_to_sheets: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: inserted, error: dbErr } = await insertRegistrationSafe(supabase, recordPayload);

        if (dbErr) {
          console.error('Supabase pending registration error:', dbErr.message);
        } else if (inserted && inserted.id) {
          registrationId = inserted.unique_id || formatUniqueRegId(inserted.id, officialEventName);
        }
      } catch (dbEx) {
        console.error('Supabase client exception:', dbEx.message);
      }
    } else {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not configured; skipping pending DB record.');
    }

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
      registrationId: registrationId,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      error: 'Failed to initialize payment order. Please try again.',
    });
  }
}
