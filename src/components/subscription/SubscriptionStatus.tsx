import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle, AlertCircle, Calendar, CreditCard, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { stripeService, SubscriptionData } from '../../lib/stripe';
import { getProductByPriceId } from '../../stripe-config';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionStatusProps {
  className?: string;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await stripeService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'trialing':
        return 'text-blue-600 bg-blue-100';
      case 'past_due':
        return 'text-amber-600 bg-amber-100';
      case 'canceled':
      case 'unpaid':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'trialing':
        return <Crown className="w-5 h-5 text-blue-600" />;
      case 'past_due':
      case 'canceled':
      case 'unpaid':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
            <Crown className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">No Active Subscription</p>
            <p className="text-sm text-gray-600">Upgrade to unlock premium features</p>
          </div>
        </div>
      </Card>
    );
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Crown className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900">
                {product?.name || 'Brandie Subscription'}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(subscription.subscription_status)}`}>
                {subscription.subscription_status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {subscription.current_period_end && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Renews {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</span>
                </div>
              )}
              {subscription.payment_method_last4 && (
                <div className="flex items-center space-x-1">
                  <CreditCard className="w-4 h-4" />
                  <span>{subscription.payment_method_brand} •••• {subscription.payment_method_last4}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {getStatusIcon(subscription.subscription_status)}
      </div>
    </Card>
  );
};