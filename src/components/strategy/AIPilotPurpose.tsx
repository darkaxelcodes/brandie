import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, MessageSquare, Sparkles, ArrowRight, Check, Lightbulb } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotPurposeProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
}

export const AIPilotPurpose: React.FC<AIPilotPurposeProps> = ({
  brandName,
  onComplete,
  initialData
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
      id: 'business_description',
      question: "Tell me about your business in your own words. What do you do?",
      placeholder: "We help small businesses...",
      followUp: "Don't worry about making it perfect - just describe what you do naturally."
    },
    {
      id: 'why_started',
      question: "Why did you start this business? What problem were you solving?",
      placeholder: "I noticed that...",
      followUp: "Think about the moment you realized this business needed to exist."
    },
    {
      id: 'customer_impact',
      question: "What impact do you want to have on your customers' lives?",
      placeholder: "I want my customers to feel...",
      followUp: "How should customers feel different after working with you?"
    },
    {
      id: 'legacy',
      question: "If your business disappeared tomorrow, what would people miss most?",
      placeholder: "People would miss...",
      followUp: "This helps us understand your unique value in the world."
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
      // All questions answered, analyze with AI
      analyzeResponses(newResponses)
    }
  }

  const analyzeResponses = async (allResponses: string[]) => {
    setAnalyzing(true)
    try {
      const context = {
        brandName,
        responses: {
          businessDescription: allResponses[0],
          whyStarted: allResponses[1],
          customerImpact: allResponses[2],
          legacy: allResponses[3]
        }
      }

      const analysis = await generateStrategySuggestions('purpose', context)

      // Use AI-generated suggestions if available
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        // Parse AI suggestions - expected format: "TYPE: statement"
        const groupedSuggestions: Record<string, string[]> = {
          mission: [],
          vision: [],
          why: []
        }

        analysis.suggestions.forEach(suggestion => {
          const lower = suggestion.toLowerCase()
          if (lower.includes('mission')) {
            groupedSuggestions.mission.push(suggestion.replace(/^mission:\s*/i, '').trim())
          } else if (lower.includes('vision')) {
            groupedSuggestions.vision.push(suggestion.replace(/^vision:\s*/i, '').trim())
          } else if (lower.includes('why') || lower.includes('purpose')) {
            groupedSuggestions.why.push(suggestion.replace(/^(why|purpose):\s*/i, '').trim())
          } else {
            // Default to mission if no type specified
            groupedSuggestions.mission.push(suggestion)
          }
        })

        const options = [
          {
            type: 'mission',
            title: 'Mission Statement',
            options: groupedSuggestions.mission.length > 0
              ? groupedSuggestions.mission
              : [
                  `We exist to ${extractKeyPhrase(allResponses[0], 'help')} by ${extractKeyPhrase(allResponses[1], 'solving')}.`,
                  `Our mission is to ${extractKeyPhrase(allResponses[2], 'impact')} through ${extractKeyPhrase(allResponses[0], 'service')}.`
                ]
          },
          {
            type: 'vision',
            title: 'Vision Statement',
            options: groupedSuggestions.vision.length > 0
              ? groupedSuggestions.vision
              : [
                  `We envision a world where ${extractKeyPhrase(allResponses[2], 'future')}.`,
                  `Our vision is to become ${extractKeyPhrase(allResponses[3], 'position')} in ${extractKeyPhrase(allResponses[0], 'industry')}.`
                ]
          },
          {
            type: 'why',
            title: 'Why Statement',
            options: groupedSuggestions.why.length > 0
              ? groupedSuggestions.why
              : [
                  `We believe that ${extractKeyPhrase(allResponses[1], 'belief')}.`,
                  `Our purpose is driven by the conviction that ${extractKeyPhrase(allResponses[2], 'conviction')}.`
                ]
          }
        ]

        setAiOptions(options)
      } else {
        // Fallback to template-based generation if AI fails
        const options = [
          {
            type: 'mission',
            title: 'Mission Statement',
            options: [
              `We exist to ${extractKeyPhrase(allResponses[0], 'help')} by ${extractKeyPhrase(allResponses[1], 'solving')}.`,
              `Our mission is to ${extractKeyPhrase(allResponses[2], 'impact')} through ${extractKeyPhrase(allResponses[0], 'service')}.`,
              `We are dedicated to ${extractKeyPhrase(allResponses[3], 'value')} for ${extractKeyPhrase(allResponses[0], 'audience')}.`
            ]
          },
          {
            type: 'vision',
            title: 'Vision Statement',
            options: [
              `We envision a world where ${extractKeyPhrase(allResponses[2], 'future')}.`,
              `Our vision is to become ${extractKeyPhrase(allResponses[3], 'position')} in ${extractKeyPhrase(allResponses[0], 'industry')}.`,
              `We see a future where ${extractKeyPhrase(allResponses[1], 'change')} is the norm.`
            ]
          },
          {
            type: 'why',
            title: 'Why Statement',
            options: [
              `We believe that ${extractKeyPhrase(allResponses[1], 'belief')}.`,
              `Our purpose is driven by the conviction that ${extractKeyPhrase(allResponses[2], 'conviction')}.`,
              `We exist because ${extractKeyPhrase(allResponses[3], 'reason')}.`
            ]
          }
        ]
        setAiOptions(options)
      }

      setShowOptions(true)
    } catch (error) {
      console.error('Error analyzing responses:', error)
      // Show toast error to user
    } finally {
      setAnalyzing(false)
    }
  }

  const extractKeyPhrase = (text: string, type: string): string => {
    // Simple extraction logic - in production, this would be more sophisticated
    const words = text.toLowerCase().split(' ')
    const phrases = text.split('.')[0] // First sentence
    return phrases.length > 50 ? phrases.substring(0, 50) + '...' : phrases
  }

  const selectOption = (type: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    const purposeData = {
      mission: selectedOptions.mission || '',
      vision: selectedOptions.vision || '',
      why: selectedOptions.why || '',
      aiGenerated: true,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(purposeData)
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
        <div className="inline-flex items-center space-x-3 text-blue-600 mb-4">
          <Brain className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your responses...</span>
        </div>
        <p className="text-gray-600">
          Creating personalized purpose statements based on your unique story
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Purpose Options</h2>
          <p className="text-gray-600">
            Based on your responses, here are personalized options for your brand purpose. 
            Select the ones that resonate most with you.
          </p>
        </div>

        <div className="space-y-8">
          {aiOptions.map((section) => (
            <div key={section.type}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.options.map((option: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${selectedOptions[section.type] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type] === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedOptions[section.type] === option && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <p className="text-gray-700 flex-1">{option}</p>
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
            <span>Complete Purpose</span>
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
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Purpose Discovery</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-semibold text-blue-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600 mt-1" />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            autoFocus
          />
        </div>

        {/* AI Tip */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI Tip</h4>
              <p className="text-sm text-blue-800">
                Write naturally and don't worry about perfect wording. AI will help structure 
                your thoughts into professional purpose statements.
              </p>
            </div>
          </div>
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