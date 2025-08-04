import React from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket, 
  Zap, 
  Clock, 
  DollarSign, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  Star,
  Users,
  Sparkles,
  Brain,
  Palette,
  MessageSquare,
  FileText,
  Shield,
  Globe,
  Terminal,
  Code,
  Database,
  Cpu
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Navbar } from '../components/layout/Navbar'
import { ScrollToTop } from '../components/ui/ScrollToTop'

export const ForStartups: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Ship in 24 Hours',
      description: 'Get your complete brand identity ready before your next investor meeting or product launch.',
      stat: '24hrs',
      statLabel: 'vs 8 weeks with agencies',
      accent: 'neon-green'
    },
    {
      icon: DollarSign,
      title: 'Startup-Optimized Pricing',
      description: 'Professional branding at a fraction of agency costs. Perfect for pre-seed to Series A startups.',
      stat: '$49/mo',
      statLabel: 'vs $15,000+ agency fees',
      accent: 'neon-cyan'
    },
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Get strategic insights typically available only to Fortune 500 companies with dedicated brand teams.',
      stat: '99.9%',
      statLabel: 'accuracy in brand recommendations',
      accent: 'neon-magenta'
    },
    {
      icon: Rocket,
      title: 'Scale-Ready Foundation',
      description: 'Build a brand foundation that grows with you from MVP to IPO. No rebranding needed.',
      stat: '10x',
      statLabel: 'faster than traditional methods',
      accent: 'neon-green'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Investor-Ready Brand Strategy',
      description: 'Create compelling brand narratives that resonate with investors and customers alike.',
      benefits: ['Mission & vision statements', 'Value propositions', 'Market positioning', 'Competitive analysis']
    },
    {
      icon: Palette,
      title: 'Professional Visual Identity',
      description: 'Get logos, colors, and typography that compete with brands 100x your size.',
      benefits: ['DALL-E generated logos', 'Psychology-based colors', 'Professional typography', 'Brand guidelines']
    },
    {
      icon: MessageSquare,
      title: 'Consistent Brand Voice',
      description: 'Establish clear communication guidelines for all your marketing and customer interactions.',
      benefits: ['Tone of voice definition', 'Messaging framework', 'Content guidelines', 'Platform-specific content']
    },
    {
      icon: TrendingUp,
      title: 'Growth-Focused Tools',
      description: 'Built-in analytics and optimization tools to help your brand evolve as you scale.',
      benefits: ['Brand health monitoring', 'Performance analytics', 'A/B testing insights', 'Optimization recommendations']
    }
  ];

  const testimonials = [
    {
      quote: "Brandie helped us create a professional brand identity that impressed our Series A investors. The AI suggestions were spot-on for our target market.",
      author: "Alex Chen",
      role: "Co-founder & CEO",
      company: "DataFlow",
      funding: "Series A",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "We went from idea to launch with a cohesive brand in just 3 days. Brandie's AI understood our vision better than we did initially.",
      author: "Sarah Martinez",
      role: "Founder",
      company: "EcoTech Solutions",
      funding: "Pre-seed",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "The brand guidelines Brandie generated helped us maintain consistency across all our marketing materials as we scaled from 0 to 100k users.",
      author: "Michael Park",
      role: "Co-founder",
      company: "FinanceAI",
      funding: "Seed",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const comparisonData = [
    { feature: 'Time to Complete', brandie: '24-48 hours', agency: '6-12 weeks', diy: '4-8 weeks' },
    { feature: 'Total Cost', brandie: '$49/month', agency: '$15,000-$50,000', diy: '$2,000-$5,000' },
    { feature: 'Professional Quality', brandie: true, agency: true, diy: false },
    { feature: 'AI-Powered Strategy', brandie: true, agency: false, diy: false },
    { feature: 'Investor-Ready Materials', brandie: true, agency: true, diy: false },
    { feature: 'Unlimited Revisions', brandie: true, agency: false, diy: true },
    { feature: 'Brand Guidelines', brandie: true, agency: true, diy: false },
    { feature: 'Ongoing Support', brandie: true, agency: false, diy: false }
  ];

  return (
    <div className="min-h-screen bg-void text-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-grid pt-32 cyber-overlay">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-neon-green/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto container-padding-cyber section-padding-cyber">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 glass-accent border border-neon-green/20 rounded-full px-6 py-3 mb-8"
            >
              <Rocket className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-semibold text-neon-green font-terminal">STARTUP_OPTIMIZED</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-cyber-hero font-black text-light mb-8 text-balance"
            >
              Launch your startup with a
              <span className="block gradient-ai-text">world-class brand</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-dark-100 mb-12 max-w-4xl mx-auto leading-relaxed text-balance font-terminal"
            >
              From idea to investor-ready brand in 24 hours. AI-powered branding that scales 
              with your startup journey, from pre-seed to IPO.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link to="/auth">
                <Button className="btn-ai-primary text-lg px-10 py-5 group neon-glow">
                  <Terminal className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  <span className="font-terminal">./start_building --free</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="btn-terminal text-lg px-10 py-5 group">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-terminal">./view_startup_pricing</span>
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-dark-100"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-neon-green" />
                <span className="font-terminal">14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-neon-green" />
                <span className="font-terminal">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-neon-green" />
                <span className="font-terminal">Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding-cyber bg-dark-950/50 border-y border-dark-500">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              Why startups choose 
              <span className="gradient-ai-text"> Brandie</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              Built specifically for the unique challenges and constraints of startup life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="cyber-card p-8 group"
              >
                <div className="flex items-start space-x-6">
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-ai rounded-2xl group-hover:scale-110 transition-transform duration-300 neon-glow`}>
                    <benefit.icon className="w-8 h-8 text-void" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-light mb-3 font-terminal">{benefit.title}</h3>
                    <p className="text-dark-100 mb-4 leading-relaxed">{benefit.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold gradient-ai-text font-terminal">{benefit.stat}</div>
                      <div className="text-sm text-dark-200 font-terminal">{benefit.statLabel}</div>
                    </div>
                  </div>
                </div>
                
                {/* Terminal accent */}
                <div className="mt-6 pt-4 border-t border-dark-500">
                  <span className={`text-xs text-${benefit.accent} font-terminal`}>// STARTUP_OPTIMIZED</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding-cyber bg-dark-900 grid-section">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              Everything your startup needs to 
              <span className="gradient-ai-text"> build a brand</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              From neural strategy analysis to automated execution, we've got every aspect of your brand covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="cyber-card p-8 group holographic"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-ai rounded-xl group-hover:scale-110 transition-transform duration-300 neon-glow">
                    <feature.icon className="w-7 h-7 text-void" />
                  </div>
                  <h3 className="text-xl font-bold text-light font-terminal">{feature.title}</h3>
                </div>
                <p className="text-dark-100 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                      <span className="text-dark-100 font-terminal">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Terminal accent */}
                <div className="mt-6 pt-4 border-t border-dark-500">
                  <span className="text-xs text-neon-green font-terminal">// AI_POWERED_FEATURE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding-cyber bg-dark-950/50 border-y border-dark-500">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              Trusted by successful 
              <span className="gradient-ai-text"> startup founders</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              See how other startups have accelerated their brand development with AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="cyber-card p-8 group"
              >
                <div className="flex text-neon-green mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-dark-100 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-dark-500"
                  />
                  <div>
                    <div className="font-bold text-light font-terminal">{testimonial.author}</div>
                    <div className="text-sm text-dark-100">{testimonial.role}</div>
                    <div className="text-xs text-neon-green font-semibold font-terminal">{testimonial.company} • {testimonial.funding}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding-cyber bg-dark-900">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              How Brandie compares for 
              <span className="gradient-ai-text"> startups</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              See why thousands of startups choose Brandie over traditional agencies and DIY tools.
            </p>
          </motion.div>

          <div className="cyber-card overflow-hidden">
            <div className="grid grid-cols-4 bg-dark-800 border-b border-dark-500">
              <div className="p-6 font-bold text-light font-terminal">FEATURE</div>
              <div className="p-6 font-bold text-neon-green bg-neon-green/5 font-terminal">BRANDIE</div>
              <div className="p-6 font-bold text-light font-terminal">AGENCY</div>
              <div className="p-6 font-bold text-light font-terminal">DIY_TOOLS</div>
            </div>

            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="grid grid-cols-4 border-b border-dark-500 hover:bg-dark-800/50 transition-colors"
              >
                <div className="p-6 font-medium text-light font-terminal">{row.feature}</div>
                <div className="p-6 bg-neon-green/5">
                  <div className="flex items-center space-x-2">
                    {row.brandie === true ? (
                      <Check className="w-5 h-5 text-neon-green" />
                    ) : (
                      <span className="font-semibold text-neon-green font-terminal">{row.brandie}</span>
                    )}
                  </div>
                </div>
                <div className="p-6 text-dark-100 font-terminal">{row.agency === true ? <Check className="w-5 h-5 text-dark-400" /> : row.agency}</div>
                <div className="p-6 text-dark-100 font-terminal">{row.diy === true ? <Check className="w-5 h-5 text-dark-400" /> : row.diy}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-cyber bg-gradient-dark text-light relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-ai opacity-10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto container-padding-cyber text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              Ready to build your startup's brand?
            </h2>
            <p className="text-xl text-dark-100 mb-12 max-w-2xl mx-auto text-balance font-terminal">
              Join thousands of successful startups who've accelerated their brand development with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button className="bg-light text-void hover:bg-dark-100 text-lg px-10 py-5 font-bold shadow-cyber group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  <span className="font-terminal">./start_free_trial</span>
                </Button>
              </Link>
              <Link to="/for-agencies">
                <Button className="glass-dark text-light border-dark-500 hover:bg-dark-800 text-lg px-10 py-5 font-semibold">
                  <span className="font-terminal">./are_you_an_agency</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
};

export default ForStartups;