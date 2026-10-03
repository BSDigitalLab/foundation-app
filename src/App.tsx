import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Loader2 } from 'lucide-react';

// Lazy loading route components
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then((m) => ({ default: m.ProgramsPage })));
const ChangepreneurCirclePage = lazy(() => import('./pages/ChangepreneurCirclePage').then((m) => ({ default: m.ChangepreneurCirclePage })));
const ImpactPage = lazy(() => import('./pages/ImpactPage').then((m) => ({ default: m.ImpactPage })));
const LeadershipPage = lazy(() => import('./pages/LeadershipPage').then((m) => ({ default: m.LeadershipPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then((m) => ({ default: m.VolunteerPage })));
const PartnerPage = lazy(() => import('./pages/PartnerPage').then((m) => ({ default: m.PartnerPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage').then((m) => ({ default: m.TermsConditionsPage })));

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

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white font-sans">
        <Navbar />
        <div className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/programs/changepreneur-circle" element={<ChangepreneurCirclePage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/partner" element={<PartnerPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
              <Route path="/terms" element={<TermsConditionsPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
