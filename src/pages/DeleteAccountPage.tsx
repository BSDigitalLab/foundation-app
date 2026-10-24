import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Button } from '../components/ui/Button';
import { getPlatformApiBaseUrl } from '../config/apiConfig';
import { useCustomerAuthStore } from '../stores/useCustomerAuthStore';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Trash2, 
  Loader2, 
  Info, 
  FileText,
  Mail,
  Phone
} from 'lucide-react';

export const DeleteAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sourceApp = searchParams.get('src') || 'web';

  const { isAuthenticated, customer, userAccountId } = useCustomerAuthStore();

  // Mode: 'AUTH_READY' | 'UNAUTH_CHALLENGE' | 'UNAUTH_VERIFY'
  const [step, setStep] = useState<'AUTH_READY' | 'UNAUTH_CHALLENGE' | 'UNAUTH_VERIFY'>(
    isAuthenticated ? 'AUTH_READY' : 'UNAUTH_CHALLENGE'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Unauth verification inputs
  const [identifier, setIdentifier] = useState<string>('');
  const [channel, setChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Form selections
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [reasonCode, setReasonCode] = useState<string>('PREFER_NOT_TO_SAY');
  const [feedbackComment, setFeedbackComment] = useState<string>('');

  // Outcome
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [deletionTimestamp, setDeletionTimestamp] = useState<string>('');

  const apiBase = getPlatformApiBaseUrl();

  // 1. Request OTP for unauthenticated deletion
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email address or phone number.');
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
      setChallengeId(data.challenge_id);
      setStep('UNAUTH_VERIFY');
    } catch {
      setErrorMessage('Unable to dispatch verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/privacy/preferences/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challengeId, otp: otpCode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setIsOtpVerified(true);
        setStep('AUTH_READY');
      } else {
        setErrorMessage(data.detail || 'Invalid verification code.');
      }
    } catch {
      setErrorMessage('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Submit Account Deletion
  const handleSubmitDeletion = async () => {
    if (!acknowledged) {
      setErrorMessage('You must acknowledge the consequences of deletion to proceed.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    const payload: Record<string, any> = {
      acknowledge_consequences: true,
      optional_reason_code: reasonCode,
      optional_comment: feedbackComment.trim() || null,
    };

    if (isAuthenticated && userAccountId) {
      payload.user_account_id = userAccountId;
    } else if (challengeId && isOtpVerified) {
      payload.challenge_id = challengeId;
    } else {
      setErrorMessage('Identity verification is required before initiating account deletion.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/v1/privacy/account-deletion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok || res.status === 202) {
        setIsDeleted(true);
        setReferenceCode(data.request_reference || 'REQ-DEL-PROCESSED');
        setDeletionTimestamp(data.revocation_timestamp || new Date().toISOString());
      } else {
        setErrorMessage(data.detail || data.message || 'Unable to process account deletion.');
      }
    } catch {
      setErrorMessage('A network error occurred while submitting your deletion request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Delete Account & Personal Data Erasure"
        description="Official account deletion portal for Yuvaparipalan Foundation, Channelpreneur, and affiliated platforms."
        canonicalUrl="https://yuvaparipalan.org/delete-account"
      />

      <div className="min-h-[85vh] bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <FadeIn>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Account Deletion & Data Erasure
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Official portal for terminating your account and initiating personal data erasure.
              </p>
              {sourceApp === 'channelpreneur' && (
                <div className="mt-2 inline-flex items-center text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Channelpreneur Mobile Integration Verified
                </div>
              )}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* State A: Deletion Completed Card */}
            {isDeleted ? (
              <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-8 backdrop-blur-xl text-center space-y-6 shadow-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Access Revoked & Request Accepted</h2>
                  <p className="text-sm text-slate-300 mt-2">
                    Your login credentials have been permanently terminated. Eligible personal data has been queued for prompt erasure.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tracking Reference:</span>
                    <span className="text-rose-400 font-semibold">{referenceCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Access Revocation:</span>
                    <span className="text-slate-300 font-semibold text-emerald-400">Immediate (Complete)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="text-slate-300">{deletionTimestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Retention:</span>
                    <span className="text-amber-400">8-Yr Books Preserved</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 text-xs text-slate-400 text-left space-y-2">
                  <p>
                    <strong>Statutory Compliance Notice:</strong> Under Section 128 of the Indian Companies Act, 2013 and Section 44AA of the Income Tax Act, 1961, financial commission records and commercial vouchers are retained in a secured, pseudonymised state for 8 financial years.
                  </p>
                </div>

                <Link to="/">
                  <Button variant="secondary" className="w-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            ) : (
              /* State B: Deletion Form with Consequence Disclosures */
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                {/* Consequence Advisory Disclosures */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Please read the consequences carefully:</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2.5">
                    <div className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>Immediate Login Revocation:</strong> You will immediately lose access to Channelpreneur, Yuvaparipalan portals, and partner dashboards.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>Prompt Erasure (&lt; 72h):</strong> Your personal profile, contact information, credentials, and uploaded identity scans will be permanently erased.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span><strong>Statutory Tax Retention:</strong> Any previous commercial earnings, payout UTRs, and financial vouchers must legally be preserved for 8 financial years under Indian corporate and tax laws with personal details pseudonymised.</span>
                    </div>
                  </div>
                </div>

                {/* Identity Verification Section */}
                {step === 'UNAUTH_CHALLENGE' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4 pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-300">Step 1: Verify Account Ownership</h4>
                    <div className="flex rounded-xl bg-slate-950/60 p-1 border border-slate-800 mb-2">
                      <button
                        type="button"
                        onClick={() => setChannel('EMAIL')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          channel === 'EMAIL' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Email Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setChannel('SMS')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          channel === 'SMS' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Mobile Number
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        {channel === 'EMAIL' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </div>
                      <input
                        type={channel === 'EMAIL' ? 'email' : 'tel'}
                        placeholder={channel === 'EMAIL' ? 'name@example.com' : '+91 98765 43210'}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50"
                      />
                    </div>

                    <Button variant="secondary" type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Sending Verification Code...' : 'Request Verification Code'}
                    </Button>
                  </form>
                ) : step === 'UNAUTH_VERIFY' ? (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-300">Step 2: Enter Verification Code</h4>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 492018"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono text-center tracking-widest text-white focus:outline-none focus:border-rose-500/50"
                    />
                    <Button variant="secondary" type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Confirm Ownership'}
                    </Button>
                  </form>
                ) : (
                  /* Step 3: Verified / Authenticated Deletion Confirmation */
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    {isAuthenticated && customer ? (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-slate-400 block">Logged In As:</span>
                          <span className="font-semibold text-white">{customer.first_name} {customer.last_name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          Authenticated Session
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-slate-400 block">Verified Target Account:</span>
                          <span className="font-semibold text-white font-mono">{identifier}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          OTP Verified
                        </span>
                      </div>
                    )}

                    {/* Reason Selector */}
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1.5">
                        Reason for account deletion (Optional):
                      </label>
                      <select
                        value={reasonCode}
                        onChange={(e) => setReasonCode(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500/50"
                      >
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        <option value="NO_LONGER_NEEDED">No longer need this service</option>
                        <option value="NOT_SATISFIED">Not satisfied with platform</option>
                        <option value="PRIVACY_CONCERNS">Privacy concerns</option>
                        <option value="CREATED_BY_MISTAKE">Account created by mistake</option>
                        <option value="SWITCHING_SERVICES">Switching to alternative</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* Optional Comment */}
                    <div>
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value.slice(0, 250))}
                        placeholder="Additional comments (Optional, max 250 chars)..."
                        rows={2}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>

                    {/* Mandatory Acknowledgment Checkbox */}
                    <label className="flex items-start p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-rose-500 focus:ring-rose-500 border-rose-500/40 bg-slate-900"
                      />
                      <span className="ml-2.5">
                        I understand and confirm that deleting my account is irreversible and immediately terminates my ability to log in.
                      </span>
                    </label>

                    {/* Delete Account Action Button */}
                    <Button
                      variant="primary"
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white border-rose-500/30"
                      onClick={handleSubmitDeletion}
                      disabled={isLoading || !acknowledged}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Revoking Access & Initiating Erasure...</span>
                        </span>
                      ) : (
                        'Permanently Delete My Account'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountPage;
