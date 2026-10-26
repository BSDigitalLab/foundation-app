# YPF-LEGAL-CENTRE-FORENSIC-AUDIT-AND-PRODUCTION-ALIGNMENT-001
# LEGAL POLICY CONTENT AND SUBSTANTIVE CLAUSE MATRIX

**Document Identifier:** `docs/forensics/YPF_LEGAL_POLICY_CONTENT_AND_CLAUSE_MATRIX.md`  
**Classification:** Policy Clause Traceability, Cross-Reference & Statutory Verification Register  
**Authority:** Platform Architecture & Institutional Governance  
**Repository Location:** `src/data/`, `src/pages/`  
**Baseline Effective Date:** October 25, 2026 / October 26, 2026  
**Commit SHA:** `28eb5f3`  
**Status:** `VERIFIED & RECONCILED`

---

## 1. CLAUSE SOURCE & TRACEABILITY MATRIX

| Clause / Subject Area | Policy Document | Section & ID | Source / Legal Basis | Cross-References | Implementation & Approval Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Corporate Identity & Form** | All Policies | Preamble & Identity Card | Companies Act 2013 (Section 8), MCA Incorporation records | MCA Master Data, DARPAN portal | **VERIFIED** (CIN: `U85500TZ2026NPL039757`, DARPAN: `TN/2026/1152475`) |
| **Covered Services & Applications** | Privacy Policy | Sec 01 (`our-commitment-to-privacy`) | Architectural Directive: Foundation Platform, Community App, Channelpreneur App, Admin Console | Terms Sec 01 | **VERIFIED** (Explicitly differentiates mobile apps, web platform, and administrative console) |
| **Data Categories & Event GPS** | Privacy Policy | Sec 02 (`information-we-may-collect`) | Verified feature requirements: student KYC, partner onboarding, GPS event check-in | Terms Sec 03, Sec 06 | **VERIFIED** (Event-based GPS collection limited to workshops/seminars/institution updates; zero 24/7 background tracking) |
| **Child & Minor Information** | Privacy Policy | Sec 03 (`information-relating-to-children`) | POCSO Act 2012, DPDP Act 2023 Sec 9 | Child Safeguarding Policy | **VERIFIED** (Requires verifiable parental/guardian consent for participants under 18) |
| **Lawful Grounds & Processing Purposes** | Privacy Policy | Sec 04 (`how-we-use-information`) | DPDP Act 2023 / IT Act SPDI Rules | Terms Sec 04 | **VERIFIED** (Scholarship processing, digital certification, partner enablement, statutory tax compliance) |
| **Disclosures & Subprocessors** | Privacy Policy | Sec 05 (`sharing-of-information`) | Platform Infrastructure: Supabase Storage, Render, Cloudflare, Payment Gateways (Razorpay/Cashfree) | Terms Sec 04 | **VERIFIED** (Prohibits commercial sale of data; subprocessor disclosure bounded by verified stack) |
| **Data Security & Technical Controls** | Privacy Policy | Sec 06 (`data-security`) | IT Act Sec 43A, ISO 27001 baseline principles | Acceptable Use Sec 03 | **VERIFIED** (Fulfills Security & Data Protection Statement; TLS in transit, AES-256 at rest, RBAC) |
| **Statutory Data Retention & Accounting** | Privacy Policy | Sec 07 (`data-retention`) | Companies Act 2013 (Sec 128 - 8 FY retention), Income Tax Act 1961 | Terms Sec 13, `/delete-account` | **VERIFIED** (Clear notice that statutory financial/audit records survive account deletion for legal duration) |
| **Cookies & Local Storage** | Privacy Policy | Sec 08 (`cookies-and-website-technologies`) | IT Rules 2021, Web Architecture | Privacy Sec 06 | **VERIFIED** (Fulfills Cookie Policy; restricts claims to session identifiers, local storage, auth tokens; no fake pixels) |
| **Data Subject Rights** | Privacy Policy | Sec 10 (`your-privacy-rights`) | DPDP Act 2023 / IT Rules 2011 | `/delete-account`, `/unsubscribe` | **VERIFIED** (Right to summary, correction, grievance redressal, erasure via `/delete-account`) |
| **Platform Eligibility & Capacity** | Terms & Conditions | Sec 02 (`eligibility-and-capacity`) | Indian Contract Act 1872 (Sec 11) | Child Safeguarding Sec 01 | **VERIFIED** (Minors participate under parent/institution consent) |
| **Program Fees & GST** | Terms & Conditions | Sec 04 (`program-registrations-and-payments`) | GST Act 2017, CESP100 / CCPM100 Master Directives | CESP / CCPM Pages | **VERIFIED** (18% GST reconciliation; transparent fee schedule; no fabricated refund rules) |
| **Independent Digital Partners (IDPs)** | Terms & Conditions | Sec 06 (`executives-and-channel-partners`) | Partner Engagement Framework | Acceptable Use Sec 04 | **VERIFIED** (Code of conduct, anti-misrepresentation, incentive audit requirements) |
| **Acceptable Platform Use** | Terms & Conditions | Sec 07 (`acceptable-use-and-prohibited-conduct`) | IT Act 2000 (Intermediary Guidelines) | Acceptable Use Policy | **VERIFIED** (Prohibits unauthorized penetration testing, scraping, credential sharing, harassment) |
| **Account Deletion & Data Erasure** | Terms & Conditions | Sec 13 (`account-deletion-and-data-handling`) | Google Play / Apple App Store Deletion Mandate | Privacy Sec 07, `/delete-account` | **VERIFIED** (Preserves Model B admin-reviewed deletion model and access suspension) |
| **Dispute Resolution & Jurisdiction** | Terms & Conditions | Sec 19 (`dispute-resolution-governing-law`) | Arbitration and Conciliation Act 1996, Indian Law | Preamble | **VERIFIED** (Governing law: India; exclusive jurisdiction: competent courts in Coimbatore, Tamil Nadu) |
| **POCSO Mandatory Reporting** | Child Safeguarding | Sec 03 (`reporting-and-escalation`) | POCSO Act 2012 (Sections 19 & 21) | Helpline Desk (1098, 112) | **VERIFIED** (Mandatory statutory reporting without internal obstruction; 112/1098 helplines; SJPU) |
| **Lead DSO & Deputy DSO Appointment** | Child Safeguarding | Sec 00 (`provisional-notice`) & Sec 10 | Board Governance | Governance Committee | **AWAITING BOARD DECISION** (Notice banner active; operational DSO positions held pending Board resolution; no fake names) |
| **POSH Statutory Framework** | POSH Policy | Sec 02 (`statutory-redressal-framework`) | POSH Act 2013 (Sections 4 & 6) | SHe-Box portal, District LC | **VERIFIED** (Explains Section 4 IC threshold >=10 vs Section 6 Local Committee route <10; Coimbatore DSWO) |
| **POSH Presiding Officer Gender Safeguard** | POSH Policy | Sec 02 & Sec 08 | POSH Act 2013 (Section 4(2)(a)) | IC Constitution Order | **VERIFIED** (Biju Sivanand strictly excluded from IC Presiding Officer; reserved for senior woman employee) |
| **POSH Inquiry Timelines & Privacy** | POSH Policy | Sec 05 (`inquiry-and-timelines`) | POSH Act 2013 (Section 11 & Section 16) | Section 16 Penalties | **VERIFIED** (90-day inquiry completion, Section 16 statutory confidentiality with penalty notice) |
| **POSH Internal Committee Gazettal** | POSH Policy | Sec 00 (`provisional-notice`) & Sec 08 | Governing Board & HR | HR Records | **AWAITING HR AUDIT** (Provisional draft notice active; pending official workforce headcount audit >=10 vs <10) |
| **Security Probing & Scraping Ban** | Acceptable Use | Sec 02 (`system-security-integrity`) | IT Act 2000 (Section 43 & Section 66) | Terms Sec 07 | **VERIFIED** (Anti-scraping, vulnerability probing prohibition, account integrity protection) |
| **Grievance Officer Channel** | All Policies | Closing Section | IT (Intermediary Guidelines) Rules 2021 | `support@yuvaparipalan.org` | **VERIFIED** (`support@yuvaparipalan.org` designated platform channel; separate from committee mailbox) |

---

## 2. CROSS-POLICY CONSISTENCY CERTIFICATION

1. **Corporate Identity:** 100% harmonized across all 5 policy modules and the Legal Centre catalog.
2. **Contact Email:** Standardized to `support@yuvaparipalan.org` with 0 instances of typographical error.
3. **Institutional Committee:** Standardized to `Yuvaparipalan Foundation Governance and Safeguarding Committee` (Committee Head: `Biju Sivanand`, `bijusivanand@gmail.com`).
4. **Account Deletion Linkage:** Privacy Policy (Sec 07) and Terms & Conditions (Sec 13) cross-link to `/delete-account`.
5. **No Fictitious Guarantees:** Zero claims of unverified ISO certifications, zero claims of military-grade encryption without context, and zero fictitious appointment of statutory officers.
