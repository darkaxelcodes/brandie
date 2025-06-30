import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Instagram, Facebook, Twitter, Linkedin, Youtube, Download, Edit, 
  Copy, Trash, Plus, Image, Type, Palette, Sparkles, Check
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'

interface SocialMediaTemplatesProps {
  brandData: any
}

interface SocialTemplate {
  id: string
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube'
  type: 'post' | 'story' | 'cover' | 'profile'
  name: string
  dimensions: string
  preview: string
  elements: {
    background: string
    logo: boolean
    text: string
    colors: string[]
  }
}

export const SocialMediaTemplates: React.FC<SocialMediaTemplatesProps> = ({
  brandData
}) => {
  const [activeTab, setActiveTab] = useState<string>('instagram')
  const [activeTemplate, setActiveTemplate] = useState<SocialTemplate | null>(null)
  const [customText, setCustomText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedTemplates, setGeneratedTemplates] = useState<SocialTemplate[]>([])

  // Early return if brandData is null or undefined
  if (!brandData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Loading brand data...</h4>
            <p className="text-gray-500">
              Please wait while we load your brand information
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Sample templates based on brand data
  const templates: Record<string, SocialTemplate[]> = {
    instagram: [
      {
        id: 'instagram-post-1',
        platform: 'instagram',
        type: 'post',
        name: 'Square Post',
        dimensions: '1080 × 1080px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[0] || '#3B82F6',
          logo: true,
          text: 'Your caption here',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      },
      {
        id: 'instagram-story-1',
        platform: 'instagram',
        type: 'story',
        name: 'Story Template',
        dimensions: '1080 × 1920px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[1] || '#1E40AF',
          logo: true,
          text: 'Your story text here',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      }
    ],
    facebook: [
      {
        id: 'facebook-post-1',
        platform: 'facebook',
        type: 'post',
        name: 'Feed Post',
        dimensions: '1200 × 630px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[2] || '#F59E0B',
          logo: true,
          text: 'Your Facebook post text',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      },
      {
        id: 'facebook-cover-1',
        platform: 'facebook',
        type: 'cover',
        name: 'Page Cover',
        dimensions: '820 × 312px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[0] || '#3B82F6',
          logo: true,
          text: '',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      }
    ],
    twitter: [
      {
        id: 'twitter-post-1',
        platform: 'twitter',
        type: 'post',
        name: 'Tweet Image',
        dimensions: '1200 × 675px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[3] || '#EF4444',
          logo: true,
          text: 'Your tweet text here',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      }
    ],
    linkedin: [
      {
        id: 'linkedin-post-1',
        platform: 'linkedin',
        type: 'post',
        name: 'LinkedIn Post',
        dimensions: '1200 × 627px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[0] || '#3B82F6',
          logo: true,
          text: 'Your LinkedIn post content',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      }
    ],
    youtube: [
      {
        id: 'youtube-thumbnail-1',
        platform: 'youtube',
        type: 'post',
        name: 'Video Thumbnail',
        dimensions: '1280 × 720px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        elements: {
          background: brandData.visual?.colors?.colors?.[2] || '#F59E0B',
          logo: true,
          text: 'Video Title Here',
          colors: brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']
        }
      }
    ]
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5" />
      case 'facebook': return <Facebook className="w-5 h-5" />
      case 'twitter': return <Twitter className="w-5 h-5" />
      case 'linkedin': return <Linkedin className="w-5 h-5" />
      case 'youtube': return <Youtube className="w-5 h-5" />
      default: return <Image className="w-5 h-5" />
    }
  }

  const handleGenerateTemplate = () => {
    if (!activeTemplate) return
    
    setGenerating(true)
    
    // Simulate template generation
    setTimeout(() => {
      const newTemplate: SocialTemplate = {
        ...activeTemplate,
        id: `${activeTemplate.id}-custom-${Date.now()}`,
        name: `Custom ${activeTemplate.name}`,
        elements: {
          ...activeTemplate.elements,
          text: customText || activeTemplate.elements.text
        }
      }
      
      setGeneratedTemplates(prev => [newTemplate, ...prev])
      setGenerating(false)
      setCustomText('')
    }, 1500)
  }

  const downloadTemplate = (template: SocialTemplate) => {
    // In a real implementation, this would generate and download the actual template
    // For now, we'll just create a JSON file with the template data
    
    const templateData = {
      ...template,
      brandName: brandData.brand?.name,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandData.brand?.name}-${template.platform}-${template.type}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Platform Tabs */}
      <Card className="p-2">
        <div className="grid grid-cols-5 gap-1">
          {['instagram', 'facebook', 'twitter', 'linkedin', 'youtube'].map((platform) => (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`
                flex flex-col items-center space-y-1 px-4 py-3 rounded-lg font-medium transition-all
                ${activeTab === platform
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
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

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates[activeTab]?.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div 
              className="aspect-video bg-gray-100 relative"
              style={{ 
                backgroundColor: template.elements.background,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  {template.elements.logo && brandData.visual?.logo && (
                    <div className="mb-2 flex justify-center">
                      {brandData.visual.logo.url ? (
                        <img 
                          src={brandData.visual.logo.url} 
                          alt="Logo"
                          className="h-8 object-contain"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {brandData.brand?.name?.charAt(0) || 'B'}
                        </div>
                      )}
                    </div>
                  )}
                  <div 
                    className="text-lg font-bold"
                    style={{ 
                      fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif'
                    }}
                  >
                    {template.elements.text}
                  </div>
                </div>
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
                    onClick={() => downloadTemplate(template)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex space-x-1">
                  {template.elements.colors.slice(0, 3).map((color, index) => (
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

      {/* Generated Templates */}
      {generatedTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Custom Templates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-purple-200 bg-purple-50 rounded-xl overflow-hidden"
              >
                <div 
                  className="aspect-video bg-gray-100 relative"
                  style={{ 
                    backgroundColor: template.elements.background,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      {template.elements.logo && brandData.visual?.logo && (
                        <div className="mb-2 flex justify-center">
                          {brandData.visual.logo.url ? (
                            <img 
                              src={brandData.visual.logo.url} 
                              alt="Logo"
                              className="h-8 object-contain"
                            />
                          ) : (
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {brandData.brand?.name?.charAt(0) || 'B'}
                            </div>
                          )}
                        </div>
                      )}
                      <div 
                        className="text-lg font-bold"
                        style={{ 
                          fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif'
                        }}
                      >
                        {template.elements.text}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {template.dimensions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadTemplate(template)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setGeneratedTemplates(prev => 
                            prev.filter(t => t.id !== template.id)
                          )
                        }}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      {template.elements.colors.slice(0, 3).map((color, index) => (
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
        </div>
      )}

      {/* Template Customizer */}
      {activeTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customize Template</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTemplate(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div 
                  className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden"
                  style={{ 
                    backgroundColor: activeTemplate.elements.background,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <img 
                    src={activeTemplate.preview} 
                    alt={activeTemplate.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      {activeTemplate.elements.logo && brandData.visual?.logo && (
                        <div className="mb-2 flex justify-center">
                          {brandData.visual.logo.url ? (
                            <img 
                              src={brandData.visual.logo.url} 
                              alt="Logo"
                              className="h-8 object-contain"
                            />
                          ) : (
                            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {brandData.brand?.name?.charAt(0) || 'B'}
                            </div>
                          )}
                        </div>
                      )}
                      <div 
                        className="text-lg font-bold"
                        style={{ 
                          fontFamily: brandData.visual?.typography?.heading?.family || 'sans-serif'
                        }}
                      >
                        {customText || activeTemplate.elements.text}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    {activeTemplate.dimensions} • {activeTemplate.platform} {activeTemplate.type}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Text
                  </label>
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={activeTemplate.elements.text}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Elements
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Image className="w-4 h-4" />
                      <span>Background</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Type className="w-4 h-4" />
                      <span>Typography</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Palette className="w-4 h-4" />
                      <span>Colors</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Elements
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex space-x-1">
                        {activeTemplate.elements.colors.slice(0, 3).map((color, index) => (
                          <div 
                            key={index}
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">Brand Colors</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                        <Type className="w-3 h-3 text-gray-600" />
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
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Custom Template
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Template Generation */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Template Generation</h3>
            <p className="text-gray-700 mb-4">
              Need a custom template? Let AI generate a perfectly branded template based on your description.
            </p>
            <div className="flex space-x-3">
              <Input 
                placeholder="Describe the template you need..."
                className="flex-1"
              />
              <Button className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}