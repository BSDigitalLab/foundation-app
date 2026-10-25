import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { LEGAL_CENTRE_DATA } from '../data/legalCentreData';
import {
  Scale,
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  Calendar,
  ChevronRight,
  ArrowUp,
  Lock,
  ArrowRight,
  HeartHandshake,
  Users,
  FileCode,
  Trash2,
  MailCheck,
  FileText
} from 'lucide-react';

export const LegalCentrePage: React.FC = () => {
  const data = LEGAL_CENTRE_DATA;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredDocuments = selectedCategory === 'ALL'
    ? data.documents
    : data.documents.filter((doc) => doc.category === selectedCategory);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Scale':
        return <Scale className="w-5 h-5 text-amber-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-700" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-700" />;
      case 'FileCode':
        return <FileCode className="w-5 h-5 text-blue-700" />;
      case 'Trash2':
        return <Trash2 className="w-5 h-5 text-red-600" />;
      case 'MailCheck':
        return <MailCheck className="w-5 h-5 text-teal-700" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <>
      <SEOHead
        title="Legal Centre & Institutional Governance | Yuvaparipalan Foundation"
        description="Official Legal Centre, platform governance policies, privacy commitments, child safeguarding, and statutory compliance framework of Yuvaparipalan Foundation."
        canonicalUrl="https://yuvaparipalan.org/legal-centre"
      />

      <div className="min-h-screen bg-[#f8faf8] text-slate-900 selection:bg-emerald-500 selection:text-white pb-20 relative overflow-hidden">
        
        {/* Background Ambient Radial Lighting */}
        <div 
          className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(21, 128, 61, 0.35) 0%, rgba(217, 119, 6, 0.12) 50%, transparent 80%)',
            filter: 'blur(80px)',
          }}
        />

        {/* HERO HEADER */}
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-emerald-50/60 via-[#f8faf8] to-[#f8faf8] border-b border-emerald-900/10 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            
            {/* Breadcrumb Navigation */}
            <FadeIn direction="down">
              <nav className="flex items-center gap-2 text-xs font-mono text-emerald-900 mb-6">
                <Link to="/" className="hover:text-emerald-700 transition-colors font-semibold">Home</Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-emerald-800 font-bold">{data.title}</span>
              </nav>
            </FadeIn>

            {/* Title & Document Badge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4 text-left">
                <FadeIn direction="up">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-950 border border-emerald-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Official Institutional Legal Hub</span>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.1}>
                  <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-tight">
                    {data.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mt-2">
                    {data.subtitle}
                  </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.15}>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 pt-2">
                    <span className="flex items-center gap-1.5 bg-white border border-emerald-900/10 px-3 py-1.5 rounded-xl shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Effective: {data.effectiveDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-white border border-emerald-900/10 px-3 py-1.5 rounded-xl shadow-sm">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Last Updated: {data.lastUpdated}</span>
                    </span>
                  </div>
                </FadeIn>
              </div>

              {/* Organization Identity Card */}
              <div className="lg:col-span-5">
                <FadeIn direction="left" delay={0.2}>
                  <div className="p-5 sm:p-6 rounded-3xl bg-white border border-emerald-900/10 shadow-lg space-y-3.5 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-heading font-bold text-base text-slate-950">{data.orgDetails.name}</h2>
                        <p className="text-[11px] text-emerald-800 font-mono font-semibold">{data.orgDetails.type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 text-[10px] uppercase block font-bold">CIN</span>
                        <span className="text-amber-800 font-bold tracking-wider">{data.orgDetails.cin}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 text-[10px] uppercase block font-bold">DARPAN ID</span>
                        <span className="text-emerald-800 font-bold tracking-wider">{data.orgDetails.darpanId}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-snug text-slate-700 font-medium">{data.orgDetails.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-slate-500 font-mono text-[11px]">Platform Support:</span>
                        <a href={`mailto:${data.orgDetails.email}`} className="text-emerald-800 hover:underline font-mono font-bold">
                          {data.orgDetails.email}
                        </a>
                      </div>
                    </div>

                    {/* Governance and Safeguarding Committee Oversight */}
                    <div className="border-t border-slate-100 pt-3 mt-1 space-y-1.5 text-xs text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                          Institutional Governance
                        </span>
                      </div>
                      <p className="font-heading font-bold text-slate-900 text-xs leading-snug">
                        {data.governanceCommittee.committeeName}
                      </p>
                      <div className="text-[11px] font-mono text-slate-700">
                        <span className="text-slate-500">{data.governanceCommittee.headLabel}: </span>
                        <strong className="text-slate-900">{data.governanceCommittee.headName}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-slate-500">Committee Email:</span>
                        <a href={`mailto:${data.governanceCommittee.contactEmail}`} className="text-purple-800 hover:underline font-bold">
                          {data.governanceCommittee.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY: CATALOG & CATEGORY FILTER */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 relative z-10">
          
          {/* Category Filter Navigation */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
            {data.categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all shadow-sm ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-700/40 hover:text-emerald-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredDocuments.map((doc) => (
              <article
                key={doc.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-emerald-900/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-700/30 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 group-hover:scale-110 transition-transform">
                      {renderIcon(doc.iconName)}
                    </div>
                    <span className="font-mono text-[11px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      {doc.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-heading font-extrabold text-lg text-slate-950 tracking-tight group-hover:text-emerald-900 transition-colors">
                      {doc.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    Updated: {doc.lastUpdated}
                  </div>
                  <Link
                    to={doc.path}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </main>

          {/* Statutory Compliance Framework Card */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                Institutional Legal Assurance
              </span>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl">
                Statutory Compliance & Legal Governance Standard
              </h3>
              <p className="text-xs text-emerald-200/90 max-w-2xl leading-relaxed">
                Yuvaparipalan Foundation complies with the Companies Act 2013, Digital Personal Data Protection legislation, Information Technology (Intermediary Guidelines) Rules, the POCSO Act 2012, and the POSH Act 2013.
              </p>
            </div>
            <a
              href={`mailto:${data.orgDetails.email}?subject=Legal%20Centre%20Enquiry`}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shrink-0 hover:scale-105"
            >
              Contact Legal Office
            </a>
          </div>
        </section>

        {/* FLOATING BACK TO TOP BUTTON */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xl transition-all hover:scale-110 border border-emerald-500/40 focus:outline-none"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
};

export default LegalCentrePage;
