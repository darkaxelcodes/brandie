import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Eye, Wand2, Zap, Check, Info, Sparkles } from 'lucide-react'
import DOMPurify from 'dompurify'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'
import { aiVisualService } from '../../lib/aiVisualService'
import { useTokens } from '../../contexts/TokenContext'
import { useAuth } from '../../contexts/AuthContext'
import type { LogoStyle } from '../../types/logoGeneration'

interface AILogoGeneratorProps {
  brandName: string
  brandStrategy: {
    brand?: { id?: string; name?: string; industry?: string }
    purpose?: { mission?: string; vision?: string; why?: string }
    values?: { coreValues?: string[]; positioning?: string; uniqueValue?: string }
    audience?: { primaryAudience?: string; demographics?: string; psychographics?: string; painPoints?: string[] }
    competitive?: { competitiveAdvantage?: string; marketGap?: string; directCompetitors?: string[] }
    archetype?: { selectedArchetype?: string; reasoning?: string }
  }
  onLogoGenerated: (logoData: Record<string, unknown>) => void
  selectedLogo?: Record<string, unknown>
}

export const AILogoGenerator: React.FC<AILogoGeneratorProps> = ({
  brandName,
  brandStrategy,
  onLogoGenerated,
  selectedLogo
}) => {
  const { user } = useAuth()
  const [generatedLogos, setGeneratedLogos] = useState<Array<{
    id: string
    url?: string
    base64?: string
    style: string
    svg?: string
    prompt?: string
    revisedPrompt?: string
    aiGenerated: boolean
    metadata?: {
      model: string
      quality: string
      size: string
      hasTransparency: boolean
      generationTimeMs?: number
    }
  }>>([])
  const [generating, setGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('modern')
  const [selectedConcept, setSelectedConcept] = useState<Record<string, unknown> | undefined>(selectedLogo)
  const [showVariations, setShowVariations] = useState(false)
  const [logoVariations, setLogoVariations] = useState<Array<Record<string, unknown>>>([])
  const [showPromptInfo, setShowPromptInfo] = useState(false)
  const { useToken } = useTokens()

  // Update selected concept when prop changes
  useEffect(() => {
    setSelectedConcept(selectedLogo)
  }, [selectedLogo])

  const logoStyles = [
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple', icon: '○' },
    { id: 'modern', name: 'Modern', description: 'Contemporary and sleek', icon: '◇' },
    { id: 'classic', name: 'Classic', description: 'Timeless and elegant', icon: '◆' },
    { id: 'playful', name: 'Playful', description: 'Fun and creative', icon: '★' },
    { id: 'bold', name: 'Bold', description: 'Strong and impactful', icon: '■' },
    { id: 'organic', name: 'Organic', description: 'Natural and flowing', icon: '◉' }
  ]

  const generateAILogos = async () => {
    if (!user) {
      console.error('User not authenticated')
      return
    }

    setGenerating(true)
    try {
      const success = await useToken('ai_logo_generation', 'Generate AI logo concepts')

      if (!success) {
        throw new Error('Failed to use token')
      }

      const request = {
        brandName,
        strategy: brandStrategy,
        style: selectedStyle,
        industry: brandStrategy?.brand?.industry || brandStrategy?.competitive?.industry,
        keywords: brandStrategy?.values?.coreValues || [],
        options: {
          count: 2,
          quality: 'high' as const,
          background: 'transparent' as const,
          format: 'png' as const
        }
      }

      const logos = await aiVisualService.generateLogoConcepts(request)
      setGeneratedLogos(logos)
    } catch (error) {
      console.error('Error generating AI logos:', error)
    } finally {
      setGenerating(false)
    }
  }

  const selectLogo = (logo: any) => {
    const logoData = {
      ...logo,
      aiGenerated: true,
      selectedStyle,
      timestamp: new Date().toISOString()
    }
    setSelectedConcept(logoData)
    onLogoGenerated(logoData)
  }

  const generateVariations = async (logo: any) => {
    setShowVariations(true)
    // Generate different variations of the selected logo
    const variations = [
      { ...logo, id: `${logo.id}-horizontal`, type: 'horizontal', name: 'Horizontal Layout' },
      { ...logo, id: `${logo.id}-vertical`, type: 'vertical', name: 'Vertical Layout' },
      { ...logo, id: `${logo.id}-icon`, type: 'icon', name: 'Icon Only' },
      { ...logo, id: `${logo.id}-mono`, type: 'monochrome', name: 'Monochrome' }
    ]
    setLogoVariations(variations)
  }

  const downloadLogo = (logo: Record<string, unknown>, format: string) => {
    const link = document.createElement('a')
    const logoStyle = (logo.style as string) || selectedStyle

    if (logo.base64) {
      const mimeTypes: Record<string, string> = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp',
        svg: 'image/svg+xml'
      }
      const mimeType = mimeTypes[format] || 'image/png'
      link.href = `data:${mimeType};base64,${logo.base64 as string}`
      link.download = `${brandName}-logo-${logoStyle}.${format}`
      link.click()
    } else if (logo.url) {
      link.href = logo.url as string
      link.download = `${brandName}-logo-${logoStyle}.${format}`
      link.click()

      if ((logo.url as string).startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(logo.url as string), 100)
      }
    } else if (logo.svg) {
      const blob = new Blob([logo.svg as string], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = `${brandName}-logo-${logoStyle}.svg`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const getLogoImageSrc = (logo: Record<string, unknown>): string | undefined => {
    if (logo.url) return logo.url as string
    if (logo.base64) return `data:image/png;base64,${logo.base64 as string}`
    return undefined
  }

  return (
    <div className="space-y-6">
      {/* AI Logo Generation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-600" />
              AI Logo Generator
            </h3>
            <p className="text-gray-600 mt-1">
              Generate unique logos powered by GPT Image AI and your complete brand strategy
            </p>
          </div>
          <AIButton
            onClick={generateAILogos}
            loading={generating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0"
            actionType="ai_logo_generation"
            actionDescription="Generate AI logo concepts"
          >
            Generate AI Logos
          </AIButton>
        </div>

        {/* Brand Context Display */}
        {brandStrategy && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Brand Intelligence for AI
              </h4>
              <button
                onClick={() => setShowPromptInfo(!showPromptInfo)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                {showPromptInfo ? 'Hide details' : 'Show details'}
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/60 rounded-lg p-2">
                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Archetype</span>
                <p className="text-blue-700 font-medium capitalize">
                  {brandStrategy.archetype?.selectedArchetype || 'Not specified'}
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Core Values</span>
                <p className="text-blue-700 font-medium">
                  {brandStrategy.values?.coreValues?.slice(0, 3).join(', ') || 'Not specified'}
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Industry</span>
                <p className="text-blue-700 font-medium">
                  {brandStrategy.brand?.industry || 'Not specified'}
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Positioning</span>
                <p className="text-blue-700 font-medium truncate">
                  {brandStrategy.values?.positioning?.slice(0, 30) || 'Not specified'}
                  {brandStrategy.values?.positioning && brandStrategy.values.positioning.length > 30 ? '...' : ''}
                </p>
              </div>
            </div>
            {showPromptInfo && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600 mb-2">
                  The AI uses these brand elements to create contextually relevant logos:
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium text-gray-700">Mission:</span>
                    <p className="text-gray-600">{brandStrategy.purpose?.mission || 'Not defined'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Target Audience:</span>
                    <p className="text-gray-600">{brandStrategy.audience?.primaryAudience?.slice(0, 80) || 'Not defined'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Competitive Advantage:</span>
                    <p className="text-gray-600">{brandStrategy.competitive?.competitiveAdvantage?.slice(0, 80) || 'Not defined'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Unique Value:</span>
                    <p className="text-gray-600">{brandStrategy.values?.uniqueValue?.slice(0, 80) || 'Not defined'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Style Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Logo Style Preference
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {logoStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id as LogoStyle)}
                className={`p-3 text-left border rounded-xl transition-all ${
                  selectedStyle === style.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{style.icon}</div>
                <div className="font-medium text-gray-900">{style.name}</div>
                <div className="text-sm text-gray-600">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Generation Status */}
        {generating && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 text-blue-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">GPT Image AI is crafting your logos...</span>
            </div>
            <p className="text-gray-600 mt-2">Analyzing brand strategy and generating unique concepts</p>
          </div>
        )}
      </Card>

      {/* Current Selection */}
      {selectedConcept && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-blue-600" />
              Selected Logo
            </h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {selectedConcept.aiGenerated ? 'GPT Image AI' : 'Custom'}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-lg border border-blue-200 flex items-center justify-center overflow-hidden">
              {getLogoImageSrc(selectedConcept) ? (
                <img
                  src={getLogoImageSrc(selectedConcept)}
                  alt="Selected logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : selectedConcept.svg ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedConcept.svg as string) }} />
              ) : (
                <div className="text-blue-600 font-bold text-lg">
                  {brandName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {selectedConcept.style || selectedStyle} Style Logo
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {selectedConcept.description || 'Custom logo design for your brand'}
              </p>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateVariations(selectedConcept)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Variations
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadLogo(selectedConcept, selectedConcept.base64 ? 'png' : 'svg')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Logos */}
      {generatedLogos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Logo Concepts</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {generatedLogos.map((logo) => (
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  border-2 rounded-xl overflow-hidden cursor-pointer transition-all
                  ${selectedConcept?.id === logo.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                  }
                `}
                onClick={() => selectLogo(logo)}
              >
                {/* Logo Preview */}
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                  {getLogoImageSrc(logo) ? (
                    <img
                      src={getLogoImageSrc(logo)}
                      alt={`Logo concept for ${brandName}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : logo.svg ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(logo.svg) }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Loading...</div>
                  )}
                </div>
                
                {/* Logo Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {logo.style} Style
                    </h4>
                    <div className="flex items-center space-x-2">
                      {selectedConcept?.id === logo.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                      {logo.aiGenerated && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          GPT Image
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {logo.description || 'AI-generated logo concept'}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        generateVariations(logo)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Variations
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadLogo(logo, logo.base64 ? 'png' : 'svg')
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PNG
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Logo Variations */}
      {showVariations && logoVariations.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Logo Variations</h3>
            <Button
              variant="outline"
              onClick={() => setShowVariations(false)}
            >
              Close
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {logoVariations.map((variation) => (
              <div
                key={variation.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(variation.svg) }}
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-sm">{variation.name}</h4>
                  <div className="flex space-x-1 mt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      SVG
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      PNG
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Enhancement Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">GPT Image AI Generation</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your complete brand strategy powers intelligent logo creation</li>
              <li>• AI analyzes your archetype, values, audience, and positioning</li>
              <li>• Logos are generated with transparent backgrounds for flexibility</li>
              <li>• High-quality PNG output ready for professional use</li>
              <li>• Try different styles to explore concepts that match your brand</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}