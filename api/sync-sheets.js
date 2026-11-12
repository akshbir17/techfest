import {
  formatTeamMembers,
  formatUniqueRegId,
  isTeamEventName,
  postToSheetsWebhook,
} from './_lib/events.js';
import {
  applyCors,
  checkRateLimit,
  getSupabaseAdmin,
  timingSafeMatch,
} from './_lib/security.js';

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST with admin authorization.' });
  }

  const limit = checkRateLimit(req, 'sync-sheets', 10, 60_000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many sync requests. Please wait a minute.' });
  }

  const adminSecret = process.env.ADMIN_SYNC_SECRET;
  if (!adminSecret) {
    return res.status(503).json({ error: 'Admin sync endpoint is not enabled (ADMIN_SYNC_SECRET unset).' });
  }

  const authHeader = String(req.headers?.authorization || '');
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!bearerToken || !timingSafeMatch(bearerToken, adminSecret)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const sheetsSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || '';
  const supabase = getSupabaseAdmin();

  if (!sheetsWebhookUrl) {
    return res.status(500).json({ error: 'Google Sheets webhook URL is not configured on server.' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase admin credentials are not configured on server.' });
  }

  try {
    // Sync unsynced paid rows (or all paid rows if ?all=true / { all: true })
    const syncAll = req.query?.all === 'true' || req.body?.all === true;
    let query = supabase.from('registrations').select('*').eq('payment_status', 'paid');
    if (!syncAll) {
      query = query.eq('synced_to_sheets', false);
    }

    const { data: records, error } = await query;
    if (error) {
      console.error('Supabase sync query error:', error.message);
      return res.status(500).json({ error: 'Failed to query registrations for sync.' });
    }

    if (!records || records.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending records to sync. All paid registrations are already synced.',
        count: 0,
      });
    }

    const results = [];
    for (const record of records) {
      const eventName = record.event_name || '';
      const membersFormatted = formatTeamMembers(record.team_members);
      const uniqueRegId = formatUniqueRegId(record.unique_id || record.id, eventName);
      const rawTeamName = record.team_name || 'N/A';
      const isTeamEvent = isTeamEventName(eventName, rawTeamName);

      const payload = {
        secret: sheetsSecret,
        registration_id: uniqueRegId,
        order_id: record.razorpay_order_id || record.id || 'N/A',
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
        razorpay_payment_id: record.razorpay_payment_id || 'N/A',
        payment_status: 'PAID',
      };

      try {
        const sheetResult = await postToSheetsWebhook(sheetsWebhookUrl, payload);

        if (sheetResult.ok) {
          await supabase
            .from('registrations')
            .update({ synced_to_sheets: true })
            .eq('id', record.id);
          results.push({ regId: uniqueRegId, status: 'synced' });
        } else {
          results.push({ regId: uniqueRegId, status: sheetResult.error || `http_${sheetResult.status}` });
        }
      } catch (fetchErr) {
        console.error('Sheets webhook sync failure for', uniqueRegId, fetchErr.message);
        results.push({ regId: uniqueRegId, status: 'failed' });
      }
    }

    return res.status(200).json({
      success: true,
      total: records.length,
      syncedCount: results.filter((r) => r.status === 'synced').length,
      results,
    });
  } catch (err) {
    console.error('Sync sheets error:', err);
    return res.status(500).json({ error: 'Internal server error during sheets sync.' });
  }
}
