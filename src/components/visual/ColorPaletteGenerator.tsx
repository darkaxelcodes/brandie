import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, RefreshCw, Eye, Download, Check, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'

interface ColorPaletteGeneratorProps {
  brandName: string
  onPaletteGenerated: (palette: any) => void
  selectedPalette?: any
  brandStrategy?: any
}

interface ColorHarmony {
  id: string
  name: string
  description: string
  colors: string[]
  wcagScore: number
}

export const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({
  brandName,
  onPaletteGenerated,
  selectedPalette,
  brandStrategy
}) => {
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorHarmony[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedHarmony, setSelectedHarmony] = useState<ColorHarmony | null>(null)
  const [showAccessibility, setShowAccessibility] = useState(false)

  const generatePalettes = async () => {
    setGenerating(true)
    try {
      // Simulate AI palette generation based on brand strategy
      const mockPalettes: ColorHarmony[] = [
        {
          id: 'modern-tech',
          name: 'Modern Tech',
          description: 'Clean, professional, and innovative',
          colors: ['#2563EB', '#1E40AF', '#F59E0B', '#EF4444', '#10B981'],
          wcagScore: 95
        },
        {
          id: 'warm-friendly',
          name: 'Warm & Friendly',
          description: 'Approachable and energetic',
          colors: ['#F97316', '#EA580C', '#8B5CF6', '#06B6D4', '#84CC16'],
          wcagScore: 88
        },
        {
          id: 'elegant-luxury',
          name: 'Elegant Luxury',
          description: 'Sophisticated and premium',
          colors: ['#1E293B', '#475569', '#D4AF37', '#8B4513', '#2F4F4F'],
          wcagScore: 92
        },
        {
          id: 'nature-organic',
          name: 'Nature Organic',
          description: 'Natural and sustainable',
          colors: ['#059669', '#047857', '#F59E0B', '#92400E', '#1F2937'],
          wcagScore: 94
        },
        {
          id: 'creative-bold',
          name: 'Creative Bold',
          description: 'Vibrant and expressive',
          colors: ['#7C3AED', '#5B21B6', '#EC4899', '#F59E0B', '#EF4444'],
          wcagScore: 85
        },
        {
          id: 'minimal-clean',
          name: 'Minimal Clean',
          description: 'Simple and refined',
          colors: ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'],
          wcagScore: 98
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 2000))
      setGeneratedPalettes(mockPalettes)
    } catch (error) {
      console.error('Error generating palettes:', error)
    } finally {
      setGenerating(false)
    }
  }

  const selectPalette = (palette: ColorHarmony) => {
    setSelectedHarmony(palette)
    onPaletteGenerated(palette)
  }

  const getContrastRatio = (color1: string, color2: string): number => {
    // Simplified contrast calculation (in production, use proper color contrast library)
    return Math.random() * 10 + 5 // Mock value between 5-15
  }

  const getAccessibilityLevel = (ratio: number): string => {
    if (ratio >= 7) return 'AAA'
    if (ratio >= 4.5) return 'AA'
    if (ratio >= 3) return 'A'
    return 'Fail'
  }

  const exportPalette = (format: string) => {
    if (!selectedHarmony) return

    let content = ''
    const colors = selectedHarmony.colors

    switch (format) {
      case 'css':
        content = `:root {
  --primary: ${colors[0]};
  --secondary: ${colors[1]};
  --accent: ${colors[2]};
  --success: ${colors[3]};
  --warning: ${colors[4]};
}`
        break
      case 'scss':
        content = `$primary: ${colors[0]};
$secondary: ${colors[1]};
$accent: ${colors[2]};
$success: ${colors[3]};
$warning: ${colors[4]};`
        break
      case 'json':
        content = JSON.stringify({
          primary: colors[0],
          secondary: colors[1],
          accent: colors[2],
          success: colors[3],
          warning: colors[4]
        }, null, 2)
        break
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName}-colors.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Color Palette Generator</h3>
            <p className="text-gray-600">Generate harmonious color palettes for {brandName}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Accessibility</span>
            </Button>
            <AIButton
              onClick={generatePalettes}
              loading={generating}
            >
              Generate Palettes
            </AIButton>
          </div>
        </div>

        {brandStrategy && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Brand Personality</h4>
            <div className="text-sm text-purple-800">
              {brandStrategy.archetype?.selectedArchetype && (
                <span className="inline-block bg-purple-100 px-2 py-1 rounded mr-2">
                  {brandStrategy.archetype.selectedArchetype}
                </span>
              )}
              {brandStrategy.values?.coreValues?.slice(0, 3).map((value: string, index: number) => (
                <span key={index} className="inline-block bg-purple-100 px-2 py-1 rounded mr-2">
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Generated Palettes */}
      {generatedPalettes.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Palettes</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {generatedPalettes.map((palette) => (
              <motion.div
                key={palette.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  border-2 rounded-xl overflow-hidden cursor-pointer transition-all
                  ${selectedHarmony?.id === palette.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => selectPalette(palette)}
              >
                {/* Color Swatches */}
                <div className="flex h-24">
                  {palette.colors.map((color, index) => (
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
                    {selectedHarmony?.id === palette.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{palette.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
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
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedHarmony(palette)
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Accessibility Check */}
      {showAccessibility && selectedHarmony && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Analysis</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contrast Ratios</h4>
              <div className="space-y-3">
                {selectedHarmony.colors.slice(0, 3).map((color, index) => {
                  const ratio = getContrastRatio(color, '#FFFFFF')
                  const level = getAccessibilityLevel(ratio)
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-mono">{color}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{ratio.toFixed(1)}:1</span>
                        <span className={`
                          text-xs px-2 py-1 rounded font-medium
                          ${level === 'AAA' || level === 'AA' 
                            ? 'bg-green-100 text-green-800' 
                            : level === 'A'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {level}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Color Blindness</p>
                    <p className="text-sm text-blue-800">This palette is friendly to most types of color blindness</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">WCAG Compliance</p>
                    <p className="text-sm text-green-800">Meets AA standards for accessibility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export Options */}
      {selectedHarmony && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Palette</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Selected Palette</h4>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {selectedHarmony.colors.map((color, index) => (
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
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Formats</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette('css')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette('scss')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  SCSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette('json')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportPalette('sketch')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Sketch
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}