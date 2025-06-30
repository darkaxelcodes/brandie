import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, LayoutTemplate, Megaphone, Brain } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { brandService } from '../../lib/brandService'
import { visualService } from '../../lib/visualService'
import { guidelinesService } from '../../lib/guidelinesService'
import { Brand } from '../../types/brand'
import { BrandComplianceChecker } from '../../components/consistency/BrandComplianceChecker'
import { TemplateLibrary } from '../../components/consistency/TemplateLibrary'
import { SocialMediaTemplates } from '../../components/consistency/SocialMediaTemplates'
import { MarketingTemplates } from '../../components/consistency/MarketingTemplates'
import { TourButton } from '../../components/ui/TourButton'
import { useToast } from '../../contexts/ToastContext'

export const BrandConsistency: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [brandData, setBrandData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'compliance' | 'templates' | 'social' | 'marketing'>('compliance')
  const [loading, setLoading] = useState(true)

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
      
      // Get guidelines if they exist
      let guidelines = null
      try {
        const guidelinesData = await guidelinesService.getGuidelines(brandId!)
        guidelines = guidelinesData
      } catch (error) {
        console.error('Error loading guidelines:', error)
      }
      
      const compiledData = {
        brand: brandInfo,
        strategy: strategyData,
        visual: {
          logo: visualAssets.find(a => a.asset_type === 'logo')?.asset_data || null,
          colors: visualAssets.find(a => a.asset_type === 'color_palette')?.asset_data || null,
          typography: visualAssets.find(a => a.asset_type === 'typography')?.asset_data || null
        },
        voice: brandVoice,
        guidelines: guidelines?.content || null
      }

      setBrandData(compiledData)
    } catch (error) {
      console.error('Error loading brand data:', error)
      showToast('error', 'Failed to load brand data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading brand consistency tools...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { 
      id: 'compliance', 
      label: 'Brand Compliance', 
      icon: CheckCircle,
      description: 'Check brand consistency',
      className: 'compliance-checker'
    },
    { 
      id: 'templates', 
      label: 'Template Library', 
      icon: LayoutTemplate,
      description: 'Ready-to-use templates',
      className: 'template-library'
    },
    { 
      id: 'social', 
      label: 'Social Media', 
      icon: LayoutTemplate,
      description: 'Social media templates'
    },
    { 
      id: 'marketing', 
      label: 'Marketing Materials', 
      icon: Megaphone,
      description: 'Marketing templates'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 consistency-header"
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
              <CheckCircle className="w-8 h-8 text-green-600" />
              Brand Consistency Tools
            </h1>
            <p className="text-gray-600 mt-1">
              Ensure {brand?.name}'s brand is consistent across all materials
            </p>
          </div>
          <TourButton tourId="consistency" />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-2">
          <div className="grid md:grid-cols-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex flex-col items-center space-y-2 px-6 py-4 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
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
                  activeTab === tab.id ? 'text-green-100' : 'text-gray-500'
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
        {activeTab === 'compliance' && (
          <BrandComplianceChecker brandData={brandData} />
        )}

        {activeTab === 'templates' && (
          <TemplateLibrary brandData={brandData} />
        )}

        {activeTab === 'social' && (
          <SocialMediaTemplates brandData={brandData} />
        )}

        {activeTab === 'marketing' && (
          <MarketingTemplates brandData={brandData} />
        )}
      </motion.div>
    </div>
  )
}