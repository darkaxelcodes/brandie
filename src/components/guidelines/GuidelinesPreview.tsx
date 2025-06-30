import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Eye, Palette, Type, MessageSquare, Target, Download, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ModeToggle } from '../ui/ModeToggle'
import { AIPilotGuidelines } from './AIPilotGuidelines'

interface GuidelinesPreviewProps {
  brandData: any
  guidelines: any
  onGenerate: () => void
  generating: boolean
  canGenerate: boolean
}

export const GuidelinesPreview: React.FC<GuidelinesPreviewProps> = ({
  brandData,
  guidelines,
  onGenerate,
  generating,
  canGenerate
}) => {
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleAIPilotComplete = (data: any) => {
    // In a real implementation, this would process the AI-generated guidelines
    onGenerate()
    setMode('manual')
  }

  const handleExport = () => {
    if (!previewRef.current) return
    
    // In a real implementation, this would export the current view
    window.print()
  }

  if (mode === 'ai-pilot') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Brand Guidelines</h2>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <AIPilotGuidelines
          brandName={brandData?.brand?.name || ''}
          onComplete={handleAIPilotComplete}
          brandData={brandData}
        />
      </div>
    )
  }

  if (!guidelines && canGenerate) {
    return (
      <Card className="p-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Generate Your Brand Guidelines
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Create a comprehensive brand guidelines document that includes all your brand elements, 
          usage rules, and implementation guidance.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={onGenerate}
            loading={generating}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Guidelines</span>
          </Button>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
      </Card>
    )
  }

  if (!guidelines && !canGenerate) {
    return (
      <Card className="p-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-6">
          <FileText className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Complete Your Brand First
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          To generate comprehensive guidelines, please complete your brand strategy, 
          visual identity, and brand voice sections first.
        </p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex items-center space-x-2"
        >
          <Target className="w-4 h-4" />
          <span>Complete Brand Elements</span>
        </Button>
      </Card>
    )
  }

  if (generating) {
    return (
      <Card className="p-12 text-center">
        <div className="inline-flex items-center space-x-3 text-blue-600 mb-4">
          <Sparkles className="w-8 h-8 animate-spin" />
          <span className="text-xl font-medium">Generating Guidelines...</span>
        </div>
        <p className="text-gray-600">
          AI is creating your comprehensive brand guidelines document
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Guidelines Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Brand Guidelines Overview</h3>
            <p className="text-gray-600">Comprehensive brand identity documentation</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Generated
            </span>
            <ModeToggle mode={mode} onModeChange={setMode} />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div 
            className={`text-center p-4 rounded-lg cursor-pointer transition-all ${
              activeSection === 'strategy' ? 'bg-blue-100' : 'bg-blue-50 hover:bg-blue-100'
            }`}
            onClick={() => setActiveSection(activeSection === 'strategy' ? null : 'strategy')}
          >
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Strategy</h4>
            <p className="text-sm text-gray-600">Purpose, values, positioning</p>
          </div>
          <div 
            className={`text-center p-4 rounded-lg cursor-pointer transition-all ${
              activeSection === 'visual' ? 'bg-purple-100' : 'bg-purple-50 hover:bg-purple-100'
            }`}
            onClick={() => setActiveSection(activeSection === 'visual' ? null : 'visual')}
          >
            <Palette className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Visual Identity</h4>
            <p className="text-sm text-gray-600">Logo, colors, typography</p>
          </div>
          <div 
            className={`text-center p-4 rounded-lg cursor-pointer transition-all ${
              activeSection === 'voice' ? 'bg-green-100' : 'bg-green-50 hover:bg-green-100'
            }`}
            onClick={() => setActiveSection(activeSection === 'voice' ? null : 'voice')}
          >
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Brand Voice</h4>
            <p className="text-sm text-gray-600">Tone, messaging, guidelines</p>
          </div>
          <div 
            className={`text-center p-4 rounded-lg cursor-pointer transition-all ${
              activeSection === 'usage' ? 'bg-orange-100' : 'bg-orange-50 hover:bg-orange-100'
            }`}
            onClick={() => setActiveSection(activeSection === 'usage' ? null : 'usage')}
          >
            <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Usage Rules</h4>
            <p className="text-sm text-gray-600">Do's, don'ts, applications</p>
          </div>
        </div>
      </Card>

      {/* Guidelines Preview */}
      <div ref={previewRef}>
        {/* Brand Identity Section */}
        {(!activeSection || activeSection === 'strategy') && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Identity</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Brand Overview</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Mission:</span>
                    <p className="text-gray-600 mt-1">
                      {brandData?.strategy?.purpose?.mission || 'Not defined'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Vision:</span>
                    <p className="text-gray-600 mt-1">
                      {brandData?.strategy?.purpose?.vision || 'Not defined'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Values:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {brandData?.strategy?.values?.coreValues?.map((value: string, index: number) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Target Audience</h4>
                <div className="text-sm">
                  <p className="text-gray-600 mb-2">
                    {brandData?.strategy?.audience?.primaryAudience || 'Not defined'}
                  </p>
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium text-gray-700">Demographics:</span>
                      <p className="text-gray-600">
                        {brandData?.strategy?.audience?.demographics || 'Not defined'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Visual Elements */}
        {(!activeSection || activeSection === 'visual') && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Elements</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Logo */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Logo</h4>
                <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center mb-3">
                  {brandData?.visual?.logo?.url ? (
                    <img 
                      src={brandData.visual.logo.url} 
                      alt="Brand logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : brandData?.visual?.logo?.svg ? (
                    <div dangerouslySetInnerHTML={{ __html: brandData.visual.logo.svg }} />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <Palette className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm">Logo</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  {brandData?.visual?.logo?.style || 'Custom'} style logo
                </p>
              </div>

              {/* Colors */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Color Palette</h4>
                <div className="space-y-2 mb-3">
                  {brandData?.visual?.colors?.colors?.slice(0, 5).map((color: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-mono text-gray-600">{color}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  {brandData?.visual?.colors?.name || 'Custom'} palette
                </p>
              </div>

              {/* Typography */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Typography</h4>
                <div className="space-y-3 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Heading</span>
                    <p 
                      className="font-bold text-lg text-gray-900"
                      style={{ fontFamily: brandData?.visual?.typography?.heading?.family || 'Arial' }}
                    >
                      {brandData?.brand?.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Body</span>
                    <p 
                      className="text-sm text-gray-600"
                      style={{ fontFamily: brandData?.visual?.typography?.body?.family || 'Arial' }}
                    >
                      Sample body text for brand guidelines
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {brandData?.visual?.typography?.name || 'Custom'} pairing
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Brand Voice */}
        {(!activeSection || activeSection === 'voice') && brandData?.voice && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Voice & Messaging</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Tone of Voice</h4>
                <div className="space-y-2">
                  {Object.entries(brandData.voice.tone_scales || {}).map(([scale, value]: [string, any]) => (
                    <div key={scale} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {scale.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Messages</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Tagline</span>
                    <p className="text-sm text-gray-900">
                      {brandData.voice.messaging?.tagline || 'Not defined'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Elevator Pitch</span>
                    <p className="text-sm text-gray-600">
                      {brandData.voice.messaging?.elevatorPitch?.slice(0, 100) || 'Not defined'}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Usage Guidelines */}
        {(!activeSection || activeSection === 'usage') && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Guidelines</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-green-700">Do's</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-600">Use the logo with adequate clear space</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-600">Maintain consistent color usage across materials</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-600">Use approved typography pairings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-600">Follow brand voice guidelines in all communications</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-red-700">Don'ts</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-gray-600">Don't stretch or distort the logo</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-gray-600">Don't use unauthorized color variations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-gray-600">Don't mix typography from different brand systems</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-gray-600">Don't deviate from established brand voice</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* View Full Guidelines Button */}
      <div className="flex justify-center">
        <Button 
          size="lg"
          className="flex items-center space-x-2"
          onClick={() => window.open('/guidelines/full-preview', '_blank')}
        >
          <Eye className="w-5 h-5" />
          <span>View Full Guidelines</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}