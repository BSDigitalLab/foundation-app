/**
 * Authoritative Payment Service for Razorpay Checkout
 * Governed by Phase 5 Directive
 */

import { getPlatformApiBaseUrl } from '../config/apiConfig';

const getApiBase = () => getPlatformApiBaseUrl();

export interface CreateOrderResponse {
  id: string;
  order_code: string;
  gateway_order_id: string;
  amount_paise: number;
  currency: string;
  receipt: string;
  status: string;
  program_id: string;
  program_title?: string;
  key_id?: string;
  user_account_id?: string;
}

export interface VerifyPaymentPayload {
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  payment_method?: string;
  method_details?: Record<string, any>;
  user_account_id?: string;
}

export interface VerifyPaymentResponse {
  status: string;
  order_id: string;
  order_code?: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  subscription_id?: string;
  entitlement_id?: string;
  amount_paise: number;
  currency: string;
  message?: string;
}

export interface PaymentConfigStatus {
  key_id_present: boolean;
  key_secret_present: boolean;
  webhook_secret_present: boolean;
  is_test_mode_prefix: boolean;
  is_live_mode_detected: boolean;
  currency: string;
  status: string;
  public_key_id?: string | null;
}

/**
 * Dynamically loads the official Razorpay Checkout modal script.
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Unable to load official Razorpay script from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Fetch configuration status diagnostics from the backend.
 */
export const fetchPaymentConfigStatus = async (): Promise<PaymentConfigStatus> => {
  const res = await fetch(`${getApiBase()}/api/v1/payments/config-status`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve payment configuration diagnostics.');
  }
  return res.json();
};

/**
 * Creates an internal server-authoritative payment order.
 */
export const createPaymentOrder = async (
  programId: string,
  userAccountId?: string | null,
  customerDetails?: {
    customer_phone?: string;
    customer_name?: string;
    customer_email?: string;
    notes?: Record<string, any>;
  }
): Promise<CreateOrderResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userAccountId) {
    headers['X-Customer-User-Id'] = userAccountId;
  }

  const payload: Record<string, any> = {
    program_id: programId,
  };
  if (customerDetails?.customer_phone) {
    payload.customer_phone = customerDetails.customer_phone;
  }
  if (customerDetails?.customer_name) {
    payload.customer_name = customerDetails.customer_name;
  }
  if (customerDetails?.customer_email) {
    payload.customer_email = customerDetails.customer_email;
  }
  if (customerDetails?.notes) {
    payload.notes = customerDetails.notes;
  }

  const res = await fetch(`${getApiBase()}/api/v1/payments/orders`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Failed to initiate payment order.');
  }
  return data;
};

/**
 * Verifies payment signature and triggers atomic entitlement fulfillment.
 */
export const verifyPayment = async (
  payload: VerifyPaymentPayload,
  userAccountId?: string | null
): Promise<VerifyPaymentResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userAccountId) {
    headers['X-Customer-User-Id'] = userAccountId;
  }

  const res = await fetch(`${getApiBase()}/api/v1/payments/verify`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Cryptographic payment verification failed.');
  }
  return data;
};
