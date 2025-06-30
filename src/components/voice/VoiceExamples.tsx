import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Copy, RefreshCw, Sparkles, Eye, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface VoiceExamplesProps {
  brandData: any
  brandVoice: any
}

export const VoiceExamples: React.FC<VoiceExamplesProps> = ({
  brandData,
  brandVoice
}) => {
  const [examples, setExamples] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState('social')

  const contentTypes = [
    { id: 'social', name: 'Social Media', icon: MessageSquare },
    { id: 'email', name: 'Email', icon: MessageSquare },
    { id: 'website', name: 'Website Copy', icon: Eye },
    { id: 'ads', name: 'Advertising', icon: Sparkles }
  ]

  const generateExamples = async () => {
    if (!brandData || !brandVoice) return

    setGenerating(true)
    try {
      const context = {
        brandName: brandData.brand?.name,
        strategy: brandData.strategy,
        voice: brandVoice,
        contentType: selectedType
      }

      const response = await generateStrategySuggestions('voice', context)
      
      // Mock examples based on content type
      const mockExamples = [
        {
          type: selectedType,
          title: `${selectedType === 'social' ? 'Social Media Post' : 
                   selectedType === 'email' ? 'Email Subject Line' :
                   selectedType === 'website' ? 'Homepage Hero' : 'Ad Headline'}`,
          content: response.suggestions[0] || `Sample ${selectedType} content for ${brandData.brand?.name}`,
          tone: getToneFromScales(brandVoice.tone_scales),
          engagement: Math.floor(Math.random() * 30) + 70
        },
        {
          type: selectedType,
          title: `${selectedType === 'social' ? 'Story Caption' : 
                   selectedType === 'email' ? 'Newsletter Intro' :
                   selectedType === 'website' ? 'About Section' : 'CTA Button'}`,
          content: response.suggestions[1] || `Another sample ${selectedType} content`,
          tone: getToneFromScales(brandVoice.tone_scales),
          engagement: Math.floor(Math.random() * 30) + 70
        }
      ]

      setExamples(mockExamples)
    } catch (error) {
      console.error('Error generating examples:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getToneFromScales = (scales: any) => {
    if (!scales) return 'balanced'
    
    const traits = []
    if (scales.formalCasual > 60) traits.push('casual')
    else if (scales.formalCasual < 40) traits.push('formal')
    
    if (scales.playfulSerious > 60) traits.push('playful')
    else if (scales.playfulSerious < 40) traits.push('serious')
    
    return traits.join(', ') || 'balanced'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportExamples = () => {
    const content = examples.map(example => 
      `${example.title}\n${example.content}\nTone: ${example.tone}\n\n`
    ).join('')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandData.brand?.name}-voice-examples.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <type.icon className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">{type.name}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Generate {selectedType} content examples in your brand voice
          </p>
          <Button
            onClick={generateExamples}
            loading={generating}
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Examples</span>
          </Button>
        </div>
      </Card>

      {/* Generated Examples */}
      {examples.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Examples</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={generateExamples}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={exportExamples}
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{example.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {example.engagement}% Match
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(example.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">{example.content}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tone: {example.tone}</span>
                  <span className="text-gray-500">Type: {example.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Voice Guidelines Summary */}
      {brandVoice && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Voice Guidelines Summary</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Do's</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {brandVoice.guidelines?.dosList?.slice(0, 3).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                )) || <li>• No guidelines defined yet</li>}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Don'ts</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {brandVoice.guidelines?.dontsList?.slice(0, 3).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                )) || <li>• No guidelines defined yet</li>}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}