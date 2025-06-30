import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, Lightbulb } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { AIButton } from '../../../components/ui/AIButton'
import { ModeToggle } from '../../../components/ui/ModeToggle'
import { AIPilotArchetype } from '../../../components/strategy/AIPilotArchetype'
import { StrategyFormData } from '../../../types/brand'
import { brandArchetypes } from '../../../data/archetypes'
import { generateStrategySuggestions } from '../../../lib/openai'

interface ArchetypeStepProps {
  formData: Partial<StrategyFormData>
  updateFormData: (section: keyof StrategyFormData, data: any) => void
  brandName: string
}

export const ArchetypeStep: React.FC<ArchetypeStepProps> = ({
  formData,
  updateFormData,
  brandName
}) => {
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const archetypeData = formData.archetype || {
    selectedArchetype: '',
    reasoning: ''
  }

  const updateArchetype = (field: keyof typeof archetypeData, value: string) => {
    updateFormData('archetype', {
      ...archetypeData,
      [field]: value
    })
  }

  const selectArchetype = (archetypeId: string) => {
    updateArchetype('selectedArchetype', archetypeId)
  }

  const handleAISuggestions = async () => {
    try {
      const context = {
        brandName,
        purpose: formData.purpose,
        values: formData.values,
        audience: formData.audience,
        competitive: formData.competitive
      }

      const response = await generateStrategySuggestions('archetype', context)
      setSuggestions(response.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    }
  }

  const handleAIPilotComplete = (data: any) => {
    updateFormData('archetype', data)
    setMode('manual')
  }

  if (mode === 'ai-pilot') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Brand Archetype</h2>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>
        <AIPilotArchetype
          brandName={brandName}
          onComplete={handleAIPilotComplete}
          initialData={archetypeData}
          strategyContext={formData}
        />
      </div>
    )
  }

  const selectedArchetype = brandArchetypes.find(a => a.id === archetypeData.selectedArchetype)

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Brand Archetype</h2>
                <p className="text-gray-600">Choose the personality that best represents {brandName}</p>
              </div>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>

          <div className="flex justify-end">
            <AIButton onClick={handleAISuggestions}>
              Get AI Recommendations
            </AIButton>
          </div>
        </div>

        {/* Archetype Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {brandArchetypes.map((archetype) => (
            <motion.div
              key={archetype.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`
                p-4 border-2 rounded-xl cursor-pointer transition-all
                ${archetypeData.selectedArchetype === archetype.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => selectArchetype(archetype.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{archetype.name}</h3>
                {archetypeData.selectedArchetype === archetype.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{archetype.description}</p>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Traits:</p>
                  <div className="flex flex-wrap gap-1">
                    {archetype.traits.slice(0, 3).map((trait, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Examples:</p>
                  <p className="text-xs text-gray-600">{archetype.examples.join(', ')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Archetype Details */}
        {selectedArchetype && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200"
          >
            <h3 className="font-semibold text-blue-900 mb-2">
              Selected: {selectedArchetype.name}
            </h3>
            <p className="text-blue-800 mb-4">{selectedArchetype.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">Key Traits:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedArchetype.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">Brand Examples:</p>
                <p className="text-sm text-blue-800">{selectedArchetype.examples.join(', ')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reasoning */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why This Archetype?
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Explain why this archetype fits your brand's personality and goals
          </p>
          <textarea
            value={archetypeData.reasoning}
            onChange={(e) => updateArchetype('reasoning', e.target.value)}
            placeholder="This archetype fits our brand because..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
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
              <h3 className="font-semibold text-blue-900">AI Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white rounded-lg border border-blue-100"
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mode Switch Hint */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-900">Try AI Pilot Mode</h4>
              <p className="text-sm text-yellow-800">
                Let AI analyze your brand personality through strategic questions to recommend the perfect archetype.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}