import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCustomerAuthStore } from '../../stores/useCustomerAuthStore';
import { X, Smartphone, KeyRound, ShieldCheck, UserCheck, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    isModalOpen,
    closeModal,
    requestOtp,
    verifyOtp,
    isLoading,
    error,
    clearError,
    activeChallengeId,
    cooldownRemaining,
    successMessage,
  } = useCustomerAuthStore();

  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  // Extract attribution parameters from URL or sessionStorage (e.g. ?campaign=...&ref=...&program_id=...&campaign_id=...)
  const getAttribution = () => {
    const params = new URLSearchParams(location.search);
    let cached: Record<string, string> = {};
    try {
      const raw = sessionStorage.getItem('yp_campaign_attribution');
      if (raw) cached = JSON.parse(raw);
    } catch {
      // ignore
    }

    const attr: Record<string, string> = {};
    for (const key of ['campaign', 'campaign_id', 'program_id', 'ref', 'crid', 'sid', 'src']) {
      const val = params.get(key) || cached[key];
      if (val) attr[key] = val;
    }
    return attr;
  };

  useEffect(() => {
    if (activeChallengeId) {
      setStep('OTP');
    } else {
      setStep('PHONE');
    }
  }, [activeChallengeId, isModalOpen]);

  if (!isModalOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10 || !['6', '7', '8', '9'].includes(cleanPhone[0])) {
      return;
    }
    const ok = await requestOtp(cleanPhone, getAttribution());
    if (ok) {
      setStep('OTP');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    await verifyOtp(
      cleanPhone,
      otp,
      { first_name: firstName, last_name: lastName },
      getAttribution()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Customer Access</h3>
                <p className="text-[11px] text-emerald-200">First-Party Passwordless Authentication</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && !error && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 'PHONE' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Mobile Number (India)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="customer-mobile-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className="w-full pl-13 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                  <Smartphone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500">
                  We'll send an authoritative 6-digit one-time code to verify your identity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    First Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aravind"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Last Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.replace(/\D/g, '').length !== 10}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Requesting Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="customer-otp-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full tracking-widest text-center px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all placeholder:text-slate-300"
                  />
                  <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Code valid for 5 minutes</span>
                  {cooldownRemaining > 0 ? (
                    <span className="text-amber-700 font-medium">Resend in {cooldownRemaining}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => requestOtp(phone.replace(/\D/g, '').slice(-10), getAttribution())}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Security Footnote */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Secured by Yuvaparipalan Foundation Identity Protocol. Zero mock telemetry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
