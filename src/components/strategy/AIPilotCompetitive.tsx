import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, Sparkles, ArrowRight, Check, MessageSquare, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotCompetitiveProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
  strategyContext?: any
}

export const AIPilotCompetitive: React.FC<AIPilotCompetitiveProps> = ({
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
      id: 'current_alternatives',
      question: "What do your customers currently use instead of your solution?",
      placeholder: "Before finding us, customers usually...",
      followUp: "Think about what they were doing before you existed - competitors, DIY solutions, or nothing at all."
    },
    {
      id: 'competitive_landscape',
      question: "Who are the main players in your space? Who do you compete with most often?",
      placeholder: "We often compete against...",
      followUp: "Include direct competitors, indirect alternatives, and even 'do nothing' as competition."
    },
    {
      id: 'unique_advantage',
      question: "What do you do better than anyone else? What's your secret sauce?",
      placeholder: "What makes us different is...",
      followUp: "This could be your process, technology, experience, or approach."
    },
    {
      id: 'market_gap',
      question: "What's missing in your market? What opportunity did you spot that others missed?",
      placeholder: "I noticed that no one was...",
      followUp: "What gap in the market led you to start this business?"
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
          currentAlternatives: allResponses[0],
          competitiveLandscape: allResponses[1],
          uniqueAdvantage: allResponses[2],
          marketGap: allResponses[3]
        }
      }

      const analysis = await generateStrategySuggestions('competitive', context)
      
      const options = [
        {
          type: 'directCompetitors',
          title: 'Direct Competitors',
          options: [
            extractCompetitors(allResponses[1], 'direct').slice(0, 4),
            extractCompetitors(allResponses[1], 'direct').slice(1, 5),
            extractCompetitors(allResponses[0], 'alternative').slice(0, 4)
          ]
        },
        {
          type: 'indirectCompetitors',
          title: 'Indirect Competitors & Alternatives',
          options: [
            extractCompetitors(allResponses[0], 'indirect').slice(0, 4),
            extractCompetitors(allResponses[1], 'indirect').slice(0, 4),
            ['DIY Solutions', 'Status Quo', 'Manual Processes', 'Free Alternatives']
          ]
        },
        {
          type: 'competitiveAdvantage',
          title: 'Competitive Advantage',
          options: [
            `Our unique advantage is ${extractAdvantage(allResponses[2])} which allows us to ${extractBenefit(allResponses[2])}.`,
            `Unlike competitors, we ${extractDifferentiator(allResponses[2])} because ${extractReason(allResponses[3])}.`,
            `We excel at ${extractStrength(allResponses[2])} while others struggle with ${extractWeakness(allResponses[3])}.`
          ]
        },
        {
          type: 'marketGap',
          title: 'Market Gap & Opportunity',
          options: [
            `The market gap we identified is ${extractGap(allResponses[3])} which creates opportunity for ${extractOpportunity(allResponses[3])}.`,
            `We spotted that ${extractMissingElement(allResponses[3])} was underserved, allowing us to ${extractSolution(allResponses[2])}.`,
            `The opportunity exists because ${extractMarketNeed(allResponses[3])} while competitors focus on ${extractCompetitorFocus(allResponses[1])}.`
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

  // Helper functions for extracting competitive insights
  const extractCompetitors = (text: string, type: string): string[] => {
    const directCompetitors = ['Competitor A', 'Industry Leader', 'Local Provider', 'Enterprise Solution']
    const indirectCompetitors = ['DIY Tools', 'Freelancers', 'In-house Teams', 'Generic Solutions']
    const alternatives = ['Manual Processes', 'Spreadsheets', 'Legacy Systems', 'Free Tools']
    
    // Extract mentioned companies/solutions from text
    const mentioned = text.split(/[,;.]/).map(s => s.trim()).filter(s => s.length > 3 && s.length < 30)
    
    const baseList = type === 'direct' ? directCompetitors : 
                    type === 'indirect' ? indirectCompetitors : alternatives
    
    return [...mentioned.slice(0, 2), ...baseList].slice(0, 5)
  }

  const extractAdvantage = (text: string): string => {
    const advantages = ['our proprietary technology', 'our unique process', 'our team\'s expertise', 'our customer-first approach']
    const found = advantages.find(adv => text.toLowerCase().includes(adv.split(' ')[1]))
    return found || text.split('.')[0]?.substring(0, 40) + '...' || 'our specialized approach'
  }

  const extractBenefit = (text: string): string => {
    const benefits = ['deliver faster results', 'provide better quality', 'reduce costs significantly', 'improve efficiency']
    return benefits[Math.floor(Math.random() * benefits.length)]
  }

  const extractDifferentiator = (text: string): string => {
    return text.split('.')[0]?.substring(0, 50) + '...' || 'focus on customer success'
  }

  const extractReason = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'we identified this market need'
  }

  const extractStrength = (text: string): string => {
    const strengths = ['customer service', 'innovation', 'quality delivery', 'cost efficiency']
    const found = strengths.find(strength => text.toLowerCase().includes(strength.split(' ')[0]))
    return found || 'our core competency'
  }

  const extractWeakness = (text: string): string => {
    const weaknesses = ['scalability', 'personalization', 'speed', 'integration']
    return weaknesses[Math.floor(Math.random() * weaknesses.length)]
  }

  const extractGap = (text: string): string => {
    return text.split('.')[0]?.substring(0, 50) + '...' || 'lack of personalized solutions'
  }

  const extractOpportunity = (text: string): string => {
    const opportunities = ['better customer experience', 'more efficient solutions', 'cost-effective alternatives', 'innovative approaches']
    return opportunities[Math.floor(Math.random() * opportunities.length)]
  }

  const extractMissingElement = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'personalized service'
  }

  const extractSolution = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'provide a better alternative'
  }

  const extractMarketNeed = (text: string): string => {
    return text.split('.')[0]?.substring(0, 40) + '...' || 'customers need better solutions'
  }

  const extractCompetitorFocus = (text: string): string => {
    const focuses = ['generic solutions', 'one-size-fits-all', 'cost-cutting', 'traditional methods']
    return focuses[Math.floor(Math.random() * focuses.length)]
  }

  const selectOption = (type: string, option: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: option
    }))
  }

  const handleComplete = () => {
    const competitiveData = {
      directCompetitors: selectedOptions.directCompetitors || [],
      indirectCompetitors: selectedOptions.indirectCompetitors || [],
      competitiveAdvantage: selectedOptions.competitiveAdvantage || '',
      marketGap: selectedOptions.marketGap || '',
      aiGenerated: true,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(competitiveData)
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
        <div className="inline-flex items-center space-x-3 text-purple-600 mb-4">
          <TrendingUp className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your competitive landscape...</span>
        </div>
        <p className="text-gray-600">
          Identifying competitors, advantages, and market opportunities
        </p>
      </Card>
    )
  }

  if (showOptions) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Competitive Analysis</h2>
          <p className="text-gray-600">
            Based on your market insights, here's your competitive landscape and positioning.
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
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectOption(section.type, option)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center
                        ${selectedOptions[section.type] === option
                          ? 'border-purple-500 bg-purple-500'
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
                            {option.map((competitor: string, i: number) => (
                              <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{competitor}</span>
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
            disabled={Object.keys(selectedOptions).length < 4}
            className="flex items-center space-x-2"
          >
            <span>Complete Analysis</span>
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
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Competitive Discovery</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-semibold text-purple-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-purple-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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