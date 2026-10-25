# Yuvaparipalan Platform — Risk Register & Residual Risk Disposition
## Directive: YPF-ACCOUNT-DELETION-MODEL-B-REM-003
**Defect Remediated:** DEV-002 — Concurrent Audit-Chain Forks & Missing Predecessor Uniqueness Enforcement  
**Baseline Evaluated:** Remote testing database `plbdefqydtqohjgauwqp` (Tokyo `ap-northeast-1`)  
**Production Status:** STRICT HOLD

---

## 1. Concurrency & Integrity Risk Matrix

| Risk ID | Risk Description | Pre-Mitigation Severity | Applied Mitigation / Architectural Control | Residual Severity | Disposition |
| :---: | :--- | :---: | :--- | :---: | :---: |
| **RSK-CONCUR-01** | **Audit Chain Forking:** Two racing transactions append conflicting successors to the same predecessor hash. | **CRITICAL** | Applied `CONSTRAINT uq_account_deletion_audit_prev_hash UNIQUE (request_id, prev_log_hash_sha256)`. Database engine physically blocks competing insert with SQLSTATE 23505. | **NEGLIGIBLE** | **RESOLVED** |
| **RSK-CONCUR-02** | **Genesis Anchor Collision:** Uniqueness constraint blocks multiple deletion requests from anchoring to `GENESIS_HASH`. | **HIGH** | Constraint composite scope includes `request_id`. Multiple requests independently anchor to `GENESIS_HASH` without collision. Verified via `test_concurrent_intake_different_users_parallel_genesis_non_blocking`. | **NEGLIGIBLE** | **RESOLVED** |
| **RSK-CONCUR-03** | **Historical Data Rejection:** Existing historical audit rows violate the uniqueness constraint, causing migration failure. | **HIGH** | Pre-migration audit confirmed 0 duplicate predecessor pairs across all historical rows. Migration 008 includes automated pre-check query. Migration succeeded with 0 errors. | **NEGLIGIBLE** | **RESOLVED** |
| **RSK-CONCUR-04** | **Uncoordinated Retries / Silent Event Loss:** A failed transaction drops an audit event without notifying the caller. | **MEDIUM** | `append_audit_log` translates database unique violation into `AuditChainConcurrencyError`. Documented rollback-and-retry pattern retrieves updated tip hash and appends new successor. | **LOW** | **RESOLVED** |
| **RSK-CONCUR-05** | **Deadlock in Racing Intake Operations:** Concurrent deletion requests deadlock on multiple foreign keys or outbox tables. | **MEDIUM** | Top-level row-lock on `identity.user_accounts` (`FOR UPDATE`) establishes strict single-key ordering before any child records or outbox items are touched. | **NEGLIGIBLE** | **RESOLVED** |
| **RSK-CONCUR-06** | **Immutability Trigger Bypass / Test Pollution:** Agent leaves test records or attempts `DELETE` on immutable audit logs. | **CRITICAL** | Zero test records committed to `account_deletion_audit_logs`. Tests use transactional rollback fixtures. Row count re-verified at exactly 5 (zero lingering test rows). | **NEGLIGIBLE** | **RESOLVED** |
| **RSK-CONCUR-07** | **Unauthorized Production Modification:** Unapproved migration applied to staging/testing/main release branches. | **CRITICAL** | Branch strictly confined to `dev`. Testing database explicitly authorized via Checkpoint D modal. Zero production access. | **NEGLIGIBLE** | **RESOLVED** |

---

## 2. Continuing Open Risks & Downstream Dependencies

The following risks remain tracked outside REM-003 scope and continue to be governed under their designated directives:

1. **Gate G.10 (WORM Audit Archival):**
   - *Status:* **`BLOCKED`**
   - *Context:* Immutable replication to an external Object Lock bucket remains unprovisioned. Tracking under Directive G.10.
2. **Gate G.11 (Disaster Recovery Safeguards):**
   - *Status:* **`PROVISIONAL`**
   - *Context:* Tombstone replay logic is implemented in code but requires a scheduled non-destructive restoration rehearsal before final production sign-off.
3. **REM-004 (Platform Console Review Workspace):**
   - *Status:* **`PENDING`**
   - *Context:* Multi-system administrative review UI in `apps/Platform Console` requires reconciliation under its own workstream.
4. **REM-005 (Legal Counsel Policy Ratification):**
   - *Status:* **`PENDING`**
   - *Context:* Formal legal sign-off on the 8-year statutory retention schedule and DPDPA deletion disclosures.
5. **Production Deployment Hold:**
   - *Status:* **`STRICT HOLD`**
   - *Context:* No production access, deployment, or promotion authorized by this workstream.
