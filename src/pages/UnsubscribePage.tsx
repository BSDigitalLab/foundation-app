import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Button } from '../components/ui/Button';
import { getPlatformApiBaseUrl } from '../config/apiConfig';
import { 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface ScopeOption {
  code: string;
  label: string;
}

export const UnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const initialChannel = searchParams.get('channel') || 'EMAIL';
  const programId = searchParams.get('program_id') || '';

  // Mode state: 'TOKEN' | 'MANUAL' | 'VERIFY_OTP'
  const [mode, setMode] = useState<'TOKEN' | 'MANUAL' | 'VERIFY_OTP'>(token ? 'TOKEN' : 'MANUAL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenResolved, setTokenResolved] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Form selections
  const [recipientMasked, setRecipientMasked] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<string>('GLOBAL_MARKETING');
  const [reasonCode, setReasonCode] = useState<string>('PREFER_NOT_TO_SAY');
  const [optionalComment, setOptionalComment] = useState<string>('');

  // Manual fallback state
  const [manualIdentifier, setManualIdentifier] = useState<string>('');
  const [manualChannel, setManualChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState<string>('');
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Outcome state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completionReference, setCompletionReference] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiBase = getPlatformApiBaseUrl();

  // 1. Resolve Token Safely on Initial Load (Anti-Scanner Guard: GET resolves only, does NOT execute)
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetch(`${apiBase}/api/v1/privacy/preferences/resolve?token=${encodeURIComponent(token)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setTokenResolved(true);
            setRecipientMasked(data.recipient_masked || 'Registered Contact');
            if (data.advertised_scope) setSelectedScope(data.advertised_scope);
          } else {
            setTokenError(data.message || 'The unsubscribe link is invalid or has expired.');
            setMode('MANUAL');
          }
        })
        .catch(() => {
          setTokenError('Unable to verify the unsubscribe link. Please use manual verification below.');
          setMode('MANUAL');
        })
        .finally(() => setIsLoading(false));
    }
  }, [token, apiBase]);

  // 2. Request OTP Challenge (Manual Fallback)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIdentifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/privacy/preferences/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: manualIdentifier.trim(),
          channel: manualChannel,
        }),
      });
      const data = await res.json();
      setChallengeId(data.challenge_id);
      setMode('VERIFY_OTP');
    } catch {
      setErrorMessage('Unable to request verification code. Please try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue.trim() || otpValue.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/privacy/preferences/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: challengeId,
          otp: otpValue.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setIsOtpVerified(true);
        setRecipientMasked(data.recipient_masked);
      } else {
        setErrorMessage(data.detail || 'Invalid verification code. Please check and try again.');
      }
    } catch {
      setErrorMessage('Error verifying code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Submit Unsubscription (Commits suppression)
  const handleConfirmUnsubscribe = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const payload: Record<string, any> = {
      scope: selectedScope,
      optional_reason_code: reasonCode,
      optional_comment: optionalComment.trim() || null,
      channel: manualChannel,
      program_id: programId || null,
    };

    if (token && tokenResolved) {
      payload.token = token;
    } else if (challengeId && isOtpVerified) {
      payload.challenge_id = challengeId;
    } else {
      setErrorMessage('Verification is required before committing communication preferences.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/v1/privacy/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setIsCompleted(true);
        setCompletionReference(data.request_reference || 'REQ-UNSUB-CONFIRMED');
      } else {
        setErrorMessage(data.detail || 'Unable to complete unsubscription. Please try again.');
      }
    } catch {
      setErrorMessage('A network error occurred while updating your preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Communication Preferences & Unsubscribe"
        description="Manage your communication preferences, channel opt-outs, or unsubscription from Yuvaparipalan Foundation campaign and promotional messages."
        canonicalUrl="https://yuvaparipalan.org/unsubscribe"
      />

      <div className="min-h-[85vh] bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <FadeIn>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Communication Preferences
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Manage your marketing communications, campaign notices, and channel preferences.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Token Resolution Error Guidance */}
            {tokenError && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-start space-x-3">
                <Info className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                <span>{tokenError}</span>
              </div>
            )}

            {/* State A: Completed Confirmation Card */}
            {isCompleted ? (
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-xl text-center space-y-6 shadow-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Unsubscription Confirmed</h2>
                  <p className="text-sm text-slate-300 mt-2">
                    Your preferences have been recorded. You will no longer receive promotional communications covered by your choice.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reference:</span>
                    <span className="text-emerald-400 font-semibold">{completionReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Effective At:</span>
                    <span className="text-slate-300">Immediate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scope:</span>
                    <span className="text-slate-300">{selectedScope}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 text-xs text-slate-400 text-left flex items-start space-x-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
                  <span>
                    <strong>Note:</strong> This does not delete your Yuvaparipalan account. Mandatory transactional alerts (e.g. security codes or course receipts) relating to active enrollments will continue to be delivered.
                  </span>
                </div>

                <Link to="/">
                  <Button variant="primary" className="w-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            ) : (
              /* State B: Active Form (Token or Verified Manual) */
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                {/* Flow 1: Valid Token or Verified OTP (Preferences Confirmation) */}
                {(tokenResolved || isOtpVerified) ? (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Managing preferences for:</span>
                        <span className="text-sm font-semibold text-white font-mono">{recipientMasked}</span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>

                    {/* Scope Selector */}
                    <div>
                      <label className="text-sm font-medium text-slate-200 block mb-3">
                        Select Communication Scope:
                      </label>
                      <div className="space-y-2.5">
                        {[
                          {
                            code: 'GLOBAL_MARKETING',
                            title: 'Stop all promotional messages',
                            desc: 'Unsubscribe from all marketing broadcasts, updates, and campaigns across all channels.',
                          },
                          {
                            code: 'CHANNEL_EMAIL',
                            title: 'Stop promotional emails only',
                            desc: 'Keep SMS / WhatsApp updates but stop receiving promotional emails.',
                          },
                          {
                            code: 'CHANNEL_MOBILE',
                            title: 'Stop WhatsApp & SMS only',
                            desc: 'Keep email newsletters but stop mobile text campaigns.',
                          },
                          ...(programId ? [{
                            code: 'PROGRAM_WITHDRAWAL',
                            title: 'Withdraw from this Program',
                            desc: 'Stop receiving follow-ups for this specific educational program.',
                          }] : []),
                        ].map((item) => (
                          <label
                            key={item.code}
                            className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                              selectedScope === item.code
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="scope"
                              value={item.code}
                              checked={selectedScope === item.code}
                              onChange={() => setSelectedScope(item.code)}
                              className="mt-1 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                            />
                            <div className="ml-3">
                              <span className="text-sm font-semibold block">{item.title}</span>
                              <span className="text-xs text-slate-400 block mt-0.5">{item.desc}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Optional Feedback Reason */}
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1.5">
                        Reason for unsubscribing (Optional):
                      </label>
                      <select
                        value={reasonCode}
                        onChange={(e) => setReasonCode(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      >
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        <option value="TOO_MANY_MESSAGES">I receive too many messages</option>
                        <option value="NOT_RELEVANT">Content is not relevant to me</option>
                        <option value="NO_LONGER_INTERESTED">I am no longer interested</option>
                        <option value="MISTAKE">I signed up by mistake</option>
                        <option value="PRIVACY_CONCERNS">Privacy concerns</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    {/* Optional Comment Box */}
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1.5">
                        Additional feedback (Optional, max 250 characters):
                      </label>
                      <textarea
                        value={optionalComment}
                        onChange={(e) => setOptionalComment(e.target.value.slice(0, 250))}
                        placeholder="Help us improve our communications..."
                        rows={2}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                      />
                      <span className="text-[10px] text-slate-500 float-right mt-1">
                        {optionalComment.length}/250 (Auto-purged after 30 days)
                      </span>
                    </div>

                    {/* Confirm Action Button */}
                    <Button
                      variant="primary"
                      className="w-full mt-4"
                      onClick={handleConfirmUnsubscribe}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Preferences...</span>
                        </span>
                      ) : (
                        'Confirm Unsubscription'
                      )}
                    </Button>
                  </div>
                ) : mode === 'VERIFY_OTP' ? (
                  /* Flow 2: OTP Verification Stage */
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                      A 6-digit verification code has been dispatched. Enter it below to verify contact ownership.
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 492018"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono text-center tracking-widest text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying...</span>
                        </span>
                      ) : (
                        'Verify Code'
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => setMode('MANUAL')}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Change phone number or email
                    </button>
                  </form>
                ) : (
                  /* Flow 3: Manual Entry Mode (No token or expired token) */
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="flex rounded-xl bg-slate-950/60 p-1 border border-slate-800 mb-4">
                      <button
                        type="button"
                        onClick={() => setManualChannel('EMAIL')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          manualChannel === 'EMAIL' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Email Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualChannel('SMS')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          manualChannel === 'SMS' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Mobile Number
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        {manualChannel === 'EMAIL' ? 'Registered Email Address' : 'Mobile Phone Number (+91)'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          {manualChannel === 'EMAIL' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                        </div>
                        <input
                          type={manualChannel === 'EMAIL' ? 'email' : 'tel'}
                          placeholder={manualChannel === 'EMAIL' ? 'name@example.com' : '+91 98765 43210'}
                          value={manualIdentifier}
                          onChange={(e) => setManualIdentifier(e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Verification Code...</span>
                        </span>
                      ) : (
                        'Request Verification Code'
                      )}
                    </Button>

                    <p className="text-[11px] text-slate-500 text-center">
                      To prevent unauthorized tampering, manual unsubscription requires a single verification code.
                    </p>
                  </form>
                )}
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </>
  );
};

export default UnsubscribePage;
