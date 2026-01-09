import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Instagram, Facebook, Twitter, Linkedin, Youtube, Download, Edit,
  Trash, Image, Type, Palette, Sparkles, Check, X, Loader2
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import {
  templateGeneratorService,
  SOCIAL_MEDIA_SIZES,
  GeneratedTemplate,
  TemplateElements
} from '../../lib/templateGeneratorService'
import { useToast } from '../../contexts/ToastContext'

interface SocialMediaTemplatesProps {
  brandData: any
}

interface PlatformTemplate {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube'
  type: string
  name: string
  dimensions: string
  configKey: string
}

const PLATFORM_TEMPLATES: Record<string, PlatformTemplate[]> = {
  instagram: [
    { id: 'instagram-post', platform: 'instagram', type: 'post', name: 'Square Post', dimensions: '1080 × 1080px', configKey: 'instagram-post' },
    { id: 'instagram-story', platform: 'instagram', type: 'story', name: 'Story Template', dimensions: '1080 × 1920px', configKey: 'instagram-story' },
  ],
  facebook: [
    { id: 'facebook-post', platform: 'facebook', type: 'post', name: 'Feed Post', dimensions: '1200 × 630px', configKey: 'facebook-post' },
    { id: 'facebook-cover', platform: 'facebook', type: 'cover', name: 'Page Cover', dimensions: '820 × 312px', configKey: 'facebook-cover' },
  ],
  twitter: [
    { id: 'twitter-post', platform: 'twitter', type: 'post', name: 'Tweet Image', dimensions: '1200 × 675px', configKey: 'twitter-post' },
    { id: 'twitter-header', platform: 'twitter', type: 'header', name: 'Profile Header', dimensions: '1500 × 500px', configKey: 'twitter-header' },
  ],
  linkedin: [
    { id: 'linkedin-post', platform: 'linkedin', type: 'post', name: 'LinkedIn Post', dimensions: '1200 × 627px', configKey: 'linkedin-post' },
    { id: 'linkedin-cover', platform: 'linkedin', type: 'cover', name: 'Company Cover', dimensions: '1584 × 396px', configKey: 'linkedin-cover' },
  ],
  youtube: [
    { id: 'youtube-thumbnail', platform: 'youtube', type: 'thumbnail', name: 'Video Thumbnail', dimensions: '1280 × 720px', configKey: 'youtube-thumbnail' },
    { id: 'youtube-banner', platform: 'youtube', type: 'banner', name: 'Channel Banner', dimensions: '2560 × 1440px', configKey: 'youtube-banner' },
  ]
}

export const SocialMediaTemplates: React.FC<SocialMediaTemplatesProps> = ({ brandData }) => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<string>('instagram')
  const [activeTemplate, setActiveTemplate] = useState<PlatformTemplate | null>(null)
  const [customText, setCustomText] = useState('')
  const [customSubtext, setCustomSubtext] = useState('')
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [generatedTemplates, setGeneratedTemplates] = useState<Array<GeneratedTemplate & { platform: string; customText?: string }>>([])
  const [previewTemplate, setPreviewTemplate] = useState<GeneratedTemplate | null>(null)

  if (!brandData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
      text: text || 'Your Message Here',
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

  const getPlatformIcon = (platform: string) => {
    const iconProps = { className: 'w-5 h-5' }
    switch (platform) {
      case 'instagram': return <Instagram {...iconProps} />
      case 'facebook': return <Facebook {...iconProps} />
      case 'twitter': return <Twitter {...iconProps} />
      case 'linkedin': return <Linkedin {...iconProps} />
      case 'youtube': return <Youtube {...iconProps} />
      default: return <Image {...iconProps} />
    }
  }

  const handleGenerateTemplate = useCallback(async () => {
    if (!activeTemplate) return

    setGenerating(true)
    try {
      const config = SOCIAL_MEDIA_SIZES[activeTemplate.configKey]
      if (!config) {
        throw new Error('Template configuration not found')
      }

      const elements = getTemplateElements(
        customText || 'Your Message Here',
        customSubtext || ''
      )

      const template = await templateGeneratorService.generateSocialMediaTemplate(config, elements, 'png')

      setGeneratedTemplates(prev => [{
        ...template,
        platform: activeTemplate.platform,
        customText: customText || 'Your Message Here'
      }, ...prev])

      showToast('success', 'Template generated successfully!')
      setCustomText('')
      setCustomSubtext('')
      setActiveTemplate(null)
    } catch (error) {
      console.error('Error generating template:', error)
      showToast('error', 'Failed to generate template. Please try again.')
    } finally {
      setGenerating(false)
    }
  }, [activeTemplate, customText, customSubtext, brandData, showToast])

  const handleDownloadTemplate = useCallback(async (template: PlatformTemplate) => {
    setDownloading(template.id)
    try {
      const config = SOCIAL_MEDIA_SIZES[template.configKey]
      if (!config) {
        throw new Error('Template configuration not found')
      }

      const elements = getTemplateElements()
      const generated = await templateGeneratorService.generateSocialMediaTemplate(config, elements, 'png')

      const filename = `${brandData.brand?.name || 'brand'}-${template.platform}-${template.type}-${Date.now()}.png`
      templateGeneratorService.downloadTemplate(generated, filename)

      showToast('success', `Downloaded ${template.name}`)
    } catch (error) {
      console.error('Error downloading template:', error)
      showToast('error', 'Failed to download template')
    } finally {
      setDownloading(null)
    }
  }, [brandData, showToast])

  const handleDownloadGenerated = useCallback((template: GeneratedTemplate) => {
    const filename = `${brandData.brand?.name || 'brand'}-${template.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
    templateGeneratorService.downloadTemplate(template, filename)
    showToast('success', `Downloaded ${template.name}`)
  }, [brandData, showToast])

  const handleDeleteGenerated = useCallback((templateId: string) => {
    setGeneratedTemplates(prev => prev.filter(t => t.id !== templateId))
    showToast('info', 'Template removed')
  }, [showToast])

  const handlePreviewTemplate = useCallback(async (template: PlatformTemplate) => {
    try {
      const config = SOCIAL_MEDIA_SIZES[template.configKey]
      if (!config) return

      const elements = getTemplateElements()
      const generated = await templateGeneratorService.generateSocialMediaTemplate(config, elements, 'png')
      setPreviewTemplate(generated)
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }, [brandData])

  return (
    <div className="space-y-6">
      <Card className="p-2">
        <div className="grid grid-cols-5 gap-1">
          {['instagram', 'facebook', 'twitter', 'linkedin', 'youtube'].map((platform) => (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`
                flex flex-col items-center space-y-1 px-4 py-3 rounded-lg font-medium transition-all
                ${activeTab === platform
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {getPlatformIcon(platform)}
              <span className="text-xs capitalize">{platform}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORM_TEMPLATES[activeTab]?.map((template) => (
          <Card key={template.id} className="overflow-hidden group">
            <div
              className="aspect-video relative cursor-pointer"
              style={{ backgroundColor: getBrandColors()[0] }}
              onClick={() => handlePreviewTemplate(template)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  {brandData.visual?.logo?.url ? (
                    <img
                      src={brandData.visual.logo.url}
                      alt="Logo"
                      className="h-10 mx-auto mb-2 object-contain"
                    />
                  ) : (
                    <div className="h-10 w-10 mx-auto mb-2 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {brandData.brand?.name?.charAt(0) || 'B'}
                    </div>
                  )}
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif' }}
                  >
                    Your Message Here
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Click to preview</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {template.dimensions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTemplate(template)}
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
                  {getBrandColors().slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {generatedTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Custom Templates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-teal-200 bg-teal-50 rounded-xl overflow-hidden"
              >
                <div className="aspect-video relative">
                  <img
                    src={template.dataUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {template.width} × {template.height}px
                    </span>
                  </div>
                  {template.customText && (
                    <p className="text-sm text-gray-600 mb-2 truncate">"{template.customText}"</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadGenerated(template)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGenerated(template.id)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Customize {activeTemplate.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTemplate(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div
                  className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden"
                  style={{ backgroundColor: getBrandColors()[0] }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      {brandData.visual?.logo?.url && (
                        <img
                          src={brandData.visual.logo.url}
                          alt="Logo"
                          className="h-8 mx-auto mb-2 object-contain"
                        />
                      )}
                      <div
                        className="text-lg font-bold mb-1"
                        style={{ fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif' }}
                      >
                        {customText || 'Your Message Here'}
                      </div>
                      {customSubtext && (
                        <div
                          className="text-sm opacity-80"
                          style={{ fontFamily: brandData.visual?.typography?.body?.family || 'sans-serif' }}
                        >
                          {customSubtext}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    {activeTemplate.dimensions} - {activeTemplate.platform} {activeTemplate.type}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Text
                  </label>
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Your Message Here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtext (optional)
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
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex space-x-1">
                        {getBrandColors().slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">Brand Colors</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <Type className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {brandData.visual?.typography?.heading?.family || 'Default'} /
                        {brandData.visual?.typography?.body?.family || 'Default'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleGenerateTemplate}
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
          </Card>
        </motion.div>
      )}

      {previewTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewTemplate.dataUrl}
              alt={previewTemplate.name}
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                size="sm"
                onClick={() => {
                  const filename = `${brandData.brand?.name || 'brand'}-preview-${Date.now()}.png`
                  templateGeneratorService.downloadTemplate(previewTemplate, filename)
                  showToast('success', 'Template downloaded!')
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => setPreviewTemplate(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {previewTemplate.width} × {previewTemplate.height}px
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
            <h3 className="font-semibold text-gray-900 mb-2">Batch Template Generation</h3>
            <p className="text-gray-700 mb-4">
              Generate all templates for a platform at once with your brand elements applied.
            </p>
            <div className="flex flex-wrap gap-2">
              {['instagram', 'facebook', 'twitter', 'linkedin', 'youtube'].map((platform) => (
                <Button
                  key={platform}
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      showToast('info', `Generating ${platform} templates...`)
                      const templates = PLATFORM_TEMPLATES[platform]
                      const elements = getTemplateElements()

                      for (const template of templates) {
                        const config = SOCIAL_MEDIA_SIZES[template.configKey]
                        if (config) {
                          const generated = await templateGeneratorService.generateSocialMediaTemplate(config, elements, 'png')
                          const filename = `${brandData.brand?.name || 'brand'}-${template.platform}-${template.type}.png`
                          templateGeneratorService.downloadTemplate(generated, filename)
                        }
                      }

                      showToast('success', `All ${platform} templates downloaded!`)
                    } catch (error) {
                      showToast('error', 'Failed to generate templates')
                    }
                  }}
                  className="capitalize"
                >
                  {getPlatformIcon(platform)}
                  <span className="ml-1">{platform}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
