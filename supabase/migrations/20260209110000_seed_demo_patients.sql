-- ArogyaManas: Seed 3 demo patients with full clinical history.
-- Run after 20260209100000_relational_schema.sql.
-- Idempotent: uses ON CONFLICT DO NOTHING so safe to run multiple times.

-- 1. Patients
insert into public.patients (
  id, full_name, dob, gender, contact_number, email,
  clinical_status, visit_type, chief_complaint, assigned_doctor_name,
  diagnosis, first_diagnosis_date, reception_notes,
  medical_history, family_history, psychosocial_factors, joined_at
) values
  (
    'demo-patient-1',
    'Rajesh Kumar',
    '1985-03-12',
    'Male',
    '+91 98765 43210',
    'rajesh.kumar@example.com',
    'Under Treatment',
    'Follow-up',
    'Low mood, poor sleep for 3 months',
    'Dr. Aditi Rao',
    'Major Depressive Disorder, moderate',
    '2024-09-15',
    'Referred from GP. No prior psychiatric history.',
    '[]'::jsonb,
    '[{"relation":"Mother","status":"Diagnosed","condition":"Depression","notes":""}]'::jsonb,
    '["Work stress","Sleep disruption"]'::jsonb,
    '2024-09-15T10:00:00+00:00'
  ),
  (
    'demo-patient-2',
    'Priya Sharma',
    '1992-07-28',
    'Female',
    '+91 91234 56789',
    'priya.s@example.com',
    'In Progress',
    'Follow-up',
    'Anxiety and panic attacks',
    'Dr. Vikram Malhotra',
    'Generalized Anxiety Disorder; Panic Disorder',
    '2024-10-01',
    'Self-referred. History of anxiety since college.',
    '[{"id":"m1","name":"Hypertension","startDate":"2022-01-01","isMedicated":true,"medications":[{"name":"Amlodipine","dosage":"5mg","isCurrent":true}]}]'::jsonb,
    '[]'::jsonb,
    '["Financial stress","Caring for elderly parent"]'::jsonb,
    '2024-10-01T09:30:00+00:00'
  ),
  (
    'demo-patient-3',
    'Arun Mehta',
    '1978-11-05',
    'Male',
    '+91 99887 66554',
    null,
    'New',
    'New Consultation',
    'Mood swings, irritability',
    'Dr. Priya Mani',
    'Bipolar Affective Disorder, type II (provisional)',
    '2025-01-10',
    'Family brought for evaluation. Previous treatment at district hospital.',
    '[]'::jsonb,
    '[{"relation":"Father","status":"Deceased","condition":"Cardiac","notes":""}]'::jsonb,
    '["Alcohol use reduced","Marital conflict"]'::jsonb,
    '2025-01-10T14:00:00+00:00'
  )
on conflict (id) do nothing;

-- 2. Clinical encounters (fixed UUIDs for idempotency)
insert into public.clinical_encounters (
  id, patient_id, doctor_id, primary_diagnosis, secondary_diagnosis,
  is_confirmed, doctor_notes, therapy_recommended, lab_tests_ordered,
  supplements_prescribed, finalized_at
) values
  (
    'e0000001-0000-4000-8000-000000000001',
    'demo-patient-1',
    'a0000000-0000-4000-8000-000000000001',
    'Major Depressive Disorder, moderate',
    null,
    true,
    'Patient responding to SSRI. Continue current regimen. Review in 4 weeks.',
    'CBT techniques; sleep hygiene',
    true,
    true,
    now()
  ),
  (
    'e0000001-0000-4000-8000-000000000002',
    'demo-patient-2',
    'a0000000-0000-4000-8000-000000000002',
    'Generalized Anxiety Disorder',
    'Panic Disorder',
    true,
    'Panic frequency reduced. Continue escitalopram and add relaxation exercises.',
    'Breathing exercises; graded exposure',
    false,
    false,
    now()
  ),
  (
    'e0000001-0000-4000-8000-000000000003',
    'demo-patient-3',
    'a0000000-0000-4000-8000-000000000003',
    'Bipolar Affective Disorder, type II (provisional)',
    null,
    false,
    'Baseline assessment done. Await lab results. Consider mood stabilizer after confirmation.',
    'Psychoeducation; mood chart',
    true,
    false,
    null
  )
on conflict (id) do nothing;

-- 3. Prescribed medications (linked to encounters)
insert into public.prescribed_medications (
  id, encounter_id, medicine_name, dosage, frequency, duration_text, route, instructions
) values
  ('c1000001-0000-4000-8000-000000000001', 'e0000001-0000-4000-8000-000000000001', 'Escitalopram', '10 mg', 'OD', '8 weeks', 'Oral', 'Morning after food'),
  ('c1000001-0000-4000-8000-000000000002', 'e0000001-0000-4000-8000-000000000001', 'Clonazepam', '0.25 mg', 'HS', '2 weeks', 'Oral', 'At bedtime'),
  ('c1000001-0000-4000-8000-000000000003', 'e0000001-0000-4000-8000-000000000001', 'Vitamin D3', '60,000 IU', 'OD', '6 weeks', 'Oral', 'Weekly once'),
  ('c1000001-0000-4000-8000-000000000004', 'e0000001-0000-4000-8000-000000000002', 'Escitalopram', '10 mg', 'OD', '12 weeks', 'Oral', 'Morning'),
  ('c1000001-0000-4000-8000-000000000005', 'e0000001-0000-4000-8000-000000000002', 'Clonazepam', '0.5 mg', 'PRN', 'As needed', 'Oral', 'At onset of panic'),
  ('c1000001-0000-4000-8000-000000000006', 'e0000001-0000-4000-8000-000000000003', 'Olanzapine', '2.5 mg', 'HS', '2 weeks', 'Oral', 'Review before increasing')
on conflict (id) do nothing;

-- 4. Assessments (PHQ-9 / GAD-7)
insert into public.assessments (
  id, patient_id, test_type, raw_score, responses, severity, assessment_date
) values
  ('a0000001-0000-4000-8000-000000000001', 'demo-patient-1', 'PHQ-9', 14, '{}'::jsonb, 'Moderate', '2024-11-01'),
  ('a0000001-0000-4000-8000-000000000002', 'demo-patient-1', 'PHQ-9', 10, '{}'::jsonb, 'Moderate', '2024-12-01'),
  ('a0000001-0000-4000-8000-000000000003', 'demo-patient-2', 'GAD-7', 12, '{}'::jsonb, 'Moderate', '2024-10-15'),
  ('a0000001-0000-4000-8000-000000000004', 'demo-patient-2', 'GAD-7', 8, '{}'::jsonb, 'Mild', '2024-11-15'),
  ('a0000001-0000-4000-8000-000000000005', 'demo-patient-3', 'PHQ-9', 11, '{}'::jsonb, 'Moderate', '2025-01-10'),
  ('a0000001-0000-4000-8000-000000000006', 'demo-patient-3', 'HAM-D', 18, '{}'::jsonb, 'Moderate', '2025-01-10')
on conflict (id) do nothing;

-- 5. Biomarkers
insert into public.biomarkers (
  id, patient_id, biomarker_type, value, recorded_at
) values
  ('b0000001-0000-4000-8000-000000000001', 'demo-patient-1', 'weight', 72.5, '2024-11-01'),
  ('b0000001-0000-4000-8000-000000000002', 'demo-patient-1', 'weight', 71.8, '2024-12-01'),
  ('b0000001-0000-4000-8000-000000000003', 'demo-patient-1', 'sleepHours', 5.5, '2024-11-01'),
  ('b0000001-0000-4000-8000-000000000004', 'demo-patient-1', 'sleepHours', 6.5, '2024-12-01'),
  ('b0000001-0000-4000-8000-000000000005', 'demo-patient-2', 'systolicBP', 128, '2024-10-15'),
  ('b0000001-0000-4000-8000-000000000006', 'demo-patient-2', 'diastolicBP', 82, '2024-10-15'),
  ('b0000001-0000-4000-8000-000000000007', 'demo-patient-2', 'vitaminD', 24.2, '2024-10-01'),
  ('b0000001-0000-4000-8000-000000000008', 'demo-patient-3', 'weight', 85, '2025-01-10')
on conflict (id) do nothing;

-- 6. Clinical journey (external facility history)
insert into public.clinical_journey (
  id, patient_id, facility_name, clinician_name, start_date, end_date, reason_for_visit, outcome, prescribed_medications, medication_changes
) values
  (
    'd0000001-0000-4000-8000-000000000001',
    'demo-patient-1',
    'City General Hospital, OPD',
    'Dr. S. Nair',
    '2024-08-01',
    '2024-09-01',
    'Low mood, fatigue',
    'Referred to psychiatry',
    '["Multivitamin"]'::jsonb,
    null
  ),
  (
    'd0000001-0000-4000-8000-000000000002',
    'demo-patient-2',
    'Apollo Clinic, Psychology',
    'Dr. R. Gupta',
    '2024-06-01',
    '2024-09-15',
    'Anxiety, panic',
    'Improved with therapy; referred for medication review',
    '[]'::jsonb,
    '[]'::jsonb
  ),
  (
    'd0000001-0000-4000-8000-000000000003',
    'demo-patient-3',
    'District Hospital Psychiatry',
    'Dr. M. Singh',
    '2024-03-01',
    '2024-12-01',
    'Mood swings',
    'Discontinued; sought second opinion',
    '["Sertraline","Risperidone"]'::jsonb,
    '["Stopped Sertraline due to agitation"]'::jsonb
  )
on conflict (id) do nothing;
