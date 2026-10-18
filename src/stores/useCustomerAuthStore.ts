import { create } from 'zustand';

export interface CustomerProfile {
  id: string;
  person_id: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  status: string;
}

export interface CustomerAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isModalOpen: boolean;
  userAccountId: string | null;
  customer: CustomerProfile | null;
  activeChallengeId: string | null;
  cooldownRemaining: number;
  error: string | null;
  successMessage: string | null;

  openModal: () => void;
  closeModal: () => void;
  requestOtp: (phone: string, attribution?: Record<string, string>) => Promise<boolean>;
  verifyOtp: (
    phone: string,
    otp: string,
    profile?: { first_name?: string; last_name?: string },
    attribution?: Record<string, string>
  ) => Promise<boolean>;
  fetchCurrentCustomer: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useCustomerAuthStore = create<CustomerAuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  isModalOpen: false,
  userAccountId: null,
  customer: null,
  activeChallengeId: null,
  cooldownRemaining: 0,
  error: null,
  successMessage: null,

  openModal: () => set({ isModalOpen: true, error: null, successMessage: null }),
  closeModal: () => set({ isModalOpen: false, error: null, successMessage: null }),
  clearError: () => set({ error: null, successMessage: null }),

  requestOtp: async (phone: string, attribution = {}) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await fetch(`${API_BASE}/api/v1/customer/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          ...attribution,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Failed to request OTP');
      }

      set({
        activeChallengeId: data.challenge_id,
        cooldownRemaining: data.retry_after_seconds || 60,
        successMessage: data.message || 'OTP sent successfully to your mobile number.',
        isLoading: false,
      });

      // Start countdown
      const interval = setInterval(() => {
        const current = get().cooldownRemaining;
        if (current <= 1) {
          clearInterval(interval);
          set({ cooldownRemaining: 0 });
        } else {
          set({ cooldownRemaining: current - 1 });
        }
      }, 1000);

      return true;
    } catch (err: any) {
      set({ error: err.message || 'Network error while requesting OTP', isLoading: false });
      return false;
    }
  },

  verifyOtp: async (phone: string, otp: string, profile = {}, attribution = {}) => {
    const challengeId = get().activeChallengeId;
    if (!challengeId) {
      set({ error: 'No active OTP challenge found. Please request an OTP first.' });
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/v1/customer/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Includes HTTP-only session cookie
        body: JSON.stringify({
          phone_number: phone,
          challenge_id: challengeId,
          otp,
          first_name: profile.first_name,
          last_name: profile.last_name,
          ...attribution,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Invalid OTP');
      }

      set({
        isAuthenticated: true,
        userAccountId: data.user_account_id,
        customer: data.customer,
        isLoading: false,
        isModalOpen: false,
        error: null,
        successMessage: 'Welcome to Yuvaparipalan Foundation!',
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Failed to verify OTP', isLoading: false });
      return false;
    }
  },

  fetchCurrentCustomer: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/customer/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        set({
          isAuthenticated: true,
          userAccountId: data.user_account_id,
          customer: {
            id: data.user_account_id,
            person_id: '',
            phone_number: data.phone_number,
            first_name: data.first_name,
            last_name: data.last_name,
            status: 'ACTIVE',
          },
        });
      } else {
        set({ isAuthenticated: false, userAccountId: null, customer: null });
      }
    } catch {
      set({ isAuthenticated: false, userAccountId: null, customer: null });
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/api/v1/customer/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      set({
        isAuthenticated: false,
        userAccountId: null,
        customer: null,
        activeChallengeId: null,
        error: null,
        successMessage: null,
      });
    }
  },
}));
