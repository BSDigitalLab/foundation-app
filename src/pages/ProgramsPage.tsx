import React, { useState, useEffect, useCallback } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import {
  Search, GraduationCap, Sparkles, BrainCircuit, Laptop, HeartPulse,
  ShieldCheck, Coins, UsersRound, ArrowRight, Target, CheckCircle2,
  Sparkle, AlertCircle, RefreshCw, Layers, X, Info
} from 'lucide-react';
import { cn } from '../utils/cn';
import { getPlatformApiBaseUrl } from '../config/apiConfig';
import { fetchPublicPrograms, PublicProgramComponent, resolveProgramClassification } from '../services/programResolutionService';

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
  components?: PublicProgramComponent[];
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



export const ProgramsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [publishedPrograms, setPublishedPrograms] = useState<PublishedProgramItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<PublicProgramComponent | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSubmodule(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Authoritative Single Source of Truth resolution via programResolutionService
      const programs = await fetchPublicPrograms(true);
      if (Array.isArray(programs) && programs.length > 0) {
        const mapped: PublishedProgramItem[] = programs.map((item) => {
          const inferred = resolveProgramClassification({
            program_code: item.program_code,
            public_slug: item.public_slug,
            name: item.name,
          });
          
          // Authoritative highlights: derive strictly from genuine components in SOT
          const authoritativeHighlights = (item.components && item.components.length > 0)
            ? item.components.map(c => c.name)
            : [];

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
            duration: item.duration || '12 Months',
            thumbnail_url: item.thumbnail_url,
            commercials: {
              market_price: Number(item.commercials?.market_price) || 0,
              subscription_price: Number(item.commercials?.subscription_price) || 0,
              taxable_base: Number(item.commercials?.taxable_base) || 0,
              gst_amount: Number(item.commercials?.gst_amount) || 0,
              currency: item.commercials?.currency || 'INR',
            },
            highlights: authoritativeHighlights,
            components: item.components,
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* PUBLISHED PROGRAMS FULL-WIDTH SHOWCASE */}
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
              <div className="w-full space-y-8">
                {[1].map((n) => (
                  <div key={n} className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="w-28 h-5 bg-slate-200 rounded" />
                        <div className="w-1/2 h-7 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-slate-100 rounded" />
                      <div className="w-5/6 h-4 bg-slate-100 rounded" />
                    </div>
                    <div className="h-32 bg-emerald-50/50 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : filteredPublished.length > 0 ? (
              /* FULL-WIDTH PROGRAM CARDS */
              <div className="w-full space-y-10">
                {filteredPublished.map((program, idx) => {
                  const isChangepreneur =
                    program.program_code === 'CCPAM100' ||
                    program.program_code === 'CCPM100' ||
                    program.public_slug.includes('changepreneur');
                  const isCESP =
                    program.program_code === 'CESP100' ||
                    program.public_slug.includes('career-excellence');

                                    const primaryOfferingType = program.components?.find(c => c.offering_type)?.offering_type;
                  const programType = primaryOfferingType
                    ? primaryOfferingType.charAt(0).toUpperCase() + primaryOfferingType.slice(1).toLowerCase().replace('_', ' ')
                    : 'Membership';

                  return (
                    <FadeIn key={program.id || program.program_code} direction="up" delay={idx * 0.05} className="w-full">
                      <div
                        id={program.public_slug}
                        className="w-full rounded-3xl bg-white border border-emerald-900/15 hover:border-emerald-700/40 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden p-6 sm:p-8 lg:p-10 space-y-8"
                      >
                        {/* TOP SECTION: 2-COLUMN FULL-WIDTH HERO (EQUAL HEIGHT) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                          {/* LEFT: Identity, Badges & Narrative (lg:col-span-8) */}
                          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                            <div className="space-y-4">
                              {/* Badges Bar */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="emerald" className="font-mono text-xs px-2.5 py-1">
                                  {program.program_code}
                                </Badge>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                  Enrolling Now
                                </span>
                              </div>

                              {/* Title & Icon */}
                              <div className="flex items-start gap-4 pt-1">
                                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0 mt-1">
                                  {iconMap[program.iconName] || <Sparkles className="w-8 h-8 text-emerald-800" />}
                                </div>
                                <div>
                                  <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-950 tracking-tight leading-tight">
                                    {program.name}
                                  </h3>
                                  {program.impactTarget && (
                                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 mt-1.5">
                                      <Target className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                      <span>Target Impact: {program.impactTarget}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Authoritative Program Summary / Description */}
                              <div className="pt-2">
                                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                                  {program.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT: Price Card with matching height and clean structure (lg:col-span-4) */}
                          <div className="lg:col-span-4 bg-gradient-to-br from-emerald-50/90 via-emerald-50/50 to-white p-6 sm:p-8 rounded-3xl border border-emerald-200/90 shadow-xs flex flex-col justify-between items-center text-center h-full space-y-6">
                            <div className="my-auto flex flex-col items-center justify-center space-y-2">
                              {/* Program Type text before price */}
                              <span className="text-xs sm:text-sm font-extrabold font-mono text-emerald-800 uppercase tracking-widest block">
                                {programType}
                              </span>
                              <div className="text-4xl sm:text-5xl font-black text-slate-950 font-mono tracking-tight">
                                {program.commercials.subscription_price > 0
                                  ? `₹${program.commercials.subscription_price.toLocaleString('en-IN')}`
                                  : 'Grant Funded'}
                              </div>
                            </div>

                            <div className="pt-4">
                              {isChangepreneur ? (
                                <Link to="/programs/changepreneur-circle" className="w-full block">
                                  <button className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                                    <span>Explore & Join Circle</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-100" />
                                  </button>
                                </Link>
                              ) : isCESP ? (
                                <Link to="/programs/career-excellence-scholarship-program" className="w-full block">
                                  <button className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                                    <span>Explore & Enroll</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-100" />
                                  </button>
                                </Link>
                              ) : (
                                <Link to={`/programs/${program.public_slug}`} className="w-full block">
                                  <button className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-700">
                                    <span>Explore & Enroll</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-100" />
                                  </button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* BOTTOM SECTION: SUBMODULES AS 3 FULL-WIDTH PRODUCT IMAGE CARDS PER ROW */}
                        {program.components && program.components.length > 0 ? (
                          <div className="pt-8 border-t border-emerald-900/10 space-y-6">
                            {/* Section Header */}
                            <div>
                              <h4 className="font-heading font-black text-xl sm:text-2xl text-slate-950 tracking-tight">
                                Offering
                              </h4>
                            </div>

                            {/* 3 Full-Width Product Image Cards in a row with Interactive Modal Trigger */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
                              {program.components.map((comp, compIdx) => (
                                <div
                                  key={comp.id || compIdx}
                                  onClick={() => setSelectedSubmodule(comp)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      setSelectedSubmodule(comp);
                                    }
                                  }}
                                  aria-label={`View details for ${comp.name}`}
                                  className="cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200/80 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 group flex items-center justify-center p-3 sm:p-4 relative"
                                >
                                  {comp.image_url ? (
                                    <img
                                      src={comp.image_url}
                                      alt={comp.name}
                                      className="w-full h-auto object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                                      loading="lazy"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full aspect-[4/3] rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col items-center justify-center p-6 text-center text-emerald-800">
                                      <Layers className="w-10 h-10 mb-2 opacity-60" />
                                      <span className="font-heading font-bold text-sm text-slate-800">{comp.name}</span>
                                    </div>
                                  )}
                                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs pointer-events-none">
                                    <Info className="w-2.5 h-2.5" /> Details
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : program.highlights && program.highlights.length > 0 ? (
                          <div className="pt-6 border-t border-emerald-900/10 space-y-3">
                            <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkle className="w-3.5 h-3.5 text-emerald-700" /> Key Inclusions & Benefits:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-slate-700 font-medium">
                              {program.highlights.map((h, i) => (
                                <div key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </FadeIn>       );
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
      {/* Submodule Informative Popup Modal */}
      {selectedSubmodule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedSubmodule(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {selectedSubmodule.offering_type ? selectedSubmodule.offering_type.replace('_', ' ') : 'OFFERING'}
                </span>
                {selectedSubmodule.delivery_type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                    {selectedSubmodule.delivery_type.replace('_', ' ')}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSubmodule(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Product Media Display */}
              {selectedSubmodule.image_url && (
                <div className="w-full flex items-center justify-center bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80">
                  <img
                    src={selectedSubmodule.image_url}
                    alt={selectedSubmodule.name}
                    className="max-h-56 w-auto object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="font-heading font-black text-xl text-slate-950 leading-snug">
                {selectedSubmodule.name}
              </h3>

              {/* Program Description */}
              {selectedSubmodule.description && (
                <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/80">
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {selectedSubmodule.description}
                  </p>
                </div>
              )}

              {/* Nested Curriculum Modules (if any) */}
              {selectedSubmodule.submodules && selectedSubmodule.submodules.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-heading">
                    Included Curriculum Modules ({selectedSubmodule.submodules.length})
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedSubmodule.submodules.map((sm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{sm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights (if any) */}
              {selectedSubmodule.key_highlights && selectedSubmodule.key_highlights.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-heading">
                    Key Inclusions ({selectedSubmodule.key_highlights.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedSubmodule.key_highlights.map((kh, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{kh}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedSubmodule(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
