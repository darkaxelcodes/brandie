import React, { useState, useEffect } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { stripeService } from '../../lib/stripe';
import { getProductByPriceId } from '../../stripe-config';

interface SubscriptionBadgeProps {
  className?: string;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ className = '' }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await stripeService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`inline-flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status !== 'active') {
    return null;
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;

  return (
    <div className={`inline-flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Crown className="w-3 h-3" />
      <span>{product?.name || 'Premium'}</span>
    </div>
  );
};