# BSDL IMPLEMENTATION DIRECTIVE: YP_PARTNER_APP SELF-SIGNUP & MOBILE KYC UX

**Document Version:** 1.0.0  
**Target Application:** `yp_executive_mobile` (Flutter 3.2.0+, Riverpod 2.4.9)  
**Backend Gateways:** `bs_api_service` (`/api/v1/gateway/yp_partner/...`)  
**Date:** October 3, 2026  
**Status:** `READY_FOR_IMPLEMENTATION`

---

## 1. MOBILE EXPERIENCE ARCHITECTURE

The mobile application transformation introduces 7 new orchestrated screens/controllers in `lib/features/onboarding`:

```
+---------------------------------------------------------------------------------+
|                        MOBILE ONBOARDING ROUTE MAP                              |
+---------------------------------------------------------------------------------+
| 1. /auth/welcome        | Entry Choice: [ Sign In ] vs [ Create Account ]       |
| 2. /signup/mobile       | Mobile Number input -> OTP SMS Challenge Screen       |
| 3. /signup/email        | Email input -> Async verification waiting screen      |
| 4. /signup/profile      | Progressive Profile Form (Kerala District dropdown)   |
| 5. /onboarding/kyc      | KYC Stepper (Aadhaar -> PAN -> Bank -> Review)        |
| 6. /onboarding/status   | Application Submitted / Under Review Dashboard        |
| 7. /onboarding/correct  | Targeted Document Correction & Resubmission           |
+---------------------------------------------------------------------------------+
```

---

## 2. DETAILED SCREEN IMPLEMENTATIONS

### Screen 1: Welcome & Entry Gate (`/auth/welcome`)
* **File:** `lib/features/authentication/presentation/screens/welcome_screen.dart`
* **Layout:**
  * App Branding: Yuvaparipalan Foundation Partner Movement.
  * Primary Action Button: `[ Sign In ]` (routes returning partners to phone+OTP).
  * Secondary Action Button: `[ New Channel Partner? Create Account ]`.
* **State Management:** Riverpod controller `authNavigationControllerProvider`.

### Screen 2: Mobile Number & OTP Verification (`/signup/mobile`)
* **Components:** Reuses `AppPhoneNumberField` and `AppOtpInput`.
* **Behavior:**
  * Partner inputs 10-digit Indian mobile number.
  * Backend API: `POST /api/v1/gateway/yp_partner/signup/challenge-mobile`.
  * After 6-digit OTP verification:
    * Marks `mobile_verified = true` in local state.
    * Advances to Email Collection.

### Screen 3: Email Verification Challenge (`/signup/email`)
* **Behavior:**
  * Collects partner's business/personal email address.
  * Backend API: `POST /api/v1/gateway/yp_partner/signup/challenge-email`.
  * Triggers backend email verification challenge via Notification Outbox.
  * **Waiting Screen:** Shows animation, "We've sent a verification email to `john@example.com`", with a `[ Resend Email ]` button (60s countdown) and `[ I've Verified My Email ]` check button that polls `GET /api/v1/gateway/yp_partner/signup/status`.
  * When verified (`email_verified = true`), automatically advances to Profile Completion.

### Screen 4: Basic Profile Capture (`/signup/profile`)
* **Form Inputs:**
  * Full Name (First Name, Last Name)
  * Date of Birth (DatePicker) & Gender (Select)
  * Address Line 1 & Line 2
  * District: Dropdown restricted strictly to Kerala's 14 governed districts (`Alappuzha`, `Ernakulam`, `Idukki`, `Kannur`, `Kasaragod`, `Kollam`, `Kottayam`, `Kozhikode`, `Malappuram`, `Palakkad`, `Pathanamthitta`, `Thiruvananthapuram`, `Thrissur`, `Wayanad`).
  * State: Fixed default to `Kerala`.
  * PIN Code: 6-digit number field.
* **Backend API:** `POST /api/v1/gateway/yp_partner/signup/profile`.
* **Save & Resume:** Changes automatically cached in local secure storage (`flutter_secure_storage`).

### Screen 5: KYC Onboarding Stepper (`/onboarding/kyc`)
* **Progress Bar:** `Step X of 3` header with animated progress indicator.
* **Sub-step 5.1: Aadhaar Card:**
  * Aadhaar number input: Formatted with space delimiters (`1234 5678 9012`).
  * Document upload: Two attachment cards for Front and Back photos.
  * Document upload uses secure pre-signed upload slot API:
    `POST /api/v1/gateway/yp_partner/kyc/upload-slot` -> PUT binary to private storage.
* **Sub-step 5.2: PAN Card:**
  * PAN input: Force-uppercase 10-character field (`ABCDE1234F`).
  * Document upload: Single photo/PDF scan.
* **Sub-step 5.3: Bank Account & Payout:**
  * Inputs: Account Holder Name, Bank Account Number, Re-enter Account Number, IFSC Code.
  * Real-time IFSC Resolver: On entering 11th IFSC character, invokes `GET /api/v1/gateway/yp_partner/kyc/resolve-ifsc?ifsc=SBIN0001234` to display verified Bank Name and Branch Name.
  * Document upload: Cancelled cheque or Passbook photo.
* **Sub-step 5.4: Review & Submit:**
  * Displays checklist summary:
    * Mobile Verified: Checkmark
    * Email Verified: Checkmark
    * Profile Complete: Checkmark
    * Aadhaar Details: Complete (`XXXX XXXX 9012`)
    * PAN Details: Complete (`ABCDE1234F`)
    * Bank Coordinates: Complete (`••••••••5678`)
  * CTA: `[ Submit Application for Review ]`.
  * Backend API: `POST /api/v1/gateway/yp_partner/kyc/submit`.

### Screen 6: Pre-Approval Home State (`/onboarding/status`)
* **Display after Submission:**
  * Status Badge: `Application Under Review`.
  * Message: "Thank you for completing your verification. Our administrative compliance team is reviewing your documents. You will receive an email notification when your account is approved."
  * Action: Operational features remain locked; partner cannot view Leads or Referrals.

### Screen 7: Correction Flow (`/onboarding/correct`)
* When admin reviewer flags an issue:
  * Application displays alert card: "Action Required: PAN Document Unclear".
  * Reason displayed: "The image of your PAN card is blurry. Please upload a clear photo showing your name and PAN number."
  * CTA: `[ Update PAN Document ]`.
  * Uploading the replacement document unlocks the `[ Resubmit Application ]` button.

---

## 3. BACKEND API SPECIFICATIONS

```
POST /api/v1/gateway/yp_partner/signup/initiate
{
    "invitation_token": "inv_7c9f8a2b...",
    "mobile_number": "+919876543210"
}
Response 200 OK:
{
    "status": "CHALLENGE_ISSUED",
    "challenge_id": "ch_550e8400...",
    "expires_in_seconds": 300
}

POST /api/v1/gateway/yp_partner/signup/verify-mobile
{
    "challenge_id": "ch_550e8400...",
    "otp_code": "123456"
}
Response 200 OK:
{
    "mobile_verified": true,
    "onboarding_session_token": "obs_99812..."
}

POST /api/v1/gateway/yp_partner/signup/challenge-email
{
    "email": "partner@example.com"
}
Response 200 OK:
{
    "email_challenge_sent": true,
    "retry_after_seconds": 60
}

POST /api/v1/gateway/yp_partner/kyc/submit
Headers: Authorization: Bearer <onboarding_session_token>
Response 200 OK:
{
    "kyc_case_id": "case_334411...",
    "status": "SUBMITTED",
    "submitted_at": "2026-10-03T10:50:00Z"
}
```

---
**Approved by:** Enterprise Architecture Governance Board
