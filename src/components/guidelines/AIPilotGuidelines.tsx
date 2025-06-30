import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, FileText, Sparkles, ArrowRight, Check, MessageSquare, Target } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotGuidelinesProps {
  brandName: string
  onComplete: (data: any) => void
  brandData: any
}

export const AIPilotGuidelines: React.FC<AIPilotGuidelinesProps> = ({
  brandName,
  onComplete,
  brandData
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
      id: 'guidelines_purpose',
      question: "How will these brand guidelines be used? Who is the primary audience?",
      placeholder: "These guidelines will be used for...",
      followUp: "Internal team, external partners, investors? This helps tailor the content."
    },
    {
      id: 'guidelines_focus',
      question: "Which aspects of your brand are most important to standardize?",
      placeholder: "The most critical elements are...",
      followUp: "Visual elements, messaging, both? Where do you need the most consistency?"
    },
    {
      id: 'guidelines_format',
      question: "How do you envision sharing these guidelines? What format works best?",
      placeholder: "We'll primarily share these as...",
      followUp: "PDF document, web page, presentation slides? This affects the output format."
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
        brandData,
        responses: {
          guidelinesPurpose: allResponses[0],
          guidelinesFocus: allResponses[1],
          guidelinesFormat: allResponses[2]
        }
      }

      const analysis = await generateStrategySuggestions('guidelines', context)
      
      const options = [
        {
          type: 'format',
          title: 'Guidelines Format',
          options: [
            {
              id: 'comprehensive',
              name: 'Comprehensive Brand Book',
              description: 'Complete documentation of all brand elements',
              pages: '25-30 pages',
              audience: 'Marketing teams, agencies, designers'
            },
            {
              id: 'essentials',
              name: 'Brand Essentials',
              description: 'Core elements and quick reference guide',
              pages: '10-15 pages',
              audience: 'General staff, partners, vendors'
            },
            {
              id: 'digital',
              name: 'Digital-First Guidelines',
              description: 'Web-optimized interactive guidelines',
              pages: 'Web-based',
              audience: 'Digital teams, developers, online partners'
            }
          ]
        },
        {
          type: 'sections',
          title: 'Included Sections',
          options: [
            {
              id: 'standard',
              name: 'Standard Sections',
              sections: ['Brand Overview', 'Visual Identity', 'Brand Voice', 'Usage Guidelines'],
              description: 'Essential sections for most brands'
            },
            {
              id: 'expanded',
              name: 'Expanded Sections',
              sections: ['Brand Overview', 'Visual Identity', 'Brand Voice', 'Usage Guidelines', 'Digital Applications', 'Print Applications', 'Social Media'],
              description: 'Comprehensive coverage for all touchpoints'
            },
            {
              id: 'focused',
              name: 'Focus on ' + (allResponses[1].toLowerCase().includes('visual') ? 'Visual Identity' : 'Brand Voice'),
              sections: allResponses[1].toLowerCase().includes('visual') 
                ? ['Brand Overview', 'Visual Identity (Extended)', 'Usage Guidelines', 'Applications'] 
                : ['Brand Overview', 'Brand Voice (Extended)', 'Messaging Framework', 'Content Guidelines'],
              description: 'Tailored to your specific needs'
            }
          ]
        },
        {
          type: 'style',
          title: 'Design Style',
          options: [
            {
              id: 'professional',
              name: 'Professional & Corporate',
              description: 'Clean, structured, and business-focused',
              style: 'Minimal, organized, clear hierarchy'
            },
            {
              id: 'creative',
              name: 'Creative & Expressive',
              description: 'Visually rich with creative layouts',
              style: 'Dynamic, colorful, unique presentation'
            },
            {
              id: 'balanced',
              name: 'Balanced & Versatile',
              description: 'Professional with creative elements',
              style: 'Clean with visual interest, flexible'
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

  const selectOption = (type: string, option: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    // In a real implementation, this would generate guidelines based on selections
    onComplete({
      format: selectedOptions.format,
      sections: selectedOptions.sections,
      style: selectedOptions.style,
      responses
    })
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
          <FileText className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your brand...</span>
        </div>
        <p className="text-gray-600">
          Creating personalized guidelines recommendations based on your brand elements
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Guidelines Recommendations</h2>
          <p className="text-gray-600">
            Based on your responses, here are personalized guidelines options for {brandName}.
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
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type]?.id === option.id
                          ? 'border-blue-500 bg-blue-500'
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
                        
                        {section.type === 'format' && (
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>Length: {option.pages}</div>
                            <div>Audience: {option.audience}</div>
                          </div>
                        )}
                        
                        {section.type === 'sections' && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {option.sections.map((section: string, i: number) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {section}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {section.type === 'style' && (
                          <div className="text-xs text-gray-500">
                            Style: {option.style}
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
            <span>Generate Guidelines</span>
            <Sparkles className="w-4 h-4" />
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
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Guidelines Discovery</h2>
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