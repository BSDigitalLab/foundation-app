/**
 * Dynamic Program Resolution Service
 * 
 * Provides authoritative runtime resolution of published programs from the backend platform API.
 * Eliminates hardcoded program UUIDs and enforces canonical business identifiers (program_code).
 * 
 * Governed by Production Safe Architecture Directives:
 * 1. Authoritative resolution against GET /api/v1/public/programs
 * 2. Strict status verification (only 'PUBLISHED' programs eligible for checkout)
 * 3. Server-side authoritative pricing and commercial governance
 * 4. Controlled failure modes (zero synthetic order fallbacks)
 */

import { getPlatformApiBaseUrl } from '../config/apiConfig.ts';

export interface PublicProgramCommercials {
  market_price: number;
  subscription_price: number;
  taxable_base?: number;
  gst_amount?: number;
  currency: string;
}

export interface PublicProgramSubmodule {
  name: string;
  type: string;
  allocated_units?: number;
  allocation_policy?: string;
}

export interface PublicProgramComponent {
  id: string;
  component_id?: string;
  name: string;
  offering_type: string;
  delivery_type?: string;
  quantity: number;
  unit_of_measure?: string;
  image_url?: string | null;
  description?: string | null;
  key_highlights?: string[];
  submodules?: PublicProgramSubmodule[];
}

export interface PublicProgram {
  id: string;
  program_code: string;
  name: string;
  short_name?: string;
  public_slug: string;
  canonical_public_url?: string;
  description?: string;
  status: string;
  learning_mode?: string;
  duration?: string | null;
  thumbnail_url?: string | null;
  commercials: PublicProgramCommercials;
  components?: PublicProgramComponent[];
  published_at?: string;
}

export type ProgramResolutionErrorCode = 
  | 'PROGRAM_NOT_FOUND'
  | 'PROGRAM_UNPUBLISHED'
  | 'RESOLUTION_NETWORK_ERROR'
  | 'INVALID_RESPONSE';

export class ProgramResolutionError extends Error {
  public readonly code: ProgramResolutionErrorCode;
  public readonly programCode?: string;

  constructor(message: string, code: ProgramResolutionErrorCode, programCode?: string) {
    super(message);
    this.name = 'ProgramResolutionError';
    this.code = code;
    this.programCode = programCode;
  }
}

// In-memory cache for public programs list
let cachedPrograms: PublicProgram[] | null = null;
let cacheExpiry: number = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

/**
 * Clear the in-memory program cache (useful for testing or manual refresh)
 */
export const clearProgramCache = (): void => {
  cachedPrograms = null;
  cacheExpiry = 0;
};

/**
 * Fetch all published programs from the authoritative public catalog API.
 */
export const fetchPublicPrograms = async (forceRefresh = false): Promise<PublicProgram[]> => {
  const now = Date.now();
  if (!forceRefresh && cachedPrograms && now < cacheExpiry) {
    return cachedPrograms;
  }

  const apiBase = getPlatformApiBaseUrl();
  const url = `${apiBase}/api/v1/public/programs`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new ProgramResolutionError(
        `Failed to fetch public programs catalog: HTTP ${res.status}`,
        'RESOLUTION_NETWORK_ERROR'
      );
    }

    const json = await res.json();
    const rawPrograms: any[] = Array.isArray(json?.data) ? json.data : [];

    // Hydrate components & offerings for each program from the single source of truth public slug API
    const programs: PublicProgram[] = await Promise.all(
      rawPrograms.map(async (prog) => {
        if (Array.isArray(prog.components) && prog.components.length > 0) {
          return prog as PublicProgram;
        }
        if (!prog.public_slug) return prog as PublicProgram;
        try {
          const detailRes = await fetch(`${apiBase}/api/v1/public/programs/${encodeURIComponent(prog.public_slug)}`, {
            headers: { 'Accept': 'application/json' },
          });
          if (detailRes.ok) {
            const detailJson = await detailRes.json();
            if (detailJson?.data?.components) {
              return {
                ...prog,
                components: detailJson.data.components,
              } as PublicProgram;
            }
          }
        } catch {
          // Fallback to basic program item on network failure
        }
        return prog as PublicProgram;
      })
    );

    cachedPrograms = programs;
    cacheExpiry = now + CACHE_TTL_MS;
    return programs;
  } catch (err: any) {
    if (err instanceof ProgramResolutionError) throw err;
    throw new ProgramResolutionError(
      `Network error communicating with public programs API: ${err.message || err}`,
      'RESOLUTION_NETWORK_ERROR'
    );
  }
};

export interface ResolveProgramOptions {
  aliasCodes?: string[];
  fallbackSlugs?: string[];
  forceRefresh?: boolean;
}

/**
 * Known canonical code mappings to handle legacy aliases smoothly
 */
const CANONICAL_CODE_ALIASES: Record<string, string> = {
  'CCPM100': 'CCPAM100', // Legacy Changepreneur Circle code mapped to published CCPAM100
};

/**
 * Authoritatively resolves a published program by its business identifier (program_code).
 * 
 * Performs:
 * 1. Alias reconciliation (e.g. legacy CCPM100 -> canonical CCPAM100).
 * 2. Dynamic lookup against published programs list.
 * 3. Fallback direct slug fetch if not present in cached catalog list.
 * 4. Validation that status is 'PUBLISHED'.
 * 
 * Throws ProgramResolutionError if program is not found or not published.
 */
export const resolveProgramByCode = async (
  targetCode: string,
  options: ResolveProgramOptions = {}
): Promise<PublicProgram> => {
  const normalizedTarget = targetCode.trim().toUpperCase();
  const canonicalMapped = CANONICAL_CODE_ALIASES[normalizedTarget] || normalizedTarget;

  const candidateCodes = new Set<string>([
    normalizedTarget,
    canonicalMapped,
    ...(options.aliasCodes || []).map(c => c.trim().toUpperCase())
  ]);

  // 1. Fetch public programs catalog
  const programs = await fetchPublicPrograms(options.forceRefresh);

  // 2. Search by matching program_code
  let matched = programs.find(p => candidateCodes.has((p.program_code || '').trim().toUpperCase()));

  // 3. If not matched by code, attempt match by slug in returned catalog
  if (!matched && options.fallbackSlugs && options.fallbackSlugs.length > 0) {
    const slugSet = new Set(options.fallbackSlugs.map(s => s.toLowerCase()));
    matched = programs.find(p => slugSet.has((p.public_slug || '').toLowerCase()));
  }

  // 4. If still not found and fallback slugs provided, try direct public program slug API
  if (!matched && options.fallbackSlugs && options.fallbackSlugs.length > 0) {
    const apiBase = getPlatformApiBaseUrl();
    for (const slug of options.fallbackSlugs) {
      try {
        const slugRes = await fetch(`${apiBase}/api/v1/public/programs/${encodeURIComponent(slug)}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (slugRes.ok) {
          const slugJson = await slugRes.json();
          if (slugJson?.data && slugJson.data.id) {
            matched = slugJson.data as PublicProgram;
            break;
          }
        }
      } catch (e) {
        // Continue to next slug or error
      }
    }
  }

  // 5. Verification of existence
  if (!matched) {
    throw new ProgramResolutionError(
      `Program with code '${targetCode}' was not found in the public programs catalog.`,
      'PROGRAM_NOT_FOUND',
      targetCode
    );
  }

  // 6. Verification of publication eligibility
  if (matched.status !== 'PUBLISHED') {
    throw new ProgramResolutionError(
      `Program '${matched.name}' (${matched.program_code}) is not currently published (status: ${matched.status}).`,
      'PROGRAM_UNPUBLISHED',
      matched.program_code
    );
  }

  return matched;
};

export interface ProgramClassification {
  category: 'education' | 'tech' | 'entrepreneurship' | 'health' | 'community';
  iconName: string;
  impactTarget: string;
}

export function resolveProgramClassification(prog: {
  program_code?: string;
  public_slug?: string;
  name?: string;
}): ProgramClassification {
  const code = (prog.program_code || '').toUpperCase().trim();
  const slug = (prog.public_slug || '').toLowerCase().trim();
  const name = (prog.name || '').toLowerCase().trim();

  // 1. Authoritative Code / Slug Precedence (Protects against keyword hijacking)
  if (code.startsWith('CCP') || slug.includes('changepreneur') || name.includes('changepreneur')) {
    return {
      category: 'community',
      iconName: 'Sparkles',
      impactTarget: 'Empower 10 Young Lives per Member',
    };
  }

  if (code.startsWith('CESP') || slug.includes('career-excellence') || name.includes('career excellence scholarship')) {
    return {
      category: 'education',
      iconName: 'GraduationCap',
      impactTarget: '100,000 Merit Scholarships by 2035',
    };
  }

  if (code.startsWith('SHEP') || slug.includes('shepreneur') || name.includes('shepreneur')) {
    return {
      category: 'entrepreneurship',
      iconName: 'Coins',
      impactTarget: '100,000 Shepreneurs Built',
    };
  }

  if (slug.includes('ai-') || name.includes('artificial intelligence') || name.includes('ai & digital')) {
    return {
      category: 'tech',
      iconName: 'BrainCircuit',
      impactTarget: '1,000,000 Youth AI Enablement',
    };
  }

  if (slug.includes('discovery') || name.includes('career discovery')) {
    return {
      category: 'education',
      iconName: 'BrainCircuit',
      impactTarget: 'Targeted Student Career Pathways',
    };
  }

  // 2. Name-only fallback (never searches descriptions)
  if (name.includes('scholarship') || name.includes('fellowship')) {
    return {
      category: 'education',
      iconName: 'GraduationCap',
      impactTarget: 'Merit Scholarships & Youth Enablement',
    };
  }

  return {
    category: 'community',
    iconName: 'Sparkles',
    impactTarget: 'Statewide Transformation Mission',
  };
}
