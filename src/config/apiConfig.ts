/**
 * Dynamic Platform API Configuration
 * Single Source of Truth for API Gateway Resolution
 * 
 * Accurately determines the authoritative Platform API base URL based on:
 * 1. Dynamic browser origin detection (distinguishes localhost vs staging/testing vs production)
 * 2. Fail-safe localhost anti-leak guard (never allows localhost on non-localhost domains)
 * 3. Runtime window.__RUNTIME_CONFIG__.VITE_API_URL injection (hosting platforms)
 * 4. Explicit VITE_API_URL environment variable override (build-time / deployment container)
 */

export function getPlatformApiBaseUrl(): string {
  // Check if we are executing within a client browser environment
  const isBrowser = typeof window !== 'undefined' && Boolean(window.location);
  const hostname = isBrowser ? window.location.hostname.toLowerCase() : '';
  const isLocalHost = (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  );

  // Guard: Determine if an override URL is valid for the current environment.
  // CRITICAL: A URL pointing to localhost/127.0.0.1 on a live remote domain (e.g. yuvaparipalan.org,
  // vercel.app, render.com) is a catastrophic build-time environment leak and MUST BE REJECTED.
  const isValidOverride = (url: unknown): url is string => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    const clean = url.trim().toLowerCase();
    if (isBrowser && !isLocalHost && (clean.includes('localhost') || clean.includes('127.0.0.1') || clean.includes('0.0.0.0'))) {
      console.warn('[apiConfig] Discarding invalid local loopback API URL on remote host:', url);
      return false;
    }
    return true;
  };

  // 1. Runtime window config injection (e.g., from hosting platform or server template)
  if (isBrowser) {
    const runtimeUrl = (window as any).__RUNTIME_CONFIG__?.VITE_API_URL;
    if (isValidOverride(runtimeUrl)) {
      return runtimeUrl.trim().replace(/\/+$/, '');
    }
  }

  // 2. Explicit environment variable override (if not a localhost leak on remote domain)
  const envUrl = import.meta.env.VITE_API_URL;
  if (isValidOverride(envUrl)) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // 3. Dynamic browser hostname resolution
  if (isBrowser) {
    // Local developer machine
    if (isLocalHost) {
      return 'http://localhost:8000';
    }

    // Testing / Staging environments
    if (
      hostname.includes('yptest') ||
      hostname.includes('staging') ||
      hostname.includes('test.')
    ) {
      return 'https://yptest.yuvaparipalan.com';
    }

    // Production environment (yuvaparipalan.org, foundation.yuvaparipalan.org, vercel.app, render.com, etc.)
    return 'https://api.yuvaparipalan.com';
  }

  // Default fallback for SSR / non-browser execution
  return 'https://api.yuvaparipalan.com';
}

export const API_BASE_URL = getPlatformApiBaseUrl();
