# OPERATIONAL DIRECTIVE 020 — STAGING DATABASE RECOVERY & REACHABILITY VERIFICATION RUNBOOK
# MANDATORY PROCEDURE, EXPLICIT STOP CONDITIONS & EVIDENCE REQUIREMENTS FOR DEVOPS / DBA LEAD

**Document Identifier:** `DEVOPS_DBA_STAGING_DATABASE_RECOVERY_DIRECTIVE_020.md`  
**Directive ID:** `YPF-DEVOPS-DBA-STAGING-RECOVERY-DIRECTIVE-020`  
**Parent Report:** `ACCOUNT_DELETION_MODEL_B_STAGING_EXECUTION_REPORT_019.md` (`YPF-ACCOUNT-DELETION-MODEL-B-STAGING-EXECUTION-019`)  
**Target Project Reference:** `pugqxafvjjvnwojijrha`  
**Target Canonical URL:** `https://pugqxafvjjvnwojijrha.supabase.co`  
**Target Environment:** Testing / Staging Environment Only  
**Release Candidate Baseline:** `95e3d85f4daaf58517d11d2fe51620cf2c7ffae6`  
**Production Baseline:** `a8b149217cae4a5e3bcda103962af77c9486d484` (Strict Hold)  
**Assigned Action Owner:** DevOps / DBA Lead (`admin@yuvaparipalan.org`)  
**Authoritative Timestamp:** 2026-10-25T11:48:00Z (2026-10-25 17:18:00 IST)  
**Operational Status:** **`BLOCKED — AWAITING DEVOPS/DBA VERIFIED EVIDENCE`**  
**Production Boundary:** **`HOLD — NO PRODUCTION MODIFICATION OR DEPLOYMENT AUTHORIZED`**

---

## 1. PURPOSE & MANDATORY SCOPE

This directive establishes the mandatory, narrowly scoped operational procedure for the authorized DevOps / DBA Lead to restore, verify, and certify reachability of the staging Supabase PostgreSQL database (`pugqxafvjjvnwojijrha`).

Execution of database migration `007_account_deletion_model_b_persistence.sql` and all downstream operational gates (G.2, G.5, G.8, G.11) remain strictly **BLOCKED** until all verification evidence specified in Section 4 is produced and independently validated.

---

## 2. MANDATORY SAFETY BOUNDARIES & EXPLICIT STOP CONDITIONS

The DevOps / DBA Lead and the automated agent must strictly observe the following hard boundaries:

| # | Safety Rule & Explicit Stop Condition | Operational Requirement |
| :---: | :--- | :--- |
| **SC-1** | **DNS Failure Stop** | If `pugqxafvjjvnwojijrha.supabase.co` fails operating system or public DNS resolution (`NXDOMAIN`), **DO NOT** attempt to run migration `007` or execute DDL. Stop immediately. |
| **SC-2** | **Multi-Tenant Pooler Fallacy** | An open TCP port (5432 or 6543) on `aws-0-ap-northeast-1.pooler.supabase.com` does **not** signify tenant availability. **DO NOT** claim database readiness based solely on connection pooler reachability. |
| **SC-3** | **Production Isolation Invariant** | **DO NOT** redirect staging migrations or tests to production. `origin/main` is strictly locked at baseline commit `a8b149217cae4a5e3bcda103962af77c9486d484`. |
| **SC-4** | **API Key Disambiguation** | A client publishable key (`anon`) is an HTTP PostgREST query token, not database credentials. Generating a publishable key does **not** restore PostgreSQL connectivity. Do not confuse the two. |
| **SC-5** | **No Blind Reruns or Retries** | If a migration attempt times out or errors, **DO NOT** rerun DDL without inspecting `information_schema.tables` and transaction history. |

---

## 3. STEP-BY-STEP STAGING DATABASE RECOVERY PROCEDURE

The authorized DevOps / DBA Lead must execute the following sequential steps in the official Supabase Management Console:

```mermaid
flowchart TD
    Start([Access Supabase Console]) --> CheckProj{Project Ref == pugqxafvjjvnwojijrha?}
    CheckProj -- No --> WrongProj[HALT: Locate Correct Project]
    CheckProj -- Yes --> CheckStatus{Status in Dashboard?}
    CheckStatus -- Paused --> ClickResume[Click 'Restore Project' / 'Resume']
    CheckStatus -- Restoring --> WaitDNS[Wait 10-15 Min for EBS & Route 53]
    CheckStatus -- Active --> TestDNS[Test Host DNS Resolution]
    ClickResume --> WaitDNS
    WaitDNS --> TestDNS
    TestDNS -- Fails NXDOMAIN --> CheckSupport[Check Cloud Status / Region]
    TestDNS -- Resolves IP --> TestAuthPG[Test Authenticated SQL on Port 6543]
    TestAuthPG -- Error/Timeout --> FixCreds[Verify DB Password / Roles]
    TestAuthPG -- Success --> RecordEvidence[Capture Health Query Output]
    RecordEvidence --> Signoff[Provide Written DBA Approval for 007]
```

### Step 3.1: Authoritative Console Project Inspection
1. Open a secure browser session and navigate to:  
   `https://supabase.com/dashboard/project/pugqxafvjjvnwojijrha`
2. Confirm the project reference displayed in the URL and top navigation bar is exactly `pugqxafvjjvnwojijrha`.
3. Check the project status badge:
   - If **`Paused`**: Click **"Restore project"** or **"Resume project"**.
   - If **`Restoring`**: Allow 10–15 minutes for compute container provisioning, storage attachment, and Route 53 public DNS record propagation.
   - If **`Active`**: Proceed immediately to Step 3.2.

### Step 3.2: Configure Client-Safe Publishable Key
1. In the left navigation, open **Project Settings &rarr; API**.
2. Locate the **Project API keys** section.
3. If no publishable key exists, click **Generate Key** or copy the existing `anon` / `publishable` key.
4. Record the key securely for the staging frontend/API configuration. (Never commit service-role or secret keys).

### Step 3.3: Verify Public DNS Propagation
From an external terminal, execute:

```powershell
Resolve-DnsName -Name 'pugqxafvjjvnwojijrha.supabase.co' -Server 8.8.8.8
```

* **Pass Criterion:** Returns active IPv4 (`A`) or canonical (`CNAME`) records.
* **Stop Condition:** If `NXDOMAIN` persists, compute provisioning or DNS synchronization is incomplete. Wait 5 minutes and retry.

### Step 3.4: Verify Authenticated PostgreSQL Connectivity
Connect using the approved staging PostgreSQL credentials:

```bash
psql "postgres://postgres.[ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

Execute the authoritative read-only health check query:

```sql
SELECT 
    current_database() AS database_name,
    current_user AS connected_user,
    inet_server_addr() AS server_ip,
    inet_server_port() AS server_port,
    version() AS postgresql_version,
    clock_timestamp() AS probe_timestamp;
```

---

## 4. REQUIRED EVIDENCE ARTIFACTS BEFORE MIGRATION 007 RESUMPTION

Before the automated agent is permitted to execute migration `007_account_deletion_model_b_persistence.sql`, the DevOps / DBA Lead must provide the following verifiable evidence:

### Evidence Item E-1: Host DNS Resolution Record
* Output of `Resolve-DnsName` or `dig` showing that `pugqxafvjjvnwojijrha.supabase.co` resolves to active IP addresses.

### Evidence Item E-2: Authenticated PostgreSQL Health Query Output
* Copy of the tabular execution output from the health check query in Step 3.4, proving:
  - Database is `postgres` (or approved staging database).
  - User is authorized to execute DDL.
  - Timestamp matches the current recovery window.

### Evidence Item E-3: Schema State Pre-Check
* Output of the following query confirming whether `identity.account_deletion_requests` already exists:
  ```sql
  SELECT table_schema, table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'identity';
  ```

### Evidence Item E-4: Formal Written DBA Approval
* Written sign-off from `admin@yuvaparipalan.org` confirming:
  > *"I confirm that Supabase staging project `pugqxafvjjvnwojijrha` is fully restored, healthy, and accepting authenticated connections. I have verified migration artifact `migrations/007_account_deletion_model_b_persistence.sql` (SHA-256: `ef54817eda754dce846c3ef8e347713dfd041273c58fffc6271a375d2b3e6adb`) and authorize its execution on the staging database."*

---

## 5. POST-RECOVERY WORKFLOW FOR THE AGENT

Upon receipt of Evidence Items E-1 through E-4:

1. **Independent Verification:** The agent will independently probe DNS, execute a read-only query via MCP `execute_sql`, and inspect table listings.
2. **Execute Migration 007:** Apply the migration via the approved runner and verify created tables, check constraints, indexes, triggers, and RLS policies.
3. **Prove Persistence:** Submit a synthetic deletion request, confirm PostgreSQL commitment, trigger a staging backend restart, and assert state persistence across restarts.
4. **Live Suspension Verification:** Probe token rejection (`AUTH.ACCOUNT_SUSPENDED`), refresh revocation, and new login denial on the deployed staging environment.
5. **Close Operational Gates:** Update gates G.2, G.5, G.8, and G.11 from `PROVISIONAL`/`BLOCKED` to `PASS`.

---

## 6. FINAL SUMMARY

* **Report Canonical LF SHA-256 Checksum (Pre-Commit Reference):**  
  `183ca78c72878b94d57e35eee703255a5bfdfc07ccfeee59f748a069892bb08f` (Verified and logged in Git tracking)
* **Release Candidate:** `95e3d85f4daaf58517d11d2fe51620cf2c7ffae6` on branch `testing` is verified and preserved.
* **Code Implementation:** Complete (85/85 tests passing).
* **Current Action:** DevOps / DBA Lead must follow Section 3 and provide Section 4 evidence.
* **Production Status:** **`HOLD — NO DEPLOYMENT AUTHORIZED`** (Maintained at baseline commit `a8b1492`).
