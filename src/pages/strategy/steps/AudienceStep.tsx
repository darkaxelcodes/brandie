import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, X, Lightbulb } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { AIButton } from '../../../components/ui/AIButton'
import { ModeToggle } from '../../../components/ui/ModeToggle'
import { AIPilotAudience } from '../../../components/strategy/AIPilotAudience'
import { StrategyFormData } from '../../../types/brand'
import { generateStrategySuggestions } from '../../../lib/openai'

interface AudienceStepProps {
  formData: Partial<StrategyFormData>
  updateFormData: (section: keyof StrategyFormData, data: any) => void
  brandName: string
}

export const AudienceStep: React.FC<AudienceStepProps> = ({
  formData,
  updateFormData,
  brandName
}) => {
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [newPainPoint, setNewPainPoint] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const audienceData = formData.audience || {
    primaryAudience: '',
    demographics: '',
    psychographics: '',
    painPoints: []
  }

  const updateAudience = (field: keyof typeof audienceData, value: any) => {
    updateFormData('audience', {
      ...audienceData,
      [field]: value
    })
  }

  const addPainPoint = () => {
    if (newPainPoint.trim() && !audienceData.painPoints.includes(newPainPoint.trim())) {
      updateAudience('painPoints', [...audienceData.painPoints, newPainPoint.trim()])
      setNewPainPoint('')
    }
  }

  const removePainPoint = (index: number) => {
    const newPainPoints = audienceData.painPoints.filter((_, i) => i !== index)
    updateAudience('painPoints', newPainPoints)
  }

  const handleAISuggestions = async () => {
    try {
      const context = {
        brandName,
        purpose: formData.purpose,
        values: formData.values,
        currentAudience: audienceData
      }

      const response = await generateStrategySuggestions('audience', context)
      setSuggestions(response.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    }
  }

  const applySuggestion = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('pain') || suggestion.toLowerCase().includes('problem')) {
      if (!audienceData.painPoints.includes(suggestion)) {
        updateAudience('painPoints', [...audienceData.painPoints, suggestion])
      }
    } else if (suggestion.toLowerCase().includes('demographic')) {
      updateAudience('demographics', suggestion)
    } else if (suggestion.toLowerCase().includes('psychographic') || suggestion.toLowerCase().includes('behavior')) {
      updateAudience('psychographics', suggestion)
    } else {
      updateAudience('primaryAudience', suggestion)
    }
  }

  const handleAIPilotComplete = (data: any) => {
    updateFormData('audience', data)
    setMode('manual')
  }

  if (mode === 'ai-pilot') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Target Audience</h2>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <AIPilotAudience
          brandName={brandName}
          onComplete={handleAIPilotComplete}
          initialData={audienceData}
          strategyContext={{ purpose: formData.purpose, values: formData.values }}
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
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Target Audience</h2>
                <p className="text-gray-600">Define who {brandName} serves and their needs</p>
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
          {/* Primary Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Audience
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Who is your ideal customer? Describe them in one clear sentence.
            </p>
            <textarea
              value={audienceData.primaryAudience}
              onChange={(e) => updateAudience('primaryAudience', e.target.value)}
              placeholder="Our primary audience is..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          {/* Demographics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demographics
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Age, gender, income, location, education, occupation, etc.
            </p>
            <textarea
              value={audienceData.demographics}
              onChange={(e) => updateAudience('demographics', e.target.value)}
              placeholder="Age: 25-45, Income: $50k-$100k, Location: Urban areas..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Psychographics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Psychographics
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Values, interests, lifestyle, personality traits, motivations, etc.
            </p>
            <textarea
              value={audienceData.psychographics}
              onChange={(e) => updateAudience('psychographics', e.target.value)}
              placeholder="Values sustainability, tech-savvy, busy lifestyle, values convenience..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pain Points
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What problems, frustrations, or challenges does your audience face?
            </p>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPainPoint()}
                placeholder="Add a pain point..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addPainPoint} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {audienceData.painPoints.map((painPoint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between bg-red-50 border border-red-200 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm text-red-800">{painPoint}</span>
                  <button
                    onClick={() => removePainPoint(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
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
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Try AI Pilot Mode</h4>
              <p className="text-sm text-green-800">
                Let AI guide you through discovering your target audience through customer-focused questions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}