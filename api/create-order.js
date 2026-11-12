import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Server-side authoritative event catalog and pricing (never trust frontend amount)
const EVENT_CATALOG = {
  // Individual Events
  'impossible_to_sell': { name: 'Impossible to Sell', fee: 100, type: 'individual' },
  'mock_interview':     { name: 'Mock Interview', fee: 100, type: 'individual' },
  'killer_game':        { name: 'Killer Game', fee: 50, type: 'individual' },
  'photo_booth':        { name: 'Photography', fee: 100, type: 'individual' },
  'photography':        { name: 'Photography', fee: 100, type: 'individual' },
  // Team Events
  'hackathon':          { name: '24-Hour Hackathon', fee: 1, type: 'team' },
  'tech_quiz':          { name: 'TechQuiz', fee: 300, type: 'team' },
  'bgmi':               { name: 'BGMI Tournament', fee: 400, type: 'team' },
  'free_fire':          { name: 'Free Fire Tournament', fee: 400, type: 'team' },
  'treasure_hunt':      { name: 'Treasure Hunt', fee: 600, type: 'team' },
};

export default async function handler(req, res) {
  // Security CORS headers
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
      teamName = null,
      theme = null,
      accommodation = null,
      members = [],
    } = req.body || {};

    // 1. Validate required participant fields
    if (!name || !email || !phone || !college || !eventId) {
      return res.status(400).json({ error: 'Missing required participant fields (name, email, phone, college, eventId).' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPhone = String(phone).replace(/\s/g, '').trim();
    const trimmedCollege = String(college).trim();
    const cleanEventId = String(eventId).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email address provided.' });
    }

    // 2. Authoritative event lookup & price calculation on backend
    const eventConfig = EVENT_CATALOG[cleanEventId];
    if (!eventConfig) {
      return res.status(400).json({ error: `Event '${cleanEventId}' is not recognized in official event catalog.` });
    }

    const verifiedFee = eventConfig.fee;
    const officialEventName = eventConfig.name;
    const eventType = eventConfig.type;
    const amountInPaise = Math.round(verifiedFee * 100);

    // 3. Initialize Razorpay SDK
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({
        error: 'Razorpay keys not configured on server. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in Vercel.',
      });
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
        teamName: teamName ? String(teamName).trim() : '',
        theme: theme ? String(theme).trim() : '',
        accommodation: accommodation ? String(accommodation).trim() : '',
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Generate unique alphanumeric Registration ID (e.g. SPEC-HACK-8F2A7B)
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const eventPrefix = cleanEventId.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase();
    const uniqueRegId = `SPEC-${eventPrefix}-${randomSuffix}`;

    // 5. Store pending registration record in Supabase
    let registrationId = uniqueRegId;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const cleanMembers = Array.isArray(members)
          ? members.filter((m) => m && m.name && m.name.trim()).map((m) => ({
              name: String(m.name).trim(),
              phone: String(m.phone || '').trim(),
            }))
          : [];

        const recordPayload = {
          participant_name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          college: trimmedCollege,
          event_id: cleanEventId,
          event_name: officialEventName,
          team_name: teamName ? String(teamName).trim() : null,
          team_members: cleanMembers.length > 0 ? cleanMembers : null,
          amount: verifiedFee,
          theme: theme ? String(theme).trim() : (cleanEventId.includes('hackathon') ? 'General' : null),
          accommodation: accommodation ? String(accommodation).trim() : (cleanEventId.includes('hackathon') ? 'Yes' : 'N/A'),
          razorpay_order_id: order.id,
          razorpay_payment_id: null,
          payment_status: 'pending',
          synced_to_sheets: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: inserted, error: dbErr } = await supabase
          .from('registrations')
          .insert([recordPayload])
          .select('id')
          .single();

        if (dbErr) {
          console.error('Supabase pending registration error:', dbErr.message);
        } else if (inserted && inserted.id) {
          registrationId = inserted.id;
        }
      } catch (dbEx) {
        console.error('Supabase client exception:', dbEx.message);
      }
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
      error: error.message || 'Failed to initialize payment order',
    });
  }
}
