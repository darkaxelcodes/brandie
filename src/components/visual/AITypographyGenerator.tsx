import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Type, Brain, Download, Eye, Sliders, BookOpen, Zap, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'
import { Slider } from '../ui/Slider'
import { aiVisualService } from '../../lib/aiVisualService'
import { useTokens } from '../../contexts/TokenContext'

interface AITypographyGeneratorProps {
  brandName: string
  brandStrategy: any
  selectedTypography?: any
  onTypographySelected: (typography: any) => void
  brandContent?: {
    tagline?: string
    description?: string
    sampleText?: string
  }
}

export const AITypographyGenerator: React.FC<AITypographyGeneratorProps> = ({
  brandName,
  brandStrategy,
  selectedTypography,
  onTypographySelected,
  brandContent
}) => {
  const [generatedPairings, setGeneratedPairings] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([])
  const [currentSelection, setCurrentSelection] = useState<any>(selectedTypography)
  const [previewSettings, setPreviewSettings] = useState({
    size: 16,
    lineHeight: 1.5,
    letterSpacing: 0
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { useToken } = useTokens()

  // Update current selection when prop changes
  useEffect(() => {
    setCurrentSelection(selectedTypography)
  }, [selectedTypography])

  const personalityTraits = [
    { id: 'professional', name: 'Professional', description: 'Clean and business-like' },
    { id: 'creative', name: 'Creative', description: 'Artistic and expressive' },
    { id: 'friendly', name: 'Friendly', description: 'Approachable and warm' },
    { id: 'authoritative', name: 'Authoritative', description: 'Strong and commanding' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined' },
    { id: 'playful', name: 'Playful', description: 'Fun and energetic' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and clean' },
    { id: 'technical', name: 'Technical', description: 'Precise and systematic' }
  ]

  const generateAITypography = async () => {
    setGenerating(true)
    try {
      // First use a token
      const success = await useToken('ai_typography_generation', 'Generate AI typography recommendations')
      
      if (!success) {
        throw new Error('Failed to use token')
      }
      
      const request = {
        brandName,
        strategy: brandStrategy,
        archetype: brandStrategy?.archetype?.selectedArchetype || 'modern',
        industry: brandStrategy?.competitive?.industry,
        personality: selectedPersonality
      }

      const pairings = await aiVisualService.generateTypographyRecommendations(request)
      setGeneratedPairings(pairings)
    } catch (error) {
      console.error('Error generating AI typography:', error)
    } finally {
      setGenerating(false)
    }
  }

  const selectTypography = (typography: any) => {
    const typographyData = {
      ...typography,
      aiGenerated: true,
      selectedPersonality,
      timestamp: new Date().toISOString()
    }
    setCurrentSelection(typographyData)
    onTypographySelected(typographyData)
    
    // Load Google Fonts if needed
    if (typography.heading?.googleFont) {
      loadGoogleFont(typography.heading.googleFont)
    }
    if (typography.body?.googleFont) {
      loadGoogleFont(typography.body.googleFont)
    }
  }

  const loadGoogleFont = (fontUrl: string) => {
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  const togglePersonality = (traitId: string) => {
    setSelectedPersonality(prev => 
      prev.includes(traitId) 
        ? prev.filter(id => id !== traitId)
        : [...prev, traitId]
    )
  }

  const exportTypography = (typography: any, format: string) => {
    let content = ''

    switch (format) {
      case 'css':
        content = `/* ${typography.name} Typography */
.heading {
  font-family: '${typography.heading.family}', ${typography.heading.fallback};
  font-weight: 700;
  line-height: 1.2;
}

.body {
  font-family: '${typography.body.family}', ${typography.body.fallback};
  font-weight: 400;
  line-height: 1.6;
}`
        break
      case 'scss':
        content = `// ${typography.name} Typography
$font-heading: '${typography.heading.family}', ${typography.heading.fallback};
$font-body: '${typography.body.family}', ${typography.body.fallback};

.heading {
  font-family: $font-heading;
  font-weight: 700;
  line-height: 1.2;
}

.body {
  font-family: $font-body;
  font-weight: 400;
  line-height: 1.6;
}`
        break
      case 'json':
        content = JSON.stringify({
          name: typography.name,
          heading: typography.heading,
          body: typography.body
        }, null, 2)
        break
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName}-typography.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sampleContent = {
    tagline: brandContent?.tagline || `${brandName} - Innovation Simplified`,
    description: brandContent?.description || `${brandName} is revolutionizing the industry with cutting-edge solutions that empower businesses to achieve their goals faster and more efficiently than ever before.`,
    sampleText: brandContent?.sampleText || `At ${brandName}, we believe in the power of great design to transform businesses and create meaningful connections with customers. Our approach combines strategic thinking with creative excellence to deliver results that matter.`
  }

  return (
    <div className="space-y-6">
      {/* AI Typography Generation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              AI Typography Intelligence
            </h3>
            <p className="text-gray-600 mt-1">
              Generate typography pairings based on readability science and brand psychology
            </p>
          </div>
          <AIButton
            onClick={generateAITypography}
            loading={generating}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0"
            actionType="ai_typography_generation"
            actionDescription="Generate AI typography recommendations"
          >
            Generate AI Typography
          </AIButton>
        </div>

        {/* Brand Context */}
        {brandStrategy && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3">Brand Typography Context</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Brand Archetype:</span>
                <p className="text-green-700 capitalize">
                  {brandStrategy.archetype?.selectedArchetype || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Target Audience:</span>
                <p className="text-green-700">
                  {brandStrategy.audience?.primaryAudience?.slice(0, 50) || 'Not specified'}...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Personality Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Typography Personality (Select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {personalityTraits.map((trait) => (
              <button
                key={trait.id}
                onClick={() => togglePersonality(trait.id)}
                className={`p-3 text-left border rounded-lg transition-all ${
                  selectedPersonality.includes(trait.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{trait.name}</div>
                <div className="text-xs text-gray-600">{trait.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Advanced Settings</span>
          </Button>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <Slider
                value={previewSettings.size}
                onChange={(value) => setPreviewSettings(prev => ({ ...prev, size: value }))}
                min={12}
                max={24}
                leftLabel="Small"
                rightLabel="Large"
              />
              <Slider
                value={previewSettings.lineHeight * 100}
                onChange={(value) => setPreviewSettings(prev => ({ ...prev, lineHeight: value / 100 }))}
                min={100}
                max={200}
                leftLabel="Tight"
                rightLabel="Loose"
              />
              <Slider
                value={previewSettings.letterSpacing + 50}
                onChange={(value) => setPreviewSettings(prev => ({ ...prev, letterSpacing: value - 50 }))}
                min={0}
                max={100}
                leftLabel="Tight"
                rightLabel="Wide"
              />
            </div>
          </motion.div>
        )}

        {/* AI Generation Status */}
        {generating && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 text-green-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">AI is analyzing typography science...</span>
            </div>
            <p className="text-gray-600 mt-2">Considering readability, brand personality, and accessibility</p>
          </div>
        )}
      </Card>

      {/* Current Selection */}
      {currentSelection && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Selected Typography
            </h3>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {currentSelection.aiGenerated ? 'AI Generated' : 'Custom'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ 
                  fontFamily: currentSelection.heading?.family || 'Arial',
                  fontSize: `${previewSettings.size * 1.5}px`,
                  lineHeight: previewSettings.lineHeight,
                  letterSpacing: `${previewSettings.letterSpacing}px`
                }}
              >
                {brandName}
              </h4>
              <p 
                className="text-gray-600"
                style={{ 
                  fontFamily: currentSelection.body?.family || 'Arial',
                  fontSize: `${previewSettings.size}px`,
                  lineHeight: previewSettings.lineHeight,
                  letterSpacing: `${previewSettings.letterSpacing}px`
                }}
              >
                {sampleContent.tagline}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p><strong>Heading:</strong> {currentSelection.heading?.family}</p>
                <p><strong>Body:</strong> {currentSelection.body?.family}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportTypography(currentSelection, 'css')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Typography Pairings */}
      {generatedPairings.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Typography Pairings</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {generatedPairings.map((pairing) => (
              <motion.div
                key={pairing.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  border-2 rounded-xl p-6 cursor-pointer transition-all
                  ${currentSelection?.id === pairing.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => selectTypography(pairing)}
              >
                {/* Typography Preview */}
                <div className="mb-4">
                  <h4 
                    className="text-2xl font-bold text-gray-900 mb-2"
                    style={{ 
                      fontFamily: pairing.heading?.family || 'Arial',
                      fontSize: `${previewSettings.size * 1.5}px`,
                      lineHeight: previewSettings.lineHeight,
                      letterSpacing: `${previewSettings.letterSpacing}px`
                    }}
                  >
                    {brandName}
                  </h4>
                  <p 
                    className="text-gray-600 text-sm mb-2"
                    style={{ 
                      fontFamily: pairing.body?.family || 'Arial',
                      fontSize: `${previewSettings.size}px`,
                      lineHeight: previewSettings.lineHeight,
                      letterSpacing: `${previewSettings.letterSpacing}px`
                    }}
                  >
                    {sampleContent.tagline}
                  </p>
                  <p 
                    className="text-gray-500 text-xs"
                    style={{ 
                      fontFamily: pairing.body?.family || 'Arial',
                      fontSize: `${previewSettings.size - 2}px`,
                      lineHeight: previewSettings.lineHeight + 0.1,
                      letterSpacing: `${previewSettings.letterSpacing}px`
                    }}
                  >
                    {sampleContent.description.slice(0, 100)}...
                  </p>
                </div>
                
                {/* Pairing Info */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{pairing.name}</h5>
                    <div className="flex items-center space-x-2">
                      {currentSelection?.id === pairing.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      {pairing.aiGenerated && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          AI Generated
                        </span>
                      )}
                      <span className={`
                        text-xs px-2 py-1 rounded font-medium
                        ${pairing.category === 'modern' ? 'bg-blue-100 text-blue-800' :
                          pairing.category === 'elegant' ? 'bg-purple-100 text-purple-800' :
                          pairing.category === 'friendly' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {pairing.category}
                      </span>
                    </div>
                  </div>
                  
                  {pairing.reasoning && (
                    <div className="text-xs text-green-700 bg-green-50 p-2 rounded mb-3">
                      <strong>AI Reasoning:</strong> {pairing.reasoning}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <p><strong>Heading:</strong> {pairing.heading?.family}</p>
                    <p><strong>Body:</strong> {pairing.body?.family}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Show detailed analysis
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Analyze
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        exportTypography(pairing, 'css')
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Live Typography Preview */}
      {currentSelection && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Typography Preview</h3>
          
          <div className="space-y-6">
            {/* Heading Hierarchy */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Heading Hierarchy</h4>
              <div className="space-y-3">
                {[
                  { level: 'H1', size: previewSettings.size * 2.5, text: `${brandName} - Main Heading` },
                  { level: 'H2', size: previewSettings.size * 2, text: 'Secondary Heading' },
                  { level: 'H3', size: previewSettings.size * 1.5, text: 'Tertiary Heading' },
                  { level: 'H4', size: previewSettings.size * 1.25, text: 'Quaternary Heading' }
                ].map((heading) => (
                  <div key={heading.level} className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500 w-8">{heading.level}</span>
                    <h1 
                      className="text-gray-900 flex-1"
                      style={{ 
                        fontFamily: currentSelection.heading?.family || 'Arial',
                        fontSize: `${heading.size}px`,
                        fontWeight: 700,
                        lineHeight: previewSettings.lineHeight,
                        letterSpacing: `${previewSettings.letterSpacing}px`
                      }}
                    >
                      {heading.text}
                    </h1>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Body Text Samples */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Body Text Samples</h4>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Tagline</span>
                  <p 
                    className="text-gray-900"
                    style={{ 
                      fontFamily: currentSelection.body?.family || 'Arial',
                      fontSize: `${previewSettings.size + 2}px`,
                      fontWeight: 600,
                      lineHeight: previewSettings.lineHeight,
                      letterSpacing: `${previewSettings.letterSpacing}px`
                    }}
                  >
                    {sampleContent.tagline}
                  </p>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Description</span>
                  <p 
                    className="text-gray-700"
                    style={{ 
                      fontFamily: currentSelection.body?.family || 'Arial',
                      fontSize: `${previewSettings.size}px`,
                      fontWeight: 400,
                      lineHeight: previewSettings.lineHeight,
                      letterSpacing: `${previewSettings.letterSpacing}px`
                    }}
                  >
                    {sampleContent.description}
                  </p>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Body Text</span>
                  <p 
                    className="text-gray-600"
                    style={{ 
                      fontFamily: currentSelection.body?.family || 'Arial',
                      fontSize: `${previewSettings.size - 1}px`,
                      fontWeight: 400,
                      lineHeight: previewSettings.lineHeight + 0.1,
                      letterSpacing: `${previewSettings.letterSpacing}px`
                    }}
                  >
                    {sampleContent.sampleText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export Options */}
      {currentSelection && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Typography</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Typography Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Heading Font:</span>
                  <span className="font-medium">{currentSelection.heading?.family}</span>
                </div>
                <div className="flex justify-between">
                  <span>Body Font:</span>
                  <span className="font-medium">{currentSelection.body?.family}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{currentSelection.category}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Formats</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportTypography(currentSelection, 'css')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportTypography(currentSelection, 'scss')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  SCSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportTypography(currentSelection, 'json')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => loadGoogleFont(currentSelection.heading?.googleFont || '')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Google Fonts
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Enhancement Tips */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Typography Intelligence Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Select personality traits that match your brand archetype</li>
              <li>• AI considers readability science and accessibility standards</li>
              <li>• Use advanced settings to fine-tune typography spacing</li>
              <li>• Export Google Fonts links for easy implementation</li>
              <li>• Test typography across different content types</li>
              <li>• Selected typography is automatically saved to your brand</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}