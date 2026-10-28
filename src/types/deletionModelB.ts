/**
 * Model B: Admin-Reviewed Account Deletion Type Definitions
 * In accordance with Directive YPF-ACCOUNT-DELETION-ADMIN-REVIEW-006
 */

export type DeletionLifecycleState =
  | 'REQUEST_INITIATED'
  | 'IDENTITY_VERIFICATION_PENDING'
  | 'REQUEST_ACCEPTED'
  | 'ACCESS_SUSPENDED'
  | 'ADMIN_REVIEW_PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED_FOR_DELETION'
  | 'DELETION_PROCESSING'
  | 'DELETION_BLOCKED'
  | 'COMPLETED'
  | 'VERIFICATION_FAILED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'PROCESSING_FAILED'
  | 'REQUIRES_CLARIFICATION';

export type IdentityVerificationMode = 'AUTHENTICATED_SESSION' | 'OTP_CHALLENGE_EMAIL' | 'OTP_CHALLENGE_SMS';

export type SuspensionStatus = 'ACTIVE' | 'SUSPENDED' | 'RESTORED';

export type SubscriptionReviewStatus = 'NO_ACTIVE_SUBSCRIPTION' | 'ACTIVE_SUBSCRIPTION' | 'ACTION_REQUIRED' | 'ASSESSED';

export type EntitlementReviewStatus = 'NONE' | 'CESP100_SCHOLARSHIP' | 'CCPM100_CIRCLE' | 'ACTION_REQUIRED' | 'ASSESSED';

export type SecurityReviewStatus = 'CLEAN' | 'UNDER_INVESTIGATION' | 'SECURITY_HOLD' | 'ESCALATED';

export type StatutoryRetentionStatus = 'NOT_APPLICABLE' | '8_YR_BOOKS_PRESERVED' | 'TAX_VOUCHERS_RETAINED' | 'CONFIRMED';

export interface ReviewChecklist {
  identityVerification: 'verified' | 'failed' | 'pending';
  accessSuspension: 'confirmed' | 'failed' | 'pending';
  subscriptionReview: 'complete' | 'action_required' | 'not_applicable';
  entitlementReview: 'complete' | 'action_required' | 'not_applicable';
  financialRetention: 'assessed' | 'action_required' | 'not_applicable';
  securityReview: 'complete' | 'escalation_required' | 'not_applicable';
  legalRetentionHold: 'confirmed' | 'not_applicable';
  finalDecision: 'pending' | 'approved' | 'rejected';
}

export interface DeletionAuditEntry {
  id: string;
  requestId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  previousState: DeletionLifecycleState;
  newState: DeletionLifecycleState;
  reasonNotes?: string;
  payloadHashSha256?: string;
  prevLogHashSha256?: string;
  isImmutable: boolean;
  timestamp: string;
  ipAddress?: string;
}

export interface AdminDeletionRequest {
  id: string;
  referenceCode: string;
  userAccountId: string;
  displayName: string;
  identifier: string; // phone or email
  identifierType: 'PHONE' | 'EMAIL';
  organizationId: string;
  organizationName: string;
  sourceApp: string; // 'web' | 'channelpreneur' | 'yp_partner'
  accountCreatedAt: string;
  requestSubmittedAt: string;
  
  // Verification & Suspension
  identityVerificationMode: IdentityVerificationMode;
  identityVerified: boolean;
  suspensionStatus: SuspensionStatus;
  accessSuspendedAt: string | null;

  // Review states
  subscriptionStatus: SubscriptionReviewStatus;
  subscriptionDetails?: {
    activePlans: string[];
    lastBillingDate?: string;
    outstandingBalance: number;
    paymentDisputes: boolean;
  };

  entitlementStatus: EntitlementReviewStatus;
  entitlementDetails?: {
    enrolledPrograms: string[];
    academicCredits: boolean;
    activeCertificates: string[];
  };

  securityStatus: SecurityReviewStatus;
  securityDetails?: {
    sessionsRevoked: boolean;
    activeIncidents: number;
    failedAttempts24h: number;
  };

  statutoryRetention: StatutoryRetentionStatus;
  retentionDetails?: {
    corporateActPreserved: boolean; // Section 128(5) Companies Act 2013 (8 financial years)
    taxActPreserved: boolean; // Income-tax Act, 2025 Section 62 & Income-tax Rules, 2026 Rule 46
    dpdpaPurgeCompliant?: boolean; // DPDPA 2023 personal data minimization & irreversible purge
    statutoryHoldDurationYears: number; // 8 financial years for commercial books
    retentionBasisSummary?: string;
  };

  // Lifecycle
  status: DeletionLifecycleState;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  reviewerNotes?: string;
  rejectionReasonCode?: string;
  rejectionNotes?: string;
  
  checklist: ReviewChecklist;
  auditTrail: DeletionAuditEntry[];
}

export const DELETION_LIFECYCLE_STATES: DeletionLifecycleState[] = [
  'REQUEST_INITIATED',
  'IDENTITY_VERIFICATION_PENDING',
  'REQUEST_ACCEPTED',
  'ACCESS_SUSPENDED',
  'ADMIN_REVIEW_PENDING',
  'UNDER_REVIEW',
  'APPROVED_FOR_DELETION',
  'DELETION_PROCESSING',
  'DELETION_BLOCKED',
  'COMPLETED',
  'VERIFICATION_FAILED',
  'REJECTED',
  'CANCELLED',
  'PROCESSING_FAILED',
  'REQUIRES_CLARIFICATION',
];

export const MODEL_B_CORE_LIFECYCLE: DeletionLifecycleState[] = [
  'REQUEST_INITIATED',
  'IDENTITY_VERIFICATION_PENDING',
  'REQUEST_ACCEPTED',
  'ACCESS_SUSPENDED',
  'ADMIN_REVIEW_PENDING',
  'UNDER_REVIEW',
  'APPROVED_FOR_DELETION',
  'DELETION_PROCESSING',
  'COMPLETED',
];

export const MODEL_B_DIRECTIVE_METADATA = {
  directiveId: 'YPF-ACCOUNT-DELETION-ADMIN-REVIEW-006',
  workflow: 'Model B — Admin-Reviewed Account Deletion',
  adminNavigationPath: 'Identity & Access -> Access & Permissions -> Account Deletion Requests',
  canonicalUrl: 'https://yuvaparipalan.org/delete-account',
  statutoryRetentionYears: 8,
  statutoryActs: [
    'Section 128(5) of the Companies Act, 2013 (Books of Account & Relevant Vouchers — 8 Financial Years)',
    'Section 62 of the Income-tax Act, 2025 and Rule 46 of the Income-tax Rules, 2026 (Tax Assessment Records)',
    'Digital Personal Data Protection Act, 2023 (Personal Identifier Minimization & Immediate Purge)',
  ],
};

/**
 * Directive 012: External Write-Once-Read-Many (WORM) Audit Archive Record
 * Mandated for production to provide non-repudiation against privileged database administrators
 */
export interface WormAuditArchiveRecord {
  archiveBatchId: string;
  sourceRequestId: string;
  auditLogId: string;
  payloadHashSha256: string;
  prevLogHashSha256: string;
  exportedAt: string;
  destinationUri: string;
  retentionUntil: string;
  wormLockStatus: 'COMPLIANCE_LOCKED' | 'PENDING' | 'FAILED';
}

export interface WormExportVerificationResult {
  totalExported: number;
  totalVerified: number;
  unbrokenChaining: boolean;
  tamperDetected: boolean;
  wormLockVerified: boolean;
  status: 'PASS' | 'BLOCKED' | 'FAILED';
  blockerReason?: string;
}

/**
 * Directive 013: Calculates the exact statutory financial year retention deadline under 
 * Section 128(5) of the Companies Act, 2013 and Section 62 of the Income-tax Act, 2025.
 * 
 * Indian Financial Year runs from April 1 to March 31.
 * Section 128(5) mandates keeping books of account relating to not less than 8 financial years
 * immediately preceding the current financial year.
 * For a record created on date D in FY (April 1, Y to March 31, Y+1), statutory retention must
 * extend through the conclusion of FY(Y+8), i.e., March 31 of calendar year Y+9.
 * This duration varies between 8.0 and 9.0 calendar years (~2,922 to 3,287 days), and cannot
 * be simplified to a flat 2,922 days.
 */
export function calculateStatutoryRetentionDeadline(recordDateIso: string, fyDurationYears: number = 8): {
  financialYear: string;
  retentionExpiryDateIso: string;
  retentionDays: number;
} {
  const date = new Date(recordDateIso);
  const month = date.getUTCMonth(); // 0 = Jan, 2 = Mar, 3 = Apr, etc.
  const year = date.getUTCFullYear();

  // If month is Jan, Feb, Mar (0, 1, 2), current FY started on April 1 of (year - 1) and ends March 31 of year
  const currentFyStartYear = month >= 3 ? year : year - 1;
  const currentFyEndYear = currentFyStartYear + 1;
  const currentFy = `FY${currentFyStartYear}-${currentFyEndYear}`;

  // 8 financial years following current FY concludes on March 31 of (currentFyEndYear + fyDurationYears)
  const expiryYear = currentFyEndYear + fyDurationYears;
  const expiryDate = new Date(Date.UTC(expiryYear, 2, 31, 23, 59, 59, 999)); // March 31 23:59:59.999 UTC

  const diffMs = expiryDate.getTime() - date.getTime();
  const retentionDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    financialYear: currentFy,
    retentionExpiryDateIso: expiryDate.toISOString(),
    retentionDays,
  };
}



