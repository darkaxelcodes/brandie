import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Type, Download, Eye, Sliders } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Slider } from '../ui/Slider'

interface TypographyPreviewProps {
  brandName: string
  selectedTypography?: any
  onTypographySelected: (typography: any) => void
  brandContent?: {
    tagline?: string
    description?: string
    sampleText?: string
  }
}

interface FontPairing {
  id: string
  name: string
  description: string
  heading: {
    family: string
    weights: number[]
    fallback: string
    googleFont?: string
  }
  body: {
    family: string
    weights: number[]
    fallback: string
    googleFont?: string
  }
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'bold'
}

export const TypographyPreview: React.FC<TypographyPreviewProps> = ({
  brandName,
  selectedTypography,
  onTypographySelected,
  brandContent
}) => {
  const [selectedPairing, setSelectedPairing] = useState<FontPairing | null>(null)
  const [previewSize, setPreviewSize] = useState(16)
  const [previewWeight, setPreviewWeight] = useState(400)
  const [showCustomization, setShowCustomization] = useState(false)

  const fontPairings: FontPairing[] = [
    {
      id: 'modern-sans',
      name: 'Modern Sans',
      description: 'Clean, professional, and highly readable',
      heading: {
        family: 'Inter',
        weights: [400, 600, 700],
        fallback: 'system-ui, sans-serif',
        googleFont: 'Inter:wght@400;600;700'
      },
      body: {
        family: 'Inter',
        weights: [400, 500],
        fallback: 'system-ui, sans-serif',
        googleFont: 'Inter:wght@400;500'
      },
      category: 'modern'
    },
    {
      id: 'elegant-serif',
      name: 'Elegant Serif',
      description: 'Sophisticated and timeless',
      heading: {
        family: 'Playfair Display',
        weights: [400, 600, 700],
        fallback: 'serif',
        googleFont: 'Playfair+Display:wght@400;600;700'
      },
      body: {
        family: 'Source Sans Pro',
        weights: [400, 500],
        fallback: 'sans-serif',
        googleFont: 'Source+Sans+Pro:wght@400;500'
      },
      category: 'classic'
    },
    {
      id: 'creative-display',
      name: 'Creative Display',
      description: 'Bold and expressive',
      heading: {
        family: 'Montserrat',
        weights: [400, 600, 700, 800],
        fallback: 'sans-serif',
        googleFont: 'Montserrat:wght@400;600;700;800'
      },
      body: {
        family: 'Open Sans',
        weights: [400, 500],
        fallback: 'sans-serif',
        googleFont: 'Open+Sans:wght@400;500'
      },
      category: 'creative'
    },
    {
      id: 'minimal-geometric',
      name: 'Minimal Geometric',
      description: 'Clean geometric forms',
      heading: {
        family: 'Poppins',
        weights: [400, 600, 700],
        fallback: 'sans-serif',
        googleFont: 'Poppins:wght@400;600;700'
      },
      body: {
        family: 'Poppins',
        weights: [400, 500],
        fallback: 'sans-serif',
        googleFont: 'Poppins:wght@400;500'
      },
      category: 'minimal'
    },
    {
      id: 'tech-mono',
      name: 'Tech Mono',
      description: 'Technical and precise',
      heading: {
        family: 'JetBrains Mono',
        weights: [400, 600, 700],
        fallback: 'monospace',
        googleFont: 'JetBrains+Mono:wght@400;600;700'
      },
      body: {
        family: 'Roboto',
        weights: [400, 500],
        fallback: 'sans-serif',
        googleFont: 'Roboto:wght@400;500'
      },
      category: 'modern'
    },
    {
      id: 'bold-impact',
      name: 'Bold Impact',
      description: 'Strong and commanding',
      heading: {
        family: 'Oswald',
        weights: [400, 600, 700],
        fallback: 'sans-serif',
        googleFont: 'Oswald:wght@400;600;700'
      },
      body: {
        family: 'Lato',
        weights: [400, 500],
        fallback: 'sans-serif',
        googleFont: 'Lato:wght@400;500'
      },
      category: 'bold'
    }
  ]

  const selectPairing = (pairing: FontPairing) => {
    setSelectedPairing(pairing)
    onTypographySelected(pairing)
  }

  const loadGoogleFont = (fontUrl: string) => {
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  const sampleContent = {
    tagline: brandContent?.tagline || `${brandName} - Innovation Simplified`,
    description: brandContent?.description || `${brandName} is revolutionizing the industry with cutting-edge solutions that empower businesses to achieve their goals faster and more efficiently than ever before.`,
    sampleText: brandContent?.sampleText || `At ${brandName}, we believe in the power of great design to transform businesses and create meaningful connections with customers. Our approach combines strategic thinking with creative excellence to deliver results that matter.`
  }

  return (
    <div className="space-y-6">
      {/* Typography Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Typography Pairings</h3>
            <p className="text-gray-600">Choose fonts that reflect your brand personality</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCustomization(!showCustomization)}
            className="flex items-center space-x-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Customize</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {fontPairings.map((pairing) => (
            <motion.div
              key={pairing.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                border-2 rounded-xl p-6 cursor-pointer transition-all
                ${selectedPairing?.id === pairing.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => {
                selectPairing(pairing)
                if (pairing.heading.googleFont) loadGoogleFont(pairing.heading.googleFont)
                if (pairing.body.googleFont) loadGoogleFont(pairing.body.googleFont)
              }}
            >
              {/* Font Preview */}
              <div className="mb-4">
                <h4 
                  className="text-2xl font-bold text-gray-900 mb-2"
                  style={{ 
                    fontFamily: pairing.heading.family,
                    fontWeight: 700
                  }}
                >
                  {brandName}
                </h4>
                <p 
                  className="text-gray-600 text-sm"
                  style={{ 
                    fontFamily: pairing.body.family,
                    fontWeight: 400
                  }}
                >
                  {sampleContent.tagline}
                </p>
              </div>
              
              {/* Pairing Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">{pairing.name}</h5>
                  <span className={`
                    text-xs px-2 py-1 rounded font-medium
                    ${pairing.category === 'modern' ? 'bg-blue-100 text-blue-800' :
                      pairing.category === 'classic' ? 'bg-purple-100 text-purple-800' :
                      pairing.category === 'creative' ? 'bg-pink-100 text-pink-800' :
                      pairing.category === 'minimal' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }
                  `}>
                    {pairing.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{pairing.description}</p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Heading:</strong> {pairing.heading.family}</p>
                  <p><strong>Body:</strong> {pairing.body.family}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Typography Customization */}
      {showCustomization && selectedPairing && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography Customization</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Slider
                value={previewSize}
                onChange={setPreviewSize}
                min={12}
                max={24}
                leftLabel="Small"
                rightLabel="Large"
                className="mb-4"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Weight
                </label>
                <select
                  value={previewWeight}
                  onChange={(e) => setPreviewWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={400}>Regular (400)</option>
                  <option value={500}>Medium (500)</option>
                  <option value={600}>Semi Bold (600)</option>
                  <option value={700}>Bold (700)</option>
                </select>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Export Options</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  CSS
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Google Fonts
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Font Files
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Style Guide
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Live Preview */}
      {selectedPairing && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          
          <div className="space-y-6">
            {/* Heading Styles */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Headings</h4>
              <div className="space-y-3">
                <h1 
                  className="text-gray-900"
                  style={{ 
                    fontFamily: selectedPairing.heading.family,
                    fontSize: `${previewSize * 2}px`,
                    fontWeight: previewWeight,
                    lineHeight: 1.2
                  }}
                >
                  {brandName} - Main Heading
                </h1>
                <h2 
                  className="text-gray-800"
                  style={{ 
                    fontFamily: selectedPairing.heading.family,
                    fontSize: `${previewSize * 1.5}px`,
                    fontWeight: previewWeight - 100,
                    lineHeight: 1.3
                  }}
                >
                  Secondary Heading
                </h2>
                <h3 
                  className="text-gray-700"
                  style={{ 
                    fontFamily: selectedPairing.heading.family,
                    fontSize: `${previewSize * 1.25}px`,
                    fontWeight: previewWeight - 100,
                    lineHeight: 1.4
                  }}
                >
                  Tertiary Heading
                </h3>
              </div>
            </div>
            
            {/* Body Text */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Body Text</h4>
              <div className="space-y-4">
                <p 
                  className="text-gray-900"
                  style={{ 
                    fontFamily: selectedPairing.body.family,
                    fontSize: `${previewSize}px`,
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  <strong style={{ fontWeight: 600 }}>Tagline:</strong> {sampleContent.tagline}
                </p>
                
                <p 
                  className="text-gray-700"
                  style={{ 
                    fontFamily: selectedPairing.body.family,
                    fontSize: `${previewSize}px`,
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  {sampleContent.description}
                </p>
                
                <p 
                  className="text-gray-600"
                  style={{ 
                    fontFamily: selectedPairing.body.family,
                    fontSize: `${previewSize - 2}px`,
                    fontWeight: 400,
                    lineHeight: 1.7
                  }}
                >
                  {sampleContent.sampleText}
                </p>
              </div>
            </div>
            
            {/* Typography Scale */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Typography Scale</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[12, 14, 16, 18, 20, 24, 32, 48].map((size) => (
                  <div key={size} className="p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="text-gray-900 mb-1"
                      style={{ 
                        fontFamily: selectedPairing.body.family,
                        fontSize: `${size}px`,
                        lineHeight: 1.2
                      }}
                    >
                      Aa
                    </div>
                    <div className="text-xs text-gray-500">{size}px</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}