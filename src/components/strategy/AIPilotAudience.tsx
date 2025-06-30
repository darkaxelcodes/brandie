import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Users, Sparkles, ArrowRight, Check, MessageSquare, Target } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotAudienceProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
  strategyContext?: any
}

export const AIPilotAudience: React.FC<AIPilotAudienceProps> = ({
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
      id: 'ideal_customer',
      question: "Describe your ideal customer. Who do you love working with most?",
      placeholder: "My best customers are usually...",
      followUp: "Think about your favorite clients - what do they have in common?"
    },
    {
      id: 'customer_problems',
      question: "What problems keep your customers awake at night?",
      placeholder: "My customers struggle with...",
      followUp: "What challenges do they face before they find you?"
    },
    {
      id: 'customer_goals',
      question: "What are your customers trying to achieve? What does success look like for them?",
      placeholder: "They want to...",
      followUp: "What would make them feel like they've 'made it'?"
    },
    {
      id: 'decision_factors',
      question: "When your customers choose a solution, what matters most to them?",
      placeholder: "They care about price, quality, speed...",
      followUp: "What factors influence their buying decisions?"
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
          idealCustomer: allResponses[0],
          customerProblems: allResponses[1],
          customerGoals: allResponses[2],
          decisionFactors: allResponses[3]
        }
      }

      const analysis = await generateStrategySuggestions('audience', context)
      
      const options = [
        {
          type: 'primaryAudience',
          title: 'Primary Audience',
          options: [
            `${extractDemographics(allResponses[0])} who ${extractBehavior(allResponses[1])} and value ${extractValues(allResponses[3])}.`,
            `Professionals in ${extractIndustry(allResponses[0])} who struggle with ${extractMainProblem(allResponses[1])} and prioritize ${extractPriority(allResponses[3])}.`,
            `${extractCustomerType(allResponses[0])} seeking ${extractDesiredOutcome(allResponses[2])} while dealing with ${extractChallenge(allResponses[1])}.`
          ]
        },
        {
          type: 'demographics',
          title: 'Demographics',
          options: [
            extractDetailedDemographics(allResponses[0], 'professional'),
            extractDetailedDemographics(allResponses[0], 'business'),
            extractDetailedDemographics(allResponses[0], 'personal')
          ]
        },
        {
          type: 'psychographics',
          title: 'Psychographics & Behavior',
          options: [
            `Values ${extractValues(allResponses[3])}, motivated by ${extractMotivation(allResponses[2])}, frustrated by ${extractFrustration(allResponses[1])}.`,
            `Seeks ${extractDesiredOutcome(allResponses[2])}, prioritizes ${extractPriority(allResponses[3])}, challenges include ${extractChallenge(allResponses[1])}.`,
            `Goal-oriented individuals who ${extractBehavior(allResponses[2])}, value ${extractValues(allResponses[3])}, and need help with ${extractNeed(allResponses[1])}.`
          ]
        },
        {
          type: 'painPoints',
          title: 'Pain Points',
          options: [
            extractPainPoints(allResponses[1]).slice(0, 4),
            extractPainPoints(allResponses[1]).slice(1, 5),
            extractPainPoints(allResponses[1]).slice(2, 6)
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

  // Helper functions for extracting insights
  const extractDemographics = (text: string): string => {
    const ageTerms = ['young', 'millennial', 'gen z', 'baby boomer', 'middle-aged', 'senior']
    const professionTerms = ['entrepreneur', 'manager', 'executive', 'professional', 'business owner']
    
    const foundAge = ageTerms.find(term => text.toLowerCase().includes(term))
    const foundProf = professionTerms.find(term => text.toLowerCase().includes(term))
    
    return `${foundAge || 'Professional'} ${foundProf || 'individuals'}`
  }

  const extractBehavior = (text: string): string => {
    const behaviors = ['struggle with', 'need help with', 'are looking for', 'want to improve', 'are frustrated by']
    const found = behaviors.find(behavior => text.toLowerCase().includes(behavior.split(' ')[0]))
    return found ? text.split(found)[1]?.split('.')[0] || 'efficiency' : 'growth and improvement'
  }

  const extractValues = (text: string): string => {
    const values = ['quality', 'speed', 'price', 'reliability', 'innovation', 'service', 'trust']
    const found = values.filter(value => text.toLowerCase().includes(value))
    return found.length > 0 ? found.join(', ') : 'quality and reliability'
  }

  const extractPainPoints = (text: string): string[] => {
    const commonPains = [
      'Lack of time to focus on core business',
      'Difficulty finding reliable solutions',
      'Budget constraints and cost concerns',
      'Complexity of current processes',
      'Need for better efficiency',
      'Struggle with technology adoption',
      'Communication and coordination issues',
      'Scaling challenges'
    ]
    
    // Extract from text and combine with common pains
    const textPains = text.split(/[.,;]/).map(s => s.trim()).filter(s => s.length > 10)
    return [...textPains.slice(0, 3), ...commonPains].slice(0, 6)
  }

  const extractDetailedDemographics = (text: string, focus: string): string => {
    const templates = {
      professional: 'Age: 28-45, Income: $50k-$150k, Education: College+, Location: Urban/Suburban',
      business: 'Business size: 10-500 employees, Industry: Service/Tech, Revenue: $1M-$50M',
      personal: 'Lifestyle: Busy professionals, Family: Young families/Singles, Tech: Early adopters'
    }
    return templates[focus as keyof typeof templates]
  }

  const extractIndustry = (text: string): string => {
    const industries = ['technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'consulting']
    const found = industries.find(industry => text.toLowerCase().includes(industry))
    return found || 'various industries'
  }

  const extractMainProblem = (text: string): string => {
    return text.split('.')[0]?.substring(0, 50) + '...' || 'operational challenges'
  }

  const extractPriority = (text: string): string => {
    const priorities = ['cost-effectiveness', 'quality', 'speed', 'reliability', 'innovation']
    const found = priorities.find(priority => text.toLowerCase().includes(priority.split('-')[0]))
    return found || 'value for money'
  }

  const extractCustomerType = (text: string): string => {
    const types = ['Small business owners', 'Entrepreneurs', 'Professionals', 'Teams', 'Organizations']
    return types[Math.floor(Math.random() * types.length)]
  }

  const extractDesiredOutcome = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'better results'
  }

  const extractChallenge = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'current limitations'
  }

  const extractMotivation = (text: string): string => {
    const motivations = ['success', 'growth', 'efficiency', 'innovation', 'recognition']
    const found = motivations.find(motivation => text.toLowerCase().includes(motivation))
    return found || 'achieving their goals'
  }

  const extractFrustration = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'current inefficiencies'
  }

  const extractNeed = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'better solutions'
  }

  const selectOption = (type: string, option: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    const audienceData = {
      primaryAudience: selectedOptions.primaryAudience || '',
      demographics: selectedOptions.demographics || '',
      psychographics: selectedOptions.psychographics || '',
      painPoints: selectedOptions.painPoints || [],
      aiGenerated: true,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(audienceData)
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
          <Users className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your audience...</span>
        </div>
        <p className="text-gray-600">
          Creating detailed audience profiles based on your customer insights
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Audience Profile</h2>
          <p className="text-gray-600">
            Based on your customer insights, here are detailed audience profiles and characteristics.
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
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type] === option
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedOptions[section.type] === option && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        {Array.isArray(option) ? (
                          <div className="space-y-1">
                            {option.map((pain: string, i: number) => (
                              <div key={i} className="text-sm text-gray-700 flex items-center space-x-2">
                                <Target className="w-3 h-3 text-red-500" />
                                <span>{pain}</span>
                              </div>
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
            disabled={Object.keys(selectedOptions).length < 4}
            className="flex items-center space-x-2"
          >
            <span>Complete Audience</span>
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
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Audience Discovery</h2>
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