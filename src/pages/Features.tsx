import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Palette, 
  MessageSquare, 
  FileText, 
  Brain, 
  Check, 
  Type, 
  Activity,
  BarChart,
  Users,
  Layers,
  Download,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { PoweredBySection } from '../components/ui/PoweredBySection';

export const Features: React.FC = () => {
  const features = [
    {
      category: 'Brand Strategy',
      icon: Target,
      color: 'blue',
      items: [
        {
          title: 'AI Purpose Discovery',
          description: 'Define your brand\'s mission, vision, and purpose through guided AI conversations.',
          icon: Brain
        },
        {
          title: 'Core Values Generator',
          description: 'Identify and articulate your brand\'s core values and positioning.',
          icon: Zap
        },
        {
          title: 'Audience Analysis',
          description: 'Define your target audience with detailed demographics and psychographics.',
          icon: Users
        },
        {
          title: 'Competitive Analysis',
          description: 'Analyze your market position and competitive advantages.',
          icon: BarChart
        },
        {
          title: 'Brand Archetype',
          description: 'Discover your brand\'s personality archetype for consistent storytelling.',
          icon: Layers
        }
      ]
    },
    {
      category: 'Visual Identity',
      icon: Palette,
      color: 'purple',
      items: [
        {
          title: 'AI Logo Generator',
          description: 'Create professional logos using DALL-E AI technology tailored to your brand.',
          icon: Sparkles
        },
        {
          title: 'Color Psychology',
          description: 'Generate scientifically-backed color palettes based on brand personality.',
          icon: Palette
        },
        {
          title: 'Typography Science',
          description: 'Select font pairings optimized for readability and brand personality.',
          icon: Type
        },
        {
          title: 'Visual Asset Export',
          description: 'Export your visual identity in multiple formats for any use case.',
          icon: Download
        }
      ]
    },
    {
      category: 'Brand Voice',
      icon: MessageSquare,
      color: 'green',
      items: [
        {
          title: 'Tone Analysis',
          description: 'Define your brand\'s communication style with AI-powered tone scales.',
          icon: Activity
        },
        {
          title: 'Messaging Framework',
          description: 'Create consistent key messages, taglines, and elevator pitches.',
          icon: MessageSquare
        },
        {
          title: 'Voice Guidelines',
          description: 'Establish clear do\'s and don\'ts for your brand\'s communication.',
          icon: CheckCircle
        },
        {
          title: 'Content Generator',
          description: 'Generate on-brand content for various platforms and contexts.',
          icon: FileText
        }
      ]
    },
    {
      category: 'Brand Guidelines',
      icon: FileText,
      color: 'amber',
      items: [
        {
          title: 'Comprehensive Guidelines',
          description: 'Generate complete brand guidelines with all your brand elements.',
          icon: FileText
        },
        {
          title: 'Multi-format Export',
          description: 'Export guidelines as PDF, web page, or presentation.',
          icon: Download
        },
        {
          title: 'AI Enhancement',
          description: 'Use AI to enhance and expand your brand guidelines.',
          icon: Brain
        },
        {
          title: 'Shareable Links',
          description: 'Share your guidelines with team members and stakeholders.',
          icon: ArrowRight
        }
      ]
    },
    {
      category: 'Brand Consistency',
      icon: CheckCircle,
      color: 'green',
      items: [
        {
          title: 'Compliance Checker',
          description: 'Verify if your marketing materials follow brand guidelines.',
          icon: CheckCircle
        },
        {
          title: 'Template Library',
          description: 'Access ready-to-use templates that follow your brand guidelines.',
          icon: Layers
        },
        {
          title: 'Social Media Templates',
          description: 'Create on-brand social media content with customizable templates.',
          icon: MessageSquare
        },
        {
          title: 'Marketing Materials',
          description: 'Generate consistent marketing collateral across all channels.',
          icon: FileText
        }
      ]
    },
    {
      category: 'Brand Health',
      icon: Activity,
      color: 'blue',
      items: [
        {
          title: 'Brand Health Score',
          description: 'Monitor your brand\'s overall health with comprehensive metrics.',
          icon: Activity
        },
        {
          title: 'Industry Analysis',
          description: 'Get AI-powered insights on industry trends and opportunities.',
          icon: BarChart
        },
        {
          title: 'Competitive Tracking',
          description: 'Track your position against competitors in your market.',
          icon: Target
        },
        {
          title: 'Improvement Recommendations',
          description: 'Receive actionable suggestions to strengthen your brand.',
          icon: Zap
        }
      ]
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
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6">
              Powerful Features for
              <span className="luxury-gradient-text"> Complete Branding</span>
            </h1>
            
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-3xl mx-auto">
              Everything you need to build a professional brand identity from strategy to guidelines,
              powered by advanced AI technology.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Sections */}
      {features.map((category, index) => (
        <div key={category.category} className={`py-20 ${index % 2 === 0 ? 'bg-white dark:bg-secondary-950' : 'bg-gradient-to-r from-primary-50 to-accent-gold-50 dark:from-secondary-900 dark:to-secondary-800'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-luxury rounded-xl`}>
                  <category.icon className={`w-6 h-6 text-white`} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white">{category.category}</h2>
              </div>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl">
                {category.category === 'Brand Strategy' && 'Define your brand\'s foundation with AI-powered strategic tools.'}
                {category.category === 'Visual Identity' && 'Create stunning visual elements that represent your brand perfectly.'}
                {category.category === 'Brand Voice' && 'Establish a consistent communication style that resonates with your audience.'}
                {category.category === 'Brand Guidelines' && 'Generate and maintain comprehensive brand guidelines for consistency.'}
                {category.category === 'Brand Consistency' && 'Ensure your brand is consistently applied across all materials and platforms.'}
                {category.category === 'Brand Health' && 'Monitor and improve your brand\'s performance with AI-powered analytics.'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {category.items.map((feature, featureIndex) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-secondary-900 rounded-2xl shadow-luxury border border-secondary-200 dark:border-secondary-700 p-8 hover:shadow-luxury-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-luxury rounded-xl`}>
                      <feature.icon className={`w-6 h-6 text-white`} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-6">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Advanced AI Features */}
      <div className="py-24 bg-gradient-luxury text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Advanced AI Technology
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI models to deliver professional branding results
              that would normally require an entire agency team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'DALL-E 3 Integration',
                description: 'Create unique, professional logos and visual assets tailored to your brand personality.',
                icon: Palette
              },
              {
                title: 'GPT-4o Powered Strategy',
                description: 'Develop comprehensive brand strategies with AI that understands market positioning.',
                icon: Brain
              },
              {
                title: 'Voice & Tone Analysis',
                description: 'Define your brand\'s communication style with advanced language processing.',
                icon: MessageSquare
              },
              {
                title: 'Color Psychology Engine',
                description: 'Select scientifically-backed color palettes that evoke the right emotions for your audience.',
                icon: Zap
              },
              {
                title: 'Typography Science',
                description: 'Choose font pairings based on readability research and brand personality alignment.',
                icon: Type
              },
              {
                title: 'Brand Health Analytics',
                description: 'Get AI-powered insights on your brand\'s strengths and improvement areas over time.',
                icon: Activity
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-primary-100">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              How Brandie Compares
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI-powered platform stacks up against traditional branding methods
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-4">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Feature</h3>
              </div>
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <h3 className="font-bold text-blue-600">Brandie</h3>
              </div>
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Branding Agency</h3>
              </div>
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">DIY Tools</h3>
              </div>
            </div>

            {[
              { feature: 'Time to Complete', brandie: '24-48 hours', agency: '4-8 weeks', diy: '2-4 weeks' },
              { feature: 'Cost', brandie: 'Affordable Subscription', agency: '$10,000-$50,000+', diy: '$500-$2,000' },
              { feature: 'AI-Powered Strategy', brandie: true, agency: false, diy: false },
              { feature: 'Visual Identity Creation', brandie: true, agency: true, diy: true },
              { feature: 'Brand Voice Development', brandie: true, agency: true, diy: 'Limited' },
              { feature: 'Brand Guidelines', brandie: true, agency: true, diy: 'Basic' },
              { feature: 'Brand Consistency Tools', brandie: true, agency: 'Extra Cost', diy: false },
              { feature: 'Brand Health Monitoring', brandie: true, agency: 'Extra Cost', diy: false },
              { feature: 'Unlimited Revisions', brandie: true, agency: 'Limited', diy: true },
              { feature: 'Market Research', brandie: 'AI-Generated', agency: 'Custom', diy: 'None' }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-4">
                <div className="p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{row.feature}</p>
                </div>
                <div className="p-6 border-b border-gray-200 bg-blue-50">
                  <p className="text-blue-600 font-medium flex items-center">
                    {row.brandie === true ? (
                      <Check className="w-5 h-5 mr-2" />
                    ) : row.brandie === false ? (
                      <X className="w-5 h-5 mr-2" />
                    ) : null}
                    {typeof row.brandie === 'string' ? row.brandie : ''}
                  </p>
                </div>
                <div className="p-6 border-b border-gray-200">
                  <p className="text-gray-600">
                    {row.agency === true ? (
                      <Check className="w-5 h-5 inline mr-2" />
                    ) : row.agency === false ? (
                      <X className="w-5 h-5 inline mr-2" />
                    ) : null}
                    {typeof row.agency === 'string' ? row.agency : ''}
                  </p>
                </div>
                <div className="p-6 border-b border-gray-200">
                  <p className="text-gray-600">
                    {row.diy === true ? (
                      <Check className="w-5 h-5 inline mr-2" />
                    ) : row.diy === false ? (
                      <X className="w-5 h-5 inline mr-2" />
                    ) : null}
                    {typeof row.diy === 'string' ? row.diy : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to transform your brand?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of founders and agencies who trust Brandie to create 
              compelling brand identities in record time.
            </p>
            <Link to="/auth">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
              >
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Brandie</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Build every brand overnight with AI-powered branding tools.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          
          {/* Powered By Section */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <PoweredBySection />
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookies</a>
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

export default Features;