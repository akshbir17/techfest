-- ====================================================================
-- SPECTRUM 1.0 — CLEAN SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ====================================================================

-- 1. Safely drop previous table if partially created with duplicate columns
drop table if exists public.registrations cascade;

-- 2. Create clean registrations table with exact unique columns
create table public.registrations (
    id uuid default gen_random_uuid() primary key,
    participant_name text not null,
    email text not null,
    phone text not null,
    college text,
    event_id text not null,
    event_name text not null,
    team_name text,
    team_members jsonb,
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
alter table public.registrations enable row level security;

-- 5. RLS Policies
create policy "Allow insert for all" on public.registrations
    for insert with check (true);

create policy "Allow update for all" on public.registrations
    for update using (true);

create policy "Allow read for all" on public.registrations
    for select using (true);
