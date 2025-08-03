import { supabase } from './supabase';

export interface CheckoutSessionRequest {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export interface OrderData {
  customer_id: string;
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

export const stripeService = {
  // Create checkout session
  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: request.priceId,
        mode: request.mode,
        success_url: request.successUrl || `${window.location.origin}/success`,
        cancel_url: request.cancelUrl || `${window.location.origin}/pricing`
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }

    if (!data.sessionId || !data.url) {
      throw new Error('Invalid response from checkout service');
    }

    return data;
  },

  // Get user subscription
  async getUserSubscription(): Promise<SubscriptionData | null> {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  },

  // Get user orders
  async getUserOrders(): Promise<OrderData[]> {
    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      return [];
    }
  },

  // Check if user has active subscription
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription();
      return subscription?.subscription_status === 'active' || false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  },

  // Get subscription status
  async getSubscriptionStatus(): Promise<string | null> {
    try {
      const subscription = await this.getUserSubscription();
      return subscription?.subscription_status || null;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  }
};