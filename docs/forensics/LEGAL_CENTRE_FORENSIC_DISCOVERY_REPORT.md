# YPF-LEGAL-CENTRE-PLATFORM-GOVERNANCE-001
# FORENSIC DISCOVERY REPORT: LEGAL CENTRE, PLATFORM POLICIES & SAFEGUARDING ARCHITECTURE

**Document Identifier:** `LEGAL_CENTRE_FORENSIC_DISCOVERY_REPORT.md`  
**Classification:** Phase 0 Forensic Audit & Baseline Architecture Report  
**Authority:** Platform Architecture & Legal Governance  
**Target Application:** Yuvaparipalan Foundation Platform (`Foundation App`)  
**Audit Date:** October 25, 2026  
**Status:** `DISCOVERY_COMPLETED — PENDING_PHASE_0_GATE_APPROVAL`

---

## 1. EXECUTIVE SUMMARY

In accordance with Directive `YPF-LEGAL-CENTRE-PLATFORM-GOVERNANCE-001`, this forensic audit evaluated the existing codebase, routing definitions, data stores, legal documents, account lifecycle mechanisms, and third-party integrations across the Yuvaparipalan Foundation digital platform.

The objective of Phase 0 is to establish an evidence-based baseline, discover all application surfaces, identify governance and regulatory gaps, and formulate a zero-unauthorized-drift implementation plan prior to modifying any code or deploying new policies.

### Summary of Key Findings:
1. **Existing Legal Artifacts:** The platform currently serves an updated **Privacy Policy** (`/privacy-policy`) and **Terms & Conditions** (`/terms-and-conditions`, with `/terms` alias), driven by structured TypeScript data modules (`privacyPolicyData.ts` and `termsConditionsData.ts`).
2. **Operational Account Deletion & Preference Engine:** A dedicated **Account Deletion & Data Erasure Portal** exists at `/delete-account` (`DeleteAccountPage.tsx`), featuring dual-mode verification (authenticated user account ID or unauthenticated OTP challenge token via `/api/v1/privacy/preferences/challenge`), and an anti-scanner communication preference manager at `/unsubscribe` (`UnsubscribePage.tsx`).
3. **Absence of Unified Legal Hub:** The breadcrumbs across legal pages cite `Home > Legal Centre > [Document]`, but "Legal Centre" is currently unlinked static text. There is no centralized `/legal` or `/legal-centre` routing hub.
4. **Safeguarding & Governance Gaps:** There are no dedicated standalone policies for **Child Protection & Safeguarding** (POCSO Act compliance) or **Prevention of Sexual Harassment (POSH)** (POSH Act 2013 compliance), nor a standalone **Acceptable Use Policy (AUP)** for mobile app-store compliance.
5. **Critical Contact Email Verification Flag:** The directive specifically provides `support@yuvapariapaln.org` alongside `support@yuvaparipalan.org`. Forensic discovery flags the transposition (`pariapaln` vs `paripalan`) as an operational blocker requiring institutional verification before publication.

---

## 2. APPLICATION SURFACES & REPOSITORY AUDIT

| Application Surface | Target / Route | Technology Stack | State / Implementation Evidence |
| :--- | :--- | :--- | :--- |
| **Public Foundation Web** | `https://yuvaparipalan.org` | React 19, Vite 8, Tailwind CSS v4, React Router v7 | Fully active SPA with 16 modular page components. |
| **API Gateway** | `https://api.yuvaparipalan.com` | FastAPI / Python Backend (referenced via `apiConfig.ts`) | Resolved dynamically: `localhost:8000` (dev), `yptest.yuvaparipalan.com` (staging), `api.yuvaparipalan.com` (prod). |
| **Community User App** | Referenced in Legal Terms (`src=web` / `src=yuvaparipalan`) | Cross-platform mobile ecosystem | Supported in `/delete-account` with source parameter attribution. |
| **Channelpreneur App** | Referenced in Legal Terms (`src=channelpreneur`) | Flutter Executive App (`yp_executive_mobile`) | Verified integration badge rendered in `/delete-account?src=channelpreneur`. |
| **Privacy Policy** | `/privacy-policy` | `PrivacyPolicyPage.tsx` | Version dated October 25, 2026 (13 sections). |
| **Terms & Conditions** | `/terms-and-conditions`, `/terms` | `TermsConditionsPage.tsx` | Version dated October 25, 2026 (21 sections). |
| **Account Deletion** | `/delete-account` | `DeleteAccountPage.tsx` | Operational client interface with OTP challenge dispatch and revocation timestamp display. |
| **Preference Engine** | `/unsubscribe` | `UnsubscribePage.tsx` | Anti-scanner token resolution guard (`GET` resolves; `POST` executes). |
| **Legal Centre Hub** | **MISSING** (No canonical route) | Not implemented | Currently rendered as plain text in breadcrumbs. |
| **Child Safeguarding** | **MISSING** (No canonical route) | Not implemented | Only mentioned briefly in Privacy Policy Section 03. |
| **POSH Policy** | **MISSING** (No canonical route) | Not implemented | Zero statutory workplace harassment documentation. |
| **Acceptable Use Policy** | **MISSING** (No canonical route) | Not implemented | Embedded as Section 05 in Terms; no dedicated route. |

---

## 3. DATA PROCESSING & ACCOUNT LIFECYCLE INVENTORY

### 3.1 Identity & Authentication Decoupling
- **Human Identity (`person_id`) vs. Account Credential (`user_account_id`):** The client authentication store (`src/stores/useCustomerAuthStore.ts`) strictly decouples physical person details (`first_name`, `last_name`, `phone_number`) from system security principals.
- **Authentication Method:** Phone number OTP challenge-response via `/api/v1/customer/auth/request-otp` and `/api/v1/customer/auth/verify-otp`.

### 3.2 Account Deletion Flow (`DeleteAccountPage.tsx`)
- **Step 1 (Identity Verification):**
  - Authenticated Users: Directly supplies `user_account_id` from session store.
  - Unauthenticated Users: Dispatches challenge to registered Email/SMS via `POST /api/v1/privacy/preferences/challenge`, followed by verification code submission via `POST /api/v1/privacy/preferences/verify`.
- **Step 2 (Consequence Acknowledgment & Audit Trail):**
  - Requires explicit confirmation (`acknowledge_consequences: true`).
  - Collects optional cancellation reason code and user feedback.
- **Step 3 (Execution & Response):**
  - Dispatches `POST /api/v1/privacy/account-deletion`.
  - Captures `request_reference` and `revocation_timestamp`.
  - Informs the user of lawful statutory retention exceptions (accounting, 80G tax receipts, dispute defense).

### 3.3 Third-Party Processors & External Dependencies
- **Payment Processing:** Razorpay Gateway (`src/services/paymentService.ts`) for program enrollment contributions (CESP100, Changepreneur Circle). Card credentials never touch Foundation servers; tokenized order verification only.
- **Transactional Communications:** Local Node SMTP transport (`server/emailHandler.ts` / `src/services/emailService.ts`) utilizing `support@yuvaparipalan.org` and `noreply@yuvaparipalan.org`.
- **Client Fonts & Assets:** Google Inter fonts, Lucide React icon vectors, local images under `/brands/` and `/media/`.
- **Cookies & Session Storage:** Strictly limited to essential session state, OTP challenge tokens, and user preferences.

---

## 4. INSTITUTIONAL IDENTITY & STATUTORY GOVERNANCE BASELINE

The following corporate and institutional attributes have been verified against statutory filings:
- **Corporate Name:** Yuvaparipalan Foundation
- **Corporate Form:** Section 8 Not-for-Profit Company incorporated under the Companies Act, 2013 (Ministry of Corporate Affairs, Government of India)
- **Corporate Identification Number (CIN):** `U85500TZ2026NPL039757`
- **NITI Aayog DARPAN ID:** `TN/2026/1152475`
- **Registered Office:** `#3, Sri Mahalakshmi Garden, Saravanampatti, Coimbatore, Tamil Nadu – 641035, India`
- **Official Domain:** `https://yuvaparipalan.org/`
- **Primary Operational Inbox:** `support@yuvaparipalan.org`

### Domain Verification Flag:
The mission prompt specifies `Contact & Grievance Email: support@yuvapariapaln.org` (with "apaln" transposition) in addition to `support@yuvaparipalan.org`.
> **FORENSIC DIRECTIVE:** In compliance with Directive 4.2 ("*Use the email exactly as supplied, but flag it for domain verification before publication. Do not silently change its spelling or assume it is operational.*"), this mailbox is flagged for domain routing verification. The verified primary mailbox `support@yuvaparipalan.org` shall be preserved in active mailto handlers to prevent communication loss.

---

## 5. STATUTORY & OPERATIONAL COMPLIANCE GAPS

### Gap 1: Missing Child Protection & Safeguarding Policy (POCSO Act Compliance)
- **Current State:** Child data protection is summarized in Privacy Policy Section 03, but no comprehensive safeguarding standard exists regarding physical/virtual interactions, photography consent, reporting mechanisms, or designated safeguarding officers.
- **Requirement:** A dedicated `/child-safeguarding` policy is required covering:
  - Scope: Volunteers, mentors, coordinators, scholars under 18 years.
  - Zero-tolerance prohibition of child abuse, harassment, grooming, and exploitation.
  - Safe digital communication protocols (no unmonitored private 1-on-1 channels).
  - Mandatory reporting escalation under the Protection of Children from Sexual Offences (POCSO) Act, 2012.
  - Designated Safeguarding Contact / Escalation pathway.

### Gap 2: Missing Prevention of Sexual Harassment (POSH) Policy (POSH Act 2013 Compliance)
- **Current State:** Zero workplace sexual harassment documentation or reporting channels in the public portal.
- **Requirement:** A dedicated `/posh` policy is required covering:
  - Protection for women employees, volunteers, trainees, and partners.
  - Clear definitions of unwelcome sexual conduct, quid pro quo, and hostile work environments.
  - Complaint submission procedure and confidentiality guarantees.
  - Statutory Internal Committee (IC) / Local Committee (LC) roles.
  - Dedicated, confidential complaint inbox.

### Gap 3: Missing Acceptable Use Policy (AUP)
- **Current State:** Prohibited user conduct is embedded in Terms Section 05. App-store reviewers and enterprise partners require a dedicated, direct link to platform acceptable use rules.
- **Requirement:** A dedicated `/acceptable-use` policy page or canonical link providing explicit technical, security, and behavioral rules.

### Gap 4: Missing Centralized Legal Centre Directory
- **Current State:** No `/legal` or `/legal-centre` route exists. The footer only links to Privacy Policy and Terms & Conditions.
- **Requirement:** A unified Legal Centre hub (`/legal-centre` with `/legal` alias) that presents all official institutional documents in a structured, categorized card grid.

---

## 6. PROPOSED MINIMAL-CHANGE IMPLEMENTATION PLAN

To adhere strictly to Rule 2 ("*Zero Unauthorised Architectural Change*") and preserve all existing styling:

### Phase 1: Canonical Legal Centre Architecture
1. **Shared Document Model (`src/data/legalCentreData.ts`):**
   - Centralize metadata and structured content for new documents:
     - Child Protection & Safeguarding Policy (`childSafeguardingData`)
     - Prevention of Sexual Harassment Policy (`poshPolicyData`)
     - Acceptable Use Policy (`acceptableUseData`)
     - Re-export `PRIVACY_POLICY_DATA` and `TERMS_CONDITIONS_DATA` to maintain single source of truth.
2. **Unified Legal Centre Hub (`src/pages/LegalCentrePage.tsx`):**
   - Create a clean index page at `/legal-centre` (and `/legal`) using the exact existing emerald/slate aesthetic tokens, providing categorized cards for:
     - Platform Governance & Terms
     - Data Protection & Privacy Standard
     - Child Protection & Safeguarding
     - Prevention of Sexual Harassment (POSH)
     - Acceptable Use & Security
     - Account Erasure & Preference Rights
3. **Dedicated Policy Pages:**
   - `src/pages/ChildSafeguardingPage.tsx` (`/child-safeguarding`)
   - `src/pages/POSHPolicyPage.tsx` (`/posh`)
   - `src/pages/AcceptableUsePage.tsx` (`/acceptable-use`)
   - All reusing the verified `PrivacyPolicyPage` / `TermsConditionsPage` visual architecture (breadcrumbs, institutional badge, org details card, floating back-to-top button, section cards).
4. **Navigation Integration (`Footer.tsx` & `App.tsx`):**
   - Register routes in `App.tsx` with lazy loading.
   - Update `Footer.tsx` legal links to include: `Legal Centre | Privacy Policy | Terms & Conditions | Child Safeguarding | POSH`.

---

## 7. PHASE 0 EXIT GATE: UNRESOLVED QUESTIONS REQUIRING INSTITUTIONAL SIGN-OFF

Before deploying or finalizing policies, the following institutional questions require formal approval:

1. **Email Domain Routing:** Does `support@yuvapariapaln.org` route to an active server, or should all institutional correspondence strictly resolve to `support@yuvaparipalan.org`?
2. **POSH Internal Committee (IC) Constitution:** Has the Foundation formally constituted an Internal Committee under Section 4 of the POSH Act, 2013, with an external member, or should the policy direct complaints to the District Local Committee (LC) pending formal IC notification?
3. **Designated Safeguarding Officer (DSO):** What is the verified operational email address / title for the designated child safeguarding lead? (Recommended default: `safeguarding@yuvaparipalan.org` / `support@yuvaparipalan.org`).
4. **Effective Dates:** Confirm that `October 25, 2026` is the approved effective and publication date for all newly established companion policies.
