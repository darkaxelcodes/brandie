import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Brain, Eye, Download, RefreshCw, Lightbulb, Zap, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'
import { aiVisualService } from '../../lib/aiVisualService'
import { useTokens } from '../../contexts/TokenContext'

interface AIColorPaletteGeneratorProps {
  brandName: string
  brandStrategy: any
  onPaletteGenerated: (palette: any) => void
  selectedPalette?: any
}

export const AIColorPaletteGenerator: React.FC<AIColorPaletteGeneratorProps> = ({
  brandName,
  brandStrategy,
  onPaletteGenerated,
  selectedPalette
}) => {
  const [generatedPalettes, setGeneratedPalettes] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string[]>([])
  const [showPsychology, setShowPsychology] = useState(false)
  const [colorAnalysis, setColorAnalysis] = useState<any>(null)
  const [currentSelection, setCurrentSelection] = useState<any>(selectedPalette)
  const { useToken } = useTokens()

  // Update current selection when prop changes
  useEffect(() => {
    setCurrentSelection(selectedPalette)
  }, [selectedPalette])

  const moodOptions = [
    { id: 'energetic', name: 'Energetic', color: '#FF6B35' },
    { id: 'calm', name: 'Calm', color: '#4A90E2' },
    { id: 'sophisticated', name: 'Sophisticated', color: '#2C3E50' },
    { id: 'playful', name: 'Playful', color: '#F39C12' },
    { id: 'trustworthy', name: 'Trustworthy', color: '#3498DB' },
    { id: 'innovative', name: 'Innovative', color: '#9B59B6' },
    { id: 'natural', name: 'Natural', color: '#27AE60' },
    { id: 'luxury', name: 'Luxury', color: '#8E44AD' }
  ]

  const generateAIPalettes = async () => {
    setGenerating(true)
    try {
      // First use a token
      const success = await useToken('ai_color_generation', 'Generate AI color palettes')
      
      if (!success) {
        throw new Error('Failed to use token')
      }
      
      const request = {
        brandName,
        strategy: brandStrategy,
        archetype: brandStrategy?.archetype?.selectedArchetype || 'modern',
        industry: brandStrategy?.competitive?.industry,
        mood: selectedMood
      }

      const palettes = await aiVisualService.generateColorPalettes(request)
      setGeneratedPalettes(palettes)
    } catch (error) {
      console.error('Error generating AI palettes:', error)
    } finally {
      setGenerating(false)
    }
  }

  const selectPalette = (palette: any) => {
    const paletteData = {
      ...palette,
      aiGenerated: true,
      selectedMood,
      timestamp: new Date().toISOString()
    }
    setCurrentSelection(paletteData)
    onPaletteGenerated(paletteData)
    analyzeColors(paletteData)
  }

  const analyzeColors = (palette: any) => {
    const analysis = {
      psychology: aiVisualService.getColorPsychology(palette.colors),
      accessibility: aiVisualService.analyzeAccessibility(palette.colors),
      harmony: aiVisualService.analyzeColorHarmony(palette.colors)
    }
    setColorAnalysis(analysis)
  }

  const toggleMood = (moodId: string) => {
    setSelectedMood(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    )
  }

  const exportPalette = (palette: any, format: string) => {
    let content = ''
    const colors = palette.colors

    switch (format) {
      case 'css':
        content = `:root {\n${colors.map((color: string, index: number) => 
          `  --color-${index + 1}: ${color};`
        ).join('\n')}\n}`
        break
      case 'scss':
        content = colors.map((color: string, index: number) => 
          `$color-${index + 1}: ${color};`
        ).join('\n')
        break
      case 'json':
        content = JSON.stringify(colors, null, 2)
        break
      case 'ase':
        // Adobe Swatch Exchange format (simplified)
        content = `Adobe Swatch Exchange\n${colors.join('\n')}`
        break
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName}-palette.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* AI Color Generation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              AI Color Intelligence
            </h3>
            <p className="text-gray-600 mt-1">
              Generate scientifically-backed color palettes using AI and color psychology
            </p>
          </div>
          <AIButton
            onClick={generateAIPalettes}
            loading={generating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
            actionType="ai_color_generation"
            actionDescription="Generate AI color palettes"
          >
            Generate AI Palettes
          </AIButton>
        </div>

        {/* Brand Psychology Context */}
        {brandStrategy && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">Brand Psychology Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Archetype Influence:</span>
                <p className="text-blue-700 capitalize">
                  {brandStrategy.archetype?.selectedArchetype || 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Core Values:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {brandStrategy.values?.coreValues?.slice(0, 3).map((value: string, index: number) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Desired Mood & Emotion (Select multiple)
          </label>
          <div className="grid md:grid-cols-4 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => toggleMood(mood.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMood.includes(mood.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: mood.color }}
                />
                <span className="text-sm font-medium">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Generation Status */}
        {generating && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 text-blue-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">AI is analyzing color psychology...</span>
            </div>
            <p className="text-gray-600 mt-2">Creating harmonious palettes based on your brand</p>
          </div>
        )}
      </Card>

      {/* Current Selection */}
      {currentSelection && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-blue-600" />
              Selected Color Palette
            </h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {currentSelection.aiGenerated ? 'AI Generated' : 'Custom'}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex rounded-lg overflow-hidden border border-blue-200">
              {currentSelection.colors?.map((color: string, index: number) => (
                <div
                  key={index}
                  className="w-12 h-12 cursor-pointer relative group"
                  style={{ backgroundColor: color }}
                  onClick={() => navigator.clipboard.writeText(color)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100">
                      {color}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {currentSelection.name || 'Custom Palette'}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {currentSelection.description || 'Custom color palette for your brand'}
              </p>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => analyzeColors(currentSelection)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Analyze
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportPalette(currentSelection, 'css')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Palettes */}
      {generatedPalettes.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI-Generated Color Palettes</h3>
            <Button
              variant="outline"
              onClick={() => setShowPsychology(!showPsychology)}
              className="flex items-center space-x-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Color Psychology</span>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {generatedPalettes.map((palette) => (
              <motion.div
                key={palette.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  border-2 rounded-xl overflow-hidden cursor-pointer transition-all
                  ${currentSelection?.id === palette.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => selectPalette(palette)}
              >
                {/* Color Swatches */}
                <div className="flex h-24">
                  {palette.colors.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="flex-1 relative group"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100">
                          {color}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Palette Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{palette.name}</h4>
                    <div className="flex items-center space-x-2">
                      {currentSelection?.id === palette.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                      {palette.aiGenerated && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          AI Generated
                        </span>
                      )}
                      <span className={`
                        text-xs px-2 py-1 rounded font-medium
                        ${palette.wcagScore >= 90 
                          ? 'bg-green-100 text-green-800' 
                          : palette.wcagScore >= 80 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        WCAG {palette.wcagScore}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{palette.description}</p>
                  
                  {palette.reasoning && (
                    <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded mb-3">
                      <strong>AI Reasoning:</strong> {palette.reasoning}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        analyzeColors(palette)
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
                        exportPalette(palette, 'css')
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

      {/* Color Psychology Analysis */}
      {showPsychology && colorAnalysis && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Psychology Analysis</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Emotional Impact</h4>
              <div className="space-y-2">
                {colorAnalysis.psychology.emotions.map((emotion: string, index: number) => (
                  <div key={index} className="text-sm p-2 bg-purple-50 rounded">
                    {emotion}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Accessibility</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>WCAG AA:</span>
                  <span className="font-medium">{colorAnalysis.accessibility.wcagAA}%</span>
                </div>
                <div className="flex justify-between">
                  <span>WCAG AAA:</span>
                  <span className="font-medium">{colorAnalysis.accessibility.wcagAAA}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Blind Friendly:</span>
                  <span className="font-medium text-green-600">
                    {colorAnalysis.accessibility.colorBlindFriendly ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Color Harmony</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{colorAnalysis.harmony.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance:</span>
                  <span className="font-medium">{colorAnalysis.harmony.balance}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span className="font-medium capitalize">{colorAnalysis.harmony.temperature}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export Options */}
      {currentSelection && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Palette</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Selected Palette</h4>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-4">
                {currentSelection.colors.map((color: string, index: number) => (
                  <div
                    key={index}
                    className="flex-1 h-16 relative group cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => navigator.clipboard.writeText(color)}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100">
                        {color}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">Click colors to copy hex codes</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Formats</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette(currentSelection, 'css')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette(currentSelection, 'scss')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  SCSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette(currentSelection, 'json')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette(currentSelection, 'ase')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Adobe ASE
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Enhancement Tips */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl">
            <Zap className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Color Intelligence Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Select multiple moods for more nuanced color suggestions</li>
              <li>• AI considers your brand archetype for psychological alignment</li>
              <li>• Use the psychology analysis to understand color impact</li>
              <li>• Export in multiple formats for different design tools</li>
              <li>• Test accessibility scores for inclusive design</li>
              <li>• Selected palettes are automatically saved to your brand</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}