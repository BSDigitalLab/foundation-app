# BSDL IMPLEMENTATION DIRECTIVE: ADMIN PORTAL KYC REVIEW CONSOLE

**Document Version:** 1.0.0  
**Target Application:** `bs_admin_portal` (Next.js 14, React 18, TailwindCSS)  
**Backend Gateways:** `bs_api_service` (`/api/v1/gateway/admin_portal/kyc/...`)  
**Date:** October 3, 2026  
**Status:** `READY_FOR_IMPLEMENTATION`

---

## 1. ADMIN MODULE INTEGRATION

Add a dedicated KYC review interface under the Organization / Channel Partners navigation menu:
```
bs_admin_portal -> Channel Partners -> Partner Applications (/partners/applications)
```

```
+-----------------------------------------------------------------------------------+
|                        PARTNER APPLICATIONS REVIEW CONSOLE                         |
+-----------------------------------------------------------------------------------+
| Filters: [ All ] [ Submitted (4) ] [ Correction Required (1) ] [ Approved (12) ]  |
+-----------------------------------------------------------------------------------+
| Partner Name      | Mobile / Email         | KYC Status | Submitted   | Actions   |
|-------------------+------------------------+------------+-------------+-----------|
| Rajesh Menon      | +91 98470 12345        | SUBMITTED  | 10 mins ago | [Review]  |
| Priya Nair        | +91 94471 67890        | SUBMITTED  | 1 hour ago  | [Review]  |
| Anand Kumar       | +91 98950 54321        | CORRECTION | Yesterday   | [View]    |
+-----------------------------------------------------------------------------------+
```

---

## 2. SINGLE-SCREEN REVIEW WORKSPACE

When a reviewer clicks `[Review]`, the portal presents a comprehensive single-screen review workspace. The reviewer does not need to jump between tabs or separate sub-pages.

```
+-----------------------------------------------------------------------------------+
| PARTNER APPLICATION REVIEW: Rajesh Menon (Ref: CP-2026-089)                       |
+-----------------------------------------------------------------------------------+
| SECTION 1: IDENTITY & PROFILE SUMMARY                                             |
| Name: Rajesh Menon       | Mobile: +91 98470 12345 [Verified]                     |
| Email: rajesh@domain.com [Verified] | District: Ernakulam, Kerala                 |
+-----------------------------------------------------------------------------------+
| SECTION 2: AADHAAR PILLAR VERIFICATION                                            |
| Number: XXXX XXXX 4512   | Front: [ View Document ]  Back: [ View Document ]     |
| [ ] Confirm Aadhaar details match identity                                        |
+-----------------------------------------------------------------------------------+
| SECTION 3: PAN PILLAR VERIFICATION                                                |
| Number: ABCDE4512K       | Document: [ View Document ]                            |
| [ ] Confirm PAN card is valid and unexpired                                       |
+-----------------------------------------------------------------------------------+
| SECTION 4: BANK ACCOUNT & PAYOUT PILLAR                                           |
| Holder: Rajesh Menon     | Account: ••••••••8912 | IFSC: SBIN0001234             |
| Bank: State Bank of India | Branch: Ernakulam South | Proof: [ View Passbook ]    |
| [ ] Confirm bank account holder matches partner identity                          |
+-----------------------------------------------------------------------------------+
| SECTION 5: AUDIT LOG TIMELINE                                                     |
| * Oct 03, 10:15 - Partner self-registered via YP Partner App                      |
| * Oct 03, 10:20 - Mobile and email verified                                       |
| * Oct 03, 10:45 - KYC submitted for verification                                  |
+-----------------------------------------------------------------------------------+
| ACTION BAR:                                                                       |
| [ Request Correction ]        [ Reject Application ]          [ Approve Partner ] |
+-----------------------------------------------------------------------------------+
```

---

## 3. REVIEW ACTION MODALS & WORKFLOWS

### Action 1: Document-Level Verification Checks
The reviewer must individually inspect and toggle checkmarks on:
* Aadhaar: Name match and document validity
* PAN: Name match and format authenticity
* Bank Account: Holder consistency and clear proof document

### Action 2: Request Correction Modal
* **Trigger:** Click `[ Request Correction ]`.
* **Inputs:**
  * Component Checklist:
    * `[x] Aadhaar Document`
    * `[x] PAN Document`
    * `[ ] Bank Proof`
    * `[ ] Profile Details`
  * Reason / Instructions: Free-text explanation (e.g. "The uploaded PAN card is illegible due to camera glare. Please upload a clear flat scan.")
* **Backend API:** `POST /api/v1/gateway/admin_portal/kyc/applications/{case_id}/request-correction`.
* **Outbox Event:** Enqueues `KYC_CORRECTION_REQUIRED` email notification to partner.

### Action 3: Rejection Modal
* **Trigger:** Click `[ Reject Application ]`.
* **Inputs:**
  * Controlled Reason Code (Dropdown):
    * `FRAUDULENT_DOCUMENT`
    * `NAME_MISMATCH_UNRESOLVABLE`
    * `POLICY_NON_COMPLIANCE`
    * `DUPLICATE_ACCOUNT`
  * Internal Compliance Notes: Mandatory explanation.
* **Backend API:** `POST /api/v1/gateway/admin_portal/kyc/applications/{case_id}/reject`.
* **Outbox Event:** Enqueues `PARTNER_REJECTED` notification.

### Action 4: Partner Approval
* **Trigger:** Click `[ Approve Partner ]`.
* **Pre-conditions:**
  * Reviewer must possess permission: `partner.kyc.approve` or `WORKFORCE.MANAGE`.
  * All 3 pillars must be toggled as verified.
  * No unresolved correction requests.
* **Backend API:** `POST /api/v1/gateway/admin_portal/kyc/applications/{case_id}/approve`.
* **Database Updates (Single Atomic Transaction):**
  ```sql
  UPDATE workforce.kyc_cases SET status = 'APPROVED', approved_at = NOW(), reviewed_by_account_id = :admin_id WHERE id = :case_id;
  UPDATE workforce.org_workforce_profiles SET status = 'ACTIVE', updated_at = NOW() WHERE id = :partner_profile_id;
  ```
* **Outbox Event:** Enqueues `PARTNER_APPROVED` email notification.

---

## 4. RBAC & PERMISSION SPECIFICATIONS

| Permission Code | Description | Role Assignments |
| :--- | :--- | :--- |
| `partner.kyc.view` | View partner applications and list data | `ORGANIZATION_ADMIN`, `COMPLIANCE_OFFICER` |
| `partner.kyc.review`| Open review screen and generate document URLs | `ORGANIZATION_ADMIN`, `COMPLIANCE_OFFICER` |
| `partner.kyc.request_correction` | Issue targeted correction requests | `ORGANIZATION_ADMIN`, `COMPLIANCE_OFFICER` |
| `partner.kyc.approve` | Formally approve KYC case | `ORGANIZATION_ADMIN` |
| `partner.kyc.reject` | Formally reject partner application | `ORGANIZATION_ADMIN` |

---
**Approved by:** Enterprise Architecture Governance Board
