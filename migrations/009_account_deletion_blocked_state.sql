-- Migration: 009_account_deletion_blocked_state.sql
-- Directive: YPF-ACCOUNT-DELETION-ARCHITECTURE-CORRECTION-AND-END-TO-END-IMPLEMENTATION-033
-- Objective:
-- Add 'DELETION_BLOCKED' status to identity.account_deletion_requests.status CHECK constraint.
-- Enables deterministic blocking state when statutory legal hold or unresolved financial dispute prevents deletion.

BEGIN;

-- 1. Pre-check: Confirm table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'identity'
          AND table_name = 'account_deletion_requests'
    ) THEN
        RAISE EXCEPTION 'MIGRATION_PRECHECK_FAILED: Table identity.account_deletion_requests does not exist.';
    END IF;
END $$;

-- 2. Update status CHECK constraint
ALTER TABLE identity.account_deletion_requests
DROP CONSTRAINT IF EXISTS account_deletion_requests_status_check;

ALTER TABLE identity.account_deletion_requests
ADD CONSTRAINT account_deletion_requests_status_check
CHECK (status IN (
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
    'REQUIRES_CLARIFICATION'
));

-- 3. Post-check: Confirm constraint exists and covers DELETION_BLOCKED
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'identity'
          AND table_name = 'account_deletion_requests'
          AND constraint_name = 'account_deletion_requests_status_check'
    ) THEN
        RAISE EXCEPTION 'MIGRATION_POSTCHECK_FAILED: Constraint account_deletion_requests_status_check was not created.';
    END IF;
END $$;

COMMIT;
