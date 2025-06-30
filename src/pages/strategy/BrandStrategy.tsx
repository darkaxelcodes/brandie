import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, Target, Factory, Activity, BarChart, HelpCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { StepIndicator } from '../../components/ui/StepIndicator'
import { brandService } from '../../lib/brandService'
import { Brand, StrategyFormData } from '../../types/brand'
import { PurposeStep } from './steps/PurposeStep'
import { ValuesStep } from './steps/ValuesStep'
import { AudienceStep } from './steps/AudienceStep'
import { CompetitiveStep } from './steps/CompetitiveStep'
import { ArchetypeStep } from './steps/ArchetypeStep'
import { IndustryAnalysis } from '../../components/strategy/IndustryAnalysis'
import { BrandHealthScore } from '../../components/strategy/BrandHealthScore'
import { CompetitiveAnalysis } from '../../components/strategy/CompetitiveAnalysis'
import { useToast } from '../../contexts/ToastContext'
import { TourButton } from '../../components/ui/TourButton'

const steps = [
  { id: 'purpose', title: 'Purpose', completed: false },
  { id: 'values', title: 'Values', completed: false },
  { id: 'audience', title: 'Audience', completed: false },
  { id: 'competitive', title: 'Competitive', completed: false },
  { id: 'archetype', title: 'Archetype', completed: false }
]

export const BrandStrategy: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState<Partial<StrategyFormData>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

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
      const [brandData, strategyData] = await Promise.all([
        brandService.getBrand(brandId!),
        brandService.getStrategyFormData(brandId!)
      ])

      if (!brandData) {
        navigate('/dashboard')
        return
      }

      setBrand(brandData)
      setFormData(strategyData)
      
      // Update steps completion status
      const updatedSteps = [...steps]
      Object.keys(strategyData).forEach(key => {
        const index = steps.findIndex(step => step.id === key)
        if (index !== -1) {
          updatedSteps[index].completed = true
        }
      })
    } catch (error) {
      console.error('Error loading brand data:', error)
      showToast('error', 'Failed to load brand data')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (section: keyof StrategyFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const saveCurrentStep = async (completed: boolean = false) => {
    if (!brandId) return

    const sectionTypes = ['purpose', 'values', 'audience', 'competitive', 'archetype']
    const sectionType = sectionTypes[currentStep]
    const sectionData = formData[sectionType as keyof StrategyFormData]

    if (!sectionData) return

    try {
      setSaving(true)
      await brandService.saveStrategySection(
        brandId,
        sectionType,
        sectionData,
        completed
      )
      showToast('success', 'Progress saved successfully')
    } catch (error) {
      console.error('Error saving strategy section:', error)
      showToast('error', 'Failed to save progress')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await saveCurrentStep(true)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // All steps completed, redirect to dashboard
      navigate('/dashboard')
    }
  }

  const handlePrevious = async () => {
    await saveCurrentStep(false)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    await saveCurrentStep(false)
  }

  const handleAddCompetitor = (competitor: string) => {
    const competitiveData = formData.competitive || {
      directCompetitors: [],
      indirectCompetitors: [],
      competitiveAdvantage: '',
      marketGap: ''
    }
    
    updateFormData('competitive', {
      ...competitiveData,
      directCompetitors: [...competitiveData.directCompetitors, competitor]
    })
  }

  const handleRemoveCompetitor = (competitor: string) => {
    const competitiveData = formData.competitive || {
      directCompetitors: [],
      indirectCompetitors: [],
      competitiveAdvantage: '',
      marketGap: ''
    }
    
    updateFormData('competitive', {
      ...competitiveData,
      directCompetitors: competitiveData.directCompetitors.filter(c => c !== competitor)
    })
  }

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      brandName: brand?.name || ''
    }

    switch (currentStep) {
      case 0:
        return <PurposeStep {...stepProps} />
      case 1:
        return <ValuesStep {...stepProps} />
      case 2:
        return <AudienceStep {...stepProps} />
      case 3:
        return <CompetitiveStep {...stepProps} />
      case 4:
        return <ArchetypeStep {...stepProps} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Target className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading brand strategy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 strategy-header"
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
            <h1 className="text-3xl font-bold text-gray-900">Brand Strategy</h1>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <Factory className="w-4 h-4" />
              <span>{brand?.industry ? brand.industry.replace('_', ' ') : 'Industry not specified'}</span>
              <span>•</span>
              <span>Define the core elements of {brand?.name}'s brand identity</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TourButton tourId="strategy" />
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center space-x-2"
            >
              {showAnalytics ? (
                <>
                  <Target className="w-4 h-4" />
                  <span>Show Strategy</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Show Analytics</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              loading={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Progress</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {showAnalytics ? (
        // Analytics View
        <div className="space-y-8">
          {/* Brand Health Score */}
          <BrandHealthScore 
            brandId={brandId!} 
            brandName={brand?.name || ''}
          />
          
          {/* Industry Analysis */}
          {brand?.industry && (
            <IndustryAnalysis 
              industry={brand.industry} 
              brandName={brand.name}
            />
          )}
          
          {/* Competitive Analysis */}
          <CompetitiveAnalysis
            industry={brand?.industry || 'technology'}
            brandName={brand?.name || ''}
            competitors={formData.competitive?.directCompetitors || []}
            onAddCompetitor={handleAddCompetitor}
            onRemoveCompetitor={handleRemoveCompetitor}
          />
        </div>
      ) : (
        // Strategy View
        <>
          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 strategy-steps"
          >
            <Card className="p-6">
              <StepIndicator
                steps={steps}
                currentStep={currentStep}
              />
            </Card>
          </motion.div>

          {/* Current Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {renderCurrentStep()}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between"
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete Strategy' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </>
      )}
    </div>
  )
}