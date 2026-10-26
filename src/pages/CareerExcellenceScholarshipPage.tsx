import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SEOHead } from '../components/common/SEOHead';
import { FadeIn } from '../components/motion/FadeIn';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PhoneInput } from '../components/ui/PhoneInput';
import { DistrictAutocomplete } from '../components/ui/DistrictAutocomplete';
import { sendSubmissionEmail } from '../services/emailService';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Compass,
  GraduationCap,
  BrainCircuit,
  Languages,
  BookOpen,
  Brain,
  ShieldCheck,
  Award,
  ChevronDown,
  X,
  AlertCircle,
  Loader2,
  Lock,
  Building2,
  Smartphone,
  Check,
  FileCheck,
  Target,
  Sparkle,
  Download
} from 'lucide-react';
import {
  createPaymentOrder,
  verifyPayment,
  recordPaymentFailure,
  loadRazorpayScript,
  CreateOrderResponse,
  VerifyPaymentResponse
} from '../services/paymentService';
import {
  resolveProgramByCode,
  PublicProgram,
  ProgramResolutionError
} from '../services/programResolutionService';
import { useCustomerAuthStore } from '../stores/useCustomerAuthStore';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'FORM' | 'CREATING_ORDER' | 'PAYMENT' | 'VERIFYING' | 'SUCCESS';

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('');
  const [educationLevel, setEducationLevel] = useState('Higher Secondary (+2)');
  const [institution, setInstitution] = useState('');
  const [notes, setNotes] = useState('');

  const [modalStep, setModalStep] = useState<ModalStep>('FORM');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<CreateOrderResponse | null>(null);
  const [fulfillment, setFulfillment] = useState<VerifyPaymentResponse | null>(null);

  // Dynamic Authoritative Program Resolution State
  const [resolvedProgram, setResolvedProgram] = useState<PublicProgram | null>(null);
  const [isResolvingProgram, setIsResolvingProgram] = useState<boolean>(true);
  const [programResolutionError, setProgramResolutionError] = useState<string | null>(null);

  // Razorpay Payment Instruments & Modes State
  const [paymentCategory, setPaymentCategory] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiMode, setUpiMode] = useState<'app' | 'id' | 'qr'>('app');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM UPI'>('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { userAccountId } = useCustomerAuthStore();

  // Authoritatively Resolve CESP100 on Modal Open
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setIsResolvingProgram(true);
      setProgramResolutionError(null);
      resolveProgramByCode('CESP100', {
        fallbackSlugs: ['career-excellence-scholarship-program', 'career-excellence-scholarship', 'cesp100']
      })
        .then((program) => {
          if (isMounted) {
            setResolvedProgram(program);
            setIsResolvingProgram(false);
          }
        })
        .catch((err: any) => {
          if (isMounted) {
            console.warn('[CareerExcellenceScholarshipPage] Program resolution note:', err);
            const msg = err instanceof ProgramResolutionError && err.code === 'PROGRAM_UNPUBLISHED'
              ? 'Admissions for this program are currently pending publication.'
              : 'Admissions for the upcoming Career Excellence & Scholarship Program (CESP100) cohort are currently being scheduled by the Academic Advisory Board.';
            setProgramResolutionError(msg);
            setIsResolvingProgram(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!trimmedPhone || !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(trimmedPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!district.trim()) {
      setErrorMsg('Please select your district.');
      return;
    }

    if (!resolvedProgram || !resolvedProgram.id) {
      setErrorMsg(
        programResolutionError ||
        'Admissions for the upcoming CESP100 cohort are currently being scheduled. Public online fee checkout is not open.'
      );
      return;
    }

    setModalStep('CREATING_ORDER');

    // 1. Authoritative Server-Side Order Creation (Zero Mock Orders Allowed)
    try {
      const order = await createPaymentOrder(
        resolvedProgram.id,
        userAccountId,
        {
          customer_phone: trimmedPhone,
          customer_name: trimmedName,
          customer_email: trimmedEmail,
          notes: {
            program_code: resolvedProgram.program_code,
            program_name: resolvedProgram.name,
            state,
            district,
            education_level: educationLevel,
            institution: institution.trim() || 'Not specified',
          }
        }
      );

      setCreatedOrder(order);

      // 2. Attempt official Razorpay Checkout SDK Modal Launch
      const scriptLoaded = await loadRazorpayScript();
      const hasLiveKey = Boolean(order.key_id && !order.key_id.includes('mock') && !order.key_id.includes('test_cesp'));

      if (scriptLoaded && (window as any).Razorpay && hasLiveKey) {
        setModalStep('PAYMENT');
        const options = {
          key: order.key_id,
          amount: order.amount_paise,
          currency: order.currency || 'INR',
          name: 'Yuvaparipalan Foundation',
          description: 'Career Excellence & Scholarship Program (₹549)',
          order_id: order.gateway_order_id,
          prefill: {
            name: trimmedName,
            email: trimmedEmail,
            contact: trimmedPhone,
          },
          theme: {
            color: '#064e3b',
          },
          handler: async (response: any) => {
            setModalStep('VERIFYING');
            try {
              const verifyRes = await verifyPayment(
                {
                  order_id: order.id,
                  razorpay_order_id: response.razorpay_order_id || order.gateway_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  payment_method: 'razorpay_checkout',
                  user_account_id: order.user_account_id || userAccountId || undefined,
                },
                order.user_account_id || userAccountId
              );

              setFulfillment(verifyRes);
              setModalStep('SUCCESS');
              confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

              // Dispatch official Tax Invoice & Payment Confirmation Email
              sendSubmissionEmail({
                formType: 'cesp_payment_confirmed',
                formData: {
                  fullName: trimmedName,
                  email: trimmedEmail,
                  phone: trimmedPhone,
                  state,
                  district,
                  educationLevel,
                  institution: institution.trim() || 'General Enrollment',
                  notes: notes.trim() || 'Direct Online Enrollment',
                  program: 'Career Excellence & Scholarship Program (CESP100)',
                  orderCode: verifyRes?.order_code || order?.order_code || order?.id,
                  gatewayOrderId: order?.gateway_order_id,
                  paymentId: response.razorpay_payment_id || verifyRes?.gateway_payment_id,
                  amountPaid: '₹549.00',
                  paymentMethod: 'Razorpay Enterprise Gateway',
                  transactionDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' }),
                }
              }).catch((e) => console.warn('Payment email notice:', e));
            } catch (vErr: any) {
              const errMsg = vErr.message || 'Payment verification failed.';
              setErrorMsg(errMsg);
              setModalStep('PAYMENT');
              recordPaymentFailure(
                {
                  order_id: order.id,
                  gateway_order_id: response.razorpay_order_id || order.gateway_order_id,
                  gateway_payment_id: response.razorpay_payment_id,
                  error_code: 'VERIFICATION_FAILED',
                  error_description: errMsg,
                  payment_method: 'razorpay_checkout',
                  user_account_id: order.user_account_id || userAccountId || undefined,
                },
                order.user_account_id || userAccountId
              ).catch((e) => console.warn('Failed to record failure:', e));
            }
          },
          modal: {
            ondismiss: () => {
              setModalStep('PAYMENT');
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', async (failResp: any) => {
          const errData = failResp?.error || {};
          const failDesc = errData.description || 'Gateway declined transaction.';
          setErrorMsg(failDesc);
          setModalStep('PAYMENT');

          try {
            await recordPaymentFailure(
              {
                order_id: order.id,
                gateway_order_id: errData.metadata?.order_id || order.gateway_order_id,
                gateway_payment_id: errData.metadata?.payment_id,
                error_code: errData.code,
                error_description: failDesc,
                error_source: errData.source,
                error_step: errData.step,
                error_reason: errData.reason,
                payment_method: 'razorpay_checkout',
                metadata: {
                  program: 'CESP100',
                  fullName: trimmedName,
                },
                user_account_id: order.user_account_id || userAccountId || undefined,
              },
              order.user_account_id || userAccountId
            );
          } catch (failLogErr) {
            console.warn('Failed to record Razorpay failure:', failLogErr);
          }
        });
        rzp.open();
      } else {
        // Direct Checkout Payment Instrument Selector
        setModalStep('PAYMENT');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'Failed to initialize payment gateway order.');
      setModalStep('FORM');
    }
  };

  const getSelectedInstrumentLabel = () => {
    if (paymentCategory === 'upi') {
      if (upiMode === 'app') return `UPI (${selectedUpiApp})`;
      if (upiMode === 'id') return `UPI ID (${upiId.trim() || 'Direct VPA'})`;
      return 'UPI (Dynamic QR Code)';
    }
    if (paymentCategory === 'card') {
      const cleanDigits = cardNumber.replace(/\s+/g, '');
      const last4 = cleanDigits.slice(-4) || '6789';
      return `Card (•••• ${last4})`;
    }
    if (paymentCategory === 'netbanking') {
      return `Netbanking (${selectedBank})`;
    }
    return `Wallet (${selectedWallet})`;
  };

  const handleExecutePayment = async () => {
    if (!createdOrder) return;

    // Disallow simulated test payments in production
    if (!import.meta.env.DEV) {
      setErrorMsg('Direct payment simulation is disabled in production. Please use the official Razorpay checkout.');
      return;
    }

    setIsProcessingPayment(true);
    setModalStep('VERIFYING');
    setErrorMsg(null);

    const instrumentLabel = getSelectedInstrumentLabel();
    const simPaymentId = `pay_cesp_${Date.now()}`;

    try {
      const verifyRes = await verifyPayment(
        {
          order_id: createdOrder.id,
          razorpay_order_id: createdOrder.gateway_order_id,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: 'simulated_test_mode_valid_signature',
          payment_method: paymentCategory,
          user_account_id: createdOrder.user_account_id || userAccountId || undefined,
        },
        createdOrder.user_account_id || userAccountId
      );

      setFulfillment(verifyRes);
      setModalStep('SUCCESS');
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

      // Dispatch official Tax Invoice & Payment Confirmation Email with tax breakdown
      sendSubmissionEmail({
        formType: 'cesp_payment_confirmed',
        formData: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          state,
          district,
          educationLevel,
          institution: institution.trim() || 'General Enrollment',
          notes: notes.trim() || 'Direct Online Enrollment',
          program: 'Career Excellence & Scholarship Program (CESP100)',
          orderCode: verifyRes?.order_code || createdOrder?.order_code || createdOrder?.id,
          gatewayOrderId: createdOrder?.gateway_order_id,
          paymentId: simPaymentId,
          amountPaid: '₹549.00',
          paymentMethod: `${instrumentLabel} via Razorpay Gateway`,
          transactionDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' }),
        }
      }).catch((e) => console.warn('Payment email notice:', e));
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
      setModalStep('PAYMENT');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleResetAndClose = () => {
    setModalStep('FORM');
    setErrorMsg(null);
    setCreatedOrder(null);
    setFulfillment(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setDistrict('');
    setInstitution('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-emerald-900/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close registration modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: FORM (Candidate Details) */}
        {modalStep === 'FORM' && (
          <div>
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="emerald">{resolvedProgram?.program_code || 'CESP100'}</Badge>
                <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {resolvedProgram?.commercials?.subscription_price
                    ? `₹${resolvedProgram.commercials.subscription_price.toLocaleString('en-IN')} Inclusive of Tax`
                    : '₹549 Inclusive of Tax'}
                </span>
                {isResolvingProgram && (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                    Checking admissions status...
                  </span>
                )}
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                {resolvedProgram?.name || 'Enroll in Career Excellence & Scholarship Program'}
              </h3>
              <p className="text-xs text-slate-600">
                Complete your enrollment to activate the Eduzet Aptitude Assessment, 180-day Palana Neurosync Vikas subscription, AI workshops, and mentorship.
              </p>
            </div>

            {programResolutionError && (
              <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Admissions Scheduling Announcement</span>
                </div>
                <p>
                  {programResolutionError}
                </p>
                <p className="text-[11px] text-amber-700">
                  To register for priority batch allocation, please reach out to our academic counsellors at{' '}
                  <a href="mailto:admissions@yuvaparipalan.org" className="underline font-bold text-emerald-800">
                    admissions@yuvaparipalan.org
                  </a>.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Nair"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Education / Stream *
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700 bg-white"
                  >
                    <option value="Class 10 (SSLC/CBSE/ICSE)">Class 10 (SSLC / CBSE / ICSE)</option>
                    <option value="Higher Secondary (+1 / +2)">Higher Secondary (+1 / +2)</option>
                    <option value="Polytechnic / Diploma">Polytechnic / Diploma</option>
                    <option value="Undergraduate (BA/BSc/BCom/BTech)">Undergraduate (Degree / B.Tech)</option>
                    <option value="Postgraduate / Competitive Aspirant">Postgraduate / Competitive Aspirant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    District *
                  </label>
                  <DistrictAutocomplete
                    value={district}
                    onChange={(d) => {
                      setDistrict(d);
                      if (['Coimbatore', 'Chennai', 'Madurai', 'Salem'].includes(d)) setState('Tamil Nadu');
                      else if (['Bengaluru Urban', 'Dakshina Kannada', 'Mysuru'].includes(d)) setState('Karnataka');
                      else setState('Kerala');
                    }}
                    placeholder="Select your district..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    School / College / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Govt Model HSS, Kozhikode"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Order Summary Preview Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-slate-700 space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-900 text-sm">
                  <span>CESP100 Subsidized Enrollment:</span>
                  <span className="font-mono text-emerald-900 font-black text-base">₹549.00</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Includes all 7 canonical offerings & learning licenses</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">All-Inclusive</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAndClose}
                  className="px-5 text-xs text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!resolvedProgram}
                  className="px-7 bg-[#15803d] hover:bg-[#166534] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>
                    {isResolvingProgram
                      ? 'Checking Admissions Status...'
                      : !resolvedProgram
                      ? 'Admissions Scheduling in Progress'
                      : 'Proceed to Payment (₹549)'}
                  </span>
                  {resolvedProgram && <ArrowRight className="w-4 h-4 text-emerald-100" />}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: CREATING ORDER STATE */}
        {modalStep === 'CREATING_ORDER' && (
          <div className="py-16 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-800 mx-auto" />
            <h4 className="font-heading font-extrabold text-xl text-slate-900">
              Initializing Razorpay Gateway...
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Generating your secure order token and academic registration ledger record.
            </p>
          </div>
        )}

        {/* STEP 3: PAYMENT INSTRUMENT SELECTION */}
        {modalStep === 'PAYMENT' && createdOrder && (
          <div>
            <div className="mb-5 space-y-1">
              <div className="flex items-center justify-between">
                <Badge variant="emerald">Step 2 of 2: Secure Payment</Badge>
                <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Order Code: {createdOrder.order_code || createdOrder.id}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Complete Enrollment Fee
              </h3>
              <p className="text-xs text-slate-600">
                Choose your preferred payment method to complete the ₹549 enrollment fee via Razorpay.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              {/* Left Column: Instrument Categories */}
              <div className="sm:col-span-4 space-y-1.5 border-r border-slate-200 pr-0 sm:pr-4">
                {[
                  { id: 'upi', label: 'UPI (GPay / PhonePe)', icon: Smartphone },
                  { id: 'card', label: 'Credit / Debit Card', icon: Award },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  { id: 'wallet', label: 'Wallets', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = paymentCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentCategory(item.id as any)}
                      className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Subsidized Fee Summary */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mt-4 text-[11px] space-y-1 text-slate-700">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Total Payable:</span>
                    <span className="font-mono text-emerald-900 font-bold">₹549.00</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    All-inclusive (all 7 offerings included)
                  </div>
                </div>
              </div>

              {/* Right Column: Active Category Details */}
              <div className="sm:col-span-8 flex flex-col justify-between space-y-4">
                {/* Category 1: UPI Options */}
                {paymentCategory === 'upi' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                      {[
                        { id: 'app', label: 'UPI Apps' },
                        { id: 'id', label: 'Enter UPI ID' },
                        { id: 'qr', label: 'Scan QR' },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setUpiMode(sub.id as any)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            upiMode === sub.id
                              ? 'bg-white text-emerald-950 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    {upiMode === 'app' && (
                      <div className="grid grid-cols-2 gap-2">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setSelectedUpiApp(app as any)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                              selectedUpiApp === app
                                ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-800'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span>{app}</span>
                            {selectedUpiApp === app && <Check className="w-4 h-4 text-emerald-800 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}

                    {upiMode === 'id' && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 block">Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          placeholder="yourname@okaxis or mobile@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-800"
                        />
                        <span className="text-[10px] text-slate-500">Collect request will be sent to your UPI app.</span>
                      </div>
                    )}

                    {upiMode === 'qr' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                          <div className="text-center">
                            <Sparkle className="w-8 h-8 text-emerald-800 mx-auto" />
                            <span className="text-[9px] font-mono font-bold text-slate-700 block mt-1">UPI QR CODE</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">Scan with any UPI app to pay ₹549 instantly</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Category 2: Card Options */}
                {paymentCategory === 'card' && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8901 2345 6789"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-800 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-800 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Full Name as on card"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>
                )}

                {/* Category 3: Net Banking Options */}
                {paymentCategory === 'netbanking' && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <span className="text-[11px] font-bold text-slate-700 block">Popular Banks</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Federal Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                            selectedBank === bank
                              ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-800'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{bank}</span>
                          {selectedBank === bank && <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0" />}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1">
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-800 bg-white"
                      >
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Federal Bank">Federal Bank</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="South Indian Bank">South Indian Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Category 4: Wallets Options */}
                {paymentCategory === 'wallet' && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <span className="text-[11px] font-bold text-slate-700 block">Select Wallet Provider</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'MobiKwik'].map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          onClick={() => setSelectedWallet(wallet)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                            selectedWallet === wallet
                              ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-800'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{wallet}</span>
                          {selectedWallet === wallet && <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <Button
                    variant="primary"
                    onClick={handleExecutePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3 text-sm font-bold bg-[#15803d] hover:bg-[#166534] shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing via Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ₹549 via {getSelectedInstrumentLabel()}</span>
                      </>
                    )}
                  </Button>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> 256-bit SSL • PCI-DSS Level 1
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalStep('FORM')}
                      className="text-slate-600 hover:text-slate-900 underline"
                    >
                      ← Edit Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS (Enrollment Confirmed) */}
        {modalStep === 'SUCCESS' && (
          <div className="py-6 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>

            <div className="space-y-2">
              <Badge variant="emerald">Official Enrollment Confirmed</Badge>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                Welcome to CESP100, {fullName}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your ₹549 enrollment fee payment has been confirmed. Your seat in the Career Excellence & Scholarship Program is officially registered.
              </p>
            </div>

            {/* Verified Transaction Summary */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-left text-xs font-mono space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-bold text-slate-900">{fulfillment?.order_code || createdOrder?.order_code || createdOrder?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment ID:</span>
                <span className="font-bold text-slate-900">{fulfillment?.gateway_payment_id || 'PAY-VERIFIED'}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-1.5 mt-1.5 text-emerald-950 font-bold">
                <span>Amount Paid (Tax Inclusive):</span>
                <span>₹549.00 (INR)</span>
              </div>
            </div>

            {/* Activated Inclusions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Activated Inclusions & Next Steps:
              </div>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Eduzet Aptitude Assessment:</strong> Diagnostic login credentials will be dispatched to your email and SMS.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Palana Neurosync Vikas:</strong> 180-day cognitive development subscription enabled.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>AI Basics & Language Modules:</strong> Live workshop schedules will be shared via WhatsApp.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official Tax Invoice & Receipt dispatched to <strong>{email}</strong>.</span>
                </li>
              </ul>
            </div>

            <Button variant="primary" onClick={handleResetAndClose} className="w-full py-3 bg-[#15803d] hover:bg-[#166534]">
              Done & Return to Overview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Authoritative Program Brochure URL in Supabase Storage
const CESP_BROCHURE_URL = 'https://aoantugfwudmnddalcln.supabase.co/storage/v1/object/public/program-media/programs/0d2e6429-4b1f-4f7a-9d6c-a38c8a6af671/d7180ba6-a22d-4330-85d1-8dfa9e321277/brochures/815e6ede-f087-4f81-bb94-e350653a5bcf.jpg';

// 7 Canonical Offerings Reconciled against Authoritative Program Records
const PROGRAM_MODULES = [
  {
    id: 'eduzet-test',
    number: '01',
    title: 'Eduzet Aptitude Test',
    badge: 'Core Diagnostic',
    icon: GraduationCap,
    description: 'A scientifically calibrated diagnostic assessment evaluating numerical reasoning, logical deduction, spatial reasoning, verbal comprehension, and cognitive aptitude.',
    benefit: 'Establishes candidate benchmark and unlocks eligibility for merit scholarship grants up to ₹20 Crore fund.',
    scope: 'Diagnostic Assessment & Personalized Report',
    color: 'emerald',
  },
  {
    id: 'neurosync-vikas',
    number: '02',
    title: 'Palana NeuroSync Vikas',
    badge: 'Cognitive Development',
    icon: Brain,
    description: 'Scientifically designed cognitive development and focus optimization exercises developed in synergy with leading neurosurgeons, improving memory retention and mental stamina.',
    benefit: '180-day subscription license to digital cognitive modules designed to cultivate deep concentration and exam readiness.',
    scope: '180 Days Subscription Access',
    color: 'rose',
  },
  {
    id: 'communicative-english',
    number: '03',
    title: 'Communicative English Training',
    badge: 'Language & Articulation',
    icon: Languages,
    description: 'Interactive language fluency training addressing common conversational hesitation, pronunciation, vocabulary enrichment, active listening, and workplace interview readiness.',
    benefit: 'Develops natural, confident spoken articulation for competitive interviews and professional presentations.',
    scope: 'Interactive Practical Sessions',
    color: 'blue',
  },
  {
    id: 'nalla-malayalam',
    number: '04',
    title: 'Nalla Malayalam Language Training',
    badge: 'Vernacular Excellence',
    icon: BookOpen,
    description: 'Deepening linguistic command, literary sensitivity, formal prose writing, and oratorical grace in Malayalam, nurturing cultural grounding alongside modern ambition.',
    benefit: 'Mastery in mother-tongue articulation essential for regional public service, journalism, and expressive clarity.',
    scope: 'Vernacular Prose & Expression',
    color: 'amber',
  },
  {
    id: 'ai-basics',
    number: '05',
    title: 'AI Basic Workshop',
    badge: 'Future Tech Literacy',
    icon: BrainCircuit,
    description: 'Practical orientation covering generative AI fundamentals, prompt engineering essentials, no-code productivity tools, data safety, and responsible digital citizenship.',
    benefit: 'Demystifies artificial intelligence and equips students with immediate academic and productivity advantages.',
    scope: 'Hands-on Interactive Workshop',
    color: 'purple',
  },
  {
    id: 'career-mentorship',
    number: '06',
    title: 'Career Guidance & Mentorship',
    badge: '1-on-1 Guidance',
    icon: Compass,
    description: 'Structured one-on-one and cohort sessions with IAS officers, university academicians, corporate executives, and domain leaders providing actionable academic roadmaps.',
    benefit: 'Replaces confusing academic choices with verified career roadmaps aligned with candidate aptitude test scores.',
    scope: 'Continuous 6-Month Mentorship',
    color: 'teal',
  },
  {
    id: 'scholarship-excellence',
    number: '07',
    title: 'Scholarship for Career Excellence',
    badge: 'Merit Grant Pathway',
    icon: Award,
    description: 'A statewide merit-based funding framework backed by Yuvaparipalan Foundation with an allocation pool targeting up to ₹20 Crore across 7,000 eligible candidates.',
    benefit: 'Merit-evaluated grant funding to offset academic fees and support higher educational aspirations.',
    scope: 'Statewide Merit Selection Pathway',
    color: 'amber',
  },
];

// 5-Step Participant Journey Data
const PARTICIPANT_JOURNEY = [
  {
    step: '01',
    title: 'Discover & Review',
    description: 'Review the program architecture, module deliverables, transparent fee breakdown, and eligibility guidelines.',
  },
  {
    step: '02',
    title: 'Register & Enroll',
    description: 'Complete basic student details and remit the subsidized enrollment fee of ₹549 (inclusive of GST).',
  },
  {
    step: '03',
    title: 'Take Eduzet Assessment',
    description: 'Complete the diagnostic Eduzet Aptitude & Personality Assessment test through secure online credentials.',
  },
  {
    step: '04',
    title: 'Attend Modules & Train',
    description: 'Engage in Communicative English, Nalla Malayalam, AI Basics workshop, and activate 180-day Neurosync Vikas.',
  },
  {
    step: '05',
    title: 'Mentorship & Scholarship',
    description: 'Receive personalized career roadmap counseling and merit scholarship allocation evaluation outcomes.',
  },
];

// Frequently Asked Questions
const FAQS = [
  {
    q: 'Who is eligible to enroll in the Career Excellence & Scholarship Program?',
    a: 'The program is designed for students across high school (Class 10), higher secondary (+1 and +2), polytechnic/diploma, undergraduate degree programs, and recent graduates preparing for competitive careers or higher education.',
  },
  {
    q: 'What is included in the ₹549 registration fee?',
    a: 'The ₹549 fee is an all-inclusive subsidized enrollment fee covering all 7 canonical offerings: the Eduzet Aptitude Assessment, 180-day Palana NeuroSync Vikas access, Communicative English and Nalla Malayalam modules, AI Basic Workshop, one-on-one career mentorship, and the official Foundation certificate. An official tax invoice is emailed automatically upon registration.',
  },
  {
    q: 'How does the scholarship initiative work?',
    a: 'The scholarship initiative is a statewide merit-based funding framework backed by Yuvaparipalan Foundation with an allocation pool targeting up to ₹20 Crore across eligible candidates. Candidates who demonstrate academic potential and merit on the Eduzet Assessment are evaluated for direct scholarship grants.',
  },
  {
    q: 'Is the ₹549 fee a scholarship fee or a program fee?',
    a: 'The ₹549 is a subsidized participant fee that covers program administration, assessment licensing, and digital learning subscriptions. Scholarship grants, when awarded to meritorious candidates, are separate financial awards provided to support higher education.',
  },
  {
    q: 'What is the learning mode and duration?',
    a: 'The program is conducted 100% online over a 6-month period, featuring self-paced digital cognitive exercises, live interactive weekend workshops, and scheduled mentorship slots.',
  },
  {
    q: 'What is Palana Neurosync Vikas?',
    a: 'Palana Neurosync Vikas is an evidence-based cognitive training software developed in consultation with neurosurgeons and psychologists to improve student concentration, memory recall, and stress resilience during exams.',
  },
  {
    q: 'Will participants receive a certificate?',
    a: 'Yes. Upon completion of the required modules and the Eduzet assessment, participants receive an official Certificate of Program Completion issued by Yuvaparipalan Foundation.',
  },
  {
    q: 'How do I access the assessment after paying?',
    a: 'Immediately upon successful payment, your transaction receipt and tax invoice are emailed to you. Your Eduzet assessment login credentials and workshop joining links are sent via email and SMS within 24 hours.',
  },
];

export const CareerExcellenceScholarshipPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const scholarshipSectionRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress: scholarshipScrollY } = useScroll({
    target: scholarshipSectionRef,
    offset: ['start end', 'end start'],
  });

  const scholarshipBgY = useTransform(scholarshipScrollY, [0, 1], ['-10%', '10%']);
  const scholarshipBgScale = useTransform(scholarshipScrollY, [0, 0.5, 1], [1.04, 1.12, 1.04]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const scrollToCurriculum = () => {
    const el = document.getElementById('curriculum-modules');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cespStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.yuvaparipalan.org"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Programs",
          "item": "https://www.yuvaparipalan.org/programs"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Career Excellence & Scholarship Program",
          "item": "https://www.yuvaparipalan.org/programs/career-excellence-scholarship-program"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Career Excellence & Scholarship Program",
      "description": "Build essential skills, discover your strengths and prepare for future opportunities through a structured journey in aptitude assessment, cognitive development, communication, AI awareness and career mentorship.",
      "provider": {
        "@type": "Organization",
        "name": "Yuvaparipalan Foundation",
        "sameAs": "https://www.yuvaparipalan.org"
      },
      "courseCode": "CESP100",
      "educationalCredentialAwarded": "Certificate of Program Completion",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": "P6M"
      },
      "offers": {
        "@type": "Offer",
        "category": "Subsidized Education",
        "price": "549.00",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.yuvaparipalan.org/programs/career-excellence-scholarship-program"
      }
    }
  ];

  return (
    <>
      <SEOHead
        title="Career Excellence & Scholarship Program | Yuvaparipalan Foundation"
        description="Discover Yuvaparipalan's Career Excellence & Scholarship Program, featuring aptitude assessment, skill development, AI learning and career mentorship."
        canonicalUrl="https://www.yuvaparipalan.org/programs/career-excellence-scholarship-program"
        structuredData={cespStructuredData}
      />

      <div className="bg-[#fafaf7] text-slate-900 overflow-hidden">
        {/* ================================================== */}
        {/* 1. HERO SECTION                                     */}
        {/* Outcome-Led, Clean Editorial Architecture           */}
        {/* ================================================== */}
        <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 lg:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-[#fafaf7] to-[#fafaf7]">
          {/* Ambient Lighting */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent pointer-events-none" />
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-emerald-200/20 blur-[100px] pointer-events-none" />
          <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-amber-100/30 blur-[90px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <FadeIn direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-950 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                <span>Yuvaparipalan Foundation • Program Code: CESP100</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.12] max-w-5xl mx-auto">
                <span className="block text-slate-950">Your Future. Your Potential.</span>
                <span className="block text-gradient">Your Opportunity.</span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-700 font-medium leading-relaxed">
                Build essential skills, discover your strengths and prepare for future opportunities through a structured journey in aptitude assessment, cognitive development, communication, AI awareness and career mentorship.
              </p>
            </FadeIn>

            {/* Program Highlights Pill Row */}
            <FadeIn direction="up" delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  Eduzet Aptitude Assessment
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  180 Days Palana NeuroSync Vikas
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  AI Basic Workshop & Mentorship
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 shadow-xs">
                  <Award className="w-4 h-4 text-amber-700 shrink-0" />
                  ₹20 Crore Scholarship Pathway
                </span>
              </div>
            </FadeIn>

            {/* Hero CTAs */}
            <FadeIn direction="up" delay={0.25}>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  id="hero-register-cesp-btn"
                  onClick={openModal}
                  className="w-full sm:w-auto h-[54px] bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-sm sm:text-base px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <Sparkles className="w-5 h-5 text-emerald-100" />
                  <span>Enroll in Program — ₹549</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={scrollToCurriculum}
                  className="w-full sm:w-auto h-[54px] bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base px-6 rounded-2xl border border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Explore 7 Canonical Offerings</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                <a
                  href={CESP_BROCHURE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-[54px] bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 font-bold text-xs sm:text-sm px-5 rounded-2xl border border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-800" />
                  <span>Brochure</span>
                </a>
              </div>
            </FadeIn>

            {/* Hero Product/Student Visual */}
            <FadeIn direction="up" delay={0.3}>
              <div className="pt-8 sm:pt-12 max-w-5xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-900/15 shadow-2xl bg-white aspect-[16/9]">
                  <img
                    src="/images/career_excellence_hero.jpg"
                    alt="Indian college and higher secondary students collaborating in an innovation lab for career excellence and scholarships"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-10 text-left">
                    <div className="text-white space-y-1.5 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-mono font-bold tracking-wide backdrop-blur-md">
                        <Target className="w-3.5 h-3.5" />
                        Statewide Student Enablement
                      </div>
                      <h3 className="font-heading font-black text-xl sm:text-3xl text-white">
                        Structured Mentorship for Modern Aspirations
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium hidden sm:block">
                        Bridging classroom education with aptitude diagnostic tests, cognitive focus training, bilingual fluency, and one-on-one career roadmaps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Trust & Credibility Strip (Section 5.B) */}
            <FadeIn direction="up" delay={0.35}>
              <div className="pt-6 max-w-5xl mx-auto">
                <div className="p-6 rounded-3xl bg-white border border-emerald-900/10 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  <div className="p-2 space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-heading">₹20 Crore</div>
                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">Scholarship Pool</div>
                    <p className="text-[11px] text-slate-500 font-medium">Statewide Merit Fund</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-heading">7,000</div>
                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">Beneficiaries</div>
                    <p className="text-[11px] text-slate-500 font-medium">Evaluated Candidates</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-heading">7 Offerings</div>
                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">Curriculum</div>
                    <p className="text-[11px] text-slate-500 font-medium">100% Inclusions Verified</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 font-heading">6 Months</div>
                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">Duration</div>
                    <p className="text-[11px] text-slate-500 font-medium">180 Days Guided Journey</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 2. PROGRAM INTRODUCTION & FOCUS PILLARS             */}
        {/* Clarity, Scope, Audience & Challenges Addressed     */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-white border-t border-emerald-900/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                  Program Architecture
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
                  Who It Serves & What It Solves
                </h2>
                <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed">
                  Too many talented students make crucial career choices based on guesswork, peer pressure, or fear of language and technology. CESP100 replaces uncertainty with scientific evaluation, cognitive readiness, and career mentorship.
                </p>
              </div>
            </FadeIn>

            {/* 4 Strategic Focus Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Cognitive Aptitude',
                  subtitle: 'Scientific Diagnostic Evaluation',
                  desc: 'Objective psychometric testing measuring reasoning, numerical agility, and analytical strengths.',
                  icon: BrainCircuit,
                },
                {
                  title: 'Bilingual Fluency',
                  subtitle: 'English & Malayalam Articulation',
                  desc: 'Developing conversational confidence in English while respecting mother-tongue eloquence in Malayalam.',
                  icon: Languages,
                },
                {
                  title: 'AI Literacy',
                  subtitle: 'Demystifying Future Technologies',
                  desc: 'Hands-on practical exposure to prompt design, research tools, and productivity applications.',
                  icon: Sparkles,
                },
                {
                  title: 'Direct Mentorship',
                  subtitle: 'Real Career Direction',
                  desc: 'Personalized stream selection and higher education roadmaps guided by domain professionals.',
                  icon: Compass,
                },
              ].map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <FadeIn key={pillar.title} direction="up" delay={idx * 0.08}>
                    <div className="p-6 rounded-2xl bg-[#fafaf7] border border-slate-200 hover:border-emerald-700/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 shadow-xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                          {pillar.title}
                        </h3>
                        <div className="text-xs font-mono font-bold text-emerald-900 tracking-wide">
                          {pillar.subtitle}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 3. 7 CANONICAL PROGRAM OFFERINGS                    */}
        {/* Full Curriculum Breakdown & Benefits                */}
        {/* ================================================== */}
        <section id="curriculum-modules" className="py-20 sm:py-28 bg-[#fafaf7] border-t border-emerald-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-900 uppercase bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-300">
                  Comprehensive 6-Month Curriculum
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  7 Canonical Offerings
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  Every participant receives complete access to all seven integrated components without recurring or hidden costs.
                </p>
              </div>
            </FadeIn>

            {/* 6 Responsive Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROGRAM_MODULES.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <FadeIn key={mod.id} direction="up" delay={idx * 0.06}>
                    <div className="p-7 rounded-3xl bg-white border border-emerald-900/15 hover:border-emerald-700/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between space-y-5 relative overflow-hidden group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 group-hover:scale-105 transition-transform">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-mono font-extrabold text-slate-400">
                            {mod.number}
                          </span>
                        </div>

                        <div>
                          <Badge variant="emerald">{mod.badge}</Badge>
                          <h3 className="font-heading font-extrabold text-xl text-slate-950 mt-2 leading-snug">
                            {mod.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {mod.description}
                        </p>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                            Direct Participant Benefit
                          </div>
                          <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                            {mod.benefit}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {mod.scope}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 4. SCHOLARSHIP INITIATIVE & ₹20 CRORE PATHWAY       */}
        {/* Reconciled, Realistic, Governed Selection Rules     */}
        {/* ================================================== */}
        <section
          ref={scholarshipSectionRef}
          className="relative py-24 sm:py-32 text-white overflow-hidden bg-slate-900"
        >
          {/* Parallax Background */}
          <motion.div
            style={{ y: scholarshipBgY, scale: scholarshipBgScale }}
            className="absolute -inset-y-28 inset-x-0 h-[140%] w-full pointer-events-none z-0"
          >
            <img
              src="/images/scholarship_mentorship.jpg"
              alt="Indian student receiving academic scholarship guidance and recognition"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
          </motion.div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
            <FadeIn direction="up">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-200 uppercase bg-slate-950/80 px-4 py-1.5 rounded-full border border-emerald-400/40 shadow-lg backdrop-blur-md">
                Authoritative Scholarship Mandate
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                ₹20 Crore Statewide Scholarship Initiative
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                <div className="p-6 rounded-2xl bg-slate-950/85 border border-white/20 backdrop-blur-md space-y-3 shadow-2xl">
                  <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Allocation Target</div>
                  <h3 className="font-heading font-extrabold text-xl text-white">7,000 Candidates</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    Statewide qualification pool evaluated through the Eduzet diagnostic test, academic track records, and socioeconomic need.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-400/70 backdrop-blur-md space-y-3 shadow-2xl ring-1 ring-emerald-500/40">
                  <div className="text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">Evaluation Authority</div>
                  <h3 className="font-heading font-extrabold text-xl text-white">Merit & Need Based</h3>
                  <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                    Strict, transparent selection criteria. No arbitrary awards or false promises; grants directly offset approved tuition costs.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/85 border border-white/20 backdrop-blur-md space-y-3 shadow-2xl">
                  <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Holistic Support</div>
                  <h3 className="font-heading font-extrabold text-xl text-white">Mentored Journey</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    Scholarship recipients receive sustained mentorship to ensure academic retention, college admissions, and career placement.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <div className="inline-block px-6 py-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/20 shadow-xl max-w-2xl">
                <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
                  <strong>Governance Note:</strong> The ₹549 enrollment fee is a subsidized preparatory program fee. Scholarship allocations are merit-evaluated awards governed strictly by the Foundation’s academic review panel.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 5. 5-STEP PARTICIPANT JOURNEY                       */}
        {/* Clear Operational Workflow                          */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-white border-t border-emerald-900/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                  Operational Workflow
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
                  Your 5-Step Participant Journey
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  A transparent, step-by-step pathway from registration to personalized career direction.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {PARTICIPANT_JOURNEY.map((step, idx) => (
                <FadeIn key={step.step} direction="up" delay={idx * 0.08}>
                  <div className="p-5 rounded-2xl bg-[#fafaf7] border border-slate-200 hover:border-emerald-700/40 hover:shadow-md transition-all h-full flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block">
                        Step {step.step}
                      </span>
                      <h3 className="font-heading font-extrabold text-base text-slate-950 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 6. PROGRAM ENROLLMENT & DELIVERABLES                */}
        {/* Enterprise Experience: Executive Fellowship Showcase*/}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-[#fafaf7] border-t border-emerald-900/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-900 uppercase bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-300">
                  Program Investment & Value
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  Comprehensive 6-Month Fellowship
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  Subsidized through Yuvaparipalan Foundation philanthropic endowments to make elite career preparation universally accessible.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left Column: 6 Core Inclusions & Fellowship Deliverables */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-emerald-900/15 shadow-xl space-y-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-950">
                          Complete Program Inclusions
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Everything provided for all enrolled students across the 180-day program:
                        </p>
                      </div>
                      <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Zero Recurring Costs
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {[
                        {
                          title: 'Eduzet Aptitude Assessment',
                          desc: 'Full diagnostic evaluation measuring numerical, logical, and verbal cognitive faculties.',
                          icon: GraduationCap,
                        },
                        {
                          title: 'Palana NeuroSync Vikas',
                          desc: '180-day digital cognitive development license developed with neurosurgeons.',
                          icon: Brain,
                        },
                        {
                          title: 'Bilingual Fluency Masterclass',
                          desc: 'Practical spoken English articulation & formal Nalla Malayalam expression.',
                          icon: Languages,
                        },
                        {
                          title: 'AI Basics & Prompt Literacy',
                          desc: 'Hands-on training in generative AI tools, digital citizenship, and research.',
                          icon: BrainCircuit,
                        },
                        {
                          title: '1-on-1 Career Mentorship',
                          desc: 'Personalized academic counseling and stream selection with senior leaders.',
                          icon: Compass,
                        },
                        {
                          title: '₹20 Crore Scholarship Pool',
                          desc: 'Priority qualification evaluation for merit-based tuition grant allocation.',
                          icon: Award,
                        },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="p-3.5 rounded-2xl bg-[#fafaf7] border border-slate-200/90 space-y-1.5 hover:border-emerald-700/30 transition-colors">
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="leading-tight">{item.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed pl-9">
                              {item.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3 text-xs text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
                    <span>
                      Includes official <strong>Certificate of Program Completion</strong> issued by Yuvaparipalan Foundation upon module verification.
                    </span>
                  </div>
                </div>

                {/* Right Column: Enterprise Investment / Enrollment Card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-[#0d3422] to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-emerald-700/30 shadow-2xl flex flex-col justify-between space-y-8 relative overflow-hidden">
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-300 uppercase bg-white/10 px-3 py-1 rounded-full border border-white/15">
                        Philanthropic Subsidy
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        180 Days Access
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-slate-300 font-medium">
                        Subsidized Candidate Enrollment Fee:
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading font-black text-4xl sm:text-5xl text-white">
                          ₹549
                        </span>
                        <span className="text-xs text-emerald-300 font-mono font-bold">
                          / one-time
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/80 font-medium pt-1">
                        All-inclusive subsidized fee (Market reference value: ₹25,000)
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-5 space-y-3">
                      <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Enrollment Guarantees:
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-200">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Complete access to all 7 canonical offerings</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Instant digital LMS & test credentials delivery</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Official GST tax invoice emailed automatically</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Direct evaluation for ₹20 Crore merit scholarships</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                    <button
                      onClick={openModal}
                      className="w-full h-[52px] bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <span>Enroll Now — ₹549</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-200/70 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>256-bit SSL encrypted • Instant confirmation</span>
                    </div>
                  </div>
                </div>

              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 7. ELIGIBILITY & PREREQUISITES                      */}
        {/* Clear criteria for parents & students               */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-white border-t border-emerald-900/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                  Candidate Requirements
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  Eligibility Criteria
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  Designed to be accessible, democratic, and inclusive for all motivated learners.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeIn direction="up" delay={0.05}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-slate-200 h-full space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-slate-950">
                    Academic Scope
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Open to students from Class 10 (SSLC, CBSE, ICSE), Higher Secondary (+1, +2), Diploma, Undergraduate college students, and fresh graduates.
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.1}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-slate-200 h-full space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-slate-950">
                    Technical Prerequisites
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Any basic smartphone, tablet, laptop, or desktop computer with standard internet connectivity to access the diagnostic test and live classes.
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.15}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-slate-200 h-full space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-slate-950">
                    Documentation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Basic school/college ID or marks memo to verify candidate details during test evaluation and scholarship allocation.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 8. FREQUENTLY ASKED QUESTIONS                       */}
        {/* Direct Accordion Flow                               */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-[#fafaf7] border-t border-emerald-900/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <FadeIn direction="up">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-900 uppercase bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300">
                  Got Questions?
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 text-sm font-medium">
                  Authoritative answers to common questions about CESP100 and the scholarship mission.
                </p>
              </div>
            </FadeIn>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <FadeIn key={idx} direction="up" delay={idx * 0.04}>
                    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-xs">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-extrabold text-sm sm:text-base text-slate-950 focus:outline-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-800' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                          <p className="pt-3">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 9. FINAL HIGH-CONVERSION CTA SECTION                */}
        {/* Emerald Gradient Banner Matching Changepreneur Style */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-[#f2f8f2] border-t border-emerald-900/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <FadeIn direction="up">
              <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-white border border-emerald-700/40 shadow-2xl space-y-6">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-200 uppercase bg-emerald-800/60 px-4 py-1.5 rounded-full border border-emerald-500/40">
                  Ready to Shape Your Future?
                </span>

                <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Career Excellence & Scholarship Program
                </h2>

                <div className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-heading">
                  ₹549/- All-Inclusive Subsidized Fee
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
                  Join thousands of ambitious students unlocking diagnostic aptitude insights, language fluency, AI literacy, and merit scholarship pathways.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    id="final-register-cesp-btn"
                    onClick={openModal}
                    className="w-full sm:w-auto h-[54px] bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-base px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.03] flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <span>Register for CESP100 (₹549)</span>
                    <ArrowRight className="w-5 h-5 text-slate-950" />
                  </button>

                  <a
                    href={CESP_BROCHURE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-[54px] bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-bold text-sm px-7 rounded-2xl border border-emerald-500/50 shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>Download Official Brochure</span>
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>

      {/* Mobile Sticky CTA Bar (Section 5.L) */}
      {showStickyCta && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-emerald-900/10 p-3 shadow-lg flex items-center justify-between gap-3 animate-fadeIn">
          <div className="text-left">
            <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
              CESP100 • 6 Months
            </div>
            <div className="text-sm font-black text-slate-900 font-heading">
              ₹549 <span className="text-[11px] font-normal text-slate-500">(All-Inclusive)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openModal}
              className="bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Governed Program Application Modal */}
      <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default CareerExcellenceScholarshipPage;
