-- =====================================================================================
-- MIGRATION: 007_account_deletion_model_b_persistence.sql
-- DIRECTIVE: YPF-ACCOUNT-DELETION-ADMIN-REVIEW-006 / DIRECTIVE 007 / DIRECTIVE 008
-- REFERENCE: Model B Admin-Reviewed Account Deletion Persistence & Tamper-Evident Audit
-- STATUS: SUBMITTED FOR EXPLICIT DATABASE MIGRATION APPROVAL (DO NOT APPLY UNAPPROVED)
-- AUTHOR: Platform Security & Governance Architecture
-- =====================================================================================

BEGIN;

-- 1. Ensure dedicated identity schema exists
CREATE SCHEMA IF NOT EXISTS identity;

-- 2. Master Account Deletion Request Table
CREATE TABLE IF NOT EXISTS identity.account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) NOT NULL UNIQUE,
    user_account_id VARCHAR(64) NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    identifier_type VARCHAR(16) NOT NULL CHECK (identifier_type IN ('PHONE', 'EMAIL')),
    display_name VARCHAR(255),
    organization_id VARCHAR(64) DEFAULT 'org_yp_001',
    organization_name VARCHAR(255) DEFAULT 'Yuvaparipalan Foundation (HQ)',
    source_app VARCHAR(32) DEFAULT 'web',
    
    -- Verification & Suspension State
    identity_verified BOOLEAN NOT NULL DEFAULT false,
    identity_verification_mode VARCHAR(32) NOT NULL DEFAULT 'OTP_CHALLENGE_SMS' 
        CHECK (identity_verification_mode IN ('AUTHENTICATED_SESSION', 'OTP_CHALLENGE_EMAIL', 'OTP_CHALLENGE_SMS')),
    suspension_status VARCHAR(16) NOT NULL DEFAULT 'SUSPENDED'
        CHECK (suspension_status IN ('ACTIVE', 'SUSPENDED', 'RESTORED')),
    access_suspended_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    
    -- Subscriptions, Entitlements & Security Assessment
    subscription_status VARCHAR(32) NOT NULL DEFAULT 'NO_ACTIVE_SUBSCRIPTION'
        CHECK (subscription_status IN ('NO_ACTIVE_SUBSCRIPTION', 'ACTIVE_SUBSCRIPTION', 'ACTION_REQUIRED', 'ASSESSED')),
    subscription_details JSONB DEFAULT '{"activePlans": [], "outstandingBalance": 0, "paymentDisputes": false}'::jsonb,
    entitlement_status VARCHAR(32) NOT NULL DEFAULT 'NONE'
        CHECK (entitlement_status IN ('NONE', 'CESP100_SCHOLARSHIP', 'CCPM100_CIRCLE', 'ACTION_REQUIRED', 'ASSESSED')),
    security_status VARCHAR(32) NOT NULL DEFAULT 'CLEAN'
        CHECK (security_status IN ('CLEAN', 'UNDER_INVESTIGATION', 'SECURITY_HOLD', 'ESCALATED')),
    security_details JSONB DEFAULT '{"sessionsRevoked": true, "activeIncidents": 0, "failedAttempts24h": 0}'::jsonb,
    
    -- Statutory Books Retention (Companies Act 2013 Section 128(5) & Income-tax Act 2025 Section 62)
    statutory_retention VARCHAR(32) NOT NULL DEFAULT '8_YR_BOOKS_PRESERVED'
        CHECK (statutory_retention IN ('NOT_APPLICABLE', '8_YR_BOOKS_PRESERVED', 'TAX_VOUCHERS_RETAINED', 'CONFIRMED')),
    retention_details JSONB DEFAULT '{"corporateActPreserved": true, "taxActPreserved": true, "dpdpaPurgeCompliant": true, "statutoryHoldDurationYears": 8}'::jsonb,
    
    -- Lifecycle Status & Gated Safety Checklist
    status VARCHAR(32) NOT NULL DEFAULT 'ADMIN_REVIEW_PENDING'
        CHECK (status IN (
            'REQUEST_INITIATED',
            'IDENTITY_VERIFICATION_PENDING',
            'REQUEST_ACCEPTED',
            'ACCESS_SUSPENDED',
            'ADMIN_REVIEW_PENDING',
            'UNDER_REVIEW',
            'APPROVED_FOR_DELETION',
            'DELETION_PROCESSING',
            'COMPLETED',
            'VERIFICATION_FAILED',
            'REJECTED',
            'CANCELLED',
            'PROCESSING_FAILED',
            'REQUIRES_CLARIFICATION'
        )),
    checklist JSONB NOT NULL DEFAULT '{
        "identityVerification": "verified",
        "accessSuspension": "confirmed",
        "subscriptionReview": "pending",
        "entitlementReview": "pending",
        "financialRetention": "pending",
        "securityReview": "pending",
        "legalRetentionHold": "pending",
        "finalDecision": "pending"
    }'::jsonb,
    
    -- Reviewer Attribution & Timestamps
    assigned_reviewer_id VARCHAR(64),
    assigned_reviewer_name VARCHAR(255),
    reviewer_notes TEXT,
    rejection_reason_code VARCHAR(64),
    rejection_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    completed_at TIMESTAMPTZ
);

-- Indexes for Admin Queue Filtering & Lookups
CREATE INDEX IF NOT EXISTS idx_del_req_status ON identity.account_deletion_requests (status);
CREATE INDEX IF NOT EXISTS idx_del_req_suspension ON identity.account_deletion_requests (suspension_status);
CREATE INDEX IF NOT EXISTS idx_del_req_user_account ON identity.account_deletion_requests (user_account_id);
CREATE INDEX IF NOT EXISTS idx_del_req_reference ON identity.account_deletion_requests (reference_code);
CREATE INDEX IF NOT EXISTS idx_del_req_created ON identity.account_deletion_requests (created_at DESC);

-- 3. Tamper-Evident Immutable Audit Log Table
-- CRITICAL AUDIT INTEGRITY: ON DELETE RESTRICT (Never CASCADE)
CREATE TABLE IF NOT EXISTS identity.account_deletion_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(32) NOT NULL REFERENCES identity.account_deletion_requests(reference_code) ON DELETE RESTRICT,
    actor_id VARCHAR(64) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    previous_state VARCHAR(32) NOT NULL,
    new_state VARCHAR(32) NOT NULL,
    reason_notes TEXT,
    
    -- Cryptographic Hash Chaining for Tamper Evidence
    -- Root entry must chain to Genesis Trust Anchor: 0000000000000000000000000000000000000000000000000000000000000000
    payload_hash_sha256 VARCHAR(64) NOT NULL,
    prev_log_hash_sha256 VARCHAR(64) NOT NULL,
    is_immutable BOOLEAN NOT NULL DEFAULT true,
    
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_del_audit_request ON identity.account_deletion_audit_logs (request_id);
CREATE INDEX IF NOT EXISTS idx_del_audit_actor ON identity.account_deletion_audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_del_audit_created ON identity.account_deletion_audit_logs (created_at ASC);

-- 4. Database-Engine Level Immutability Enforcement (Triggers)
CREATE OR REPLACE FUNCTION identity.prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'SECURITY_VIOLATION: Audit records in identity.account_deletion_audit_logs are immutable and cannot be updated, deleted, or truncated.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_deletion_audit ON identity.account_deletion_audit_logs;
CREATE TRIGGER trg_protect_deletion_audit
    BEFORE UPDATE OR DELETE OR TRUNCATE
    ON identity.account_deletion_audit_logs
    FOR EACH STATEMENT
    EXECUTE FUNCTION identity.prevent_audit_log_mutation();

-- 5. Revocation of Destructive Privileges from Application Roles
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE identity.account_deletion_audit_logs FROM PUBLIC;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        REVOKE UPDATE, DELETE, TRUNCATE ON TABLE identity.account_deletion_audit_logs FROM authenticated;
        GRANT SELECT, INSERT ON TABLE identity.account_deletion_audit_logs TO authenticated;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON TABLE identity.account_deletion_audit_logs FROM anon;
    END IF;
END $$;

-- 6. Row Level Security (RLS) Enablement & Access Policies
ALTER TABLE identity.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.account_deletion_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view their own deletion request status
DROP POLICY IF EXISTS p_user_read_own_deletion_request ON identity.account_deletion_requests;
CREATE POLICY p_user_read_own_deletion_request ON identity.account_deletion_requests
    FOR SELECT TO authenticated
    USING (user_account_id = auth.uid()::text);

-- Policy: Admin / Service Role with iam.account_deletion.view can view all requests
DROP POLICY IF EXISTS p_admin_view_deletion_requests ON identity.account_deletion_requests;
CREATE POLICY p_admin_view_deletion_requests ON identity.account_deletion_requests
    FOR SELECT TO authenticated
    USING (
        auth.jwt() -> 'app_metadata' -> 'permissions' ? 'iam.account_deletion.view'
        OR auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Authorized Reviewers can update deletion requests
DROP POLICY IF EXISTS p_admin_update_deletion_requests ON identity.account_deletion_requests;
CREATE POLICY p_admin_update_deletion_requests ON identity.account_deletion_requests
    FOR UPDATE TO authenticated
    USING (
        auth.jwt() -> 'app_metadata' -> 'permissions' ? 'iam.account_deletion.review'
        OR auth.jwt() -> 'app_metadata' -> 'permissions' ? 'iam.account_deletion.approve'
        OR auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Audit logs can only be read by actors with iam.account_deletion.audit
DROP POLICY IF EXISTS p_admin_read_audit_logs ON identity.account_deletion_audit_logs;
CREATE POLICY p_admin_read_audit_logs ON identity.account_deletion_audit_logs
    FOR SELECT TO authenticated
    USING (
        auth.jwt() -> 'app_metadata' -> 'permissions' ? 'iam.account_deletion.audit'
        OR auth.jwt() ->> 'role' = 'service_role'
    );

-- Policy: Workflow service can insert new audit entries (updates & deletes are blocked by trigger)
DROP POLICY IF EXISTS p_system_insert_audit_logs ON identity.account_deletion_audit_logs;
CREATE POLICY p_system_insert_audit_logs ON identity.account_deletion_audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

COMMIT;

-- =====================================================================================
-- ROLLBACK SCRIPT (In case of operational rollback requirement):
-- CAUTION: ROLLBACK MUST NEVER BE EXECUTED IF LEGITIMATE REQUESTS OR AUDIT EVIDENCE EXIST.
-- 
-- BEGIN;
-- DROP POLICY IF EXISTS p_system_insert_audit_logs ON identity.account_deletion_audit_logs;
-- DROP POLICY IF EXISTS p_admin_read_audit_logs ON identity.account_deletion_audit_logs;
-- DROP POLICY IF EXISTS p_admin_update_deletion_requests ON identity.account_deletion_requests;
-- DROP POLICY IF EXISTS p_admin_view_deletion_requests ON identity.account_deletion_requests;
-- DROP POLICY IF EXISTS p_user_read_own_deletion_request ON identity.account_deletion_requests;
-- DROP TRIGGER IF EXISTS trg_protect_deletion_audit ON identity.account_deletion_audit_logs;
-- DROP FUNCTION IF EXISTS identity.prevent_audit_log_mutation();
-- DROP TABLE IF EXISTS identity.account_deletion_audit_logs;
-- DROP TABLE IF EXISTS identity.account_deletion_requests;
-- COMMIT;
-- =====================================================================================
