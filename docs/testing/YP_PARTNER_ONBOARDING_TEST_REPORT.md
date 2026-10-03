# BSDL AUTOMATED TEST SUITE REPORT: PARTNER ONBOARDING & KYC

**Document Version:** 1.0.0  
**Test Authority:** Quality Assurance & Security Governance  
**Target Systems:** `bs_api_service`, `yp_executive_mobile`, `bs_admin_portal`  
**Test Framework:** Pytest 9.1+, FastAPI TestClient, SQLAlchemy Test Fixtures  
**Date:** October 3, 2026  
**Status:** `TEST_SUITE_CERTIFIED`

---

## 1. AUTOMATED TEST SUITE OVERVIEW

The automated test suite (`tests/partner/test_channel_partner_unified_onboarding.py`) exercises the complete partner lifecycle, from initial self-signup invitation to admin review, correction, approval, and access enablement.

```
+-----------------------------------------------------------------------------------+
|                        AUTOMATED TEST EXECUTION MATRIX                            |
+-----------------------------------------------------------------------------------+
| Test Module | Description                                     | Cases | Verdict   |
|-------------+-------------------------------------------------+-------+-----------|
| SUITE-01    | Self-Signup & Tenant Invitation Token Gating    | 6     | PASS      |
| SUITE-02    | Identity Verification (Mobile OTP + Email)      | 5     | PASS      |
| SUITE-03    | Mandatory KYC Validation & Bypass Prevention    | 8     | PASS      |
| SUITE-04    | Private Document Storage & Signed URL Security  | 4     | PASS      |
| SUITE-05    | Admin Review, Correction & Resubmission Cycle   | 5     | PASS      |
| SUITE-06    | Operational Feature Gatekeeping Pre/Post Status | 4     | PASS      |
| SUITE-07    | Multi-Tenant Isolation & Anti-Enumeration       | 4     | PASS      |
| SUITE-08    | Transactional Outbox & Worker Failure Isolation | 4     | PASS      |
+-----------------------------------------------------------------------------------+
| TOTAL       | End-to-End Governance Invariants Tested         | 40    | 100% PASS |
+-----------------------------------------------------------------------------------+
```

---

## 2. DETAILED TEST SCENARIO RESULTS

### Suite 01: Self-Signup & Tenant Association Security
* `test_self_signup_missing_invitation_rejected`: Confirms that registering without an invitation token or org code returns HTTP 400 (`INVITATION_REQUIRED`).
* `test_self_signup_tampered_tenant_id_blocked`: Confirms client cannot forge arbitrary `organization_id` (backend overrides from invitation payload).
* `test_self_signup_expired_invitation_fails`: Verifies expired token (> 72 hours) is rejected with HTTP 410 (`INVITATION_EXPIRED`).

### Suite 02: Identity Verification Gating
* `test_mobile_otp_challenge_and_verification`: Verifies phone number receives 6-digit OTP and marks `mobile_verified = TRUE`.
* `test_email_verification_token_cycle`: Validates asynchronous token creation, delivery to outbox, and return URL redirect into mobile continuation context.
* `test_cannot_proceed_to_kyc_unverified_email`: Confirms submitting KYC when `email_verified = FALSE` is rejected with HTTP 403 (`EMAIL_VERIFICATION_REQUIRED`).

### Suite 03: Mandatory KYC Backend Enforcement (Anti-Bypass)
* `test_kyc_submission_missing_aadhaar_rejected`: Confirms submission without Aadhaar number or document returns HTTP 422 (`AADHAAR_MANDATORY`).
* `test_kyc_submission_invalid_pan_format_rejected`: Confirms submitting PAN `12345ABCDE` (invalid regex) returns HTTP 422 validation failure.
* `test_kyc_submission_missing_bank_proof_rejected`: Confirms submission without bank passbook/cheque proof returns HTTP 422 (`BANK_PROOF_MANDATORY`).
* `test_kyc_submission_success_all_mandatory_fields`: Confirms valid submission with Aadhaar, PAN, and Bank details transitions case to `SUBMITTED`.

### Suite 04: Document Storage & Access Control
* `test_kyc_documents_not_publicly_accessible`: Verifies raw storage path returns HTTP 403 from direct object storage.
* `test_signed_url_requires_kyc_read_permission`: Confirms unprivileged user cannot generate signed download URL.
* `test_signed_url_has_5_minute_expiry`: Verifies signed URL contains strict expiration timestamp.

### Suite 05: Administrative Review & Correction Workflow
* `test_admin_request_correction_marks_case_and_document`: Verifies requesting correction on PAN sets case status to `CORRECTION_REQUIRED`.
* `test_partner_resubmission_updates_case_to_resubmitted`: Verifies partner uploading replacement PAN transitions case to `RESUBMITTED`.
* `test_admin_approval_activates_workforce_profile`: Verifies `POST /approve` updates `kyc_cases.status = 'APPROVED'` and `org_workforce_profiles.status = 'ACTIVE'` atomically.

### Suite 06: Operational Access Control Gatekeeper
* `test_operational_leads_endpoint_blocked_before_approval`: Partner in `ONBOARDING_ONLY` calling `GET /api/v1/gateway/yp_partner/leads` receives HTTP 403 (`PARTNER_ONBOARDING_INCOMPLETE`).
* `test_operational_leads_endpoint_allowed_after_approval`: Approved partner (`ACTIVE`) calling `GET /api/v1/gateway/yp_partner/leads` receives HTTP 200 OK.

---

## 3. SECURITY TESTING VERIFICATION

```
[TEST RESULT] IDOR Protection: Tested cross-tenant access to KYC cases -> REJECTED (HTTP 404 / 403)
[TEST RESULT] Sensitive Masking: Aadhaar displays as XXXX XXXX 1234 in admin listing -> CONFIRMED
[TEST RESULT] Banking Encryption: Account numbers encrypted with AES-256-GCM at rest -> CONFIRMED
[TEST RESULT] Email Failure Isolation: Simulation of SMTP connection timeout -> DB TX COMMITTED
```

---
**Certified by:** Platform Quality & Security Governance
