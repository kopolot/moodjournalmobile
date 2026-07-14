import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/appConfig';

export type PlanId = 'free' | 'plus' | 'pro';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  currency: string;
  features: string[];
}

export interface CheckoutPayload {
  tier: 'plus' | 'pro';
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
}

export class SubscriptionService {
  static async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SUBSCRIPTION.PLANS, {
      requiresAuth: false,
    });
    const data = response.data as { plans?: SubscriptionPlan[] };
    return data?.plans ?? [];
  }

  static async getCurrent(): Promise<{
    tier: PlanId;
    expiresAt: string | null;
    aiAnalysisUnlocked: boolean;
    plans: SubscriptionPlan[];
  } | null> {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CURRENT);
    if (!response.success || !response.data) return null;
    return response.data as {
      tier: PlanId;
      expiresAt: string | null;
      aiAnalysisUnlocked: boolean;
      plans: SubscriptionPlan[];
    };
  }

  static async checkout(payload: CheckoutPayload) {
    return apiClient.post(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CHECKOUT, payload);
  }

  static async cancel() {
    return apiClient.post(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CANCEL, {});
  }
}
