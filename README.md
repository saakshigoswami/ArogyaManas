<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ArogyaManas

**Longitudinal Intelligence for Psychiatric Healthcare.**  
Aligned with Ayushman Bharat. ArogyaManas digitizes records, reduces clinical time, and helps psychiatrists treat more patients—accurately and efficiently.

Built for the **Gemini Hackathon**, powered by **Gemini 3 API**. This app was also developed with **Google AI Studio**—from prototyping to integration—so the flow from idea to production stays in the Gemini ecosystem.

**View this app in AI Studio:** [Open in AI Studio](https://ai.studio/apps/drive/1uy7iRssWNoh2Je-r4ZX3hl6fTS0uyFyE)

---

## Why We Built This

- **Fragmented care** — Mental health records live on paper and in silos. Psychiatrists spend too much time chasing old prescriptions and notes instead of treating patients.
- **No longitudinal view** — Without a single timeline of diagnoses, medications, and assessments, spotting relapse or recovery patterns is slow and error‑prone.
- **Manual, repetitive work** — Digitizing handwritten prescriptions and summarizing patient history by hand doesn’t scale.

**ArogyaManas** brings psychiatric care into the digital age: **scan prescriptions with Gemini vision**, **store structured records in one place**, and **get AI‑driven insights** over time—so clinicians can focus on patients, not paperwork. We built it to be **ABDM‑ready** so India’s national health stack can eventually connect every citizen’s mental health journey.

---

## How We Use the Gemini 3 API

We use the **Google GenAI SDK** (`@google/genai`) with the **`gemini-3-flash-preview`** model in three core flows.

### 1. Prescription scanning (vision + structured output)

- **What:** User uploads or captures a photo of a handwritten prescription. Gemini performs OCR and extracts structured clinical data.
- **How:** We call `generateContent` with **image + text prompt**, and use **`responseSchema`** so the model returns valid JSON (no parsing errors).
- **Output:** Raw OCR text, prescription date, hospital name, doctor name, department, diagnosis, and a list of **medications** (name, dosage, frequency, duration, instructions, confidence: high/medium/low). We never ask the model to invent data—unreadable fields are empty and flagged low confidence.
- **Where in app:** **Dashboard → Scan External Record** (creates a new patient from scan), and **Patient Detail → Clinical History → Scan** (adds the prescription to that patient’s longitudinal journey).

### 2. Longitudinal patient analysis (AI insights)

- **What:** Given a patient’s profile and session history (diagnosis, medical history, sessions with symptoms and PHQ‑9 scores), Gemini produces a concise **summary**, **trend analysis**, **clinical flags**, and **key changes**—without giving a medical diagnosis.
- **How:** We send structured patient + session data in the prompt and use **`responseSchema`** (JSON) for a consistent shape: `summary`, `trendAnalysis`, `clinicalFlags[]`, `keyChanges[]`, `confidence`.
- **Where in app:** **Patient Detail → Clinical Insights** (“Generate AI Intelligence”). Results are shown in the same view and can be persisted.

### 3. Assessment interpretation (PHQ‑9 / GAD‑7)

- **What:** After a clinician records a PHQ‑9 or GAD‑7 score, Gemini interprets the result in plain language—comparison with previous score (if any), item‑level highlights, no diagnosis.
- **How:** We call `generateContent` with the assessment type, score, severity, and optional previous score. Response is free-form text shown in the **Test Administration** flow.

**Technical details**

- **Model:** `gemini-3-flash-preview` (used for all three flows).
- **SDK:** `@google/genai` — `GoogleGenAI`, `generateContent`, and `Type` for schema definition.
- **Structured output:** We use `responseMimeType: "application/json"` and `responseSchema` so vision and text outputs are valid JSON where needed, reducing hallucinations and simplifying integration.

---

## Features

| Feature | Description |
|--------|-------------|
| **Landing page** | Hero, value proposition, ABDM/ABHA/Digital India branding, “Explore” → app. |
| **Dashboard** | Overview, recent activity, **Scan External Record** (Gemini) → new patient or add to journey, Add Patient. |
| **Patient Management** | Directory with search, status filters; shows Supabase vs demo data hint. |
| **Patient Detail** | Demographics, ABHA (if linked), diagnosis, chief complaint, clinical status, assigned doctor. |
| **Clinical History** | Longitudinal timeline: encounters, medications, **scan prescription** (Gemini) to add to journey, external facility history. |
| **Biomarkers** | Weight, BP, sleep, Vitamin D/B12, HbA1c over time. |
| **Prescriptions** | List of scanned prescriptions (image, OCR, structured items) attached to the patient. |
| **Clinical Insights** | **Generate AI Intelligence** (Gemini) — summary, trends, flags, key changes. |
| **Test Administration** | PHQ‑9, GAD‑7 (and HAM‑D in data); **Gemini interpretation** of scores. |
| **ABHA (Health ID)** | Optional ABHA number & address on new patient; validation; display on patient detail; see [docs/ABHA_INTEGRATION.md](docs/ABHA_INTEGRATION.md) for full ABDM. |
| **Supabase backend** | Relational schema (patients, encounters, medications, assessments, biomarkers, clinical_journey, ai_insights, scanned_prescriptions); optional; demo seed for judges. |
| **Scan → New Patient** | From dashboard or patient list: scan → Gemini → pre-fill form → register and attach prescription. |

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS, Lucide icons, Recharts  
- **AI:** Google Gemini 3 API (`gemini-3-flash-preview`) via `@google/genai`  
- **Backend / DB:** Supabase (PostgreSQL, optional)  
- **Deploy:** Vite build → e.g. Vercel (see [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md))

---

## Run Locally

**Prerequisites:** Node.js 18+

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment variables**  
   Copy [.env.example](.env.example) to `.env.local` and set:
   - **`GEMINI_API_KEY`** (or `API_KEY`) — required for prescription scanning, AI insights, and test interpretation. Get it from [Google AI Studio](https://aistudio.google.com/apikey) or Google Cloud.
   - **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** — optional; for persisting patients and using demo seed. See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

3. **Run**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. `http://localhost:3000`).

---

## Supabase (optional, recommended for demos)

- Creates a project at [supabase.com](https://supabase.com), run SQL from `supabase/migrations/` in order (relational schema + seed).
- App loads patients from Supabase on startup; if the table is empty, it can seed demo patients (see seed migration).
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) — project setup, migrations, env vars.  
- [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) — deploying to Vercel with Supabase env vars.

---

## ABHA / ABDM

ArogyaManas supports **ABHA (Ayushman Bharat Health Account)** for linking patients to their national health ID. The New Patient form has an optional ABHA section; patient detail shows ABHA when present. Full ABDM integration (gateway, consent, care context) requires a registered backend—see [docs/ABHA_INTEGRATION.md](docs/ABHA_INTEGRATION.md).

---

## Project structure (high level)

```
├── components/       # LandingPage, Layout, PatientList, PatientDetail, NewPatientForm,
│                     # PrescriptionScanner, ClinicalInsights, TestAdministration, etc.
├── services/
│   ├── geminiService.ts   # Gemini 3 API: scanPrescription, analyzePatientHistory, interpretTestResult
│   ├── patientService.ts # Supabase fetch/save, seed
│   └── abhaService.ts    # ABHA validation/normalization
├── lib/supabase.ts       # Supabase client
├── supabase/migrations/  # Relational schema + demo seed
└── docs/                 # ABHA, Supabase, Vercel
```

---

## Summary for Judges / Hackathon

- **Problem:** Paper-based, fragmented psychiatric records; no longitudinal view; manual digitization.
- **Solution:** ArogyaManas — scan prescriptions with **Gemini 3**, store structured records, and get **AI insights** over time; ABDM‑ready.
- **Gemini 3 usage:** (1) **Vision + JSON** for prescription OCR and structured medications, (2) **Longitudinal analysis** for summary/trends/flags, (3) **Assessment interpretation** for PHQ‑9/GAD‑7.
- **Differentiator:** Built for Indian psychiatric workflows, ABHA-aware, and designed to plug into Ayushman Bharat Digital Mission. Developed with **Google AI Studio** for rapid prototyping and Gemini 3 integration.
