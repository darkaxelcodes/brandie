import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, TrendingUp, Search, Plus, X, 
  Download, RefreshCw, ExternalLink, Edit
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { industryService } from '../../lib/industryService'

interface CompetitiveAnalysisProps {
  industry: string
  brandName: string
  competitors: string[]
  onAddCompetitor: (competitor: string) => void
  onRemoveCompetitor: (competitor: string) => void
}

interface Competitor {
  name: string
  strengths: string[]
  weaknesses: string[]
  positioning: string
  marketShare?: number
  website?: string
}

export const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({
  industry,
  brandName,
  competitors,
  onAddCompetitor,
  onRemoveCompetitor
}) => {
  const [newCompetitor, setNewCompetitor] = useState('')
  const [competitorData, setCompetitorData] = useState<Record<string, Competitor>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCompetitor, setEditingCompetitor] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Competitor>>({})

  useEffect(() => {
    loadCompetitorData()
  }, [industry, competitors])

  const loadCompetitorData = async () => {
    try {
      setLoading(true)
      
      // Get industry-specific competitor data
      const industryCompetitors = await industryService.getIndustryCompetitors(industry)
      
      // Create competitor data object
      const data: Record<string, Competitor> = {}
      
      // Add industry competitors
      if (industryCompetitors && industryCompetitors.competitors) {
        industryCompetitors.competitors.forEach((comp: Competitor) => {
          data[comp.name] = comp
        })
      }
      
      // Add user-specified competitors with mock data if not already present
      competitors.forEach(competitor => {
        if (!data[competitor]) {
          data[competitor] = {
            name: competitor,
            strengths: generateMockStrengths(competitor, industry),
            weaknesses: generateMockWeaknesses(competitor, industry),
            positioning: generateMockPositioning(competitor, industry)
          }
        }
      })
      
      setCompetitorData(data)
    } catch (error) {
      console.error('Error loading competitor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockStrengths = (competitor: string, industry: string): string[] => {
    const industryStrengths: Record<string, string[]> = {
      technology: [
        'Strong technical innovation',
        'Robust product ecosystem',
        'Excellent user experience',
        'Strong brand recognition'
      ],
      healthcare: [
        'High-quality patient care',
        'Advanced medical technology',
        'Experienced medical staff',
        'Strong community reputation'
      ],
      finance: [
        'Robust security measures',
        'Comprehensive service offerings',
        'Strong customer trust',
        'Innovative financial products'
      ]
    }
    
    const defaultStrengths = [
      'Established market presence',
      'Strong customer loyalty',
      'Effective marketing strategy',
      'Quality product/service offering'
    ]
    
    const strengths = industryStrengths[industry] || defaultStrengths
    return strengths.slice(0, 2 + Math.floor(Math.random() * 3)) // Return 2-4 strengths
  }

  const generateMockWeaknesses = (competitor: string, industry: string): string[] => {
    const industryWeaknesses: Record<string, string[]> = {
      technology: [
        'High product pricing',
        'Limited customer support',
        'Complex user interfaces',
        'Slow update cycles'
      ],
      healthcare: [
        'Long wait times',
        'High service costs',
        'Limited locations',
        'Outdated facilities'
      ],
      finance: [
        'High fees and charges',
        'Limited digital capabilities',
        'Poor customer service',
        'Complex product structures'
      ]
    }
    
    const defaultWeaknesses = [
      'Limited market reach',
      'Inconsistent customer experience',
      'Outdated technology',
      'Weak online presence'
    ]
    
    const weaknesses = industryWeaknesses[industry] || defaultWeaknesses
    return weaknesses.slice(0, 2 + Math.floor(Math.random() * 3)) // Return 2-4 weaknesses
  }

  const generateMockPositioning = (competitor: string, industry: string): string => {
    const industryPositioning: Record<string, string[]> = {
      technology: [
        'Premium innovation leader',
        'Affordable technology provider',
        'Enterprise solution specialist',
        'Consumer technology pioneer'
      ],
      healthcare: [
        'Premium specialized care provider',
        'Accessible healthcare for all',
        'Innovative medical solutions',
        'Community-focused healthcare'
      ],
      finance: [
        'Premium wealth management',
        'Accessible banking for everyone',
        'Digital financial innovation',
        'Personalized financial guidance'
      ]
    }
    
    const defaultPositioning = [
      'Market leader',
      'Value-focused provider',
      'Premium service specialist',
      'Innovative disruptor'
    ]
    
    const positionings = industryPositioning[industry] || defaultPositioning
    return positionings[Math.floor(Math.random() * positionings.length)]
  }

  const handleAddCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      onAddCompetitor(newCompetitor.trim())
      setNewCompetitor('')
    }
  }

  const filteredCompetitors = competitors.filter(competitor => 
    competitor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startEditing = (competitor: string) => {
    setEditingCompetitor(competitor)
    setEditData(competitorData[competitor] || {})
  }

  const saveEdits = () => {
    if (!editingCompetitor) return
    
    setCompetitorData(prev => ({
      ...prev,
      [editingCompetitor]: {
        ...prev[editingCompetitor],
        ...editData
      }
    }))
    
    setEditingCompetitor(null)
    setEditData({})
  }

  const exportCompetitorAnalysis = () => {
    const content = Object.values(competitorData)
      .filter(comp => competitors.includes(comp.name))
      .map(comp => {
        return `# ${comp.name}\n\nPositioning: ${comp.positioning}\n\n## Strengths\n${comp.strengths.map(s => `- ${s}`).join('\n')}\n\n## Weaknesses\n${comp.weaknesses.map(w => `- ${w}`).join('\n')}\n\n`
      }).join('\n---\n\n')
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName}-competitor-analysis.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart className="w-6 h-6 text-blue-600" />
            Competitive Analysis
          </h3>
          <p className="text-gray-600 mt-1">
            Track and analyze {brandName}'s competitors
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={exportCompetitorAnalysis}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={loadCompetitorData}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Add Competitor */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Input
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            placeholder="Add a competitor..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddCompetitor()}
            className="flex-1"
          />
          <Button onClick={handleAddCompetitor}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Search */}
      {competitors.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitors..."
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Competitor List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading competitor data...</p>
        </div>
      ) : filteredCompetitors.length === 0 ? (
        <div className="text-center py-12">
          <BarChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No competitors added</h4>
          <p className="text-gray-500 mb-4">
            Add competitors to analyze your market position
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCompetitors.map((competitor) => {
            const compData = competitorData[competitor]
            
            if (editingCompetitor === competitor) {
              return (
                <motion.div
                  key={competitor}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Positioning
                    </label>
                    <Input
                      value={editData.positioning || ''}
                      onChange={(e) => setEditData({ ...editData, positioning: e.target.value })}
                      placeholder="Competitor positioning..."
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Strengths (comma separated)
                      </label>
                      <textarea
                        value={(editData.strengths || []).join(', ')}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          strengths: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        placeholder="Strengths..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weaknesses (comma separated)
                      </label>
                      <textarea
                        value={(editData.weaknesses || []).join(', ')}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          weaknesses: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        placeholder="Weaknesses..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingCompetitor(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveEdits}>
                      Save Changes
                    </Button>
                  </div>
                </motion.div>
              )
            }
            
            return (
              <motion.div
                key={competitor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{competitor}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(competitor)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCompetitor(competitor)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {compData ? (
                  <>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Positioning:</span>
                      <p className="text-sm text-gray-600 mt-1">{compData.positioning}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Strengths</h5>
                        <ul className="space-y-1">
                          {compData.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Weaknesses</h5>
                        <ul className="space-y-1">
                          {compData.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {compData.website && (
                      <div className="mt-4 text-right">
                        <a
                          href={compData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end"
                        >
                          <span>Visit website</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No data available for this competitor</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </Card>
  )
}