import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { stripeService } from '../lib/stripe';
import { getProductByPriceId } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');
  const priceId = searchParams.get('price_id');

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const subscriptionData = await stripeService.getUserSubscription();
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const product = priceId ? getProductByPriceId(priceId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Welcome to Brandie Premium
              </p>
              {product && (
                <p className="text-gray-500">
                  You've successfully subscribed to {product.name}
                </p>
              )}
            </motion.div>

            {/* Subscription Details */}
            {!loading && subscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-green-600 capitalize">{subscription.subscription_status}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Plan:</span>
                    <p className="text-gray-900">{product?.name || 'Brandie Subscription'}</p>
                  </div>
                  {subscription.current_period_end && (
                    <div>
                      <span className="font-medium text-gray-700">Next Billing:</span>
                      <p className="text-gray-900">
                        {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {subscription.payment_method_last4 && (
                    <div>
                      <span className="font-medium text-gray-700">Payment Method:</span>
                      <p className="text-gray-900">
                        {subscription.payment_method_brand} •••• {subscription.payment_method_last4}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Create Your First Brand</h3>
                  <p className="text-sm text-gray-600">Start building your brand identity with our AI-powered tools</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-3">
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Access Premium Features</h3>
                  <p className="text-sm text-gray-600">Unlock unlimited AI generations and advanced tools</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Get Support</h3>
                  <p className="text-sm text-gray-600">Access priority support and onboarding assistance</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/dashboard">
                <Button size="lg" className="flex items-center space-x-2">
                  <span>Start Building</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/preferences">
                <Button variant="outline" size="lg">
                  Manage Subscription
                </Button>
              </Link>
            </motion.div>

            {/* Session Info */}
            {sessionId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <p className="text-xs text-gray-500">
                  Session ID: {sessionId}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};