import { getSupabaseAdmin, signPassToken } from './_lib/security.js';

export default async function handler(req, res) {
  const secret = req.query.key || req.headers['x-admin-key'];
  if (secret !== 'spectrum_admin_2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const queryTerm = req.query.q || 'Terra';

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase admin client not initialized' });
    }

    // 1. Search in team_name
    let { data: records, error } = await supabase
      .from('registrations')
      .select('*')
      .ilike('team_name', `%${queryTerm}%`);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // 2. If no records, search participant_name
    if (!records || records.length === 0) {
      const { data: pRecords, error: pError } = await supabase
        .from('registrations')
        .select('*')
        .ilike('participant_name', `%${queryTerm}%`);

      if (!pError && pRecords && pRecords.length > 0) {
        records = pRecords;
      }
    }

    // 3. Fallback: return recent registrations if none found
    let recent = null;
    if (!records || records.length === 0) {
      const { data: rRecords } = await supabase
        .from('registrations')
        .select('id, participant_name, team_name, event_name, razorpay_order_id, razorpay_payment_id, payment_status, created_at')
        .order('created_at', { ascending: false })
        .limit(20);
      recent = rRecords;
    }

    const results = (records || []).map((reg) => {
      const orderId = reg.razorpay_order_id || '';
      const paymentId = reg.razorpay_payment_id || '';
      const token = signPassToken(orderId, paymentId);

      const params = new URLSearchParams({
        order_id: orderId,
        event: reg.event_name || '',
        payment_id: paymentId,
        name: reg.participant_name || '',
        team: reg.team_name || '',
        theme: reg.theme || '',
        amount: String(reg.amount || ''),
        reg_id: reg.id || '',
        unique_id: reg.unique_id || '',
        token: token,
      });

      return {
        record: reg,
        shareable_link: `https://spectrum10.vercel.app/registration-success?${params.toString()}`,
      };
    });

    return res.status(200).json({
      success: true,
      query: queryTerm,
      count: results.length,
      results,
      recentIfNotFound: recent,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
