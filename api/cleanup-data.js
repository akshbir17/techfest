import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const secret = req.query.key || req.headers['x-admin-key'];
  if (secret !== 'spectrum_clean_2026') {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let keyInfo = {
    length: serviceKey ? serviceKey.length : 0,
    prefix: serviceKey ? serviceKey.slice(0, 12) : null,
    suffix: serviceKey ? serviceKey.slice(-6) : null,
  };

  // Try direct fetch to Supabase PostgREST
  const keepId = 'a90d37f7-4a91-432b-9884-e21c4773b79a';

  // Let's do a direct fetch DELETE with apikey & Authorization
  const restUrl = `${supabaseUrl}/rest/v1/registrations?id=neq.${keepId}`;
  const deleteRes = await fetch(restUrl, {
    method: 'DELETE',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'return=representation',
    },
  });

  const deleteStatus = deleteRes.status;
  const deleteText = await deleteRes.text();

  // Now count again
  const countRes = await fetch(`${supabaseUrl}/rest/v1/registrations?select=id,participant_name,razorpay_order_id`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  const remaining = await countRes.json();

  return res.status(200).json({
    keyInfo,
    deleteStatus,
    deleteResponse: deleteText,
    remainingCount: Array.isArray(remaining) ? remaining.length : remaining,
    remaining,
  });
}
