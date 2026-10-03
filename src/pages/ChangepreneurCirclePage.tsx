import React, { useState, useRef } from 'react';
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
  Users,
  Compass,
  TrendingUp,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  BookOpen,
  Activity,
  Award,
  Briefcase,
  GraduationCap,
  Laptop,
  Tag,
  Brain,
  X,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('');
  const [profession, setProfession] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone || !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!district.trim()) {
      setErrorMsg('Please select your district.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendSubmissionEmail({
        formType: 'changepreneur',
        formData: {
          program: 'Changepreneur Circle',
          membershipTier: 'Annual Membership (₹30,000)',
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          state,
          district,
          profession: profession.trim() || 'Not specified',
          notes: notes.trim() || 'None',
          appliedAt: new Date().toISOString(),
        }
      });
      setIsSubmitted(true);
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } catch {
      setErrorMsg('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setErrorMsg(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setDistrict('');
    setProfession('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-emerald-900/20 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close registration modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <Badge variant="emerald">Application Logged</Badge>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Welcome to Changepreneur Circle!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your membership enrollment request has been captured in the Foundation's governed onboarding registry.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-left text-xs text-slate-700 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                What happens next?
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>A confirmation summary has been dispatched to <strong>{email}</strong>.</li>
                <li>The Secretariat will contact you via WhatsApp/call at <strong>{phone}</strong> with official verification and payment onboarding steps.</li>
                <li>Your student sponsorship allocation & CAERING launch pre-reservation will be initiated.</li>
              </ul>
            </div>
            <Button variant="primary" onClick={handleResetAndClose} className="w-full">
              Done & Return to Overview
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="emerald">Official Membership Flow</Badge>
                <span className="text-xs font-mono font-bold text-amber-800">₹30,000 / Year</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Join Changepreneur Circle
              </h3>
              <p className="text-xs text-slate-600">
                Provide your details below to initiate governed membership onboarding with Yuvaparipalan Foundation.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Profession / Business (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Entrepreneur, Doctor, Tech Professional, Educator"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700"
                  />
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
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone (10 Digits) *
                  </label>
                  <PhoneInput
                    value={phone}
                    onChange={(val) => setPhone(val)}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700"
                  >
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    District / City *
                  </label>
                  <DistrictAutocomplete
                    value={district}
                    onChange={(val) => setDistrict(val)}
                    placeholder="Select district"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any questions or specific focus areas you are passionate about"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Eligibility: 18 years and above. Membership fee is ₹30,000 annually. Governed official payment verification instructions will be provided by the Foundation secretariat.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full py-3 text-sm font-bold bg-[#15803d] hover:bg-[#166534] shadow-md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Application & Join Circle
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================================== */
/* HERO BACKGROUND COMPOSITION (Pure CSS - Zero Images) */
/* Layer 0: Warm White Canvas Base                    */
/* Layer 1: Organic Tactile Paper-like Micro-Depth    */
/* Layer 2: Soft Pale-Green Perimeter Atmosphere Glow */
/* Layer 3: Upper Organic Botanical Silhouettes (CSS) */
/* Layer 4: Lower Atmospheric Transition              */
/* Layer 5: Coherent Geometric Polygonal Landscape    */
/* ================================================== */
const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* LAYER 0: Warm White Canvas Base */}
      <div className="absolute inset-0 bg-[#fdfdfb]" />

      {/* LAYER 1: Subtle Organic Paper-Like Micro-Depth & Texture */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(240, 248, 240, 0.7) 0%, transparent 65%),
            radial-gradient(ellipse at 50% 100%, rgba(220, 245, 225, 0.45) 0%, transparent 70%),
            repeating-linear-gradient(45deg, rgba(30, 80, 40, 0.007) 0px, rgba(30, 80, 40, 0.007) 1px, transparent 1px, transparent 16px),
            linear-gradient(180deg, #fbfdfb 0%, #ffffff 30%, #ffffff 65%, #f4fbf4 100%)
          `,
        }}
      />

      {/* LAYER 2: Soft Pale-Green Atmospheric Glows (Perimeter Framing) */}
      <div
        className="hero-atmosphere-pulse absolute -top-24 -left-20 w-[550px] h-[550px] rounded-full blur-[110px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.15) 45%, transparent 75%)',
        }}
      />
      <div
        className="hero-atmosphere-pulse absolute -top-16 -right-16 w-[460px] h-[460px] rounded-full blur-[100px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(110, 231, 183, 0.35) 0%, rgba(52, 211, 153, 0.1) 50%, transparent 80%)',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[240px] rounded-full blur-[130px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(167, 243, 208, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* LAYER 3: Upper Organic Botanical Silhouettes (CSS Abstract Leaf Shapes) */}
      {/* 3A: Upper-Left Primary Foliage Cluster (Stronger Concentration) */}
      <div className="absolute -top-6 -left-6 sm:top-0 sm:left-0 w-80 h-72 scale-75 sm:scale-90 lg:scale-100 origin-top-left opacity-90 transition-transform">
        {/* Subtle Organic Curved Stem Arc */}
        <div className="absolute top-0 left-0 w-44 h-44 rounded-tl-full border-l-[1.5px] border-t-[1.5px] border-emerald-800/25" />

        {/* Abstract Leaf Silhouettes */}
        <div
          className="absolute -top-3 left-4 w-9 h-24 shadow-sm"
          style={{
            borderRadius: '85% 15% 85% 15% / 85% 15% 85% 15%',
            background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.82) 0%, rgba(22, 101, 52, 0.6) 100%)',
            transform: 'rotate(-28deg)',
          }}
        />
        <div
          className="absolute top-4 left-14 w-8 h-20 shadow-sm"
          style={{
            borderRadius: '84% 16% 84% 16% / 84% 16% 84% 16%',
            background: 'linear-gradient(145deg, rgba(22, 101, 52, 0.72) 0%, rgba(34, 197, 94, 0.52) 100%)',
            transform: 'rotate(14deg)',
          }}
        />
        <div
          className="absolute top-14 left-2 w-7 h-16 shadow-sm"
          style={{
            borderRadius: '82% 18% 82% 18% / 82% 18% 82% 18%',
            background: 'linear-gradient(160deg, rgba(74, 222, 128, 0.65) 0%, rgba(34, 197, 94, 0.45) 100%)',
            transform: 'rotate(-52deg)',
          }}
        />
        <div
          className="absolute -top-4 left-24 w-10 h-24 shadow-sm"
          style={{
            borderRadius: '86% 14% 86% 14% / 86% 14% 86% 14%',
            background: 'linear-gradient(140deg, rgba(22, 101, 52, 0.78) 0%, rgba(34, 197, 94, 0.55) 100%)',
            transform: 'rotate(34deg)',
          }}
        />
        <div
          className="absolute top-16 left-12 w-6 h-14"
          style={{
            borderRadius: '80% 20% 80% 20% / 80% 20% 80% 20%',
            background: 'linear-gradient(150deg, rgba(34, 197, 94, 0.6) 0%, rgba(134, 239, 172, 0.4) 100%)',
            transform: 'rotate(38deg)',
          }}
        />
        <div
          className="absolute top-6 left-32 w-8 h-20 shadow-sm"
          style={{
            borderRadius: '84% 16% 84% 16% / 84% 16% 84% 16%',
            background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.75) 0%, rgba(22, 101, 52, 0.5) 100%)',
            transform: 'rotate(58deg)',
          }}
        />
        <div
          className="absolute top-22 left-22 w-6 h-14"
          style={{
            borderRadius: '82% 18% 82% 18% / 82% 18% 82% 18%',
            background: 'linear-gradient(145deg, rgba(22, 101, 52, 0.65) 0%, rgba(34, 197, 94, 0.45) 100%)',
            transform: 'rotate(22deg)',
          }}
        />
        <div
          className="absolute -top-1 left-44 w-7 h-16 shadow-sm"
          style={{
            borderRadius: '85% 15% 85% 15% / 85% 15% 85% 15%',
            background: 'linear-gradient(155deg, rgba(34, 197, 94, 0.6) 0%, rgba(22, 101, 52, 0.4) 100%)',
            transform: 'rotate(72deg)',
          }}
        />
      </div>

      {/* 3B: Top-Edge Center Sprig (Subtle, balanced breathing room) */}
      <div className="absolute top-0 left-[36%] w-32 h-16 pointer-events-none hidden md:block opacity-70">
        <div
          className="absolute -top-3 left-2 w-6 h-15"
          style={{
            borderRadius: '84% 16% 84% 16% / 84% 16% 84% 16%',
            background: 'linear-gradient(140deg, rgba(22, 101, 52, 0.58) 0%, rgba(34, 197, 94, 0.4) 100%)',
            transform: 'rotate(58deg)',
          }}
        />
        <div
          className="absolute -top-2 left-10 w-5 h-13"
          style={{
            borderRadius: '82% 18% 82% 18% / 82% 18% 82% 18%',
            background: 'linear-gradient(155deg, rgba(74, 222, 128, 0.55) 0%, rgba(34, 197, 94, 0.38) 100%)',
            transform: 'rotate(36deg)',
          }}
        />
      </div>

      {/* 3C: Upper-Right Secondary Foliage Cluster (Lighter presence) */}
      <div className="absolute -top-4 -right-4 sm:top-0 sm:right-0 w-64 h-56 scale-75 sm:scale-90 lg:scale-100 origin-top-right opacity-80 transition-transform">
        {/* Subtle Right Stem Arc */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-tr-full border-r-[1.5px] border-t-[1.5px] border-emerald-800/20" />

        <div
          className="absolute top-2 right-12 w-8 h-20 shadow-sm"
          style={{
            borderRadius: '85% 15% 85% 15% / 85% 15% 85% 15%',
            background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.76) 0%, rgba(22, 101, 52, 0.52) 100%)',
            transform: 'rotate(32deg)',
          }}
        />
        <div
          className="absolute top-8 right-22 w-7 h-16 shadow-sm"
          style={{
            borderRadius: '84% 16% 84% 16% / 84% 16% 84% 16%',
            background: 'linear-gradient(145deg, rgba(22, 101, 52, 0.68) 0%, rgba(34, 197, 94, 0.46) 100%)',
            transform: 'rotate(-18deg)',
          }}
        />
        <div
          className="absolute -top-2 right-30 w-7 h-16 shadow-sm"
          style={{
            borderRadius: '82% 18% 82% 18% / 82% 18% 82% 18%',
            background: 'linear-gradient(160deg, rgba(74, 222, 128, 0.6) 0%, rgba(34, 197, 94, 0.4) 100%)',
            transform: 'rotate(-38deg)',
          }}
        />
        <div
          className="absolute top-16 right-14 w-5 h-13"
          style={{
            borderRadius: '80% 20% 80% 20% / 80% 20% 80% 20%',
            background: 'linear-gradient(140deg, rgba(34, 197, 94, 0.55) 0%, rgba(22, 101, 52, 0.4) 100%)',
            transform: 'rotate(8deg)',
          }}
        />
      </div>

      {/* LAYER 4: Lower Atmospheric Transition (White -> Lime -> Fresh Green -> Deep Green) */}
      <div
        className="absolute bottom-0 inset-x-0 h-64 sm:h-80 lg:h-96 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 100%, rgba(134, 239, 172, 0.32) 0%, rgba(74, 222, 128, 0.14) 40%, transparent 70%),
            radial-gradient(ellipse at 50% 100%, rgba(74, 222, 128, 0.24) 0%, rgba(187, 247, 208, 0.08) 45%, transparent 75%),
            radial-gradient(ellipse at 85% 100%, rgba(21, 128, 61, 0.28) 0%, rgba(34, 197, 94, 0.1) 45%, transparent 70%),
            linear-gradient(to top, rgba(15, 55, 30, 0.38) 0%, rgba(22, 101, 52, 0.18) 35%, rgba(74, 222, 128, 0.07) 65%, transparent 100%)
          `,
        }}
      />

      {/* LAYER 5: Abstract Geometric Landscape Toward Bottom Edge (Translucent Polygonal Planes) */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-64 lg:h-80 pointer-events-none overflow-hidden z-0">
        {/* Plane A: Deep background multifaceted terrain */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% 100%, 0% 55%, 15% 36%, 32% 54%, 50% 30%, 70% 48%, 86% 28%, 100% 42%, 100% 100%)',
            background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.4) 0%, rgba(22, 101, 52, 0.24) 50%, rgba(5, 46, 22, 0.48) 100%)',
          }}
        />

        {/* Plane B: Translucent faceted midground ridges */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% 100%, 0% 70%, 18% 46%, 38% 64%, 58% 38%, 78% 58%, 94% 44%, 100% 54%, 100% 100%)',
            background: 'linear-gradient(155deg, rgba(34, 197, 94, 0.28) 0%, rgba(21, 128, 61, 0.36) 60%, rgba(15, 60, 30, 0.52) 100%)',
          }}
        />

        {/* Plane C: Luminous crystalline lime/emerald facet accents */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(8% 100%, 25% 56%, 42% 76%, 64% 48%, 82% 68%, 100% 55%, 100% 100%)',
            background: 'linear-gradient(120deg, rgba(74, 222, 128, 0.26) 0%, rgba(34, 197, 94, 0.18) 45%, rgba(21, 128, 61, 0.34) 100%)',
          }}
        />

        {/* Plane D: Low faceted foreground ridges */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0% 100%, 0% 80%, 16% 68%, 34% 82%, 54% 64%, 74% 80%, 90% 68%, 100% 76%, 100% 100%)',
            background: 'linear-gradient(175deg, rgba(16, 185, 129, 0.16) 0%, rgba(20, 83, 45, 0.48) 55%, rgba(6, 36, 18, 0.68) 100%)',
          }}
        />

        {/* Plane E: Grounding bottom baseline with deepest foundation forest green */}
        <div
          className="absolute bottom-0 inset-x-0 h-16 sm:h-20"
          style={{
            clipPath: 'polygon(0% 100%, 0% 60%, 28% 40%, 65% 55%, 100% 45%, 100% 100%)',
            background: 'linear-gradient(to bottom, rgba(15, 60, 30, 0.32) 0%, rgba(5, 46, 22, 0.78) 100%)',
          }}
        />
      </div>
    </div>
  );
};

export const ChangepreneurCirclePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const empowerSectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: empowerScrollY } = useScroll({
    target: empowerSectionRef,
    offset: ['start end', 'end start'],
  });

  const empowerBgY = useTransform(empowerScrollY, [0, 1], ['-12%', '12%']);
  const empowerBgScale = useTransform(empowerScrollY, [0, 0.5, 1], [1.06, 1.14, 1.06]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <SEOHead
        title="Changepreneur Circle"
        description="Join Changepreneur Circle by Yuvaparipalan Foundation. Be The Change, Create The Change, Become The Change. Annual membership empowering personal transformation and 10 young lives."
        canonicalUrl="https://www.yuvaparipalan.org/programs/changepreneur-circle"
      />

      <div className="bg-[#fafaf7] text-slate-900 overflow-hidden">
        {/* ================================================== */}
        {/* 1. HERO SECTION                                     */}
        {/* Visual Rhythm:                                     */}
        {/* Yuvaparipalan Foundation                            */}
        {/* BE THE CHANGE / CREATE THE CHANGE / BECOME THE CHANGE*/}
        {/* [ JOIN CHANGEpreneur CIRCLE ]                      */}
        {/* ================================================== */}
        <section className="relative pt-36 sm:pt-44 pb-24 sm:pb-32 lg:pb-36 overflow-hidden">
          {/* Custom Multi-Layered CSS Botanical & Geometric Background */}
          <HeroBackground />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <FadeIn direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                <span>Yuvaparipalan Foundation</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.15] uppercase space-y-1 sm:space-y-2">
                <span className="block text-slate-900">Be The Change</span>
                <span className="block text-gradient">Create The Change</span>
                <span className="block text-slate-950">Become The Change</span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-700 font-medium leading-relaxed">
                Empowering individuals through holistic growth, conscious leadership, and transformative social contribution.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="hero-join-changepreneur-circle"
                  onClick={openModal}
                  className="w-full sm:w-auto h-[52px] bg-[#15803d] hover:bg-[#166534] text-white font-extrabold text-sm sm:text-base px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <Sparkles className="w-5 h-5 text-emerald-100" />
                  <span>JOIN CHANGEpreneur CIRCLE</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 2. CHANGEPRENEUR CIRCLE INTRODUCTION & FOCUS AREAS */}
        {/* Visual Rhythm:                                     */}
        {/* CHANGEpreneur CIRCLE                               */}
        {/* Short positioning statement                        */}
        {/* [Personal] [Leadership] [Finance] [Inner] [Social Impact] */}
        {/* ================================================== */}
        <section className="py-16 sm:py-24 border-t border-emerald-900/10 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Program Overview
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  CHANGEpreneur CIRCLE
                </h2>
                <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed">
                  A premier circle under Yuvaparipalan Foundation bringing together committed individuals to cultivate self-mastery, ethical leadership, and lasting social responsibility.
                </p>
              </div>
            </FadeIn>

            {/* Five Focus Areas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
              {[
                {
                  id: 'personal',
                  number: '01',
                  title: 'Personal Empowerment',
                  icon: <Activity className="w-6 h-6 text-emerald-700" />,
                  description: 'Cultivating mindset, physical vitality, self-awareness, and holistic personal mastery.',
                },
                {
                  id: 'leadership',
                  number: '02',
                  title: 'Professional & Leadership Development',
                  icon: <Compass className="w-6 h-6 text-emerald-700" />,
                  description: 'Executive presence, decision-making clarity, team dynamics, and ethical leadership.',
                },
                {
                  id: 'finance',
                  number: '03',
                  title: 'Financial Empowerment & Entrepreneurship',
                  icon: <TrendingUp className="w-6 h-6 text-emerald-700" />,
                  description: 'Wealth consciousness, enterprise creation, financial literacy, and sustainable ventures.',
                },
                {
                  id: 'spiritual',
                  number: '04',
                  title: 'Spiritual & Inner Development',
                  icon: <Sparkles className="w-6 h-6 text-emerald-700" />,
                  description: 'Inner calmness, mental resilience, purpose alignment, and mindful living practices.',
                },
                {
                  id: 'social',
                  number: '05',
                  title: 'Social Impact & Community Transformation',
                  icon: <HeartHandshake className="w-6 h-6 text-emerald-700" />,
                  description: 'Grassroots service, mentoring youth, nation building, and measurable social good.',
                },
              ].map((area, idx) => (
                <FadeIn key={area.id} direction="up" delay={idx * 0.08}>
                  <div className="p-6 rounded-2xl bg-[#fafaf7] border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-sm">
                          {area.icon}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-800/60">
                          {area.number}
                        </span>
                      </div>
                      <h3 className="font-heading font-extrabold text-base text-slate-900 leading-snug">
                        {area.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {area.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 3. WHO CAN JOIN?                                   */}
        {/* Visual Rhythm:                                     */}
        {/* WHO CAN JOIN? / 18+ / concise eligibility statement */}
        {/* ================================================== */}
        <section className="py-14 sm:py-18 bg-[#f2f8f2] border-y border-emerald-900/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <FadeIn direction="up">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-900 uppercase bg-white px-3.5 py-1 rounded-full border border-emerald-300 shadow-sm">
                Eligibility Criterion
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3">
                WHO CAN JOIN?
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-900/15 shadow-sm space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-heading font-black text-2xl border border-emerald-300">
                  18+
                </div>
                <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
                  Anyone 18 years and above who believes in personal growth, social responsibility and meaningful transformation.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs font-mono text-emerald-900">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200">Entrepreneurs</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200">Professionals</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200">Youth Leaders</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200">Conscious Citizens</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 4. CHANGEPRENEUR PREMIUM MEMBERSHIP & INCLUSIONS   */}
        {/* Visual Rhythm:                                     */}
        {/* CHANGEpreneur Premium Membership                   */}
        {/* ₹30,000/- Annual Membership Fee                    */}
        {/* All 12 Membership Inclusions Grid                  */}
        {/* ================================================== */}
        <section id="membership-inclusions" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-900 uppercase bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-300">
                  CHANGEpreneur Premium Membership
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  Membership Includes
                </h2>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <span className="font-heading text-5xl sm:text-6xl font-black text-emerald-900 tracking-tight">
                    ₹30,000/-
                  </span>
                  <span className="text-slate-600 font-bold text-lg sm:text-xl">
                    Annual Membership Fee
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* 12 Membership Inclusions Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* 1. CAERING */}
              <FadeIn direction="up" delay={0.03}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">01</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      CAERING
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80">
                    <span className="text-sm font-bold text-emerald-900">
                      Fitness Ring
                    </span>
                  </div>
                </div>
              </FadeIn>

              {/* 2. Palana Neurosync */}
              <FadeIn direction="up" delay={0.06}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-amber-900/15 hover:border-amber-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                        <Brain className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">02</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Palana Neurosync
                    </h3>
                    <p className="text-sm font-semibold text-slate-700">
                      Anandha / Zayana
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80">
                    <span className="inline-block text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      180 Days Subscription
                    </span>
                  </div>
                </div>
              </FadeIn>

              {/* 3. Happiness Planner */}
              <FadeIn direction="up" delay={0.09}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-purple-900/10 hover:border-purple-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">03</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Happiness Planner
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 4. HRC Discount Voucher */}
              <FadeIn direction="up" delay={0.12}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-emerald-900/15 hover:border-emerald-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">04</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      HRC Discount Voucher
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80">
                    <span className="inline-block text-xs font-mono font-bold text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      ₹5,000/- Discount Voucher
                    </span>
                  </div>
                </div>
              </FadeIn>

              {/* 5. Yuvaparipalan Life Membership */}
              <FadeIn direction="up" delay={0.15}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-blue-900/10 hover:border-blue-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">05</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Yuvaparipalan Life Membership
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 6. Youth Empowerment Scholarship Contribution */}
              <FadeIn direction="up" delay={0.18}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-emerald-900/15 hover:border-emerald-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">06</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Youth Empowerment Scholarship Contribution
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80">
                    <span className="inline-block text-xs font-mono font-bold text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      Contribution for 10 Students
                    </span>
                  </div>
                </div>
              </FadeIn>

              {/* 7. Changepreneur Community Access */}
              <FadeIn direction="up" delay={0.21}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-slate-300/60 hover:border-slate-500 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">07</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Changepreneur Community Access
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 8. Personal & Professional Empowerment Program */}
              <FadeIn direction="up" delay={0.24}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">08</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Personal & Professional Empowerment Program
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 9. Leadership & Entrepreneurship Program */}
              <FadeIn direction="up" delay={0.27}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-amber-900/10 hover:border-amber-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">09</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Leadership & Entrepreneurship Program
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 10. Digital Skills & AI Learning */}
              <FadeIn direction="up" delay={0.3}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-blue-900/10 hover:border-blue-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">10</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Digital Skills & AI Learning
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 11. Social Impact & Community Activities */}
              <FadeIn direction="up" delay={0.33}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">11</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Social Impact & Community Activities
                    </h3>
                  </div>
                </div>
              </FadeIn>

              {/* 12. Changepreneur Certificate */}
              <FadeIn direction="up" delay={0.36}>
                <div className="p-6 rounded-2xl bg-[#fafaf7] border border-purple-900/10 hover:border-purple-600/40 hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">12</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-950 leading-snug">
                      Changepreneur Certificate
                    </h3>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 5. EMPOWER 10 YOUNG LIVES                          */}
        {/* Visual Rhythm:                                     */}
        {/* EMPOWER 10 YOUNG LIVES                             */}
        {/* Transform Yourself                                 */}
        {/* Empower 10 Young Lives                             */}
        {/* Transform Society                                  */}
        {/* ================================================== */}
        <section
          ref={empowerSectionRef}
          className="relative py-24 sm:py-32 text-white overflow-hidden bg-slate-900"
        >
          {/* Parallax Scrolling Innovation Background Image (Vibrant & Colorful) */}
          <motion.div
            style={{ y: empowerBgY, scale: empowerBgScale }}
            className="absolute -inset-y-28 inset-x-0 h-[140%] w-full pointer-events-none z-0"
          >
            <img
              src="/images/empower_students_innovation.jpg"
              alt="Young Indian students and youth exploring technological innovations, gadgets, and modern work environments"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            {/* Slight, gentle overlay to preserve vibrant colors and realistic lab details */}
            <div className="absolute inset-0 bg-black/25" />
            {/* Subtle soft edge gradients for natural transition with adjoining sections */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
            <FadeIn direction="up">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-200 uppercase bg-slate-950/75 px-4 py-1.5 rounded-full border border-emerald-400/40 shadow-lg backdrop-blur-md">
                Core Purpose & Impact
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                EMPOWER 10 YOUNG LIVES
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/20 backdrop-blur-md space-y-3 hover:border-emerald-400/70 hover:bg-slate-950/90 transition-all shadow-2xl">
                  <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Step 01</div>
                  <h3 className="font-heading font-extrabold text-xl text-white">Transform Yourself</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    Nurture inner strength, cognitive focus, physical vitality with CAERING and Palana Neurosync.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-400/70 backdrop-blur-md space-y-3 shadow-2xl hover:border-emerald-300 hover:bg-slate-950/95 transition-all ring-1 ring-emerald-500/40">
                  <div className="text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">Step 02</div>
                  <h3 className="font-heading font-extrabold text-xl text-white">Empower 10 Young Lives</h3>
                  <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                    Your membership directly funds education, career guidance, and future skills for 10 deserving students.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/20 backdrop-blur-md space-y-3 hover:border-emerald-400/70 hover:bg-slate-950/90 transition-all shadow-2xl">
                  <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Step 03</div>
                  <h3 className="font-heading font-extrabold text-xl text-white">Transform Society</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    A ripple effect of conscious leaders and empowered youth building a self-reliant, progressive India.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <div className="inline-block px-6 py-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 shadow-xl">
                <p className="text-sm sm:text-base text-emerald-200 italic font-medium">
                  "Transform Yourself. Empower 10 Young Lives. Transform Society."
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 6. CAERING HARDWARE MILESTONE SHOWCASE             */}
        {/* Visual Rhythm:                                     */}
        {/* Hardware Milestone                                 */}
        {/* CAERING                                            */}
        {/* GRAND LAUNCH — JANUARY 2027 (First week of Jan)   */}
        {/* Large CAERING Ring Foreground Product Image        */}
        {/* ================================================== */}
        <section id="caering-hardware-milestone" className="relative py-24 sm:py-32 bg-[#fafaf7] border-b border-emerald-900/10 overflow-hidden">
          {/* Subtle Ambient Background Atmosphere (Quiet, Supporting the Product) */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-emerald-400/10 blur-[110px] pointer-events-none" aria-hidden="true" />
          <div className="absolute -top-10 left-10 w-96 h-96 rounded-full bg-emerald-100/30 blur-[90px] pointer-events-none" aria-hidden="true" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Editorial Product Narrative (approx 45%) */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <FadeIn direction="up">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Product Launch</span>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.1}>
                  <h2 className="font-heading text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-none">
                    CAERING
                  </h2>
                </FadeIn>

                <FadeIn direction="up" delay={0.15}>
                  <div className="space-y-2 pt-1 border-l-2 border-emerald-600/70 pl-4 sm:pl-5">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-heading tracking-tight">
                      GRAND LAUNCH — JANUARY 2027
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-slate-600">
                      Scheduled for unveiling in the first week of January 2027.
                    </p>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.2}>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium pt-1">
                    The CAERING fitness ring represents an advanced leap in wearable health technology, seamlessly integrating with the Palana Neurosync wellness architecture.
                  </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.25}>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-950 text-xs font-mono font-bold shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Pre-reserved for Changepreneur Circle Members
                    </span>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Hero Foreground Product Stage */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
                <FadeIn direction="up" delay={0.2}>
                  <div className="relative w-full max-w-[270px] sm:max-w-[320px] lg:max-w-[350px] flex flex-col items-center justify-center py-3">
                    
                    {/* Subtle Ambient Halo Cues behind the ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
                      {/* Soft atmospheric radial glow */}
                      <div className="w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] rounded-full bg-gradient-to-tr from-emerald-200/35 via-emerald-100/20 to-transparent blur-[50px]" />
                      {/* Delicate botanical-green concentric halos */}
                      <div className="w-48 sm:w-56 h-48 sm:h-56 rounded-full border border-emerald-600/15" />
                      <div className="w-56 sm:w-64 h-56 sm:h-64 rounded-full border border-emerald-600/10 border-dashed" />
                    </div>

                    {/* Foreground Product Image (Hero Object on Open Visual Stage) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 w-full aspect-square flex items-center justify-center"
                    >
                      <img
                        src="/images/caering_ring_isolated.png"
                        alt="CAERING fitness ring"
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_32px_rgba(0,0,0,0.22)] transition-transform duration-500 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </motion.div>

                    {/* Physical Grounding Shadow */}
                    <div
                      className="w-44 sm:w-56 h-5 rounded-full bg-slate-950/25 blur-lg -mt-3 sm:-mt-4 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 7. PRIZE CATEGORIES                                */}
        {/* Visual Rhythm:                                     */}
        {/* PRIZE CATEGORIES                                   */}
        {/* [iPhone] [Scooter] [Smartphones] [100 Consolation] */}
        {/* Lucky Draw disclaimer                              */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-900 uppercase bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Member Appreciation
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  PRIZE CATEGORIES
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-medium">
                  Exclusive recognition and appreciation awards for Changepreneur Circle members.
                </p>
              </div>
            </FadeIn>

            {/* 4 Prize Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* First Prize: iPhone 18 Pro */}
              <FadeIn direction="up" delay={0.05}>
                <div className="group p-5 rounded-3xl bg-[#fafaf7] border border-amber-900/20 hover:border-amber-600 hover:shadow-xl transition-all h-full flex flex-col justify-between text-left space-y-4 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="amber">First Prize</Badge>
                      <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                        10 Nos
                      </span>
                    </div>

                    {/* Realistic Product Image */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/80 border border-amber-900/10 shadow-sm relative flex items-center justify-center">
                      <img
                        src="/prizes/iphone_18_pro.jpg"
                        alt="First Prize iPhone 18 Pro Front View"
                        className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="font-heading font-black text-xl text-slate-950 group-hover:text-amber-900 transition-colors">
                      iPhone 18 Pro
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Awards</span>
                    <span className="font-heading font-black text-2xl text-amber-900">10 Nos</span>
                  </div>
                </div>
              </FadeIn>

              {/* Second Prize: Electric Scooter (Ola) */}
              <FadeIn direction="up" delay={0.1}>
                <div className="group p-5 rounded-3xl bg-[#fafaf7] border border-emerald-900/20 hover:border-emerald-600 hover:shadow-xl transition-all h-full flex flex-col justify-between text-left space-y-4 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="emerald">Second Prize</Badge>
                      <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        15 Nos
                      </span>
                    </div>

                    {/* Realistic Product Image */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-emerald-900/10 shadow-sm relative">
                      <img
                        src="/prizes/electric_scooter_ola.jpg"
                        alt="Second Prize Electric Scooter Ola"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="font-heading font-black text-xl text-slate-950 group-hover:text-emerald-900 transition-colors">
                      Electric Scooter (Ola)
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Awards</span>
                    <span className="font-heading font-black text-2xl text-emerald-900">15 Nos</span>
                  </div>
                </div>
              </FadeIn>

              {/* Third Prize: Smartphones */}
              <FadeIn direction="up" delay={0.15}>
                <div className="group p-5 rounded-3xl bg-[#fafaf7] border border-blue-900/20 hover:border-blue-600 hover:shadow-xl transition-all h-full flex flex-col justify-between text-left space-y-4 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="blue">Third Prize</Badge>
                      <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300">
                        25 Nos
                      </span>
                    </div>

                    {/* Realistic Product Image */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-blue-900/10 shadow-sm relative">
                      <img
                        src="/prizes/smartphones.jpg"
                        alt="Third Prize Smartphones"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="font-heading font-black text-xl text-slate-950 group-hover:text-blue-900 transition-colors">
                      Smartphones
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Awards</span>
                    <span className="font-heading font-black text-2xl text-blue-900">25 Nos</span>
                  </div>
                </div>
              </FadeIn>

              {/* Consolation: Realistic Wrapped Gift Box */}
              <FadeIn direction="up" delay={0.2}>
                <div className="group p-5 rounded-3xl bg-[#fafaf7] border border-purple-900/20 hover:border-purple-600 hover:shadow-xl transition-all h-full flex flex-col justify-between text-left space-y-4 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple">Consolation</Badge>
                      <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">
                        100 Nos
                      </span>
                    </div>

                    {/* Realistic Product Image */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-purple-900/10 shadow-sm relative">
                      <img
                        src="/prizes/consolation_gift_box.jpg"
                        alt="Consolation Prizes Realistic Wrapped Gift Box"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="font-heading font-black text-xl text-slate-950 group-hover:text-purple-900 transition-colors">
                      Consolation Prizes
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Awards</span>
                    <span className="font-heading font-black text-2xl text-purple-900">100 Nos</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Lucky Draw Disclaimer */}
            <FadeIn direction="up" delay={0.25}>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-3xl mx-auto text-center text-xs text-slate-600 font-medium leading-relaxed">
                <strong>Lucky Draw Note:</strong> Participation is subject to official terms, eligibility conditions, applicable laws and event rules.
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ================================================== */}
        {/* 8. FINAL JOIN CTA SECTION                           */}
        {/* Visual Rhythm:                                     */}
        {/* JOIN THE CHANGEpreneur CIRCLE                      */}
        {/* ₹30,000 / YEAR                                     */}
        {/* [ JOIN NOW ]                                       */}
        {/* ================================================== */}
        <section className="py-20 sm:py-28 bg-[#f2f8f2] border-t border-emerald-900/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <FadeIn direction="up">
              <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-white border border-emerald-700/40 shadow-2xl space-y-6">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-200 uppercase bg-emerald-800/60 px-4 py-1.5 rounded-full border border-emerald-500/40">
                  Ready To Transform?
                </span>

                <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Changepreneur Premium Membership
                </h2>

                <div className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-heading">
                  ₹30,000/- Annual Membership
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
                  Transform yourself, empower 10 young lives, and become part of a nationwide legacy of social leadership.
                </p>

                <div className="pt-4 flex justify-center">
                  <button
                    id="final-join-changepreneur-circle"
                    onClick={openModal}
                    className="w-full sm:w-auto h-[54px] bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-base px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.03] flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <span>Join Changepreneur Circle</span>
                    <ArrowRight className="w-5 h-5 text-slate-950" />
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>

      {/* Governed Membership Application Modal */}
      <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};
