import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { stripeService } from '../../lib/stripe';
import { Product } from '../../stripe-config';
import { useToast } from '../../contexts/ToastContext';

interface PricingCardProps {
  product: Product;
  isPopular?: boolean;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ 
  product, 
  isPopular = false, 
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      const { url } = await stripeService.createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        successUrl: `${window.location.origin}/success?price_id=${product.priceId}`,
        cancelUrl: `${window.location.origin}/pricing`
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      showToast('error', error.message || 'Failed to start checkout process');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      
      <Card className={`p-8 h-full flex flex-col ${
        isPopular 
          ? 'border-blue-200 shadow-xl bg-gradient-to-b from-white to-blue-50' 
          : ''
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{product.description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-gray-900">${product.price}</span>
            <span className="text-gray-600 ml-2">
              {product.mode === 'subscription' ? `/ ${product.interval}` : ''}
            </span>
          </div>
          {product.mode === 'subscription' && (
            <p className="text-sm text-green-600 mt-1">
              Billed {product.interval}ly
            </p>
          )}
        </div>
        
        <ul className="space-y-3 mb-8 flex-grow">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full ${
            isPopular 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
              : ''
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {product.mode === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
            </>
          )}
        </Button>
      </Card>
    </motion.div>
  );
};