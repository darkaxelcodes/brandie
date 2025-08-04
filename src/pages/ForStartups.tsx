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
  Rocket,
  Shield,
  Users,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { PoweredBySection } from '../components/ui/PoweredBySection';

export const ForStartups: React.FC = () => {
  const startupFeatures = [
    {
      icon: Clock,
      title: 'Launch in Hours, Not Months',
      description: 'Get your complete brand identity ready in 24-48 hours instead of waiting weeks for agencies',
      benefit: 'Faster time to market'
    },
    {
      icon: DollarSign,
      title: 'Startup-Friendly Pricing',
      description: 'Professional branding at a fraction of agency costs - perfect for bootstrap budgets',
      benefit: 'Save $10,000+ vs agencies'
    },
    {
      icon: Brain,
      title: 'AI-Guided Strategy',
      description: 'No design experience needed - our AI guides you through every branding decision',
      benefit: 'No expertise required'
    },
    {
      icon: Rocket,
      title: 'Investor-Ready Materials',
      description: 'Generate professional pitch decks, brand guidelines, and marketing materials',
      benefit: 'Impress investors'
    },
    {
      icon: TrendingUp,
      title: 'Scale-Ready Foundation',
      description: 'Build a brand foundation that grows with your startup from MVP to IPO',
      benefit: 'Future-proof branding'
    },
    {
      icon: Shield,
      title: 'Competitive Differentiation',
      description: 'Stand out in crowded markets with AI-powered competitive analysis and positioning',
      benefit: 'Market advantage'
    }
  ];

  const startupTestimonials = [
    {
      quote: "Brandie helped us create our entire brand identity in one weekend. We went from idea to investor-ready pitch deck in 48 hours.",
      author: "Sarah Chen",
      role: "Founder & CEO, TechFlow",
      company: "Y Combinator S23",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "As a technical founder, I had zero design skills. Brandie's AI walked me through everything and created a brand that looks like we hired a top agency.",
      author: "Marcus Rodriguez",
      role: "CTO & Co-founder, DataVault",
      company: "Techstars Graduate",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "We saved over $15,000 on branding costs and used that money for product development instead. Best decision we made in our early days.",
      author: "Emily Watson",
      role: "Founder, GreenTech Solutions",
      company: "Seed Stage",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const pricingComparison = [
    { feature: 'Complete Brand Identity', brandie: 'Included', agency: '$15,000+', diy: 'Weeks of work' },
    { feature: 'Logo Design', brandie: 'AI-Generated', agency: '$3,000+', diy: 'Generic templates' },
    { feature: 'Brand Strategy', brandie: 'AI-Guided', agency: '$5,000+', diy: 'Guesswork' },
    { feature: 'Brand Guidelines', brandie: 'Auto-Generated', agency: '$2,000+', diy: 'Not included' },
    { feature: 'Time to Complete', brandie: '24-48 hours', agency: '4-8 weeks', diy: '2-4 weeks' },
    { feature: 'Revisions', brandie: 'Unlimited', agency: '3-5 rounds', diy: 'Start over' }
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
              <Rocket className="w-4 h-4" />
              <span>Perfect for Early-Stage Startups</span>
            </motion.div>
            
            <h1 className="font-heading font-bold text-neutral-900 mb-8 leading-tight">
              Launch Your Startup with a
              <span className="text-luxury-gradient block mt-2">Professional Brand Identity</span>
              <span className="block mt-2">in 24 Hours</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Skip the expensive agencies and months of back-and-forth. Our AI-powered platform 
              creates investor-ready brand identities that help startups stand out and scale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="bg-ai-gradient shadow-glow hover:shadow-glow-lg">
                  <span>Start Building Your Brand</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary" size="lg" className="border-2">
                  <span>View Startup Pricing</span>
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-heading font-semibold">4.9/5 from 500+ startups</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-heading font-semibold">Trusted by Y Combinator startups</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating AI Elements */}
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

      {/* Why Startups Choose Brandie */}
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
              Why 500+ Startups Choose Brandie
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From idea to investor pitch, we help startups build brands that attract customers, 
              investors, and top talent.
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

      {/* Pricing Comparison */}
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
              Save Your Runway for What Matters
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Compare the real cost of professional branding for startups
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <div className="grid grid-cols-4 bg-neutral-100">
              <div className="p-6">
                <h3 className="font-heading font-bold text-neutral-900">Feature</h3>
              </div>
              <div className="p-6 bg-primary-50">
                <h3 className="font-heading font-bold text-primary-700">Brandie</h3>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-neutral-900">Agency</h3>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-neutral-900">DIY</h3>
              </div>
            </div>

            {pricingComparison.map((row, index) => (
              <div key={index} className="grid grid-cols-4 border-t border-neutral-200">
                <div className="p-6">
                  <p className="font-heading font-medium text-neutral-900">{row.feature}</p>
                </div>
                <div className="p-6 bg-primary-50/50">
                  <p className="text-primary-700 font-heading font-semibold flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    {row.brandie}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-neutral-600 font-heading">{row.agency}</p>
                </div>
                <div className="p-6">
                  <p className="text-neutral-600 font-heading">{row.diy}</p>
                </div>
              </div>
            ))}
          </Card>
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
              Trusted by Successful Startups
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Join hundreds of founders who've built successful brands with Brandie
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {startupTestimonials.map((testimonial, index) => (
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
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works for Startups */}
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
              From Idea to Brand in 3 Simple Steps
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Our AI-powered process is designed specifically for busy founders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Us Your Vision',
                description: 'Answer simple questions about your startup, target market, and goals. Takes 10 minutes.',
                icon: MessageSquare,
                time: '10 min'
              },
              {
                step: '02',
                title: 'AI Creates Your Brand',
                description: 'Our AI generates logos, colors, typography, and messaging tailored to your startup.',
                icon: Brain,
                time: '2-4 hours'
              },
              {
                step: '03',
                title: 'Launch & Scale',
                description: 'Download everything you need: assets, guidelines, and investor-ready materials.',
                icon: Rocket,
                time: 'Instant'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="relative">
                  <div className="text-6xl font-bold text-white/20 mb-4">{item.step}</div>
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4">{item.title}</h3>
                  <p className="text-primary-100 mb-4 leading-relaxed">{item.description}</p>
                  <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-sm font-heading font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-luxury bg-white">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading font-bold text-neutral-900 mb-6">
              Ready to Build Your Startup Brand?
            </h2>
            <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
              Join hundreds of successful startups who've launched with professional 
              brand identities created in hours, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="bg-ai-gradient shadow-glow hover:shadow-glow-lg">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg" className="border-2">
                  <span>Explore Features</span>
                </Button>
              </Link>
            </div>

            <div className="text-center text-neutral-500">
              <p className="font-heading font-medium">
                ✨ 14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
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
                Build every brand overnight with AI-powered branding tools designed for startups.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">For Startups</h3>
              <ul className="space-y-3">
                <li><Link to="/for-startups" className="text-neutral-400 hover:text-white transition-colors">Why Brandie</Link></li>
                <li><Link to="/pricing" className="text-neutral-400 hover:text-white transition-colors">Startup Pricing</Link></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-neutral-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-neutral-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact</a></li>
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

export default ForStartups;