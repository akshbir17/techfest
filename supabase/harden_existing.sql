-- ====================================================================
-- SPECTRUM 1.0 — NON-DESTRUCTIVE LIVE DATABASE HARDENING MIGRATION
-- Safe to run in Supabase SQL Editor on your live production table
-- without losing any existing registration records!
-- ====================================================================

-- 1. Add any missing columns used by backend API routes
alter table public.registrations add column if not exists unique_id text;
alter table public.registrations add column if not exists theme text;
alter table public.registrations add column if not exists accommodation text;

create unique index if not exists idx_registrations_unique_id
  on public.registrations (unique_id)
  where unique_id is not null;

-- 2. Remove overly permissive public RLS policies
alter table public.registrations enable row level security;

drop policy if exists "Allow insert for all" on public.registrations;
drop policy if exists "Allow update for all" on public.registrations;
drop policy if exists "Allow read for all" on public.registrations;

-- 3. Lock down direct public/anon access; allow backend service_role only
revoke all on table public.registrations from anon, authenticated, public;
grant all on table public.registrations to service_role;

