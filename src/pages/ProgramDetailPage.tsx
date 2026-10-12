import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  GraduationCap, Clock, Award, ShieldCheck, CheckCircle2, 
  ArrowLeft, ArrowRight, Share2, Layers, BookOpen, AlertCircle, Loader2, Sparkles, Building2, Package
} from 'lucide-react';

interface ProgramDetailData {
  id: string;
  program_code: string;
  name: string;
  short_name?: string;
  public_slug: string;
  canonical_public_url: string;
  description: string;
  status: string;
  learning_mode: string;
  duration?: string | null;
  media: {
    thumbnail_url?: string | null;
    brochure_url?: string | null;
  };
  commercials: {
    market_price: number;
    subscription_price: number;
    currency: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    canonical_url: string;
    og_image_url?: string | null;
    robots_directive: string;
    structured_data_schema?: any;
  };
  components: Array<{
    id: string;
    name: string;
    offering_type: string;
    delivery_type: string;
    quantity: number;
    unit_of_measure: string;
    image_url?: string | null;
    description?: string | null;
  }>;
}

export const ProgramDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<ProgramDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${apiBase}/api/v1/public/programs/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Program not found or has not been published yet.');
          }
          throw new Error(`Failed to load program details (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === 'SUCCESS' && data.data) {
          setProgram(data.data);
        } else {
          throw new Error('Invalid response structure from program catalog service.');
        }
      })
      .catch((err) => {
        console.error('Program detail fetch error:', err);
        setError(err.message || 'Failed to load program.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#fafaf7] pt-32">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-800" />
        <span className="text-xs font-mono text-emerald-900 font-semibold tracking-wider">
          Fetching Program Authority & Curriculum...
        </span>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#fafaf7] px-4 pt-32 text-center">
        <div className="p-4 bg-rose-100 rounded-full text-rose-700">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Program Unavailable</h2>
        <p className="text-slate-600 max-w-md text-sm">
          {error || 'The requested program catalog URL could not be found or is undergoing scheduled administrative review.'}
        </p>
        <Link to="/programs" className="mt-4">
          <Button variant="primary" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const formatDelivery = (dt: string) => {
    if (!dt) return 'Online';
    if (dt === 'DOOR_DELIVERY') return 'Door Delivery / Direct Dispatch';
    return dt.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <SEOHead
        title={program.seo.meta_title || `${program.name} - Yuvaparipalan Foundation`}
        description={program.seo.meta_description || program.description}
        canonicalUrl={program.canonical_public_url || `https://yuvaparipalan.org/programs/${program.public_slug}`}
      />

      <div className="pt-28 pb-24 bg-[#fafaf7]">
        {/* Navigation Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            to="/programs"
            className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Programs Catalog
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Details */}
            <div className="lg:col-span-8 space-y-6">
              <FadeIn direction="up">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {program.program_code}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                      {formatDelivery(program.learning_mode)}
                    </span>
                    {program.duration && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {program.duration}
                      </span>
                    )}
                  </div>

                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {program.name}
                  </h1>

                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                    {program.description}
                  </p>
                </div>
              </FadeIn>

              {/* Submodules & Program Components */}
              {program.components && program.components.length > 0 && (
                <FadeIn direction="up" delay={0.1}>
                  <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/15 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <Layers className="w-5 h-5 text-emerald-800" /> Included Modules & Catalog Offerings
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Canonical components composed into this comprehensive program package.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 text-emerald-800 border border-emerald-200">
                        {program.components.length} {program.components.length === 1 ? 'Module' : 'Modules'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {program.components.map((comp) => (
                        <div
                          key={comp.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-700/30 transition-all flex items-start gap-3"
                        >
                          {comp.image_url ? (
                            <img
                              src={comp.image_url}
                              alt={comp.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm text-slate-900 truncate" title={comp.name}>
                              {comp.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                              <span className="font-semibold text-emerald-800">{comp.offering_type}</span>
                              <span>•</span>
                              <span>{formatDelivery(comp.delivery_type)}</span>
                              {comp.quantity > 1 && (
                                <>
                                  <span>•</span>
                                  <span className="font-bold">{comp.quantity} {comp.unit_of_measure}</span>
                                </>
                              )}
                            </div>
                            {comp.description && (
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                                {comp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Right 4 Columns: Commercial Pricing Card & Enrollment */}
            <div className="lg:col-span-4">
              <FadeIn direction="up" delay={0.15}>
                <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-900/20 shadow-xl space-y-6">
                  {program.media.thumbnail_url && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={program.media.thumbnail_url}
                        alt={program.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Commercials Box */}
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Scholarship Subsidized Fee
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-slate-900 font-mono">
                        {program.commercials.currency === 'USD' ? '$' : '₹'}
                        {program.commercials.subscription_price.toLocaleString('en-IN')}
                      </span>
                      {program.commercials.market_price > program.commercials.subscription_price && (
                        <span className="text-sm font-semibold text-slate-400 line-through font-mono">
                          {program.commercials.currency === 'USD' ? '$' : '₹'}
                          {program.commercials.market_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {program.commercials.market_price > program.commercials.subscription_price && (
                      <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Subsidized Foundation Rate
                      </span>
                    )}
                  </div>

                  {/* Value Highlights */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Certified Curriculum & Assessment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Direct Mentorship from Industry Leaders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Institutional Foundation Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Eligible for Career Placement Assistance</span>
                    </div>
                  </div>

                  {/* Enrollment Action */}
                  <div className="space-y-3 pt-2">
                    <Link to="/contact" className="block w-full">
                      <Button variant="primary" className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm tracking-wide rounded-2xl shadow-lg shadow-emerald-900/20">
                        Enroll in Program <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    {program.media.brochure_url && (
                      <a
                        href={program.media.brochure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Download Official Brochure
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramDetailPage;
