import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Loader2 } from 'lucide-react';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { useCustomerAuthStore } from './stores/useCustomerAuthStore';

// Lazy loading route components
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then((m) => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage').then((m) => ({ default: m.ProgramDetailPage })));
const ChangepreneurCirclePage = lazy(() => import('./pages/ChangepreneurCirclePage').then((m) => ({ default: m.ChangepreneurCirclePage })));
const CareerExcellenceScholarshipPage = lazy(() => import('./pages/CareerExcellenceScholarshipPage').then((m) => ({ default: m.CareerExcellenceScholarshipPage })));
const ImpactPage = lazy(() => import('./pages/ImpactPage').then((m) => ({ default: m.ImpactPage })));
const LeadershipPage = lazy(() => import('./pages/LeadershipPage').then((m) => ({ default: m.LeadershipPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then((m) => ({ default: m.VolunteerPage })));
const PartnerPage = lazy(() => import('./pages/PartnerPage').then((m) => ({ default: m.PartnerPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage').then((m) => ({ default: m.TermsConditionsPage })));
const LegalCentrePage = lazy(() => import('./pages/LegalCentrePage').then((m) => ({ default: m.LegalCentrePage })));
const ChildSafeguardingPage = lazy(() => import('./pages/ChildSafeguardingPage').then((m) => ({ default: m.ChildSafeguardingPage })));
const POSHPolicyPage = lazy(() => import('./pages/POSHPolicyPage').then((m) => ({ default: m.POSHPolicyPage })));
const AcceptableUsePage = lazy(() => import('./pages/AcceptableUsePage').then((m) => ({ default: m.AcceptableUsePage })));
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage').then((m) => ({ default: m.UnsubscribePage })));
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage').then((m) => ({ default: m.DeleteAccountPage })));
const AdminAccountDeletionPage = lazy(() => import('./pages/AdminAccountDeletionPage').then((m) => ({ default: m.AdminAccountDeletionPage })));
const ShortLinkResolverPage = lazy(() => import('./pages/ShortLinkResolverPage').then((m) => ({ default: m.ShortLinkResolverPage })));

// Scroll To Top on Route Change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Fallback Loading Spinner
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-slate-950">
    <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
    <span className="text-xs font-mono text-emerald-400">Loading Yuvaparipalan Movement...</span>
  </div>
);

// App Layout Controller: Hides general Navbar & Footer on standalone routes (/delete-account and /admin/*)
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isDeleteAccount = pathname === '/delete-account';
  const isStandalone = isDeleteAccount || pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white font-sans ${isDeleteAccount ? 'bg-[#f4f8f5] text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {!isStandalone && <Navbar />}
      <CustomerAuthModal />
      <div className="flex-grow">
        {children}
      </div>
      {!isStandalone && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  const fetchCurrentCustomer = useCustomerAuthStore((s) => s.fetchCurrentCustomer);

  useEffect(() => {
    fetchCurrentCustomer();
  }, [fetchCurrentCustomer]);

  return (
    <Router>
      <ScrollToTop />
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            {/* Branded Short Links & Campaign Redirects */}
            <Route path="/s/:code" element={<ShortLinkResolverPage />} />
            <Route path="/c/:code" element={<ShortLinkResolverPage />} />

            {/* Changepreneur Circle Dedicated Landing Routes & Canonical Aliases */}
            <Route path="/programs/changepreneur-circle" element={<ChangepreneurCirclePage />} />
            <Route path="/programs/changepreneur-circle-premium-annual-membership" element={<ChangepreneurCirclePage />} />
            <Route path="/programs/ccpam100" element={<ChangepreneurCirclePage />} />
            <Route path="/programs/ccpm100" element={<ChangepreneurCirclePage />} />
            <Route path="/programs/09ecaeaa-a525-4262-966c-dd34bc54305f" element={<ChangepreneurCirclePage />} />
            <Route path="/programs/career-excellence-scholarship-program" element={<CareerExcellenceScholarshipPage />} />
            <Route path="/programs/cesp" element={<CareerExcellenceScholarshipPage />} />
            <Route path="/programs/:slug" element={<ProgramDetailPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/legal-centre" element={<LegalCentrePage />} />
            <Route path="/legal" element={<LegalCentrePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/child-safeguarding" element={<ChildSafeguardingPage />} />
            <Route path="/posh" element={<POSHPolicyPage />} />
            <Route path="/acceptable-use" element={<AcceptableUsePage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            
            {/* Identity & Access -> Access & Permissions -> Account Deletion Requests Admin Queue */}
            <Route path="/admin/access/account-deletion-requests" element={<AdminAccountDeletionPage />} />
            <Route path="/admin/identity-access/deletion-requests" element={<AdminAccountDeletionPage />} />
            <Route path="/admin/account-deletion-requests" element={<AdminAccountDeletionPage />} />

            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </Router>
  );
};

export default App;

