/**
 * Dynamic Platform API Configuration
 * Single Source of Truth for API Gateway Resolution
 * 
 * Accurately determines the authoritative Platform API base URL based on:
 * 1. Explicit VITE_API_URL environment variable override (build-time / deployment container)
 * 2. Runtime window.__RUNTIME_CONFIG__.VITE_API_URL injection (hosting platforms)
 * 3. Dynamic browser origin detection (distinguishes localhost vs staging/testing vs production)
 */

export function getPlatformApiBaseUrl(): string {
  // 1. Explicit environment variable override
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // 2. Runtime injection via window.__RUNTIME_CONFIG__
  if (typeof window !== 'undefined') {
    const runtimeUrl = (window as any).__RUNTIME_CONFIG__?.VITE_API_URL;
    if (runtimeUrl && typeof runtimeUrl === 'string' && runtimeUrl.trim() !== '') {
      return runtimeUrl.trim().replace(/\/+$/, '');
    }
  }

  // 3. Dynamic browser hostname resolution
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname.toLowerCase();

    // Local development loopback
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local')
    ) {
      return 'http://localhost:8000';
    }

    // Testing / Sandbox environments
    if (
      hostname.includes('yptest') ||
      hostname.includes('staging') ||
      hostname.includes('test.')
    ) {
      return 'https://yptest.yuvaparipalan.com';
    }

    // Live Production deployment (e.g., yuvaparipalan.org, foundation.yuvaparipalan.org, vercel, etc.)
    return 'https://api.yuvaparipalan.com';
  }

  // Default fallback for SSR / non-browser execution
  return 'https://api.yuvaparipalan.com';
}

export const API_BASE_URL = getPlatformApiBaseUrl();
