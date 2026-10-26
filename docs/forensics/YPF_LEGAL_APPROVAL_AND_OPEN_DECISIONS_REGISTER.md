# YPF-LEGAL-CENTRE-FORENSIC-AUDIT-AND-PRODUCTION-ALIGNMENT-001
# LEGAL APPROVAL AND OPEN DECISIONS REGISTER

**Document Identifier:** `docs/forensics/YPF_LEGAL_APPROVAL_AND_OPEN_DECISIONS_REGISTER.md`  
**Classification:** Institutional Governance, Statutory Compliance & Open Decisions Register  
**Authority:** Platform Architecture & Institutional Governance  
**Repository Location:** `docs/forensics/`  
**Date of Audit:** October 26, 2026  
**Status:** `ACTIVE — PENDING_FOUNDER_AND_BOARD_DECISIONS`

---

## 1. PRINCIPLE OF NON-FABRICATION

Under Platform Architecture and Legal Governance guidelines, this implementation enforces a strict **zero-fabrication policy**:
1. No statutory committee is falsely claimed to be constituted if formal records are absent.
2. No fictitious officer, emergency mobile number, or non-existent external certifications are named.
3. Where an organizational role or operational appointment is awaiting institutional sign-off, the policy is rendered with an explicit **Provisional Draft Notice Banner** in the frontend, rather than inventing unverified facts.

---

## 2. OPEN DECISIONS & INSTITUTIONAL ACTION ITEMS REGISTER

| Decision Ref # | Domain | Statutory / Operational Context | Current Implemented Handling | Action Required from Founder / Governing Board | Impact if Unresolved |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | **Child Safeguarding Lead DSO & Deputy DSO** | Section 19 POCSO Act 2012 / Juvenile Justice Act 2015. Requires named operational officers responsible for handling minor welfare incidents. | Policy is published with an active **Provisional Notice Banner** (`Sec 00`). Policy oversight is anchored in the Governance & Safeguarding Committee (`Committee Head: Biju Sivanand`). Zero fake names used. | Governing Board to pass a formal resolution appointing the named Lead Designated Safeguarding Officer (Lead DSO) and Deputy DSO, with dedicated contact channels. | Operational case coordination falls back to emergency helplines (112, 1098) and committee oversight. |
| **DEC-002** | **POSH Act Workforce Audit & IC Order** | Section 4 of POSH Act 2013 mandates an Internal Committee (IC) if the organization employs $\ge 10$ workers. If $< 10$ workers, Section 6 establishes jurisdiction with the Coimbatore District Local Committee (DSWO). | Policy is published with an active **Provisional Notice Banner** (`Sec 00`). Details both Section 4 and Section 6 routes. Strictly protects Section 4(2)(a) woman Presiding Officer mandate (Biju Sivanand excluded). | HR & Governing Board to audit current headcount (employees + retainers + regular volunteers). If $\ge 10$, execute written IC Constitution Order. If $< 10$, record in Board minutes that complaints fall under Coimbatore District Local Committee. | Legal compliance is protected by the District Local Committee route; formal IC documentation remains pending headcount confirmation. |
| **DEC-003** | **Mailbox Monitoring SLA Confirmation** | Information Technology (Intermediary Guidelines) Rules 2021. Requires operational grievance redressal within statutory turnaround times. | `support@yuvaparipalan.org` codified as the canonical contact across all policies. DNS MX, SPF, DMARC records verified. | IT Administrator to confirm active daily monitoring and document internal response SLA (e.g. 24h acknowledgment, 15d resolution). | Potential delay in acknowledging legal notices or privacy queries if inbox is unmonitored. |
| **DEC-004** | **Mobile App Store Console Deletion Registration** | Google Play User Data Policy & Apple App Store Review Guideline 5.1.1(v). Requires in-app and web deletion URLs. | Web deletion experience is live at `https://yuvaparipalan.org/delete-account` with dual-mode verification and mobile attribution (`?src=channelpreneur`). | Mobile Operations team to log into Google Play Console (Data Safety section) and App Store Connect to register the canonical URL `https://yuvaparipalan.org/delete-account`. | Risk of mobile app rejection or store compliance warning if URLs are omitted from store listings. |
| **DEC-005** | **Backend Staging Account Soft-Delete Dry Run** | Directive 006/007 Model B Account Deletion Architecture. Requires backend database soft-delete and session invalidation. | Client implementation verified with HTTP contracts and test suites. Admin deletion queue and review workspace ready. | Backend engineering team to perform an end-to-end dry run on a seeded test user account in staging and provide database verification logs. | Staging database verification evidence held at Gate G.8 pending backend execution. |

---

## 3. SUMMARY OF AUTHORIZED DECISIONS CODIFIED IN PRODUCTION

The following institutional decisions were fully verified and are codified in the release:
1. **Primary Governance Committee:** `Yuvaparipalan Foundation Governance and Safeguarding Committee`.
2. **Committee Leadership:** `Committee Head: Biju Sivanand` (strictly rendered without extraneous honorary titles or "Chairman" appellation).
3. **Committee Contact:** `bijusivanand@gmail.com` (strictly demarcated from general platform support).
4. **Canonical Platform Support:** `support@yuvaparipalan.org` (reconciled and verified across all policies).
5. **Governing Law & Jurisdiction:** Laws of India; exclusive jurisdiction in the competent courts of Coimbatore, Tamil Nadu.
6. **Statutory Retention Period:** 8 statutory financial years under Section 128 of the Companies Act, 2013 and Section 44AA of the Income Tax Act, 1961.
