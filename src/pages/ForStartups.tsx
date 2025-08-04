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
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Rocket,
  Star,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { PoweredBySection } from '../components/ui/PoweredBySection';
import { ScrollToTop } from '../components/ui/ScrollToTop';

export const ForStartups: React.FC = () => {
  const startupFeatures = [
    {
      icon: Clock,
      title: 'Launch in 24 Hours',
      description: 'Get your complete brand identity ready before your next investor meeting or product launch.',
      highlight: 'Speed'
    },
    {
      icon: DollarSign,
      title: 'Startup-Friendly Pricing',
      description: 'Professional branding at a fraction of agency costs. Perfect for pre-seed and seed stage budgets.',
      highlight: 'Affordable'
    },
    {
      icon: Brain,
      title: 'AI-Guided Strategy',
      description: 'No design experience needed. Our AI walks you through every decision with expert guidance.',
      highlight: 'No Experience Required'
    },
    {
      icon: Rocket,
      title: 'Market-Ready Assets',
      description: 'Get logos, colors, guidelines, and everything you need to look professional from day one.',
      highlight: 'Complete Package'
    },
    {
      icon: TrendingUp,
      title: 'Investor-Ready Presentation',
      description: 'Professional brand guidelines that impress investors and build credibility.',
      highlight: 'Credibility'
    },
    {
      icon: Zap,
      title: 'Iterate Fast',
      description: 'Test different brand directions quickly with AI. Perfect for lean startup methodology.',
      highlight: 'Agile'
    }
  ];

  const startupBenefits = [
    {
      title: 'Focus on Product, Not Design',
      description: 'Spend your time building your product while AI handles your brand identity.',
      icon: Target
    },
    {
      title: 'Professional from Day One',
      description: 'Look established and trustworthy from your first customer interaction.',
      icon: Star
    },
    {
      title: 'Scale-Ready Foundation',
      description: 'Build a brand that grows with you from MVP to IPO.',
      icon: TrendingUp
    }
  ];

  const testimonials = [
    {
      quote: "Brandie helped us create our entire brand identity in one weekend. We went from idea to professional brand faster than we thought possible.",
      author: "Sarah Chen",
      role: "Founder, TechFlow",
      company: "Y Combinator S23",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "The AI guidance was like having a brand strategist on our team. It asked the right questions and helped us define our identity clearly.",
      author: "Marcus Rodriguez",
      role: "Co-founder, DataSync",
      company: "Techstars Alumni",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "We saved $15,000 on branding costs and got better results than traditional agencies. Perfect for our bootstrap budget.",
      author: "Emily Watson",
      role: "Founder, GreenTech Solutions",
      company: "Seed Stage",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const pricingComparison = [
    { feature: 'Complete Brand Identity', brandie: true, agency: true, diy: false },
    { feature: 'Time to Complete', brandie: '24 hours', agency: '4-8 weeks', diy: '2-4 weeks' },
    { feature: 'Cost', brandie: '$49/month', agency: '$15,000+', diy: '$500-2,000' },
    { feature: 'AI Strategy Guidance', brandie: true, agency: false, diy: false },
    { feature: 'Professional Guidelines', brandie: true, agency: true, diy: false },
    { feature: 'Unlimited Revisions', brandie: true, agency: false, diy: true }
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
              <Rocket className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                Perfect for Pre-Seed to Series A
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
              Launch Your Brand
              <span className="luxury-gradient-text block">Overnight</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-4xl mx-auto leading-relaxed">
              AI-powered branding for startups who need to move fast. Get investor-ready 
              brand identity in 24 hours, not 8 weeks.
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
                  <span>Start Building Free</span>
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Button 
                variant="glass" 
                size="xl" 
                className="flex items-center space-x-3"
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-secondary-500 dark:text-secondary-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent-gold-500" />
                <span>Used by 500+ startups</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent-gold-500" />
                <span>Y Combinator approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent-gold-500" />
                <span>14-day free trial</span>
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

      {/* Startup-Specific Features */}
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
              Built for Startup Speed
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Every feature designed to help startups move fast and build credibility from day one.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {startupFeatures.map((feature, index) => (
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

      {/* Benefits Section */}
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
              Why Startups Choose Brandie
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Join hundreds of successful startups who've built their brand foundation with AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {startupBenefits.map((benefit, index) => (
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
                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-primary-100 text-lg leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
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
              Trusted by Successful Startups
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              From idea to funded startup - see how founders use Brandie to build credibility
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

      {/* Pricing Comparison */}
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
              Smart Investment for Startups
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
              Compare the startup-friendly approach vs traditional methods
            </p>
          </motion.div>

          <Card luxury className="overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-4 bg-gradient-luxury text-white">
              <div className="p-6">
                <h3 className="font-bold text-lg">Solution</h3>
              </div>
              <div className="p-6 bg-white/10">
                <h3 className="font-bold text-lg">Brandie AI</h3>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">Design Agency</h3>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">DIY Tools</h3>
              </div>
            </div>

            {pricingComparison.map((row, index) => (
              <div key={index} className="grid grid-cols-4 border-b border-secondary-200 dark:border-secondary-700 last:border-0">
                <div className="p-6">
                  <p className="font-medium text-secondary-900 dark:text-white">{row.feature}</p>
                </div>
                <div className="p-6 bg-primary-50 dark:bg-primary-900/20">
                  <p className="text-primary-700 dark:text-primary-300 font-medium flex items-center">
                    {row.brandie === true ? (
                      <Check className="w-5 h-5 mr-2 text-accent-gold-600" />
                    ) : row.brandie === false ? (
                      <span className="w-5 h-5 mr-2 text-secondary-400">—</span>
                    ) : null}
                    {typeof row.brandie === 'string' ? row.brandie : ''}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {typeof row.agency === 'string' ? row.agency : row.agency ? '✓' : '—'}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {typeof row.diy === 'string' ? row.diy : row.diy ? '✓' : '—'}
                  </p>
                </div>
              </div>
            ))}
          </Card>
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
              Ready to Launch?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join the startups building their brand foundation with AI. 
              Start free, scale when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="bg-white text-primary-700 hover:bg-primary-50 shadow-luxury-xl"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Start Building Your Brand
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="glass" 
                  size="xl"
                >
                  View Startup Pricing
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
                AI-powered branding for the next generation of startups.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">For Startups</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-secondary-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-secondary-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Brand Guide</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Startup Toolkit</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-secondary-400 hover:text-white transition-colors">Press</a></li>
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

export default ForStartups;