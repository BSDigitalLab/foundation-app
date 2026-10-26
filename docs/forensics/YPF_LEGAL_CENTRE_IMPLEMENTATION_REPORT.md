# YPF-LEGAL-CENTRE-FORENSIC-AUDIT-AND-PRODUCTION-ALIGNMENT-001
# FRONTEND IMPLEMENTATION REPORT: LEGAL CENTRE & POLICY ARCHITECTURE

**Document Identifier:** `docs/forensics/YPF_LEGAL_CENTRE_IMPLEMENTATION_REPORT.md`  
**Classification:** Frontend Component Implementation, Routing & Design Preservation Report  
**Authority:** Platform Architecture & Institutional Governance  
**Repository Location:** `src/pages/`, `src/components/`, `src/data/`, `src/App.tsx`  
**Commit SHA:** `28eb5f3`  
**Status:** `IMPLEMENTED & AUDITED`

---

## 1. ARCHITECTURE & COMPONENT INVENTORY

The Legal Centre frontend is implemented using the existing application design system, brand tokens, typography (Outfit & Plus Jakarta Sans), Tailwind CSS v4, Lucide React icons, and React Router v7.

### Component Manifest:
1. **Legal Centre Hub (`src/pages/LegalCentrePage.tsx` & `src/data/legalCentreData.ts`):**
   - **Canonical Route:** `/legal-centre`
   - **Alias Route:** `/legal`
   - **Page Features:**
     - Top ambient gradient lighting and breadcrumbs (`Home > Legal Centre`).
     - Hero Section with `Official Institutional Legal Hub` badge, effective date, and last updated date.
     - Institutional Governance Card detailing the `Yuvaparipalan Foundation Governance and Safeguarding Committee`, `Committee Head: Biju Sivanand`, and dedicated email `bijusivanand@gmail.com`, distinctly separated from `support@yuvaparipalan.org`.
     - Category filter buttons: `All Documents`, `Platform Governance`, `Data Protection & Privacy`, `Safeguarding & Ethics`, `User Rights & Controls`.
     - Responsive document tiles grid (1 col on mobile, 2 col on tablet, 3 col on desktop).
     - Each tile includes: Title, descriptive paragraph, category badge, last updated timestamp, distinct category icon, and an explicit `Read Policy` action button linking to the dedicated stable URL.
     - Statutory Compliance Assurance Banner at the base of the catalog with a direct link to contact the Legal Office.
     - Floating smooth `Back to Top` button appearing after scrolling 400px.
2. **Preserved Privacy Policy Page (`src/pages/PrivacyPolicyPage.tsx` & `src/data/privacyPolicyData.ts`):**
   - **Canonical Route:** `/privacy-policy`
   - **Structure Preservation:**
     - Exactly retains the established visual hierarchy, typography, ambient radial gradient, breadcrumb navigation, document badge, effective/updated dates, and Organization Identity Card (CIN, DARPAN ID, registered address, email).
     - Retains numbered section rendering cards (`p-6 sm:p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm`).
     - Section 06 (`data-security`) incorporates the complete Security & Data Protection Statement.
     - Section 08 (`cookies-and-website-technologies`) incorporates the complete Cookie & Local Storage disclosures.
     - Section 07 (`data-retention`) links directly to `/delete-account`.
     - Cross-policy navigation card at the bottom linking to `/legal-centre` and `/terms-and-conditions`.
3. **Preserved Terms & Conditions Page (`src/pages/TermsConditionsPage.tsx` & `src/data/termsConditionsData.ts`):**
   - **Canonical Route:** `/terms-and-conditions`
   - **Alias Route:** `/terms`
   - **Structure Preservation:**
     - Reuses identical 21-section card layout, Organization Identity Card, and cross-navigation footer.
     - Section 13 (`account-deletion-and-data-handling`) links directly to `/delete-account`.
     - Section 19 defines governing law and exclusive jurisdiction in Coimbatore, Tamil Nadu.
4. **Child Protection & Safeguarding Page (`src/pages/ChildSafeguardingPage.tsx` & `src/data/childSafeguardingData.ts`):**
   - **Canonical Route:** `/child-safeguarding`
   - **Structure Preservation:** Reuses the established policy page layout. Features a clearly marked **Provisional Notice Banner** explaining that operational DSO appointments remain subject to formal Board gazettal, while institutional oversight is anchored in the Governance and Safeguarding Committee (Committee Head: Biju Sivanand). Section 03 details POCSO Sections 19 & 21 reporting and helplines (112, 1098).
5. **POSH Policy Page (`src/pages/POSHPolicyPage.tsx` & `src/data/poshPolicyData.ts`):**
   - **Canonical Route:** `/posh`
   - **Structure Preservation:** Reuses the established policy page layout. Features a clearly marked **Provisional Notice Banner** stating that formal IC constitution is subject to the HR workforce headcount audit. Details Section 4 IC threshold, Section 6 Coimbatore District Local Committee jurisdiction, SHe-Box portal, and Section 16 statutory confidentiality.
6. **Acceptable Use Policy Page (`src/pages/AcceptableUsePage.tsx` & `src/data/acceptableUseData.ts`):**
   - **Canonical Route:** `/acceptable-use`
   - **Structure Preservation:** Reuses the established policy page layout. Covers 8 sections addressing system integrity, anti-scraping, credential protection, and consequences of violations.
7. **Operational Account Deletion & Erasure (`src/pages/DeleteAccountPage.tsx`):**
   - **Canonical Route:** `/delete-account`
   - **Preservation:** The live operational client experience is completely preserved. Dual-mode authentication/OTP verification, acknowledgment of consequences, audit retention disclosures, and attribution parameter parsing (`?src=channelpreneur`) remain fully intact.

---

## 2. FOOTER NAVIGATION IMPLEMENTATION

In strict accordance with the user directive:
> *"on the footer quick links we need to add Legal Center and link to the leagal center page, keep the privacy policy and terms & conditions page links on the footer as it is"*

In [`src/components/common/Footer.tsx`](file:///c:/workspace/apps/Foundation%20App/src/components/common/Footer.tsx):
1. **Quick Links Column (Column 3):** Added `Legal Center` pointing to `/legal-centre`:
   ```tsx
   {/* Column 3: Quick Navigation */}
   <div className="space-y-4">
     <h3 className="font-heading font-bold text-white text-base">Quick Links</h3>
     <ul className="space-y-2 text-xs text-emerald-200/90">
       <li><Link to="/about" className="hover:text-white transition-colors">About Our Movement</Link></li>
       <li><Link to="/impact" className="hover:text-white transition-colors">2035 Impact Goals</Link></li>
       <li><Link to="/leadership" className="hover:text-white transition-colors">Leadership & Patrons</Link></li>
       <li><Link to="/gallery" className="hover:text-white transition-colors">Photo & Event Gallery</Link></li>
       <li><Link to="/contact" className="hover:text-white transition-colors">Contact Headquarters</Link></li>
       <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Registration</Link></li>
       <li><Link to="/partner" className="hover:text-white transition-colors">CSR Partner Application</Link></li>
       <li><Link to="/legal-centre" className="hover:text-white transition-colors">Legal Center</Link></li>
     </ul>
   </div>
   ```
2. **Footer Bottom Bar:** Strictly preserved:
   - `Privacy Policy` -> `/privacy-policy`
   - `Terms & Conditions` -> `/terms-and-conditions`
   - `Legal Centre` -> `/legal-centre`
   - `Child Safeguarding` -> `/child-safeguarding`
   - `POSH Policy` -> `/posh`
   - `Delete Account` -> `/delete-account`

---

## 3. APPLICATION ROUTING & BUNDLE SPLITTING

In [`src/App.tsx`](file:///c:/workspace/apps/Foundation%20App/src/App.tsx):
- All policy pages are code-split and lazy-loaded via `React.lazy()` with fallback `<PageLoader />`.
- Canonical routes and aliases configured:
  ```tsx
  <Route path="/legal-centre" element={<LegalCentrePage />} />
  <Route path="/legal" element={<LegalCentrePage />} />
  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
  <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
  <Route path="/terms" element={<TermsConditionsPage />} />
  <Route path="/child-safeguarding" element={<ChildSafeguardingPage />} />
  <Route path="/posh" element={<POSHPolicyPage />} />
  <Route path="/acceptable-use" element={<AcceptableUsePage />} />
  <Route path="/delete-account" element={<DeleteAccountPage />} />
  ```
- Bundler chunks confirmed clean during `npm run build`:
  - `LegalCentrePage`: ~16.07 kB (gzip: 4.85 kB)
  - `PrivacyPolicyPage`: ~37.58 kB (gzip: 11.11 kB)
  - `TermsConditionsPage`: ~35.60 kB (gzip: 11.02 kB)
  - `ChildSafeguardingPage`: ~28.43 kB (gzip: 9.49 kB)
  - `POSHPolicyPage`: ~26.25 kB (gzip: 8.66 kB)
  - `AcceptableUsePage`: ~18.96 kB (gzip: 6.71 kB)
  - `DeleteAccountPage`: ~16.89 kB (gzip: 4.98 kB)
