import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, MessageSquare, Sparkles, ArrowRight, Check, Zap, Target } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotVoiceProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
  strategyContext?: any
}

export const AIPilotVoice: React.FC<AIPilotVoiceProps> = ({
  brandName,
  onComplete,
  initialData,
  strategyContext
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(['', '', '', ''])
  const [currentResponse, setCurrentResponse] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [aiOptions, setAiOptions] = useState<any[]>([])
  const [selectedOptions, setSelectedOptions] = useState<any>({})
  const [showOptions, setShowOptions] = useState(false)

  const questions = [
    {
      id: 'communication_style',
      question: "How do you naturally communicate with your customers?",
      placeholder: "When I talk to customers, I'm usually...",
      followUp: "Think about your natural style - formal, casual, friendly, professional, enthusiastic?"
    },
    {
      id: 'brand_personality',
      question: "If your brand was having a conversation, what would their personality be like?",
      placeholder: "In conversations, my brand would be...",
      followUp: "Imagine your brand at a networking event - how would they introduce themselves and interact?"
    },
    {
      id: 'customer_relationship',
      question: "What kind of relationship do you want with your customers?",
      placeholder: "I want customers to see us as their...",
      followUp: "Trusted advisor, helpful friend, expert guide, reliable partner, or something else?"
    },
    {
      id: 'key_messages',
      question: "What's the most important thing you want customers to remember about you?",
      placeholder: "Above all, I want customers to remember that we...",
      followUp: "This becomes your core message that should come through in everything you say."
    }
  ]

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
        responses: {
          communicationStyle: allResponses[0],
          brandPersonality: allResponses[1],
          customerRelationship: allResponses[2],
          keyMessages: allResponses[3]
        }
      }

      const analysis = await generateStrategySuggestions('voice', context)
      
      const options = [
        {
          type: 'toneScales',
          title: 'Tone of Voice',
          options: [
            {
              id: 'professional',
              name: 'Professional & Trustworthy',
              scales: { formalCasual: 30, logicalEmotional: 25, playfulSerious: 20, traditionalInnovative: 40 },
              description: 'Formal, logical, serious, balanced innovation'
            },
            {
              id: 'friendly',
              name: 'Friendly & Approachable',
              scales: { formalCasual: 70, logicalEmotional: 60, playfulSerious: 65, traditionalInnovative: 60 },
              description: 'Casual, emotional, playful, innovative'
            },
            {
              id: 'expert',
              name: 'Expert & Authoritative',
              scales: { formalCasual: 25, logicalEmotional: 20, playfulSerious: 15, traditionalInnovative: 75 },
              description: 'Formal, logical, serious, highly innovative'
            },
            {
              id: 'balanced',
              name: 'Balanced & Versatile',
              scales: { formalCasual: 50, logicalEmotional: 50, playfulSerious: 50, traditionalInnovative: 50 },
              description: 'Balanced across all dimensions'
            }
          ]
        },
        {
          type: 'messaging',
          title: 'Key Messaging',
          options: [
            {
              id: 'tagline1',
              tagline: extractTagline(allResponses[3], 'benefit'),
              elevatorPitch: extractElevatorPitch(allResponses[0], allResponses[3]),
              keyMessages: extractKeyMessages(allResponses[3])
            },
            {
              id: 'tagline2',
              tagline: extractTagline(allResponses[3], 'value'),
              elevatorPitch: extractElevatorPitch(allResponses[1], allResponses[3]),
              keyMessages: extractKeyMessages(allResponses[2])
            },
            {
              id: 'tagline3',
              tagline: extractTagline(allResponses[3], 'promise'),
              elevatorPitch: extractElevatorPitch(allResponses[2], allResponses[3]),
              keyMessages: extractKeyMessages(allResponses[1])
            }
          ]
        },
        {
          type: 'guidelines',
          title: 'Voice Guidelines',
          options: [
            {
              id: 'guidelines1',
              dosList: extractDos(allResponses[0], allResponses[1]),
              dontsList: extractDonts(allResponses[0], allResponses[1]),
              description: 'Based on your communication style'
            },
            {
              id: 'guidelines2',
              dosList: extractDos(allResponses[1], allResponses[2]),
              dontsList: extractDonts(allResponses[1], allResponses[2]),
              description: 'Based on your brand personality'
            }
          ]
        }
      ]

      setAiOptions(options)
      setShowOptions(true)
    } catch (error) {
      console.error('Error analyzing responses:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  // Helper functions for extracting voice elements
  const extractTagline = (text: string, type: string): string => {
    const templates = {
      benefit: `${brandName} - ${text.split('.')[0]?.substring(0, 30)}`,
      value: `${text.split('.')[0]?.substring(0, 40)}`,
      promise: `Your ${text.split('.')[0]?.substring(0, 35)} partner`
    }
    return templates[type as keyof typeof templates] || `${brandName} - Excellence delivered`
  }

  const extractElevatorPitch = (style: string, message: string): string => {
    return `We help ${extractAudience(style)} by ${extractMethod(message)} so they can ${extractOutcome(message)}.`
  }

  const extractKeyMessages = (text: string): string[] => {
    const messages = text.split(/[.,;]/).filter(s => s.trim().length > 10).slice(0, 3)
    const defaultMessages = [
      'Quality is our top priority',
      'Customer success drives everything we do',
      'Innovation meets reliability'
    ]
    return [...messages, ...defaultMessages].slice(0, 4)
  }

  const extractDos = (style: string, personality: string): string[] => {
    const styleWords = style.toLowerCase()
    const personalityWords = personality.toLowerCase()
    
    const dos = []
    if (styleWords.includes('friendly') || styleWords.includes('casual')) {
      dos.push('Use conversational language')
      dos.push('Be approachable and warm')
    }
    if (styleWords.includes('professional') || styleWords.includes('formal')) {
      dos.push('Maintain professional tone')
      dos.push('Use clear, precise language')
    }
    if (personalityWords.includes('helpful') || personalityWords.includes('support')) {
      dos.push('Focus on helping customers')
      dos.push('Provide clear guidance')
    }
    
    return [...dos, 'Stay consistent with brand values', 'Be authentic and genuine'].slice(0, 4)
  }

  const extractDonts = (style: string, personality: string): string[] => {
    const styleWords = style.toLowerCase()
    const personalityWords = personality.toLowerCase()
    
    const donts = []
    if (styleWords.includes('friendly') || styleWords.includes('casual')) {
      donts.push("Don't be overly formal")
      donts.push("Don't use jargon without explanation")
    }
    if (styleWords.includes('professional') || styleWords.includes('formal')) {
      donts.push("Don't be too casual")
      donts.push("Don't use slang or colloquialisms")
    }
    
    return [...donts, "Don't make promises you can't keep", "Don't ignore customer concerns"].slice(0, 4)
  }

  const extractAudience = (text: string): string => {
    return 'businesses and individuals'
  }

  const extractMethod = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) || 'providing excellent service'
  }

  const extractOutcome = (text: string): string => {
    return 'achieve their goals'
  }

  const selectOption = (type: string, option: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    const voiceData = {
      tone_scales: selectedOptions.toneScales?.scales || {
        formalCasual: 50,
        logicalEmotional: 50,
        playfulSerious: 50,
        traditionalInnovative: 50
      },
      messaging: {
        tagline: selectedOptions.messaging?.tagline || '',
        elevatorPitch: selectedOptions.messaging?.elevatorPitch || '',
        keyMessages: selectedOptions.messaging?.keyMessages || []
      },
      guidelines: {
        dosList: selectedOptions.guidelines?.dosList || [],
        dontsList: selectedOptions.guidelines?.dontsList || [],
        exampleContent: ''
      },
      aiGenerated: true,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(voiceData)
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

  if (analyzing) {
    return (
      <Card className="p-12 text-center">
        <div className="inline-flex items-center space-x-3 text-green-600 mb-4">
          <MessageSquare className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your brand voice...</span>
        </div>
        <p className="text-gray-600">
          Creating personalized voice guidelines based on your communication style
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Voice Recommendations</h2>
          <p className="text-gray-600">
            Based on your communication style, here are personalized voice options for {brandName}.
          </p>
        </div>

        <div className="space-y-8">
          {aiOptions.map((section) => (
            <div key={section.type}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.options.map((option: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${selectedOptions[section.type]?.id === option.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type]?.id === option.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedOptions[section.type]?.id === option.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        {section.type === 'toneScales' && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Formal ←→ Casual: {option.scales.formalCasual}%</div>
                              <div>Logical ←→ Emotional: {option.scales.logicalEmotional}%</div>
                              <div>Serious ←→ Playful: {option.scales.playfulSerious}%</div>
                              <div>Traditional ←→ Innovative: {option.scales.traditionalInnovative}%</div>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'messaging' && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Messaging Option {index + 1}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Tagline:</span>
                                <p className="text-gray-600">{option.tagline}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Elevator Pitch:</span>
                                <p className="text-gray-600">{option.elevatorPitch}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Key Messages:</span>
                                <ul className="text-gray-600 ml-4">
                                  {option.keyMessages.slice(0, 2).map((msg: string, i: number) => (
                                    <li key={i}>• {msg}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'guidelines' && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Guidelines Set {index + 1}</h4>
                            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-green-700">Do's:</span>
                                <ul className="text-green-600 mt-1">
                                  {option.dosList.slice(0, 2).map((item: string, i: number) => (
                                    <li key={i}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <span className="font-medium text-red-700">Don'ts:</span>
                                <ul className="text-red-600 mt-1">
                                  {option.dontsList.slice(0, 2).map((item: string, i: number) => (
                                    <li key={i}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
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
            disabled={Object.keys(selectedOptions).length < 3}
            className="flex items-center space-x-2"
          >
            <span>Complete Voice</span>
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
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Voice Discovery</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-semibold text-green-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-green-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-green-600 mt-1" />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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