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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="luxury-gradient-text"> Pricing</span>
            </h1>
            
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-3xl mx-auto">
              Choose the perfect plan for your branding needs. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="flex items-center text-primary-600 dark:text-primary-400 font-medium"
              >
                <span className="sr-only">Toggle billing cycle</span>
                <span 
                  className={`inline-block h-6 w-11 rounded-full transition ${
                    billingCycle === 'annual' ? 'bg-primary-600' : 'bg-secondary-300'
                  }`}
                />
                <span 
                  className={`absolute inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium flex items-center ${billingCycle === 'annual' ? 'text-secondary-900 dark:text-white' : 'text-secondary-500'}`}>
                Annual
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
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
              <p className="text-secondary-600 dark:text-secondary-400 mb-4">
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
      <div className="py-20 bg-white dark:bg-secondary-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
              Enterprise Solutions
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Custom solutions for large organizations with complex branding needs
            </p>
          </motion.div>

          <Card luxury className="overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-luxury rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Enterprise</h3>
                  </div>
                  <p className="text-secondary-700 dark:text-secondary-300 mb-6 md:mb-0 md:max-w-xl">
                    Custom branding solutions for organizations with complex needs, multiple brands, 
                    and advanced security requirements.
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-secondary-600 dark:text-secondary-400 mb-2">Custom pricing</span>
                  <Button 
                    size="lg"
                    variant="luxury"
                    glow
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setShowEnterprise(!showEnterprise)}
                  className="flex items-center text-blue-600 font-medium"
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
                        <feature.icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                        <span className="text-secondary-700 dark:text-secondary-300">{feature.title}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-24 bg-gradient-to-r from-primary-50 to-accent-gold-50 dark:from-secondary-900 dark:to-secondary-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
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
                className="bg-white dark:bg-secondary-900 rounded-xl shadow-luxury p-6 border border-secondary-200 dark:border-secondary-700"
              >
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3 flex items-start">
                  <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-luxury text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Start building your brand today
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              14-day free trial. No credit card required. Cancel anytime.
            </p>
            <Link to="/auth">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50 shadow-luxury-xl"
              >
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Brandie</h3>
              </div>
              <p className="text-secondary-400 mb-6">
                Build every brand overnight with AI-powered branding tools.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-secondary-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-secondary-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          {/* Powered By Section */}
          <div className="mt-16 pt-8 border-t border-secondary-800">
            <PoweredBySection />
          </div>
          
          <div className="mt-8 pt-8 border-t border-secondary-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors">Cookies</a>
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