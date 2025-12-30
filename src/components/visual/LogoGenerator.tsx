import React, { useState } from 'react'
import DOMPurify from 'dompurify'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Palette, Type, Circle, Square, Triangle, Star, Heart, Zap } from 'lucide-react'

interface LogoGeneratorProps {
  onLogoGenerated: (logoData: any) => void
  brandName: string
  brandColors?: string[]
}

export const LogoGenerator: React.FC<LogoGeneratorProps> = ({
  onLogoGenerated,
  brandName,
  brandColors = ['#3B82F6', '#1E40AF']
}) => {
  const [selectedStyle, setSelectedStyle] = useState<'minimal' | 'modern' | 'classic' | 'playful'>('modern')
  const [selectedIcon, setSelectedIcon] = useState<string>('circle')
  const [isGenerating, setIsGenerating] = useState(false)

  const iconOptions = [
    { name: 'circle', icon: Circle, label: 'Circle' },
    { name: 'square', icon: Square, label: 'Square' },
    { name: 'triangle', icon: Triangle, label: 'Triangle' },
    { name: 'star', icon: Star, label: 'Star' },
    { name: 'heart', icon: Heart, label: 'Heart' },
    { name: 'zap', icon: Zap, label: 'Lightning' }
  ]

  const styleOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Clean and simple' },
    { value: 'modern', label: 'Modern', description: 'Contemporary and sleek' },
    { value: 'classic', label: 'Classic', description: 'Timeless and elegant' },
    { value: 'playful', label: 'Playful', description: 'Fun and creative' }
  ]

  const generateLogo = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate logo generation with a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const logoData = {
        style: selectedStyle,
        icon: selectedIcon,
        brandName,
        colors: brandColors,
        svg: generateSVGLogo(),
        timestamp: new Date().toISOString()
      }
      
      onLogoGenerated(logoData)
    } catch (error) {
      console.error('Error generating logo:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Sanitize text for SVG/XML context
  const sanitizeSVGText = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // Validate hex color
  const isValidHexColor = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  const generateSVGLogo = () => {
    // Validate and sanitize colors
    const primaryColor = isValidHexColor(brandColors[0]) ? brandColors[0] : '#3B82F6'
    const secondaryColor = isValidHexColor(brandColors[1]) ? brandColors[1] : '#1E40AF'

    // Sanitize brand name for SVG
    const safeBrandName = sanitizeSVGText(brandName)

    // Create a simple SVG logo based on selected options
    const svgContent = `
      <svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        ${getIconSVG(selectedIcon, primaryColor)}
        <text x="50" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${primaryColor}">
          ${safeBrandName}
        </text>
      </svg>
    `

    return svgContent.trim()
  }

  const getIconSVG = (iconName: string, color: string) => {
    const iconSize = 24
    const iconX = 15
    const iconY = 28

    switch (iconName) {
      case 'circle':
        return `<circle cx="${iconX + iconSize/2}" cy="${iconY + iconSize/2}" r="${iconSize/2}" fill="${color}" />`
      case 'square':
        return `<rect x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" fill="${color}" />`
      case 'triangle':
        return `<polygon points="${iconX + iconSize/2},${iconY} ${iconX},${iconY + iconSize} ${iconX + iconSize},${iconY + iconSize}" fill="${color}" />`
      case 'star':
        return `<polygon points="${iconX + iconSize/2},${iconY} ${iconX + iconSize*0.6},${iconY + iconSize*0.4} ${iconX + iconSize},${iconY + iconSize*0.4} ${iconX + iconSize*0.7},${iconY + iconSize*0.7} ${iconX + iconSize*0.8},${iconY + iconSize} ${iconX + iconSize/2},${iconY + iconSize*0.8} ${iconX + iconSize*0.2},${iconY + iconSize} ${iconX + iconSize*0.3},${iconY + iconSize*0.7} ${iconX},${iconY + iconSize*0.4} ${iconX + iconSize*0.4},${iconY + iconSize*0.4}" fill="${color}" />`
      case 'heart':
        return `<path d="M${iconX + iconSize/2},${iconY + iconSize*0.8} C${iconX + iconSize/2},${iconY + iconSize*0.8} ${iconX},${iconY + iconSize*0.4} ${iconX},${iconY + iconSize*0.25} C${iconX},${iconY} ${iconX + iconSize*0.25},${iconY} ${iconX + iconSize/2},${iconY + iconSize*0.25} C${iconX + iconSize*0.75},${iconY} ${iconX + iconSize},${iconY} ${iconX + iconSize},${iconY + iconSize*0.25} C${iconX + iconSize},${iconY + iconSize*0.4} ${iconX + iconSize/2},${iconY + iconSize*0.8} ${iconX + iconSize/2},${iconY + iconSize*0.8} Z" fill="${color}" />`
      case 'zap':
        return `<polygon points="${iconX + iconSize*0.6},${iconY} ${iconX + iconSize*0.2},${iconY + iconSize*0.5} ${iconX + iconSize*0.5},${iconY + iconSize*0.5} ${iconX + iconSize*0.4},${iconY + iconSize} ${iconX + iconSize*0.8},${iconY + iconSize*0.5} ${iconX + iconSize*0.5},${iconY + iconSize*0.5}" fill="${color}" />`
      default:
        return `<circle cx="${iconX + iconSize/2}" cy="${iconY + iconSize/2}" r="${iconSize/2}" fill="${color}" />`
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Logo Generator
        </h3>
        
        <div className="space-y-6">
          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Logo Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value as any)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedStyle === style.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-sm text-gray-500">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Icon Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {iconOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.name}
                    onClick={() => setSelectedIcon(option.name)}
                    className={`p-3 flex flex-col items-center gap-2 border rounded-lg transition-colors ${
                      selectedIcon === option.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preview
            </label>
            <div className="border rounded-lg p-6 bg-gray-50 flex items-center justify-center">
              <div
                className="bg-white p-4 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generateSVGLogo()) }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateLogo}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Logo...' : 'Generate Logo'}
          </Button>
        </div>
      </Card>
    </div>
  )
}