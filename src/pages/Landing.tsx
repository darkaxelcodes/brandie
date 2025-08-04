import React from 'react'
import { motion } from 'framer-motion'
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
  Star,
  Users,
  Building2,
  Rocket,
  Shield,
  Globe,
  TrendingUp,
  Terminal,
  Grid3X3,
  Code,
  Database,
  Cpu
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Navbar } from '../components/layout/Navbar'
import { PoweredBySection } from '../components/ui/PoweredBySection'
import { ScrollToTop } from '../components/ui/ScrollToTop'

export const Landing: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Neural Brand Strategy',
      description: 'AI-powered strategic analysis using advanced language models and market intelligence'
    },
    {
      icon: Palette,
      title: 'DALL-E Visual Generation',
      description: 'Generate professional logos and visual assets using cutting-edge AI image generation'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Voice Synthesis',
      description: 'Define brand communication patterns with natural language processing algorithms'
    },
    {
      icon: FileText,
      title: 'Automated Documentation',
      description: 'Generate comprehensive brand guidelines with structured data and version control'
    },
    {
      icon: Shield,
      title: 'Brand Consistency Engine',
      description: 'Ensure perfect brand application across all materials with AI-powered compliance checking'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Monitor and optimize brand health with real-time data analysis and insights'
    }
  ];

  const testimonials = [
    {
      quote: "Brandie's AI completely transformed our brand development process. What used to take our agency 8 weeks now takes 2 days.",
      author: "Sarah Chen",
      role: "Creative Director",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      company: "TechFlow Studios"
    },
    {
      quote: "The AI suggestions were incredibly accurate. It felt like working with a senior brand strategist who understood our vision perfectly.",
      author: "Marcus Rodriguez",
      role: "Founder & CEO",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      company: "DataVault Inc"
    },
    {
      quote: "As an agency, Brandie has revolutionized our client delivery. We can now handle 5x more projects with the same team size.",
      author: "Elena Vasquez",
      role: "Agency Owner",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      company: "Future Brand Collective"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Brands Generated", icon: Building2 },
    { number: "24hrs", label: "Average Completion", icon: Zap },
    { number: "99.2%", label: "AI Accuracy Rate", icon: Cpu },
    { number: "500+", label: "Agencies Powered", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-void text-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-grid cyber-overlay">
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
          <motion.div
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 4 }}
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
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-neon-green font-terminal">NEURAL_BRAND_ENGINE_v2.0</span>
              <Terminal className="w-4 h-4 text-neon-green" />
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-cyber-hero font-black text-light mb-8 text-balance"
            >
              Build any brand
              <span className="block gradient-ai-text">overnight</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-dark-100 mb-12 max-w-4xl mx-auto leading-relaxed text-balance font-terminal"
            >
              The world's most advanced AI-powered branding platform. Create compelling brand identities 
              in hours, not weeks. Trusted by 10,000+ founders and agencies worldwide.
            </motion.p>
            
            {/* Terminal-style CTA */}
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
              <Link to="/features">
                <Button className="btn-terminal text-lg px-10 py-5 group">
                  <Code className="w-5 h-5 mr-2" />
                  <span className="font-terminal">./explore_features</span>
                </Button>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
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

      {/* Social Proof */}
      <section className="py-16 bg-dark-950/50 border-y border-dark-500">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg text-dark-100 mb-12 font-medium font-terminal">// Trusted by innovative companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60">
              {['ACME_CORP', 'TECHFLOW', 'INNOVATE_AI', 'FUTUREBRAND', 'ELEVATE_LABS', 'PIXEL_STUDIOS'].map((brand, index) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 0.6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-2xl font-bold text-dark-400 hover:text-neon-green transition-colors cursor-default font-terminal"
                >
                  {brand}
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Everything you need to build a 
              <span className="gradient-ai-text"> world-class brand</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              From neural strategy analysis to automated guidelines generation, 
              our AI-powered platform handles every aspect of professional brand development.
            </p>
          </motion.div>

          <div className="feature-grid-cyber">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="cyber-card p-8 group holographic"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-ai rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 neon-glow">
                  <feature.icon className="w-8 h-8 text-void" />
                </div>
                <h3 className="text-xl font-bold text-light mb-4 font-terminal">{feature.title}</h3>
                <p className="text-dark-100 leading-relaxed">{feature.description}</p>
                
                {/* Terminal-style accent */}
                <div className="mt-4 pt-4 border-t border-dark-500">
                  <span className="text-xs text-neon-green font-terminal">// AI_POWERED</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link to="/features">
              <Button className="btn-terminal text-lg px-8 py-4 group">
                <span className="font-terminal">./explore_all_features</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="section-padding-cyber bg-void relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animated-grid"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              Powered by the world's most 
              <span className="gradient-ai-text"> advanced AI</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              Our platform leverages GPT-4, DALL-E 3, and proprietary neural networks to deliver 
              professional branding results that rival top agencies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'GPT-4 Strategy Engine',
                description: 'Advanced language models analyze your business context to create compelling brand strategies.',
                icon: Brain,
                accent: 'neon-green'
              },
              {
                title: 'DALL-E 3 Logo Generation',
                description: 'Create unique, professional logos tailored to your brand personality and industry.',
                icon: Palette,
                accent: 'neon-cyan'
              },
              {
                title: 'Neural Voice Analysis',
                description: 'Define your brand\'s communication style with advanced natural language processing.',
                icon: MessageSquare,
                accent: 'neon-magenta'
              },
              {
                title: 'Color Psychology AI',
                description: 'Select scientifically-backed color palettes that evoke the right emotions for your audience.',
                icon: Zap,
                accent: 'neon-green'
              },
              {
                title: 'Typography Intelligence',
                description: 'Choose font pairings based on readability research and brand personality alignment.',
                icon: FileText,
                accent: 'neon-cyan'
              },
              {
                title: 'Brand Health Analytics',
                description: 'Get AI-powered insights on your brand\'s performance and improvement opportunities.',
                icon: TrendingUp,
                accent: 'neon-magenta'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-8 group hover:bg-dark-800/50 transition-all duration-300 border border-dark-500"
              >
                <div className={`flex items-center justify-center w-14 h-14 bg-gradient-ai rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 neon-glow`}>
                  <item.icon className="w-7 h-7 text-void" />
                </div>
                <h3 className="text-xl font-bold text-light mb-4 font-terminal">{item.title}</h3>
                <p className="text-dark-100 leading-relaxed">{item.description}</p>
                
                {/* Terminal accent */}
                <div className="mt-4 pt-4 border-t border-dark-500">
                  <span className={`text-xs text-${item.accent} font-terminal`}>// NEURAL_NETWORK</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding-cyber bg-dark-950 border-y border-dark-500">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-cyber-display text-light mb-6 text-balance">
              Loved by founders and 
              <span className="gradient-ai-text"> agencies worldwide</span>
            </h2>
            <p className="text-xl text-dark-100 max-w-3xl mx-auto text-balance font-terminal">
              Join thousands of professionals who trust Brandie to create 
              exceptional brand identities.
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
                    <div className="text-xs text-neon-green font-semibold font-terminal">{testimonial.company}</div>
                  </div>
                </div>
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
              Ready to transform your brand?
            </h2>
            <p className="text-xl text-dark-100 mb-12 max-w-2xl mx-auto text-balance font-terminal">
              Join the AI revolution in branding. Create professional brand identities 
              that compete with the world's best agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button className="bg-light text-void hover:bg-dark-100 text-lg px-10 py-5 font-bold shadow-cyber group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  <span className="font-terminal">./start_building_today</span>
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="glass-dark text-light border-dark-500 hover:bg-dark-800 text-lg px-10 py-5 font-semibold">
                  <span className="font-terminal">./view_pricing</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-void text-light py-20 border-t border-dark-500">
        <div className="max-w-7xl mx-auto container-padding-cyber">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-ai rounded-xl flex items-center justify-center neon-glow">
                  <Terminal className="w-6 h-6 text-void" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Brandie</h3>
                  <div className="text-xs text-neon-green font-terminal tracking-wider">AI BRAND BUILDER</div>
                </div>
              </div>
              <p className="text-dark-100 mb-8 text-lg leading-relaxed max-w-md font-terminal">
                Build every brand overnight with the world's most advanced AI-powered branding platform.
              </p>
              <div className="flex space-x-6">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors border border-dark-500 hover:border-neon-green"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-dark-400 rounded"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 font-terminal">// PRODUCT</h3>
              <ul className="space-y-4">
                <li><Link to="/for-startups" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./for_startups</Link></li>
                <li><Link to="/for-agencies" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./for_agencies</Link></li>
                <li><Link to="/features" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./features</Link></li>
                <li><Link to="/pricing" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 font-terminal">// COMPANY</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./about</a></li>
                <li><a href="#" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./blog</a></li>
                <li><a href="#" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./careers</a></li>
                <li><a href="#" className="text-dark-100 hover:text-neon-green transition-colors font-terminal">./contact</a></li>
              </ul>
            </div>
          </div>
          
          {/* Powered By Section */}
          <div className="mt-20 pt-12 border-t border-dark-500">
            <PoweredBySection />
          </div>
          
          <div className="mt-12 pt-8 border-t border-dark-500 flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-100 text-sm font-terminal">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-dark-100 hover:text-neon-green text-sm transition-colors font-terminal">./privacy</a>
              <a href="#" className="text-dark-100 hover:text-neon-green text-sm transition-colors font-terminal">./terms</a>
              <a href="#" className="text-dark-100 hover:text-neon-green text-sm transition-colors font-terminal">./security</a>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default Landing;