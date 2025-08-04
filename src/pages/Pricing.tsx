import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  HelpCircle, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { PricingCard } from '../components/subscription/PricingCard';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { PoweredBySection } from '../components/ui/PoweredBySection';
import { products } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showEnterprise, setShowEnterprise] = useState(false);

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: 'Our 14-day free trial gives you full access to all features of your selected plan. No credit card required to start. You can create one complete brand identity during your trial period.'
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to additional features. When downgrading, the change will take effect at the end of your current billing cycle.'
    },
    {
      question: 'What happens to my brands if I cancel?',
      answer: 'You\'ll have 30 days to export all your brand assets and guidelines after cancellation. After that period, your data will be removed from our systems.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with our service. Simply contact our support team within 30 days of your purchase.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice.'
    },
    {
      question: 'Is there a limit to AI-generated content?',
      answer: 'Each plan includes a generous amount of AI-generated content. The Starter plan includes up to 50 AI generations per month, Professional includes 200, and Agency includes unlimited generations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-display font-black text-gray-900 mb-6 text-balance">
              Simple, Transparent
              <span className="gradient-text"> Pricing</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto text-balance">
              Choose the perfect plan for your branding needs. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'annual' ? 'bg-electric-blue' : 'bg-gray-300'
                }`}
              >
                <span className="sr-only">Toggle billing cycle</span>
                <span 
                  className={`absolute inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium flex items-center ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
                <span className="ml-2 bg-electric-green/10 text-electric-green text-xs px-2 py-0.5 rounded-full font-semibold">
                  Save 30%
                </span>
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="flex justify-center">
            {products.map((product, index) => (
              <motion.div
                key={product.priceId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="max-w-md"
              >
                <PricingCard 
                  product={product} 
                  isPopular={true}
                />
              </motion.div>
            ))}
          </div>
          
          {!user && (
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Sign up to get started with your subscription
              </p>
              <Link to="/auth">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="section-padding bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-headline font-bold text-gray-900 mb-6 text-balance">
              Enterprise Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              Custom solutions for large organizations with complex branding needs
            </p>
          </motion.div>

          <div className="luxury-card overflow-hidden ring-2 ring-electric-blue/20">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-luxury rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                  </div>
                  <p className="text-gray-600 mb-6 md:mb-0 md:max-w-xl">
                    Custom branding solutions for organizations with complex needs, multiple brands, 
                    and advanced security requirements.
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-gray-600 mb-2">Custom pricing</span>
                  <Button 
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setShowEnterprise(!showEnterprise)}
                  className="flex items-center text-electric-blue font-medium hover:text-electric-blue-dark transition-colors"
                >
                  {showEnterprise ? 'Hide details' : 'Show enterprise features'}
                  <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${showEnterprise ? 'rotate-90' : ''}`} />
                </button>
                
                {showEnterprise && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {[
                      { title: 'Dedicated Account Manager', icon: Users },
                      { title: 'Custom AI Training', icon: Brain },
                      { title: 'Advanced Security', icon: Shield },
                      { title: 'SSO Integration', icon: CheckCircle },
                      { title: 'Custom Branding', icon: Palette },
                      { title: 'API Access', icon: Zap },
                      { title: 'Unlimited Brands', icon: Layers },
                      { title: 'Priority Support', icon: Zap },
                      { title: 'Custom Integrations', icon: Sparkles }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-3"
                      >
                        <feature.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">{feature.title}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-headline font-bold text-gray-900 mb-6 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              Everything you need to know about our pricing and plans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="luxury-card p-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                  <HelpCircle className="w-5 h-5 text-electric-blue mr-2 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-electric-purple/20 to-electric-blue/20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-display text-white mb-6 text-balance">
              Start building your brand today
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto text-balance">
              14-day free trial. No credit card required. Cancel anytime.
            </p>
            <Link to="/auth">
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-5 font-bold shadow-2xl group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-luxury rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Brandie</h3>
                  <div className="text-xs text-gray-400 font-medium tracking-wide">AI BRAND BUILDER</div>
                </div>
              </div>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-md">
                Build every brand overnight with the world's most advanced AI-powered branding platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/for-startups" className="text-gray-400 hover:text-white transition-colors">For Startups</Link></li>
                <li><Link to="/for-agencies" className="text-gray-400 hover:text-white transition-colors">For Agencies</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          {/* Powered By Section */}
          <div className="mt-20 pt-12 border-t border-gray-800">
            <PoweredBySection />
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

// X component for comparison table
const X = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};

export default Pricing;