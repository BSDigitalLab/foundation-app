import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FLAGSHIP_PROGRAMS } from '../../data/mockData';
import { Program } from '../../types';
import { FadeIn } from '../motion/FadeIn';
import {
  GraduationCap, Sparkles, BrainCircuit, Laptop, HeartPulse, ShieldCheck,
  Coins, UsersRound, ArrowRight, CheckCircle2, Target
} from 'lucide-react';

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

export const FlagshipPrograms: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const navigate = useNavigate();

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
          {FLAGSHIP_PROGRAMS.map((program, index) => {
            const isScholarship = program.id === 'scholarship-mission' || program.id === 'merit-scholarship' || program.title.toLowerCase().includes('scholarship');
            const isChangepreneur = program.id === 'changepreneur-circle';

            return (
              <FadeIn key={program.id} direction="up" delay={index * 0.05}>
                <div
                  onClick={(e) => {
                    if (isChangepreneur) {
                      e.stopPropagation();
                      navigate('/programs/changepreneur-circle');
                    } else if (isScholarship) {
                      e.stopPropagation();
                      window.open('https://www.yuvaparipalan.com/', '_blank', 'noopener,noreferrer');
                    } else {
                      setSelectedProgram(program);
                    }
                  }}
                  className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden shadow-sm"
                >
                  <div className="space-y-2.5">
                    {/* Restructured Card Header: Compact layout with icon, 2-line title & subtitle */}
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 group-hover:scale-105 transition-transform shrink-0">
                        {iconMap[program.iconName]}
                      </div>
                      <div className="flex flex-col text-left overflow-hidden">
                        <h3 className="font-heading font-extrabold text-base text-slate-950 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                          {program.title}
                        </h3>
                        <span className="text-xs font-bold text-emerald-800 tracking-wide mt-0.5 truncate">
                          {program.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {program.shortDescription}
                    </p>
                  </div>

                  {/* Card Footer: Target Metric + Right-Aligned CTA Button */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-200 flex flex-col gap-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-900 font-semibold truncate">
                      <Target className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{program.impactTarget}</span>
                    </div>

                    <div className="flex items-center justify-end w-full">
                      {isChangepreneur ? (
                        <Link
                          to="/programs/changepreneur-circle"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto"
                        >
                          <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                            <span>Explore Circle</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-100" />
                          </button>
                        </Link>
                      ) : isScholarship ? (
                        <a
                          href="https://www.yuvaparipalan.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto"
                        >
                          <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                            <span>Learn More & Apply</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-100" />
                          </button>
                        </a>
                      ) : (
                        <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 ml-auto">
                          <span>Learn More & Apply</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-100" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Program Detail Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
            <div className="max-w-2xl w-full bg-white border border-emerald-900/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shrink-0">
                    {iconMap[selectedProgram.iconName]}
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                      {selectedProgram.title}
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 tracking-wide mt-1">
                      {selectedProgram.badge}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedProgram.fullDescription}
              </p>

              <div className="space-y-2">
                <h4 className="font-heading font-bold text-slate-900 text-sm">Key Program Highlights:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {selectedProgram.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span className="font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-emerald-900 font-mono font-bold flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-800" /> {selectedProgram.impactTarget}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="px-4 py-2 rounded-xl text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Close
                  </button>
                  <button
                    disabled
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed opacity-80"
                  >
                    Launching Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
