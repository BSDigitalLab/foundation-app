import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDeletionStore } from '../stores/useAdminDeletionStore';
import type { DeletionLifecycleState, ReviewChecklist } from '../types/deletionModelB';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  History, 
  AlertCircle, 
  Check, 
  X, 
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/ui/Button';

export const AdminAccountDeletionPage: React.FC = () => {
  const {
    currentAdmin,
    isAuthenticatedAdmin,
    requests,
    selectedRequest,
    pendingCount,
    isLoading,
    error,
    successMessage,
    filterStatus,
    searchQuery,
    isApprovalModalOpen,
    isRejectionModalOpen,
    isEscalateModalOpen,
    isAuditModalOpen,
    setFilterStatus,
    setSearchQuery,
    fetchRequests,
    selectRequest,
    openApprovalModal,
    closeApprovalModal,
    openRejectionModal,
    closeRejectionModal,
    openEscalateModal,
    closeEscalateModal,
    openAuditModal,
    closeAuditModal,
    startReview,
    updateChecklist,
    approveDeletion,
    rejectDeletion,
    escalateRequest,
    clearNotice,
  } = useAdminDeletionStore();

  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('ACTIVE_FINANCIAL_DISPUTE');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [escalateNotes, setEscalateNotes] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const hasReviewPermission = currentAdmin.permissions.includes('iam.account_deletion.review');
  const hasApprovePermission = currentAdmin.permissions.includes('iam.account_deletion.approve');

  // RBAC Access Guard
  if (!isAuthenticatedAdmin || !hasReviewPermission) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrative Access Restricted</h2>
          <p className="text-sm text-slate-400">
            You do not possess the required authorization credentials (<code className="text-rose-400 font-mono text-xs">iam.account_deletion.review</code>) to view the Platform Governance Account Deletion Queue.
          </p>
          <div className="pt-2">
            <Link to="/">
              <Button variant="secondary" className="w-full">Return to Platform</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: DeletionLifecycleState) => {
    switch (status) {
      case 'ADMIN_REVIEW_PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> Pending Review
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Search className="w-3 h-3 mr-1" /> Under Review
          </span>
        );
      case 'APPROVED_FOR_DELETION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">
            <Check className="w-3 h-3 mr-1" /> Completed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      case 'REQUIRES_CLARIFICATION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <AlertCircle className="w-3 h-3 mr-1" /> Clarification Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const handleChecklistToggle = (
    key: keyof ReviewChecklist,
    currentVal: string,
    nextVal: string
  ) => {
    if (!selectedRequest) return;
    updateChecklist(selectedRequest.id, { [key]: currentVal === nextVal ? 'pending' : nextVal });
  };

  const isChecklistComplete = (cl?: ReviewChecklist) => {
    if (!cl) return false;
    return (
      cl.identityVerification === 'verified' &&
      cl.accessSuspension === 'confirmed' &&
      (cl.subscriptionReview === 'complete' || cl.subscriptionReview === 'not_applicable') &&
      (cl.entitlementReview === 'complete' || cl.entitlementReview === 'not_applicable') &&
      (cl.financialRetention === 'assessed' || cl.financialRetention === 'not_applicable') &&
      (cl.securityReview === 'complete' || cl.securityReview === 'not_applicable') &&
      cl.legalRetentionHold === 'confirmed'
    );
  };

  return (
    <>
      <SEOHead
        title="Admin Request Queue — Account Deletion & Governance"
        description="Official Administrator Review Console for Model B Account Deletion, Access Suspension and Personal Data Erasure."
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Top Operational Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              YP
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Identity & Access</span>
                <span>/</span>
                <span>Access & Permissions</span>
                <span>/</span>
                <span className="text-emerald-400 font-semibold">Account Deletion Requests</span>
              </div>
              <h1 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Account Deletion Requests</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
                  {pendingCount} Pending Review
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Reviewer:</span>
              <span className="text-white font-semibold">{currentAdmin.name} ({currentAdmin.role})</span>
            </div>
            <Link to="/delete-account" target="_blank" className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1">
              <span>View Deletion Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Notice Banners */}
        {error && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-3 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearNotice} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearNotice} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Grid: Left Column Request List, Right Column Single-Screen Review Workspace */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          
          {/* Column 1: Request Queue List (5 cols) */}
          <div className="col-span-12 lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-900/40">
            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search reference, name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs font-medium">
                {(['ALL', 'ADMIN_REVIEW_PENDING', 'UNDER_REVIEW', 'APPROVED_FOR_DELETION', 'COMPLETED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                      filterStatus === st
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* List Rows */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading queue...</div>
              ) : requests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No requests matching filter.</div>
              ) : (
                requests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <div
                      key={req.id}
                      onClick={() => selectRequest(req)}
                      className={`p-4 cursor-pointer transition-all hover:bg-slate-800/50 ${
                        isSelected ? 'bg-slate-800/80 border-l-4 border-emerald-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-white">{req.referenceCode}</span>
                            {req.sourceApp === 'channelpreneur' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                                Channelpreneur
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-slate-200 mt-1">{req.displayName}</div>
                          <div className="text-xs text-slate-400 font-mono">{req.identifier}</div>
                        </div>
                        <div className="text-right space-y-1">
                          {getStatusBadge(req.status)}
                          <div className="text-[10px] text-slate-500 flex items-center justify-end space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(req.requestSubmittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono">
                            SUSPENDED
                          </span>
                          {req.entitlementStatus === 'CESP100_SCHOLARSHIP' && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                              CESP100
                            </span>
                          )}
                          {req.subscriptionStatus === 'ACTIVE_SUBSCRIPTION' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                              Subscriber
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 truncate max-w-[150px]">
                          {req.assignedReviewerName || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Dedicated Single-Screen Review Workspace (7 cols) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col bg-slate-950 overflow-y-auto">
            {selectedRequest ? (
              <div className="p-6 space-y-6">
                
                {/* Header Banner */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-rose-400">{selectedRequest.referenceCode}</span>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{selectedRequest.displayName}</h2>
                    <p className="text-xs text-slate-400">
                      User Account ID: <code className="font-mono text-emerald-400">{selectedRequest.userAccountId}</code>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={openAuditModal}
                      className="text-xs flex items-center space-x-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Audit History ({selectedRequest.auditTrail.length})</span>
                    </Button>
                  </div>
                </div>

                {/* Section A: Account Identity & Immediate Suspension Status */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Section A: Account Identity & Access Suspension</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Current Access Status</span>
                      <span className="font-bold text-rose-400 font-mono">SUSPENDED (Immediate)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Verification Mode</span>
                      <span className="font-bold text-emerald-400 font-mono">{selectedRequest.identityVerificationMode}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Suspension Enforced</span>
                      <span className="font-medium text-slate-200">
                        {selectedRequest.accessSuspendedAt ? new Date(selectedRequest.accessSuspendedAt).toLocaleTimeString() : 'Enforced'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Organization</span>
                      <span className="font-medium text-slate-200">{selectedRequest.organizationName}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Source Origin</span>
                      <span className="font-medium text-slate-200 uppercase">{selectedRequest.sourceApp}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Submission Timestamp</span>
                      <span className="font-medium text-slate-200">
                        {new Date(selectedRequest.requestSubmittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section B: Subscription & Entitlement Review */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Section B: Subscriptions, Entitlements & Statutory Retention</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Subscription assessment */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">Active Subscriptions</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          selectedRequest.subscriptionStatus === 'ACTIVE_SUBSCRIPTION'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {selectedRequest.subscriptionStatus}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {selectedRequest.subscriptionDetails?.activePlans.length
                          ? `Enrolled: ${selectedRequest.subscriptionDetails.activePlans.join(', ')}`
                          : 'No active paid subscriptions found.'}
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Outstanding Balance: ₹{selectedRequest.subscriptionDetails?.outstandingBalance ?? 0}
                      </div>
                    </div>

                    {/* Entitlement assessment */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">Programs & Entitlements</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          selectedRequest.entitlementStatus !== 'NONE'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {selectedRequest.entitlementStatus}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {selectedRequest.entitlementDetails?.enrolledPrograms.length
                          ? `Programs: ${selectedRequest.entitlementDetails.enrolledPrograms.join(', ')}`
                          : 'No active scholarship or executive program memberships.'}
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Academic Credentials: {selectedRequest.entitlementDetails?.academicCredits ? 'Preserved' : 'None'}
                      </div>
                    </div>
                  </div>

                  {/* Statutory Tax Retention Notice */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-amber-200/90 flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Mandatory Statutory Retention:</strong> Under Section 128(5) of the Companies Act, 2013 and Section 62 of the Income-tax Act, 2025 (Rule 46), books of account, payment receipts, and commercial vouchers must be maintained in a secured state for 8 financial years. Personal profile data will be permanently purged under DPDPA 2023, while transaction ledgers are retained in pseudonymised form.
                    </span>
                  </div>
                </div>

                {/* Section C: Security & Session Invalidation Review */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span>Section C: Security Audit & Active Holds</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Session Tokens</span>
                      <span className="font-bold text-emerald-400">Revoked & Denied</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Security Incidents</span>
                      <span className="font-bold text-slate-200">{selectedRequest.securityDetails?.activeIncidents ?? 0}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-slate-500 block">Security Hold</span>
                      <span className={`font-bold ${selectedRequest.securityStatus === 'CLEAN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selectedRequest.securityStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section D: Interactive Mandatory Review Checklist */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Section D: Mandatory Pre-Approval Review Checklist</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {isChecklistComplete(selectedRequest.checklist) ? (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" /> <span>All Criteria Satisfied</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Verification Pending</span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Item 1 */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">1. Identity Verification</span>
                        <span className="text-[11px] text-slate-500">Ownership confirmed via first-party OTP challenge or authenticated session</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        VERIFIED
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">2. Immediate Account Suspension</span>
                        <span className="text-[11px] text-slate-500">All authenticated sessions terminated; platform login denied at backend</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        CONFIRMED
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">3. Subscription & Transaction Assessment</span>
                        <span className="text-[11px] text-slate-500">Active billing subscriptions, recurring charges, or payment disputes reviewed</span>
                      </div>
                      <button
                        onClick={() => handleChecklistToggle('subscriptionReview', selectedRequest.checklist.subscriptionReview, 'complete')}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                          selectedRequest.checklist.subscriptionReview === 'complete'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {selectedRequest.checklist.subscriptionReview === 'complete' ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>

                    {/* Item 4 */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">4. Entitlements & Programs Assessment</span>
                        <span className="text-[11px] text-slate-500">CESP100 scholarship records and academic enrolments assessed</span>
                      </div>
                      <button
                        onClick={() => handleChecklistToggle('entitlementReview', selectedRequest.checklist.entitlementReview, 'complete')}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                          selectedRequest.checklist.entitlementReview === 'complete'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {selectedRequest.checklist.entitlementReview === 'complete' ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>

                    {/* Item 5 */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">5. Statutory 8-Year Tax & Corporate Retention</span>
                        <span className="text-[11px] text-slate-500">Books of accounts preserved under Companies Act 2013 / Income Tax Act 1961</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        8-YR PRESERVED
                      </span>
                    </div>

                    {/* Item 6 */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 block">6. Security Clearance & No Active Holds</span>
                        <span className="text-[11px] text-slate-500">Confirm zero active fraud investigations or statutory holds</span>
                      </div>
                      <button
                        onClick={() => handleChecklistToggle('securityReview', selectedRequest.checklist.securityReview, 'complete')}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                          selectedRequest.checklist.securityReview === 'complete'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {selectedRequest.checklist.securityReview === 'complete' ? 'Cleared' : 'Mark Cleared'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Administrator Action Bar */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">ADMINISTRATIVE ACTIONS</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      State: {selectedRequest.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedRequest.status === 'ADMIN_REVIEW_PENDING' && (
                      <Button
                        variant="secondary"
                        onClick={() => startReview(selectedRequest.id)}
                        className="bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30 text-xs"
                      >
                        Start Review
                      </Button>
                    )}

                    {hasApprovePermission && selectedRequest.status !== 'COMPLETED' && selectedRequest.status !== 'APPROVED_FOR_DELETION' && (
                      <Button
                        variant="primary"
                        onClick={openApprovalModal}
                        disabled={!isChecklistComplete(selectedRequest.checklist)}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs disabled:opacity-40"
                      >
                        Approve Deletion
                      </Button>
                    )}

                    {selectedRequest.status !== 'REJECTED' && selectedRequest.status !== 'COMPLETED' && (
                      <Button
                        variant="secondary"
                        onClick={openRejectionModal}
                        className="bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20 text-xs"
                      >
                        Reject Request
                      </Button>
                    )}

                    {selectedRequest.status !== 'COMPLETED' && (
                      <Button
                        variant="secondary"
                        onClick={openEscalateModal}
                        className="text-xs"
                      >
                        Escalate for Clarification
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
                <FileText className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm">Select an account deletion request from the queue to start review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal 1: Approve Deletion Confirmation Modal */}
        {isApprovalModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-emerald-400">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Authorize Final Account Deletion</h3>
                  <p className="text-xs text-slate-400">{selectedRequest.referenceCode} — {selectedRequest.displayName}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p><strong>Scope & Consequences of Approval:</strong></p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>Personal identifiers, contact details, credentials, and uploaded scans will be permanently erased.</li>
                  <li>Account access suspension will be made permanent.</li>
                  <li>Statutory financial records will be archived in pseudonymised form for 8 financial years under Section 128 Companies Act.</li>
                  <li>This administrative decision is signed by <strong>{currentAdmin.name}</strong> and recorded in the immutable audit log.</li>
                </ul>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Administrative Approval Notes (Mandatory):
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="e.g. Identity verified via OTP. Zero outstanding liabilities. Approved for batch erasure."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="secondary" onClick={closeApprovalModal}>Cancel</Button>
                <Button
                  variant="primary"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white"
                  disabled={!approvalNotes.trim()}
                  onClick={() => approveDeletion(selectedRequest.id, approvalNotes)}
                >
                  Confirm & Authorize Deletion
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Rejection Modal */}
        {isRejectionModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-rose-400">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Reject Deletion Request</h3>
                  <p className="text-xs text-slate-400">{selectedRequest.referenceCode} — {selectedRequest.displayName}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <strong>Mandatory Directive 006 Security Rule:</strong> Rejecting a deletion request does <em>NOT</em> silently restore platform access. The account remains in a suspended state pending separate formal restoration adjudication.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Controlled Rejection Reason Code:
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500/50"
                >
                  <option value="ACTIVE_FINANCIAL_DISPUTE">Active Financial Dispute / Commission Audit</option>
                  <option value="LEGAL_STATUTORY_HOLD">Statutory Legal Hold / POCSO / Court Order</option>
                  <option value="INSUFFICIENT_IDENTITY_PROOF">Insufficient Identity Verification Proof</option>
                  <option value="FRAUD_INVESTIGATION">Security / Fraud Investigation Active</option>
                  <option value="REQUESTER_CANCELLED">User Requested Cancellation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Internal Compliance Explanation (Mandatory):
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Detail the operational reason for rejecting this deletion request..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="secondary" onClick={closeRejectionModal}>Cancel</Button>
                <Button
                  variant="primary"
                  className="bg-rose-600 hover:bg-rose-500 text-white"
                  disabled={!rejectionNotes.trim()}
                  onClick={() => rejectDeletion(selectedRequest.id, rejectionReason, rejectionNotes)}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Escalate for Clarification */}
        {isEscalateModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-purple-400">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Escalate for Review & Clarification</h3>
                  <p className="text-xs text-slate-400">{selectedRequest.referenceCode}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Escalation Notes / Legal Consultation Subject:
                </label>
                <textarea
                  value={escalateNotes}
                  onChange={(e) => setEscalateNotes(e.target.value)}
                  placeholder="Specify what clarification is required from the user, legal counsel, or financial auditor..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="secondary" onClick={closeEscalateModal}>Cancel</Button>
                <Button
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-500 text-white"
                  disabled={!escalateNotes.trim()}
                  onClick={() => escalateRequest(selectedRequest.id, escalateNotes)}
                >
                  Submit Escalation
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Complete Audit History Trail */}
        {isAuditModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <History className="w-5 h-5 text-emerald-400" />
                  <span>Audit History — {selectedRequest.referenceCode}</span>
                </div>
                <button onClick={closeAuditModal} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {selectedRequest.auditTrail.map((entry, idx) => (
                  <div key={entry.id || idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{entry.action}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {entry.actorRole}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-400">
                      Actor: <strong className="text-slate-200">{entry.actorName}</strong> (<code className="font-mono text-[10px]">{entry.actorId}</code>)
                    </div>
                    <div className="text-slate-400 flex items-center space-x-2 font-mono text-[11px]">
                      <span className="text-slate-500">{entry.previousState}</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-bold">{entry.newState}</span>
                    </div>
                    {entry.reasonNotes && (
                      <div className="text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-[11px] mt-1">
                        {entry.reasonNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <Button variant="secondary" onClick={closeAuditModal}>Close Audit Log</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminAccountDeletionPage;
