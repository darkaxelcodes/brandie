import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Lightbulb } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { AIButton } from '../../../components/ui/AIButton'
import { ModeToggle } from '../../../components/ui/ModeToggle'
import { AIPilotPurpose } from '../../../components/strategy/AIPilotPurpose'
import { StrategyFormData } from '../../../types/brand'
import { generateStrategySuggestions } from '../../../lib/openai'

interface PurposeStepProps {
  formData: Partial<StrategyFormData>
  updateFormData: (section: keyof StrategyFormData, data: any) => void
  brandName: string
}

export const PurposeStep: React.FC<PurposeStepProps> = ({
  formData,
  updateFormData,
  brandName
}) => {
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const purposeData = formData.purpose || {
    mission: '',
    vision: '',
    why: ''
  }

  const updatePurpose = (field: keyof typeof purposeData, value: string) => {
    updateFormData('purpose', {
      ...purposeData,
      [field]: value
    })
  }

  const handleAISuggestions = async () => {
    try {
      const context = {
        brandName,
        currentMission: purposeData.mission,
        currentVision: purposeData.vision,
        currentWhy: purposeData.why
      }

      const response = await generateStrategySuggestions('purpose', context)
      setSuggestions(response.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    }
  }

  const applySuggestion = (suggestion: string, field: keyof typeof purposeData) => {
    updatePurpose(field, suggestion)
  }

  const handleAIPilotComplete = (data: any) => {
    updateFormData('purpose', data)
    setMode('manual') // Switch back to manual to show results
  }

  if (mode === 'ai-pilot') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Purpose & Vision</h2>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <AIPilotPurpose
          brandName={brandName}
          onComplete={handleAIPilotComplete}
          initialData={purposeData}
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
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Purpose & Vision</h2>
                <p className="text-gray-600">Define why {brandName} exists and where it's heading</p>
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
          {/* Mission Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Statement
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What is your brand's core purpose? What do you do and for whom?
            </p>
            <textarea
              value={purposeData.mission}
              onChange={(e) => updatePurpose('mission', e.target.value)}
              placeholder="We exist to..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Vision Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision Statement
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What future do you want to create? Where do you see your brand in 5-10 years?
            </p>
            <textarea
              value={purposeData.vision}
              onChange={(e) => updatePurpose('vision', e.target.value)}
              placeholder="We envision a world where..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Why Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why Statement
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Why does your brand matter? What deeper purpose drives you beyond profit?
            </p>
            <textarea
              value={purposeData.why}
              onChange={(e) => updatePurpose('why', e.target.value)}
              placeholder="We believe that..."
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
                  onClick={() => {
                    // Simple logic to determine which field this suggestion is for
                    if (suggestion.toLowerCase().includes('mission') || suggestion.toLowerCase().includes('exist')) {
                      applySuggestion(suggestion, 'mission')
                    } else if (suggestion.toLowerCase().includes('vision') || suggestion.toLowerCase().includes('future')) {
                      applySuggestion(suggestion, 'vision')
                    } else {
                      applySuggestion(suggestion, 'why')
                    }
                  }}
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mode Switch Hint */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Try AI Pilot Mode</h4>
              <p className="text-sm text-blue-800">
                Switch to AI Pilot mode for a guided conversation that helps you discover your purpose through targeted questions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}