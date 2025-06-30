import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  ArrowLeft, 
  CreditCard, 
  Check, 
  Shield, 
  Zap,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useTokens } from '../contexts/TokenContext';

export const TokenPurchase: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { tokenBalance, refreshTokenBalance } = useTokens();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const tokenPackages = [
    {
      id: 'basic',
      name: 'Basic',
      tokens: 50,
      price: 9.99,
      popular: false,
      perToken: 0.20
    },
    {
      id: 'standard',
      name: 'Standard',
      tokens: 200,
      price: 29.99,
      popular: true,
      perToken: 0.15,
      savings: '25%'
    },
    {
      id: 'premium',
      name: 'Premium',
      tokens: 500,
      price: 59.99,
      popular: false,
      perToken: 0.12,
      savings: '40%'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tokens: 1000,
      price: 99.99,
      popular: false,
      perToken: 0.10,
      savings: '50%'
    }
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    const pkg = tokenPackages.find(p => p.id === selectedPackage);
    if (!pkg) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call your payment processor
      // and then add tokens to the user's account upon successful payment
      
      // For now, we'll just show a success message
      setSuccess(true);
      
      // Refresh token balance
      await refreshTokenBalance();
      
      // Reset after a delay
      setTimeout(() => {
        setSuccess(false);
        setSelectedPackage(null);
        navigate('/tokens');
      }, 3000);
      
      showToast('success', `Successfully purchased ${pkg.tokens} tokens!`);
    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('error', 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/tokens')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Token History</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Coins className="w-8 h-8 text-amber-600" />
              Purchase AI Tokens
            </h1>
            <p className="text-gray-600 mt-1">
              Buy tokens to power AI features in Brandie
            </p>
          </div>
        </div>
      </motion.div>

      {/* Current Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl">
              <Coins className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-600">Current Balance</p>
              <h2 className="text-2xl font-bold text-gray-900">{tokenBalance} Tokens</h2>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Token Packages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Token Package</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -5 }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                selectedPackage === pkg.id 
                  ? 'border-amber-500 shadow-lg' 
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div 
                className={`p-6 cursor-pointer ${
                  selectedPackage === pkg.id ? 'bg-amber-50' : 'bg-white'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                  {selectedPackage === pkg.id && (
                    <Check className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500 ml-1">/ one-time</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">${pkg.perToken.toFixed(2)} per token</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-gray-900">{pkg.tokens} Tokens</span>
                  </div>
                  {pkg.savings && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                      SAVE {pkg.savings}
                    </span>
                  )}
                </div>
                
                <Button
                  variant={selectedPackage === pkg.id ? 'primary' : 'outline'}
                  className={`w-full ${
                    selectedPackage === pkg.id 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                      : ''
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {selectedPackage === pkg.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Section */}
      {selectedPackage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your tokens have been added to your account.
                </p>
                <Button
                  onClick={() => navigate('/tokens')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600"
                >
                  View Token History
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">Order Summary</h3>
                      <p className="text-blue-800 text-sm">
                        {tokenPackages.find(p => p.id === selectedPackage)?.tokens} Tokens for ${tokenPackages.find(p => p.id === selectedPackage)?.price}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
                
                <Button
                  onClick={handlePurchase}
                  loading={processing}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600"
                >
                  Complete Purchase
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What are AI tokens used for?</h3>
              <p className="text-gray-600">
                AI tokens power all the AI features in Brandie. Each AI action, such as generating a logo, 
                creating a color palette, or getting AI suggestions, costs 1 token.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Do tokens expire?</h3>
              <p className="text-gray-600">
                No, your tokens never expire. Once purchased, they remain in your account until used.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Can I get a refund for unused tokens?</h3>
              <p className="text-gray-600">
                We don't offer refunds for purchased tokens, but they never expire so you can use them anytime.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">How do I know when I'm running low on tokens?</h3>
              <p className="text-gray-600">
                You'll see your token balance in the sidebar. We'll also notify you when your balance is running low.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TokenPurchase;