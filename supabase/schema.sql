-- ====================================================================
-- SPECTRUM 1.0 — SUPABASE DATABASE SCHEMA FOR REGISTRATIONS
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ====================================================================

-- 1. Create registrations table
create table if not exists public.registrations (
    id uuid default gen_random_uuid() primary key,
    participant_name text not null,
    name text, -- backward compatibility alias
    email text not null,
    phone text not null,
    college text,
    event_id text not null,
    event_name text not null,
    team_name text,
    team_members jsonb,
    amount numeric not null default 0,
    fee numeric default 0, -- backward compatibility alias
    razorpay_order_id text unique,
    razorpay_payment_id text,
    payment_status text default 'pending', -- 'pending', 'paid', 'failed'
    synced_to_sheets boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. If table already existed, ensure all newer columns exist
alter table public.registrations add column if not exists participant_name text;
alter table public.registrations add column if not exists name text;
alter table public.registrations add column if not exists amount numeric default 0;
alter table public.registrations add column if not exists fee numeric default 0;
alter table public.registrations add column if not exists synced_to_sheets boolean default false;
alter table public.registrations add column if not exists team_members jsonb;
alter table public.registrations add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- 3. Create unique index on razorpay_order_id if not present
create unique index if not exists idx_registrations_razorpay_order_id on public.registrations (razorpay_order_id);
create index if not exists idx_registrations_email on public.registrations (email);
create index if not exists idx_registrations_status on public.registrations (payment_status);

-- 4. Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- 5. Policies for serverless backend API (using service role / anon)
drop policy if exists "Allow insert for all" on public.registrations;
drop policy if exists "Allow update for all" on public.registrations;
drop policy if exists "Allow read for all" on public.registrations;

create policy "Allow insert for all" on public.registrations
    for insert with check (true);

create policy "Allow update for all" on public.registrations
    for update using (true);

create policy "Allow read for all" on public.registrations
    for select using (true);
