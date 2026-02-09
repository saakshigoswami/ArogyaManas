# ABHA Integration Guide – Arogya Manas

This app supports **ABHA (Ayushman Bharat Health Account)** so you can link patients to their national health ID and move toward ABDM-compliant psychiatric record-keeping.

## What’s Already Implemented

- **Patient model**: Optional `abha` object with `abhaNumber` (14-digit), `abhaAddress` (e.g. `user@abdm`), and `linkedAt`.
- **New patient form**: Optional “ABHA (Health ID)” section to enter ABHA number and/or address; client-side validation and normalisation.
- **Patient detail**: ABHA is shown in the patient header and in Section A (Patient Overview) when present.
- **Service**: `services/abhaService.ts` – validation, normalisation, and inline notes for production integration.

## How to Complete Full ABDM Integration

ABDM APIs are called from a **backend**. The frontend can only collect ABHA details and (later) trigger flows that your server completes with the ABDM gateway.

### 1. Sandbox registration

1. Go to **ABDM Sandbox**: [https://sandbox.abdm.gov.in/applications/Home/signup_form](https://sandbox.abdm.gov.in/applications/Home/signup_form).
2. Register as **Company** or **Individual** as needed.
3. **Type of application**: HMIS/LMIS (Hospital/Clinic information system).
4. **Category**: Select **HIP & HRP** (Health Information Provider & Health Repository Provider) so you can create and share health records.
5. Submit; approval usually takes about a week.

### 2. Backend requirements

Your backend must:

- Be **ABDM-registered** and use the credentials (e.g. `client_id`, `client_secret`) from the sandbox/production portal.
- Expose **callback URLs** that the ABDM gateway (HIE-CM) can call for auth flows.
- Call the **ABDM Gateway** (sandbox: `https://dev.abdm.gov.in/gateway`) for:
  - **Auth init** (e.g. `/v0.5/users/auth/init` with `purpose: KYC_AND_LINK`, `authMode: DEMOGRAPHICS` or `OTP`).
  - **Auth confirm** and handle **on-init** / **on-confirm** callbacks to receive the **link token**.

Use official ABDM docs and Swagger for exact request/response and encryption (e.g. RSA) where required:

- **ABDM Sandbox docs**: [https://kiranma72.github.io/abdm-docs/](https://kiranma72.github.io/abdm-docs/)
- **Verify ABHA by demographics**: [By Demographics](https://kiranma72.github.io/abdm-docs/2-milestone1/verify-abha-address/demographics/)
- **Verify by OTP**: [By OTP](https://kiranma72.github.io/abdm-docs/2-milestone1/verify-abha-address/by-otp/)
- **Encoding & RSA**: [Working with ABDM APIs](https://kiranma72.github.io/abdm-docs/1-basics/working_with_abdm_apis/index.html), [Encoding & RSA Encryption](https://kiranma72.github.io/abdm-docs/1-basics/encoding-rsa-encryption/index.html)

### 3. Frontend flows you can add later

- **Manual entry**: Already done – user types ABHA number/address; optional “Verify with ABHA” button can call your backend to run demographic/OTP verification and return success/failure.
- **Scan ABHA QR**: Patient shows QR from ABHA app or physical card. Frontend scans (e.g. camera or barcode library), parses JSON (abhaAddress, name, dob, gender), sends to backend; backend uses demographics auth to get link token and returns it (or stores and associates with patient).
- **OTP verification**: “Verify with OTP” sends mobile number to backend; backend triggers ABDM OTP and confirms; on success, backend returns ABHA details and link token; frontend saves `abha` on the patient.

### 4. Using the link token (Milestone 2)

After you have a **link token** for a patient:

- Use it when creating/linking **care contexts** so that health records (e.g. prescriptions, encounters) are linked to that patient’s ABHA in ABDM.
- This enables consent-based sharing and retrieval of records across ABDM participants.

### 5. Production (Sandbox exit)

When you are ready for production:

- Follow **Sandbox exit** and compliance steps in the ABDM portal and docs.
- Switch gateway base URL to production (e.g. `https://live.abdm.gov.in/...`) and use production credentials.

## References

- [ABDM Sandbox](https://sandbox.abdm.gov.in/)
- [ABDM Sandbox Documentation](https://kiranma72.github.io/abdm-docs/)
- [ABHA Number creation (Aadhaar OTP, demographic, etc.)](https://kiranma72.github.io/abdm-docs/2-milestone1/abha-number/index.html)
- Support: [integration.support@nha.gov.in](mailto:integration.support@nha.gov.in)
