import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  Layers, 
  Zap, 
  Target, 
  BarChart, 
  ArrowRight, 
  Brain, 
  Check, 
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Star,
  Building,
  Briefcase,
  Award,
  Globe,
  Workflow,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { PoweredBySection } from '../components/ui/PoweredBySection';

export const ForAgencies: React.FC = () => {
  const agencyFeatures = [
    {
      icon: Users,
      title: 'Multi-Client Management',
      description: 'Manage unlimited brands and clients from a single dashboard with team collaboration tools',
      benefit: 'Scale your operations'
    },
    {
      icon: Workflow,
      title: 'White-Label Ready',
      description: 'Present AI-generated work as your own with customizable exports and client presentations',
      benefit: 'Maintain your brand'
    },
    {
      icon: Clock,
      title: '10x Faster Delivery',
      description: 'Complete brand identities in hours instead of weeks, allowing you to take on more clients',
      benefit: 'Increase capacity'
    },
    {
      icon: DollarSign,
      title: 'Higher Profit Margins',
      description: 'Reduce design time by 80% while maintaining premium pricing for strategic work',
      benefit: 'Boost profitability'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Leverage advanced AI for competitive analysis, market research, and strategic recommendations',
      benefit: 'Deeper insights'
    },
    {
      icon: FileText,
      title: 'Professional Deliverables',
      description: 'Generate comprehensive brand guidelines, style guides, and asset libraries automatically',
      benefit: 'Impress clients'
    }
  ];

  const agencyTestimonials = [
    {
      quote: "Brandie has transformed our agency. We can now deliver complete brand identities in days instead of months, and our clients love the speed and quality.",
      author: "David Kim",
      role: "Creative Director",
      company: "Pixel Perfect Agency",
      clients: "50+ clients",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "The AI insights are incredible. We're providing strategic recommendations that would have taken weeks of research, and our clients see us as true strategic partners.",
      author: "Lisa Thompson",
      role: "Agency Owner",
      company: "Brand Collective",
      clients: "100+ clients",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "Our profit margins have increased by 40% since using Brandie. We can focus on strategy and client relationships while AI handles the execution.",
      author: "James Wilson",
      role: "Managing Partner",
      company: "Strategic Brands Co.",
      clients: "200+ clients",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const agencyStats = [
    { number: '500+', label: 'Agencies Using Brandie', icon: Building },
    { number: '10,000+', label: 'Brands Created', icon: Layers },
    { number: '80%', label: 'Time Reduction', icon: Clock },
    { number: '40%', label: 'Profit Increase', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-luxury-gradient-light">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-ai-pattern">
        <div className="container-luxury section-luxury pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-heading font-semibold mb-8"
            >
              <Building className="w-4 h-4" />
              <span>Trusted by 500+ Creative Agencies</span>
            </motion.div>
            
            <h1 className="font-heading font-bold text-neutral-900 mb-8 leading-tight">
              Scale Your Agency with
              <span className="text-luxury-gradient block mt-2">AI-Powered Branding</span>
              <span className="block mt-2">That Clients Love</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Deliver premium brand identities 10x faster while maintaining quality and profitability. 
              Focus on strategy and client relationships while AI handles the execution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="bg-ai-gradient shadow-glow hover:shadow-glow-lg">
                  <span>Start Agency Trial</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="border-2">
                <span>Schedule Demo</span>
              </Button>
            </div>

            {/* Agency Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {agencyStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-2xl mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-3xl font-heading font-bold text-neutral-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-neutral-600 font-heading font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-10 w-32 h-32 bg-primary-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-10 w-24 h-24 bg-ai-cyan/20 rounded-full blur-xl"
        />
      </div>

      {/* Agency Benefits */}
      <div className="section-luxury bg-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-heading font-bold text-neutral-900 mb-6">
              Transform Your Agency Operations
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From boutique studios to enterprise agencies, Brandie helps creative teams 
              deliver more value in less time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agencyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="p-8 h-full">
                  <div className="flex items-center justify-center w-16 h-16 bg-luxury-gradient rounded-2xl mb-6 shadow-glow">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-heading font-semibold">
                    <Check className="w-4 h-4" />
                    <span>{feature.benefit}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Agency Workflow */}
      <div className="section-luxury bg-neutral-50">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold text-neutral-900 mb-6">
              Streamlined Agency Workflow
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Integrate Brandie into your existing process for maximum efficiency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Client Onboarding',
                description: 'Use our AI-powered questionnaire to gather client requirements in minutes',
                icon: Users,
                color: 'bg-blue-500'
              },
              {
                step: '02',
                title: 'AI Generation',
                description: 'Generate multiple brand concepts, logos, and guidelines for client review',
                icon: Brain,
                color: 'bg-purple-500'
              },
              {
                step: '03',
                title: 'Client Collaboration',
                description: 'Share branded presentations and gather feedback through our platform',
                icon: Briefcase,
                color: 'bg-green-500'
              },
              {
                step: '04',
                title: 'Final Delivery',
                description: 'Export complete brand packages with professional documentation',
                icon: Award,
                color: 'bg-orange-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-2xl mb-6 shadow-luxury`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-heading font-bold text-neutral-500 mb-2">{item.step}</div>
                <h3 className="text-lg font-heading font-bold text-neutral-900 mb-3">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="section-luxury bg-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold text-neutral-900 mb-6">
              Trusted by Leading Creative Agencies
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              See how agencies are transforming their operations with Brandie
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {agencyTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full">
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 italic mb-6 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-neutral-900">{testimonial.author}</h4>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      <p className="text-xs text-primary-600 font-heading font-semibold">{testimonial.company}</p>
                      <p className="text-xs text-neutral-500">{testimonial.clients}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="section-luxury bg-luxury-gradient text-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold mb-6">
              Enterprise-Grade Features for Agencies
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Advanced tools and capabilities designed for professional creative teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Team Collaboration',
                description: 'Real-time collaboration tools with role-based permissions and client access controls',
                icon: Users
              },
              {
                title: 'Custom AI Training',
                description: 'Train AI models on your agency\'s style and client preferences for consistent output',
                icon: Brain
              },
              {
                title: 'White-Label Platform',
                description: 'Fully customizable interface with your agency branding and domain',
                icon: Globe
              },
              {
                title: 'Advanced Analytics',
                description: 'Detailed insights on project performance, client satisfaction, and team productivity',
                icon: BarChart
              },
              {
                title: 'API Integration',
                description: 'Integrate with your existing tools and workflows via our comprehensive API',
                icon: Zap
              },
              {
                title: 'Priority Support',
                description: 'Dedicated account manager and 24/7 priority support for your team',
                icon: Shield
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mb-6">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">{item.title}</h3>
                <p className="text-primary-100 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="section-luxury bg-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold text-neutral-900 mb-6">
              Calculate Your Agency's ROI
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              See how much time and money Brandie can save your agency
            </p>
          </motion.div>

          <Card className="p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Traditional Agency Process</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">Strategy & Research</span>
                    <span className="font-heading font-semibold text-neutral-900">40 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">Logo Design & Iterations</span>
                    <span className="font-heading font-semibold text-neutral-900">60 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">Brand Guidelines</span>
                    <span className="font-heading font-semibold text-neutral-900">30 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">Client Revisions</span>
                    <span className="font-heading font-semibold text-neutral-900">20 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-red-50 px-4 rounded-xl">
                    <span className="font-heading font-bold text-neutral-900">Total Time</span>
                    <span className="font-heading font-bold text-red-600">150 hours</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-6">With Brandie</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">AI Strategy Generation</span>
                    <span className="font-heading font-semibold text-neutral-900">2 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">AI Logo & Visual Identity</span>
                    <span className="font-heading font-semibold text-neutral-900">4 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">Auto-Generated Guidelines</span>
                    <span className="font-heading font-semibold text-neutral-900">1 hour</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="text-neutral-700">Client Presentation</span>
                    <span className="font-heading font-semibold text-neutral-900">8 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-green-50 px-4 rounded-xl">
                    <span className="font-heading font-bold text-neutral-900">Total Time</span>
                    <span className="font-heading font-bold text-green-600">15 hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 bg-primary-50 px-8 py-4 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-primary-600" />
                <div className="text-left">
                  <div className="text-3xl font-heading font-bold text-primary-700">90% Time Savings</div>
                  <div className="text-primary-600 font-heading font-medium">135 hours saved per project</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-luxury bg-neutral-900 text-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading font-bold mb-6">
              Ready to Transform Your Agency?
            </h2>
            <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Join 500+ agencies already using Brandie to deliver better results 
              faster and more profitably.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-ai-gradient shadow-glow hover:shadow-glow-lg">
                <span>Schedule Agency Demo</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to="/auth">
                <Button variant="secondary" size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  <span>Start Free Trial</span>
                </Button>
              </Link>
            </div>

            <div className="text-center text-neutral-400">
              <p className="font-heading font-medium">
                ✨ 30-day free trial • White-label options • Dedicated support
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-950 text-white py-16">
        <div className="container-luxury">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold">Brandie</h3>
              </div>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                AI-powered branding platform designed for creative agencies and professional teams.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">For Agencies</h3>
              <ul className="space-y-3">
                <li><Link to="/for-agencies" className="text-neutral-400 hover:text-white transition-colors">Why Brandie</Link></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Enterprise Pricing</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">White-Label</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Integration Guides</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Best Practices</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact Sales</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          {/* Powered By Section */}
          <div className="mt-16 pt-8 border-t border-neutral-800">
            <PoweredBySection />
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default ForAgencies;