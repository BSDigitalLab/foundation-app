import React, { useState, useEffect } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import {
  Search, GraduationCap, Sparkles, BrainCircuit, Laptop, HeartPulse,
  ShieldCheck, Coins, UsersRound, ArrowRight, Target, CheckCircle2,
  Clock, Compass, Sparkle, Tag
} from 'lucide-react';
import { cn } from '../utils/cn';
import { FLAGSHIP_PROGRAMS } from '../data/mockData';
import { Program } from '../types';

interface PublishedProgramItem {
  id: string;
  program_code: string;
  name: string;
  short_name?: string;
  public_slug: string;
  canonical_public_url?: string;
  description: string;
  status: string;
  learning_mode?: string;
  duration?: string | null;
  thumbnail_url?: string | null;
  commercials: {
    market_price: number;
    subscription_price: number;
    taxable_base?: number;
    gst_amount?: number;
    currency: string;
  };
  highlights?: string[];
  impactTarget?: string;
  category?: 'education' | 'tech' | 'entrepreneurship' | 'health' | 'community';
  iconName?: string;
}

// Canonical published programs baseline to guarantee zero downtime / zero broken states
const INITIAL_PUBLISHED_PROGRAMS: PublishedProgramItem[] = [
  {
    id: 'd7180ba6-a22d-4330-85d1-8dfa9e321277',
    program_code: 'CESP100',
    name: 'Career Excellence & Scholarship Program',
    short_name: 'Career Excellence & Scholarship Program',
    public_slug: 'career-excellence-scholarship-program',
    description: 'Unlock your potential with one powerful journey combining aptitude assessment, brain development, language skills, AI learning, and expert career mentorship- backed by a ₹20 crore scholarship initiative for 7,000 eligible candidates.',
    status: 'PUBLISHED',
    learning_mode: 'ONLINE',
    duration: '6 Months',
    commercials: {
      market_price: 25000,
      subscription_price: 549,
      taxable_base: 465.25,
      gst_amount: 83.75,
      currency: 'INR',
    },
    category: 'education',
    iconName: 'GraduationCap',
    impactTarget: '100,000 Merit Scholarships by 2035',
    highlights: [
      'Comprehensive Aptitude & Personality Assessment Test',
      'Palana Neurosync Vikas Subscription (180 Days)',
      'Hands-on AI Basic Workshop & Tool Training',
      'Communicative English Language Fluency Program',
      '₹20 Crore Merit Scholarships Initiative',
      'One-on-One Career Excellence Mentorship',
    ],
  },
  {
    id: '92d72ed2-9e24-4355-a3f7-5a1277fbf025',
    program_code: 'CCPM100',
    name: 'Changepreneur Circle Premium Membership',
    short_name: 'Changepreneur Circle Premium Membership',
    public_slug: 'changepreneur-circle-premium-membership',
    description: 'Unlock a year of holistic growth with the Changepreneur Circle Premium Membership, combining health and wellness, cognitive development, personal empowerment, leadership, entrepreneurship, digital skills, AI learning, and exclusive community access.',
    status: 'PUBLISHED',
    learning_mode: 'HYBRID',
    duration: '36 Months',
    commercials: {
      market_price: 65489,
      subscription_price: 30000,
      taxable_base: 25423.73,
      gst_amount: 4576.27,
      currency: 'INR',
    },
    category: 'community',
    iconName: 'Sparkles',
    impactTarget: 'Empower 10 Young Lives per Member',
    highlights: [
      'CAERING Fitness Smart Ring & Health Tracking',
      'Palana Neurosync Anandha / Zayana (180 Days Subscription)',
      'Happiness Planner & Changepreneur Community Access',
      '₹5,000/- HRC Discount Voucher',
      'Yuvaparipalan Life Membership Access',
      'Youth Empowerment Scholarship Contribution for 10 Students',
      'Personal, Professional, Leadership & Entrepreneurship Bootcamps',
      'Digital Skills & AI Learning, Community Activities & Certificate',
    ],
  },
];

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

export const ProgramsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [publishedPrograms, setPublishedPrograms] = useState<PublishedProgramItem[]>(INITIAL_PUBLISHED_PROGRAMS);
  const [upcomingPrograms] = useState<Program[]>(
    FLAGSHIP_PROGRAMS.filter((p) => p.status === 'upcoming')
  );

  // Sync with live public API in background
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${apiBase}/api/v1/public/programs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load programs (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.status === 'SUCCESS' && Array.isArray(data.data) && data.data.length > 0) {
          // Merge dynamic API data with highlights and icons
          const merged: PublishedProgramItem[] = data.data.map((item: any) => {
            const fallback = INITIAL_PUBLISHED_PROGRAMS.find(
              (init) => init.program_code === item.program_code || init.public_slug === item.public_slug
            );
            return {
              id: item.id || fallback?.id || '',
              program_code: item.program_code || fallback?.program_code || '',
              name: item.name || fallback?.name || '',
              short_name: item.short_name || fallback?.short_name || '',
              public_slug: item.public_slug || fallback?.public_slug || '',
              canonical_public_url: item.canonical_public_url,
              description: item.description || fallback?.description || '',
              status: item.status || 'PUBLISHED',
              learning_mode: item.learning_mode || fallback?.learning_mode || 'ONLINE',
              duration: item.duration || fallback?.duration || null,
              thumbnail_url: item.thumbnail_url || fallback?.thumbnail_url,
              commercials: {
                market_price: item.commercials?.market_price || fallback?.commercials.market_price || 0,
                subscription_price: item.commercials?.subscription_price || fallback?.commercials.subscription_price || 0,
                taxable_base: item.commercials?.taxable_base,
                gst_amount: item.commercials?.gst_amount,
                currency: item.commercials?.currency || 'INR',
              },
              highlights: fallback?.highlights || [],
              impactTarget: fallback?.impactTarget || 'Statewide Transformation Mission',
              category: fallback?.category || 'education',
              iconName: fallback?.iconName || 'GraduationCap',
            };
          });

          // Filter strictly for canonical published offerings
          const validPublished = merged.filter(
            (p) => p.program_code === 'CESP100' || p.program_code === 'CCPM100' || p.description
          );
          if (validPublished.length > 0) {
            setPublishedPrograms(validPublished);
          }
        }
      })
      .catch((err) => {
        console.warn('Live catalogue sync notice (using certified canonical fallback):', err);
        // Retain initial verified state smoothly without disrupting presentation
      });
  }, []);

  // Filter published programs
  const filteredPublished = publishedPrograms.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.program_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter upcoming programs
  const filteredUpcoming = upcomingPrograms.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
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
          {/* Header */}
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <span className="text-xs font-mono font-semibold tracking-widest text-emerald-900 uppercase bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Core Initiatives & Missions
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Flagship Programs & Missions
              </h1>
              <p className="text-slate-700 text-base sm:text-lg font-medium">
                Empowering individuals across education, technology, women entrepreneurship, leadership, and preventive health.
              </p>
            </div>
          </FadeIn>

          {/* Search & Category Filter Bar */}
          <div className="max-w-4xl mx-auto mb-16 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search programs by title, code or description..."
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

          {/* SECTION 1: PUBLISHED PROGRAMS (ENROLLING NOW) */}
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-emerald-900/10">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                </span>
                <div>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
                    Published Programs — Enrolling Now
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Certified active programs available for immediate enrollment and scholarship support.
                  </p>
                </div>
              </div>
              <Badge variant="emerald" className="self-start sm:self-auto font-mono text-[11px] px-3 py-1">
                {filteredPublished.length} Active {filteredPublished.length === 1 ? 'Program' : 'Programs'}
              </Badge>
            </div>

            {filteredPublished.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPublished.map((program, idx) => (
                  <FadeIn key={program.id || program.program_code} direction="up" delay={idx * 0.05} className="h-full">
                    <div
                      id={program.public_slug}
                      className="p-8 rounded-3xl bg-white border border-emerald-900/15 hover:border-emerald-700/40 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col justify-between h-full"
                    >
                      <div className="space-y-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                              {iconMap[program.iconName || 'GraduationCap'] || <GraduationCap className="w-7 h-7 text-emerald-800" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="emerald">{program.program_code}</Badge>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800">
                                  Enrolling
                                </span>
                              </div>
                              <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
                                {program.name}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {program.description}
                        </p>

                        {/* Program Highlights */}
                        {program.highlights && program.highlights.length > 0 && (
                          <div className="space-y-2 flex-1 flex flex-col">
                            <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkle className="w-3.5 h-3.5 text-emerald-700" /> Key Inclusions & Benefits:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                              {program.highlights.map((h, i) => (
                                <div key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pricing & Commercials */}
                        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                              Scholarship Subsidized Fee
                            </span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-2xl font-black text-slate-950 font-mono">
                                ₹{program.commercials.subscription_price.toLocaleString('en-IN')}
                              </span>
                              {program.commercials.market_price > program.commercials.subscription_price && (
                                <span className="text-xs text-slate-400 line-through font-mono">
                                  ₹{program.commercials.market_price.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                          {program.duration && (
                            <span className="text-xs font-mono font-semibold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                              {program.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span className="truncate">{program.impactTarget}</span>
                        </div>
                        {program.program_code === 'CCPM100' ? (
                          <Link
                            to="/programs/changepreneur-circle"
                            className="w-full sm:w-auto"
                          >
                            <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto">
                              <span>Explore & Join Circle</span>
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
                            </button>
                          </Link>
                        ) : (
                          <Link
                            to={`/programs/${program.public_slug}`}
                            className="w-full sm:w-auto"
                          >
                            <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto">
                              <span>Explore & Enroll</span>
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-xl mx-auto space-y-2">
                <Target className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  No Published Programs Match Search
                </h3>
                <p className="text-xs text-slate-600">
                  Try adjusting your search query or selecting "All Programs" above.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: COMING SOON PROGRAMS & MISSIONS */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
                    Upcoming Flagship Missions — Coming Soon
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Strategic developmental initiatives currently in pipeline preparation for nationwide rollout.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto font-mono text-xs font-semibold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
                {filteredUpcoming.length} Upcoming {filteredUpcoming.length === 1 ? 'Mission' : 'Missions'}
              </span>
            </div>

            {filteredUpcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcoming.map((program, idx) => (
                  <FadeIn key={program.id} direction="up" delay={idx * 0.04} className="h-full">
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between h-full relative overflow-hidden group">
                      <div className="space-y-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
                              {iconMap[program.iconName] || <BrainCircuit className="w-6 h-6 text-slate-700" />}
                            </div>
                            <div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                                {program.badge}
                              </span>
                              <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                                {program.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {program.shortDescription}
                        </p>

                        {/* Program Highlights */}
                        {program.highlights && program.highlights.length > 0 && (
                          <div className="space-y-1.5 flex-1 pt-2">
                            <h4 className="font-heading font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                              Mission Highlights:
                            </h4>
                            <div className="space-y-1.5 text-xs text-slate-600">
                              {program.highlights.slice(0, 3).map((h, i) => (
                                <div key={i} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                  <span className="text-[11px] leading-tight font-medium text-slate-700">{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-slate-600 truncate">
                          <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{program.impactTarget}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                          <Clock className="w-3 h-3 text-amber-700" /> Launching Soon
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-xl mx-auto space-y-2">
                <Compass className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  No Upcoming Missions Match Search
                </h3>
                <p className="text-xs text-slate-600">
                  Try adjusting your search query or selecting "All Programs" above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
