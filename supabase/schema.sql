-- ====================================================================
-- SPECTRUM 1.0 — HARDENED SUPABASE DATABASE SCHEMA (FRESH INSTALL)
-- NOTE: For an ALREADY-LIVE database with existing rows, DO NOT run
-- this drop-and-recreate script! Run supabase/harden_existing.sql instead.
-- ====================================================================

-- 1. Safely drop previous table if setting up from scratch
drop table if exists public.registrations cascade;

-- 2. Create clean registrations table with all authoritative columns
create table public.registrations (
    id uuid default gen_random_uuid() primary key,
    unique_id text unique,
    participant_name text not null,
    email text not null,
    phone text not null,
    college text,
    event_id text not null,
    event_name text not null,
    team_name text,
    team_members jsonb,
    theme text,
    accommodation text,
    amount numeric not null default 0,
    razorpay_order_id text unique,
    razorpay_payment_id text,
    payment_status text default 'pending', -- 'pending', 'paid', 'failed'
    synced_to_sheets boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create indexes
create unique index idx_registrations_razorpay_order_id on public.registrations (razorpay_order_id);
create index idx_registrations_email on public.registrations (email);
create index idx_registrations_status on public.registrations (payment_status);

-- 4. Enable Row Level Security (RLS)
-- With RLS enabled and NO permissive anon/authenticated policies defined,
-- public client keys cannot read, insert, or tamper with registrations.
-- Server-side Vercel API routes authenticate with SUPABASE_SERVICE_ROLE_KEY.
alter table public.registrations enable row level security;

revoke all on table public.registrations from anon, authenticated, public;
grant all on table public.registrations to service_role;
