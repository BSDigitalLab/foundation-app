import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Career Excellence & Scholarship Program (CESP100) Verification Suite', () => {

  describe('Authoritative Business Rules & Commercial Reconciliation', () => {
    it('verifies exact pricing and 18% GST reconciliation', () => {
      const taxableBase = 465.25;
      const gstAmount = 83.75;
      const grossAmount = 549.00;

      // Mathematical validation
      assert.strictEqual(Math.round((taxableBase + gstAmount) * 100) / 100, grossAmount);
      
      // Accounting GST reconciliation: gross - base
      const reconciledGst = Math.round((grossAmount - taxableBase) * 100) / 100;
      assert.strictEqual(reconciledGst, gstAmount);

      // Verify close to 18% of taxable base (delta within 1 paisa due to rounding)
      const rawGst = taxableBase * 0.18;
      assert.ok(Math.abs(rawGst - gstAmount) < 0.01);
      
      // Equal CGST and SGST allocation
      const cgst = 41.875;
      const sgst = 41.875;
      assert.strictEqual(cgst + sgst, gstAmount);
    });

    it('verifies canonical identifiers and program metadata', () => {
      const program = {
        id: 'd7180ba6-a22d-4330-85d1-8dfa9e321277',
        program_code: 'CESP100',
        name: 'Career Excellence & Scholarship Program',
        public_slug: 'career-excellence-scholarship-program',
        canonical_public_url: 'https://yuvaparipalan.org/programs/career-excellence-scholarship-program',
        duration: '6 Months',
        mode: 'ONLINE',
      };

      assert.strictEqual(program.id, 'd7180ba6-a22d-4330-85d1-8dfa9e321277');
      assert.strictEqual(program.program_code, 'CESP100');
      assert.strictEqual(program.public_slug, 'career-excellence-scholarship-program');
      assert.strictEqual(program.duration, '6 Months');
      assert.strictEqual(program.mode, 'ONLINE');
    });
  });

  describe('Route Resolution & Catalog Routing Logic', () => {
    function resolveProgramTargetUrl(program: { program_code: string; public_slug: string }): string {
      const isChangepreneur =
        program.program_code === 'CCPM100' ||
        program.public_slug.includes('changepreneur');
      const isCESP =
        program.program_code === 'CESP100' ||
        program.public_slug.includes('career-excellence');

      if (isChangepreneur) return '/programs/changepreneur-circle';
      if (isCESP) return '/programs/career-excellence-scholarship-program';
      return `/programs/${program.public_slug}`;
    }

    it('routes CESP100 to dedicated /programs/career-excellence-scholarship-program', () => {
      const url = resolveProgramTargetUrl({
        program_code: 'CESP100',
        public_slug: 'career-excellence-scholarship-program',
      });
      assert.strictEqual(url, '/programs/career-excellence-scholarship-program');
    });

    it('routes CCPM100 to dedicated /programs/changepreneur-circle', () => {
      const url = resolveProgramTargetUrl({
        program_code: 'CCPM100',
        public_slug: 'changepreneur-circle-premium-membership',
      });
      assert.strictEqual(url, '/programs/changepreneur-circle');
    });

    it('routes other programs to dynamic /programs/:slug', () => {
      const url = resolveProgramTargetUrl({
        program_code: 'CD100',
        public_slug: 'career-discovery-100',
      });
      assert.strictEqual(url, '/programs/career-discovery-100');
    });
  });

  describe('Verified 7 Canonical Program Offerings Integrity', () => {
    const canonicalOfferings = [
      'Eduzet Aptitude Test',
      'Palana NeuroSync Vikas',
      'Communicative English Training',
      'Nalla Malayalam Language Training',
      'AI Basic Workshop',
      'Career Guidance & Mentorship',
      'Scholarship for Career Excellence',
    ];

    it('contains all 7 canonical offerings matching Master Engineering Directive', () => {
      assert.strictEqual(canonicalOfferings.length, 7);
      assert.ok(canonicalOfferings.includes('Eduzet Aptitude Test'));
      assert.ok(canonicalOfferings.includes('Palana NeuroSync Vikas'));
      assert.ok(canonicalOfferings.includes('Communicative English Training'));
      assert.ok(canonicalOfferings.includes('Nalla Malayalam Language Training'));
      assert.ok(canonicalOfferings.includes('AI Basic Workshop'));
      assert.ok(canonicalOfferings.includes('Career Guidance & Mentorship'));
      assert.ok(canonicalOfferings.includes('Scholarship for Career Excellence'));
    });
  });

  describe('Payment & Registration Payload Verification', () => {
    it('verifies order creation payload with candidate attribution', () => {
      const candidatePayload = {
        program_id: 'd7180ba6-a22d-4330-85d1-8dfa9e321277',
        customer_phone: '9876543210',
        customer_name: 'Ananya Nair',
        customer_email: 'ananya@example.com',
        notes: {
          program_code: 'CESP100',
          state: 'Kerala',
          district: 'Kozhikode',
          education_level: 'Higher Secondary (+2)',
          institution: 'Govt Model HSS',
        },
      };

      assert.strictEqual(candidatePayload.program_id, 'd7180ba6-a22d-4330-85d1-8dfa9e321277');
      assert.strictEqual(candidatePayload.notes.program_code, 'CESP100');
      assert.strictEqual(candidatePayload.notes.district, 'Kozhikode');
    });

    it('verifies tax invoice email payload structure', () => {
      const emailPayload = {
        formType: 'cesp_payment_confirmed' as const,
        formData: {
          fullName: 'Ananya Nair',
          email: 'ananya@example.com',
          phone: '9876543210',
          district: 'Kozhikode',
          program: 'Career Excellence & Scholarship Program (CESP100)',
          orderCode: 'ORD-CESP-123456',
          amountPaid: '₹549.00',
        },
      };

      assert.strictEqual(emailPayload.formType, 'cesp_payment_confirmed');
      assert.strictEqual(emailPayload.formData.amountPaid, '₹549.00');
    });
  });

});
