import React, { useState, useEffect, useCallback } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import {
  Search, GraduationCap, Sparkles, BrainCircuit, Laptop, HeartPulse,
  ShieldCheck, Coins, UsersRound, ArrowRight, Target, CheckCircle2,
  Sparkle, AlertCircle, RefreshCw
} from 'lucide-react';
import { cn } from '../utils/cn';
import { getPlatformApiBaseUrl } from '../config/apiConfig';

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
  category: 'education' | 'tech' | 'entrepreneurship' | 'health' | 'community';
  iconName: string;
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

function inferCategoryAndIcon(name: string, description: string): {
  category: 'education' | 'tech' | 'entrepreneurship' | 'health' | 'community';
  iconName: string;
  impactTarget: string;
  highlights: string[];
} {
  const text = (name + ' ' + (description || '')).toLowerCase();

  if (text.includes('scholarship') || text.includes('career excellence') || text.includes('student') || text.includes('education')) {
    return {
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
    };
  }

  if (text.includes('changepreneur') || text.includes('circle')) {
    return {
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
    };
  }

  if (text.includes('discovery') || text.includes('assessment')) {
    return {
      category: 'education',
      iconName: 'BrainCircuit',
      impactTarget: 'Targeted Student Career Pathways',
      highlights: [
        'Holistic Psychometric & Aptitude Evaluation',
        'Scientific Stream & Domain Mapping',
        'Personalized Career Action Blueprint',
        'Direct Industry Mentor Advisory Access',
      ],
    };
  }

  if (text.includes('ai') || text.includes('tech') || text.includes('digital')) {
    return {
      category: 'tech',
      iconName: 'BrainCircuit',
      impactTarget: '1,000,000 Youth AI Enablement',
      highlights: [
        'Generative AI Foundations & Prompt Engineering',
        'No-Code Workflow Automation & Tools',
        'Digital Portfolio & Industry Skill Credentials',
      ],
    };
  }

  if (text.includes('shepreneur') || text.includes('women') || text.includes('entrepreneur')) {
    return {
      category: 'entrepreneurship',
      iconName: 'Coins',
      impactTarget: '100,000 Shepreneurs Built',
      highlights: [
        'Micro-Enterprise Incubation & Toolkits',
        'Financial Literacy & Digital Trade Access',
        'National Market Linkages & Mentorship',
      ],
    };
  }

  return {
    category: 'community',
    iconName: 'Sparkles',
    impactTarget: 'Statewide Transformation Mission',
    highlights: [
      'Structured Empowerment Framework',
      'Community Action Network Access',
      'Certified Foundation Recognition',
    ],
  };
}

export const ProgramsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [publishedPrograms, setPublishedPrograms] = useState<PublishedProgramItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getPlatformApiBaseUrl();
      const res = await fetch(`${apiBase}/api/v1/public/programs`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Catalogue service responded with HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data && data.status === 'SUCCESS' && Array.isArray(data.data)) {
        const mapped: PublishedProgramItem[] = data.data.map((item: any) => {
          const inferred = inferCategoryAndIcon(item.name || '', item.description || '');
          return {
            id: item.id,
            program_code: item.program_code,
            name: item.name,
            short_name: item.short_name || item.name,
            public_slug: item.public_slug,
            canonical_public_url: item.canonical_public_url,
            description: item.description || 'Comprehensive program empowering youth with future-ready skills and mentorship.',
            status: item.status || 'PUBLISHED',
            learning_mode: item.learning_mode || 'ONLINE',
            duration: item.duration || '6 Months',
            thumbnail_url: item.thumbnail_url,
            commercials: {
              market_price: Number(item.commercials?.market_price) || 0,
              subscription_price: Number(item.commercials?.subscription_price) || 0,
              taxable_base: Number(item.commercials?.taxable_base) || 0,
              gst_amount: Number(item.commercials?.gst_amount) || 0,
              currency: item.commercials?.currency || 'INR',
            },
            highlights: inferred.highlights,
            impactTarget: inferred.impactTarget,
            category: inferred.category,
            iconName: inferred.iconName,
          };
        });

        setPublishedPrograms(mapped);
      } else {
        setPublishedPrograms([]);
      }
    } catch (err: any) {
      console.error('[SingleSourceOfTruth] Failed to fetch published programs catalog:', err);
      setError(err?.message || 'Unable to connect to the published programs service.');
      setPublishedPrograms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Filter published programs dynamically based on search and category
  const filteredPublished = publishedPrograms.filter((p) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.program_code.toLowerCase().includes(query);
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

          {/* Error Banner with Retry */}
          {error && (
            <div className="max-w-2xl mx-auto mb-12 p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Catalogue Service Notice</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={fetchPrograms}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {/* PUBLISHED PROGRAMS GRID */}
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
                {loading ? 'Loading...' : `${filteredPublished.length} Active ${filteredPublished.length === 1 ? 'Program' : 'Programs'}`}
              </Badge>
            </div>

            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((n) => (
                  <div key={n} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="w-24 h-4 bg-slate-200 rounded" />
                        <div className="w-3/4 h-6 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-slate-100 rounded" />
                      <div className="w-5/6 h-4 bg-slate-100 rounded" />
                    </div>
                    <div className="h-20 bg-emerald-50/50 rounded-2xl" />
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="w-32 h-4 bg-slate-100 rounded" />
                      <div className="w-28 h-9 bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPublished.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPublished.map((program, idx) => {
                  const isChangepreneur =
                    program.program_code === 'CCPM100' ||
                    program.public_slug.includes('changepreneur');
                  const isCESP =
                    program.program_code === 'CESP100' ||
                    program.public_slug.includes('career-excellence');

                  return (
                    <FadeIn key={program.id || program.program_code} direction="up" delay={idx * 0.05} className="h-full">
                      <div
                        id={program.public_slug}
                        className="p-8 rounded-3xl bg-white border border-emerald-900/15 hover:border-emerald-700/40 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col justify-between h-full"
                      >
                        <div className="space-y-6 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                                {iconMap[program.iconName] || <GraduationCap className="w-7 h-7 text-emerald-800" />}
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
                                {program.commercials.subscription_price > 0 ? 'Scholarship Subsidized Fee' : 'Program Pricing'}
                              </span>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-2xl font-black text-slate-950 font-mono">
                                  {program.commercials.subscription_price > 0
                                    ? `₹${program.commercials.subscription_price.toLocaleString('en-IN')}`
                                    : 'Scholarship Grant'}
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
                          {isChangepreneur ? (
                            <Link
                              to="/programs/changepreneur-circle"
                              className="w-full sm:w-auto"
                            >
                              <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto">
                                <span>Explore & Join Circle</span>
                                <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
                              </button>
                            </Link>
                          ) : isCESP ? (
                            <Link
                              to="/programs/career-excellence-scholarship-program"
                              className="w-full sm:w-auto"
                            >
                              <button className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-auto">
                                <span>Explore & Enroll</span>
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-xl mx-auto space-y-2">
                <Target className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No Published Programs Match Search'
                    : 'No Programs Published Yet'}
                </h3>
                <p className="text-xs text-slate-600">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search query or selecting "All Programs" above.'
                    : 'All programs are governed through the platform catalog registry. Please check back shortly.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
