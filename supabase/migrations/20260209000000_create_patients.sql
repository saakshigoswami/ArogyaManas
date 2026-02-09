-- ArogyaManas: patients table stores full patient JSON for demo and persistence.
-- Run this in Supabase Dashboard → SQL Editor (or via Supabase CLI).

create table if not exists public.patients (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allow anonymous read/write for hackathon demo (no auth). Tighten RLS for production.
alter table public.patients enable row level security;

create policy "Allow anon read and write for demo"
  on public.patients
  for all
  to anon
  using (true)
  with check (true);

-- Optional: updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger patients_updated_at
  before update on public.patients
  for each row execute function public.set_updated_at();

comment on table public.patients is 'ArogyaManas patient records; payload is full Patient JSON.';
