import crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  formatTeamMembers,
  formatUniqueRegId,
  getEventConfig,
  isTeamEventName,
  postToSheetsWebhook,
} from './_lib/events.js';
import {
  applyCors,
  checkRateLimit,
  clampString,
  getSupabaseAdmin,
  insertRegistrationSafe,
  signPassToken,
  timingSafeMatch,
  updateRegistrationSafe,
} from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = checkRateLimit(req, 'verify-payment', 30, 60_000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many verification attempts. Please wait a moment.' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationData,
    } = req.body || {};

    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_signature !== 'string' ||
      !razorpay_order_id.trim() ||
      !razorpay_payment_id.trim() ||
      !razorpay_signature.trim()
    ) {
      return res.status(400).json({ error: 'Missing required payment verification parameters.' });
    }

    const orderId = razorpay_order_id.trim();
    const paymentId = razorpay_payment_id.trim();
    const signature = razorpay_signature.trim();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(500).json({ error: 'Payment gateway secret is not configured on server.' });
    }

    // 1. Cryptographic HMAC SHA256 Signature Verification (constant-time)
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (!timingSafeMatch(generatedSignature, signature)) {
      return res.status(400).json({ error: 'Payment signature verification failed. Tampering detected.' });
    }

    // 2. Fetch Payment from Razorpay API to verify status, order association & amount
    let fetchedPayment = null;
    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        fetchedPayment = await razorpay.payments.fetch(paymentId);

        if (fetchedPayment.order_id !== orderId) {
          return res.status(400).json({ error: 'Payment does not belong to the referenced order ID.' });
        }

        if (fetchedPayment.status !== 'captured' && fetchedPayment.status !== 'authorized') {
          return res.status(400).json({ error: `Payment is not in a valid paid state (status: ${fetchedPayment.status}).` });
        }
      } catch (rzpErr) {
        console.error('Razorpay payment fetch check failed:', rzpErr.message);
      }
    }

    // Derive authoritative event config if provided, never trusting frontend fee alone
    const requestedEventId = clampString(registrationData?.eventId, 50).toLowerCase();
    const catalogEvent = getEventConfig(requestedEventId);

    // 3. Supabase Database Operations (Idempotent update)
    const supabase = getSupabaseAdmin();
    let registrationRecord = null;
    let alreadyProcessed = false;

    if (supabase) {
      const { data: existing } = await supabase
        .from('registrations')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .maybeSingle();

      if (existing) {
        registrationRecord = existing;

        if (existing.payment_status === 'paid' && existing.razorpay_payment_id === paymentId) {
          alreadyProcessed = true;
        } else {
          // Verify payment amount matches DB expected amount (or catalog fee)
          const authoritativeFee = Number(existing.amount || catalogEvent?.fee || 0);
          if (fetchedPayment && authoritativeFee > 0) {
            const expectedPaise = Math.round(authoritativeFee * 100);
            if (fetchedPayment.amount !== expectedPaise) {
              return res.status(400).json({ error: 'Paid amount does not match expected registration fee.' });
            }
          }

          const updatePayload = {
            payment_status: 'paid',
            razorpay_payment_id: paymentId,
            updated_at: new Date().toISOString(),
          };
          if (registrationData?.theme && !existing.theme) {
            updatePayload.theme = clampString(registrationData.theme, 160);
          }
          if (registrationData?.accommodation && !existing.accommodation) {
            updatePayload.accommodation = clampString(registrationData.accommodation, 40);
          }

          const { data: updated, error: updateErr } = await updateRegistrationSafe(
            supabase,
            orderId,
            updatePayload
          );

          if (updateErr) {
            console.error('Supabase paid update error:', updateErr.message);
          } else if (updated) {
            registrationRecord = updated;
          }
        }
      } else if (registrationData && typeof registrationData === 'object') {
        // Fallback: If pending record was missed, verify authoritative fee via catalog or Razorpay payment
        const authoritativeFee =
          catalogEvent?.fee ??
          (fetchedPayment && Number.isFinite(fetchedPayment.amount)
            ? Number(fetchedPayment.amount) / 100
            : 0);

        if (fetchedPayment && authoritativeFee > 0) {
          const expectedPaise = Math.round(authoritativeFee * 100);
          if (fetchedPayment.amount !== expectedPaise) {
            return res.status(400).json({ error: 'Paid amount does not match catalog registration fee.' });
          }
        }

        const officialEventName =
          catalogEvent?.name || clampString(registrationData.eventName, 120) || 'Spectrum Event';
        const fallbackUniqueId = formatUniqueRegId(
          null,
          officialEventName,
          crypto.randomBytes(3).toString('hex')
        );
        const cleanTheme = clampString(registrationData.theme, 160) || 'General';
        const cleanAccommodation =
          clampString(registrationData.accommodation, 40) ||
          (requestedEventId.includes('hackathon') ? 'Yes' : 'N/A');

        const { data: inserted, error: insertErr } = await insertRegistrationSafe(supabase, {
          unique_id: fallbackUniqueId,
          participant_name: clampString(registrationData.name, 120),
          email: clampString(registrationData.email, 160).toLowerCase(),
          phone: clampString(String(registrationData.phone || '').replace(/[\s-]+/g, ''), 20),
          college: clampString(registrationData.college, 200),
          event_id: requestedEventId || 'unknown',
          event_name: officialEventName,
          team_name: registrationData.teamName ? clampString(registrationData.teamName, 100) : null,
          team_members: Array.isArray(registrationData.members) ? registrationData.members.slice(0, 6) : null,
          amount: authoritativeFee,
          theme: cleanTheme,
          accommodation: cleanAccommodation,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          payment_status: 'paid',
          synced_to_sheets: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertErr) {
          console.error('Supabase fallback registration insert error:', insertErr.message);
        } else if (inserted) {
          registrationRecord = inserted;
        }
      }
    }

    // Generate or format authoritative Unique Registration ID
    const eventName =
      registrationRecord?.event_name ||
      catalogEvent?.name ||
      clampString(registrationData?.eventName, 120) ||
      '';
    const rawRegId =
      registrationRecord?.unique_id ||
      registrationRecord?.id ||
      registrationData?.registrationId ||
      '';
    const uniqueRegId = formatUniqueRegId(
      rawRegId,
      eventName,
      crypto.randomBytes(3).toString('hex')
    );

    // 4. Google Sheets Live Webhook Sync (with secret and exact JSON schema)
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const sheetsSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || '';
    let sheetsSynced = Boolean(registrationRecord?.synced_to_sheets);

    if (sheetsWebhookUrl && (!alreadyProcessed || !sheetsSynced)) {
      try {
        const participantName =
          registrationRecord?.participant_name ||
          registrationRecord?.name ||
          clampString(registrationData?.name, 120) ||
          '';
        const email =
          registrationRecord?.email || clampString(registrationData?.email, 160).toLowerCase() || '';
        const phone = registrationRecord?.phone || clampString(registrationData?.phone, 20) || '';
        const rawTeamName =
          registrationRecord?.team_name || clampString(registrationData?.teamName, 100) || 'N/A';
        const themeVal =
          registrationRecord?.theme || clampString(registrationData?.theme, 160) || null;
        const accommodationVal =
          registrationRecord?.accommodation ||
          clampString(registrationData?.accommodation, 40) ||
          (String(eventName).toLowerCase().includes('hackathon') ? 'Yes' : 'N/A');
        const amountPaid = Number(
          registrationRecord?.amount ||
            catalogEvent?.fee ||
            (fetchedPayment ? fetchedPayment.amount / 100 : 0)
        );

        const rawMembers = registrationRecord?.team_members || registrationData?.members;
        const membersFormatted = formatTeamMembers(rawMembers);
        const isTeamEvent = isTeamEventName(eventName, rawTeamName);
        const teamName = isTeamEvent ? String(rawTeamName).trim() : 'N/A';

        const sheetPayload = {
          secret: sheetsSecret,
          registration_id: uniqueRegId,
          order_id: orderId,
          participant_name: participantName,
          email: email,
          phone: phone,
          college: registrationRecord?.college || clampString(registrationData?.college, 200) || 'N/A',
          event_name: eventName,
          theme: themeVal || 'General',
          accommodation: accommodationVal,
          team_name: teamName,
          team_members: isTeamEvent ? membersFormatted : 'N/A',
          amount_paid: amountPaid,
          razorpay_payment_id: paymentId,
          payment_status: 'PAID',
        };

        const sheetResult = await postToSheetsWebhook(sheetsWebhookUrl, sheetPayload);

        if (sheetResult.ok) {
          sheetsSynced = true;

          if (supabase && registrationRecord?.id) {
            await supabase
              .from('registrations')
              .update({ synced_to_sheets: true })
              .eq('id', registrationRecord.id);
          }
        } else {
          console.warn('Google Sheets Webhook error:', sheetResult.status, sheetResult.error);
        }
      } catch (sheetErr) {
        console.error('Google Sheets sync exception:', sheetErr.message);
      }
    }

    const passToken = signPassToken(orderId, paymentId);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and registration confirmed successfully',
      registrationId: registrationRecord?.id || null,
      uniqueId: uniqueRegId,
      orderId: orderId,
      paymentId: paymentId,
      passToken: passToken,
      sheetsSynced: sheetsSynced,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: 'Payment verification encountered an internal server error.',
    });
  }
}
