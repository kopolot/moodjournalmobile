import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/appConfig';
import { createIdempotencyKey } from '@/utils/idempotency';

export type PlanId = 'free' | 'plus' | 'pro';
export type BillingProvider = 'stripe' | 'mock';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  currency: string;
  features: string[];
}

export interface CheckoutPayload {
  tier: 'plus' | 'pro';
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  cardholderName?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CurrentSubscription {
  tier: PlanId;
  expiresAt: string | null;
  aiAnalysisUnlocked: boolean;
  billingProvider: BillingProvider;
  plans: SubscriptionPlan[];
}

export class SubscriptionService {
  static async getPlans(): Promise<{
    plans: SubscriptionPlan[];
    billingProvider: BillingProvider;
  }> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SUBSCRIPTION.PLANS, {
      requiresAuth: false,
    });
    const data = response.data as {
      plans?: SubscriptionPlan[];
      billingProvider?: BillingProvider;
    };
    return {
      plans: data?.plans ?? [],
      billingProvider: data?.billingProvider ?? 'mock',
    };
  }

  static async getCurrent(): Promise<CurrentSubscription | null> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CURRENT);
    if (!response.success || !response.data) return null;
    const data = response.data as CurrentSubscription;
    return {
      ...data,
      billingProvider: data.billingProvider ?? 'mock',
    };
  }

  static async checkout(
    payload: CheckoutPayload,
    options?: { idempotencyKey?: string }
  ) {
    return apiClient.post(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CHECKOUT, payload, {
      headers: {
        'Idempotency-Key': options?.idempotencyKey ?? createIdempotencyKey(),
      },
    });
  }

  static async cancel() {
    return apiClient.post(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CANCEL, {});
  }
}
