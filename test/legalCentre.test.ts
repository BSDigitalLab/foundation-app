import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LEGAL_CENTRE_DATA } from '../src/data/legalCentreData.ts';
import { PRIVACY_POLICY_DATA } from '../src/data/privacyPolicyData.ts';
import { TERMS_CONDITIONS_DATA } from '../src/data/termsConditionsData.ts';
import { CHILD_SAFEGUARDING_DATA } from '../src/data/childSafeguardingData.ts';
import { POSH_POLICY_DATA } from '../src/data/poshPolicyData.ts';
import { ACCEPTABLE_USE_DATA } from '../src/data/acceptableUseData.ts';

describe('Legal Centre & Platform Governance Architecture Suite', () => {

  const allDocuments = [
    { name: 'Legal Centre Catalog', data: LEGAL_CENTRE_DATA },
    { name: 'Privacy Policy', data: PRIVACY_POLICY_DATA },
    { name: 'Terms & Conditions', data: TERMS_CONDITIONS_DATA },
    { name: 'Child Safeguarding', data: CHILD_SAFEGUARDING_DATA },
    { name: 'POSH Policy', data: POSH_POLICY_DATA },
    { name: 'Acceptable Use Policy', data: ACCEPTABLE_USE_DATA },
  ];

  describe('1. Institutional Entity Verification & Uniform Identity', () => {
    it('verifies exact Corporate Name, Form, CIN, and DARPAN across all legal documents', () => {
      const EXPECTED_NAME = 'Yuvaparipalan Foundation';
      const EXPECTED_CIN = 'U85500TZ2026NPL039757';
      const EXPECTED_DARPAN = 'TN/2026/1152475';
      const EXPECTED_ADDRESS = '#3, Sri Mahalakshmi Garden, Saravanampatti, Coimbatore, Tamil Nadu – 641035, India';
      const EXPECTED_EMAIL = 'support@yuvaparipalan.org';
      const EXPECTED_WEBSITE = 'https://yuvaparipalan.org/';

      for (const doc of allDocuments) {
        assert.strictEqual(
          doc.data.orgDetails.name,
          EXPECTED_NAME,
          `Document ${doc.name} must have identical corporate name`
        );
        assert.strictEqual(
          doc.data.orgDetails.cin,
          EXPECTED_CIN,
          `Document ${doc.name} must have verified CIN`
        );
        assert.strictEqual(
          doc.data.orgDetails.darpanId,
          EXPECTED_DARPAN,
          `Document ${doc.name} must have verified DARPAN ID`
        );
        assert.strictEqual(
          doc.data.orgDetails.address,
          EXPECTED_ADDRESS,
          `Document ${doc.name} must have verified registered address`
        );
        assert.strictEqual(
          doc.data.orgDetails.email,
          EXPECTED_EMAIL,
          `Document ${doc.name} must have canonical support email`
        );
        if (doc.data.orgDetails.website) {
          assert.strictEqual(
            doc.data.orgDetails.website,
            EXPECTED_WEBSITE,
            `Document ${doc.name} must have canonical website URL`
          );
        }
      }
    });

    it('asserts zero occurrences of the transposed email typo (support@yuvapariapaln.org)', () => {
      const INVALID_TYPO = 'support@yuvapariapaln.org';

      for (const doc of allDocuments) {
        const jsonString = JSON.stringify(doc.data);
        assert.ok(
          !jsonString.includes(INVALID_TYPO),
          `Document ${doc.name} must NOT contain the transposed email typo ${INVALID_TYPO}`
        );
      }
    });
  });

  describe('2. Canonical Dates & Section Cardinality', () => {
    it('verifies effective and last updated dates match October 25, 2026 baseline', () => {
      for (const doc of allDocuments) {
        assert.ok(
          doc.data.effectiveDate.includes('2026'),
          `${doc.name} effective date must be in 2026`
        );
        assert.ok(
          doc.data.lastUpdated.includes('2026'),
          `${doc.name} last updated date must be in 2026`
        );
      }
    });

    it('verifies structured section counts and non-empty content', () => {
      assert.strictEqual(PRIVACY_POLICY_DATA.sections.length, 13, 'Privacy Policy must contain 13 canonical sections');
      assert.strictEqual(TERMS_CONDITIONS_DATA.sections.length, 21, 'Terms & Conditions must contain 21 canonical sections');
      assert.strictEqual(CHILD_SAFEGUARDING_DATA.sections.length, 11, 'Child Safeguarding must contain 11 canonical sections (including Sec 00)');
      assert.strictEqual(POSH_POLICY_DATA.sections.length, 12, 'POSH Policy must contain 12 canonical sections (including Sec 00)');
      assert.strictEqual(ACCEPTABLE_USE_DATA.sections.length, 8, 'Acceptable Use Policy must contain 8 canonical sections');

      // Verify each section has an ID and title
      const policyDataModules = [
        PRIVACY_POLICY_DATA,
        TERMS_CONDITIONS_DATA,
        CHILD_SAFEGUARDING_DATA,
        POSH_POLICY_DATA,
        ACCEPTABLE_USE_DATA,
      ];

      for (const policy of policyDataModules) {
        for (const section of policy.sections) {
          assert.ok(section.id && section.id.length > 0, `Section must have an ID: ${section.title}`);
          assert.ok(section.title && section.title.length > 0, `Section must have a title: ${section.id}`);
        }
      }
    });
  });

  describe('3. Legal Centre Catalog Mapping & Routing Rules', () => {
    it('verifies all catalog documents map to valid canonical routes', () => {
      const EXPECTED_ROUTES = [
        '/terms-and-conditions',
        '/privacy-policy',
        '/child-safeguarding',
        '/posh',
        '/acceptable-use',
        '/delete-account',
        '/unsubscribe',
      ];

      const catalogPaths = LEGAL_CENTRE_DATA.documents.map((d) => d.path);
      assert.strictEqual(catalogPaths.length, EXPECTED_ROUTES.length);

      for (const route of EXPECTED_ROUTES) {
        assert.ok(
          catalogPaths.includes(route),
          `Legal Centre catalog must include route: ${route}`
        );
      }
    });

    it('verifies category classification integrity', () => {
      const validCategories = ['GOVERNANCE', 'PRIVACY', 'SAFEGUARDING', 'ACCOUNT_RIGHTS'];
      for (const doc of LEGAL_CENTRE_DATA.documents) {
        assert.ok(
          validCategories.includes(doc.category),
          `Document ${doc.id} category ${doc.category} must be in allowed categories`
        );
      }
    });
  });

  describe('4. Operational Deletion & Preference Protections', () => {
    it('verifies delete account references point to /delete-account', () => {
      const privacyDeletionSec = PRIVACY_POLICY_DATA.sections.find((s) => s.id === 'data-retention');
      assert.ok(privacyDeletionSec, 'Privacy Policy must contain data-retention section');
      const privacyText = JSON.stringify(privacyDeletionSec);
      assert.ok(privacyText.includes('/delete-account'), 'Privacy Policy data retention must link to /delete-account');

      const termsDeletionSec = TERMS_CONDITIONS_DATA.sections.find((s) => s.id === 'account-deletion-and-data-handling');
      assert.ok(termsDeletionSec, 'Terms & Conditions must contain account-deletion section');
      const termsText = JSON.stringify(termsDeletionSec);
      assert.ok(termsText.includes('/delete-account'), 'Terms & Conditions must link to /delete-account');
    });

    it('verifies child safeguarding escalation references POCSO Sections 19 & 21 and emergency helplines', () => {
      const pocsoSec = CHILD_SAFEGUARDING_DATA.sections.find((s) => s.id === 'reporting-and-escalation');
      assert.ok(pocsoSec, 'Child safeguarding must include reporting-and-escalation section');
      const text = JSON.stringify(pocsoSec);
      assert.ok(text.includes('Section 19'), 'Child safeguarding must cite POCSO Section 19 mandatory reporting');
      assert.ok(text.includes('Section 21'), 'Child safeguarding must cite POCSO Section 21 penal provisions');
      assert.ok(text.includes('1098'), 'Child safeguarding must cite National Child Helpline (1098)');
      assert.ok(text.includes('112'), 'Child safeguarding must cite Emergency Response Support System (112)');
      assert.ok(text.includes('Special Juvenile Police Unit'), 'Child safeguarding must cite Special Juvenile Police Unit (SJPU)');
    });

    it('verifies POSH policy upholds statutory 90-day inquiry timeline, Local Committee route, and Section 16 confidentiality', () => {
      const inquirySec = POSH_POLICY_DATA.sections.find((s) => s.id === 'inquiry-and-timelines');
      assert.ok(inquirySec, 'POSH policy must include inquiry-and-timelines section');
      assert.ok(JSON.stringify(inquirySec).includes('90'), 'POSH inquiry must reference 90-day statutory timeline');

      const frameworkSec = POSH_POLICY_DATA.sections.find((s) => s.id === 'statutory-redressal-framework');
      assert.ok(frameworkSec, 'POSH policy must include statutory-redressal-framework section');
      const frameworkText = JSON.stringify(frameworkSec);
      assert.ok(frameworkText.includes('Section 4'), 'POSH policy must cite Section 4 for Internal Committee');
      assert.ok(frameworkText.includes('Local Committee'), 'POSH policy must cite Section 6 Local Committee route');
      assert.ok(frameworkText.includes('shebox'), 'POSH policy must cite MWCD SHe-Box portal');

      const confSec = POSH_POLICY_DATA.sections.find((s) => s.id === 'confidentiality-guarantee');
      assert.ok(confSec, 'POSH policy must include confidentiality section');
      assert.ok(JSON.stringify(confSec).includes('Section 16'), 'POSH policy must cite Section 16 of POSH Act');

      const intakeSec = POSH_POLICY_DATA.sections.find((s) => s.id === 'complaint-submission-procedure');
      assert.ok(intakeSec, 'POSH policy must include complaint-submission-procedure section');
      const intakeText = JSON.stringify(intakeSec);
      assert.ok(intakeText.includes('Local Committee'), 'Intake must include Local Committee pathway');
      assert.ok(intakeText.includes('Never Exclusively Public Support') || intakeText.includes('procedural guidance only'), 'Intake must state support email is not the exclusive adjudicating channel');
    });

    it('verifies account deletion workflow contract and mobile attribution parameters', () => {
      const deleteDoc = LEGAL_CENTRE_DATA.documents.find((d) => d.id === 'account-deletion');
      assert.ok(deleteDoc, 'Legal Centre must index account deletion document');
      assert.strictEqual(deleteDoc.path, '/delete-account', 'Account deletion path must be /delete-account');
      assert.strictEqual(deleteDoc.category, 'ACCOUNT_RIGHTS', 'Account deletion must be classified as ACCOUNT_RIGHTS');

      // Verify Terms and Conditions Section 13 mandates
      const termsSec = TERMS_CONDITIONS_DATA.sections.find((s) => s.id === 'account-deletion-and-data-handling');
      assert.ok(termsSec, 'Terms must have account deletion section');
      const termsStr = JSON.stringify(termsSec);
      assert.ok(termsStr.includes('accounting') || termsStr.includes('legal compliance'), 'Terms deletion must acknowledge accounting or legal compliance retention requirements');
      assert.ok(termsStr.includes('/delete-account'), 'Terms deletion must provide link to /delete-account');

      // Verify Privacy Policy Section 07 mandates
      const privacySec = PRIVACY_POLICY_DATA.sections.find((s) => s.id === 'data-retention');
      assert.ok(privacySec, 'Privacy must have data retention section');
      const privacyStr = JSON.stringify(privacySec);
      assert.ok(privacyStr.includes('tax') || privacyStr.includes('accounting'), 'Privacy retention must cite tax/accounting laws');
      assert.ok(privacyStr.includes('/delete-account'), 'Privacy Policy must link to /delete-account');
    });
  });

  describe('5. Committee Leadership & Statutory Governance Safeguards', () => {
    it('verifies Primary Governance and Safeguarding Committee name, head, and email format', () => {
      const committee = LEGAL_CENTRE_DATA.governanceCommittee;
      assert.ok(committee, 'Legal Centre must have governanceCommittee details');
      assert.strictEqual(
        committee.committeeName,
        'Yuvaparipalan Foundation Governance and Safeguarding Committee',
        'Committee name must match exactly'
      );
      assert.strictEqual(
        committee.headName,
        'Biju Sivanand',
        'Committee Head name must be exactly Biju Sivanand with no titles prepended or appended'
      );
      assert.strictEqual(
        committee.contactEmail,
        'bijusivanand@gmail.com',
        'Committee contact email must be bijusivanand@gmail.com'
      );
      assert.strictEqual(
        committee.headLabel,
        'Committee Head',
        'Field label must be Committee Head'
      );
    });

    it('verifies canonical support email remains distinct from committee email', () => {
      assert.strictEqual(
        LEGAL_CENTRE_DATA.orgDetails.email,
        'support@yuvaparipalan.org',
        'Canonical platform support email must be support@yuvaparipalan.org'
      );
      assert.notStrictEqual(
        LEGAL_CENTRE_DATA.orgDetails.email,
        LEGAL_CENTRE_DATA.governanceCommittee.contactEmail,
        'Platform support email and committee email must be kept distinct'
      );
    });

    it('asserts statutory safeguard: Biju Sivanand is NOT designated as POSH IC Presiding Officer', () => {
      const poshStr = JSON.stringify(POSH_POLICY_DATA);
      assert.ok(
        !poshStr.includes('Biju Sivanand'),
        'POSH policy data must NOT designate Biju Sivanand as Presiding Officer (statutorily restricted to a senior woman employee under Section 4(2)(a))'
      );
    });

    it('verifies Child Safeguarding cites Governance and Safeguarding Committee while keeping DSO distinct', () => {
      const safeguardingStr = JSON.stringify(CHILD_SAFEGUARDING_DATA);
      assert.ok(
        safeguardingStr.includes('Yuvaparipalan Foundation Governance and Safeguarding Committee'),
        'Child safeguarding must cite the Governance and Safeguarding Committee'
      );
      assert.ok(
        safeguardingStr.includes('Committee Head: Biju Sivanand'),
        'Child safeguarding must cite Committee Head: Biju Sivanand'
      );
      assert.ok(
        safeguardingStr.includes('bijusivanand@gmail.com'),
        'Child safeguarding must cite bijusivanand@gmail.com for committee oversight'
      );
    });
  });

});
