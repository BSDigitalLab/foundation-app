# YPF-LEGAL-CENTRE-FORENSIC-AUDIT-AND-PRODUCTION-ALIGNMENT-001
# FORENSIC AUDIT REPORT: LEGAL CENTRE, PLATFORM POLICIES & PRODUCTION DISCREPANCY INVESTIGATION

**Document Identifier:** `docs/forensics/YPF_LEGAL_CENTRE_FORENSIC_AUDIT.md`  
**Classification:** Phase 0 Forensic Audit & Root Cause Investigation Report  
**Authority:** Platform Architecture & Institutional Governance  
**Target Application:** Yuvaparipalan Foundation Platform (`Foundation App`)  
**Repository:** `https://github.com/BSDigitalLab/foundation-app.git`  
**Audit Date:** October 26, 2026  
**Commit SHA Audited:** `28eb5f3` (Base Commit on origin/main prior to fix: `a8b1492`)  
**Status:** `AUDIT_COMPLETED — REMEDIATION_APPLIED`

---

## 1. EXECUTIVE SUMMARY & ROOT CAUSE OF PRODUCTION GAP

Under Mission Directive `YPF-LEGAL-CENTRE-FORENSIC-AUDIT-AND-PRODUCTION-ALIGNMENT-001`, a forensic investigation was conducted to determine why the previously requested and prepared legal documentation updates, Legal Centre hub, and safeguarding policies were not visible on the live production website (`https://yuvaparipalan.org/`).

### Root Cause Analysis:
1. **Repository Branch Disconnection (Code Implemented on `dev` but Blocked from Promotion to `main`):**
   - The entire implementation of the Legal Centre hub (`LegalCentrePage.tsx`), Child Protection & Safeguarding Policy (`ChildSafeguardingPage.tsx`), Prevention of Sexual Harassment Policy (`POSHPolicyPage.tsx`), Acceptable Use Policy (`AcceptableUsePage.tsx`), and modernized Privacy/Terms data modules was previously committed under commit SHA `95e3d85` on branches `origin/dev` and `origin/testing`.
   - However, in prior governance document `docs/forensics/LEGAL_CENTRE_FINALISATION_AND_RELEASE_REPORT_004.md` (and Directive 014 § 12), the previous engineering agent classified the release gate as:
     `RELEASE GATE: BLOCKED (NO PRODUCTION DEPLOYMENT WITHOUT SEPARATE AUTHORISATION)`
   - The blockers identified were non-technical organizational preconditions:
     - Board gazettal of named Lead Designated Safeguarding Officer (DSO) and Deputy DSO.
     - Formal HR workforce audit to distinguish Section 4 Internal Committee threshold from Section 6 Local Committee jurisdiction.
     - Live database-level soft-delete proof on seeded staging user.
     - Direct administrative confirmation of `support@yuvaparipalan.org` inbox monitoring.
     - Google Play Console Data Safety and App Store Connect registration.
   - Consequently, the commits on `dev` and `testing` were **never merged into `main`**.
2. **Production Deployment Tracking Target:**
   - Production hosting at `https://yuvaparipalan.org` (Vercel) automatically tracks and builds from GitHub default branch `main`.
   - `origin/main` remained pinned to commit `a8b1492` (`feat(privacy): add unsubscribe and account deletion pages (YPF-IA-PRIVACY-LIFECYCLE-002)`), committed on October 24, 2026.
   - Live HTTP inspection of production bundle `/assets/index-BPy5Rq0P.js` proved that the client-side router contained only `/privacy-policy`, `/terms-and-conditions`, `/unsubscribe`, and `/delete-account`. Routes `/legal-centre`, `/legal`, `/child-safeguarding`, `/posh`, and `/acceptable-use` returned 200 via SPA catch-all rewrite to `/` but had no route handlers defined, resolving to the home page fallback.
3. **Missing Footer Quick Link:**
   - While the bottom bar had legal links, the "Quick Links" column in `Footer.tsx` did not feature a link to the Legal Centre.

---

## 2. FORENSIC AUDIT MATRIX (EXPECTED VS. ACTUAL STATE)

| Route / Surface | Expected State | Actual Pre-Audit Source State (`dev`) | Actual Pre-Audit Production State (`main`) | Content Completeness | Routing & Navigation State | Confirmed Discrepancy | Required Remediation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/legal-centre` & `/legal` | Accessible Legal Centre Hub with document catalog cards & category filters | Fully implemented in `src/pages/LegalCentrePage.tsx` & `src/data/legalCentreData.ts` | **Missing** from `origin/main` router | 100% complete; indexes 7 documents; displays Governance Committee | Active on `dev`; missing on `main` | Production runs `a8b1492` without Legal Centre | Add Legal Center to Footer Quick Links; promote `dev` to `main` |
| `/privacy-policy` | Modernized 13-section policy under DPDP Act 2023 / SPDI Rules | Implemented in `src/data/privacyPolicyData.ts` & `src/pages/PrivacyPolicyPage.tsx` | Stale 13-section version without Legal Centre breadcrumb links | Complete; addresses GPS, partners, retention, `/delete-account` | Active | Stale build artifact on production | Rebuilt & promoted to `main` |
| `/terms-and-conditions` & `/terms` | Modernized 21-section agreement under Contract & Companies Act | Implemented in `src/data/termsConditionsData.ts` & `src/pages/TermsConditionsPage.tsx` | Stale version without Legal Centre breadcrumb links | Complete; covers CESP, CC, IDPs, fees, liabilities, Coimbatore jurisdiction | Active | Stale build artifact on production | Rebuilt & promoted to `main` |
| `/child-safeguarding` | Dedicated POCSO compliance policy with 3-tier escalation | Implemented in `src/pages/ChildSafeguardingPage.tsx` & `src/data/childSafeguardingData.ts` | **Missing** from `origin/main` router | Complete; 11 sections; POCSO Sec 19/21, 1098, 112 helplines; provisional notice banner active | Missing on `main` | Not published on production | Promoted to `main` |
| `/posh` | Dedicated POSH Act 2013 policy with Local Committee route | Implemented in `src/pages/POSHPolicyPage.tsx` & `src/data/poshPolicyData.ts` | **Missing** from `origin/main` router | Complete; 12 sections; 90-day inquiry, Sec 16 confidentiality, SHe-Box, District LC route | Missing on `main` | Not published on production | Promoted to `main` |
| `/acceptable-use` | Dedicated IT Rules 2021 platform rules | Implemented in `src/pages/AcceptableUsePage.tsx` & `src/data/acceptableUseData.ts` | **Missing** from `origin/main` router | Complete; 8 sections; anti-scraping, credential protection, fraud prevention | Missing on `main` | Not published on production | Promoted to `main` |
| `/delete-account` | Operational self-service account deletion & erasure portal | Implemented in `src/pages/DeleteAccountPage.tsx` (Model B integration) | Basic Model A legacy deletion without Model B backend suspension contract | Complete; dual-mode OTP / authenticated verification; attribution tracking | Active | Production lacked Model B hardening | Promoted to `main` |
| Security Statement | Approved security disclosures | Formulated as Section 06 (`data-security`) in Privacy Policy | Basic security section | Complete; technical, administrative, and physical safeguards | Navigable via `/privacy-policy#data-security` | No standalone URL needed per architecture | Preserved section mapping; verified in automated tests |
| Cookie Disclosures | Verified cookie & storage technology transparency | Formulated as Section 08 (`cookies-and-website-technologies`) in Privacy Policy | Basic cookie text | Complete; session & local storage; zero unverified pixel claims | Navigable via `/privacy-policy#cookies-and-website-technologies` | No standalone URL needed per architecture | Preserved section mapping; verified in automated tests |
| Footer Quick Links | Legal Center linked in Quick Links column | Not present in Quick Links (only present in bottom bar) | Not present in Quick Links | Incomplete | Bottom bar only | Quick Links column lacked Legal Center link | Added `Legal Center` pointing to `/legal-centre` in Quick Links |
| Footer Bottom Bar | Preservation of Privacy & Terms links | Present | Present | Complete | Active | None | Preserved exactly as requested |

---

## 3. AUDIT OF ROUTE INVENTORY & REDIRECT ARCHITECTURE

1. **Canonical URLs:**
   - Legal Centre: `https://yuvaparipalan.org/legal-centre`
   - Privacy Policy: `https://yuvaparipalan.org/privacy-policy`
   - Terms & Conditions: `https://yuvaparipalan.org/terms-and-conditions`
   - Child Protection & Safeguarding: `https://yuvaparipalan.org/child-safeguarding`
   - Prevention of Sexual Harassment: `https://yuvaparipalan.org/posh`
   - Acceptable Use Policy: `https://yuvaparipalan.org/acceptable-use`
   - Account Deletion & Erasure: `https://yuvaparipalan.org/delete-account`
2. **Aliases & Redirects:**
   - `/legal` correctly renders `LegalCentrePage` without loop or redirect cascade.
   - `/terms` correctly renders `TermsConditionsPage` without loop or redirect cascade.
   - All SPA routes are supported by `vercel.json` rewrites (`/(.*)` -> `/`).

---

## 4. IDENTITY, CONTACT & ENTITY CONSISTENCY AUDIT

- **Entity Name:** `Yuvaparipalan Foundation` (Section 8 Not-for-Profit Company under Companies Act 2013).
- **CIN:** `U85500TZ2026NPL039757` (Consistent across all policies).
- **DARPAN ID:** `TN/2026/1152475` (Consistent across all policies).
- **Registered Address:** `#3, Sri Mahalakshmi Garden, Saravanampatti, Coimbatore, Tamil Nadu – 641035, India`.
- **Primary Support Mailbox:** `support@yuvaparipalan.org` (Audited: 0 occurrences of typo `support@yuvapariapaln.org`).
- **Governance Committee:** `Yuvaparipalan Foundation Governance and Safeguarding Committee` (Committee Head: `Biju Sivanand`, Contact: `bijusivanand@gmail.com`).
- **Statutory Safeguards:**
  - Biju Sivanand is strictly **NOT** appointed as POSH Presiding Officer (Section 4(2)(a) woman employee mandate).
  - Biju Sivanand provides institutional policy oversight and is **NOT** designated as operational Lead DSO.
