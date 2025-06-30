import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Users, AlertCircle, Lightbulb, Zap, 
  BarChart, RefreshCw, Download, ChevronDown, ChevronUp
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { AIButton } from '../ui/AIButton'
import { generateIndustryAnalysis } from '../../lib/openai'
import { useTokens } from '../../contexts/TokenContext'
import { supabase } from '../../lib/supabase'

interface IndustryAnalysisProps {
  industry: string
  brandName: string
  initialData?: any
  onSaveAnalysis?: (data: any) => Promise<void>
}

export const IndustryAnalysis: React.FC<IndustryAnalysisProps> = ({
  industry,
  brandName,
  initialData = null,
  onSaveAnalysis
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'competitors' | 'audience' | 'challenges' | 'opportunities'>('trends')
  const [analysisData, setAnalysisData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({
    trends: false,
    competitors: false,
    audience: false,
    challenges: false,
    opportunities: false
  })
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const { useToken } = useTokens()

  useEffect(() => {
    // Load initial data if provided
    if (initialData) {
      setAnalysisData(initialData)
    } else {
      // Load initial trends data
      loadAnalysis('trends')
    }
  }, [industry, initialData])

  const loadAnalysis = async (type: 'trends' | 'competitors' | 'audience' | 'challenges' | 'opportunities') => {
    if (loading[type]) return

    setLoading(prev => ({ ...prev, [type]: true }))
    try {
      // Use a token for this action
      const success = await useToken('ai_industry_analysis', `Generate ${type} analysis for ${industry} industry`)
      
      if (!success) {
        throw new Error('Failed to use token')
      }
      
      const response = await generateIndustryAnalysis(industry, type)
      
      // Update the analysis data
      const updatedData = { 
        ...analysisData, 
        [type]: response.suggestions 
      }
      
      setAnalysisData(updatedData)
      
      // Save the analysis data if callback provided
      if (onSaveAnalysis) {
        await onSaveAnalysis(updatedData)
      } else {
        // If no callback is provided, try to save directly
        await saveAnalysisToDatabase(updatedData)
      }
    } catch (error) {
      console.error(`Error loading ${type} analysis:`, error)
      // Set fallback data
      setAnalysisData(prev => ({ 
        ...prev, 
        [type]: getFallbackData(type)
      }))
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  const saveAnalysisToDatabase = async (data: any) => {
    if (!industry) return
    
    try {
      // Check if analysis already exists
      const { data: existingData, error: checkError } = await supabase
        .from('industry_suggestions')
        .select('id')
        .eq('industry', industry)
        .eq('suggestion_type', 'analysis')
        .maybeSingle()
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('industry_suggestions')
          .update({ content: data })
          .eq('id', existingData.id)
        
        if (updateError) throw updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('industry_suggestions')
          .insert({
            industry: industry,
            suggestion_type: 'analysis',
            content: data,
            relevance: 5
          })
        
        if (insertError) throw insertError
      }
    } catch (error) {
      console.error('Error saving industry analysis:', error)
    }
  }

  const getFallbackData = (type: string): string[] => {
    const fallbacks: Record<string, string[]> = {
      trends: [
        'Increasing focus on digital transformation and automation',
        'Growing emphasis on sustainability and ethical practices',
        'Rising importance of personalized customer experiences',
        'Shift towards remote and hybrid work models',
        'Greater integration of AI and machine learning technologies'
      ],
      competitors: [
        'Large established players dominating market share',
        'Innovative startups disrupting traditional business models',
        'International competitors entering local markets',
        'Indirect competitors offering alternative solutions',
        'Industry consolidation through mergers and acquisitions'
      ],
      audience: [
        'Increasingly tech-savvy customers expecting digital solutions',
        'Growing preference for brands with strong values alignment',
        'Higher expectations for personalized experiences',
        'More research-driven purchase decisions',
        'Desire for transparent and authentic brand communications'
      ],
      challenges: [
        'Rapidly evolving technology landscape requiring constant adaptation',
        'Increasing regulatory requirements and compliance costs',
        'Difficulty attracting and retaining skilled talent',
        'Growing customer acquisition costs',
        'Pressure to demonstrate environmental and social responsibility'
      ],
      opportunities: [
        'Leveraging data analytics for deeper customer insights',
        'Developing innovative solutions to address emerging needs',
        'Creating strategic partnerships to expand capabilities',
        'Focusing on underserved market segments',
        'Building community and loyalty through authentic engagement'
      ]
    }
    
    return fallbacks[type] || ['No data available']
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'trends': return <TrendingUp className="w-5 h-5" />
      case 'competitors': return <BarChart className="w-5 h-5" />
      case 'audience': return <Users className="w-5 h-5" />
      case 'challenges': return <AlertCircle className="w-5 h-5" />
      case 'opportunities': return <Lightbulb className="w-5 h-5" />
      default: return <TrendingUp className="w-5 h-5" />
    }
  }

  const handleTabChange = (tab: 'trends' | 'competitors' | 'audience' | 'challenges' | 'opportunities') => {
    setActiveTab(tab)
    if (!analysisData[tab]) {
      loadAnalysis(tab)
    }
  }

  const exportAnalysis = () => {
    const content = Object.entries(analysisData).map(([key, value]) => {
      return `# ${key.toUpperCase()}\n\n${(value as string[]).map(item => `- ${item}`).join('\n')}\n\n`
    }).join('\n')
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName}-${industry}-industry-analysis.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-purple-600" />
            Industry Analysis
          </h3>
          <p className="text-gray-600 mt-1">
            AI-powered insights for the {industry.replace('_', ' ')} industry
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={exportAnalysis}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['trends', 'competitors', 'audience', 'challenges', 'opportunities'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'outline'}
            onClick={() => handleTabChange(tab as any)}
            className="flex items-center space-x-2"
          >
            {getTabIcon(tab)}
            <span className="capitalize">{tab}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="mb-6">
        {loading[activeTab] ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading {activeTab} analysis...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisData[activeTab]?.map((item: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div 
                  className="flex items-start cursor-pointer"
                  onClick={() => toggleSection(`${activeTab}-${index}`)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getTabIcon(activeTab)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-gray-800">
                      {item.length > 100 && !expandedSections[`${activeTab}-${index}`]
                        ? `${item.substring(0, 100)}...`
                        : item
                      }
                    </p>
                    {item.length > 100 && (
                      <button className="text-purple-600 text-sm flex items-center mt-1">
                        {expandedSections[`${activeTab}-${index}`] ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            <span>Show less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            <span>Read more</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <AIButton
          onClick={() => loadAnalysis(activeTab)}
          loading={loading[activeTab]}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          actionType="ai_industry_analysis"
          actionDescription={`Generate ${activeTab} analysis for ${industry} industry`}
        >
          Refresh {activeTab} Analysis
        </AIButton>
      </div>
    </Card>
  )
}