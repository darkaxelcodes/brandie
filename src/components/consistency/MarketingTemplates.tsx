import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Download, Edit, Plus, Sparkles, Mail, FileImage,
  Presentation, Printer, Megaphone, X, Loader2, Package
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import {
  templateGeneratorService,
  MARKETING_SIZES,
  GeneratedTemplate,
  TemplateElements,
  TemplateConfig
} from '../../lib/templateGeneratorService'
import { useToast } from '../../contexts/ToastContext'

interface MarketingTemplatesProps {
  brandData: any
}

interface MarketingTemplate {
  id: string
  category: 'print' | 'digital' | 'email' | 'presentation'
  type: string
  name: string
  dimensions: string
  configKey: string
  description: string
}

const MARKETING_TEMPLATES: Record<string, MarketingTemplate[]> = {
  print: [
    { id: 'print-flyer-letter', category: 'print', type: 'flyer', name: 'Product Flyer (Letter)', dimensions: '8.5 × 11 in', configKey: 'flyer-letter', description: 'Showcase your products with this professional flyer template' },
    { id: 'print-flyer-a4', category: 'print', type: 'flyer', name: 'Product Flyer (A4)', dimensions: 'A4 (210 × 297mm)', configKey: 'flyer-a4', description: 'European standard A4 flyer for product showcases' },
    { id: 'print-business-card', category: 'print', type: 'business-card', name: 'Business Card', dimensions: '3.5 × 2 in', configKey: 'business-card', description: 'Professional business card with your brand elements' },
    { id: 'print-brochure', category: 'print', type: 'brochure', name: 'Tri-fold Brochure', dimensions: '11 × 8.5 in', configKey: 'brochure-trifold', description: 'Comprehensive tri-fold brochure for product or service information' },
  ],
  digital: [
    { id: 'digital-banner-leaderboard', category: 'digital', type: 'banner', name: 'Web Banner (Leaderboard)', dimensions: '728 × 90px', configKey: 'web-banner-leaderboard', description: 'Standard leaderboard banner for websites' },
    { id: 'digital-banner-rectangle', category: 'digital', type: 'ad', name: 'Display Ad (Rectangle)', dimensions: '300 × 250px', configKey: 'web-banner-rectangle', description: 'Medium rectangle display ad for digital campaigns' },
    { id: 'digital-banner-skyscraper', category: 'digital', type: 'banner', name: 'Skyscraper Banner', dimensions: '160 × 600px', configKey: 'web-banner-skyscraper', description: 'Vertical skyscraper banner for sidebar placement' },
  ],
  email: [
    { id: 'email-header', category: 'email', type: 'header', name: 'Email Header', dimensions: '600 × 200px', configKey: 'email-header', description: 'Branded header for email newsletters' },
    { id: 'email-newsletter', category: 'email', type: 'newsletter', name: 'Newsletter Banner', dimensions: '600 × 300px', configKey: 'email-header', description: 'Monthly newsletter banner with your branding' },
  ],
  presentation: [
    { id: 'presentation-16x9', category: 'presentation', type: 'slide', name: 'Presentation Slide (16:9)', dimensions: '1920 × 1080px', configKey: 'presentation-16x9', description: 'Widescreen presentation slide template' },
    { id: 'presentation-4x3', category: 'presentation', type: 'slide', name: 'Presentation Slide (4:3)', dimensions: '1024 × 768px', configKey: 'presentation-4x3', description: 'Standard presentation slide template' },
  ]
}

const BUNDLES = [
  { id: 'product-launch', name: 'Product Launch Kit', description: 'Complete set of templates for new product launches', icon: Megaphone, color: 'blue', templates: ['flyer-letter', 'web-banner-rectangle', 'email-header', 'presentation-16x9'] },
  { id: 'email-campaign', name: 'Email Campaign Bundle', description: 'Email templates for nurture campaigns and promotions', icon: Mail, color: 'green', templates: ['email-header', 'web-banner-rectangle'] },
  { id: 'print-collateral', name: 'Print Collateral Pack', description: 'Essential print materials for your business', icon: Printer, color: 'teal', templates: ['flyer-letter', 'business-card', 'brochure-trifold'] },
]

export const MarketingTemplates: React.FC<MarketingTemplatesProps> = ({ brandData }) => {
  const { showToast } = useToast()
  const [activeCategory, setActiveCategory] = useState<string>('print')
  const [searchQuery, setSearchQuery] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadingBundle, setDownloadingBundle] = useState<string | null>(null)
  const [customizing, setCustomizing] = useState<MarketingTemplate | null>(null)
  const [customText, setCustomText] = useState('')
  const [customSubtext, setCustomSubtext] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedTemplates, setGeneratedTemplates] = useState<GeneratedTemplate[]>([])

  if (!brandData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Loading brand data...</h4>
            <p className="text-gray-500">Please wait while we load your brand information</p>
          </div>
        </Card>
      </div>
    )
  }

  const getBrandColors = () => brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']

  const getTemplateElements = (text?: string, subtext?: string): TemplateElements => {
    const colors = getBrandColors()
    return {
      background: colors[0] || '#3B82F6',
      secondaryColor: colors[1] || colors[0],
      text: text || brandData.brand?.name || 'Your Brand',
      subtext: subtext || '',
      logo: brandData.visual?.logo ? {
        url: brandData.visual.logo.url,
        svg: brandData.visual.logo.svg
      } : undefined,
      typography: {
        heading: { family: brandData.visual?.typography?.heading?.family || 'Arial' },
        body: { family: brandData.visual?.typography?.body?.family || 'Arial' }
      },
      brandName: brandData.brand?.name,
      showLogo: true
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconProps = { className: 'w-5 h-5' }
    switch (category) {
      case 'print': return <Printer {...iconProps} />
      case 'digital': return <FileImage {...iconProps} />
      case 'email': return <Mail {...iconProps} />
      case 'presentation': return <Presentation {...iconProps} />
      default: return <FileText {...iconProps} />
    }
  }

  const filteredTemplates = MARKETING_TEMPLATES[activeCategory]?.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDownloadTemplate = useCallback(async (template: MarketingTemplate) => {
    setDownloading(template.id)
    try {
      const config = MARKETING_SIZES[template.configKey]
      if (!config) {
        throw new Error('Template configuration not found')
      }

      const elements = getTemplateElements()
      const generated = await templateGeneratorService.generateMarketingTemplate(config, elements, 'png')

      const filename = `${brandData.brand?.name || 'brand'}-${template.type}-${Date.now()}.png`
      templateGeneratorService.downloadTemplate(generated, filename)

      showToast('success', `Downloaded ${template.name}`)
    } catch (error) {
      console.error('Error downloading template:', error)
      showToast('error', 'Failed to download template')
    } finally {
      setDownloading(null)
    }
  }, [brandData, showToast])

  const handleDownloadBundle = useCallback(async (bundle: typeof BUNDLES[0]) => {
    setDownloadingBundle(bundle.id)
    try {
      showToast('info', `Generating ${bundle.name}...`)
      const elements = getTemplateElements()

      for (const configKey of bundle.templates) {
        const config = MARKETING_SIZES[configKey]
        if (config) {
          const generated = await templateGeneratorService.generateMarketingTemplate(config, elements, 'png')
          const filename = `${brandData.brand?.name || 'brand'}-${configKey}-${Date.now()}.png`
          templateGeneratorService.downloadTemplate(generated, filename)
        }
      }

      showToast('success', `${bundle.name} downloaded successfully!`)
    } catch (error) {
      console.error('Error downloading bundle:', error)
      showToast('error', 'Failed to download bundle')
    } finally {
      setDownloadingBundle(null)
    }
  }, [brandData, showToast])

  const handleGenerateCustom = useCallback(async () => {
    if (!customizing) return

    setGenerating(true)
    try {
      const config = MARKETING_SIZES[customizing.configKey]
      if (!config) {
        throw new Error('Template configuration not found')
      }

      const elements = getTemplateElements(
        customText || brandData.brand?.name || 'Your Brand',
        customSubtext || ''
      )

      const generated = await templateGeneratorService.generateMarketingTemplate(config, elements, 'png')
      setGeneratedTemplates(prev => [generated, ...prev])

      showToast('success', 'Template generated successfully!')
      setCustomText('')
      setCustomSubtext('')
      setCustomizing(null)
    } catch (error) {
      console.error('Error generating template:', error)
      showToast('error', 'Failed to generate template')
    } finally {
      setGenerating(false)
    }
  }, [customizing, customText, customSubtext, brandData, showToast])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-blue-600" />
              Marketing Material Templates
            </h3>
            <p className="text-gray-600 mt-1">
              Ready-to-use marketing templates with your brand assets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {['print', 'digital', 'email', 'presentation'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                flex flex-col items-center space-y-2 px-4 py-3 rounded-lg font-medium transition-all
                ${activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {getCategoryIcon(category)}
              <span className="text-xs capitalize">{category}</span>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Input
            type="text"
            placeholder={`Search ${activeCategory} templates...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No templates found</h4>
            <p className="text-gray-500">Try adjusting your search or select a different category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white group"
              >
                <div
                  className="aspect-video relative"
                  style={{ backgroundColor: getBrandColors()[0] }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      {brandData.visual?.logo?.url ? (
                        <img
                          src={brandData.visual.logo.url}
                          alt="Logo"
                          className="h-8 mx-auto mb-2 object-contain"
                        />
                      ) : (
                        <div className="h-8 w-8 mx-auto mb-2 bg-white rounded-full flex items-center justify-center font-bold" style={{ color: getBrandColors()[0] }}>
                          {brandData.brand?.name?.charAt(0) || 'B'}
                        </div>
                      )}
                      <div
                        className="text-sm font-bold"
                        style={{ fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif' }}
                      >
                        {brandData.brand?.name || 'Your Brand'}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
                    {getCategoryIcon(template.category)}
                    <span className="capitalize">{template.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {template.dimensions}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomizing(template)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Customize
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTemplate(template)}
                        loading={downloading === template.id}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      {getBrandColors().slice(0, 3).map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-5 h-5 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {generatedTemplates.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Generated Templates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {generatedTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-teal-200 bg-teal-50 rounded-lg overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={template.dataUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{template.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const filename = `${brandData.brand?.name || 'brand'}-${template.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
                      templateGeneratorService.downloadTemplate(template, filename)
                      showToast('success', 'Template downloaded!')
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Marketing Bundles</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {BUNDLES.map((bundle) => {
            const IconComponent = bundle.icon
            const colorClasses = {
              blue: 'border-blue-200 bg-blue-50',
              green: 'border-green-200 bg-green-50',
              teal: 'border-teal-200 bg-teal-50',
            }[bundle.color] || 'border-gray-200 bg-gray-50'

            const iconColorClasses = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              teal: 'text-teal-600',
            }[bundle.color] || 'text-gray-600'

            return (
              <div key={bundle.id} className={`p-4 border rounded-lg ${colorClasses}`}>
                <div className="flex items-center space-x-2 mb-3">
                  <IconComponent className={`w-5 h-5 ${iconColorClasses}`} />
                  <h4 className="font-medium text-gray-900">{bundle.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>
                <div className="text-xs text-gray-500 mb-3">
                  {bundle.templates.length} templates included
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownloadBundle(bundle)}
                  loading={downloadingBundle === bundle.id}
                >
                  {downloadingBundle === bundle.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 mr-1" />
                      Download Bundle
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </Card>

      {customizing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setCustomizing(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customize {customizing.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomizing(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div
                    className="aspect-video rounded-lg relative overflow-hidden"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1/4"
                      style={{
                        background: `linear-gradient(to right, ${getBrandColors()[0]}, ${getBrandColors()[1] || getBrandColors()[0]})`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4">
                        {brandData.visual?.logo?.url && (
                          <img
                            src={brandData.visual.logo.url}
                            alt="Logo"
                            className="h-8 mx-auto mb-2 object-contain"
                          />
                        )}
                        <div
                          className="text-lg font-bold"
                          style={{
                            fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif',
                            color: getBrandColors()[0]
                          }}
                        >
                          {customText || brandData.brand?.name || 'Your Brand'}
                        </div>
                        {customSubtext && (
                          <div
                            className="text-sm text-gray-600 mt-1"
                            style={{ fontFamily: brandData.visual?.typography?.body?.family || 'sans-serif' }}
                          >
                            {customSubtext}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-sm text-gray-500">
                    {customizing.dimensions}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headline Text
                    </label>
                    <Input
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder={brandData.brand?.name || 'Your Brand'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subheadline (optional)
                    </label>
                    <Input
                      value={customSubtext}
                      onChange={(e) => setCustomSubtext(e.target.value)}
                      placeholder="Additional details..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Elements
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {getBrandColors().slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-5 h-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">Colors</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Font: {brandData.visual?.typography?.heading?.family || 'Default'}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateCustom}
                    loading={generating}
                    className="w-full"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Template
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Card className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Download All Templates</h3>
            <p className="text-gray-700 mb-4">
              Generate and download all marketing templates for the current category with your brand elements applied.
            </p>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  showToast('info', `Generating all ${activeCategory} templates...`)
                  const templates = MARKETING_TEMPLATES[activeCategory]
                  const elements = getTemplateElements()

                  for (const template of templates) {
                    const config = MARKETING_SIZES[template.configKey]
                    if (config) {
                      const generated = await templateGeneratorService.generateMarketingTemplate(config, elements, 'png')
                      const filename = `${brandData.brand?.name || 'brand'}-${template.type}-${template.configKey}.png`
                      templateGeneratorService.downloadTemplate(generated, filename)
                    }
                  }

                  showToast('success', `All ${activeCategory} templates downloaded!`)
                } catch (error) {
                  showToast('error', 'Failed to generate templates')
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Templates
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
