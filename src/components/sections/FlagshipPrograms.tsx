import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FadeIn } from '../motion/FadeIn';
import {
  GraduationCap, Sparkles, BrainCircuit, Laptop, HeartPulse, ShieldCheck,
  Coins, UsersRound, ArrowRight, Target
} from 'lucide-react';
import { fetchPublicPrograms, PublicProgram } from '../../services/programResolutionService';

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
        
        {/* Section Header */}
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

        {/* Program Cards Grid: Two Cards Per Row on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {loading ? (
            /* Skeleton Loading Cards */
            [1, 2].map((n) => (
              <div key={n} className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="w-1/3 h-3 bg-slate-200 rounded" />
                    <div className="w-4/5 h-5 bg-slate-200 rounded" />
                    <div className="w-full h-3 bg-slate-100 rounded" />
                    <div className="w-3/4 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="w-20 h-4 bg-slate-200 rounded" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="w-full h-12 bg-slate-100 rounded-xl" />
                    <div className="w-full h-12 bg-slate-100 rounded-xl" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="w-28 h-4 bg-slate-100 rounded" />
                  <div className="w-28 h-8 bg-slate-200 rounded-xl" />
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
                    className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-white border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden shadow-sm"
                  >
                    <div className="space-y-5">
                      {/* UPPER REGION: Side-by-Side Thumbnail (Left) + Heading & Description (Right) */}
                      <div className="flex flex-row items-start gap-4">
                        {/* Left Side: Program Thumbnail */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0 rounded-2xl overflow-hidden bg-emerald-50/60 border border-emerald-900/10 flex items-center justify-center relative group-hover:scale-[1.02] transition-transform">
                          {program.thumbnail_url ? (
                            <img
                              src={program.thumbnail_url}
                              alt={program.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="p-3 text-emerald-800">
                              {iconMap[iconKey] || <Sparkles className="w-8 h-8 text-emerald-800" />}
                            </div>
                          )}
                        </div>

                        {/* Right Side: Program Heading & Short Description */}
                        <div className="flex-1 space-y-1.5 min-w-0 text-left">
                          <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wider block">
                            {badge}
                          </span>
                          <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-950 group-hover:text-emerald-800 transition-colors leading-snug">
                            {program.name}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                            {program.description || 'Comprehensive developmental program designed for career, skill, and personal growth.'}
                          </p>
                        </div>
                      </div>

                      {/* OFFERING SECTION: Submodule Product / Service Bullet Subcards (2 Columns Side by Side) */}
                      {program.components && program.components.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900">
                              Offering
                            </h4>
                            <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {program.components.length} Inclusions
                            </span>
                          </div>

                          {/* Submodule Bullet Subcards: 2 Columns Side by Side */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {program.components.map((comp) => (
                              <div
                                key={comp.id || comp.name}
                                className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-200 transition-colors flex items-start gap-2.5 text-left"
                              >
                                <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <span className="font-heading font-bold text-xs text-slate-950 block leading-tight">
                                    {comp.name}
                                  </span>
                                  {comp.description && (
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal line-clamp-2">
                                      {comp.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Target Metric + Right-Aligned CTA Button */}
                    <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-900 font-semibold truncate">
                        <Target className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{impact}</span>
                      </div>

                      <Link
                        to={targetUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0"
                      >
                        <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                          <span>{isChangepreneur ? 'Explore Circle' : 'Explore & Enroll'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-100" />
                        </button>
                      </Link>
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