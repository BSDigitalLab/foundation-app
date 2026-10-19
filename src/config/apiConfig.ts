/**
 * Dynamic Platform API Configuration
 * Single Source of Truth for API Gateway Resolution
 * 
 * Accurately determines the authoritative Platform API base URL based on:
 * 1. Dynamic browser origin detection (distinguishes localhost vs staging/testing vs production)
 * 2. Fail-safe localhost anti-leak guard (never allows loopback on non-localhost domains)
 * 3. Runtime window.__RUNTIME_CONFIG__.VITE_API_URL injection (hosting platforms)
 * 4. Explicit VITE_API_URL environment variable override (build-time / deployment container)
 */

export interface ApiResolutionContext {
  hostname?: string;
  runtimeUrl?: unknown;
  envUrl?: unknown;
  isBrowser?: boolean;
}

export interface UrlValidationResult {
  isValid: boolean;
  cleanUrl?: string;
  rejectionReason?: string;
}

/**
 * Determines whether a hostname corresponds to a local development machine.
 */
export function isLocalHost(hostname: string): boolean {
  if (!hostname) return false;
  const clean = hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');
  if (
    clean === 'localhost' ||
    clean.endsWith('.localhost') ||
    clean === '127.0.0.1' ||
    clean === '0.0.0.0' ||
    clean === '::1' ||
    clean === '::' ||
    clean === '0:0:0:0:0:0:0:1' ||
    clean === '0:0:0:0:0:0:0:0' ||
    clean.endsWith('.local')
  ) {
    return true;
  }
  // IPv4 127.0.0.0/8 loopback CIDR block
  if (/^127(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/.test(clean)) {
    return true;
  }
  return false;
}

/**
 * Determines whether a parsed hostname is a loopback address.
 */
export function isLoopbackHost(hostname: string): boolean {
  if (!hostname) return false;
  const clean = hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');
  if (
    clean === 'localhost' ||
    clean.endsWith('.localhost') ||
    clean === '127.0.0.1' ||
    clean === '0.0.0.0' ||
    clean === '::1' ||
    clean === '::' ||
    clean === '0:0:0:0:0:0:0:1' ||
    clean === '0:0:0:0:0:0:0:0'
  ) {
    return true;
  }
  // IPv4 127.0.0.0/8 loopback range
  if (/^127(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/.test(clean)) {
    return true;
  }
  return false;
}

/**
 * Determines whether a remote hostname represents a testing/staging deployment.
 */
export function isTestingEnvironment(hostname: string): boolean {
  if (!hostname) return false;
  const clean = hostname.trim().toLowerCase();
  return (
    clean.includes('yptest') ||
    clean.includes('staging') ||
    clean.startsWith('test.') ||
    clean.includes('.test.')
  );
}

/**
 * Validates an override URL against current environment constraints.
 * Enforces URL parsing rather than naive substring matching.
 */
export function validateApiUrlOverride(url: unknown, isRemote: boolean): UrlValidationResult {
  if (url === undefined || url === null || typeof url !== 'string') {
    return { isValid: false, rejectionReason: 'not a string' };
  }
  const trimmed = url.trim();
  if (trimmed === '') {
    return { isValid: false, rejectionReason: 'empty string' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, rejectionReason: 'malformed URL' };
  }

  // Scheme must strictly be http: or https:
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, rejectionReason: 'unsupported scheme' };
  }

  const overrideHost = parsed.hostname;

  // On remote hosts, reject any loopback override
  if (isRemote && isLoopbackHost(overrideHost)) {
    return { isValid: false, rejectionReason: 'loopback address on remote host' };
  }

  // On remote hosts, reject insecure HTTP protocol
  if (isRemote && parsed.protocol === 'http:') {
    return { isValid: false, rejectionReason: 'insecure HTTP protocol on remote host' };
  }

  // Return clean URL stripped of trailing slashes
  const normalized = trimmed.replace(/\/+$/, '');
  return { isValid: true, cleanUrl: normalized };
}

/**
 * Pure resolution logic parameterized for deterministic testing and runtime usage.
 */
export function resolvePlatformApiBaseUrl(context: ApiResolutionContext = {}): string {
  const isBrowser = context.isBrowser ?? (typeof window !== 'undefined' && Boolean(window.location));
  const hostname = context.hostname ?? (isBrowser ? window.location.hostname : '');
  const localHost = isLocalHost(hostname);
  const isRemote = isBrowser && !localHost;

  // 1. Runtime window config injection (e.g. from container or hosting platform)
  if (context.runtimeUrl !== undefined && context.runtimeUrl !== null && context.runtimeUrl !== '') {
    const res = validateApiUrlOverride(context.runtimeUrl, isRemote);
    if (res.isValid && res.cleanUrl) {
      return res.cleanUrl;
    }
    console.warn(`[apiConfig] Discarding invalid runtime API URL override (reason: ${res.rejectionReason})`);
  }

  // 2. Explicit environment variable override
  if (context.envUrl !== undefined && context.envUrl !== null && context.envUrl !== '') {
    const res = validateApiUrlOverride(context.envUrl, isRemote);
    if (res.isValid && res.cleanUrl) {
      return res.cleanUrl;
    }
    console.warn(`[apiConfig] Discarding invalid env API URL override (reason: ${res.rejectionReason})`);
  }

  // 3. Dynamic browser hostname resolution
  if (isBrowser) {
    if (localHost) {
      return 'http://localhost:8000';
    }

    if (isTestingEnvironment(hostname)) {
      return 'https://yptest.yuvaparipalan.com';
    }

    // Default production gateway
    return 'https://api.yuvaparipalan.com';
  }

  // Default fallback for SSR / non-browser execution
  return 'https://api.yuvaparipalan.com';
}

/**
 * Resolves the authoritative Platform API base URL for the current execution context.
 */
export function getPlatformApiBaseUrl(): string {
  const isBrowser = typeof window !== 'undefined' && Boolean(window.location);
  const hostname = isBrowser ? window.location.hostname : '';
  const runtimeUrl = isBrowser ? (window as any).__RUNTIME_CONFIG__?.VITE_API_URL : undefined;
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_API_URL : undefined;

  return resolvePlatformApiBaseUrl({
    hostname,
    runtimeUrl,
    envUrl,
    isBrowser,
  });
}

export const API_BASE_URL = getPlatformApiBaseUrl();
