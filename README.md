<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1uy7iRssWNoh2Je-r4ZX3hl6fTS0uyFyE

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set:
   - `API_KEY` (or `GEMINI_API_KEY`) for the Gemini API (AI Insight Engine)
   - Optional: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for persisting patient data (see [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md))
3. Run the app:
   `npm run dev`

## ABHA (Ayushman Bharat Health Account) Integration

Arogya Manas supports linking patients to their **ABHA** (national health ID) for ABDM-compliant record-keeping. On the **New Patient** form you can optionally enter the patient’s **ABHA Number** (14 digits) and/or **ABHA Address** (e.g. `user@abdm`). These are validated and stored on the patient; the patient detail view shows ABHA when present.

For full ABDM integration (verify by QR/OTP, link tokens, care contexts), you need a backend that talks to the ABDM gateway. See **[docs/ABHA_INTEGRATION.md](docs/ABHA_INTEGRATION.md)** for step-by-step signup, backend requirements, and references.

## Supabase (patient data & demo for judges)

To persist patient data and seed demo data so judges see a consistent experience, you can connect **Supabase**. The app loads patients from Supabase on startup; if the table is empty, it seeds demo patients (e.g. Ananya Sharma with full clinical journey and biomarkers). See **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for creating a project, running the migration, and setting env vars.
