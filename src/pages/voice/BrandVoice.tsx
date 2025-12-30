import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Save, Plus, X, Brain, Sparkles, Zap, Eye, Download } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Slider } from '../../components/ui/Slider'
import { AIButton } from '../../components/ui/AIButton'
import { ModeToggle } from '../../components/ui/ModeToggle'
import { brandService } from '../../lib/brandService'
import { visualService } from '../../lib/visualService'
import { Brand, BrandVoice as BrandVoiceType } from '../../types/visual'
import { generateStrategySuggestions } from '../../lib/openai'
import { AIPilotVoice } from '../../components/voice/AIPilotVoice'
import { AIVoiceGenerator } from '../../components/voice/AIVoiceGenerator'
import { VoiceExamples } from '../../components/voice/VoiceExamples'
import { PlatformContentGenerator } from '../../components/voice/PlatformContentGenerator'
import { useToast } from '../../contexts/ToastContext'
import { TourButton } from '../../components/ui/TourButton'

export const BrandVoice: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [brandStrategy, setBrandStrategy] = useState<any>(null)
  const [brandVoice, setBrandVoice] = useState<Partial<BrandVoiceType>>({
    tone_scales: {
      formalCasual: 50,
      logicalEmotional: 50,
      playfulSerious: 50,
      traditionalInnovative: 50
    },
    messaging: {
      tagline: '',
      elevatorPitch: '',
      keyMessages: []
    },
    guidelines: {
      dosList: [],
      dontsList: [],
      exampleContent: ''
    }
  })
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [activeTab, setActiveTab] = useState<'tone' | 'messaging' | 'guidelines' | 'examples' | 'ai-enhance' | 'platform-content'>('tone')
  const [newKeyMessage, setNewKeyMessage] = useState('')
  const [newDo, setNewDo] = useState('')
  const [newDont, setNewDont] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)

  useEffect(() => {
    if (!brandId) {
      navigate('/dashboard')
      return
    }

    loadData()
  }, [brandId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [brandData, voiceData, strategyData] = await Promise.all([
        brandService.getBrand(brandId!),
        visualService.getBrandVoice(brandId!),
        brandService.getStrategyFormData(brandId!)
      ])

      if (!brandData) {
        navigate('/dashboard')
        return
      }

      setBrand(brandData)
      setBrandStrategy(strategyData)
      if (voiceData) {
        setBrandVoice(voiceData)
      }
    } catch (error) {
      console.error('Error loading brand voice data:', error)
      showToast('error', 'Failed to load brand voice data')
    } finally {
      setLoading(false)
    }
  }

  const saveBrandVoice = async () => {
    if (!brandId) return

    try {
      setSaving(true)
      await visualService.saveBrandVoice(brandId, brandVoice)
      showToast('success', 'Brand voice saved successfully')
    } catch (error) {
      console.error('Error saving brand voice:', error)
      showToast('error', 'Failed to save brand voice')
    } finally {
      setSaving(false)
    }
  }

  const handleAIPilotComplete = async (data: any) => {
    setBrandVoice(data)
    await visualService.saveBrandVoice(brandId!, data)
    setMode('manual') // Switch back to manual to show results
    showToast('success', 'Brand voice updated with AI recommendations')
  }

  const updateToneScale = (scale: string, value: number) => {
    setBrandVoice(prev => ({
      ...prev,
      tone_scales: {
        ...prev.tone_scales!,
        [scale]: value
      }
    }))
  }

  const updateMessaging = (field: string, value: string) => {
    setBrandVoice(prev => ({
      ...prev,
      messaging: {
        ...prev.messaging!,
        [field]: value
      }
    }))
  }

  const addKeyMessage = () => {
    const trimmedMessage = newKeyMessage.trim()
    const isDuplicate = brandVoice.messaging?.keyMessages.some(
      msg => msg.toLowerCase() === trimmedMessage.toLowerCase()
    )
    if (trimmedMessage && !isDuplicate) {
      setBrandVoice(prev => ({
        ...prev,
        messaging: {
          ...prev.messaging!,
          keyMessages: [...prev.messaging!.keyMessages, trimmedMessage]
        }
      }))
      setNewKeyMessage('')
    }
  }

  const removeKeyMessage = (index: number) => {
    setBrandVoice(prev => ({
      ...prev,
      messaging: {
        ...prev.messaging!,
        keyMessages: prev.messaging!.keyMessages.filter((_, i) => i !== index)
      }
    }))
  }

  const addDo = () => {
    const trimmedDo = newDo.trim()
    const isDuplicate = brandVoice.guidelines?.dosList.some(
      item => item.toLowerCase() === trimmedDo.toLowerCase()
    )
    if (trimmedDo && !isDuplicate) {
      setBrandVoice(prev => ({
        ...prev,
        guidelines: {
          ...prev.guidelines!,
          dosList: [...prev.guidelines!.dosList, trimmedDo]
        }
      }))
      setNewDo('')
    }
  }

  const removeDo = (index: number) => {
    setBrandVoice(prev => ({
      ...prev,
      guidelines: {
        ...prev.guidelines!,
        dosList: prev.guidelines!.dosList.filter((_, i) => i !== index)
      }
    }))
  }

  const addDont = () => {
    const trimmedDont = newDont.trim()
    const isDuplicate = brandVoice.guidelines?.dontsList.some(
      item => item.toLowerCase() === trimmedDont.toLowerCase()
    )
    if (trimmedDont && !isDuplicate) {
      setBrandVoice(prev => ({
        ...prev,
        guidelines: {
          ...prev.guidelines!,
          dontsList: [...prev.guidelines!.dontsList, trimmedDont]
        }
      }))
      setNewDont('')
    }
  }

  const removeDont = (index: number) => {
    setBrandVoice(prev => ({
      ...prev,
      guidelines: {
        ...prev.guidelines!,
        dontsList: prev.guidelines!.dontsList.filter((_, i) => i !== index)
      }
    }))
  }

  const generateAIContent = async () => {
    try {
      const context = {
        brandName: brand?.name,
        industry: brand?.industry,
        strategy: brandStrategy,
        toneScales: brandVoice.tone_scales,
        currentVoice: brandVoice
      }

      const response = await generateStrategySuggestions('voice', context)
      setAiSuggestions({
        suggestions: response.suggestions,
        analysis: {
          currentTone: getToneDescription(),
          recommendations: response.suggestions.slice(0, 3),
          improvements: response.suggestions.slice(3, 6),
          examples: response.suggestions.slice(6)
        }
      })
      setShowAiSuggestions(true)
      showToast('success', 'AI suggestions generated successfully')
    } catch (error) {
      console.error('Error generating AI content:', error)
      showToast('error', 'Failed to generate AI suggestions')
    }
  }

  const applyAISuggestion = (suggestion: string, type: 'messaging' | 'guidelines' | 'tone') => {
    switch (type) {
      case 'messaging':
        if (suggestion.toLowerCase().includes('tagline')) {
          updateMessaging('tagline', suggestion.replace(/.*tagline:?\s*/i, ''))
        } else if (suggestion.toLowerCase().includes('pitch')) {
          updateMessaging('elevatorPitch', suggestion.replace(/.*pitch:?\s*/i, ''))
        } else {
          if (!brandVoice.messaging?.keyMessages.includes(suggestion)) {
            setBrandVoice(prev => ({
              ...prev,
              messaging: {
                ...prev.messaging!,
                keyMessages: [...prev.messaging!.keyMessages, suggestion]
              }
            }))
          }
        }
        break
      case 'guidelines':
        if (suggestion.toLowerCase().includes('do:') || suggestion.toLowerCase().includes('use')) {
          if (!brandVoice.guidelines?.dosList.includes(suggestion)) {
            setBrandVoice(prev => ({
              ...prev,
              guidelines: {
                ...prev.guidelines!,
                dosList: [...prev.guidelines!.dosList, suggestion]
              }
            }))
          }
        } else if (suggestion.toLowerCase().includes("don't") || suggestion.toLowerCase().includes('avoid')) {
          if (!brandVoice.guidelines?.dontsList.includes(suggestion)) {
            setBrandVoice(prev => ({
              ...prev,
              guidelines: {
                ...prev.guidelines!,
                dontsList: [...prev.guidelines!.dontsList, suggestion]
              }
            }))
          }
        }
        break
    }
  }

  const getStrategyCompleteness = () => {
    if (!brandStrategy) return 0
    let completed = 0
    if (brandStrategy.purpose) completed += 20
    if (brandStrategy.values) completed += 20
    if (brandStrategy.audience) completed += 20
    if (brandStrategy.competitive) completed += 20
    if (brandStrategy.archetype) completed += 20
    return completed
  }

  const getVoiceCompleteness = () => {
    let completed = 0
    if (brandVoice.messaging?.tagline) completed += 25
    if (brandVoice.messaging?.elevatorPitch) completed += 25
    if (brandVoice.messaging?.keyMessages && brandVoice.messaging.keyMessages.length > 0) completed += 25
    if (brandVoice.guidelines?.dosList && brandVoice.guidelines.dosList.length > 0) completed += 25
    return completed
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI brand voice tools...</p>
        </div>
      </div>
    )
  }

  const getToneDescription = () => {
    const scales = brandVoice.tone_scales!
    const descriptions = []

    if (scales.formalCasual < 30) descriptions.push('formal')
    else if (scales.formalCasual > 70) descriptions.push('casual')
    else descriptions.push('balanced')

    if (scales.logicalEmotional < 30) descriptions.push('logical')
    else if (scales.logicalEmotional > 70) descriptions.push('emotional')

    if (scales.playfulSerious < 30) descriptions.push('serious')
    else if (scales.playfulSerious > 70) descriptions.push('playful')

    if (scales.traditionalInnovative < 30) descriptions.push('traditional')
    else if (scales.traditionalInnovative > 70) descriptions.push('innovative')

    return descriptions.join(', ')
  }

  const tabs = [
    { 
      id: 'tone', 
      label: 'AI Tone Analysis', 
      icon: Brain,
      description: 'Define personality scales'
    },
    { 
      id: 'messaging', 
      label: 'Smart Messaging', 
      icon: MessageSquare,
      description: 'Core messages & taglines'
    },
    { 
      id: 'guidelines', 
      label: 'Voice Guidelines', 
      icon: Zap,
      description: "Do's and don'ts"
    },
    { 
      id: 'examples', 
      label: 'AI Examples', 
      icon: Eye,
      description: 'Generated content samples'
    },
    { 
      id: 'platform-content', 
      label: 'Platform Content', 
      icon: Download,
      description: 'Platform-specific content'
    },
    { 
      id: 'ai-enhance', 
      label: 'AI Enhancement', 
      icon: Sparkles,
      description: 'Advanced AI tools'
    }
  ]

  // AI Pilot Mode
  if (mode === 'ai-pilot') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="w-8 h-8 text-green-600" />
                AI Voice Discovery
              </h1>
              <p className="text-gray-600 mt-1">
                Discover {brand?.name}'s voice through guided conversation
              </p>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </motion.div>

        <AIPilotVoice
          brandName={brand?.name || ''}
          onComplete={handleAIPilotComplete}
          initialData={brandVoice}
          strategyContext={brandStrategy}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 voice-header"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-green-600" />
              AI Brand Voice
            </h1>
            <p className="text-gray-600 mt-1">
              Define how {brand?.name} communicates with AI-powered insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <TourButton tourId="voice" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Voice Progress</div>
              <div className="text-lg font-semibold text-green-600">
                {getVoiceCompleteness()}%
              </div>
            </div>
            <Button
              onClick={saveBrandVoice}
              loading={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Voice</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* AI Readiness Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className={`p-6 ${getStrategyCompleteness() >= 80 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
              getStrategyCompleteness() >= 80 
                ? 'bg-green-100' 
                : 'bg-amber-100'
            }`}>
              {getStrategyCompleteness() >= 80 ? (
                <Sparkles className="w-6 h-6 text-green-600" />
              ) : (
                <Zap className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {getStrategyCompleteness() >= 80 
                  ? 'AI Ready - Enhanced Voice Generation!' 
                  : 'Complete Strategy for Better AI Results'
                }
              </h3>
              <p className="text-gray-600">
                {getStrategyCompleteness() >= 80 
                  ? 'Your brand strategy enables AI to generate highly personalized voice recommendations.'
                  : `Complete your brand strategy (${getStrategyCompleteness()}%) for more accurate voice suggestions.`
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ModeToggle mode={mode} onModeChange={setMode} />
              <AIButton
                onClick={generateAIContent}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Voice
              </AIButton>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-2">
          <div className="grid md:grid-cols-6 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex flex-col items-center space-y-2 px-4 py-4 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </div>
                <span className={`text-xs ${
                  activeTab === tab.id ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {tab.description}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'tone' && (
          <Card className="p-8 tone-scales">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Tone Analysis</h2>
              <p className="text-gray-600">Define your brand's communication personality with AI insights</p>
            </div>

            <div className="space-y-8">
              <Slider
                value={brandVoice.tone_scales?.formalCasual || 50}
                onChange={(value) => updateToneScale('formalCasual', value)}
                leftLabel="Formal"
                rightLabel="Casual"
              />

              <Slider
                value={brandVoice.tone_scales?.logicalEmotional || 50}
                onChange={(value) => updateToneScale('logicalEmotional', value)}
                leftLabel="Logical"
                rightLabel="Emotional"
              />

              <Slider
                value={brandVoice.tone_scales?.playfulSerious || 50}
                onChange={(value) => updateToneScale('playfulSerious', value)}
                leftLabel="Serious"
                rightLabel="Playful"
              />

              <Slider
                value={brandVoice.tone_scales?.traditionalInnovative || 50}
                onChange={(value) => updateToneScale('traditionalInnovative', value)}
                leftLabel="Traditional"
                rightLabel="Innovative"
              />

              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Your AI-Analyzed Brand Voice</h3>
                <p className="text-green-800 capitalize text-lg">{getToneDescription()}</p>
                <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-900">Best for:</span>
                    <p className="text-green-700">
                      {getStrategyCompleteness() >= 80 
                        ? `${brandStrategy?.audience?.primaryAudience?.slice(0, 50)}...`
                        : 'Complete strategy for personalized insights'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-green-900">Communication Style:</span>
                    <p className="text-green-700">
                      {brandVoice.tone_scales?.formalCasual > 60 ? 'Conversational and approachable' : 'Professional and authoritative'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'messaging' && (
          <Card className="p-8 messaging-section">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Smart Messaging Framework</h2>

            <div className="space-y-6">
              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Tagline
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  A memorable phrase that captures your brand essence
                </p>
                <input
                  type="text"
                  value={brandVoice.messaging?.tagline || ''}
                  onChange={(e) => updateMessaging('tagline', e.target.value)}
                  placeholder="Think Different"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Elevator Pitch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elevator Pitch
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  A 30-second description of what you do and why it matters
                </p>
                <textarea
                  value={brandVoice.messaging?.elevatorPitch || ''}
                  onChange={(e) => updateMessaging('elevatorPitch', e.target.value)}
                  placeholder="We help..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Key Messages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Messages
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Core messages you want to communicate consistently
                </p>
                
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newKeyMessage}
                    onChange={(e) => setNewKeyMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyMessage()}
                    placeholder="Add a key message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button onClick={addKeyMessage} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {brandVoice.messaging?.keyMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-blue-800">{message}</span>
                      <button
                        onClick={() => removeKeyMessage(index)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'guidelines' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Voice Guidelines</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Do's */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do's
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Writing practices that align with your brand
                </p>
                
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newDo}
                    onChange={(e) => setNewDo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDo()}
                    placeholder="Add a do..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button onClick={addDo} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {brandVoice.guidelines?.dosList.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-green-800">{item}</span>
                      <button
                        onClick={() => removeDo(index)}
                        className="text-green-400 hover:text-green-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Don'ts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Don'ts
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Writing practices to avoid
                </p>
                
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newDont}
                    onChange={(e) => setNewDont(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addDont()}
                    placeholder="Add a don't..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button onClick={addDont} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {brandVoice.guidelines?.dontsList.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-red-50 border border-red-200 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-red-800">{item}</span>
                      <button
                        onClick={() => removeDont(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Example Content */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Example Content
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Sample content that demonstrates your brand voice
              </p>
              <textarea
                value={brandVoice.guidelines?.exampleContent || ''}
                onChange={(e) => setBrandVoice(prev => ({
                  ...prev,
                  guidelines: {
                    ...prev.guidelines!,
                    exampleContent: e.target.value
                  }
                }))}
                placeholder="Write an example social media post, email, or other content that exemplifies your brand voice..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </Card>
        )}

        {activeTab === 'examples' && (
          <div className="voice-examples">
            <VoiceExamples
              brandData={{
                brand: brand,
                strategy: brandStrategy
              }}
              brandVoice={brandVoice}
            />
          </div>
        )}

        {activeTab === 'platform-content' && (
          <PlatformContentGenerator
            brandData={{
              brand: brand,
              strategy: brandStrategy
            }}
            brandVoice={brandVoice}
          />
        )}

        {activeTab === 'ai-enhance' && (
          <AIVoiceGenerator
            brandData={{
              brand: brand,
              strategy: brandStrategy
            }}
            currentVoice={brandVoice}
            onVoiceUpdate={(updatedVoice) => {
              setBrandVoice(prev => ({
                ...prev,
                ...updatedVoice
              }))
              saveBrandVoice()
            }}
          />
        )}
      </motion.div>

      {/* AI Suggestions Panel */}
      {showAiSuggestions && aiSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                AI Voice Enhancement
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowAiSuggestions(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="text-sm text-green-700 mb-4">
              Click on any suggestion above to apply it to your brand voice. AI has analyzed your brand strategy and current voice settings to provide personalized recommendations.
            </div>
          </Card>
        </motion.div>
      )}

      {/* Mode Switch Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Try AI Pilot Mode</h3>
              <p className="text-green-700">
                Switch to AI Pilot mode to discover your brand voice through a guided conversation. 
                Our AI will ask strategic questions and analyze your responses to create a personalized voice.
              </p>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </Card>
      </motion.div>
    </div>
  )
}