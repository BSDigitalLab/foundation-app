import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FadeIn } from '../motion/FadeIn';
import {
  GraduationCap, Sparkles, Sparkle, Layers, BrainCircuit, Laptop, HeartPulse, ShieldCheck,
  Coins, UsersRound, ArrowRight, CheckCircle2, Target
} from 'lucide-react';
import { getPlatformApiBaseUrl } from '../../config/apiConfig';
import { fetchPublicPrograms, PublicProgram } from '../../services/programResolutionService';

interface PublicCatalogProgram {
  id: string;
  program_code: string;
  name: string;
  short_name?: string;
  public_slug: string;
  description: string;
  status: string;
  learning_mode?: string;
  duration?: string | null;
  thumbnail_url?: string | null;
  commercials: {
    market_price: number;
    subscription_price: number;
    currency: string;
  };
}

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-7 h-7 text-emerald-800" />,
  Sparkles: <Sparkles className="w-7 h-7 text-amber-800" />,
  BrainCircuit: <BrainCircuit className="w-7 h-7 text-blue-800" />,
  Laptop: <Laptop className="w-7 h-7 text-cyan-800" />,
  HeartPulse: <HeartPulse className="w-7 h-7 text-rose-800" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7 text-teal-800" />,
  Coins: <Coins className="w-7 h-7 text-amber-800" />,
  UsersRound: <UsersRound className="w-7 h-7 text-emerald-800" />,
};

function getProgramBadgeAndIcon(code: string, name: string): { badge: string; iconKey: string; impact: string } {
  const c = (code || '').toUpperCase().trim();
  const n = (name || '').toLowerCase().trim();

  // Authoritative code and slug precedence
  if (c.startsWith('CCP') || n.includes('changepreneur')) {
    return { badge: 'Personal Growth & Impact', iconKey: 'Sparkles', impact: 'Empower 10 Young Lives per Member' };
  }
  if (c.startsWith('CESP') || n.includes('career excellence') || (n.includes('scholarship') && !n.includes('changepreneur'))) {
    return { badge: 'Education & Talent', iconKey: 'GraduationCap', impact: '100,000 Merit Scholarships by 2035' };
  }
  if (c.startsWith('SHEP') || n.includes('shepreneur')) {
    return { badge: 'Women Empowerment', iconKey: 'Coins', impact: '100,000 Shepreneurs Built' };
  }
  if (c.startsWith('CD') || n.includes('discovery')) {
    return { badge: 'Career Evaluation', iconKey: 'BrainCircuit', impact: 'Targeted Student Career Pathways' };
  }
  return { badge: 'Flagship Initiative', iconKey: 'Sparkles', impact: 'Statewide Transformation Mission' };
}

export const FlagshipPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<PublicProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // Authoritative Single Source of Truth resolution via programResolutionService
    fetchPublicPrograms(true)
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPrograms(data);
        }
      })
      .catch((err) => {
        console.warn('[FlagshipPrograms] SOT fetch note:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-10 sm:pt-12 pb-16 sm:pb-20 bg-[#fafaf7] relative overflow-hidden">
      {/* Expanded Container Width for Wider Cards */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header: Reduced Top Vertical Gap to Half */}
        <FadeIn direction="up">
          <div className="mb-8 sm:mb-10 max-w-3xl">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Flagship Programs
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Targeted, high-impact programs engineered to drive sustainable socio-economic development across India.
            </p>
          </div>
        </FadeIn>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
          {loading ? (
            /* Skeleton Loading Cards */
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-4 bg-slate-200 rounded" />
                    <div className="w-1/2 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-slate-100 rounded" />
                  <div className="w-5/6 h-3 bg-slate-100 rounded" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div className="w-24 h-3 bg-slate-100 rounded" />
                  <div className="w-20 h-7 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))
          ) : programs.length > 0 ? (
            programs.map((program, index) => {
              const isChangepreneur =
                program.program_code === 'CCPAM100' ||
                program.program_code === 'CCPM100' ||
                program.public_slug.includes('changepreneur');
              const isCESP =
                program.program_code === 'CESP100' ||
                program.public_slug.includes('career-excellence');
              const { badge, iconKey, impact } = getProgramBadgeAndIcon(program.program_code, program.name);

              const targetUrl = isChangepreneur
                ? '/programs/changepreneur-circle'
                : isCESP
                ? '/programs/career-excellence-scholarship-program'
                : `/programs/${program.public_slug}`;

              return (
                <FadeIn key={program.id || program.program_code} direction="up" delay={index * 0.05}>
                  <div
                    onClick={() => navigate(targetUrl)}
                    className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden shadow-sm"
                  >
                    <div className="space-y-2.5">
                      {/* Restructured Card Header */}
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 group-hover:scale-105 transition-transform shrink-0">
                          {iconMap[iconKey] || <Sparkles className="w-7 h-7 text-emerald-800" />}
                        </div>
                        <div className="flex flex-col text-left overflow-hidden">
                          <h3 className="font-heading font-extrabold text-base text-slate-950 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                            {program.name}
                          </h3>
                          <span className="text-xs font-bold text-emerald-800 tracking-wide mt-0.5 truncate">
                            {badge}
                          </span>
                        </div>
                      </div>

                      {/* Authoritative Program Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {program.description || 'Comprehensive developmental program designed for career, skill, and personal growth.'}
                      </p>

                      {/* Curated Submodules & Key Benefits from SOT */}
                      {program.components && program.components.length > 0 && (
                        <div className="pt-2 border-t border-emerald-900/10 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                              <Sparkle className="w-3 h-3 text-emerald-700" /> Key Inclusions ({program.components.length})
                            </span>
                            <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              SOT
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {program.components.slice(0, 4).map((comp) => (
                              <span
                                key={comp.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50/80 text-slate-800 border border-emerald-200/80"
                                title={comp.description || comp.name}
                              >
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                                <span className="truncate max-w-[130px]">{comp.name}</span>
                              </span>
                            ))}
                            {program.components.length > 4 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                +{program.components.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Target Metric + Right-Aligned CTA Button */}
                    <div className="pt-3.5 mt-3.5 border-t border-slate-200 flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-900 font-semibold truncate">
                        <Target className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{impact}</span>
                      </div>

                      <div className="flex items-center justify-end w-full">
                        <Link
                          to={targetUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto"
                        >
                          <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                            <span>{isChangepreneur ? 'Explore Circle' : 'Explore & Enroll'}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-100" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-2">
              <Target className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No programs currently published</p>
              <p className="text-xs text-slate-500">All programs are managed dynamically via the platform catalog.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
