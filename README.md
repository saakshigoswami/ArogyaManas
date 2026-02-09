<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🧠 ArogyaManas

### Longitudinal Intelligence for Psychiatric Healthcare in India

**ArogyaManas** is a clinical-grade mental health intelligence platform aligned with the **Ayushman Bharat Digital Mission (ABDM)**. It digitizes psychiatric records, reduces clinical time, and helps psychiatrists and psychologists treat **more patients accurately and efficiently**.

Built for the **Gemini Hackathon**, powered by the **Gemini 3 API**, and developed end-to-end using **Google AI Studio**—from rapid prototyping to production integration.

🔗 **Live App:** [https://arogya-manas.vercel.app](https://arogya-manas.vercel.app)  
🔗 **View in AI Studio:** [Open in AI Studio](https://ai.studio/apps/drive/1uy7iRssWNoh2Je-r4ZX3hl6fTS0uyFyE)

---

## 🚨 Why We Built This

Mental healthcare in India faces structural challenges:

- 📄 **Paper-based records** — Handwritten prescriptions and notes are hard to read, slow to review, and easy to miss.
- 🧩 **Fragmented history** — No longitudinal view of diagnoses, medications, or assessments across years.
- ⏱️ **Time pressure** — India has far fewer psychiatrists and psychologists per capita; reading past records consumes valuable consultation time.
- 💸 **High therapy costs** — Mental health sessions often cost ₹3,000–₹4,000 because each case requires long, manual review.

**Result:** Important clinical signals are missed, misdiagnosis risk increases, and fewer patients get care.

**ArogyaManas digitizes the entire psychiatric journey**—so clinicians spend time treating patients, not decoding paperwork. We built it **ABDM-ready** so India’s national health stack can eventually connect every citizen’s mental health journey.

---

## ✨ What ArogyaManas Does

- 📷 **Scans handwritten prescriptions** using Gemini Vision
- 🧾 Converts them into **structured, longitudinal records**
- 📈 Builds a **single clinical timeline** of diagnoses, medications, tests, and biomarkers
- 🤖 Uses AI for **analysis and summarization**, not diagnosis
- 🆔 Supports **ABHA (Ayushman Bharat Health Account)** for future national interoperability

This directly **reduces per-patient review time**, enabling clinicians to see **more patients per day**—helping lower the overall cost of mental healthcare.

---

## 🤖 How We Use the Gemini 3 API

We use the **@google/genai SDK** with **gemini-3-flash-preview** across three core workflows:

### 1️⃣ Prescription Scanning (Vision + Structured Output)

- **Input:** Photo of handwritten prescription
- **Gemini:** OCR + semantic understanding → **structured JSON** (we use `responseSchema` so the model returns valid JSON; no hallucination—unclear fields are empty and marked low-confidence)
- **Output:** Diagnosis, hospital/doctor/department, medications with dosage, frequency, duration, instructions, confidence flags

📍 **Used in:** Dashboard → *Scan External Record* · Patient Detail → *Clinical History → Scan*

---

### 2️⃣ Longitudinal Patient Intelligence

- **Input:** Structured patient history (diagnoses, sessions, PHQ-9, medications, biomarkers)
- **Gemini generates:** Clinical summary, trend analysis, risk & attention flags, key changes over time
- **No diagnosis is made** — AI only assists clinical review (output via `responseSchema` JSON)

📍 **Used in:** *Clinical Insights → Generate AI Intelligence*

---

### 3️⃣ Psychological Test Interpretation

- **Tests:** PHQ-9, GAD-7 (HAM-D supported in data)
- **Gemini explains:** Severity, change from previous score, item-level highlights—in plain clinical language, not medical decisions

📍 **Used in:** *Test Administration Flow*

**Technical note:** Model `gemini-3-flash-preview`; we use `responseMimeType: "application/json"` and `responseSchema` where structured output is required, reducing hallucinations and simplifying integration.

---

## 🧪 Key Features

- 📊 Longitudinal clinical timelines
- 🧠 AI-assisted clinical insights (Gemini)
- 📈 Biomarkers & vitamin trends (B12, D, HbA1c, BP, sleep)
- 🧾 Digitized prescriptions with source images
- 🧪 Psychological test administration & interpretation
- 🆔 ABHA-aware patient records
- ⚙️ Supabase-backed relational schema (optional)

---

## Features (overview)

| Feature | Description |
|--------|-------------|
| **Landing page** | Hero, value proposition, ABDM/ABHA/Digital India branding, “Explore” → app. |
| **Dashboard** | Overview, **Scan External Record** (Gemini) → new patient or add to journey, Add Patient. |
| **Patient Management** | Directory with search, status filters; Supabase vs demo data hint. |
| **Patient Detail** | Demographics, ABHA (if linked), diagnosis, chief complaint, clinical status, assigned doctor. |
| **Clinical History** | Timeline: encounters, medications, **scan prescription** (Gemini), external facility history. |
| **Biomarkers** | Weight, BP, sleep, Vitamin D/B12, HbA1c over time. |
| **Prescriptions** | Scanned prescriptions (image, OCR, structured items) attached to the patient. |
| **Clinical Insights** | **Generate AI Intelligence** (Gemini) — summary, trends, flags, key changes. |
| **Test Administration** | PHQ-9, GAD-7, HAM-D; **Gemini interpretation** of scores. |
| **ABHA (Health ID)** | Optional on new patient; validation; display on detail; [docs/ABHA_INTEGRATION.md](docs/ABHA_INTEGRATION.md). |
| **Supabase** | Relational schema + demo seed for judges; [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md). |

---

## 🏗️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts
- **AI:** Google Gemini 3 API via `@google/genai`
- **Backend:** Supabase (PostgreSQL, optional for persistence)
- **Deployment:** Vercel
- **Design goal:** Clinical, calm, non-distracting UI

---

## 🏥 ABDM & ABHA Integration

ArogyaManas supports **ABHA (Ayushman Bharat Health Account)** as an optional patient identifier.

- ABHA validation in New Patient flow
- ABHA visible in patient profile
- Architecture designed for future **ABDM consent & care-context flows**

📄 See [docs/ABHA_INTEGRATION.md](docs/ABHA_INTEGRATION.md) for full ABDM gateway and backend requirements.

---

## Run Locally

**Prerequisites:** Node.js 18+

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment variables**  
   Copy [.env.example](.env.example) to `.env.local` and set:
   - **`GEMINI_API_KEY`** (or `API_KEY`) — required for prescription scanning, AI insights, and test interpretation. Get it from [Google AI Studio](https://aistudio.google.com/apikey).
   - **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** — optional; for persisting patients and demo seed. See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

3. **Run**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. `http://localhost:3000`).

---

## Supabase (optional, recommended for demos)

- Create a project at [supabase.com](https://supabase.com), run SQL from `supabase/migrations/` in order (relational schema + seed).
- App loads patients from Supabase on startup; if the table is empty, it can seed demo patients.
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) — project setup, migrations, env vars.  
- [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) — deploying to Vercel with Supabase env vars.

---

## Project structure (high level)

```
├── components/       # LandingPage, Layout, PatientList, PatientDetail, NewPatientForm,
│                     # PrescriptionScanner, ClinicalInsights, TestAdministration, etc.
├── services/
│   ├── geminiService.ts   # Gemini 3 API: scanPrescription, analyzePatientHistory, interpretTestResult
│   ├── patientService.ts  # Supabase fetch/save, seed
│   └── abhaService.ts     # ABHA validation/normalization
├── lib/supabase.ts        # Supabase client
├── supabase/migrations/   # Relational schema + demo seed
└── docs/                  # ABHA, Supabase, Vercel
```

---

## 🏆 Summary for Judges

- **Problem:** Paper-based psychiatric records, time-intensive reviews, high therapy costs (₹3,000–₹4,000/session) and fragmented care in India.
- **Solution:** ArogyaManas — AI-assisted digitization + longitudinal intelligence so clinicians treat more patients, accurately and efficiently.
- **Gemini 3 usage:**
  1. Vision OCR → structured prescriptions (no hallucination; low-confidence flags for unclear fields)
  2. Longitudinal clinical analysis (summary, trends, flags, key changes)
  3. Psychological test interpretation (PHQ-9, GAD-7)
- **Impact:** Saves clinician time, improves accuracy, increases patient throughput, and helps reduce therapy costs in India.
- **Differentiator:** Built specifically for Indian psychiatry and ABDM readiness; developed with **Google AI Studio** from prototyping to production.

---

### 🧠 ArogyaManas

**Clinical-grade mental health intelligence for India’s next billion patients.**
