import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Plus, X, Lightbulb } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { AIButton } from '../../../components/ui/AIButton'
import { ModeToggle } from '../../../components/ui/ModeToggle'
import { AIPilotCompetitive } from '../../../components/strategy/AIPilotCompetitive'
import { StrategyFormData } from '../../../types/brand'
import { generateStrategySuggestions } from '../../../lib/openai'

interface CompetitiveStepProps {
  formData: Partial<StrategyFormData>
  updateFormData: (section: keyof StrategyFormData, data: any) => void
  brandName: string
}

export const CompetitiveStep: React.FC<CompetitiveStepProps> = ({
  formData,
  updateFormData,
  brandName
}) => {
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [newDirectCompetitor, setNewDirectCompetitor] = useState('')
  const [newIndirectCompetitor, setNewIndirectCompetitor] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const competitiveData = formData.competitive || {
    directCompetitors: [],
    indirectCompetitors: [],
    competitiveAdvantage: '',
    marketGap: ''
  }

  const updateCompetitive = (field: keyof typeof competitiveData, value: any) => {
    updateFormData('competitive', {
      ...competitiveData,
      [field]: value
    })
  }

  const addDirectCompetitor = () => {
    if (newDirectCompetitor.trim() && !competitiveData.directCompetitors.includes(newDirectCompetitor.trim())) {
      updateCompetitive('directCompetitors', [...competitiveData.directCompetitors, newDirectCompetitor.trim()])
      setNewDirectCompetitor('')
    }
  }

  const addIndirectCompetitor = () => {
    if (newIndirectCompetitor.trim() && !competitiveData.indirectCompetitors.includes(newIndirectCompetitor.trim())) {
      updateCompetitive('indirectCompetitors', [...competitiveData.indirectCompetitors, newIndirectCompetitor.trim()])
      setNewIndirectCompetitor('')
    }
  }

  const removeDirectCompetitor = (index: number) => {
    const newCompetitors = competitiveData.directCompetitors.filter((_, i) => i !== index)
    updateCompetitive('directCompetitors', newCompetitors)
  }

  const removeIndirectCompetitor = (index: number) => {
    const newCompetitors = competitiveData.indirectCompetitors.filter((_, i) => i !== index)
    updateCompetitive('indirectCompetitors', newCompetitors)
  }

  const handleAISuggestions = async () => {
    try {
      const context = {
        brandName,
        purpose: formData.purpose,
        values: formData.values,
        audience: formData.audience,
        currentCompetitive: competitiveData
      }

      const response = await generateStrategySuggestions('competitive', context)
      setSuggestions(response.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    }
  }

  const applySuggestion = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('advantage')) {
      updateCompetitive('competitiveAdvantage', suggestion)
    } else if (suggestion.toLowerCase().includes('gap') || suggestion.toLowerCase().includes('opportunity')) {
      updateCompetitive('marketGap', suggestion)
    } else if (suggestion.toLowerCase().includes('direct')) {
      if (!competitiveData.directCompetitors.includes(suggestion)) {
        updateCompetitive('directCompetitors', [...competitiveData.directCompetitors, suggestion])
      }
    } else {
      if (!competitiveData.indirectCompetitors.includes(suggestion)) {
        updateCompetitive('indirectCompetitors', [...competitiveData.indirectCompetitors, suggestion])
      }
    }
  }

  const handleAIPilotComplete = (data: any) => {
    updateFormData('competitive', data)
    setMode('manual')
  }

  if (mode === 'ai-pilot') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Competitive Analysis</h2>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <AIPilotCompetitive
          brandName={brandName}
          onComplete={handleAIPilotComplete}
          initialData={competitiveData}
          strategyContext={{ purpose: formData.purpose, values: formData.values, audience: formData.audience }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Competitive Analysis</h2>
                <p className="text-gray-600">Understand the market landscape and {brandName}'s position</p>
              </div>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>

          <div className="flex justify-end">
            <AIButton onClick={handleAISuggestions}>
              Get AI Suggestions
            </AIButton>
          </div>
        </div>

        <div className="space-y-6">
          {/* Direct Competitors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Direct Competitors
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Companies offering similar products/services to the same audience
            </p>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newDirectCompetitor}
                onChange={(e) => setNewDirectCompetitor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDirectCompetitor()}
                placeholder="Add a direct competitor..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addDirectCompetitor} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {competitiveData.directCompetitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{competitor}</span>
                  <button
                    onClick={() => removeDirectCompetitor(index)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Indirect Competitors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indirect Competitors
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Companies solving the same problem with different solutions
            </p>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newIndirectCompetitor}
                onChange={(e) => setNewIndirectCompetitor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIndirectCompetitor()}
                placeholder="Add an indirect competitor..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addIndirectCompetitor} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {competitiveData.indirectCompetitors.map((competitor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{competitor}</span>
                  <button
                    onClick={() => removeIndirectCompetitor(index)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Competitive Advantage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitive Advantage
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What gives you an edge over competitors? What do you do better?
            </p>
            <textarea
              value={competitiveData.competitiveAdvantage}
              onChange={(e) => updateCompetitive('competitiveAdvantage', e.target.value)}
              placeholder="Our competitive advantage is..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Market Gap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Gap/Opportunity
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What's missing in the market? What opportunity are you addressing?
            </p>
            <textarea
              value={competitiveData.marketGap}
              onChange={(e) => updateCompetitive('marketGap', e.target.value)}
              placeholder="The market gap we're addressing is..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>

        {/* AI Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">AI Suggestions</h3>
            </div>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mode Switch Hint */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-medium text-purple-900">Try AI Pilot Mode</h4>
              <p className="text-sm text-purple-800">
                Let AI guide you through competitive analysis with market-focused questions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}