import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Palette, Sparkles, ArrowRight, Check, MessageSquare, Eye, Type, Image } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotVisualProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
  strategyContext?: any
  visualType: 'logo' | 'colors' | 'typography'
}

export const AIPilotVisual: React.FC<AIPilotVisualProps> = ({
  brandName,
  onComplete,
  initialData,
  strategyContext,
  visualType
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(['', '', ''])
  const [currentResponse, setCurrentResponse] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [aiOptions, setAiOptions] = useState<any[]>([])
  const [selectedOptions, setSelectedOptions] = useState<any>({})
  const [showOptions, setShowOptions] = useState(false)

  const questionSets = {
    logo: [
      {
        id: 'logo_feeling',
        question: "When people see your logo, what feeling should it evoke?",
        placeholder: "I want people to feel...",
        followUp: "Think about the emotional response - professional, friendly, innovative, trustworthy?"
      },
      {
        id: 'logo_style',
        question: "Describe your ideal logo style. What appeals to you visually?",
        placeholder: "I like logos that are...",
        followUp: "Consider: simple vs detailed, modern vs classic, text vs symbols, colorful vs minimal."
      },
      {
        id: 'logo_usage',
        question: "Where will you use your logo most? What's the primary context?",
        placeholder: "We'll mainly use it on...",
        followUp: "Business cards, website, social media, products, signage? This affects design choices."
      }
    ],
    colors: [
      {
        id: 'color_emotion',
        question: "What emotions should your brand colors communicate?",
        placeholder: "Our colors should make people feel...",
        followUp: "Colors have psychological impact - trust (blue), energy (orange), growth (green), etc."
      },
      {
        id: 'color_preferences',
        question: "Are there any colors you love or absolutely want to avoid?",
        placeholder: "I love... but never want to use...",
        followUp: "Personal preferences and industry considerations both matter."
      },
      {
        id: 'color_context',
        question: "How will your audience primarily see your brand colors?",
        placeholder: "Most people will see our colors on...",
        followUp: "Digital screens, print materials, products, environments? This affects color choices."
      }
    ],
    typography: [
      {
        id: 'typography_personality',
        question: "If your brand's voice was a font, how would it look and feel?",
        placeholder: "Our typography should feel...",
        followUp: "Professional, friendly, modern, classic, bold, elegant? Typography conveys personality."
      },
      {
        id: 'typography_readability',
        question: "What's most important for your text - style or readability?",
        placeholder: "For us, it's more important that text is...",
        followUp: "Consider your audience and where they'll read your content most often."
      },
      {
        id: 'typography_usage',
        question: "What type of content will you create most often?",
        placeholder: "We mostly write...",
        followUp: "Long articles, social posts, headlines, technical docs? This influences font choices."
      }
    ]
  }

  const questions = questionSets[visualType]

  const handleResponseSubmit = () => {
    const newResponses = [...responses]
    newResponses[currentQuestion] = currentResponse
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentResponse('')
    } else {
      analyzeResponses(newResponses)
    }
  }

  const analyzeResponses = async (allResponses: string[]) => {
    setAnalyzing(true)
    try {
      const context = {
        brandName,
        strategyContext,
        visualType,
        responses: {
          first: allResponses[0],
          second: allResponses[1],
          third: allResponses[2]
        }
      }

      const analysis = await generateStrategySuggestions('visual', context)
      
      let options = []
      
      if (visualType === 'logo') {
        options = [
          {
            type: 'style',
            title: 'Logo Style',
            options: [
              { id: 'minimal', name: 'Minimal & Clean', description: 'Simple, modern, versatile' },
              { id: 'bold', name: 'Bold & Strong', description: 'Impactful, memorable, confident' },
              { id: 'elegant', name: 'Elegant & Refined', description: 'Sophisticated, premium, timeless' },
              { id: 'playful', name: 'Playful & Creative', description: 'Fun, approachable, unique' }
            ]
          },
          {
            type: 'type',
            title: 'Logo Type',
            options: [
              { id: 'wordmark', name: 'Wordmark', description: 'Text-based, focuses on brand name' },
              { id: 'symbol', name: 'Symbol + Text', description: 'Icon with brand name' },
              { id: 'icon', name: 'Icon Only', description: 'Symbolic representation' },
              { id: 'combination', name: 'Combination Mark', description: 'Flexible symbol and text' }
            ]
          }
        ]
      } else if (visualType === 'colors') {
        options = [
          {
            type: 'palette',
            title: 'Color Palette',
            options: [
              { id: 'professional', name: 'Professional Blue', colors: ['#2563EB', '#1E40AF', '#F59E0B'], description: 'Trustworthy and reliable' },
              { id: 'energetic', name: 'Energetic Orange', colors: ['#EA580C', '#C2410C', '#0EA5E9'], description: 'Dynamic and approachable' },
              { id: 'natural', name: 'Natural Green', colors: ['#059669', '#047857', '#F59E0B'], description: 'Growth and sustainability' },
              { id: 'creative', name: 'Creative Purple', colors: ['#7C3AED', '#5B21B6', '#EC4899'], description: 'Innovative and artistic' }
            ]
          },
          {
            type: 'mood',
            title: 'Color Mood',
            options: [
              { id: 'calm', name: 'Calm & Trustworthy', description: 'Blues and cool tones' },
              { id: 'warm', name: 'Warm & Friendly', description: 'Oranges and warm tones' },
              { id: 'bold', name: 'Bold & Confident', description: 'Strong, contrasting colors' },
              { id: 'subtle', name: 'Subtle & Sophisticated', description: 'Muted, elegant tones' }
            ]
          }
        ]
      } else {
        options = [
          {
            type: 'pairing',
            title: 'Typography Pairing',
            options: [
              { id: 'modern', name: 'Modern Sans', heading: 'Inter', body: 'Inter', description: 'Clean and professional' },
              { id: 'elegant', name: 'Elegant Serif', heading: 'Playfair Display', body: 'Source Sans Pro', description: 'Sophisticated and classic' },
              { id: 'friendly', name: 'Friendly Rounded', heading: 'Nunito', body: 'Nunito', description: 'Approachable and warm' },
              { id: 'bold', name: 'Bold Display', heading: 'Oswald', body: 'Open Sans', description: 'Strong and impactful' }
            ]
          },
          {
            type: 'personality',
            title: 'Typography Personality',
            options: [
              { id: 'professional', name: 'Professional', description: 'Clean, reliable, business-focused' },
              { id: 'creative', name: 'Creative', description: 'Artistic, expressive, unique' },
              { id: 'friendly', name: 'Friendly', description: 'Approachable, warm, conversational' },
              { id: 'authoritative', name: 'Authoritative', description: 'Strong, confident, expert' }
            ]
          }
        ]
      }

      setAiOptions(options)
      setShowOptions(true)
    } catch (error) {
      console.error('Error analyzing responses:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const selectOption = (type: string, option: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    const visualData = {
      type: visualType,
      selections: selectedOptions,
      aiGenerated: true,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(visualData)
  }

  const goBack = () => {
    if (showOptions) {
      setShowOptions(false)
      setCurrentQuestion(questions.length - 1)
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setCurrentResponse(responses[currentQuestion - 1])
    }
  }

  const getIcon = () => {
    switch (visualType) {
      case 'logo': return Image
      case 'colors': return Palette
      case 'typography': return Type
      default: return Eye
    }
  }

  const getColor = () => {
    switch (visualType) {
      case 'logo': return 'purple'
      case 'colors': return 'blue'
      case 'typography': return 'green'
      default: return 'gray'
    }
  }

  const IconComponent = getIcon()
  const color = getColor()

  if (analyzing) {
    return (
      <Card className="p-12 text-center">
        <div className={`inline-flex items-center space-x-3 text-${color}-600 mb-4`}>
          <IconComponent className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your {visualType} preferences...</span>
        </div>
        <p className="text-gray-600">
          Creating personalized {visualType} recommendations based on your responses
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI {visualType} Recommendations</h2>
          <p className="text-gray-600">
            Based on your preferences, here are personalized {visualType} options for {brandName}.
          </p>
        </div>

        <div className="space-y-8">
          {aiOptions.map((section) => (
            <div key={section.type}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {section.options.map((option: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${selectedOptions[section.type]?.id === option.id
                        ? `border-${color}-500 bg-${color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type]?.id === option.id
                          ? `border-${color}-500 bg-${color}-500`
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedOptions[section.type]?.id === option.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        
                        {/* Visual Preview */}
                        {visualType === 'colors' && option.colors && (
                          <div className="flex space-x-1">
                            {option.colors.map((color: string, i: number) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded border border-gray-200"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}
                        
                        {visualType === 'typography' && option.heading && (
                          <div className="space-y-1">
                            <div className="text-sm" style={{ fontFamily: option.heading }}>
                              Heading: {option.heading}
                            </div>
                            <div className="text-xs" style={{ fontFamily: option.body }}>
                              Body: {option.body}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={goBack}>
            Back to Questions
          </Button>
          <Button
            onClick={handleComplete}
            disabled={Object.keys(selectedOptions).length < aiOptions.length}
            className="flex items-center space-x-2"
          >
            <span>Complete {visualType}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-12 h-12 bg-${color}-100 rounded-xl`}>
              <IconComponent className={`w-6 h-6 text-${color}-600`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI {visualType} Discovery</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className={`text-lg font-semibold text-${color}-600`}>
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className={`bg-${color}-600 h-2 rounded-full`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className={`w-6 h-6 text-${color}-600 mt-1`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {questions[currentQuestion].question}
              </h3>
              <p className="text-gray-600 text-sm">
                {questions[currentQuestion].followUp}
              </p>
            </div>
          </div>

          <textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder={questions[currentQuestion].placeholder}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:border-transparent resize-none`}
            rows={4}
            autoFocus
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleResponseSubmit}
            disabled={currentResponse.trim().length < 10}
            className="flex items-center space-x-2"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Analyze with AI' : 'Next Question'}</span>
            {currentQuestion === questions.length - 1 ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}