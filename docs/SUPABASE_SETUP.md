# Supabase Setup for ArogyaManas (Demo Data)

This app persists patient data in **Supabase** so judges see the same demo data and any new patients they add are saved. Two schema options are supported:

- **Relational schema (recommended)** – Normalized tables for patients, encounters, medications, biomarkers, clinical journey, etc., suitable for production-grade use and ABDM readiness.
- **Legacy single-table** – One `patients` table with a JSONB `payload`; use only if you already ran the first migration and prefer not to switch.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project** → choose org, name (e.g. `arogyamanas-demo`), database password, region.
3. Wait for the project to be ready.

## 2. Create the database schema

In the Supabase Dashboard, open **SQL Editor** and run the migrations in order.

### Option A – Relational schema (recommended)

Run **both** migration files in this order:

1. **`supabase/migrations/20260209000000_create_patients.sql`**  
   (Creates the initial `patients` table; the next migration may drop and replace it.)
2. **`supabase/migrations/20260209100000_relational_schema.sql`**  
   This creates the full normalized schema:
   - **patients** – Core identity, ABHA, intake, status, visit context, medical/family/psychosocial (JSONB where needed).
   - **doctors** – Seeded with Dr. Aditi Rao, Dr. Vikram Malhotra, etc.
   - **clinical_encounters** – Per-visit diagnosis, notes, therapy, lab/supplement flags.
   - **prescribed_medications** – Structured Rx per encounter (name, dosage, frequency, duration, route).
   - **assessments** – PHQ-9 / GAD-7 scores, responses (JSONB), severity, AI interpretation.
   - **biomarkers** – Longitudinal vitals (weight, BP, sleep, Vitamin D/B12, HbA1c).
   - **clinical_journey** – External facility history, outcomes, medication changes.
   - **ai_insights** – Gemini-generated summary, trend analysis, clinical flags, confidence.
   - **scanned_prescriptions** – OCR/digitization records and items.

The app detects the relational schema (e.g. `full_name` on `patients`) and uses it automatically. If the `patients` table is empty on first load, it seeds demo data from `MOCK_PATIENTS`.

### Option B – Legacy single-table (simple demo only)

Run only **`supabase/migrations/20260209000000_create_patients.sql`**.  
This creates a single `patients` table with `id` and `payload` (JSONB). The app will use this if the relational schema is not present.

## 3. Get your project URL and anon key

1. In the Dashboard, go to **Project Settings** (gear) → **API**.
2. Copy **Project URL** and the **anon public** key.

## 4. Configure the app

In the project root, create or edit `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Run the app

```bash
npm run dev
```

- **First load with Supabase configured:** The app fetches patients from Supabase. If the table is empty, it **seeds demo data** (e.g. Ananya Sharma with full clinical journey, biomarkers, ABHA).
- **Without Supabase env vars:** The app falls back to in-memory `MOCK_PATIENTS` only (no persistence).

## For judges / demo

- Deploy the app and set **VITE_SUPABASE_URL** and **VITE_SUPABASE_ANON_KEY** in the hosting environment.
- Judges will see the same pre-seeded patient(s) and any new patients will persist.

## Security note

The migrations allow **anon** read/write for the demo. For production, add authentication and stricter RLS policies; consider an **audit_logs** table for ABDM compliance (who accessed which record and when).
