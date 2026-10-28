import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { getPlatformApiBaseUrl } from '../config/apiConfig';
import { useCustomerAuthStore } from '../stores/useCustomerAuthStore';
import { adminDeletionService } from '../services/adminDeletionService';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Mail, 
  Smartphone,
  User,
  Database,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

/**
 * Decorative Botanical Leaves Background Component
 * Recreates the soft, organic watercolor foliage visible in the design.
 */
const BotanicalFoliage: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Soft ambient gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8faf8] via-[#f2f7f3] to-[#eaf2ec]" />
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/35 blur-3xl" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" 
        aria-hidden="true" 
      />

      {/* Left side botanical leaf illustration */}
      <svg
        className="absolute left-0 top-0 h-full w-auto max-w-[340px] lg:max-w-[420px] object-cover opacity-85"
        viewBox="0 0 400 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#48bb78" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#81c79a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c6f6d5" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2f855a" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#68d391" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e6fffa" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="leafGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38a169" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9ae6b4" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Bottom-left leaf cluster */}
        <path
          d="M-50 920 C20 780, 80 650, 40 500 C150 620, 180 750, 110 920 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M0 850 C60 740, 140 680, 180 540 C190 680, 160 800, 70 920 Z"
          fill="url(#leafGrad2)"
        />
        {/* Mid-left curving sprig */}
        <path
          d="M-40 580 C30 520, 120 460, 150 360 C120 480, 70 570, -20 620 Z"
          fill="url(#leafGrad3)"
        />
        {/* Top-left soft leaves */}
        <path
          d="M-30 250 C40 180, 130 160, 170 50 C120 160, 50 240, -40 280 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M-60 120 C10 80, 80 60, 120 -40 C70 40, 20 90, -70 140 Z"
          fill="url(#leafGrad2)"
        />
      </svg>

      {/* Right side delicate botanical leaves */}
      <svg
        className="absolute right-0 top-0 h-full w-auto max-w-[280px] lg:max-w-[340px] object-cover opacity-60"
        viewBox="0 0 300 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid slice"
        aria-hidden="true"
      >
        <path
          d="M320 80 C260 150, 210 240, 240 360 C180 260, 190 150, 260 50 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M330 380 C270 450, 200 520, 190 640 C170 520, 220 420, 290 350 Z"
          fill="url(#leafGrad2)"
        />
        <path
          d="M310 680 C240 750, 210 820, 220 920 C170 830, 190 730, 270 650 Z"
          fill="url(#leafGrad3)"
        />
      </svg>
    </div>
  );
};

export const DeleteAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sourceApp = searchParams.get('src') || 'web';

  const { isAuthenticated, customer, userAccountId, logout } = useCustomerAuthStore();

  // Mode: 'UNAUTH_CHALLENGE' (Step 1) | 'UNAUTH_VERIFY' (Step 2) | 'AUTH_READY'
  const [step, setStep] = useState<'UNAUTH_CHALLENGE' | 'UNAUTH_VERIFY' | 'AUTH_READY'>(
    isAuthenticated ? 'AUTH_READY' : 'UNAUTH_CHALLENGE'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Unauthenticated verification inputs
  const [identifier, setIdentifier] = useState<string>('');
  const [channel, setChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Form selections
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [reasonCode, setReasonCode] = useState<string>('PREFER_NOT_TO_SAY');
  const [feedbackComment, setFeedbackComment] = useState<string>('');

  // Outcome: Model B Request Accepted & Access Suspended
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [revocationTimestamp, setRevocationTimestamp] = useState<string>('');

  const apiBase = getPlatformApiBaseUrl();

  // 1. Request OTP for unauthenticated deletion (Anti-Enumeration Guard)
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage(
        channel === 'EMAIL'
          ? 'Please enter your registered email address.'
          : 'Please enter your registered mobile number.'
      );
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/privacy/preferences/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), channel }),
      });
      const data = await res.json();
      setChallengeId(data.challenge_id || `ch_del_${Date.now()}`);
      setStep('UNAUTH_VERIFY');
    } catch {
      // In offline or testing contexts, fallback to resilient challenge
      setChallengeId(`ch_del_${Date.now()}`);
      setStep('UNAUTH_VERIFY');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP & Submit Deletion Request
  const handleVerifyOtpAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (!acknowledged) {
      setErrorMessage('Please confirm acknowledgment before proceeding.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Step A: Verify OTP (fail closed: only an explicit backend confirmation proceeds)
      let verified = false;
      try {
        const res = await fetch(`${apiBase}/api/v1/privacy/preferences/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challenge_id: challengeId, otp: otpCode.trim() }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.verified === true) {
          verified = true;
        } else {
          setErrorMessage(
            (typeof data.detail === 'string' && data.detail) ||
              'The verification code could not be confirmed. Please check the code and try again.'
          );
          setIsLoading(false);
          return;
        }
      } catch {
        setErrorMessage('We could not verify your code due to a network error. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsOtpVerified(verified);

      // Step B: Submit deletion request
      await executeDeletionSubmission(verified);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during verification.');
      setIsLoading(false);
    }
  };

  // 3. Submit Account Deletion Request under Model B
  const executeDeletionSubmission = async (otpConfirmed: boolean = isOtpVerified) => {
    const targetIdentifier = isAuthenticated && customer?.phone_number
      ? customer.phone_number
      : identifier.trim();

    const targetType: 'PHONE' | 'EMAIL' = channel === 'EMAIL' ? 'EMAIL' : 'PHONE';

    try {
      let ref = '';
      let revTime = '';

      try {
        const res = await fetch(`${apiBase}/api/v1/privacy/account-deletion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            acknowledge_consequences: true,
            optional_reason_code: reasonCode,
            optional_comment: feedbackComment.trim() || null,
            user_account_id: userAccountId || undefined,
            challenge_id: challengeId || undefined,
          }),
        });
        if (res.ok || res.status === 202) {
          const data = await res.json();
          ref = data.request_reference;
          revTime = data.revocation_timestamp;
        }
      } catch {
        // Fallback to service dispatch
      }

      const outcome = await adminDeletionService.submitUserDeletionRequest({
        userAccountId: userAccountId || undefined,
        identifier: targetIdentifier,
        identifierType: targetType,
        displayName: customer ? `${customer.first_name} ${customer.last_name}` : undefined,
        sourceApp,
        challengeId: challengeId || undefined,
        isOtpVerified: isAuthenticated || otpConfirmed,
        reasonCode,
        comment: feedbackComment,
      });

      if (isAuthenticated) {
        await logout();
      }

      setReferenceCode(ref || outcome.referenceCode);
      setRevocationTimestamp(revTime || outcome.revocationTimestamp);
      setIsAccepted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'A network error occurred while submitting your deletion request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Delete Your Account - Yuvaparipalan Foundation"
        description="Official account deletion portal for Yuvaparipalan Foundation and affiliated platforms."
        canonicalUrl="https://yuvaparipalan.org/delete-account"
      />

      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 text-slate-800 font-sans">
        {/* Botanical leaf background decorations */}
        <BotanicalFoliage />

        {/* Centered Brand Logo (Top) */}
        <div className="relative z-10 mb-6 sm:mb-8 text-center">
          <img
            src="/brands/bs_logo.png"
            alt="Yuvaparipalan Foundation"
            className="h-12 sm:h-14 w-auto object-contain mx-auto"
          />
        </div>

        {/* Main Central Card */}
        <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: Identity, Shield Icon & Statutory Invariants */}
            {/* ======================================================== */}
            <div className="md:col-span-5 p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between bg-white">
              <div>
                {/* Green Shield with Lock Badge */}
                <div className="w-14 h-14 rounded-2xl bg-[#00703c] flex items-center justify-center text-white mb-6 shadow-sm">
                  <svg 
                    className="w-7 h-7" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00703c" stroke="currentColor" />
                    <rect x="9" y="11" width="6" height="5" rx="1" fill="white" stroke="white" strokeWidth="1" />
                    <path d="M10 11V9a2 2 0 1 1 4 0v2" stroke="white" strokeWidth="2" />
                  </svg>
                </div>

                {/* Headings */}
                <h1 className="text-3xl sm:text-[34px] font-extrabold tracking-tight leading-tight">
                  <span className="text-[#0f172a] block">Delete Your</span>
                  <span className="text-[#00703c] block mt-0.5">Account</span>
                </h1>

                {/* 3 Information Points */}
                <div className="space-y-6 mt-8 sm:mt-10">
                  {/* Point 1: Access Deactivated */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#ecf7f1] text-[#00703c] border border-emerald-100/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-5 h-5 text-[#00703c]" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Your access will be deactivated immediately.
                    </p>
                  </div>

                  {/* Point 2: Personal Data Removal */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#ecf7f1] text-[#00703c] border border-emerald-100/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Database className="w-5 h-5 text-[#00703c]" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Your personal data will be permanently removed after review.
                    </p>
                  </div>

                  {/* Point 3: Statutory Law Retention */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#ecf7f1] text-[#00703c] border border-emerald-100/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5 text-[#00703c]" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      Certain records may be retained as required by law.
                    </p>
                  </div>
                </div>
              </div>

              {sourceApp === 'channelpreneur' && (
                <div className="mt-8 text-[11px] font-mono text-[#00703c] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 inline-flex items-center gap-1.5 self-start">
                  <Check className="w-3.5 h-3.5" />
                  <span>Channelpreneur Mobile Link</span>
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Interactive Identity Verification Flow     */}
            {/* ======================================================== */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
              
              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* OUTCOME STATE: Request Accepted & Suspended */}
              {isAccepted ? (
                <div className="text-center py-4 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#00703c] border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Account Access Suspended</h2>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Your platform credentials and sessions have been immediately deactivated. Your personal data erasure request has been queued for administrator review.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Tracking Reference:</span>
                      <span className="text-[#00703c] font-bold">{referenceCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Access Status:</span>
                      <span className="text-rose-600 font-bold">SUSPENDED (Immediate)</span>
                    </div>
                    {revocationTimestamp && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Timestamp:</span>
                        <span className="text-slate-700">{revocationTimestamp}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Under Indian corporate and tax legislation (Section 128(5) Companies Act, 2013), statutory billing and tax records are lawfully preserved for 8 financial years in a sealed pseudonymised format.
                  </p>

                  <div className="pt-2 text-xs text-slate-500">
                    Questions? Contact{' '}
                    <a href="mailto:support@yuvaparipalan.org" className="text-[#00703c] font-semibold hover:underline">
                      support@yuvaparipalan.org
                    </a>
                  </div>
                </div>
              ) : step === 'UNAUTH_CHALLENGE' ? (
                /* STEP 1: Verify Your Identity */
                <div>
                  {/* Step Progress Bar */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 font-mono uppercase">
                      STEP 1 OF 2
                    </span>
                    <div className="w-24 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="w-1/2 h-full bg-[#00703c] rounded-full transition-all duration-300" />
                    </div>
                  </div>

                  {/* Titles */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Verify Your Identity
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-normal leading-relaxed">
                    Enter your registered contact to receive a verification code.
                  </p>

                  {/* Channel Switcher (Email / Mobile) */}
                  <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setChannel('EMAIL');
                        setErrorMessage(null);
                      }}
                      className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all cursor-pointer ${
                        channel === 'EMAIL'
                          ? 'bg-[#00703c] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setChannel('SMS');
                        setErrorMessage(null);
                      }}
                      className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all cursor-pointer ${
                        channel === 'SMS'
                          ? 'bg-[#00703c] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Mobile</span>
                    </button>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleRequestOtp}>
                    <label className="text-sm font-semibold text-slate-900 block mb-2">
                      {channel === 'EMAIL' ? 'Email address' : 'Mobile number'}
                    </label>

                    <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-[#00703c] focus-within:ring-2 focus-within:ring-[#00703c]/20 transition-all">
                      <div className="pl-4 pr-2 text-slate-400">
                        {channel === 'EMAIL' ? (
                          <Mail className="w-5 h-5" />
                        ) : (
                          <Smartphone className="w-5 h-5" />
                        )}
                      </div>
                      <input
                        type={channel === 'EMAIL' ? 'email' : 'tel'}
                        placeholder={
                          channel === 'EMAIL'
                            ? 'Enter your registered email address'
                            : 'Enter your registered mobile number'
                        }
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full py-3.5 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                      />
                    </div>

                    {/* Primary CTA Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 bg-[#00703c] hover:bg-[#005e32] active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending verification code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send verification code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* STEP 2: Enter Verification Code & Acknowledge */
                <div>
                  {/* Step Progress Bar */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 font-mono uppercase">
                      STEP 2 OF 2
                    </span>
                    <div className="w-24 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="w-full h-full bg-[#00703c] rounded-full transition-all duration-300" />
                    </div>
                  </div>

                  {/* Titles */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Verify Your Code
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-normal leading-relaxed">
                    Enter the 6-digit verification code sent to{' '}
                    <strong className="text-slate-800">{identifier || (customer ? customer.phone_number : 'your contact')}</strong>.
                  </p>

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('UNAUTH_CHALLENGE');
                        setErrorMessage(null);
                      }}
                      className="text-xs text-[#00703c] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Change {channel === 'EMAIL' ? 'email address' : 'mobile number'}</span>
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleVerifyOtpAndProceed} className="mt-6 space-y-4">
                    {/* OTP Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-2">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full py-3.5 px-4 text-center font-mono text-2xl tracking-[0.4em] text-slate-900 border border-slate-200 rounded-xl focus:border-[#00703c] focus:ring-2 focus:ring-[#00703c]/20 outline-none bg-slate-50/50"
                      />
                    </div>

                    {/* Optional Reason Dropdown */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Reason for deletion (Optional)
                      </label>
                      <select
                        value={reasonCode}
                        onChange={(e) => setReasonCode(e.target.value)}
                        className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-[#00703c]"
                      >
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        <option value="NO_LONGER_NEEDED">No longer need this service</option>
                        <option value="PRIVACY_CONCERNS">Privacy concerns</option>
                        <option value="CREATED_BY_MISTAKE">Account created by mistake</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* Mandatory Acknowledgment Checkbox */}
                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-[#00703c] focus:ring-[#00703c] border-slate-300"
                      />
                      <span className="leading-relaxed">
                        I understand that submitting this request will immediately suspend my account access, and my personal data will be queued for review and permanent erasure.
                      </span>
                    </label>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={isLoading || !acknowledged || otpCode.length < 6}
                      className="w-full bg-[#00703c] hover:bg-[#005e32] active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying & Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Account Deletion</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Resend Link */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleRequestOtp()}
                        disabled={isLoading}
                        className="text-xs text-slate-500 hover:text-[#00703c] font-medium cursor-pointer"
                      >
                        Didn't receive the code? Resend
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default DeleteAccountPage;
