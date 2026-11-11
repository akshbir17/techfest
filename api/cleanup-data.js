import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const secret = req.query.key || req.headers['x-admin-key'];
  if (secret !== 'spectrum_clean_2026') {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  const keyToUse = serviceKey || anonKey;

  // Let's decode token payload to see role
  let tokenRole = 'unknown';
  try {
    const parts = keyToUse.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      tokenRole = payload.role || 'no-role';
    }
  } catch (e) {
    tokenRole = 'decode-error: ' + e.message;
  }

  const supabase = createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const keepId = 'a90d37f7-4a91-432b-9884-e21c4773b79a';
  const keepOrderId = 'order_TyUjGyjd2SNicE';

  try {
    // If delete policy is missing and token is anon, we can also execute an RPC or test delete
    const { data: before } = await supabase.from('registrations').select('id, razorpay_order_id, participant_name');

    const toDeleteIds = before
      .filter((r) => r.id !== keepId && r.razorpay_order_id !== keepOrderId)
      .map((r) => r.id);

    // Try deleting one by one or in bulk
    const deleteRes = await supabase
      .from('registrations')
      .delete()
      .neq('id', keepId)
      .neq('razorpay_order_id', keepOrderId);

    // Fetch after
    const { data: after } = await supabase
      .from('registrations')
      .select('id, participant_name, razorpay_order_id, razorpay_payment_id');

    return res.status(200).json({
      tokenRole,
      hasServiceKey: !!serviceKey,
      beforeCount: before.length,
      toDeleteCount: toDeleteIds.length,
      deleteError: deleteRes.error ? deleteRes.error.message : null,
      afterCount: after.length,
      remaining: after,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, tokenRole });
  }
}
