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
    const programs: PublicProgram[] = Array.isArray(json?.data) ? json.data : [];

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
