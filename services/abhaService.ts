/**
 * ABHA (Ayushman Bharat Health Account) integration helpers.
 * Use this to validate and format ABHA data; full gateway integration requires a backend.
 *
 * ABDM docs: https://kiranma72.github.io/abdm-docs/
 * Sandbox: https://sandbox.abdm.gov.in/
 */

import type { AbhaInfo } from '../types';

/** ABHA Number is 14 digits (no spaces). */
const ABHA_NUMBER_REGEX = /^\d{14}$/;

/** ABHA Address format: username@abdm (e.g. john@abdm). */
const ABHA_ADDRESS_REGEX = /^[a-zA-Z0-9._-]+@abdm$/i;

export const abhaService = {
  /** Validate 14-digit ABHA number (digits only). */
  isValidAbhaNumber(value: string): boolean {
    const cleaned = (value || '').replace(/\s/g, '');
    return ABHA_NUMBER_REGEX.test(cleaned);
  },

  /** Validate ABHA address (user@abdm). */
  isValidAbhaAddress(value: string): boolean {
    return ABHA_ADDRESS_REGEX.test((value || '').trim());
  },

  /** Normalize ABHA number to 14 digits (strip spaces). */
  normalizeAbhaNumber(value: string): string {
    return (value || '').replace(/\D/g, '').slice(0, 14);
  },

  /** Normalize ABHA address (trim, lowercase). */
  normalizeAbhaAddress(value: string): string {
    return (value || '').trim().toLowerCase();
  },

  /** Build AbhaInfo from form inputs; returns undefined if both empty. */
  toAbhaInfo(abhaNumber?: string, abhaAddress?: string): AbhaInfo | undefined {
    const num = abhaNumber ? this.normalizeAbhaNumber(abhaNumber) : '';
    const addr = abhaAddress ? this.normalizeAbhaAddress(abhaAddress) : '';
    if (!num && !addr) return undefined;
    const info: AbhaInfo = { linkedAt: new Date().toISOString().split('T')[0] };
    if (this.isValidAbhaNumber(num)) info.abhaNumber = num;
    else if (num.length > 0) info.abhaNumber = num; // allow saving partial for later verification
    if (this.isValidAbhaAddress(addr)) info.abhaAddress = addr;
    else if (addr.length > 0) info.abhaAddress = addr;
    return info;
  },
};

/**
 * PRODUCTION INTEGRATION (requires backend):
 *
 * 1. Sandbox signup: https://sandbox.abdm.gov.in/applications/Home/signup_form
 *    - For HMIS/LMIS that create and share health records: select HIP & HRP.
 *
 * 2. Backend must:
 *    - Call ABDM Gateway (https://dev.abdm.gov.in/gateway) with your client_id/client_secret.
 *    - Expose callback URLs for HIE-CM (auth init/confirm).
 *    - For "Verify ABHA by demographics": POST /v0.5/users/auth/init (purpose: KYC_AND_LINK, authMode: DEMOGRAPHICS),
 *      then handle /users/auth/on-init callback, then /users/auth/confirm and /users/auth/on-confirm to get link token.
 *    - For "Verify by OTP": use authMode: OTP and patient mobile.
 *
 * 3. Frontend can:
 *    - Let user enter ABHA number/address manually (this file's validation).
 *    - Scan ABHA QR (from ABHA app/card) – QR payload is JSON with abhaAddress, name, dob, gender; send to backend to get link token.
 *    - Call your backend to trigger OTP flow and then confirm.
 *
 * 4. After obtaining link token, use it when creating/linking care contexts (Milestone 2) so records are linked to the patient's ABHA.
 */
