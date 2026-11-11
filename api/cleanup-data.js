import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Allow secret key authorization or run with query param ?key=spectrum_clean_2026
  const secret = req.query.key || req.headers['x-admin-key'];
  if (secret !== 'spectrum_clean_2026') {
    return res.status(401).json({ error: 'Unauthorized. Provide valid key.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials missing on server.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const keepId = 'a90d37f7-4a91-432b-9884-e21c4773b79a';
  const keepOrderId = 'order_TyUjGyjd2SNicE';

  try {
    // 1. Fetch all records before cleanup
    const { data: beforeData, error: fetchErr } = await supabase
      .from('registrations')
      .select('*');

    if (fetchErr) {
      return res.status(500).json({ error: fetchErr.message });
    }

    const recordsToDelete = beforeData.filter(
      (r) => r.id !== keepId && r.razorpay_order_id !== keepOrderId
    );

    const recordsToKeep = beforeData.filter(
      (r) => r.id === keepId || r.razorpay_order_id === keepOrderId
    );

    const idsToDelete = recordsToDelete.map((r) => r.id);

    let deleteResult = null;
    if (idsToDelete.length > 0) {
      const { data: deleted, error: deleteErr } = await supabase
        .from('registrations')
        .delete()
        .in('id', idsToDelete)
        .select();

      if (deleteErr) {
        return res.status(500).json({ error: deleteErr.message, failedIds: idsToDelete });
      }
      deleteResult = deleted;
    }

    // 2. Fetch all records after cleanup
    const { data: afterData } = await supabase
      .from('registrations')
      .select('id, participant_name, email, phone, event_name, razorpay_order_id, razorpay_payment_id, payment_status, created_at');

    return res.status(200).json({
      success: true,
      message: `Cleared ${idsToDelete.length} records. Preserved ${recordsToKeep.length} record(s).`,
      deletedCount: idsToDelete.length,
      deletedRecords: recordsToDelete.map((r) => ({
        id: r.id,
        name: r.participant_name,
        order_id: r.razorpay_order_id,
        event: r.event_name,
      })),
      remainingCount: afterData?.length || 0,
      remainingRecords: afterData,
      googleSheetsWebhookConfigured: !!process.env.GOOGLE_SHEETS_WEBHOOK_URL,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
