import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isLocalHost,
  isLoopbackHost,
  isTestingEnvironment,
  validateApiUrlOverride,
  resolvePlatformApiBaseUrl,
} from '../src/config/apiConfig.ts';

describe('API URL Resolution & Hardened Validation Suite', () => {

  describe('isLocalHost Detection', () => {
    it('identifies standard local development hostnames', () => {
      assert.strictEqual(isLocalHost('localhost'), true);
      assert.strictEqual(isLocalHost('127.0.0.1'), true);
      assert.strictEqual(isLocalHost('0.0.0.0'), true);
      assert.strictEqual(isLocalHost('my-laptop.local'), true);
      assert.strictEqual(isLocalHost('sub.localhost'), true);
    });

    it('identifies IPv4 127.0.0.0/8 loopback variants', () => {
      assert.strictEqual(isLocalHost('127.0.0.2'), true);
      assert.strictEqual(isLocalHost('127.255.0.1'), true);
      assert.strictEqual(isLocalHost('127.1.2.3'), true);
    });

    it('identifies IPv6 loopback representations', () => {
      assert.strictEqual(isLocalHost('::1'), true);
      assert.strictEqual(isLocalHost('[::1]'), true);
      assert.strictEqual(isLocalHost('0:0:0:0:0:0:0:1'), true);
      assert.strictEqual(isLocalHost('[0:0:0:0:0:0:0:1]'), true);
      assert.strictEqual(isLocalHost('::'), true);
      assert.strictEqual(isLocalHost('[::]'), true);
    });

    it('rejects remote production and staging hostnames', () => {
      assert.strictEqual(isLocalHost('yuvaparipalan.org'), false);
      assert.strictEqual(isLocalHost('foundation.yuvaparipalan.org'), false);
      assert.strictEqual(isLocalHost('api.yuvaparipalan.com'), false);
      assert.strictEqual(isLocalHost('yptest.yuvaparipalan.com'), false);
      assert.strictEqual(isLocalHost('foundation-app.vercel.app'), false);
      assert.strictEqual(isLocalHost('render.com'), false);
    });

    it('does not falsely classify domains containing "localhost" as substring', () => {
      assert.strictEqual(isLocalHost('notlocalhost.com'), false);
      assert.strictEqual(isLocalHost('localhost.company.org'), false);
      assert.strictEqual(isLocalHost('mylocalhost.org'), false);
    });
  });

  describe('isLoopbackHost Detection', () => {
    it('identifies all standard loopback host strings and IPs', () => {
      assert.strictEqual(isLoopbackHost('localhost'), true);
      assert.strictEqual(isLoopbackHost('127.0.0.1'), true);
      assert.strictEqual(isLoopbackHost('127.0.0.2'), true);
      assert.strictEqual(isLoopbackHost('127.100.0.1'), true);
      assert.strictEqual(isLoopbackHost('0.0.0.0'), true);
      assert.strictEqual(isLoopbackHost('::1'), true);
      assert.strictEqual(isLoopbackHost('[::1]'), true);
      assert.strictEqual(isLoopbackHost('0:0:0:0:0:0:0:1'), true);
      assert.strictEqual(isLoopbackHost('[0:0:0:0:0:0:0:1]'), true);
      assert.strictEqual(isLoopbackHost('app.localhost'), true);
    });

    it('returns false for public and legitimate external hostnames', () => {
      assert.strictEqual(isLoopbackHost('api.yuvaparipalan.com'), false);
      assert.strictEqual(isLoopbackHost('yptest.yuvaparipalan.com'), false);
      assert.strictEqual(isLoopbackHost('notlocalhost.com'), false);
      assert.strictEqual(isLoopbackHost('example.com'), false);
    });
  });

  describe('isTestingEnvironment Detection', () => {
    it('detects testing and staging domains accurately', () => {
      assert.strictEqual(isTestingEnvironment('yptest.yuvaparipalan.com'), true);
      assert.strictEqual(isTestingEnvironment('staging.yuvaparipalan.org'), true);
      assert.strictEqual(isTestingEnvironment('test.yuvaparipalan.org'), true);
      assert.strictEqual(isTestingEnvironment('foundation.test.yuvaparipalan.org'), true);
    });

    it('does not classify production or local hostnames as testing', () => {
      assert.strictEqual(isTestingEnvironment('yuvaparipalan.org'), false);
      assert.strictEqual(isTestingEnvironment('foundation.yuvaparipalan.org'), false);
      assert.strictEqual(isTestingEnvironment('localhost'), false);
      assert.strictEqual(isTestingEnvironment('foundation-app.vercel.app'), false);
    });
  });

  describe('validateApiUrlOverride', () => {
    it('rejects non-string and empty values', () => {
      assert.strictEqual(validateApiUrlOverride(undefined, false).isValid, false);
      assert.strictEqual(validateApiUrlOverride(null, false).isValid, false);
      assert.strictEqual(validateApiUrlOverride(12345, false).isValid, false);
      assert.strictEqual(validateApiUrlOverride('', false).isValid, false);
      assert.strictEqual(validateApiUrlOverride('   ', false).isValid, false);
    });

    it('rejects malformed URLs and unsupported schemes', () => {
      assert.strictEqual(validateApiUrlOverride('not-a-url', false).isValid, false);
      assert.strictEqual(validateApiUrlOverride('javascript:alert(1)', false).isValid, false);
      assert.strictEqual(validateApiUrlOverride('ftp://api.yuvaparipalan.com', false).isValid, false);
      assert.strictEqual(validateApiUrlOverride('file:///etc/passwd', false).isValid, false);
    });

    it('rejects loopback overrides when running on a remote host', () => {
      const loopbacks = [
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://127.0.0.2:8000',
        'http://127.255.0.1:8000',
        'http://0.0.0.0:8000',
        'http://[::1]:8000',
        'http://[0:0:0:0:0:0:0:1]:8000',
      ];
      for (const url of loopbacks) {
        const res = validateApiUrlOverride(url, true);
        assert.strictEqual(res.isValid, false, `Expected ${url} to be rejected on remote host`);
        assert.strictEqual(res.rejectionReason, 'loopback address on remote host');
      }
    });

    it('rejects insecure HTTP protocol when running on a remote host', () => {
      const res = validateApiUrlOverride('http://api.yuvaparipalan.com', true);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.rejectionReason, 'insecure HTTP protocol on remote host');
    });

    it('allows loopback overrides when running on a local development machine', () => {
      const res = validateApiUrlOverride('http://localhost:8000', false);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.cleanUrl, 'http://localhost:8000');
    });

    it('accepts legitimate domain containing "localhost" as substring on remote host', () => {
      const res = validateApiUrlOverride('https://notlocalhost.com/api', true);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.cleanUrl, 'https://notlocalhost.com/api');
    });

    it('normalizes clean URLs by stripping trailing slashes', () => {
      const res = validateApiUrlOverride('https://api.yuvaparipalan.com///', true);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.cleanUrl, 'https://api.yuvaparipalan.com');
    });
  });

  describe('resolvePlatformApiBaseUrl - Canonical Scenarios', () => {
    it('Scenario 1: Production hostname plus a localhost override -> selects production fallback', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'yuvaparipalan.org',
        envUrl: 'http://localhost:8000',
        isBrowser: true,
      });
      assert.strictEqual(result, 'https://api.yuvaparipalan.com');
    });

    it('Scenario 2: Production hostname plus a valid production API override -> selects override', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'yuvaparipalan.org',
        envUrl: 'https://custom-api.yuvaparipalan.com',
        isBrowser: true,
      });
      assert.strictEqual(result, 'https://custom-api.yuvaparipalan.com');
    });

    it('Scenario 3: Testing hostname plus a localhost override -> selects testing fallback', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'yptest.yuvaparipalan.com',
        envUrl: 'http://localhost:8000',
        isBrowser: true,
      });
      assert.strictEqual(result, 'https://yptest.yuvaparipalan.com');
    });

    it('Scenario 4: Testing hostname plus a valid testing API override -> selects override', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'yptest.yuvaparipalan.com',
        envUrl: 'https://staging-gateway.yuvaparipalan.com',
        isBrowser: true,
      });
      assert.strictEqual(result, 'https://staging-gateway.yuvaparipalan.com');
    });

    it('Scenario 5: Local development hostname and its permitted local API -> selects local API', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'localhost',
        envUrl: 'http://localhost:8000',
        isBrowser: true,
      });
      assert.strictEqual(result, 'http://localhost:8000');
    });

    it('Scenario 5b: Local development hostname without override -> falls back to local API', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'localhost',
        isBrowser: true,
      });
      assert.strictEqual(result, 'http://localhost:8000');
    });

    it('Scenario 6: IPv4 and IPv6 loopback variants on remote host -> selects environment fallback', () => {
      const loopbacks = [
        'http://127.0.0.1:8000',
        'http://127.0.0.2:8000',
        'http://127.255.0.1:8000',
        'http://0.0.0.0:8000',
        'http://[::1]:8000',
        'http://[0:0:0:0:0:0:0:1]:8000',
      ];
      for (const lb of loopbacks) {
        const prodResult = resolvePlatformApiBaseUrl({
          hostname: 'yuvaparipalan.org',
          envUrl: lb,
          isBrowser: true,
        });
        assert.strictEqual(prodResult, 'https://api.yuvaparipalan.com', `Failed for ${lb} on prod`);

        const testResult = resolvePlatformApiBaseUrl({
          hostname: 'staging.yuvaparipalan.org',
          envUrl: lb,
          isBrowser: true,
        });
        assert.strictEqual(testResult, 'https://yptest.yuvaparipalan.com', `Failed for ${lb} on test`);
      }
    });

    it('Scenario 7: Malformed URLs and unsupported schemes -> selects environment fallback', () => {
      const malformed = [
        'not a valid url',
        'ftp://api.yuvaparipalan.com',
        'javascript:alert(1)',
        'file:///etc/hosts',
      ];
      for (const bad of malformed) {
        const result = resolvePlatformApiBaseUrl({
          hostname: 'yuvaparipalan.org',
          envUrl: bad,
          isBrowser: true,
        });
        assert.strictEqual(result, 'https://api.yuvaparipalan.com');
      }
    });

    it('Scenario 8: Unexpected remote hostnames -> defaults safely to production API', () => {
      const unexpected = [
        'unknown-preview-deployment.vercel.app',
        'custom-domain.org',
        'foundation-preview.render.com',
      ];
      for (const host of unexpected) {
        const result = resolvePlatformApiBaseUrl({
          hostname: host,
          isBrowser: true,
        });
        assert.strictEqual(result, 'https://api.yuvaparipalan.com');
      }
    });

    it('Scenario 9: Precedence - runtime window config takes precedence over build-time env', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'yuvaparipalan.org',
        runtimeUrl: 'https://runtime-api.yuvaparipalan.com',
        envUrl: 'https://buildtime-api.yuvaparipalan.com',
        isBrowser: true,
      });
      assert.strictEqual(result, 'https://runtime-api.yuvaparipalan.com');
    });

    it('Scenario 10: Precedence - invalid runtime config falls back to valid envUrl', () => {
      const result = resolvePlatformApiBaseUrl({
        hostname: 'yuvaparipalan.org',
        runtimeUrl: 'http://localhost:8000', // Invalid on remote host
        envUrl: 'https://buildtime-api.yuvaparipalan.com',
        isBrowser: true,
      });
      assert.strictEqual(result, 'https://buildtime-api.yuvaparipalan.com');
    });

    it('Scenario 11: Non-browser / SSR execution fallback', () => {
      const result = resolvePlatformApiBaseUrl({
        isBrowser: false,
      });
      assert.strictEqual(result, 'https://api.yuvaparipalan.com');
    });
  });
});
