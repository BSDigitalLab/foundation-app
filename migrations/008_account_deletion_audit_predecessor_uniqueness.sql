-- Migration: 008_account_deletion_audit_predecessor_uniqueness.sql
-- Directive: YPF-ACCOUNT-DELETION-MODEL-B-REM-003
-- Defect: DEV-002 (Concurrent audit-chain forks and missing predecessor uniqueness enforcement)
-- Target Database: yp_platform_testing_db (project plbdefqydtqohjgauwqp)
--
-- Objective:
-- Enforces that for any account deletion request, each predecessor hash (prev_log_hash_sha256)
-- can appear at most once in identity.account_deletion_audit_logs.
-- This mathematically eliminates competing concurrent successors from creating forks on the same predecessor.

BEGIN;

-- 1. Validation Pre-Check: Confirm zero duplicate predecessor pairs exist before constraint creation
DO $$
DECLARE
    dup_count INTEGER;
BEGIN
    SELECT count(*) INTO dup_count
    FROM (
        SELECT request_id, prev_log_hash_sha256
        FROM identity.account_deletion_audit_logs
        GROUP BY request_id, prev_log_hash_sha256
        HAVING count(*) > 1
    ) sub;

    IF dup_count > 0 THEN
        RAISE EXCEPTION 'MIGRATION_PRECHECK_FAILED: Cannot add uniqueness constraint. Found % duplicate predecessor pairs in identity.account_deletion_audit_logs.', dup_count;
    END IF;
END $$;

-- 2. Add Unique Constraint on (request_id, prev_log_hash_sha256)
ALTER TABLE identity.account_deletion_audit_logs
ADD CONSTRAINT uq_account_deletion_audit_prev_hash
UNIQUE (request_id, prev_log_hash_sha256);

-- 3. Validation Post-Check: Verify constraint is active
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'identity'
          AND table_name = 'account_deletion_audit_logs'
          AND constraint_name = 'uq_account_deletion_audit_prev_hash'
    ) THEN
        RAISE EXCEPTION 'MIGRATION_POSTCHECK_FAILED: Constraint uq_account_deletion_audit_prev_hash was not created.';
    END IF;
END $$;

COMMIT;
