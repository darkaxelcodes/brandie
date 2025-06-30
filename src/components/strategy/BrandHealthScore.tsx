import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, TrendingUp, CheckCircle, AlertTriangle, 
  Zap, Download, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { brandHealthService } from '../../lib/brandHealthService'
import { BrandHealth } from '../../types/brand'

interface BrandHealthScoreProps {
  brandId: string
  brandName: string
}

export const BrandHealthScore: React.FC<BrandHealthScoreProps> = ({
  brandId,
  brandName
}) => {
  const [healthData, setHealthData] = useState<BrandHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [previousScore, setPreviousScore] = useState<number | null>(null)

  useEffect(() => {
    loadHealthData()
  }, [brandId])

  const loadHealthData = async () => {
    try {
      setLoading(true)
      const data = await brandHealthService.calculateBrandHealth(brandId)
      
      // Store previous score for comparison
      if (healthData) {
        setPreviousScore(healthData.overall_score)
      }
      
      setHealthData(data)
      
      // Save the health score to the database
      await brandHealthService.saveBrandHealthScore(brandId, data)
    } catch (error) {
      console.error('Error loading brand health data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshHealthData = async () => {
    try {
      setRefreshing(true)
      await loadHealthData()
    } finally {
      setRefreshing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreChange = () => {
    if (previousScore === null || healthData === null) return null
    
    const change = healthData.overall_score - previousScore
    return {
      value: change,
      isPositive: change > 0,
      isNegative: change < 0
    }
  }

  const scoreChange = getScoreChange()

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Brand Health Score</h3>
        </div>
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Card>
    )
  }

  if (!healthData) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Brand Health Score</h3>
        </div>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Unable to calculate brand health score</p>
          <Button onClick={refreshHealthData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Brand Health Score</h3>
            <p className="text-sm text-gray-600">Comprehensive analysis of {brandName}'s brand strength</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshHealthData}
            loading={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Export health data as JSON
              const blob = new Blob([JSON.stringify(healthData, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${brandName}-health-score.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl mb-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Overall Brand Health</h4>
          <p className="text-sm text-gray-600">Composite score based on multiple factors</p>
        </div>
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(healthData.overall_score)}`}>
            {healthData.overall_score}
          </div>
          <div className="text-sm text-gray-600">
            {getScoreLabel(healthData.overall_score)}
          </div>
          {scoreChange && (
            <div className={`text-sm flex items-center mt-1 ${
              scoreChange.isPositive ? 'text-green-600' : 
              scoreChange.isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {scoreChange.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : scoreChange.isNegative ? (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              ) : null}
              <span>{scoreChange.value > 0 ? '+' : ''}{scoreChange.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${getScoreBackgroundColor(healthData.completeness_score)}`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900">Completeness</h5>
            <span className={`font-bold ${getScoreColor(healthData.completeness_score)}`}>
              {healthData.completeness_score}%
            </span>
          </div>
          <p className="text-xs text-gray-700">How complete your brand elements are</p>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBackgroundColor(healthData.consistency_score)}`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900">Consistency</h5>
            <span className={`font-bold ${getScoreColor(healthData.consistency_score)}`}>
              {healthData.consistency_score}%
            </span>
          </div>
          <p className="text-xs text-gray-700">How consistent your brand application is</p>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBackgroundColor(healthData.uniqueness_score)}`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900">Uniqueness</h5>
            <span className={`font-bold ${getScoreColor(healthData.uniqueness_score)}`}>
              {healthData.uniqueness_score}%
            </span>
          </div>
          <p className="text-xs text-gray-700">How distinctive your brand is</p>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBackgroundColor(healthData.relevance_score)}`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900">Relevance</h5>
            <span className={`font-bold ${getScoreColor(healthData.relevance_score)}`}>
              {healthData.relevance_score}%
            </span>
          </div>
          <p className="text-xs text-gray-700">How relevant your brand is to your audience</p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Strengths
          </h4>
          {healthData.details.strengths.length > 0 ? (
            <div className="space-y-2">
              {healthData.details.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <p className="text-sm text-green-800">{strength}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No strengths identified yet</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            Weaknesses
          </h4>
          {healthData.details.weaknesses.length > 0 ? (
            <div className="space-y-2">
              {healthData.details.weaknesses.map((weakness, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <p className="text-sm text-red-800">{weakness}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No weaknesses identified</p>
          )}
        </div>

        {/* Opportunities */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Zap className="w-4 h-4 text-yellow-600 mr-2" />
            Opportunities
          </h4>
          {healthData.details.opportunities.length > 0 ? (
            <div className="space-y-2">
              {healthData.details.opportunities.map((opportunity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <p className="text-sm text-yellow-800">{opportunity}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No opportunities identified yet</p>
          )}
        </div>
      </div>
    </Card>
  )
}