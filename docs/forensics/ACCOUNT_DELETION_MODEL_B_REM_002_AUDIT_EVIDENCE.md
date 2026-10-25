# FORENSIC AUDIT EVIDENCE REGISTER: REM-002
# Test Vectors, Adversarial Suite Results & Control Register

**Directive Reference:** `YPF-ACCOUNT-DELETION-MODEL-B-REM-002`  
**Parent Directive:** `YPF-ACCOUNT-DELETION-MODEL-B-COMMIT-AND-REMEDIATION-025`  
**Execution Environment:** Authorized Testing Database (`yp_platform_testing_db`, project `plbdefqydtqohjgauwqp`, Tokyo `ap-northeast-1`)  
**Production Status:** STRICT HOLD — NO PRODUCTION DEPLOYMENT, MIGRATION, PROMOTION, OR PRODUCTION ACCESS  
**Date:** 2026-10-25  

---

## 1. Mandatory Audit and Evidence Register (R2-01 to R2-18)

| ID | Mandatory Control | Minimum Acceptable Evidence | Actual Result / Reference | Classification |
| :--- | :--- | :--- | :--- | :--- |
| **R2-01** | Remote baseline integrity | Full branch SHAs and ancestry | Platform: `1c226ce` (dev), `cae26c9` (testing/main); App: `0bbc68a` (dev), `95e3d85` (testing), `a8b1492` (main). Unchanged. | **`PASS`** |
| **R2-02** | Complete call-path inventory | Search output and writer/verifier map | All audit writes route to `PrivacyLifecycleOrchestrator.compute_audit_hash` -> `compute_audit_hash_v2`. Verified. | **`PASS`** |
| **R2-03** | V1 compatibility | Historical fixtures and exact digest comparisons | `YP-DEL-2026-SYN03` (Events 1, 2, 3) independently verified against v1 formula with 100% exact match. | **`PASS`** |
| **R2-04** | V2 specification compliance | Byte-level encoding specification | Documented in `audit_serialization.py` (Domain separator `YPF-ACCOUNT-DELETION-AUDIT\x02` + 8 length-prefixed fields). | **`PASS`** |
| **R2-05** | Independent digest verification | Independently computed expected bytes and digest | Test vector computed outside production code matches `bd9a556093a174acf76168e3c5f916f30fa96ce3ac324864c3555e760f41e334`. | **`PASS`** |
| **R2-06** | Null/empty/delimiter handling | Adversarial test vectors | `test_v2_null_versus_empty_string_distinction` (250 vs 260 bytes); `test_v2_embedded_pipe_characters_without_delimiter_collision`. | **`PASS`** |
| **R2-07** | Unicode and byte lengths | UTF-8 boundary tests | `test_v2_unicode_and_multi_byte_character_boundary` (Praveen — नमस्ते ❤️); `test_v2_identical_character_counts_different_utf8_byte_lengths`. | **`PASS`** |
| **R2-08** | Version identification | Evidence of exact dual-verification design | `verify_audit_record` independently verifies V2 then V1 without schema modifications. | **`PASS`** |
| **R2-09** | Mixed-chain verification | Historical v1 plus new v2 test chain | `test_mixed_v1_v2_audit_chain_verification` verifies continuous chain of 2 V1 rows + 1 V2 row. | **`PASS`** |
| **R2-10** | Tamper detection | Negative tests for every critical field | `test_v2_tamper_detection_on_each_critical_field` parametrizes all 8 canonical fields; all fail closed. | **`PASS`** |
| **R2-11** | Fail-closed behavior | Tests proving invalid hashes cannot be accepted | `test_malformed_stored_digest_fails_closed` and `test_type_safety_rejects_unsupported_field_types`. | **`PASS`** |
| **R2-12** | Model B regression safety | Relevant lifecycle regression suite | `python -m pytest tests/privacy/test_privacy_lifecycle.py` (20 passed); `test_audit_serialization.py` (21 passed). Total 41 green. | **`PASS`** |
| **R2-13** | No schema change | Diff and migration inventory | Zero new migration files; `git status` shows zero database schema changes. | **`PASS`** |
| **R2-14** | No historical mutation | Read-only evidence and unchanged fixture digests | Database rows in `plbdefqydtqohjgauwqp` inspected; SYN01 and SYN03 digests unchanged. | **`PASS`** |
| **R2-15** | No unrelated changes | Reviewed diff and file inventory | Only `audit_serialization.py`, `orchestrator.py`, and test files touched. | **`PASS`** |
| **R2-16** | Remote publication | Verified `dev` SHA and clean worktree | Committed to `dev` and pushed to `origin/dev`. | **`PASS`** |
| **R2-17** | Protected branch preservation | Confirmed unchanged `testing` and `main` | Verified against git log and remote metadata. | **`PASS`** |
| **R2-18** | Risk disposition | Per-checkpoint risk register and residual risks | Documented in `ACCOUNT_DELETION_MODEL_B_REM_002_RISK_REGISTER.md`. | **`PASS`** |

---

## 2. Independent Deterministic Test Vectors

All test vectors below were independently computed outside production code and cross-checked against automated unit tests:

### Vector 1: Standard Intake Event (All Fields Populated)
- **Fields:**
  - `request_id`: `"REQ-DEL-20261025-SYN01"`
  - `action`: `"REQUEST_INITIATED"`
  - `actor_id`: `"usr_acc_89234"`
  - `actor_role`: `"CUSTOMER"`
  - `prev_state`: `"REQUEST_INITIATED"`
  - `new_state`: `"ADMIN_REVIEW_PENDING"`
  - `reason_notes`: `"Initial self-service request submitted"`
  - `prev_log_hash_sha256`: `"0000000000000000000000000000000000000000000000000000000000000000"`
- **Framed Byte Length:** 298 bytes
- **Expected SHA-256 Digest:** `bd9a556093a174acf76168e3c5f916f30fa96ce3ac324864c3555e760f41e334`
- **Automated Test:** `test_v2_specification_all_fields_populated_matches_independent_vector`
- **Status:** **`VERIFIED (EXACT MATCH)`**

### Vector 2: Null `reason_notes`
- **`reason_notes`:** `None` (Marker: `0x00`)
- **Framed Byte Length:** 252 bytes
- **Expected SHA-256 Digest:** `c363156cf715995777d047b137be7c193227f60fac32b8b683cd1ebb8c7e71a7`
- **Status:** **`VERIFIED (EXACT MATCH)`**

### Vector 3: Empty String `reason_notes`
- **`reason_notes`:** `""` (Marker: `0x01`, Length: `0x0000000000000000`, 0 bytes payload)
- **Framed Byte Length:** 260 bytes
- **Expected SHA-256 Digest:** `da1fa83d2159ffb2365876780594543bbd6661e5f8323cbff5a05c2d84c1278b`
- **Status:** **`VERIFIED (EXACT MATCH)`** (Proves Null vs Empty Distinction: 252 vs 260 bytes)

### Vector 4: Embedded Pipe Characters
- **`reason_notes`:** `"Reason with | pipe | and || multiple | pipes"`
- **Framed Byte Length:** 304 bytes
- **Expected SHA-256 Digest:** `c7629ec8fbfa72f56d46fbfa33d22236761e8bb2703ff75bdaa120ff601b9625`
- **Status:** **`VERIFIED (EXACT MATCH)`**

### Vector 5: Unicode Multi-Byte Characters
- **`reason_notes`:** `"Praveen — नमस्ते ❤️"`
- **Framed Byte Length:** 297 bytes
- **Expected SHA-256 Digest:** `cc64bbe732af62fbd8f0e8bad845dbc98943ba652e4970592fc7a6743058ea51`
- **Status:** **`VERIFIED (EXACT MATCH)`**

---

## 3. Test Commands & Real Execution Results

### 3.1 Serialization Test Suite (`test_audit_serialization.py`)
```bash
python -m pytest tests/privacy/test_audit_serialization.py
```
**Output:**
```
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\workspace\platform\Yuvaparipalan Platform
collected 21 items

tests\privacy\test_audit_serialization.py .....................          [100%]
============================= 21 passed in 0.71s ==============================
```

### 3.2 Full Backend Privacy Suite (`tests/privacy/`)
```bash
python -m pytest tests/privacy/ -v
```
**Output:**
```
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.1.1, pluggy-1.6.0
collected 41 items

tests/privacy/test_audit_serialization.py::test_v2_specification_all_fields_populated_matches_independent_vector PASSED
... (21 serialization tests passed)
tests/privacy/test_privacy_lifecycle.py::test_account_deletion_execution_and_request_tracking PASSED
... (20 lifecycle tests passed)

====================== 41 passed, 25 warnings in 32.83s =======================
```

### 3.3 Frontend Model B Architecture Suite (`apps/Foundation App`)
```bash
node --experimental-strip-types --test test/accountDeletionModelB.test.ts
```
**Output:**
```
✔ Directive 006 & 007: Model B Admin-Reviewed Account Deletion Architecture Suite (1902.2574ms)
ℹ tests 35
ℹ suites 10
ℹ pass 35
ℹ fail 0
```

---

## 4. Staging Database Sanitization Proof

- **Target Database:** `plbdefqydtqohjgauwqp` (`yp_platform_testing_db`, Tokyo `ap-northeast-1`).
- **Inspection Query:**
  ```sql
  SELECT count(*) FROM identity.account_deletion_requests;
  SELECT count(*) FROM identity.account_deletion_audit_logs;
  ```
- **Result:**
  - `account_deletion_requests`: Count = **2** (Preserved synthetic fixtures `YP-DEL-2026-SYN01`, `YP-DEL-2026-SYN03`).
  - `account_deletion_audit_logs`: Count = **5**.
  - Lingering test fixtures: **0**.
