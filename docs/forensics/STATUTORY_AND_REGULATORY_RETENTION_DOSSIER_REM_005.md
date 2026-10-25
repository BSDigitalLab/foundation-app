# Yuvaparipalan Foundation — Statutory & Regulatory Retention Dossier
## Workstream: YPF-ACCOUNT-DELETION-MODEL-B-REM-005
**Platform:** Yuvaparipalan Platform - (Yuvaparipalan Foundation Platform)  
**Parent Directive:** `YPF-ACCOUNT-DELETION-MODEL-B-COMMIT-AND-REMEDIATION-025`  
**Document Identifier:** `STATUTORY_AND_REGULATORY_RETENTION_DOSSIER_REM_005.md`  
**Target Legal Authority:** Office of the General Counsel / External Legal Counsel  
**Governance Status:** **`PENDING WRITTEN LEGAL COUNSEL RATIFICATION`**  
**Production Status:** **STRICT HOLD — NO PRODUCTION PROMOTION, MIGRATION, OR DEPLOYMENT**

---

> [!IMPORTANT]
> **GOVERNANCE NOTICE:**  
> This dossier compiles all technical retention implementations, citations, and data categories currently configured across the Yuvaparipalan Platform. **None of the retention periods, pseudonymisation strategies, or statutory interpretations presented herein are to be construed as legally ratified.** All operational schedules remain strictly **provisional** until formal, written counsel ratification is executed under REM-005.

---

## 1. Inventory of Current Platform Retention Statements

The following statements represent the verbatim retention and erasure disclosures currently presented across the platform's client applications, administrative consoles, public privacy policies, and backend services.

### A. Consumer Deletion Portal (`apps/Foundation App/src/pages/DeleteAccountPage.tsx`)
> *"Immediate Access Suspension: Upon acceptance of this request, your account will immediately be suspended. You will not be able to log in while administrative review is underway."*  
> *"Administrator Review: Deletion is reviewed by authorized platform administrators to assess any active subscriptions, program enrolments, or pending financial records."*  
> *"Statutory Tax Retention: Payout vouchers, tax receipts, and commercial records must lawfully be retained for 8 financial years under Indian corporate and tax legislation with personal identifiers pseudonymised."*

### B. Public Privacy Policy (`apps/Foundation App/src/data/privacyPolicyData.ts` Section 07)
> *"Yuvaparipalan Foundation retains personal data only for as long as reasonably necessary to fulfil the purposes for which it was collected, subject to applicable legal and regulatory requirements."*  
> *"Account and profile data: Retained while an account is active and for the period reasonably necessary to complete deletion or resolve outstanding matters."*  
> *"Transaction and financial records: Retained for the period required by applicable accounting, tax, financial or other laws."*  
> *"Technical and security logs: Retained for a limited period appropriate to troubleshooting, security and legal requirements."*  
> *"We will delete or anonymise personal data that we are not legally required or otherwise lawfully permitted to retain."*

### C. Platform Administrative Review Console (`apps/Platform Console/src/applications/admin/widgets/access/AccountDeletionReviewWorkspace.tsx`)
> *"Statutory Retention Notice (Provisional pending REM-005 Legal Ratification): Commercial ledgers and books of account are marked for 8-year statutory retention. Personal identifiers will be erased under DPDPA 2023, leaving pseudonymised financial audit records. Statutory citations and retention policy remain provisional until formal written Legal Counsel ratification under REM-005."*  
> Checklist Item 5: *"5. 8-Year Financial Books Hold — Statutory books marked for pseudonymised retention (Provisional pending REM-005)"*

### D. Platform Backend Lifecycle Engine (`platform/Yuvaparipalan Platform/src/business_operating_services/privacy/orchestrator.py`)
> Intake Metadata: `statutory_retention = '8_YR_BOOKS_PRESERVED'`  
> Retention JSON: `{"corporateActPreserved": true, "taxActPreserved": true, "dpdpaPurgeCompliant": true, "statutoryHoldDurationYears": 8}`  
> Purge Assertion: Preserves financial voucher ledger records while wiping `identity.authentication_credentials` and replacing `identity.persons` identifiers with irreversible cryptographic hashes.

---

## 2. Four Outstanding Legal Interpretation Questions (Verbatim)

The following four questions are preserved verbatim from the authoritative Platform Governance Conformance Register (`CORE_PRIVACY_LEGAL_APPLICABILITY_AND_RETENTION_MATRIX.md` Section 4 and `Report 024` Section 3.2) for formal written determination by Legal Counsel:

```
1. Aadhaar/PAN Document Shredding vs. PMLA Hash Retention:
   Confirm whether cryptographic SHA-256 verification hashes of KYC documents satisfy 
   PMLA 2002 Rule 9(4) record-keeping obligations once the underlying biometric/identity 
   document blobs are shredded from S3 buckets.

2. Third-Party Messaging Processor Erasure:
   Confirm whether maintaining local suppression hashes without transmitting cleartext 
   phone numbers to external SMS vendors (MSG91) satisfies Section 8(7) / SPDI Rule 5 
   duty to notify downstream processors.

3. Pseudonymisation Defense under Companies Act:
   Ratify that replacing party names with surrogate transaction references (txn_party_<hash>) 
   in finance.transactions maintains complete evidential admissibility under Section 128 
   of the Companies Act and Section 65B of the Indian Evidence Act.

4. Interim SPDI vs. DPDP Enforcement:
   Confirm that adhering to SPDI Rules 2011 while proactively implementing DPDP Act 2023 
   architectural standards provides total legal defense during the transitional period 
   before MeitY commences DPDP Sections 2–44.
```

---

## 3. Data Categories & Proposed Lifecycle Behavior

| Category ID | Data Category & Scope | Applicable Database Tables & Stores | Current Implementation Proposal | Proposed Operational Lifecycle Action | Statutory Citation (Pending Verification) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **DC-01** | **Authentication Credentials & Tokens** | `identity.authentication_credentials`<br>`identity.user_sessions` | Hard wipe immediately upon purge execution | Permanent deletion (zero retention) | IT SPDI Rules 2011 Rule 5(7)<br>DPDPA 2023 Sec 8(7) |
| **DC-02** | **Direct Identity & PII** | `identity.user_accounts`<br>`identity.persons` | Overwrite names, email, phone with irreversible SHA-256 hashes | Irreversible pseudonymisation / nullification | IT SPDI Rules 2011 Rule 5(4)<br>DPDPA 2023 Sec 8(7) |
| **DC-03** | **Commercial Ledgers & Payout Vouchers** | `finance.transactions`<br>`finance.member_payouts`<br>`finance.commercial_ledger` | Retain debit/credit records with party IDs replaced by surrogate hashes | Retained for **8 Financial Years** from FY close | Companies Act 2013 Sec 128(5)<br>Income-tax Act Sec 44AA / Sec 62 |
| **DC-04** | **KYC Scans & Verification Documents** | `workforce.person_kyc_documents`<br>Object Storage (AWS S3) | Purge image/PDF files from object storage; preserve verification SHA-256 hash | S3 blob shredding; hash retained for **5 Years** | PMLA 2002 Rule 9(4)<br>RBI KYC Master Directions |
| **DC-05** | **Cryptographic Audit Logs & Chains** | `identity.account_deletion_audit_logs` | Write-once append-only ledger; protected by database trigger `P0001` | Permanent immutable retention (WORM target) | Evidence Act Sec 65B<br>Companies Act Sec 128 |
| **DC-06** | **Outbound Communication Suppression** | `platform_governance.communication_suppression_registry` | One-way SHA-256 hash of email/phone stored indefinitely | Retain hash indefinitely to block outbound marketing | DPDPA 2023 Sec 6(4)<br>SPDI Rules Rule 5(7) |
| **DC-07** | **ICT Security Telemetry & Access Logs** | `notifications.email_outbox`<br>Server access logs | Rolling window log purge; redact recipient phone/email | **Rolling 180 Days** within India | CERT-In Directions 2022 Dir 2(v) |

---

## 4. Legal Counsel Decision & Ratification Form

*(To be completed, signed, and dated in writing by Legal Counsel)*

### Counsel Determination 1: KYC Hash Retention vs. PMLA
- **Determination:** `[  ] APPROVED AS PROPOSED   [  ] REJECTED   [  ] CONDITIONALLY APPROVED`
- **Legal Directives / Mandatory Adjustments:**
- **Statutory Authority:**

### Counsel Determination 2: Downstream Processor Suppression (MSG91)
- **Determination:** `[  ] APPROVED AS PROPOSED   [  ] REJECTED   [  ] CONDITIONALLY APPROVED`
- **Legal Directives / Mandatory Adjustments:**
- **Statutory Authority:**

### Counsel Determination 3: Companies Act Pseudonymisation Evidential Standard
- **Determination:** `[  ] APPROVED AS PROPOSED   [  ] REJECTED   [  ] CONDITIONALLY APPROVED`
- **Legal Directives / Mandatory Adjustments:**
- **Statutory Authority:**

### Counsel Determination 4: Transitional SPDI Rules vs. DPDP Standard
- **Determination:** `[  ] APPROVED AS PROPOSED   [  ] REJECTED   [  ] CONDITIONALLY APPROVED`
- **Legal Directives / Mandatory Adjustments:**
- **Statutory Authority:**

### Formal Endorsement:
- **Counsel Name:** __________________________________________________
- **Bar Council Enrollment / Law Firm:** ______________________________
- **Signature:** ___________________________ **Date:** ________________

---

## 5. Traceability Matrix: Counsel Decision to Technical Remediation

| Decision Target | Affected Systems | Required Code / Migration Changes | Automated Test Verification |
| :--- | :--- | :--- | :--- |
| **Q1: KYC Document Shredding** | `workforce.person_kyc_documents`, S3 | S3 bucket lifecycle rule deleting image blobs; retention of `document_hash_sha256`. | Automated test asserting blob deletion and hash preservation. |
| **Q2: Messaging Processor Notification** | `platform_governance.privacy_outbox` | Verification of suppression dispatch without cleartext leak to MSG91 API. | Outbox processor unit test asserting SHA-256 payload masking. |
| **Q3: Financial Ledger Pseudonymisation** | `finance.transactions`, `finance.commercial_ledger` | Ensure `party_usr_<hash>` replaces person ID on final purge execution. | Purge integration test asserting financial balance preserved and PII removed. |
| **Q4: SPDI / DPDP Notice Alignment** | `DeleteAccountPage.tsx`, `privacyPolicyData.ts` | Update public consumer disclosures once legal wording is ratified. | Jest UI snapshot and disclosure accessibility verification. |
