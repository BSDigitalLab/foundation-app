-- Rollback: 008_rollback_account_deletion_audit_predecessor_uniqueness.sql
-- Directive: YPF-ACCOUNT-DELETION-MODEL-B-REM-003
-- Purpose: Safely drop uq_account_deletion_audit_prev_hash constraint if rollback is required.

BEGIN;

ALTER TABLE identity.account_deletion_audit_logs
DROP CONSTRAINT IF EXISTS uq_account_deletion_audit_prev_hash;

COMMIT;
