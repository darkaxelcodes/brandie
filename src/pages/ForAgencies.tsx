import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Palette, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Brain, 
  Check, 
  Users,
  Building,
  TrendingUp,
  Shield,
  Layers,
  Download,
  Star,
  Play,
  BarChart,
  Clock,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { PoweredBySection } from '../components/ui/PoweredBySection';
import { ScrollToTop } from '../components/ui/ScrollToTop';

export const ForAgencies: React.FC = () => {
  const agencyFeatures = [
    {
      icon: Users,
      title: 'Multi-Client Management',
      description: 'Manage unlimited brands and clients from a single dashboard. Streamline your workflow.',
      highlight: 'Scalable'
    },
    {
      icon: Clock,
      title: '10x Faster Delivery',
      description: 'Complete brand identities in hours, not weeks. Increase your project capacity dramatically.',
      highlight: 'Efficiency'
    },
    {
      icon: FileText,
      title: 'Professional Guidelines',
      description: 'Generate comprehensive brand guidelines that rival top-tier agencies.',
      highlight: 'Quality'
    },
    {
      icon: Download,
      title: 'White-Label Ready',
      description: 'Export assets and guidelines with your agency branding. Maintain your professional image.',
      highlight: 'Branded'
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Track brand health, consistency scores, and client satisfaction metrics.',
      highlight: 'Insights'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with advanced security features for enterprise clients.',
      highlight: 'Secure'
    }
  ];

  const agencyBenefits = [
    {
      title: 'Scale Your Creative Output',
      description: 'Handle 5x more clients without hiring additional designers or strategists.',
      icon: TrendingUp,
      metric: '500%'
    },
    {
      title: 'Increase Profit Margins',
      description: 'Reduce project costs while maintaining premium pricing and quality.',
      icon: Award,
      metric: '300%'
    },
    {
      title: 'Faster Client Onboarding',
      description: 'Onboard new clients and deliver initial concepts in the first meeting.',
      icon: Zap,
      metric: '24hrs'
    }
  ];

  const testimonials = [
    {
      quote: "Brandie transformed our agency. We now deliver brand identities 10x faster while maintaining the quality our clients expect. Our profit margins have never been better.",
      author: "David Kim",
      role: "Creative Director",
      company: "Pixel Perfect Agency",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "The AI doesn't replace our creativity—it amplifies it. We can focus on strategy and client relationships while AI handles the heavy lifting.",
      author: "Maria Santos",
      role: "Agency Owner",
      company: "Creative Collective",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "Our clients are amazed by the speed and quality. We've become the go-to agency for startups who need professional branding fast.",
      author: "James Wilson",
      role: "Brand Strategist",
      company: "Future Brand Co.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Client Intake',
      description: 'Use our AI-powered questionnaire to gather client requirements in minutes.',
      icon: Target
    },
    {
      step: '02',
      title: 'AI Generation',
      description: 'Generate multiple brand concepts and variations with advanced AI tools.',
      icon: Brain
    },
    {
      step: '03',
      title: 'Client Presentation',
      description: 'Present professional concepts with comprehensive guidelines and rationale.',
      icon: FileText
    },
    {
      step: '04',
      title: 'Delivery & Export',
      description: 'Export white-labeled assets and guidelines ready for client handoff.',
      icon: Download
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh-bg">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
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
              className="inline-flex items-center space-x-2 bg-luxury-surface rounded-full px-6 py-3 mb-8 border border-white/20"
            >
              <Building className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                Trusted by 200+ Creative Agencies
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
              Scale Your Creative
              <span className="luxury-gradient-text block">Output</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-4xl mx-auto leading-relaxed">
              AI-powered branding platform for agencies. Deliver more projects, 
              increase margins, and wow clients with speed and quality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/auth">
                <Button 
                  variant="luxury" 
                  size="xl" 
                  glow
                  className="flex items-center space-x-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>Request Demo</span>
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Button 
                variant="glass" 
                size="xl" 
                className="flex items-center space-x-3"
              >
                <Play className="w-6 h-6" />
                <span>Watch Case Study</span>
              </Button>
            </div>

            {/* Agency Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold luxury-gradient-text mb-2">10x</div>
                <p className="text-secondary-600 dark:text-secondary-400">Faster Delivery</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold luxury-gradient-text mb-2">300%</div>
                <p className="text-secondary-600 dark:text-secondary-400">Profit Increase</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold luxury-gradient-text mb-2">24hrs</div>
                <p className="text-secondary-600 dark:text-secondary-400">Client Turnaround</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary-500/10 to-accent-gold-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-accent-rose-500/10 to-primary-600/10 rounded-full blur-3xl"
          />
        </div>
      </div>

      {/* Agency Workflow */}
      <div className="py-24 bg-white/50 dark:bg-secondary-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Streamlined Agency Workflow
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              From client brief to final delivery in record time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card luxury className="p-8 text-center h-full">
                  <div className="text-6xl font-bold text-primary-100 dark:text-primary-900/20 mb-4">
                    {step.step}
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-2xl mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {step.description}
                  </p>
                </Card>
                
                {/* Connector Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-gold-500 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Agency Features */}
      <div className="py-24 bg-gradient-to-br from-primary-50 to-accent-gold-50 dark:from-secondary-900 dark:to-secondary-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Advanced tools designed for professional agencies and their demanding clients
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
                <Card luxury hover className="p-8 h-full">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-luxury rounded-2xl">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <span className="text-xs bg-accent-gold-100 dark:bg-accent-gold-900/30 text-accent-gold-800 dark:text-accent-gold-300 px-2 py-1 rounded-full font-medium">
                          {feature.highlight}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits with Metrics */}
      <div className="py-24 bg-gradient-luxury text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Agency
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Real results from agencies using Brandie to scale their operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {agencyBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mx-auto mb-6">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-accent-gold-300 mb-2">{benefit.metric}</div>
                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-primary-100 text-lg leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Testimonials */}
      <div className="py-24 bg-white dark:bg-secondary-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6">
              Agency Success Stories
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              See how creative agencies are transforming their business with AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card luxury className="p-8 h-full">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-secondary-900 dark:text-white">{testimonial.author}</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{testimonial.role}</p>
                      <p className="text-xs text-accent-gold-600 dark:text-accent-gold-400 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-secondary-700 dark:text-secondary-300 italic leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex text-accent-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="py-24 bg-gradient-to-br from-secondary-900 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise-Ready Platform
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Advanced features for agencies serving enterprise clients
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'SSO Integration', description: 'Enterprise authentication', icon: Shield },
              { title: 'Custom Branding', description: 'White-label platform', icon: Palette },
              { title: 'API Access', description: 'Integrate with your tools', icon: Zap },
              { title: 'Priority Support', description: '24/7 dedicated support', icon: Users },
              { title: 'Advanced Analytics', description: 'Detailed reporting', icon: BarChart },
              { title: 'Team Management', description: 'Role-based permissions', icon: Building },
              { title: 'Client Portals', description: 'Branded client access', icon: FileText },
              { title: 'Compliance Ready', description: 'SOC 2, GDPR compliant', icon: Award }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-primary-100 text-sm">{feature.description}</p>
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
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Scale?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join the agencies already transforming their business with AI. 
              Request a personalized demo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="bg-white text-primary-700 hover:bg-primary-50 shadow-luxury-xl"
                >
                  <Building className="w-6 h-6 mr-3" />
                  Request Agency Demo
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="glass" 
                  size="xl"
                >
                  View Enterprise Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
                  alt="Brandie Logo" 
                  className="w-10 h-10 object-contain bg-white rounded-xl p-1"
                />
                <h3 className="text-xl font-bold">Brandie</h3>
              </div>
              <p className="text-secondary-400 mb-6">
                AI-powered branding platform for creative agencies.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">For Agencies</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-secondary-400 hover:text-white transition-colors">Enterprise Features</Link></li>
                <li><Link to="/pricing" className="text-secondary-400 hover:text-white transition-colors">Agency Pricing</Link></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Partner Program</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Agency Toolkit</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">White Papers</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Contact Sales</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Technical Support</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-secondary-800">
            <PoweredBySection />
          </div>
          
          <div className="mt-8 pt-8 border-t border-secondary-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-secondary-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default ForAgencies;