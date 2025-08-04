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
  Globe
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
      title: 'Launch in 24 Hours',
      description: 'Get your complete brand identity ready before your next investor meeting or product launch.',
      stat: '24hrs',
      statLabel: 'vs 8 weeks with agencies'
    },
    {
      icon: DollarSign,
      title: 'Startup-Friendly Pricing',
      description: 'Professional branding at a fraction of agency costs. Perfect for pre-seed to Series A startups.',
      stat: '$49/mo',
      statLabel: 'vs $15,000+ agency fees'
    },
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Get strategic insights typically available only to Fortune 500 companies with dedicated brand teams.',
      stat: '99.9%',
      statLabel: 'accuracy in brand recommendations'
    },
    {
      icon: Rocket,
      title: 'Scale-Ready Foundation',
      description: 'Build a brand foundation that grows with you from MVP to IPO. No rebranding needed.',
      stat: '10x',
      statLabel: 'faster than traditional methods'
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient pt-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-electric-green/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto container-padding section-padding">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-electric-green/10 border border-electric-green/30 rounded-full px-6 py-3 mb-8"
            >
              <Rocket className="w-4 h-4 text-electric-green" />
              <span className="text-sm font-semibold text-green-700">Built for Startups</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-hero font-black text-gray-900 mb-8 text-balance"
            >
              Launch your startup with a
              <span className="block gradient-text">world-class brand</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed text-balance"
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
                <Button className="btn-primary text-lg px-10 py-5 group shadow-glow hover:shadow-glow-lg">
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="btn-secondary text-lg px-10 py-5 group">
                  <DollarSign className="w-5 h-5 mr-2" />
                  View Startup Pricing
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-electric-green" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-electric-green" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-electric-green" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-display text-gray-900 mb-6 text-balance">
              Why startups choose 
              <span className="gradient-text"> Brandie</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
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
                className="luxury-card p-8 group"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-3">{benefit.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{benefit.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold gradient-text">{benefit.stat}</div>
                      <div className="text-sm text-gray-600">{benefit.statLabel}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-display text-gray-900 mb-6 text-balance">
              Everything your startup needs to 
              <span className="gradient-text"> build a brand</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              From strategy to execution, we've got every aspect of your brand covered.
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
                className="luxury-card p-8 group"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-luxury rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black">{feature.title}</h3>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-electric-green flex-shrink-0" />
                      <span className="text-gray-800">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-display text-gray-900 mb-6 text-balance">
              Trusted by successful 
              <span className="gradient-text"> startup founders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              See how other startups have accelerated their brand development with Brandie.
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
                className="luxury-card p-8 group"
              >
                <div className="flex text-electric-blue mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-electric-blue font-semibold">{testimonial.company} • {testimonial.funding}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-display text-gray-900 mb-6 text-balance">
              How Brandie compares for 
              <span className="gradient-text"> startups</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              See why thousands of startups choose Brandie over traditional agencies and DIY tools.
            </p>
          </motion.div>

          <div className="luxury-card overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
              <div className="p-6 font-bold text-gray-900">Feature</div>
              <div className="p-6 font-bold text-electric-blue bg-electric-blue/5">Brandie</div>
              <div className="p-6 font-bold text-gray-900">Agency</div>
              <div className="p-6 font-bold text-gray-900">DIY Tools</div>
            </div>

            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="grid grid-cols-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <div className="p-6 font-medium text-gray-900">{row.feature}</div>
                <div className="p-6 bg-electric-blue/5">
                  <div className="flex items-center space-x-2">
                    {row.brandie === true ? (
                      <Check className="w-5 h-5 text-electric-green" />
                    ) : (
                      <span className="font-semibold text-electric-blue">{row.brandie}</span>
                    )}
                  </div>
                </div>
                <div className="p-6 text-gray-600">{row.agency === true ? <Check className="w-5 h-5 text-gray-400" /> : row.agency}</div>
                <div className="p-6 text-gray-600">{row.diy === true ? <Check className="w-5 h-5 text-gray-400" /> : row.diy}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-electric-green/20 to-electric-blue/20"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-display text-white mb-6 text-balance">
              Ready to build your startup's brand?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto text-balance">
              Join thousands of successful startups who've accelerated their brand development with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-5 font-bold shadow-2xl group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/for-agencies">
                <Button className="glass-dark text-white border-white/20 hover:bg-white/10 text-lg px-10 py-5 font-semibold">
                  Are you an agency?
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