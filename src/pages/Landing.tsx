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
  Type, 
  Activity,
  BarChart,
  Users,
  Layers,
  Download,
  CheckCircle,
  ArrowUp
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
      icon: Target,
      title: 'Brand Strategy',
      description: 'Define your purpose, values, and positioning with AI-guided insights'
    },
    {
      icon: Palette,
      title: 'Visual Identity',
      description: 'Create logos, color palettes, and typography that represent your brand'
    },
    {
      icon: MessageSquare,
      title: 'Brand Voice',
      description: 'Establish your communication style and messaging framework'
    },
    {
      icon: FileText,
      title: 'Brand Guidelines',
      description: 'Generate comprehensive guidelines to maintain brand consistency'
    },
    {
      icon: CheckCircle,
      title: 'Brand Consistency',
      description: 'Ensure your brand is consistently applied across all materials'
    },
    {
      icon: Activity,
      title: 'Brand Health',
      description: 'Monitor your brand\'s overall health with comprehensive metrics'
    }
  ];

  const testimonials = [
    {
      quote: "Brandie helped us create a complete brand identity in just two days. What would have taken weeks with an agency was done overnight.",
      author: "Sarah Johnson",
      role: "Founder, TechStart",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "The AI-powered suggestions were spot on. It felt like working with a seasoned brand strategist who really understood our vision.",
      author: "Michael Chen",
      role: "Marketing Director, Elevate",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      quote: "As a design agency, we now use Brandie for all our initial brand development. It's cut our process time in half.",
      author: "Alex Rivera",
      role: "Creative Director, Pixel Perfect",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 pt-32">
          {/* Bolt Logo */}
          <div className="absolute top-20 right-10 md:right-20 z-10">
            <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie//bolt_logo_dark.svg" 
                alt="Bolt Logo" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </a>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
                alt="Brandie Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build any brand
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> overnight</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              An AI-powered branding platform that helps founders and agencies create 
              compelling brand identities in hours, not weeks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="border-2">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 blur-xl"
        />
      </div>

      {/* Brands Showcase */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-lg text-gray-600">Trusted by innovative brands worldwide</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <div className="text-2xl font-bold text-gray-400">ACME</div>
            <div className="text-2xl font-bold text-gray-400">TechCorp</div>
            <div className="text-2xl font-bold text-gray-400">Innovate</div>
            <div className="text-2xl font-bold text-gray-400">FutureBrand</div>
            <div className="text-2xl font-bold text-gray-400">Elevate</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              How Brandie Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform guides you through every step of the brand building process,
              from strategy to guidelines.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer Simple Questions',
                description: 'Our AI asks strategic questions to understand your brand vision and goals.',
                icon: Brain
              },
              {
                step: '02',
                title: 'Review AI Suggestions',
                description: 'Get personalized recommendations for every aspect of your brand identity.',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Export Complete Brand',
                description: 'Download professional brand assets and comprehensive guidelines.',
                icon: FileText
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
              >
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-50 rounded-full opacity-50" />
                <div className="relative">
                  <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
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
              Everything you need to build a brand
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy to guidelines, our AI-powered platform guides you through 
              every step of the brand building process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/features">
              <Button 
                variant="outline" 
                className="border-2 flex items-center space-x-2"
              >
                <span>Explore All Features</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="py-24 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI to deliver professional branding results
              that would normally require an entire agency team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'DALL-E Logo Generation',
                description: 'Create unique, professional logos tailored to your brand personality and industry.',
                icon: Palette
              },
              {
                title: 'GPT-4 Brand Strategy',
                description: 'Develop comprehensive brand strategies with AI that understands market positioning.',
                icon: Brain
              },
              {
                title: 'Voice & Tone Analysis',
                description: 'Define your brand\'s communication style with advanced language processing.',
                icon: MessageSquare
              },
              {
                title: 'Color Psychology',
                description: 'Select scientifically-backed color palettes that evoke the right emotions.',
                icon: Zap
              },
              {
                title: 'Typography Science',
                description: 'Choose font pairings based on readability research and brand personality.',
                icon: Type
              },
              {
                title: 'Brand Health Analysis',
                description: 'Get AI-powered insights on your brand\'s strengths and improvement areas.',
                icon: Activity
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-blue-100">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
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
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of founders and agencies who trust Brandie to create 
              compelling brand identities.
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
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-24 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Brandie?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Brandie compares to traditional branding methods
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-3">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Feature</h3>
              </div>
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <h3 className="font-bold text-blue-600">Brandie</h3>
              </div>
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Traditional Agency</h3>
              </div>
            </div>

            {[
              { feature: 'Time to Complete', brandie: 'Hours', traditional: 'Weeks to Months' },
              { feature: 'Cost', brandie: 'Affordable Subscription', traditional: '$10,000+' },
              { feature: 'Revisions', brandie: 'Unlimited', traditional: 'Limited' },
              { feature: 'Brand Strategy', brandie: 'AI-Powered', traditional: 'Manual Process' },
              { feature: 'Visual Identity', brandie: 'DALL-E Generated', traditional: 'Designer Created' },
              { feature: 'Brand Guidelines', brandie: 'Automated', traditional: 'Manual Creation' }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-3">
                <div className="p-6 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{row.feature}</p>
                </div>
                <div className="p-6 border-b border-gray-200 bg-blue-50">
                  <p className="text-blue-600 font-medium flex items-center">
                    <Check className="w-5 h-5 mr-2" /> {row.brandie}
                  </p>
                </div>
                <div className="p-6 border-b border-gray-200">
                  <p className="text-gray-600">{row.traditional}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button 
                variant="outline" 
                className="border-2 flex items-center space-x-2"
              >
                <span>View Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
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
              Ready to build your brand?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of founders and agencies who trust Brandie to create 
              compelling brand identities overnight.
            </p>
            <Link to="/auth">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
              >
                Start Building Today
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
                <img 
                  src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
                  alt="Brandie Logo" 
                  className="w-10 h-10 object-contain bg-white rounded-xl p-1"
                />
                <h3 className="text-xl font-bold">Brandie</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Build every brand overnight with AI-powered branding tools.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Reviews</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Events</a></li>
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

// Star component for testimonials
const Star = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default Landing;