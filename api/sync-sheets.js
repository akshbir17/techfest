import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const sheetsSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || '';
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!sheetsWebhookUrl) {
    return res.status(500).json({ error: 'GOOGLE_SHEETS_WEBHOOK_URL is not configured in Vercel environment variables.' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials not configured on server.' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sync unsynced paid rows (or all paid rows if ?all=true)
    const syncAll = req.query?.all === 'true';
    let query = supabase.from('registrations').select('*').eq('payment_status', 'paid');
    if (!syncAll) {
      query = query.eq('synced_to_sheets', false);
    }

    const { data: records, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!records || records.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending records to sync. All paid registrations are already in Google Sheets!',
        count: 0,
      });
    }

    const results = [];
    for (const record of records) {
      let membersFormatted = 'N/A';
      if (Array.isArray(record.team_members) && record.team_members.length > 0) {
        membersFormatted = record.team_members
          .map((m, i) => {
            if (typeof m === 'string') return m;
            let phoneStr = '';
            if (m.phone) {
              const clean = String(m.phone).trim();
              phoneStr = clean.startsWith('+91') ? clean : `+91 ${clean.replace(/^0+/, '')}`;
            }
            return `${m.name || `Member ${i + 2}`}${phoneStr ? ` (${phoneStr})` : ''}`;
          })
          .join(', ');
      }

      const eventName = record.event_name || '';
      const eventPrefix = String(eventName).replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SPEC';
      const rawRegId = record.id || '';
      const uniqueRegId = rawRegId && String(rawRegId).startsWith('SPEC-')
        ? rawRegId
        : `SPEC-${eventPrefix}-${(rawRegId ? String(rawRegId).replace(/-/g, '').slice(0, 6) : Date.now().toString(36)).toUpperCase()}`;

      const rawTeamName = record.team_name || 'N/A';
      const isTeamEvent = Boolean(
        rawTeamName &&
        rawTeamName !== 'N/A' &&
        !String(eventName).toLowerCase().includes('impossible') &&
        !String(eventName).toLowerCase().includes('killer') &&
        !String(eventName).toLowerCase().includes('photo')
      );

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
        accommodation: record.accommodation || (String(eventName).toLowerCase().includes('hackathon') ? 'Yes' : 'N/A'),
        team_name: isTeamEvent ? String(rawTeamName).trim() : 'N/A',
        team_members: isTeamEvent ? membersFormatted : 'N/A',
        amount_paid: Number(record.amount || record.fee || 0),
        razorpay_payment_id: record.razorpay_payment_id || 'N/A',
        payment_status: 'PAID',
      };

      try {
        const sheetRes = await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });

        if (sheetRes.ok) {
          await supabase
            .from('registrations')
            .update({ synced_to_sheets: true })
            .eq('id', record.id);
          results.push({ id: record.id, status: 'synced', participant: record.participant_name });
        } else {
          const respText = await sheetRes.text().catch(() => '');
          results.push({ id: record.id, status: 'failed', httpStatus: sheetRes.status, response: respText });
        }
      } catch (err) {
        results.push({ id: record.id, status: 'error', error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Sync operation completed. Synced ${results.filter((r) => r.status === 'synced').length} of ${records.length} registrations.`,
      results,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

