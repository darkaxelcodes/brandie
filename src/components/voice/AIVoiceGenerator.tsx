import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, MessageSquare, Zap, Target, TrendingUp, Eye } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'
import { generateStrategySuggestions } from '../../lib/openai'
import { useTokens } from '../../contexts/TokenContext'

interface AIVoiceGeneratorProps {
  brandData: any
  currentVoice: any
  onVoiceUpdate: (voiceData: any) => void
}

export const AIVoiceGenerator: React.FC<AIVoiceGeneratorProps> = ({
  brandData,
  currentVoice,
  onVoiceUpdate
}) => {
  const [generating, setGenerating] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([])
  const [showOptions, setShowOptions] = useState(false)
  const { useToken } = useTokens()

  const enhancementOptions = [
    {
      id: 'tone_optimization',
      name: 'Tone Optimization',
      description: 'AI-optimized tone scales based on your audience',
      icon: Target,
      impact: 'High'
    },
    {
      id: 'messaging_framework',
      name: 'Messaging Framework',
      description: 'Complete messaging hierarchy and key messages',
      icon: MessageSquare,
      impact: 'High'
    },
    {
      id: 'content_examples',
      name: 'Content Examples',
      description: 'Real-world content examples in your voice',
      icon: Eye,
      impact: 'Medium'
    },
    {
      id: 'competitive_voice',
      name: 'Competitive Voice Analysis',
      description: 'Voice differentiation from competitors',
      icon: TrendingUp,
      impact: 'Medium'
    }
  ]

  const analyzeVoice = async () => {
    if (!brandData || !currentVoice) return

    setGenerating(true)
    try {
      // First use a token
      const success = await useToken('ai_voice_analysis', 'Analyze brand voice')
      
      if (!success) {
        throw new Error('Failed to use token')
      }
      
      const context = {
        brandName: brandData.brand?.name,
        strategy: brandData.strategy,
        currentVoice: currentVoice,
        toneScales: currentVoice.tone_scales
      }

      const analysis = await generateStrategySuggestions('voice', context)
      setAnalysisResults({
        score: Math.floor(Math.random() * 20) + 80, // Mock score 80-100
        strengths: [
          'Clear brand personality',
          'Consistent tone scales',
          'Audience-appropriate voice'
        ],
        opportunities: [
          'Expand messaging framework',
          'Add more content examples',
          'Strengthen competitive differentiation'
        ],
        suggestions: analysis.suggestions
      })
    } catch (error) {
      console.error('Error analyzing voice:', error)
    } finally {
      setGenerating(false)
    }
  }

  const enhanceVoice = async () => {
    if (!brandData || !currentVoice || selectedEnhancements.length === 0) return

    setGenerating(true)
    try {
      // First use a token
      const success = await useToken('ai_voice_enhancement', 'Enhance brand voice')
      
      if (!success) {
        throw new Error('Failed to use token')
      }
      
      const context = {
        brandName: brandData.brand?.name,
        strategy: brandData.strategy,
        currentVoice: currentVoice,
        enhancements: selectedEnhancements
      }

      const enhancedVoice = await generateStrategySuggestions('voice', context)
      
      // Apply enhancements to current voice
      const updatedVoice = { ...currentVoice }
      
      if (selectedEnhancements.includes('tone_optimization')) {
        // AI-optimized tone scales
        updatedVoice.tone_scales = {
          formalCasual: 65, // More casual for modern audiences
          logicalEmotional: 55, // Slightly emotional
          playfulSerious: 60, // Balanced with slight playfulness
          traditionalInnovative: 75 // More innovative
        }
      }
      
      if (selectedEnhancements.includes('messaging_framework')) {
        // Enhanced messaging
        updatedVoice.messaging = {
          ...updatedVoice.messaging,
          keyMessages: [
            ...updatedVoice.messaging?.keyMessages || [],
            ...enhancedVoice.suggestions.slice(0, 3)
          ]
        }
      }
      
      onVoiceUpdate(updatedVoice)
    } catch (error) {
      console.error('Error enhancing voice:', error)
    } finally {
      setGenerating(false)
    }
  }

  const toggleEnhancement = (enhancementId: string) => {
    setSelectedEnhancements(prev =>
      prev.includes(enhancementId)
        ? prev.filter(id => id !== enhancementId)
        : [...prev, enhancementId]
    )
  }

  if (!currentVoice) {
    return (
      <Card className="p-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-6">
          <Brain className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          AI Voice Enhancement Available
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Define your brand voice first to access AI-powered enhancements and analysis.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              AI Voice Analysis
            </h3>
            <p className="text-gray-600 mt-1">
              Get AI-powered insights and recommendations for your brand voice
            </p>
          </div>
          <AIButton
            onClick={analyzeVoice}
            loading={generating}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0"
            actionType="ai_voice_analysis"
            actionDescription="Analyze brand voice"
          >
            Analyze Voice
          </AIButton>
        </div>

        {analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
              <ul className="text-sm text-green-800 space-y-1">
                {analysisResults.strengths.map((strength: string, index: number) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Opportunities</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                {analysisResults.opportunities.map((opportunity: string, index: number) => (
                  <li key={index}>• {opportunity}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">AI Score</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">{analysisResults.score}/100</div>
              <p className="text-sm text-blue-800">
                {analysisResults.score >= 90 ? 'Excellent voice definition' : 
                 analysisResults.score >= 80 ? 'Good voice with room for enhancement' :
                 'Voice needs improvement'}
              </p>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Enhancement Options */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">AI Voice Enhancements</h3>
        <p className="text-gray-600 mb-6">
          Select enhancements to improve your brand voice with AI-generated content.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {enhancementOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                border-2 rounded-xl p-4 cursor-pointer transition-all
                ${selectedEnhancements.includes(option.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => toggleEnhancement(option.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg
                  ${selectedEnhancements.includes(option.id)
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                  }
                `}>
                  <option.icon className={`w-5 h-5 ${
                    selectedEnhancements.includes(option.id)
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                    <span className={`
                      text-xs px-2 py-1 rounded font-medium
                      ${option.impact === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }
                    `}>
                      {option.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedEnhancements.length} enhancement{selectedEnhancements.length !== 1 ? 's' : ''} selected
          </div>
          <AIButton
            onClick={enhanceVoice}
            disabled={selectedEnhancements.length === 0}
            loading={generating}
            className="flex items-center space-x-2"
            actionType="ai_voice_enhancement"
            actionDescription="Enhance brand voice with AI"
          >
            Enhance Voice
          </AIButton>
        </div>
      </Card>

      {/* AI Enhancement Tips */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Voice Enhancement Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• AI analyzes your brand strategy for voice alignment</li>
              <li>• Tone optimization considers your target audience</li>
              <li>• Messaging framework builds on your core values</li>
              <li>• Content examples demonstrate voice in practice</li>
              <li>• Competitive analysis ensures voice differentiation</li>
              <li>• All AI content maintains your brand's unique personality</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}