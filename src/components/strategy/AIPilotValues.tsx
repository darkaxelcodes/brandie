import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Heart, Sparkles, ArrowRight, Check, MessageSquare } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotValuesProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
  purposeData?: any
}

export const AIPilotValues: React.FC<AIPilotValuesProps> = ({
  brandName,
  onComplete,
  initialData,
  purposeData
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(['', '', ''])
  const [currentResponse, setCurrentResponse] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [aiOptions, setAiOptions] = useState<any[]>([])
  const [selectedOptions, setSelectedOptions] = useState<any>({})
  const [showOptions, setShowOptions] = useState(false)

  const questions = [
    {
      id: 'core_beliefs',
      question: "What principles or beliefs are most important to you in business?",
      placeholder: "I believe in honesty, innovation, customer-first approach...",
      followUp: "Think about what you would never compromise on, even under pressure."
    },
    {
      id: 'differentiation',
      question: "What makes your approach different from others in your industry?",
      placeholder: "Unlike others, we focus on...",
      followUp: "What do you do that competitors don't? What's your unique angle?"
    },
    {
      id: 'customer_promise',
      question: "What promise do you make to every customer that works with you?",
      placeholder: "Every customer can expect...",
      followUp: "This becomes your value proposition - what can customers always count on?"
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
        purposeData,
        responses: {
          coreBeliefs: allResponses[0],
          differentiation: allResponses[1],
          customerPromise: allResponses[2]
        }
      }

      const analysis = await generateStrategySuggestions('values', context)
      
      // Extract values from responses
      const extractedValues = extractValuesFromText(allResponses.join(' '))
      
      const options = [
        {
          type: 'coreValues',
          title: 'Core Values',
          options: [
            extractedValues.slice(0, 5),
            extractedValues.slice(2, 7),
            extractedValues.slice(1, 6)
          ]
        },
        {
          type: 'positioning',
          title: 'Positioning Statement',
          options: [
            `For customers who value ${extractKeyPhrase(allResponses[0])}, ${brandName} is the ${extractKeyPhrase(allResponses[1])} that ${extractKeyPhrase(allResponses[2])}.`,
            `${brandName} helps ${extractKeyPhrase(allResponses[2])} by ${extractKeyPhrase(allResponses[1])} because we believe ${extractKeyPhrase(allResponses[0])}.`,
            `Unlike others, ${brandName} ${extractKeyPhrase(allResponses[1])} to ensure ${extractKeyPhrase(allResponses[2])}.`
          ]
        },
        {
          type: 'uniqueValue',
          title: 'Unique Value Proposition',
          options: [
            `Our unique approach to ${extractKeyPhrase(allResponses[1])} ensures ${extractKeyPhrase(allResponses[2])}.`,
            `We're the only ones who ${extractKeyPhrase(allResponses[1])} while maintaining ${extractKeyPhrase(allResponses[0])}.`,
            `${brandName} delivers ${extractKeyPhrase(allResponses[2])} through our commitment to ${extractKeyPhrase(allResponses[0])}.`
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

  const extractValuesFromText = (text: string): string[] => {
    // Simple value extraction - in production, this would use NLP
    const valueKeywords = [
      'honesty', 'integrity', 'innovation', 'quality', 'excellence', 'trust',
      'transparency', 'reliability', 'creativity', 'collaboration', 'respect',
      'sustainability', 'growth', 'customer-first', 'authenticity', 'passion'
    ]
    
    const foundValues = valueKeywords.filter(value => 
      text.toLowerCase().includes(value)
    )
    
    // Add some common values if not enough found
    const defaultValues = ['Excellence', 'Innovation', 'Integrity', 'Customer Focus', 'Quality']
    
    return [...foundValues.map(v => v.charAt(0).toUpperCase() + v.slice(1)), ...defaultValues]
      .slice(0, 7)
  }

  const extractKeyPhrase = (text: string): string => {
    const sentences = text.split('.').filter(s => s.trim().length > 0)
    const firstSentence = sentences[0] || text
    return firstSentence.length > 40 ? firstSentence.substring(0, 40) + '...' : firstSentence
  }

  const selectOption = (type: string, option: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    const valuesData = {
      coreValues: selectedOptions.coreValues || [],
      positioning: selectedOptions.positioning || '',
      uniqueValue: selectedOptions.uniqueValue || '',
      aiGenerated: true,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(valuesData)
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
        <div className="inline-flex items-center space-x-3 text-red-600 mb-4">
          <Heart className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is extracting your core values...</span>
        </div>
        <p className="text-gray-600">
          Analyzing your beliefs and principles to create authentic brand values
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Values & Positioning</h2>
          <p className="text-gray-600">
            Based on your responses, here are your extracted values and positioning options.
          </p>
        </div>

        <div className="space-y-8">
          {aiOptions.map((section) => (
            <div key={section.type}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.options.map((option: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${selectedOptions[section.type] === option
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type] === option
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedOptions[section.type] === option && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        {Array.isArray(option) ? (
                          <div className="flex flex-wrap gap-2">
                            {option.map((value: string, i: number) => (
                              <span key={i} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                {value}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-700">{option}</p>
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
            <span>Complete Values</span>
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
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Values Discovery</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-semibold text-red-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-red-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-red-600 mt-1" />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
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