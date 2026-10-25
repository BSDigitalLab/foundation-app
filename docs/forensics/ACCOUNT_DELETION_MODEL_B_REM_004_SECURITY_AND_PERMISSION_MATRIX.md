# Yuvaparipalan Platform — Security & Permission Traceability Matrix
## Directive: YPF-ACCOUNT-DELETION-MODEL-B-REM-004
**Platform:** Platform Console (`apps/Platform Console`) & Platform Backend (`platform/Yuvaparipalan Platform`)  
**Scope:** Model B Administrative Deletion Review Workspace  
**Status:** Certified & Verified

---

## 1. Action-to-API & Permission Traceability Matrix

Every administrative capability in the review workspace is mapped below to its corresponding backend API endpoint, canonical platform permission, UI guard, and automated test case.

| Action Description | HTTP Method & URI Path | Canonical Permission | Alias Permitted | Server-Side Enforcement | UI Guard Mechanism | Automated Test Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **View Queue & Metrics** | `GET /gateway/admin_portal/iam/account-deletion-requests` | `PLATFORM.IAM.ACCOUNT_DELETION.VIEW` | `iam.account_deletion.view` | `require_platform_permission` raises 403 if missing | Renders 403 Forbidden Access Restricted card | Backend: `test_queue_listing_forbidden_without_permission`<br>Frontend: `Test 2: Unauthorized access` |
| **Inspect Request Detail** | `GET /gateway/admin_portal/iam/account-deletion-requests/{ref}` | `PLATFORM.IAM.ACCOUNT_DELETION.VIEW` | `iam.account_deletion.view` | Validates session & permission; returns 404 if invalid | Details drawer/panel blocked without view permission | Backend: `test_request_detail_and_not_found`<br>Frontend: `Test 3: Request detail inspection` |
| **Review / Update Checklist** | `POST /gateway/admin_portal/iam/account-deletion-requests/{ref}/review` | `PLATFORM.IAM.ACCOUNT_DELETION.REVIEW` | `iam.account_deletion.review` | Validates reviewer identity; updates checklist; transitions state | Checklist toggles & 'Start Review' disabled | Backend: `test_review_update_and_checklist_management`<br>Frontend: `Test 4: Interactive checklist updates` |
| **Approve Request** | `POST /gateway/admin_portal/iam/account-deletion-requests/{ref}/approve` | `PLATFORM.IAM.ACCOUNT_DELETION.APPROVE` | `iam.account_deletion.approve` | Enforces Separation of Duties (`requester_id != reviewer_id`); transitions state to `APPROVED`; appends v2 audit log | Disabled if requester is reviewer or missing approve permission | Backend: `test_approval_separation_of_duties`, `test_successful_approval`<br>Frontend: `Test 5 & 6: Separation of Duties & Approval` |
| **Reject Request** | `POST /gateway/admin_portal/iam/account-deletion-requests/{ref}/reject` | `PLATFORM.IAM.ACCOUNT_DELETION.REJECT` | `iam.account_deletion.reject` | Validates mandatory reason code; transitions state to `REJECTED`; **strictly preserves account access suspension** | Disabled without reject permission; requires modal confirmation | Backend: `test_rejection_preserves_suspension`<br>Frontend: `Test 7: Rejection preserves suspension` |
| **Inspect Cryptographic Audit Trail** | `GET /gateway/admin_portal/iam/account-deletion-requests/{ref}/audit-trail` | `PLATFORM.IAM.ACCOUNT_DELETION.AUDIT` | `iam.account_deletion.audit` | Calls `verify_audit_chain`; returns chain validation result, sequence numbers, and SHA-256 hashes | 'Verify Hash Chain' button hidden without audit permission | Backend: `test_audit_trail_and_chain_verification`<br>Frontend: `Test 8: Cryptographic audit trail inspection` |

---

## 2. Server-Side Enforcement vs. UI Guards

The Platform Console enforces the principle of **Defense in Depth**:
1. **Server as Single Enforcement Boundary:**
   - UI button disabling and hidden views provide a streamlined user experience, but **do not constitute authorization**.
   - If an unauthorized or tampered client directly issues an HTTP mutation request to any `/gateway/admin_portal/iam/account-deletion-requests/*` endpoint, the platform gateway middleware and `require_platform_permission` immediately reject the request with HTTP `403 FORBIDDEN`.
2. **Separation of Duties (Anti-Self-Approval):**
   - The platform strictly forbids an administrator from approving their own account deletion request.
   - **Frontend Guard:** Displays an amber warning banner: *"Separation of Duties Warning: You cannot approve your own account deletion request"*, and disables the *"Approve Request"* button.
   - **Backend Guard:** In `account_deletion_admin_api.py`, `approve_request` asserts:
     ```python
     if request_record.user_id == reviewer_id:
         raise HTTPException(
             status_code=status.HTTP_400_BAD_REQUEST,
             detail="Separation of duties violation: Requester cannot approve their own account deletion request"
         )
     ```
3. **Preservation of Suspension on Rejection:**
   - Under Model B governance, rejecting a deletion request **never** implicitly restores the user's account access.
   - If an account was suspended upon deletion submission, rejecting the deletion request leaves the user account in `SUSPENDED` status.
   - Any access restoration must follow a separate, dedicated administrative reinstatement workflow.

---

## 3. PII & Secret Handling Specification

1. **Queue Redaction:** In the queue table view, user emails and phone numbers are masked:
   - Example: `arun.kumar@gmail.com` -> `a***r@gmail.com`.
2. **Credential Sanitization:**
   - Zero passwords, OTP secrets, session tokens, or API keys are returned in queue or detail payloads.
3. **Telemetry & Audit Redaction:**
   - Error messages returned to the browser never expose internal database stack traces, connection strings, or full unmasked PII.
   - All audit chain events record actor IDs, timestamps, and statutory compliance reasons, omitting sensitive authentication tokens.
