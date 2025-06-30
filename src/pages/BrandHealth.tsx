import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Activity, BarChart, TrendingUp, Users, AlertCircle, Lightbulb } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { brandService } from '../lib/brandService'
import { Brand } from '../types/brand'
import { BrandHealthScore } from '../components/strategy/BrandHealthScore'
import { IndustryAnalysis } from '../components/strategy/IndustryAnalysis'
import { CompetitiveAnalysis } from '../components/strategy/CompetitiveAnalysis'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'

export const BrandHealth: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'health' | 'industry' | 'competitive'>('health')
  const [industryAnalysisData, setIndustryAnalysisData] = useState<any>(null)

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

      // Check if industry analysis data exists in the database
      if (brandData.industry) {
        try {
          const { data, error } = await supabase
            .from('industry_suggestions')
            .select('*')
            .eq('industry', brandData.industry)
            .eq('suggestion_type', 'analysis')
            .maybeSingle()

          if (!error && data) {
            setIndustryAnalysisData(data.content)
          }
        } catch (err) {
          console.error('Error fetching industry analysis data:', err)
        }
      }
    } catch (error) {
      console.error('Error loading brand data:', error)
      showToast('error', 'Failed to load brand data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompetitor = (competitor: string) => {
    const competitiveData = formData.competitive || {
      directCompetitors: [],
      indirectCompetitors: [],
      competitiveAdvantage: '',
      marketGap: ''
    }
    
    const updatedData = {
      ...competitiveData,
      directCompetitors: [...competitiveData.directCompetitors, competitor]
    }
    
    setFormData({
      ...formData,
      competitive: updatedData
    })
    
    // Save to database
    brandService.saveStrategySection(
      brandId!,
      'competitive',
      updatedData,
      true
    )
  }

  const handleRemoveCompetitor = (competitor: string) => {
    const competitiveData = formData.competitive || {
      directCompetitors: [],
      indirectCompetitors: [],
      competitiveAdvantage: '',
      marketGap: ''
    }
    
    const updatedData = {
      ...competitiveData,
      directCompetitors: competitiveData.directCompetitors.filter(c => c !== competitor)
    }
    
    setFormData({
      ...formData,
      competitive: updatedData
    })
    
    // Save to database
    brandService.saveStrategySection(
      brandId!,
      'competitive',
      updatedData,
      true
    )
  }

  const saveIndustryAnalysis = async (analysisData: any) => {
    if (!brand?.industry || !analysisData) return

    try {
      // Check if analysis already exists
      const { data: existingData, error: checkError } = await supabase
        .from('industry_suggestions')
        .select('id')
        .eq('industry', brand.industry)
        .eq('suggestion_type', 'analysis')
        .maybeSingle()
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('industry_suggestions')
          .update({ content: analysisData })
          .eq('id', existingData.id)
        
        if (updateError) throw updateError
      } else {
        // Insert new record with proper permissions
        const { error: insertError } = await supabase
          .from('industry_suggestions')
          .insert({
            industry: brand.industry,
            suggestion_type: 'analysis',
            content: analysisData,
            relevance: 5
          })
        
        if (insertError) throw insertError
      }
      
      setIndustryAnalysisData(analysisData)
      showToast('success', 'Industry analysis saved to database')
      
      // Save brand health score to update dashboard status
      await saveBrandHealthScore()
    } catch (error) {
      console.error('Error saving industry analysis:', error)
      showToast('error', 'Failed to save industry analysis')
    }
  }
  
  const saveBrandHealthScore = async () => {
    try {
      // Create a simple health score record to mark this section as completed
      const { error } = await supabase
        .from('brand_health_scores')
        .upsert({
          brand_id: brandId,
          overall_score: 75,
          completeness_score: 70,
          consistency_score: 80,
          uniqueness_score: 75,
          relevance_score: 75,
          details: {
            strengths: ['Industry analysis completed'],
            weaknesses: [],
            opportunities: []
          }
        })
      
      if (error) throw error
    } catch (error) {
      console.error('Error saving brand health score:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading brand health data...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'health', label: 'Brand Health', icon: Activity },
    { id: 'industry', label: 'Industry Analysis', icon: TrendingUp },
    { id: 'competitive', label: 'Competitive Analysis', icon: BarChart }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
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
            <h1 className="text-3xl font-bold text-gray-900">Brand Health</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analysis and insights for {brand?.name}
            </p>
          </div>
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
                `}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.label}</span>
                </div>
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
        {activeTab === 'health' && (
          <BrandHealthScore 
            brandId={brandId!} 
            brandName={brand?.name || ''}
          />
        )}

        {activeTab === 'industry' && brand?.industry && (
          <IndustryAnalysis 
            industry={brand.industry} 
            brandName={brand.name}
            initialData={industryAnalysisData}
            onSaveAnalysis={saveIndustryAnalysis}
          />
        )}

        {activeTab === 'competitive' && (
          <CompetitiveAnalysis
            industry={brand?.industry || 'technology'}
            brandName={brand?.name || ''}
            competitors={formData.competitive?.directCompetitors || []}
            onAddCompetitor={handleAddCompetitor}
            onRemoveCompetitor={handleRemoveCompetitor}
          />
        )}
      </motion.div>
    </div>
  )
}

export default BrandHealth