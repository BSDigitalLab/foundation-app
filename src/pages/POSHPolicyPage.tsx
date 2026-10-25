import React, { useState, useEffect } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { POSH_POLICY_DATA } from '../data/poshPolicyData';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Mail,
  MapPin,
  Calendar,
  ChevronRight,
  ArrowUp,
  Lock,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

// Helper to render markdown links [label](url) within text strings
const renderFormattedText = (text: string): React.ReactNode => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  if (!linkRegex.test(text)) {
    return text;
  }

  linkRegex.lastIndex = 0;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];

    if (url.startsWith('/')) {
      elements.push(
        <Link key={match.index} to={url} className="text-emerald-800 underline font-semibold hover:text-emerald-950 transition-colors">
          {label}
        </Link>
      );
    } else {
      elements.push(
        <a
          key={match.index}
          href={url}
          target={url.startsWith('mailto:') ? undefined : '_blank'}
          rel={url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="text-emerald-800 underline font-semibold hover:text-emerald-950 transition-colors"
        >
          {label}
        </a>
      );
    }
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return <>{elements}</>;
};

export const POSHPolicyPage: React.FC = () => {
  const data = POSH_POLICY_DATA;
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

  return (
    <>
      <SEOHead
        title="Prevention of Sexual Harassment (POSH) Policy | Yuvaparipalan Foundation"
        description="Official Prevention of Sexual Harassment Policy of Yuvaparipalan Foundation, safeguarding workplace dignity and establishing a statutory inquiry mechanism under the POSH Act, 2013."
        canonicalUrl="https://yuvaparipalan.org/posh"
      />

      <div className="min-h-screen bg-[#f8faf8] text-slate-900 selection:bg-emerald-500 selection:text-white pb-20 relative overflow-hidden">
        
        {/* Background Ambient Radial Lighting */}
        <div 
          className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 80%)',
            filter: 'blur(80px)',
          }}
        />

        {/* HERO HEADER */}
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-purple-50/60 via-[#f8faf8] to-[#f8faf8] border-b border-emerald-900/10 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            
            {/* Breadcrumb Navigation */}
            <FadeIn direction="down">
              <nav className="flex items-center gap-2 text-xs font-mono text-emerald-900 mb-6">
                <Link to="/" className="hover:text-emerald-700 transition-colors font-semibold">Home</Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <Link to="/legal-centre" className="hover:text-emerald-700 transition-colors font-semibold">Legal Centre</Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-emerald-800 font-bold">{data.title}</span>
              </nav>
            </FadeIn>

            {/* Title & Document Badge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4 text-left">
                <FadeIn direction="up">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 text-purple-950 border border-purple-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>POSH Act 2013 Statutory Standard</span>
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
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-800 border border-purple-200">
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
                        <a href={`mailto:${data.orgDetails.email}`} className="text-emerald-800 hover:underline font-mono font-bold">
                          {data.orgDetails.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY CONTENT AREA */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 relative z-10">
          
          {/* Provisional Governance Notice Banner */}
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-slate-800 shadow-sm relative overflow-hidden text-left">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-black text-sm text-amber-950 uppercase tracking-wide">
                    Provisional Governance Notice · Consultation Draft
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950 text-[11px] font-mono font-bold">
                    Pending Institutional Workforce Determination & IC Order
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  This Policy is published in <strong>Provisional Draft</strong> form for public transparency and statutory alignment under the POSH Act, 2013. It is <strong>NOT</strong> a finalized operational policy. Statutory complaints must <strong>NOT</strong> be directed exclusively to public customer support. If the Foundation's workforce is under ten workers or if a complaint involves management, the competent statutory authority under Section 6 of the Act is the <strong>Coimbatore District Local Committee (Office of the District Social Welfare Officer, Coimbatore Collectorate)</strong> or the central SHe-Box portal (<a href="https://shebox.wcd.gov.in" target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline font-bold">shebox.wcd.gov.in</a>). Where the threshold is ten or more workers, complaints will be adjudicated by the Internal Committee following the Governing Board's written constitution order.
                </p>
              </div>
            </div>
          </div>

          <main className="space-y-6 text-left">
            {data.sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-sm transition-all duration-300 scroll-mt-28 hover:shadow-md hover:border-emerald-700/30"
              >
                <div className="space-y-4">
                  {/* Section Heading */}
                  <div className="border-b border-slate-100 pb-3 flex items-start gap-3">
                    {section.number && (
                      <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 border border-purple-300 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                        {section.number.padStart(2, '0')}
                      </span>
                    )}
                    <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-950 tracking-tight leading-snug">
                      {section.title}
                    </h2>
                  </div>

                  {/* Paragraphs */}
                  {section.paragraphs && (
                    <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-normal">
                      {section.paragraphs.map((paragraph, pIdx) => (
                        <p key={pIdx}>{renderFormattedText(paragraph)}</p>
                      ))}
                    </div>
                  )}

                  {/* Callout Box */}
                  {section.callout && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-amber-50/50 border-l-4 border-purple-500 border-y border-r border-purple-300/40 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed shadow-sm">
                      {renderFormattedText(section.callout)}
                    </div>
                  )}

                  {/* Bullets */}
                  {section.bullets && (
                    <ul className="space-y-2.5 pt-2">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{renderFormattedText(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Paragraphs After Bullets */}
                  {section.paragraphsAfter && (
                    <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-normal pt-2">
                      {section.paragraphsAfter.map((paragraph, pIdx) => (
                        <p key={pIdx}>{renderFormattedText(paragraph)}</p>
                      ))}
                    </div>
                  )}

                  {/* Contact Info Detail for Section 10 */}
                  {section.id === 'posh-contact-redressal' && (
                    <div className="mt-4 p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-2 font-mono text-xs text-slate-800">
                      <p className="font-extrabold text-slate-950">{data.orgDetails.name}</p>
                      <p className="text-slate-600 font-medium">Internal Redressal Oversight &amp; Workplace Dignity</p>
                      <p className="text-amber-800 font-bold">CIN: {data.orgDetails.cin} | DARPAN ID: {data.orgDetails.darpanId}</p>
                      <p className="text-slate-700">Address: {data.orgDetails.address}</p>
                      <p className="pt-1">
                        Confidential POSH Email:{' '}
                        <a href={`mailto:${data.orgDetails.email}?subject=CONFIDENTIAL:%20POSH%20Inquiry`} className="text-purple-800 underline hover:text-purple-950 font-bold">
                          {data.orgDetails.email}
                        </a>
                      </p>
                      <p>
                        Ministry of Women &amp; Child Development SHe-Box: <a href="https://shebox.nic.in" target="_blank" rel="noopener noreferrer" className="text-purple-800 underline font-bold">shebox.nic.in</a>
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {/* Cross Navigation Footer Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-900/10 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-950">Explore Institutional Policies</h3>
                <p className="text-xs text-slate-600 mt-1">Review our platform terms of service, child safeguarding rules, and acceptable use guidelines.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/legal-centre"
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shrink-0 hover:scale-105"
                >
                  Legal Centre Hub
                </Link>
                <Link
                  to="/terms-and-conditions"
                  className="px-5 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md shrink-0 hover:scale-105"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </main>
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

export default POSHPolicyPage;
