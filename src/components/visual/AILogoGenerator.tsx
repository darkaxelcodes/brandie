import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Eye, Wand2, Palette, Zap, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'
import { aiVisualService } from '../../lib/aiVisualService'
import { useTokens } from '../../contexts/TokenContext'
import { useAuth } from '../../contexts/AuthContext'

interface AILogoGeneratorProps {
  brandName: string
  brandStrategy: any
  onLogoGenerated: (logoData: any) => void
  selectedLogo?: any
}

export const AILogoGenerator: React.FC<AILogoGeneratorProps> = ({
  brandName,
  brandStrategy,
  onLogoGenerated,
  selectedLogo
}) => {
  const { user } = useAuth()
  const [generatedLogos, setGeneratedLogos] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [selectedConcept, setSelectedConcept] = useState<any>(selectedLogo)
  const [showVariations, setShowVariations] = useState(false)
  const [logoVariations, setLogoVariations] = useState<any[]>([])
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
      // First use a token
      const success = await useToken('ai_logo_generation', 'Generate AI logo concepts')
      
      if (!success) {
        throw new Error('Failed to use token')
      }
      
      const request = {
        brandName,
        strategy: brandStrategy,
        style: selectedStyle,
        industry: brandStrategy?.competitive?.industry,
        keywords: brandStrategy?.values?.coreValues || []
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

  const downloadLogo = (logo: any, format: string) => {
    // Create download link for the logo
    if (logo.url) {
      // For AI-generated images, download the image
      const link = document.createElement('a')
      link.href = logo.url
      link.download = `${brandName}-logo-${logo.style}.${format}`
      link.click()
    } else if (logo.svg) {
      // For SVG logos, create blob and download
      const blob = new Blob([logo.svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${brandName}-logo-${logo.style}.svg`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Logo Generation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-purple-600" />
              AI Logo Generator
            </h3>
            <p className="text-gray-600 mt-1">
              Generate unique logos powered by DALL-E and brand strategy
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
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Brand Context for AI</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Archetype:</span>
                <p className="text-blue-700 capitalize">
                  {brandStrategy.archetype?.selectedArchetype || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Values:</span>
                <p className="text-blue-700">
                  {brandStrategy.values?.coreValues?.slice(0, 2).join(', ') || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Audience:</span>
                <p className="text-blue-700">
                  {brandStrategy.audience?.primaryAudience?.slice(0, 50) || 'Not specified'}...
                </p>
              </div>
            </div>
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
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 text-left border rounded-xl transition-all ${
                  selectedStyle === style.id
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
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
            <div className="inline-flex items-center space-x-3 text-purple-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">AI is creating your logos...</span>
            </div>
            <p className="text-gray-600 mt-2">This may take 30-60 seconds</p>
          </div>
        )}
      </Card>

      {/* Current Selection */}
      {selectedConcept && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-600" />
              Selected Logo
            </h3>
            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              {selectedConcept.aiGenerated ? 'AI Generated' : 'Custom'}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-lg border border-purple-200 flex items-center justify-center">
              {selectedConcept.url ? (
                <img 
                  src={selectedConcept.url} 
                  alt="Selected logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : selectedConcept.svg ? (
                <div dangerouslySetInnerHTML={{ __html: selectedConcept.svg }} />
              ) : (
                <div className="text-purple-600 font-bold text-lg">
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
                  onClick={() => downloadLogo(selectedConcept, 'svg')}
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
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => selectLogo(logo)}
              >
                {/* Logo Preview */}
                <div className="aspect-video bg-gray-50 flex items-center justify-center p-6">
                  {logo.url ? (
                    <img 
                      src={logo.url} 
                      alt={`Logo concept for ${brandName}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: logo.svg }}
                    />
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
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                      {logo.aiGenerated && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          AI Generated
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
                        downloadLogo(logo, 'svg')
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
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
                    dangerouslySetInnerHTML={{ __html: variation.svg }}
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
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl">
            <Zap className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Enhancement Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Complete your brand strategy for better AI suggestions</li>
              <li>• Try different style preferences to explore various concepts</li>
              <li>• Use the variations feature to see different layouts</li>
              <li>• Download multiple formats for different use cases</li>
              <li>• Selected logos are automatically saved to your brand</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}