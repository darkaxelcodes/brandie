import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Crown, Sparkles, ArrowRight, Check, MessageSquare, Star } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { brandArchetypes } from '../../data/archetypes'
import { generateStrategySuggestions } from '../../lib/openai'

interface AIPilotArchetypeProps {
  brandName: string
  onComplete: (data: any) => void
  initialData?: any
  strategyContext?: any
}

export const AIPilotArchetype: React.FC<AIPilotArchetypeProps> = ({
  brandName,
  onComplete,
  initialData,
  strategyContext
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>(['', '', ''])
  const [currentResponse, setCurrentResponse] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])
  const [selectedArchetype, setSelectedArchetype] = useState<string>('')
  const [reasoning, setReasoning] = useState<string>('')
  const [showRecommendations, setShowRecommendations] = useState(false)

  const questions = [
    {
      id: 'brand_personality',
      question: "If your brand was a person, how would you describe their personality?",
      placeholder: "My brand would be someone who is...",
      followUp: "Think about traits, characteristics, and how they'd behave in different situations."
    },
    {
      id: 'customer_relationship',
      question: "What kind of relationship do you want with your customers?",
      placeholder: "I want customers to see us as...",
      followUp: "Are you a trusted advisor, a fun friend, an expert guide, or something else?"
    },
    {
      id: 'brand_motivation',
      question: "What drives your brand? What's your deeper motivation beyond making money?",
      placeholder: "What really motivates us is...",
      followUp: "This reveals your brand's core drive and purpose in the world."
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
          brandPersonality: allResponses[0],
          customerRelationship: allResponses[1],
          brandMotivation: allResponses[2]
        }
      }

      const analysis = await generateStrategySuggestions('archetype', context)
      
      // Analyze responses to recommend archetypes
      const recommendations = analyzeForArchetypes(allResponses)
      setAiRecommendations(recommendations)
      setShowRecommendations(true)
    } catch (error) {
      console.error('Error analyzing responses:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const analyzeForArchetypes = (responses: string[]): any[] => {
    const personalityText = responses[0].toLowerCase()
    const relationshipText = responses[1].toLowerCase()
    const motivationText = responses[2].toLowerCase()
    const allText = responses.join(' ').toLowerCase()

    const archetypeScores = brandArchetypes.map(archetype => {
      let score = 0
      let reasoning = []

      // Score based on personality traits
      archetype.traits.forEach(trait => {
        if (personalityText.includes(trait.toLowerCase())) {
          score += 3
          reasoning.push(`Personality aligns with "${trait}"`)
        }
      })

      // Score based on archetype keywords
      const archetypeKeywords = {
        innocent: ['pure', 'simple', 'honest', 'optimistic', 'happy', 'good'],
        explorer: ['adventure', 'freedom', 'discover', 'journey', 'explore', 'independent'],
        sage: ['wisdom', 'knowledge', 'truth', 'expert', 'teach', 'understand'],
        hero: ['achieve', 'overcome', 'challenge', 'win', 'succeed', 'triumph'],
        outlaw: ['rebel', 'change', 'revolution', 'different', 'break', 'disrupt'],
        magician: ['transform', 'magic', 'vision', 'dream', 'inspire', 'create'],
        regular: ['belong', 'connect', 'community', 'authentic', 'real', 'down-to-earth'],
        lover: ['passion', 'love', 'beauty', 'relationship', 'intimate', 'connect'],
        jester: ['fun', 'joy', 'humor', 'play', 'laugh', 'entertain'],
        caregiver: ['help', 'care', 'nurture', 'protect', 'support', 'service'],
        creator: ['create', 'build', 'imagine', 'artistic', 'innovative', 'express'],
        ruler: ['control', 'lead', 'power', 'authority', 'organize', 'structure']
      }

      const keywords = archetypeKeywords[archetype.id as keyof typeof archetypeKeywords] || []
      keywords.forEach(keyword => {
        if (allText.includes(keyword)) {
          score += 2
          reasoning.push(`Motivation includes "${keyword}"`)
        }
      })

      // Relationship-based scoring
      const relationshipKeywords = {
        innocent: ['trust', 'safe', 'reliable'],
        sage: ['advisor', 'expert', 'guide', 'teacher'],
        hero: ['champion', 'leader', 'achiever'],
        caregiver: ['helper', 'supporter', 'protector'],
        creator: ['collaborator', 'innovator', 'partner'],
        ruler: ['authority', 'leader', 'premium']
      }

      const relKeywords = relationshipKeywords[archetype.id as keyof typeof relationshipKeywords] || []
      relKeywords.forEach(keyword => {
        if (relationshipText.includes(keyword)) {
          score += 2
          reasoning.push(`Relationship style matches "${keyword}"`)
        }
      })

      return {
        archetype,
        score,
        reasoning: reasoning.slice(0, 3),
        match: Math.min(Math.round((score / 10) * 100), 100)
      }
    })

    // Return top 3 recommendations
    return archetypeScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        confidence: item.score > 6 ? 'High' : item.score > 3 ? 'Medium' : 'Low'
      }))
  }

  const selectArchetype = (archetypeId: string) => {
    setSelectedArchetype(archetypeId)
    const selected = aiRecommendations.find(rec => rec.archetype.id === archetypeId)
    if (selected) {
      setReasoning(`AI Analysis: ${selected.reasoning.join(', ')}. This archetype scored ${selected.match}% match based on your responses about brand personality, customer relationships, and core motivations.`)
    }
  }

  const handleComplete = () => {
    const archetypeData = {
      selectedArchetype,
      reasoning,
      aiGenerated: true,
      aiRecommendations,
      rawResponses: responses,
      timestamp: new Date().toISOString()
    }
    onComplete(archetypeData)
  }

  const goBack = () => {
    if (showRecommendations) {
      setShowRecommendations(false)
      setCurrentQuestion(questions.length - 1)
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setCurrentResponse(responses[currentQuestion - 1])
    }
  }

  if (analyzing) {
    return (
      <Card className="p-12 text-center">
        <div className="inline-flex items-center space-x-3 text-yellow-600 mb-4">
          <Crown className="w-8 h-8 animate-pulse" />
          <span className="text-xl font-medium">AI is analyzing your brand personality...</span>
        </div>
        <p className="text-gray-600">
          Matching your responses to the most suitable brand archetypes
        </p>
      </Card>
    )
  }

  if (showRecommendations) {
    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Archetype Recommendations</h2>
          <p className="text-gray-600">
            Based on your responses, here are the brand archetypes that best match your personality and values.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {aiRecommendations.map((recommendation) => (
            <motion.div
              key={recommendation.archetype.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: recommendation.rank * 0.1 }}
              className={`
                border-2 rounded-xl p-6 cursor-pointer transition-all
                ${selectedArchetype === recommendation.archetype.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => selectArchetype(recommendation.archetype.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center
                  ${selectedArchetype === recommendation.archetype.id
                    ? 'border-yellow-500 bg-yellow-500'
                    : 'border-gray-300'
                  }
                `}>
                  {selectedArchetype === recommendation.archetype.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-900">{recommendation.archetype.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          #{recommendation.rank} Match
                        </span>
                        <span className={`
                          text-sm px-2 py-1 rounded-full font-medium
                          ${recommendation.confidence === 'High' ? 'bg-green-100 text-green-800' :
                            recommendation.confidence === 'Medium' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {recommendation.match}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{recommendation.archetype.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Traits</h4>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.archetype.traits.slice(0, 4).map((trait: string, index: number) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Brand Examples</h4>
                      <p className="text-sm text-gray-600">{recommendation.archetype.examples.join(', ')}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>AI Analysis</span>
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {recommendation.reasoning.map((reason: string, index: number) => (
                        <li key={index}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* All Archetypes Grid */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Brand Archetypes</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {brandArchetypes.map((archetype) => (
              <button
                key={archetype.id}
                onClick={() => selectArchetype(archetype.id)}
                className={`
                  p-3 text-left border rounded-lg transition-all text-sm
                  ${selectedArchetype === archetype.id
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{archetype.name}</span>
                </div>
                <p className="text-xs text-gray-600">{archetype.description.substring(0, 50)}...</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={goBack}>
            Back to Questions
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!selectedArchetype}
            className="flex items-center space-x-2"
          >
            <span>Complete Archetype</span>
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
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Archetype Discovery</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-semibold text-yellow-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-yellow-600 mt-1" />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
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