# YPF-LEGAL-CENTRE-PLATFORM-GOVERNANCE-001
# LEGAL POLICY IMPLEMENTATION MATRIX: CURRENT VS TARGET ARCHITECTURE

**Document Identifier:** `LEGAL_POLICY_IMPLEMENTATION_MATRIX.md`  
**Classification:** Engineering & Governance Implementation Blueprint  
**Authority:** Platform Architecture & Legal Compliance  
**Effective Baseline:** October 25, 2026  
**Status:** `IMPLEMENTED & VERIFIED — PHASE 1 & 2 COMPLETE`

---

## 1. COMPREHENSIVE CURRENT-TO-TARGET POLICY MATRIX

| Policy / Workflow Domain | Current Route | Target Canonical Route | Source Data Module | Presentation Component | Statutory Authority / Benchmark | Compliance State | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Legal Centre Hub** | *None* (Plain text in breadcrumb) | `/legal-centre` (alias `/legal`) | `src/data/legalCentreData.ts` | `LegalCentrePage.tsx` | Platform Governance Standard | **VERIFIED (OCT 2026)** | Implemented lazy-loaded card catalog; wired `/legal-centre` and `/legal` alias. Displays Governance and Safeguarding Committee (Committee Head: Biju Sivanand, bijusivanand@gmail.com). |
| **Privacy Policy** | `/privacy-policy` | `/privacy-policy` | `src/data/privacyPolicyData.ts` | `PrivacyPolicyPage.tsx` | DPDP Act 2023, IT Act 2000 (SPDI Rules) | **VERIFIED (OCT 2026)** | 13 canonical sections dated 25 Oct 2026; clickable breadcrumb to `/legal-centre`. |
| **Terms & Conditions** | `/terms-and-conditions`, `/terms` | `/terms-and-conditions` (alias `/terms`) | `src/data/termsConditionsData.ts` | `TermsConditionsPage.tsx` | Indian Contract Act 1872, Companies Act 2013 | **VERIFIED (OCT 2026)** | 21 canonical sections dated 25 Oct 2026; clickable breadcrumb to `/legal-centre`. |
| **Child Protection & Safeguarding** | *None* (Briefly in Privacy Sec 03) | `/child-safeguarding` | `src/data/childSafeguardingData.ts` | `ChildSafeguardingPage.tsx` | POCSO Act 2012, Juvenile Justice Act 2015 | **VERIFIED (OCT 2026)** | 11 canonical sections implemented; 3-tier escalation (112/1098); cites Governance and Safeguarding Committee (Committee Head: Biju Sivanand); DSO appointment pending. |
| **Prevention of Sexual Harassment (POSH)** | *None* | `/posh` | `src/data/poshPolicyData.ts` | `POSHPolicyPage.tsx` | POSH Act 2013, UGC/AICTE Guidelines | **VERIFIED (OCT 2026)** | 12 canonical sections; 90-day inquiry mandate & Section 16 confidentiality; Section 6 Local Committee route; Presiding Officer statutory woman restriction enforced. |
| **Acceptable Use Policy (AUP)** | *None* (Embedded in Terms Sec 05) | `/acceptable-use` | `src/data/acceptableUseData.ts` | `AcceptableUsePage.tsx` | IT Act 2000 (Intermediary Guidelines 2021) | **VERIFIED (OCT 2026)** | 8 canonical sections implemented; app-store compliance ready. |
| **Account Deletion & Data Erasure** | `/delete-account` | `/delete-account` | N/A (Dynamic stateful UI) | `DeleteAccountPage.tsx` | Google Play & Apple App Store Deletion Mandates, DPDP 2023 | **FUNCTIONAL & AUDITED** | Preserved operational workflow; staging endpoints verified; store console registration pending production release. |
| **Communications & Unsubscribe** | `/unsubscribe` | `/unsubscribe` | N/A (Token / OTP engine) | `UnsubscribePage.tsx` | Telecom Commercial Communications Customer Preference Reg (TRAI) | **FUNCTIONAL & AUDITED** | Preserved operational anti-scanner GET token resolver and scope selector. |
| **Footer Navigation** | Global | Global (`Footer.tsx`) | Hardcoded in `Footer.tsx` | `Footer.tsx` | Consumer Protection & Accessibility Guidelines | **VERIFIED (OCT 2026)** | Expanded footer to include links to Legal Centre, Privacy, Terms, Child Safeguarding, POSH, and Delete Account. |

---

## 2. CROSS-POLICY CONSISTENCY MATRIX

| Governance Dimension | Privacy Policy | Terms & Conditions | Child Safeguarding | POSH Policy | Acceptable Use Policy | Consistency Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Legal Entity** | Yuvaparipalan Foundation (Section 8) | Yuvaparipalan Foundation (Section 8) | Yuvaparipalan Foundation (Section 8) | Yuvaparipalan Foundation (Section 8) | Yuvaparipalan Foundation (Section 8) | **100% Consistent** |
| **CIN** | `U85500TZ2026NPL039757` | `U85500TZ2026NPL039757` | `U85500TZ2026NPL039757` | `U85500TZ2026NPL039757` | `U85500TZ2026NPL039757` | **100% Consistent** |
| **DARPAN ID** | `TN/2026/1152475` | `TN/2026/1152475` | `TN/2026/1152475` | `TN/2026/1152475` | `TN/2026/1152475` | **100% Consistent** |
| **Registered Address** | Coimbatore, Tamil Nadu – 641035 | Coimbatore, Tamil Nadu – 641035 | Coimbatore, Tamil Nadu – 641035 | Coimbatore, Tamil Nadu – 641035 | Coimbatore, Tamil Nadu – 641035 | **100% Consistent** |
| **Primary Contact Email** | `support@yuvaparipalan.org` | `support@yuvaparipalan.org` | `support@yuvaparipalan.org` | `support@yuvaparipalan.org` | `support@yuvaparipalan.org` | **100% Consistent (Zero Typos)** |
| **Effective Date** | October 25, 2026 | October 25, 2026 | October 25, 2026 | October 25, 2026 | October 25, 2026 | **Harmonized** |
| **Governing Law** | Laws of India (Jurisdiction: Coimbatore) | Laws of India (Jurisdiction: Coimbatore) | POCSO Act 2012 / Laws of India | POSH Act 2013 / Laws of India | IT Act 2000 / Laws of India | **Harmonized** |
| **Account Deletion Cross-ref** | Section 07 links to `/delete-account` | Section 13 links to `/delete-account` | N/A | N/A | Violations lead to termination | **Aligned** |

---

## 3. ZERO-ARCHITECTURAL-CHANGE IMPLEMENTATION PLAN

To guarantee **zero unauthorized architectural changes**, the implementation adhered strictly to these controls:
1. **Zero Database Migrations:** All policy structures are represented in typed TypeScript data objects (`LegalDocument` interface). Zero database tables or schema changes were introduced.
2. **Zero IAM / Auth Modifications:** Customer auth store (`useCustomerAuthStore.ts`) and RBAC models remain untouched.
3. **Preserved Visual Conventions:** 
   - Amber/Emerald gradient badge ("Official Institutional Document")
   - Breadcrumb navigation (`Home > Legal Centre > [Page]`)
   - 2-column hero with Organization Identity Card (CIN, DARPAN ID, Address, Email)
   - Numbered section cards (`p-6 sm:p-8 rounded-3xl bg-white border shadow-sm`)
   - Floating "Back to Top" button
   - Cross-navigation cards at bottom of article
4. **Clean Code Reusability:**
   - Shared data files export structured data complying with the proven `LegalDocument` TypeScript interface.
   - Dedicated pages mirror the layout without introducing unvetted third-party libraries.

---

## 4. PHASE EXECUTION GATE CHECKLIST

- [x] Application surfaces identified and audited (Public Web, API Gateway, Channelpreneur, Community App).
- [x] Account lifecycle and deletion mechanics inspected (`DeleteAccountPage.tsx`, `/api/v1/privacy/account-deletion`).
- [x] Statutory identity verified (CIN: `U85500TZ2026NPL039757`, DARPAN: `TN/2026/1152475`).
- [x] Forensic discovery report generated (`docs/forensics/LEGAL_CENTRE_FORENSIC_DISCOVERY_REPORT.md`).
- [x] Current-to-target policy implementation matrix generated and updated (`docs/forensics/LEGAL_POLICY_IMPLEMENTATION_MATRIX.md`).
- [x] Contact email typo resolved; automated test asserts 0 occurrences of `support@yuvapariapaln.org`.
- [x] Institutional approval of Phase 0 gate decision received.
- [x] Phase 1 Canonical Legal Centre Hub implemented (`/legal-centre`, alias `/legal`).
- [x] Phase 2 Policy Pages implemented (`/child-safeguarding`, `/posh`, `/acceptable-use`).
- [x] Footer navigation and legal page breadcrumbs updated.
- [x] Test suite created and executed (45/45 tests passing).
- [x] Production build executed (`tsc -b && vite build` built in 2.15s, 0 errors).
- [x] Complete forensic reporting suite created in `docs/forensics/`.
