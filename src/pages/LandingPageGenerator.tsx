import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Globe, 
  Eye, 
  Download, 
  Sparkles, 
  Rocket, 
  Code, 
  Palette,
  Type,
  MessageSquare,
  Target,
  Zap,
  Check,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { brandService } from '../lib/brandService'
import { visualService } from '../lib/visualService'
import { landingPageService } from '../lib/landingPageService'
import { Brand } from '../types/brand'
import { useToast } from '../contexts/ToastContext'
import { TourButton } from '../components/ui/TourButton'

interface LandingPageData {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  ctaUrl: string
  features: Array<{
    title: string
    description: string
    icon: string
  }>
  testimonials: Array<{
    quote: string
    author: string
    role: string
    company: string
    avatar: string
  }>
  socialProof: string[]
  footerText: string
  contactEmail: string
  template: 'startup' | 'agency' | 'saas' | 'portfolio' | 'ecommerce'
  style: 'minimal' | 'modern' | 'bold' | 'elegant'
}

export const LandingPageGenerator: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [brandData, setBrandData] = useState<any>(null)
  const [landingPageData, setLandingPageData] = useState<LandingPageData>({
    heroTitle: '',
    heroSubtitle: '',
    ctaText: 'Get Started',
    ctaUrl: '#',
    features: [],
    testimonials: [],
    socialProof: [],
    footerText: '',
    contactEmail: '',
    template: 'startup',
    style: 'modern'
  })
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'preview' | 'deploy'>('content')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string>('')

  useEffect(() => {
    if (!brandId) {
      navigate('/dashboard')
      return
    }

    // Handle 'new' brandId case - don't fetch from database
    if (brandId === 'new') {
      setLoading(false)
      setBrand({
        id: 'new',
        name: 'New Brand',
        user_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_favorite: false,
        archived: false,
        industry: null,
        industry_details: {}
      })
      setBrandData({
        brand: {
          id: 'new',
          name: 'New Brand',
          user_id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          archived: false,
          industry: null,
          industry_details: {}
        },
        strategy: {},
        visual: {},
        voice: null
      })
      return
    }

    loadBrandData()
  }, [brandId])

  const loadBrandData = async () => {
    try {
      setLoading(true)
      const [brandInfo, strategyData, visualAssets, brandVoice] = await Promise.all([
        brandService.getBrand(brandId!),
        brandService.getStrategyFormData(brandId!),
        visualService.getVisualAssets(brandId!),
        visualService.getBrandVoice(brandId!)
      ])

      if (!brandInfo) {
        navigate('/dashboard')
        return
      }

      setBrand(brandInfo)
      
      const compiledData = {
        brand: brandInfo,
        strategy: strategyData,
        visual: {
          logo: visualAssets.find(a => a.asset_type === 'logo')?.asset_data,
          colors: visualAssets.find(a => a.asset_type === 'color_palette')?.asset_data,
          typography: visualAssets.find(a => a.asset_type === 'typography')?.asset_data
        },
        voice: brandVoice
      }

      setBrandData(compiledData)
      
      // Pre-populate landing page data from brand data
      setLandingPageData(prev => ({
        ...prev,
        heroTitle: strategyData.purpose?.mission || `${brandInfo.name} - Innovation Simplified`,
        heroSubtitle: strategyData.values?.positioning || 'Transform your business with cutting-edge solutions',
        footerText: `© ${new Date().getFullYear()} ${brandInfo.name}. All rights reserved.`,
        contactEmail: 'hello@' + brandInfo.name.toLowerCase().replace(/\s+/g, '') + '.com',
        features: generateDefaultFeatures(strategyData),
        testimonials: generateDefaultTestimonials(brandInfo.name)
      }))
    } catch (error) {
      console.error('Error loading brand data:', error)
      showToast('error', 'Failed to load brand data')
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultFeatures = (strategy: any) => {
    const defaultFeatures = [
      {
        title: 'Fast & Reliable',
        description: 'Get results quickly with our optimized platform',
        icon: 'zap'
      },
      {
        title: 'Easy to Use',
        description: 'Intuitive interface designed for everyone',
        icon: 'target'
      },
      {
        title: '24/7 Support',
        description: 'We\'re here to help whenever you need us',
        icon: 'message-square'
      }
    ]

    if (strategy?.values?.coreValues) {
      return strategy.values.coreValues.slice(0, 3).map((value: string, index: number) => ({
        title: value,
        description: `Experience the power of ${value.toLowerCase()} in everything we do`,
        icon: ['zap', 'target', 'message-square'][index] || 'sparkles'
      }))
    }

    return defaultFeatures
  }

  const generateDefaultTestimonials = (brandName: string) => [
    {
      quote: `${brandName} transformed our business completely. The results exceeded our expectations.`,
      author: 'Sarah Chen',
      role: 'CEO',
      company: 'TechFlow',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      quote: `Working with ${brandName} was a game-changer. Highly recommend their services.`,
      author: 'Marcus Rodriguez',
      role: 'Founder',
      company: 'InnovateCorp',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ]

  const generateAIContent = async () => {
    if (!brandData) return

    setGenerating(true)
    try {
      const generatedContent = await landingPageService.generateLandingPageContent(brandData, landingPageData.template)
      
      setLandingPageData(prev => ({
        ...prev,
        ...generatedContent
      }))
      
      showToast('success', 'AI content generated successfully')
    } catch (error) {
      console.error('Error generating AI content:', error)
      showToast('error', 'Failed to generate AI content')
    } finally {
      setGenerating(false)
    }
  }

  const generatePreview = async () => {
    if (!brandData) return

    try {
      const html = await landingPageService.generateLandingPageHTML(brandData, landingPageData)
      setPreviewHtml(html)
      setActiveTab('preview')
    } catch (error) {
      console.error('Error generating preview:', error)
      showToast('error', 'Failed to generate preview')
    }
  }

  const deployLandingPage = async () => {
    if (!brandData || !previewHtml) return

    setDeploying(true)
    try {
      const deploymentUrl = await landingPageService.deployLandingPage(brandData, previewHtml)
      setDeployedUrl(deploymentUrl)
      showToast('success', 'Landing page deployed successfully!')
    } catch (error) {
      console.error('Error deploying landing page:', error)
      showToast('error', 'Failed to deploy landing page')
    } finally {
      setDeploying(false)
    }
  }

  const updateLandingPageData = (field: keyof LandingPageData, value: any) => {
    setLandingPageData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addFeature = () => {
    setLandingPageData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', description: '', icon: 'sparkles' }]
    }))
  }

  const updateFeature = (index: number, field: string, value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }))
  }

  const removeFeature = (index: number) => {
    setLandingPageData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addTestimonial = () => {
    setLandingPageData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { 
        quote: '', 
        author: '', 
        role: '', 
        company: '', 
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
      }]
    }))
  }

  const updateTestimonial = (index: number, field: string, value: string) => {
    setLandingPageData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }))
  }

  const removeTestimonial = (index: number) => {
    setLandingPageData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading landing page generator...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { 
      id: 'content', 
      label: 'Content', 
      icon: MessageSquare,
      description: 'Define your content'
    },
    { 
      id: 'design', 
      label: 'Design', 
      icon: Palette,
      description: 'Choose template & style'
    },
    { 
      id: 'preview', 
      label: 'Preview', 
      icon: Eye,
      description: 'See your landing page'
    },
    { 
      id: 'deploy', 
      label: 'Deploy', 
      icon: Rocket,
      description: 'Publish your site'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              <Globe className="w-8 h-8 text-electric-blue" />
              Landing Page Generator
            </h1>
            <p className="text-gray-700 mt-1">
              Create a professional landing page for {brand?.name} using your brand assets
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TourButton tourId="landing-generator" />
            <Button
              onClick={generateAIContent}
              loading={generating}
              className="flex items-center space-x-2 bg-gradient-luxury"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate with AI</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Brand Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold text-black mb-4">Brand Context Available</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-luxury rounded-xl shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-black">Strategy</p>
                <p className="text-sm text-gray-700">
                  {brandData?.strategy?.purpose ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-electric-purple to-purple-600 rounded-xl shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-black">Visual</p>
                <p className="text-sm text-gray-700">
                  {brandData?.visual?.logo ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-electric-green to-green-600 rounded-xl shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-black">Voice</p>
                <p className="text-sm text-gray-700">
                  {brandData?.voice ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl shadow-lg">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-black">Ready</p>
                <p className="text-sm text-gray-700">Generate Page</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-2">
          <div className="grid md:grid-cols-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex flex-col items-center space-y-2 px-6 py-4 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-luxury text-white shadow-lg'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </div>
                <span className={`text-xs ${
                  activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {tab.description}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Hero Section</h3>
              <div className="space-y-4">
                <Input
                  label="Hero Title"
                  value={landingPageData.heroTitle}
                  onChange={(e) => updateLandingPageData('heroTitle', e.target.value)}
                  placeholder="Transform your business with AI"
                />
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    value={landingPageData.heroSubtitle}
                    onChange={(e) => updateLandingPageData('heroSubtitle', e.target.value)}
                    placeholder="Discover how our innovative solutions can help you achieve your goals faster than ever before."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue-500 focus:border-transparent hover:border-gray-400 font-medium"
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="CTA Button Text"
                    value={landingPageData.ctaText}
                    onChange={(e) => updateLandingPageData('ctaText', e.target.value)}
                    placeholder="Get Started Free"
                  />
                  <Input
                    label="CTA URL"
                    value={landingPageData.ctaUrl}
                    onChange={(e) => updateLandingPageData('ctaUrl', e.target.value)}
                    placeholder="https://app.yourdomain.com/signup"
                  />
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black">Features</h3>
                <Button onClick={addFeature} size="sm" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-4">
                {landingPageData.features.map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-black">Feature {index + 1}</h4>
                      <Button
                        onClick={() => removeFeature(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="Title"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        placeholder="Feature title"
                      />
                      <Input
                        label="Description"
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        placeholder="Feature description"
                      />
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Icon
                        </label>
                        <select
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue-500 focus:border-transparent hover:border-gray-400 font-medium"
                        >
                          <option value="zap">⚡ Zap</option>
                          <option value="target">🎯 Target</option>
                          <option value="message-square">💬 Message</option>
                          <option value="sparkles">✨ Sparkles</option>
                          <option value="rocket">🚀 Rocket</option>
                          <option value="shield">🛡️ Shield</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Testimonials */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black">Testimonials</h3>
                <Button onClick={addTestimonial} size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
              <div className="space-y-4">
                {landingPageData.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-black">Testimonial {index + 1}</h4>
                      <Button
                        onClick={() => removeTestimonial(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Quote
                        </label>
                        <textarea
                          value={testimonial.quote}
                          onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                          placeholder="This product changed our business completely..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue-500 focus:border-transparent hover:border-gray-400 font-medium"
                          rows={2}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="Author"
                          value={testimonial.author}
                          onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                          placeholder="John Doe"
                        />
                        <Input
                          label="Role"
                          value={testimonial.role}
                          onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                          placeholder="CEO"
                        />
                        <Input
                          label="Company"
                          value={testimonial.company}
                          onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                          placeholder="TechCorp"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  value={landingPageData.contactEmail}
                  onChange={(e) => updateLandingPageData('contactEmail', e.target.value)}
                  placeholder="hello@yourdomain.com"
                />
                <Input
                  label="Footer Text"
                  value={landingPageData.footerText}
                  onChange={(e) => updateLandingPageData('footerText', e.target.value)}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Template</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: 'startup', name: 'Startup', description: 'Perfect for startups and new businesses' },
                  { id: 'agency', name: 'Agency', description: 'Ideal for agencies and service providers' },
                  { id: 'saas', name: 'SaaS', description: 'Optimized for software products' },
                  { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work and skills' },
                  { id: 'ecommerce', name: 'E-commerce', description: 'Sell products online' }
                ].map((template) => (
                  <button
                    key={template.id}
                    onClick={() => updateLandingPageData('template', template.id)}
                    className={`p-4 text-left border-2 rounded-xl transition-all ${
                      landingPageData.template === template.id
                        ? 'border-electric-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold text-black mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-700">{template.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Style Selection */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Style</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
                  { id: 'modern', name: 'Modern', description: 'Contemporary and sleek' },
                  { id: 'bold', name: 'Bold', description: 'Strong and impactful' },
                  { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateLandingPageData('style', style.id)}
                    className={`p-4 text-left border-2 rounded-xl transition-all ${
                      landingPageData.style === style.id
                        ? 'border-electric-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold text-black mb-1">{style.name}</h4>
                    <p className="text-sm text-gray-700">{style.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Brand Assets Preview */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Brand Assets</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center mx-auto mb-3">
                    {brandData?.visual?.logo?.url ? (
                      <img 
                        src={brandData.visual.logo.url} 
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Palette className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="font-medium text-black">Logo</p>
                  <p className="text-sm text-gray-700">
                    {brandData?.visual?.logo ? 'Available' : 'Not set'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center mx-auto mb-3">
                    {brandData?.visual?.colors?.colors ? (
                      <div className="flex space-x-1">
                        {brandData.visual.colors.colors.slice(0, 3).map((color: string, i: number) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Palette className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="font-medium text-black">Colors</p>
                  <p className="text-sm text-gray-700">
                    {brandData?.visual?.colors ? 'Available' : 'Not set'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center mx-auto mb-3">
                    <Type className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-black">Typography</p>
                  <p className="text-sm text-gray-700">
                    {brandData?.visual?.typography ? 'Available' : 'Not set'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'preview' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Landing Page Preview</h3>
              <div className="flex space-x-3">
                <Button
                  onClick={generatePreview}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate</span>
                </Button>
                <Button
                  onClick={() => window.open('data:text/html,' + encodeURIComponent(previewHtml), '_blank')}
                  disabled={!previewHtml}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </Button>
              </div>
            </div>
            
            {previewHtml ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-96"
                  title="Landing Page Preview"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-black mb-2">No Preview Available</h4>
                <p className="text-gray-700 mb-4">
                  Generate a preview to see how your landing page will look
                </p>
                <Button onClick={generatePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Preview
                </Button>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'deploy' && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-black mb-6">Deploy Your Landing Page</h3>
            
            {deployedUrl ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">Successfully Deployed!</h4>
                <p className="text-gray-700 mb-6">Your landing page is now live and accessible.</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-800">{deployedUrl}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(deployedUrl)
                        showToast('success', 'URL copied to clipboard')
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => window.open(deployedUrl, '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Site</span>
                  </Button>
                  <Button
                    onClick={() => setDeployedUrl(null)}
                    variant="outline"
                  >
                    Deploy New Version
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Ready to Deploy</h4>
                  <p className="text-blue-800 mb-4">
                    Your landing page will be deployed to a custom subdomain and will be fully responsive and optimized.
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Fast loading with optimized assets</li>
                    <li>• Mobile-responsive design</li>
                    <li>• SEO optimized</li>
                    <li>• SSL certificate included</li>
                    <li>• Custom domain support</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Button
                    onClick={deployLandingPage}
                    loading={deploying}
                    disabled={!previewHtml}
                    size="lg"
                    className="flex items-center space-x-2 bg-gradient-luxury"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>Deploy Landing Page</span>
                  </Button>
                  {!previewHtml && (
                    <p className="text-sm text-gray-600 mt-2">
                      Generate a preview first before deploying
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  )
}

export default LandingPageGenerator