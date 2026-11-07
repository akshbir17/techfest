-- Supabase Table Setup for Spectrum 1.0 Registrations
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

create table if not exists public.registrations (
    id uuid default gen_random_uuid() primary key,
    event_id text not null,
    event_name text not null,
    participation_type text default 'individual',
    name text not null,
    email text not null,
    phone text not null,
    college text not null,
    team_name text,
    team_members jsonb,
    fee numeric not null default 0,
    razorpay_order_id text unique,
    razorpay_payment_id text,
    payment_status text default 'pending', -- 'pending', 'paid', 'failed'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Policies to allow insert, update, and select
create policy "Allow insert for all" on public.registrations
    for insert with check (true);

create policy "Allow update for all" on public.registrations
    for update using (true);

create policy "Allow read for all" on public.registrations
    for select using (true);
