import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FLAGSHIP_PROGRAMS } from '../data/mockData';
import { FadeIn } from '../components/motion/FadeIn';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Sparkles, BrainCircuit, Laptop, HeartPulse, ShieldCheck, Coins, UsersRound, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-8 h-8 text-emerald-800" />,
  Sparkles: <Sparkles className="w-8 h-8 text-amber-800" />,
  BrainCircuit: <BrainCircuit className="w-8 h-8 text-blue-800" />,
  Laptop: <Laptop className="w-8 h-8 text-cyan-800" />,
  HeartPulse: <HeartPulse className="w-8 h-8 text-rose-800" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-teal-800" />,
  Coins: <Coins className="w-8 h-8 text-amber-800" />,
  UsersRound: <UsersRound className="w-8 h-8 text-emerald-800" />,
};

export const ProgramsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPrograms = FLAGSHIP_PROGRAMS.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHead
        title="Programs & Flagship Missions - Yuvaparipalan Foundation"
        description="Explore the Flagship Missions and Programs of Yuvaparipalan Foundation: Scholarship Mission, Changepreneur Circle, Shepreneurs, AI Literacy, and Healthcare."
      />

      <div className="pt-32 pb-24 bg-[#fafaf7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
              <span className="text-xs font-mono font-semibold tracking-widest text-emerald-900 uppercase bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Core Initiatives
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Flagship Programs & Missions
              </h1>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                Empowering individuals across education, technology, women entrepreneurship, leadership, and preventive health.
              </p>
            </div>
          </FadeIn>

          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto mb-12 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search programs by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-emerald-900/15 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-700 text-sm shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: 'all', label: 'All Programs' },
                { id: 'education', label: 'Education & Grants' },
                { id: 'tech', label: 'AI & Digital Tech' },
                { id: 'entrepreneurship', label: 'Shepreneurs & Business' },
                { id: 'health', label: 'Healthcare & Wellness' },
                { id: 'community', label: 'Leadership & Volunteers' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none',
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPrograms.map((program, idx) => (
              <FadeIn key={program.id} direction="up" delay={idx * 0.05} className="h-full">
                <div id={program.id} className="p-8 rounded-3xl bg-white border border-emerald-900/15 hover:border-emerald-700/40 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                          {iconMap[program.iconName]}
                        </div>
                        <div>
                          <Badge variant="emerald">{program.badge}</Badge>
                          <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
                            {program.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {program.fullDescription}
                    </p>

                    <div className="space-y-2 flex-1 flex flex-col">
                      <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider">Program Highlights:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                        {program.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-800" /> {program.impactTarget}
                    </div>
                    {program.id === 'changepreneur-circle' ? (
                      <Link
                        to="/programs/changepreneur-circle"
                        className="w-full sm:w-auto"
                      >
                        <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                          <span>Explore & Join Circle</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
                        </button>
                      </Link>
                    ) : program.id === 'scholarship-mission' || program.id === 'merit-scholarship' || program.title.toLowerCase().includes('scholarship') ? (
                      <a
                        href="https://www.yuvaparipalan.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                      >
                        <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                          <span>Learn More & Apply</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
                        </button>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed opacity-80"
                      >
                        Launching Soon
                      </button>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
