import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = new Set([
  'https://spectrum10.vercel.app',
  'https://www.spectrum10.vercel.app',
]);

if (process.env.ALLOWED_ORIGIN) {
  process.env.ALLOWED_ORIGIN.split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .forEach((o) => ALLOWED_ORIGINS.add(o));
}

if (process.env.VERCEL_URL) {
  ALLOWED_ORIGINS.add(`https://${process.env.VERCEL_URL}`);
}

/**
 * Sets restrictive CORS headers on API routes while supporting same-origin and local dev.
 */
export function applyCors(req, res, methods = 'POST, OPTIONS') {
  const origin = req.headers?.origin;
  const isLocalDev =
    process.env.NODE_ENV !== 'production' &&
    typeof origin === 'string' &&
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  if (origin && (ALLOWED_ORIGINS.has(origin) || isLocalDev)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

// Per-instance sliding-window rate limiter (mitigates bursts on warm Vercel containers;
// pair with Upstash Redis / Vercel WAF for strict multi-region throttling).
const rateLimitStore = new Map();

export function checkRateLimit(req, keyPrefix, maxRequests = 20, windowMs = 60_000) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const clientIp =
    (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
    req.headers?.['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';

  const key = `${keyPrefix}:${clientIp}`;
  const now = Date.now();
  const timestamps = (rateLimitStore.get(key) || []).filter((ts) => now - ts < windowMs);

  if (timestamps.length >= maxRequests) {
    rateLimitStore.set(key, timestamps);
    return { allowed: false, retryAfterSec: Math.ceil((windowMs - (now - timestamps[0])) / 1000) };
  }

  timestamps.push(now);
  rateLimitStore.set(key, timestamps);

  // Opportunistic cleanup to keep map bounded
  if (rateLimitStore.size > 2000) {
    for (const [k, vals] of rateLimitStore.entries()) {
      if (vals.length === 0 || now - vals[vals.length - 1] >= windowMs) {
        rateLimitStore.delete(k);
      }
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Returns an authoritative Supabase admin client using ONLY the server-side service role key.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function clampString(value, maxLen = 200) {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, maxLen);
}

export function timingSafeMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function signPassToken(orderId, paymentId) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId) return '';
  return crypto
    .createHmac('sha256', secret)
    .update(`pass|${orderId}|${paymentId}`)
    .digest('hex');
}

export function verifyPassToken(orderId, paymentId, token) {
  if (!orderId || !paymentId || !token) return false;
  const expected = signPassToken(orderId, paymentId);
  if (!expected) return false;
  return timingSafeMatch(expected, String(token).trim());
}

const OPTIONAL_COLUMNS = ['unique_id', 'theme', 'accommodation'];

function extractMissingColumn(error) {
  const msg = String(error?.message || '');
  const pgrstMatch = msg.match(/Could not find the '([^']+)' column/i);
  if (pgrstMatch) return pgrstMatch[1];
  const pgMatch = msg.match(/column ["']?([a-zA-Z0-9_]+)["']?(?: of relation [^ ]+)? does not exist/i);
  if (pgMatch) return pgMatch[1];
  return null;
}

function isSchemaColumnError(error) {
  const msg = String(error?.message || '');
  return error?.code === 'PGRST204' || /column .* does not exist/i.test(msg) || /schema cache/i.test(msg);
}

/**
 * Resiliently inserts or updates a registration row even if optional columns
 * (unique_id, theme, accommodation) have not been migrated yet in live Supabase.
 */
async function executeWithColumnFallback(runQuery, payload) {
  let currentPayload = { ...payload };
  let selectCols = '*';

  for (let attempt = 0; attempt < 5; attempt++) {
    const result = await runQuery(currentPayload, selectCols);
    if (!result.error || !isSchemaColumnError(result.error)) {
      return result;
    }

    const missingCol = extractMissingColumn(result.error);
    console.warn('Supabase schema drift detected; retrying:', result.error.message);

    if (missingCol && Object.prototype.hasOwnProperty.call(currentPayload, missingCol)) {
      delete currentPayload[missingCol];
    } else if (missingCol && selectCols === '*') {
      selectCols = 'id';
    } else {
      OPTIONAL_COLUMNS.forEach((col) => delete currentPayload[col]);
      selectCols = 'id';
    }
  }

  return runQuery(currentPayload, 'id');
}

export async function insertRegistrationSafe(supabase, payload) {
  return executeWithColumnFallback(
    (cleanPayload, selectCols) =>
      supabase.from('registrations').insert([cleanPayload]).select(selectCols).single(),
    payload
  );
}

export async function updateRegistrationSafe(supabase, orderId, payload) {
  return executeWithColumnFallback(
    (cleanPayload, selectCols) =>
      supabase
        .from('registrations')
        .update(cleanPayload)
        .eq('razorpay_order_id', orderId)
        .select(selectCols)
        .single(),
    payload
  );
}

