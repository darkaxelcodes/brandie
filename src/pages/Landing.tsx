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
  TrendingUp
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
      title: 'AI-Powered Strategy',
      description: 'Define your brand purpose, values, and positioning with advanced AI guidance'
    },
    {
      icon: Palette,
      title: 'DALL-E Visual Identity',
      description: 'Generate professional logos, color palettes, and typography using cutting-edge AI'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Brand Voice',
      description: 'Establish your communication style with AI-powered tone analysis'
    },
    {
      icon: FileText,
      title: 'Automated Guidelines',
      description: 'Generate comprehensive brand guidelines instantly with AI'
    },
    {
      icon: Shield,
      title: 'Brand Consistency',
      description: 'Ensure perfect brand application across all materials and platforms'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Monitor and optimize your brand health with AI-driven insights'
    }
  ];

  const testimonials = [
    {
      quote: "Brandie transformed our startup's branding process. What would have taken months with an agency was completed in 24 hours.",
      author: "Sarah Chen",
      role: "Founder, TechFlow",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      company: "TechFlow"
    },
    {
      quote: "The AI suggestions were incredibly accurate. It felt like working with a world-class brand strategist who understood our vision perfectly.",
      author: "Marcus Rodriguez",
      role: "Creative Director, Pixel Studios",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      company: "Pixel Studios"
    },
    {
      quote: "As an agency, Brandie has revolutionized how we deliver brand identities to clients. Our turnaround time is now 10x faster.",
      author: "Elena Vasquez",
      role: "Agency Owner, Brand Collective",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      company: "Brand Collective"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Brands Created", icon: Building2 },
    { number: "24hrs", label: "Average Completion", icon: Zap },
    { number: "98%", label: "Client Satisfaction", icon: Star },
    { number: "500+", label: "Agencies Trust Us", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
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
            className="absolute top-40 right-20 w-96 h-96 bg-electric-purple/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-electric-cyan/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto container-padding section-padding">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3 mb-8 shadow-lg"
            >
              <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-800">AI-Powered Brand Building</span>
              <Sparkles className="w-4 h-4 text-electric-blue" />
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-hero font-black text-gray-900 mb-8 text-balance"
            >
              Build any brand
              <span className="block gradient-text">overnight</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed text-balance"
            >
              The world's most advanced AI-powered branding platform. Create compelling brand identities 
              in hours, not weeks. Trusted by 10,000+ founders and agencies worldwide.
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
              <Link to="/features">
                <Button className="btn-secondary text-lg px-10 py-5 group">
                  <Globe className="w-5 h-5 mr-2" />
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
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
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-luxury rounded-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-black mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg text-gray-700 mb-12 font-medium">Trusted by innovative companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60">
              {['ACME', 'TechFlow', 'Innovate', 'FutureBrand', 'Elevate', 'Pixel Studios'].map((brand, index) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 0.6, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors cursor-default"
                >
                  {brand}
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Everything you need to build a 
              <span className="gradient-text"> world-class brand</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              From strategy to guidelines, our AI-powered platform guides you through 
              every step of professional brand development.
            </p>
          </motion.div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="luxury-card p-8 group hover:electric-glow"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
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
              <Button className="btn-secondary text-lg px-8 py-4 group">
                <span>Explore All Features</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="section-padding bg-gray-950 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #0066FF 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, #6366F1 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-display text-white mb-6 text-balance">
              Powered by the world's most 
              <span className="gradient-text"> advanced AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto text-balance">
              Our platform leverages GPT-4, DALL-E 3, and proprietary AI models to deliver 
              professional branding results that rival top agencies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'GPT-4 Strategy Engine',
                description: 'Advanced language models analyze your business context to create compelling brand strategies.',
                icon: Brain,
                gradient: 'from-electric-blue to-electric-purple'
              },
              {
                title: 'DALL-E 3 Logo Generation',
                description: 'Create unique, professional logos tailored to your brand personality and industry.',
                icon: Palette,
                gradient: 'from-electric-purple to-electric-cyan'
              },
              {
                title: 'Neural Voice Analysis',
                description: 'Define your brand\'s communication style with advanced natural language processing.',
                icon: MessageSquare,
                gradient: 'from-electric-cyan to-electric-green'
              },
              {
                title: 'Color Psychology AI',
                description: 'Select scientifically-backed color palettes that evoke the right emotions for your audience.',
                icon: Zap,
                gradient: 'from-electric-green to-electric-blue'
              },
              {
                title: 'Typography Intelligence',
                description: 'Choose font pairings based on readability research and brand personality alignment.',
                icon: FileText,
                gradient: 'from-electric-blue to-electric-purple'
              },
              {
                title: 'Brand Health Analytics',
                description: 'Get AI-powered insights on your brand\'s performance and improvement opportunities.',
                icon: TrendingUp,
                gradient: 'from-electric-purple to-electric-cyan'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-dark rounded-2xl p-8 group hover:bg-white/10 transition-all duration-300"
              >
                <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
              Loved by founders and 
              <span className="gradient-text"> agencies worldwide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
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
                    <div className="text-xs text-electric-blue font-semibold">{testimonial.company}</div>
                  </div>
                </div>
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
            className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-electric-purple/20 to-electric-cyan/20"
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
              Ready to transform your brand?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto text-balance">
              Join the AI revolution in branding. Create professional brand identities 
              that compete with the world's best agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-5 font-bold shadow-2xl group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Building Today
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="glass-dark text-white border-white/20 hover:bg-white/10 text-lg px-10 py-5 font-semibold">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-luxury rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
                    alt="Brandie Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Brandie</h3>
                  <div className="text-xs text-gray-500 font-medium tracking-wide">AI BRAND BUILDER</div>
                </div>
              </div>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-md">
                Build every brand overnight with the world's most advanced AI-powered branding platform.
              </p>
              <div className="flex space-x-6">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Product</h3>
              <ul className="space-y-4">
                <li><Link to="/for-startups" className="text-gray-400 hover:text-white transition-colors">For Startups</Link></li>
                <li><Link to="/for-agencies" className="text-gray-400 hover:text-white transition-colors">For Agencies</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          {/* Powered By Section */}
          <div className="mt-20 pt-12 border-t border-gray-800">
            <PoweredBySection />
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Brandie. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default Landing;