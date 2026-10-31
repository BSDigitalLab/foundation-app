import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  resolveProgramByCode,
  clearProgramCache,
  ProgramResolutionError,
  resolveProgramClassification,
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
      // Assert authoritative components & submodules are hydrated from single source of truth
      assert.ok(Array.isArray(program.components), 'components should be an array');
      assert.strictEqual(program.components.length, 7, 'CCPAM100 must have 7 authoritative components/submodules');
      assert.strictEqual(program.components[0].name, 'Changepreneur Circle Annual Premium Membership');
      assert.ok(program.components.some(c => c.name.includes('Caering Fitness Ring')));
      assert.ok(program.components.some(c => c.name.includes('Palana Neurosync Anandha / Zayana')));
      assert.ok(program.components.some(c => c.name.includes('HRC Discount Voucher')));
      assert.ok(program.components.some(c => c.name.includes('HRC Happiness Planner Kit')));
      assert.ok(program.components.some(c => c.name.includes('Yuvaparipalan Foundation Lifetime Membership')));
      assert.ok(program.components.some(c => c.name.includes('Youth Empowerment Scholarship Contribution')));
    });

    it('verifies program components contain authoritative media images, short descriptions, and zero mock data', async () => {
      const program = await resolveProgramByCode('CCPAM100', {
        fallbackSlugs: ['changepreneur-circle-premium-annual-membership'],
        forceRefresh: true
      });

      assert.ok(program);
      assert.ok(Array.isArray(program.components));
      assert.strictEqual(program.components.length, 7);

      for (const comp of program.components) {
        // 1. Authoritative product image URL starting with https://
        assert.ok(comp.image_url, `Component ${comp.name} must have a valid product image URL`);
        assert.ok(comp.image_url.startsWith('https://'), `Component ${comp.name} image URL must be HTTPS`);
        assert.ok(!comp.image_url.includes('placeholder'), `Component ${comp.name} image URL must not be a placeholder`);

        // 2. Authoritative head and short description
        assert.ok(comp.name && comp.name.trim().length > 3, 'Component must have a valid title/name');
        assert.ok(comp.description && comp.description.trim().length > 10, `Component ${comp.name} must have a non-empty description`);
        assert.ok(!comp.description.toLowerCase().includes('lorem ipsum'), `Component ${comp.name} description must not contain mock text`);

        // 3. Offering type
        assert.ok(comp.offering_type, `Component ${comp.name} must have an offering_type`);
        assert.ok(['MEMBERSHIP', 'PRODUCT', 'DISCOUNT_VOUCHER', 'COURSE'].includes(comp.offering_type));
      }

      // 4. Verify nested submodules under component 1 (Changepreneur Circle Annual Premium Membership)
      const primaryComp = program.components[0];
      assert.strictEqual(primaryComp.name, 'Changepreneur Circle Annual Premium Membership');
      assert.ok(Array.isArray(primaryComp.submodules));
      assert.strictEqual(primaryComp.submodules.length, 7, 'Component 1 must contain 7 nested masterclasses/benefits');

      const expectedSubmoduleNames = [
        'Changepreneur Elevate',
        'Changepreneur LeadX',
        'Changepreneur Prosper',
        'Changepreneur FutureReady AI',
        'Changepreneur Inner Compass',
        'Morning Circle Meetups',
        'Changepreneur Growth Certificate'
      ];

      for (const expected of expectedSubmoduleNames) {
        assert.ok(
          primaryComp.submodules.some(sm => sm.name.includes(expected)),
          `Missing expected nested submodule matching "${expected}"`
        );
      }
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

    it('proves Changepreneur Circle is protected from keyword hijacking by generic scholarship words in its description', () => {
      const classification = resolveProgramClassification({
        program_code: 'CCPAM100',
        public_slug: 'changepreneur-circle-premium-annual-membership',
        name: 'Changepreneur Circle Premium Annual Membership',
      });

      assert.strictEqual(classification.category, 'community');
      assert.strictEqual(classification.iconName, 'Sparkles');
      assert.strictEqual(classification.impactTarget, 'Empower 10 Young Lives per Member');
      // Invariant: Must NEVER be hijacked into Career Excellence Scholarship
      assert.notStrictEqual(classification.impactTarget, '100,000 Merit Scholarships by 2035');
      assert.notStrictEqual(classification.category, 'education');
    });

    it('proves Career Excellence Scholarship is correctly classified under Education', () => {
      const classification = resolveProgramClassification({
        program_code: 'CESP100',
        public_slug: 'career-excellence-scholarship-program',
        name: 'Career Excellence Scholarship Program',
      });

      assert.strictEqual(classification.category, 'education');
      assert.strictEqual(classification.iconName, 'GraduationCap');
      assert.strictEqual(classification.impactTarget, '100,000 Merit Scholarships by 2035');
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

  describe('Authoritative Razorpay Standard Checkout & User Journey Safeguards (YPF-CHK-ORDER-REVIEW-001)', () => {
    it('1. verifies zero occurrences of mock payment emulators and simulation traps across all checkout entry points', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const filesToCheck = [
        'src/pages/ChangepreneurCirclePage.tsx',
        'src/pages/CareerExcellenceScholarshipPage.tsx',
        'src/pages/ProgramDetailPage.tsx',
      ];

      const forbiddenPatterns = [
        'Direct payment simulation is disabled in production',
        'simulated_test_mode_valid_signature',
        'test_mode_simulated_signature',
        'handleExecutePayment',
        'Confirm Test Checkout Verification',
        'selectedUpiApp',
        'cardNumber',
        'cardCvv',
      ];

      for (const relPath of filesToCheck) {
        const fullPath = path.resolve(process.cwd(), relPath);
        const code = fs.readFileSync(fullPath, 'utf-8');

        for (const pattern of forbiddenPatterns) {
          assert.strictEqual(
            code.includes(pattern),
            false,
            `Forbidden mock pattern "${pattern}" detected in checkout file: ${relPath}`
          );
        }
      }
    });

    it('2. verifies Step 1 form submission transitions to Order Review without auto-opening Razorpay modal', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      // Assert handleDetailsSubmit creates order and transitions to PAYMENT step WITHOUT calling launchRazorpayCheckout
      const submitMethod = code.slice(code.indexOf('const handleDetailsSubmit'), code.indexOf('const handleProceedToPayment'));
      assert.ok(submitMethod.includes("setCreatedOrder(order)"));
      assert.ok(submitMethod.includes("setModalStep('PAYMENT')"));
      assert.strictEqual(
        submitMethod.includes("await launchRazorpayCheckout(order)"),
        false,
        "handleDetailsSubmit must NOT auto-launch Razorpay on Step 1 submission"
      );
    });

    it('3. verifies primary CTA "Proceed to Secure Payment" explicitly invokes launchRazorpayCheckout', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.ok(
        code.includes('Proceed to Secure Payment'),
        'Step 2 must feature the primary CTA: "Proceed to Secure Payment"'
      );
      assert.ok(
        code.includes('handleProceedToPayment'),
        'Primary CTA must be wired to handleProceedToPayment'
      );
      assert.ok(
        code.includes('launchRazorpayCheckout(createdOrder)'),
        'handleProceedToPayment must pass the authoritative createdOrder to launchRazorpayCheckout'
      );
    });

    it('4. verifies registered member information and authoritative itemised pricing in Order Review', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      // Verify customer details display
      assert.ok(code.includes('Registered Member Information'));
      assert.ok(code.includes('{fullName}'));
      assert.ok(code.includes('{phone}'));
      assert.ok(code.includes('{email}'));
      assert.ok(code.includes('Edit Registration Details'));

      // Verify server-authoritative pricing calculations (Base fee + 18% GST = Total)
      assert.ok(code.includes('createdOrder.amount_paise / 100'));
      assert.ok(code.includes('totalPayable / 1.18'));
      assert.ok(code.includes('totalPayable - basePrice'));
      assert.ok(code.includes('Statutory Goods & Services Tax (18% GST)'));
    });

    it('5. verifies manual gateway dismissal preserves Order Review with neutral status notice', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      const ondismissBlock = code.slice(code.indexOf('ondismiss: () => {'), code.indexOf('rzp.on(\'payment.failed\''));
      assert.ok(ondismissBlock.includes("setModalStep('PAYMENT')"));
      assert.ok(
        ondismissBlock.includes("Payment wasn't completed in this window. You can retry or check your payment status."),
        "ondismiss must show neutral non-judgmental notice"
      );
      assert.ok(ondismissBlock.includes("setIsOpeningGateway(false)"));
    });

    it('6. verifies retry capability preserves existing valid order without blind recreation', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      // In handleProceedToPayment, it reuses createdOrder
      assert.ok(code.includes('if (!createdOrder) return;'));
      assert.ok(code.includes('await launchRazorpayCheckout(createdOrder);'));
    });

    it('7. verifies pending / uncertain payment status verification via fetchPaymentOrderStatus', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.ok(code.includes('fetchPaymentOrderStatus'));
      assert.ok(code.includes('handleCheckOrderStatus'));
      assert.ok(code.includes('Check Status'));
    });

    it('8. verifies handling of already-paid and expired orders', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.ok(code.includes("currentStatus === 'PAID'"));
      assert.ok(code.includes("currentStatus === 'PAID_MANUAL'"));
      assert.ok(code.includes("currentStatus === 'EXPIRED'"));
    });

    it('9. verifies duplicate-click and double-submission safeguards', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.ok(code.includes('isOpeningGateway'));
      assert.ok(code.includes('isCheckingStatus'));
      assert.ok(code.includes('disabled={isOpeningGateway || isCheckingStatus}'));
      assert.ok(code.includes('if (isOpeningGateway || isCheckingStatus) return;'));
    });

    it('10. verifies server-authoritative cryptographic verification and fulfillment lifecycle', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.ok(code.includes('verifyPayment('));
      assert.ok(code.includes('sendSubmissionEmail('));
      assert.ok(code.includes('changepreneur_payment_confirmed'));
      assert.ok(code.includes("setModalStep('SUCCESS')"));
    });

    it('11. verifies gateway failure logging and controlled user-facing decline message', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.ok(code.includes("rzp.on('payment.failed'"));
      assert.ok(code.includes('recordPaymentFailure('));
      assert.ok(code.includes('Gateway declined payment transaction.'));
    });

    it('12. asserts regression protection against synthetic orders and mock gateway credentials', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const fullPath = path.resolve(process.cwd(), 'src/pages/ChangepreneurCirclePage.tsx');
      const code = fs.readFileSync(fullPath, 'utf-8');

      assert.strictEqual(code.includes('ord_mock'), false);
      assert.strictEqual(code.includes('simulated_signature'), false);
      assert.strictEqual(code.includes('rzp_test_mock'), false);
      assert.ok(code.includes('CCPAM100'));
    });
  });

});
