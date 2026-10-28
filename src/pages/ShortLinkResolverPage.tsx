import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getPlatformApiBaseUrl } from '../config/apiConfig';
import { SEOHead } from '../components/common/SEOHead';

export const ShortLinkResolverPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!code) return;

    // Detect whether this is a short-link (/s/:code) or campaign link (/c/:code)
    const isCampaign = location.pathname.startsWith('/c/');
    const routePrefix = isCampaign ? 'c' : 's';
    const apiBase = getPlatformApiBaseUrl();
    const query = location.search || '';
    const redirectTarget = `${apiBase}/${routePrefix}/${encodeURIComponent(code)}${query}`;

    // Perform authoritative redirect to the platform backend resolver
    window.location.replace(redirectTarget);

    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [code, location.pathname, location.search]);

  return (
    <>
      <SEOHead
        title="Opening Program | Yuvaparipalan Foundation"
        description="Redirecting you to the authoritative Yuvaparipalan Foundation program details."
      />

      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-6 bg-slate-950 px-4 pt-28 text-center text-slate-100">
        {!timedOut ? (
          <>
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Opening Program Details...</h2>
              <p className="text-xs font-mono text-emerald-400">Verifying secure partner attribution</p>
            </div>
          </>
        ) : (
          <div className="max-w-md space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Taking longer than usual?</h2>
            <p className="text-sm text-slate-400">
              You can navigate directly to the program or explore the general catalog.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/programs/changepreneur-circle">
                <Button variant="primary" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  Changepreneur Circle <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/programs">
                <Button variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-900">
                  All Programs
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
