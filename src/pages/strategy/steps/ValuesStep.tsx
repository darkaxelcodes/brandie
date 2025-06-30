import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, X, Lightbulb } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { AIButton } from '../../../components/ui/AIButton'
import { ModeToggle } from '../../../components/ui/ModeToggle'
import { AIPilotValues } from '../../../components/strategy/AIPilotValues'
import { StrategyFormData } from '../../../types/brand'
import { generateStrategySuggestions } from '../../../lib/openai'

interface ValuesStepProps {
  formData: Partial<StrategyFormData>
  updateFormData: (section: keyof StrategyFormData, data: any) => void
  brandName: string
}

export const ValuesStep: React.FC<ValuesStepProps> = ({
  formData,
  updateFormData,
  brandName
}) => {
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [newValue, setNewValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const valuesData = formData.values || {
    coreValues: [],
    positioning: '',
    uniqueValue: ''
  }

  const updateValues = (field: keyof typeof valuesData, value: any) => {
    updateFormData('values', {
      ...valuesData,
      [field]: value
    })
  }

  const addValue = () => {
    if (newValue.trim() && !valuesData.coreValues.includes(newValue.trim())) {
      updateValues('coreValues', [...valuesData.coreValues, newValue.trim()])
      setNewValue('')
    }
  }

  const removeValue = (index: number) => {
    const newValues = valuesData.coreValues.filter((_, i) => i !== index)
    updateValues('coreValues', newValues)
  }

  const handleAISuggestions = async () => {
    try {
      const context = {
        brandName,
        currentValues: valuesData.coreValues,
        positioning: valuesData.positioning,
        uniqueValue: valuesData.uniqueValue,
        purpose: formData.purpose
      }

      const response = await generateStrategySuggestions('values', context)
      setSuggestions(response.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    }
  }

  const applySuggestion = (suggestion: string) => {
    if (suggestion.toLowerCase().includes('value') && !valuesData.coreValues.includes(suggestion)) {
      updateValues('coreValues', [...valuesData.coreValues, suggestion])
    } else if (suggestion.toLowerCase().includes('position')) {
      updateValues('positioning', suggestion)
    } else {
      updateValues('uniqueValue', suggestion)
    }
  }

  const handleAIPilotComplete = (data: any) => {
    updateFormData('values', data)
    setMode('manual')
  }

  if (mode === 'ai-pilot') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Values & Positioning</h2>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <AIPilotValues
          brandName={brandName}
          onComplete={handleAIPilotComplete}
          initialData={valuesData}
          purposeData={formData.purpose}
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
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Values & Positioning</h2>
                <p className="text-gray-600">Define what {brandName} stands for and how it's different</p>
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
          {/* Core Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Core Values
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What principles guide your brand's decisions and behavior?
            </p>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
                placeholder="Add a core value..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addValue} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {valuesData.coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{value}</span>
                  <button
                    onClick={() => removeValue(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Positioning Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Positioning Statement
            </label>
            <p className="text-sm text-gray-500 mb-3">
              How do you want to be perceived in the market? What space do you own?
            </p>
            <textarea
              value={valuesData.positioning}
              onChange={(e) => updateValues('positioning', e.target.value)}
              placeholder="For [target audience], [brand] is the [category] that [unique benefit] because [reason to believe]..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Unique Value Proposition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unique Value Proposition
            </label>
            <p className="text-sm text-gray-500 mb-3">
              What makes you different from competitors? What unique value do you provide?
            </p>
            <textarea
              value={valuesData.uniqueValue}
              onChange={(e) => updateValues('uniqueValue', e.target.value)}
              placeholder="Unlike other [category], we..."
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
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-900">Try AI Pilot Mode</h4>
              <p className="text-sm text-red-800">
                Let AI guide you through discovering your core values and positioning through strategic questions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}