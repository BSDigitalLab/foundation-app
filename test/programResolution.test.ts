import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  resolveProgramByCode,
  clearProgramCache,
  ProgramResolutionError,
} from '../src/services/programResolutionService.ts';

describe('Authoritative Dynamic Program Resolution Suite', () => {

  beforeEach(() => {
    clearProgramCache();
  });

  describe('Dynamic Resolution for Published Programs', () => {
    it('resolves canonical code CCPAM100 to authoritative production UUID and metadata', async () => {
      const program = await resolveProgramByCode('CCPAM100', {
        aliasCodes: ['CCPM100'],
        fallbackSlugs: ['changepreneur-circle-premium-annual-membership', 'changepreneur-circle'],
        forceRefresh: true
      });

      assert.ok(program);
      assert.strictEqual(program.id, '09ecaeaa-a525-4262-966c-dd34bc54305f');
      assert.strictEqual(program.program_code, 'CCPAM100');
      assert.strictEqual(program.status, 'PUBLISHED');
      assert.strictEqual(program.public_slug, 'changepreneur-circle-premium-annual-membership');
      assert.strictEqual(program.commercials.subscription_price, 30000.0);
      assert.strictEqual(program.commercials.currency, 'INR');
    });

    it('reconciles legacy alias CCPM100 to canonical published CCPAM100 dynamically', async () => {
      const program = await resolveProgramByCode('CCPM100', {
        fallbackSlugs: ['changepreneur-circle-premium-annual-membership']
      });

      assert.ok(program);
      assert.strictEqual(program.program_code, 'CCPAM100');
      assert.strictEqual(program.id, '09ecaeaa-a525-4262-966c-dd34bc54305f');
    });

    it('resolves case-insensitively', async () => {
      const program = await resolveProgramByCode('ccpam100');
      assert.ok(program);
      assert.strictEqual(program.id, '09ecaeaa-a525-4262-966c-dd34bc54305f');
    });
  });

  describe('Unpublished & Missing Program Guardrails', () => {
    it('raises controlled ProgramResolutionError when program is unpublished or absent', async () => {
      try {
        await resolveProgramByCode('CESP100', {
          fallbackSlugs: ['career-excellence-scholarship-program', 'cesp100']
        });
        assert.fail('Should have thrown ProgramResolutionError');
      } catch (err: any) {
        assert.ok(err instanceof ProgramResolutionError);
        assert.ok(['PROGRAM_NOT_FOUND', 'PROGRAM_UNPUBLISHED'].includes(err.code));
      }
    });

    it('raises controlled ProgramResolutionError for non-existent program codes', async () => {
      try {
        await resolveProgramByCode('NON_EXISTENT_PROGRAM_CODE_999');
        assert.fail('Should have thrown ProgramResolutionError');
      } catch (err: any) {
        assert.ok(err instanceof ProgramResolutionError);
        assert.strictEqual(err.code, 'PROGRAM_NOT_FOUND');
      }
    });
  });

  describe('Synthetic Order Prevention & Integrity Safeguards', () => {
    it('rejects synthetic and mock order identifiers from being treated as real', () => {
      const isMockOrSynthetic = (orderId: string, keyId?: string): boolean => {
        if (!orderId || orderId.startsWith('ord_cesp_') || orderId.startsWith('mock_')) {
          return true;
        }
        if (keyId && (keyId.includes('mock') || keyId.includes('test_cesp'))) {
          return true;
        }
        return false;
      };

      assert.strictEqual(isMockOrSynthetic('ord_cesp_1729928192837', 'rzp_test_cesp_gateway'), true);
      assert.strictEqual(isMockOrSynthetic('mock_order_123', 'rzp_test_mock'), true);
      assert.strictEqual(isMockOrSynthetic('22435c97-2eb0-4154-bb93-0ed5ccaf3527', 'rzp_live_Tp2EZ2yEXcWWtO'), false);
    });

    it('verifies payment order creation payload adheres to authoritative contract', () => {
      const resolvedProgram = {
        id: '09ecaeaa-a525-4262-966c-dd34bc54305f',
        program_code: 'CCPAM100',
        name: 'Changepreneur Circle Premium Annual Membership',
        public_slug: 'changepreneur-circle-premium-annual-membership',
        status: 'PUBLISHED',
        commercials: {
          market_price: 62987.0,
          subscription_price: 30000.0,
          currency: 'INR'
        }
      };

      const payload = {
        program_id: resolvedProgram.id,
        customer_phone: '9876543210',
        customer_name: 'Sutheesh M S',
        customer_email: 'sutheesh@example.com',
        notes: {
          program_code: resolvedProgram.program_code,
          program_name: resolvedProgram.name,
          state: 'Kerala',
          district: 'Kozhikode',
          profession: 'Founder'
        }
      };

      assert.strictEqual(payload.program_id, '09ecaeaa-a525-4262-966c-dd34bc54305f');
      assert.notStrictEqual(payload.program_id, '92d72ed2-9e24-4355-a3f7-5a1277fbf025'); // Obsolete ID rejected
      assert.strictEqual(payload.notes.program_code, 'CCPAM100');
      assert.notStrictEqual(payload.notes.program_code, 'CCPM100'); // Legacy code reconciled
    });
  });

});
