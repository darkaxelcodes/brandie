import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Download, Eye, Share2, Printer, Sparkles, Brain, Zap } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ModeToggle } from '../../components/ui/ModeToggle'
import { brandService } from '../../lib/brandService'
import { visualService } from '../../lib/visualService'
import { guidelinesService } from '../../lib/guidelinesService'
import { Brand } from '../../types/brand'
import { GuidelinesPreview } from '../../components/guidelines/GuidelinesPreview'
import { GuidelinesExport } from '../../components/guidelines/GuidelinesExport'
import { AIGuidelinesGenerator } from '../../components/guidelines/AIGuidelinesGenerator'
import { TourButton } from '../../components/ui/TourButton'
import { useToast } from '../../contexts/ToastContext'

export const BrandGuidelines: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [brandData, setBrandData] = useState<any>(null)
  const [guidelines, setGuidelines] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'export' | 'ai'>('preview')
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!brandId) {
      navigate('/dashboard')
      return
    }

    loadBrandData()
  }, [brandId])

  const loadBrandData = async () => {
    try {
      setLoading(true)
      const [brandInfo, strategyData, visualAssets, brandVoice] = await Promise.all([
        brandService.getBrand(brandId!),
        brandService.getStrategyFormData(brandId!),
        visualService.getVisualAssets(brandId!),
        visualService.getBrandVoice(brandId!)
      ])

      if (!brandInfo) {
        navigate('/dashboard')
        return
      }

      setBrand(brandInfo)
      
      const compiledData = {
        brand: brandInfo,
        strategy: strategyData,
        visual: {
          logo: visualAssets.find(a => a.asset_type === 'logo')?.asset_data,
          colors: visualAssets.find(a => a.asset_type === 'color_palette')?.asset_data,
          typography: visualAssets.find(a => a.asset_type === 'typography')?.asset_data
        },
        voice: brandVoice
      }

      setBrandData(compiledData)
      
      // Check if guidelines already exist
      const existingGuidelines = await guidelinesService.getGuidelines(brandId!)
      if (existingGuidelines) {
        setGuidelines(existingGuidelines.content)
      }
    } catch (error) {
      console.error('Error loading brand data:', error)
      showToast('error', 'Failed to load brand data')
    } finally {
      setLoading(false)
    }
  }

  const generateGuidelines = async () => {
    if (!brandData) return

    try {
      setGenerating(true)
      const generatedGuidelines = await guidelinesService.generateGuidelines(brandData)
      
      // Save guidelines to database
      await guidelinesService.saveGuidelines(brandId!, generatedGuidelines)
      
      setGuidelines(generatedGuidelines)
      showToast('success', 'Guidelines generated successfully')
    } catch (error) {
      console.error('Error generating guidelines:', error)
      showToast('error', 'Failed to generate guidelines')
    } finally {
      setGenerating(false)
    }
  }

  const handleGuidelinesUpdate = async (updatedGuidelines: any) => {
    try {
      setGuidelines(updatedGuidelines)
      await guidelinesService.saveGuidelines(brandId!, updatedGuidelines)
      showToast('success', 'Guidelines updated successfully')
    } catch (error) {
      console.error('Error updating guidelines:', error)
      showToast('error', 'Failed to update guidelines')
    }
  }

  const getCompletionStatus = () => {
    if (!brandData) return { percentage: 0, missing: [] }

    const requirements = [
      { key: 'strategy.purpose', label: 'Brand Purpose' },
      { key: 'strategy.values', label: 'Brand Values' },
      { key: 'strategy.audience', label: 'Target Audience' },
      { key: 'visual.logo', label: 'Logo Design' },
      { key: 'visual.colors', label: 'Color Palette' },
      { key: 'visual.typography', label: 'Typography' },
      { key: 'voice', label: 'Brand Voice' }
    ]

    const completed = requirements.filter(req => {
      const keys = req.key.split('.')
      let value = brandData
      for (const key of keys) {
        value = value?.[key]
      }
      return value && Object.keys(value).length > 0
    })

    const missing = requirements.filter(req => {
      const keys = req.key.split('.')
      let value = brandData
      for (const key of keys) {
        value = value?.[key]
      }
      return !value || Object.keys(value).length === 0
    })

    return {
      percentage: Math.round((completed.length / requirements.length) * 100),
      missing: missing.map(m => m.label)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading brand guidelines...</p>
        </div>
      </div>
    )
  }

  const completion = getCompletionStatus()
  const canGenerate = completion.percentage >= 70

  const tabs = [
    { 
      id: 'preview', 
      label: 'Guidelines Preview', 
      icon: Eye,
      description: 'View your brand guidelines'
    },
    { 
      id: 'export', 
      label: 'Export & Share', 
      icon: Download,
      description: 'Download and share guidelines',
      className: 'export-options'
    },
    { 
      id: 'ai', 
      label: 'AI Enhancement', 
      icon: Brain,
      description: 'AI-powered improvements'
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
                <Brain className="w-8 h-8 text-blue-600" />
                AI Guidelines Discovery
              </h1>
              <p className="text-gray-600 mt-1">
                Create {brand?.name}'s guidelines through guided conversation
              </p>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </motion.div>

        <GuidelinesPreview
          brandData={brandData}
          guidelines={guidelines}
          onGenerate={generateGuidelines}
          generating={generating}
          canGenerate={canGenerate}
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
        className="mb-8 guidelines-header"
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
              <FileText className="w-8 h-8 text-blue-600" />
              Brand Guidelines
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive brand guidelines for {brand?.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <TourButton tourId="guidelines" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Completion</div>
              <div className="text-lg font-semibold text-blue-600">
                {completion.percentage}%
              </div>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
            {canGenerate && !guidelines && (
              <Button
                onClick={generateGuidelines}
                loading={generating}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Guidelines</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Completion Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className={`p-6 ${canGenerate 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
              canGenerate ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {canGenerate ? (
                <Sparkles className="w-6 h-6 text-green-600" />
              ) : (
                <Zap className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {canGenerate 
                  ? 'Ready to Generate Guidelines!' 
                  : 'Complete Your Brand Elements'
                }
              </h3>
              <p className="text-gray-600">
                {canGenerate 
                  ? 'Your brand is complete enough to generate comprehensive guidelines.'
                  : `Complete ${completion.missing.length} more elements for better guidelines.`
                }
              </p>
              {!canGenerate && completion.missing.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Missing: </span>
                  <span className="text-sm text-amber-700">
                    {completion.missing.join(', ')}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="w-full bg-gray-200 rounded-full h-2 w-32">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion.percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-2 rounded-full ${
                    canGenerate ? 'bg-green-600' : 'bg-amber-600'
                  }`}
                />
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {completion.percentage}% Complete
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="p-2">
          <div className="grid md:grid-cols-3 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex flex-col items-center space-y-2 px-6 py-4 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                  ${tab.className || ''}
                `}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </div>
                <span className={`text-xs ${
                  activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {tab.description}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'preview' && (
          <div className="guidelines-preview">
            <GuidelinesPreview
              brandData={brandData}
              guidelines={guidelines}
              onGenerate={generateGuidelines}
              generating={generating}
              canGenerate={canGenerate}
            />
          </div>
        )}

        {activeTab === 'export' && (
          <GuidelinesExport
            brand={brand}
            guidelines={guidelines}
            brandData={brandData}
          />
        )}

        {activeTab === 'ai' && (
          <AIGuidelinesGenerator
            brandData={brandData}
            guidelines={guidelines}
            onGuidelinesUpdate={handleGuidelinesUpdate}
          />
        )}
      </motion.div>
    </div>
  )
}