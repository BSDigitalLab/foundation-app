import { create } from 'zustand';
import type { 
  AdminDeletionRequest, 
  DeletionLifecycleState, 
  ReviewChecklist 
} from '../types/deletionModelB.ts';
import { adminDeletionService } from '../services/adminDeletionService.ts';

export interface AdminActor {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AdminDeletionState {
  // Current admin session
  currentAdmin: AdminActor;
  isAuthenticatedAdmin: boolean;
  
  // Data
  requests: AdminDeletionRequest[];
  selectedRequest: AdminDeletionRequest | null;
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Filters
  filterStatus: DeletionLifecycleState | 'ALL';
  searchQuery: string;

  // Modals
  isApprovalModalOpen: boolean;
  isRejectionModalOpen: boolean;
  isEscalateModalOpen: boolean;
  isAuditModalOpen: boolean;

  // Operations
  setFilterStatus: (status: DeletionLifecycleState | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  fetchRequests: () => Promise<void>;
  selectRequest: (req: AdminDeletionRequest | null) => void;
  openApprovalModal: () => void;
  closeApprovalModal: () => void;
  openRejectionModal: () => void;
  closeRejectionModal: () => void;
  openEscalateModal: () => void;
  closeEscalateModal: () => void;
  openAuditModal: () => void;
  closeAuditModal: () => void;

  startReview: (requestId: string) => Promise<boolean>;
  updateChecklist: (requestId: string, checklist: Partial<ReviewChecklist>) => Promise<boolean>;
  approveDeletion: (requestId: string, notes: string) => Promise<boolean>;
  rejectDeletion: (requestId: string, reasonCode: string, notes: string) => Promise<boolean>;
  escalateRequest: (requestId: string, notes: string) => Promise<boolean>;
  clearNotice: () => void;
}

export const useAdminDeletionStore = create<AdminDeletionState>((set, get) => ({
  currentAdmin: {
    id: 'admin_biju_001',
    name: 'Biju Sivanand',
    role: 'Committee Head',
    permissions: [
      'iam.account_deletion.view',
      'iam.account_deletion.review',
      'iam.account_deletion.approve',
      'iam.account_deletion.reject',
      'iam.account_deletion.audit',
    ],
  },
  isAuthenticatedAdmin: true,

  requests: [],
  selectedRequest: null,
  pendingCount: 0,
  isLoading: false,
  error: null,
  successMessage: null,

  filterStatus: 'ALL',
  searchQuery: '',

  isApprovalModalOpen: false,
  isRejectionModalOpen: false,
  isEscalateModalOpen: false,
  isAuditModalOpen: false,

  setFilterStatus: (status) => {
    set({ filterStatus: status });
    get().fetchRequests();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchRequests();
  },

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filterStatus, searchQuery } = get();
      const list = await adminDeletionService.getDeletionRequests({
        status: filterStatus,
        search: searchQuery,
      });
      const count = await adminDeletionService.getPendingCount();
      
      // Update selectedRequest if currently selected
      const currentSelected = get().selectedRequest;
      let updatedSelected = null;
      if (currentSelected) {
        updatedSelected = list.find((r) => r.id === currentSelected.id) || null;
      }

      set({
        requests: list,
        pendingCount: count,
        selectedRequest: updatedSelected || (list.length > 0 ? list[0] : null),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch deletion requests', isLoading: false });
    }
  },

  selectRequest: (req) => set({ selectedRequest: req }),

  openApprovalModal: () => set({ isApprovalModalOpen: true }),
  closeApprovalModal: () => set({ isApprovalModalOpen: false }),
  openRejectionModal: () => set({ isRejectionModalOpen: true }),
  closeRejectionModal: () => set({ isRejectionModalOpen: false }),
  openEscalateModal: () => set({ isEscalateModalOpen: true }),
  closeEscalateModal: () => set({ isEscalateModalOpen: false }),
  openAuditModal: () => set({ isAuditModalOpen: true }),
  closeAuditModal: () => set({ isAuditModalOpen: false }),
  clearNotice: () => set({ error: null, successMessage: null }),

  startReview: async (requestId) => {
    const admin = get().currentAdmin;
    try {
      const updated = await adminDeletionService.startReview(requestId, {
        id: admin.id,
        name: admin.name,
        role: admin.role,
      });
      set({
        selectedRequest: updated,
        successMessage: `Review started for ${updated.referenceCode}`,
      });
      await get().fetchRequests();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Unable to start review' });
      return false;
    }
  },

  updateChecklist: async (requestId, checklist) => {
    try {
      const updated = await adminDeletionService.updateChecklist(requestId, checklist);
      set({ selectedRequest: updated });
      await get().fetchRequests();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update checklist' });
      return false;
    }
  },

  approveDeletion: async (requestId, notes) => {
    const admin = get().currentAdmin;
    try {
      const updated = await adminDeletionService.approveDeletion(
        requestId,
        { id: admin.id, name: admin.name, role: admin.role },
        notes
      );
      set({
        selectedRequest: updated,
        isApprovalModalOpen: false,
        successMessage: `Account Deletion Request ${updated.referenceCode} approved successfully. Batch deletion queued.`,
      });
      await get().fetchRequests();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Approval blocked' });
      return false;
    }
  },

  rejectDeletion: async (requestId, reasonCode, notes) => {
    const admin = get().currentAdmin;
    try {
      const updated = await adminDeletionService.rejectDeletion(
        requestId,
        { id: admin.id, name: admin.name, role: admin.role },
        reasonCode,
        notes
      );
      set({
        selectedRequest: updated,
        isRejectionModalOpen: false,
        successMessage: `Deletion request ${updated.referenceCode} rejected. Notice logged. Account suspension maintained.`,
      });
      await get().fetchRequests();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Rejection failed' });
      return false;
    }
  },

  escalateRequest: async (requestId, notes) => {
    const admin = get().currentAdmin;
    try {
      const updated = await adminDeletionService.escalateRequest(
        requestId,
        { id: admin.id, name: admin.name, role: admin.role },
        notes
      );
      set({
        selectedRequest: updated,
        isEscalateModalOpen: false,
        successMessage: `Request ${updated.referenceCode} escalated for legal/compliance clarification.`,
      });
      await get().fetchRequests();
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Escalation failed' });
      return false;
    }
  },
}));
