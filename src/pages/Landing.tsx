import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  DollarSign,
  FileText,
  Layers,
  MessageSquare,
  Palette,
  Play,
  Sparkles,
  Target,
  TrendingDown,
  Users,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Navbar } from '../components/layout/Navbar'
import { PoweredBySection } from '../components/ui/PoweredBySection'
import { ScrollToTop } from '../components/ui/ScrollToTop'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <HeroSection />
      <MirrorSection />
      <HiddenCostSection />
      <OldWorldSection />
      <ShiftSection />
      <SolutionSection />
      <HowItWorksSection />
      <ProofSection />
      <FinalCTASection />
      <Footer />

      <ScrollToTop />
    </div>
  )
}

const HeroSection: React.FC = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-electric-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm"
        >
          <span className="w-2 h-2 bg-electric-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">For founders who refuse to look amateur</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-[1.1]">
          <span className="block">Look like a $10M company</span>
          <span className="block mt-2 bg-gradient-to-r from-electric-blue-500 to-gray-700 bg-clip-text text-transparent">
            before you've raised a dollar.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Complete brand identity in 24 hours. Strategy, visuals, voice, guidelines.
          <span className="block mt-2 text-gray-500">No agency. No months of waiting. No $50k invoice.</span>
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/auth">
            <Button className="btn-primary text-lg px-10 py-5 group shadow-lg hover:shadow-xl">
              Start Building Your Brand
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/features" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <Play className="w-5 h-5" />
            See how it works
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-sm text-gray-500"
        >
          Free to start. No credit card required.
        </motion.p>
      </motion.div>
    </div>
  </section>
)

const MirrorSection: React.FC = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="max-w-4xl mx-auto px-6 md:px-12">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.p
          variants={fadeInUp}
          className="text-electric-blue-500 font-semibold tracking-wide uppercase text-sm"
        >
          Sound familiar?
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
        >
          You've built something real.
          <span className="block text-gray-400 mt-2">Your brand doesn't show it.</span>
        </motion.h2>

        <motion.div variants={fadeInUp} className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed">
          <p>
            You've got the product. The vision. The hustle. You know your thing is good.
          </p>
          <p>
            But every time you share your pitch deck, your website, your social presence... there's that slight cringe. That moment where you want to say "ignore the visuals, focus on what we're building."
          </p>
          <p className="text-gray-900 font-medium">
            You know a polished brand would change things. You just haven't had the time, budget, or access to make it happen.
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
)

const HiddenCostSection: React.FC = () => {
  const costs = [
    {
      icon: Users,
      title: "Investors who passed",
      description: "They didn't say it was the brand. But they noticed."
    },
    {
      icon: TrendingDown,
      title: "Customers who chose the competitor",
      description: "The one who 'looked more established.' Same product. Better packaging."
    },
    {
      icon: Clock,
      title: "Hours lost on Band-Aid fixes",
      description: "Tweaking Canva templates. Second-guessing colors. Starting over."
    },
    {
      icon: DollarSign,
      title: "Pricing power you don't have",
      description: "Amateur brands can't charge premium prices. Period."
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeInUp}
            className="text-electric-blue-400 font-semibold tracking-wide uppercase text-sm mb-4"
          >
            The real cost
          </motion.p>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            A weak brand isn't just embarrassing.
            <span className="block text-gray-500 mt-2">It's expensive.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-400 mb-16 max-w-2xl"
          >
            You're leaving money on the table every single day. Here's what it's actually costing you:
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {costs.map((cost, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex gap-5 p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                  <cost.icon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{cost.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{cost.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const OldWorldSection: React.FC = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="max-w-5xl mx-auto px-6 md:px-12">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeInUp}
          className="text-electric-blue-500 font-semibold tracking-wide uppercase text-sm mb-4"
        >
          The old options
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-16 leading-tight"
        >
          Two paths. Both broken.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            variants={fadeInUp}
            className="p-8 rounded-2xl border-2 border-gray-200 bg-gray-50"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm font-medium mb-6">
              Option A
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hire an agency</h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>$20,000 - $100,000+ investment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>3-6 months of back-and-forth</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>Built for their portfolio, not your speed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>Scope creep and revision hell</span>
              </li>
            </ul>
            <p className="mt-6 text-gray-500 italic">
              Perfect if you have money and time to burn.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-8 rounded-2xl border-2 border-gray-200 bg-gray-50"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm font-medium mb-6">
              Option B
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">DIY it yourself</h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>Canva templates and Pinterest inspo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>Inconsistent across every touchpoint</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>No strategic foundation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 mt-1">-</span>
                <span>Looks exactly like what it is: DIY</span>
              </li>
            </ul>
            <p className="mt-6 text-gray-500 italic">
              Saves money. Costs credibility.
            </p>
          </motion.div>
        </div>

        <motion.p
          variants={fadeInUp}
          className="text-center text-xl text-gray-600 mt-12"
        >
          Neither option fits startup reality. There had to be another way.
        </motion.p>
      </motion.div>
    </div>
  </section>
)

const ShiftSection: React.FC = () => (
  <section className="py-24 md:py-32 bg-gray-50">
    <div className="max-w-4xl mx-auto px-6 md:px-12">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center"
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 bg-electric-blue-50 border border-electric-blue-200 rounded-full px-4 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-electric-blue-500" />
          <span className="text-sm font-semibold text-electric-blue-700">The insight that changed everything</span>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight"
        >
          What if world-class branding
          <span className="block mt-2">followed patterns that AI could learn?</span>
        </motion.h2>

        <motion.div
          variants={fadeInUp}
          className="text-lg md:text-xl text-gray-600 leading-relaxed space-y-6 max-w-3xl mx-auto text-left md:text-center"
        >
          <p>
            Great brands aren't accidents. They're built on frameworks. Positioning strategies.
            Visual systems. Voice guidelines. Patterns that the best agencies have refined over decades.
          </p>
          <p>
            We realized: AI doesn't need to replace creativity.
            <span className="font-medium text-gray-900"> It needs to democratize access to strategic clarity.</span>
          </p>
          <p>
            The same frameworks that Fortune 500 companies pay millions for?
            Now available to any founder with a vision.
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
)

const SolutionSection: React.FC = () => {
  const capabilities = [
    {
      icon: Target,
      title: "Strategic Positioning",
      description: "Know exactly where you stand in your market. Messaging that differentiates. Purpose that resonates."
    },
    {
      icon: Palette,
      title: "Visual Identity System",
      description: "Logos, colors, typography that signal credibility instantly. Not templates. Custom assets for your brand."
    },
    {
      icon: MessageSquare,
      title: "Brand Voice Framework",
      description: "Sound like you, but polished. Consistent tone across every channel, every touchpoint, every team member."
    },
    {
      icon: FileText,
      title: "Professional Guidelines",
      description: "Export-ready brand book that keeps everything consistent as you scale. Agency-quality documentation."
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.p
              variants={fadeInUp}
              className="text-electric-blue-500 font-semibold tracking-wide uppercase text-sm mb-4"
            >
              Introducing Brandie
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Everything you need.
              <span className="block text-gray-400 mt-2">Nothing you don't.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Not a logo generator. Not a template library. A complete brand-building system
              that delivers agency-quality results in startup-friendly time.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-8 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-electric-blue-50 flex items-center justify-center mb-6 transition-colors">
                  <capability.icon className="w-7 h-7 text-gray-600 group-hover:text-electric-blue-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{capability.title}</h3>
                <p className="text-gray-600 leading-relaxed">{capability.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Tell us about your company",
      description: "5 minutes. Your vision, your audience, your competition. We capture the essence.",
      time: "5 min"
    },
    {
      number: "02",
      title: "AI builds your strategic foundation",
      description: "Positioning, values, archetype, messaging. The strategic clarity agencies charge thousands for.",
      time: "Instant"
    },
    {
      number: "03",
      title: "Generate your visual identity",
      description: "Logos, colors, typography. Customize until it feels right. Iterate without limits.",
      time: "Minutes"
    },
    {
      number: "04",
      title: "Export everything",
      description: "Brand guidelines, asset library, voice documentation. Ready to use immediately.",
      time: "Done"
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.p
              variants={fadeInUp}
              className="text-electric-blue-400 font-semibold tracking-wide uppercase text-sm mb-4"
            >
              How it works
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            >
              From zero to launch-ready.
              <span className="block text-gray-500 mt-2">In one sitting.</span>
            </motion.h2>
          </div>

          <motion.div
            variants={staggerContainer}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex gap-6 md:gap-8 p-6 md:p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex-shrink-0">
                  <span className="text-3xl md:text-4xl font-bold text-gray-700">{step.number}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-electric-blue-500/20 text-electric-blue-400 text-sm font-medium">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const ProofSection: React.FC = () => {
  const testimonials = [
    {
      quote: "We went into a Series A meeting with a brand that looked like we'd already raised. The investors commented on it. We closed.",
      author: "Sarah Chen",
      role: "Founder & CEO",
      company: "TechFlow",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "I was skeptical. An AI doing brand strategy? But the positioning work was sharper than what our previous agency delivered. In hours, not months.",
      author: "Marcus Rodriguez",
      role: "Creative Director",
      company: "Pixel Studios",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "We use Brandie for every new client project now. What used to take 4 weeks takes 2 days. Our margins have never been better.",
      author: "Elena Vasquez",
      role: "Agency Owner",
      company: "Brand Collective",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ]

  const metrics = [
    { value: "24 hrs", label: "Average completion time" },
    { value: "10,000+", label: "Brands created" },
    { value: "98%", label: "Satisfaction rate" }
  ]

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <motion.p
              variants={fadeInUp}
              className="text-electric-blue-500 font-semibold tracking-wide uppercase text-sm mb-4"
            >
              Don't take our word for it
            </motion.p>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Founders and agencies
              <span className="block text-gray-400 mt-2">building brands that close deals.</span>
            </motion.h2>
          </div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 mb-16 py-8 border-y border-gray-200"
          >
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <blockquote className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const FinalCTASection: React.FC = () => {
  const included = [
    "Complete brand strategy",
    "AI-generated visual identity",
    "Brand voice framework",
    "Professional guidelines export",
    "Unlimited iterations"
  ]

  return (
    <section className="py-24 md:py-32 bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Stop apologizing for your brand.
          </h2>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Your product is ready. Your brand should be too.
          </p>

          <div className="inline-flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10 text-sm text-gray-400">
            {included.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-electric-green-500" />
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-5 font-semibold shadow-xl group">
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button className="bg-transparent text-white border border-gray-700 hover:border-gray-500 text-lg px-10 py-5 font-semibold">
                See Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Free tier available. No credit card required to start.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

const Footer: React.FC = () => (
  <footer className="bg-gray-950 text-white py-16 border-t border-gray-900">
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-blue-500 to-electric-blue-600 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png"
                alt="Brandie Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold">Brandie</span>
              <span className="block text-xs text-gray-500 tracking-wider">AI BRAND BUILDER</span>
            </div>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Professional brand identity for founders who refuse to look amateur.
            Built by people who've been there.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-3">
            <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/for-startups" className="text-gray-400 hover:text-white transition-colors">For Startups</Link></li>
            <li><Link to="/for-agencies" className="text-gray-400 hover:text-white transition-colors">For Agencies</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-900">
        <PoweredBySection />
      </div>

      <div className="mt-8 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Brandie. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
          <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Security</a>
        </div>
      </div>
    </div>
  </footer>
)

export default Landing
