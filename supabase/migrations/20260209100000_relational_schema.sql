-- ArogyaManas: Production-grade normalized schema (PostgreSQL)
-- Run after 20260209000000_create_patients.sql or standalone (drops old patients if exists).
-- Replaces single-table JSONB with normalized tables for clinical tracking and ABDM readiness.

-- Drop legacy table if present (optional; comment out if you want to keep old data)
drop table if exists public.patients;

-- Enums
create type app_gender as enum ('Male', 'Female', 'Non-binary', 'Other');
create type app_clinical_status as enum ('New', 'In Progress', 'Under Treatment');
create type app_visit_type as enum ('New Consultation', 'Follow-up', 'Emergency');
create type app_rx_frequency as enum ('OD', 'BD', 'TDS', 'HS', 'PRN');
create type app_route as enum ('Oral', 'Injection', 'Other');
create type app_biomarker_type as enum ('weight', 'systolicBP', 'diastolicBP', 'sleepHours', 'vitaminD', 'vitaminB12', 'hbA1c');
create type app_test_type as enum ('PHQ-9', 'GAD-7', 'HAM-D');

-- 1. Doctors (referenced by encounters)
create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  created_at timestamptz default now()
);

-- 2. Patient core & administrative
create table public.patients (
  id text primary key,
  abha_id text unique,
  abha_address text,
  abha_linked_at date,
  full_name text not null,
  dob date not null,
  gender app_gender not null,
  contact_number text not null,
  email text,
  clinical_status app_clinical_status default 'New',
  joined_at timestamptz default now(),
  reception_notes text,
  visit_type app_visit_type,
  chief_complaint text,
  assigned_doctor_name text,
  diagnosis text,
  first_diagnosis_date date,
  medical_history jsonb,
  family_history jsonb,
  psychosocial_factors jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Clinical encounters
create table public.clinical_encounters (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references public.patients(id) on delete cascade,
  doctor_id uuid references public.doctors(id),
  primary_diagnosis text not null,
  secondary_diagnosis text,
  is_confirmed boolean default false,
  doctor_notes text,
  therapy_recommended text,
  lab_tests_ordered boolean default false,
  supplements_prescribed boolean default false,
  finalized_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_encounters_patient on public.clinical_encounters(patient_id);

-- 4. Prescribed medications (per encounter)
create table public.prescribed_medications (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references public.clinical_encounters(id) on delete cascade,
  medicine_name text not null,
  dosage text not null,
  frequency app_rx_frequency not null,
  duration_days int,
  duration_text text,
  route app_route default 'Oral',
  instructions text,
  created_at timestamptz default now()
);

create index idx_rx_encounter on public.prescribed_medications(encounter_id);

-- 5. Assessments (PHQ-9, GAD-7)
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references public.patients(id) on delete cascade,
  test_type app_test_type not null,
  raw_score int not null,
  responses jsonb not null default '{}',
  severity text,
  ai_interpretation text,
  assessment_date date not null,
  created_at timestamptz default now()
);

create index idx_assessments_patient on public.assessments(patient_id);

-- 6. Biomarkers (longitudinal)
create table public.biomarkers (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references public.patients(id) on delete cascade,
  biomarker_type app_biomarker_type not null,
  value float not null,
  recorded_at date not null,
  created_at timestamptz default now()
);

create index idx_biomarkers_patient on public.biomarkers(patient_id);

-- 7. Clinical journey (external facility history)
create table public.clinical_journey (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references public.patients(id) on delete cascade,
  facility_name text not null,
  clinician_name text,
  start_date date not null,
  end_date date,
  reason_for_visit text,
  outcome text,
  prescribed_medications jsonb,
  medication_changes jsonb,
  created_at timestamptz default now()
);

create index idx_journey_patient on public.clinical_journey(patient_id);

-- 8. AI insights (Gemini output)
create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references public.patients(id) on delete cascade,
  summary text not null,
  trend_analysis text not null,
  clinical_flags jsonb not null default '[]',
  key_changes jsonb default '[]',
  confidence float check (confidence >= 0 and confidence <= 1),
  generated_at timestamptz default now()
);

create index idx_ai_insights_patient on public.ai_insights(patient_id);

-- 9. Scanned prescriptions (digitization)
create table public.scanned_prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null references public.patients(id) on delete cascade,
  image_storage_url text not null,
  raw_ocr_text text not null,
  doctor_name text,
  hospital_name text,
  department text,
  diagnosis text,
  items jsonb default '[]',
  is_verified boolean default false,
  verified_by text,
  verified_at timestamptz,
  scanned_at timestamptz default now(),
  notes text
);

create index idx_prescriptions_patient on public.scanned_prescriptions(patient_id);

-- Updated_at trigger
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

create trigger encounters_updated_at
  before update on public.clinical_encounters
  for each row execute function public.set_updated_at();

-- RLS (demo: anon read/write; tighten for production)
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.clinical_encounters enable row level security;
alter table public.prescribed_medications enable row level security;
alter table public.assessments enable row level security;
alter table public.biomarkers enable row level security;
alter table public.clinical_journey enable row level security;
alter table public.ai_insights enable row level security;
alter table public.scanned_prescriptions enable row level security;

create policy "Allow anon all doctors" on public.doctors for all to anon using (true) with check (true);
create policy "Allow anon all patients" on public.patients for all to anon using (true) with check (true);
create policy "Allow anon all encounters" on public.clinical_encounters for all to anon using (true) with check (true);
create policy "Allow anon all medications" on public.prescribed_medications for all to anon using (true) with check (true);
create policy "Allow anon all assessments" on public.assessments for all to anon using (true) with check (true);
create policy "Allow anon all biomarkers" on public.biomarkers for all to anon using (true) with check (true);
create policy "Allow anon all journey" on public.clinical_journey for all to anon using (true) with check (true);
create policy "Allow anon all ai_insights" on public.ai_insights for all to anon using (true) with check (true);
create policy "Allow anon all prescriptions" on public.scanned_prescriptions for all to anon using (true) with check (true);

-- Seed doctors (names from app constants)
insert into public.doctors (id, full_name) values
  ('a0000000-0000-4000-8000-000000000001', 'Dr. Aditi Rao'),
  ('a0000000-0000-4000-8000-000000000002', 'Dr. Vikram Malhotra'),
  ('a0000000-0000-4000-8000-000000000003', 'Dr. Priya Mani'),
  ('a0000000-0000-4000-8000-000000000004', 'Dr. Amit Shah')
on conflict (id) do update set full_name = excluded.full_name;
