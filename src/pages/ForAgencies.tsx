import React from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Zap, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Check, 
  Star,
  Sparkles,
  Brain,
  Palette,
  MessageSquare,
  FileText,
  Shield,
  Globe,
  Target,
  BarChart,
  Layers,
  Download,
  Terminal,
  Code,
  Database
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Navbar } from '../components/layout/Navbar'
import { ScrollToTop } from '../components/ui/ScrollToTop'

export const ForAgencies: React.FC = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: '10x Faster Delivery',
      description: 'Complete brand identities in hours instead of weeks. Take on more clients without hiring more staff.',
      stat: '10x',
      statLabel: 'faster than traditional methods',
      accent: 'neon-green'
    },
    {
      icon: DollarSign,
      title: 'Higher Profit Margins',
      description: 'Reduce production costs while maintaining premium pricing. Increase your agency\'s profitability.',
      stat: '300%',
      statLabel: 'increase in profit margins',
      accent: 'neon-cyan'
    },
    {
      icon: Users,
      title: 'Scale Your Team',
      description: 'Handle enterprise clients without expanding your team. AI handles the heavy lifting.',
      stat: '5x',
      statLabel: 'more clients per team member',
      accent: 'neon-magenta'
    },
    {
      icon: Shield,
      title: 'White-Label Ready',
      description: 'Present AI-generated work as your own. Maintain your agency brand and client relationships.',
      stat: '100%',
      statLabel: 'white-label customization',
      accent: 'neon-green'
    }
  ];

  const features = [
    {
      icon: Building2,
      title: 'Multi-Client Management',
      description: 'Manage unlimited client brands from a single dashboard with team collaboration tools.',
      benefits: ['Unlimited client brands', 'Team collaboration', 'Client presentation mode', 'Project templates']
    },
    {
      icon: Palette,
      title: 'Professional Asset Export',
      description: 'Export client-ready assets in all formats. From logos to complete brand guidelines.',
      benefits: ['Multi-format exports', 'Print-ready files', 'Web-optimized assets', 'Brand guideline PDFs']
    },
    {
      icon: BarChart,
      title: 'Client Reporting & Analytics',
      description: 'Impress clients with detailed brand performance reports and strategic insights.',
      benefits: ['Brand health reports', 'Performance analytics', 'Competitive analysis', 'ROI tracking']
    },
    {
      icon: Globe,
      title: 'Enterprise-Grade Security',
      description: 'Bank-level security for your client data with SOC 2 compliance and enterprise features.',
      benefits: ['SOC 2 compliance', 'Data encryption', 'Access controls', 'Audit logs']
    }
  ];

  const testimonials = [
    {
      quote: "Brandie has transformed our agency. We can now deliver Fortune 500-quality brand identities to all our clients, regardless of budget. Our team productivity has increased 500%.",
      author: "David Kim",
      role: "Creative Director",
      company: "Apex Creative Agency",
      clients: "50+ clients",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "The white-label capabilities are incredible. Our clients think we have a team of 20 brand strategists. It's just me and Brandie's AI.",
      author: "Lisa Rodriguez",
      role: "Agency Owner",
      company: "Brand Collective",
      clients: "100+ clients",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "We've reduced our brand development timeline from 8 weeks to 2 days while maintaining the same quality. Our clients are amazed by the speed and results.",
      author: "James Wilson",
      role: "Strategy Director",
      company: "Future Brand Studios",
      clients: "200+ clients",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const agencyStats = [
    { number: "500+", label: "Agencies", icon: Building2 },
    { number: "50,000+", label: "Client Brands", icon: Users },
    { number: "2 days", label: "Avg. Delivery", icon: Clock },
    { number: "98%", label: "Client Retention", icon: Star },
  ];

  const pricingFeatures = [
    'Unlimited client brands',
    'Team collaboration tools',
    'White-label presentation',
    'Client reporting dashboard',
    'Priority support',
    'Custom integrations',
    'Enterprise security',
    'Dedicated account manager'
  ];

  return (
    <div className="min-h-screen bg-void text-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-grid pt-32 cyber-overlay">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl"
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
              className="inline-flex items-center space-x-2 glass-accent border border-neon-cyan/20 rounded-full px-6 py-3 mb-8"
            >
              <Building2 className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-semibold text-neon-cyan font-terminal">AGENCY_OPTIMIZED</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-cyber-hero font-black text-light mb-8 text-balance"
            >
              Scale your agency with
              <span className="block gradient-ai-text">AI-powered branding</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-dark-100 mb-12 max-w-4xl mx-auto leading-relaxed text-balance font-terminal"
            >
              Deliver Fortune 500-quality brand identities to all your clients. 
              Increase capacity 10x without hiring. White-label ready.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link to="/auth">
                <Button className="btn-ai-primary text-lg px-10 py-5 group neon-glow-cyan">
                  <Terminal className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  <span className="font-terminal">./start_agency_trial</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button className="btn-terminal text-lg px-10 py-5 group">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-terminal">./book_demo</span>
              </Button>
            </motion.div>

            {/* Agency Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {agencyStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-ai rounded-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 neon-glow">
                    <stat.icon className="w-6 h-6 text-void" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-light mb-1 font-terminal">{stat.number}</div>
                  <div className="text-sm text-dark-100 font-medium font-terminal">{stat.label}</div>
                </motion.div>
              ))}
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
              Transform your agency with 
              <span className="gradient-ai-text"> AI superpowers</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              Built specifically for agencies who want to scale without compromising quality.
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
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-ai rounded-2xl group-hover:scale-110 transition-transform duration-300 neon-glow">
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
                  <span className={`text-xs text-${benefit.accent} font-terminal`}>// AGENCY_OPTIMIZED</span>
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
              Enterprise features for 
              <span className="gradient-ai-text"> growing agencies</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              Everything you need to manage multiple clients and deliver exceptional results.
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
                  <span className="text-xs text-neon-cyan font-terminal">// ENTERPRISE_FEATURE</span>
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
              Trusted by leading 
              <span className="gradient-ai-text"> creative agencies</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              See how top agencies are scaling their operations with Brandie.
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
                    <div className="text-xs text-neon-cyan font-semibold font-terminal">{testimonial.company} • {testimonial.clients}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
              Agency pricing that 
              <span className="gradient-ai-text"> scales with you</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              Start with our standard plan and upgrade to enterprise as your agency grows.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Standard Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="cyber-card p-8"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-light mb-2 font-terminal">AGENCY_STANDARD</h3>
                  <div className="text-4xl font-bold text-light mb-2 font-terminal">$49<span className="text-lg text-dark-100">/month</span></div>
                  <p className="text-dark-100 font-terminal">Perfect for growing agencies</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {pricingFeatures.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
                      <span className="text-dark-100 font-terminal">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth">
                  <Button className="btn-terminal w-full text-lg py-4">
                    <span className="font-terminal">./start_free_trial</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="cyber-card p-8 ring-2 ring-neon-cyan relative"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-ai text-void text-sm font-bold px-6 py-2 rounded-full font-terminal">
                  MOST_POPULAR
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-light mb-2 font-terminal">AGENCY_ENTERPRISE</h3>
                  <div className="text-4xl font-bold text-light mb-2 font-terminal">Custom<span className="text-lg text-dark-100"> pricing</span></div>
                  <p className="text-dark-100 font-terminal">For established agencies</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {pricingFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
                      <span className="text-dark-100 font-terminal">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="btn-ai-primary w-full text-lg py-4">
                  <span className="font-terminal">./contact_sales</span>
                </Button>
              </motion.div>
            </div>
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
              Ready to scale your agency?
            </h2>
            <p className="text-xl text-dark-100 mb-12 max-w-2xl mx-auto text-balance font-terminal">
              Join 500+ agencies who've transformed their operations with AI-powered branding.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button className="bg-light text-void hover:bg-dark-100 text-lg px-10 py-5 font-bold shadow-cyber group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  <span className="font-terminal">./start_agency_trial</span>
                </Button>
              </Link>
              <Link to="/for-startups">
                <Button className="glass-dark text-light border-dark-500 hover:bg-dark-800 text-lg px-10 py-5 font-semibold">
                  <span className="font-terminal">./are_you_a_startup</span>
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

export default ForAgencies;