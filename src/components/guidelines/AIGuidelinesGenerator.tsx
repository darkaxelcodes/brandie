import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, RefreshCw, Target, Lightbulb, TrendingUp, FileText, Check, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AIButton } from '../ui/AIButton'
import { guidelinesService } from '../../lib/guidelinesService'

interface AIGuidelinesGeneratorProps {
  brandData: any
  guidelines: any
  onGuidelinesUpdate: (guidelines: any) => void
}

export const AIGuidelinesGenerator: React.FC<AIGuidelinesGeneratorProps> = ({
  brandData,
  guidelines,
  onGuidelinesUpdate
}) => {
  const [enhancing, setEnhancing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([])
  const [enhancementProgress, setEnhancementProgress] = useState<number>(0)
  const [enhancementComplete, setEnhancementComplete] = useState<boolean>(false)

  const enhancementOptions = [
    {
      id: 'accessibility',
      name: 'Accessibility Improvements',
      description: 'Enhance color contrast and readability guidelines',
      icon: Target,
      impact: 'High'
    },
    {
      id: 'applications',
      name: 'Application Examples',
      description: 'Generate real-world usage examples',
      icon: Lightbulb,
      impact: 'Medium'
    },
    {
      id: 'competitive',
      name: 'Competitive Analysis',
      description: 'Add competitive differentiation guidelines',
      icon: TrendingUp,
      impact: 'Medium'
    },
    {
      id: 'digital',
      name: 'Digital Guidelines',
      description: 'Specific guidelines for digital platforms',
      icon: Zap,
      impact: 'High'
    }
  ]

  const analyzeGuidelines = async () => {
    if (!brandData || !guidelines) return

    setAnalyzing(true)
    try {
      const analysis = await guidelinesService.analyzeGuidelines(brandData, guidelines)
      setAnalysisResults(analysis)
    } catch (error) {
      console.error('Error analyzing guidelines:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const enhanceGuidelines = async () => {
    if (!brandData || !guidelines || selectedEnhancements.length === 0) return

    setEnhancing(true)
    setEnhancementProgress(0)
    setEnhancementComplete(false)
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setEnhancementProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10) + 5
          return newProgress > 95 ? 95 : newProgress
        })
      }, 800)
      
      const enhancedGuidelines = await guidelinesService.enhanceGuidelines(
        brandData,
        guidelines,
        selectedEnhancements
      )
      
      clearInterval(progressInterval)
      setEnhancementProgress(100)
      setEnhancementComplete(true)
      
      // Update the guidelines with enhanced content
      onGuidelinesUpdate(enhancedGuidelines)
      
      // Reset selected enhancements after successful enhancement
      setTimeout(() => {
        setSelectedEnhancements([])
      }, 2000)
    } catch (error) {
      console.error('Error enhancing guidelines:', error)
    } finally {
      setEnhancing(false)
    }
  }

  const toggleEnhancement = (enhancementId: string) => {
    setSelectedEnhancements(prev =>
      prev.includes(enhancementId)
        ? prev.filter(id => id !== enhancementId)
        : [...prev, enhancementId]
    )
  }

  if (!guidelines) {
    return (
      <Card className="p-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-6">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          AI Enhancement Available
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Generate your brand guidelines first to access AI-powered enhancements and analysis.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              AI Guidelines Analysis
            </h3>
            <p className="text-gray-600 mt-1">
              Get AI-powered insights and recommendations for your brand guidelines
            </p>
          </div>
          <AIButton
            onClick={analyzeGuidelines}
            loading={analyzing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0"
          >
            <Brain className="w-4 h-4 mr-2" />
            Analyze Guidelines
          </AIButton>
        </div>

        {analyzing && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 text-purple-600">
              <Brain className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-medium">AI is analyzing your guidelines...</span>
            </div>
            <p className="text-gray-600 mt-2">Evaluating completeness, clarity, and effectiveness</p>
          </div>
        )}

        {analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
              <ul className="text-sm text-green-800 space-y-1">
                {analysisResults.strengths.map((strength: string, index: number) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Opportunities</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                {analysisResults.opportunities.map((opportunity: string, index: number) => (
                  <li key={index}>• {opportunity}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">AI Score</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">{analysisResults.score}/100</div>
              <p className="text-sm text-blue-800">
                {analysisResults.score >= 90 ? 'Excellent guidelines' : 
                 analysisResults.score >= 80 ? 'Good guidelines with room for enhancement' :
                 'Guidelines need improvement'}
              </p>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Enhancement Options */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">AI Enhancements</h3>
        <p className="text-gray-600 mb-6">
          Select enhancements to improve your brand guidelines with AI-generated content.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {enhancementOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                border-2 rounded-xl p-4 cursor-pointer transition-all
                ${selectedEnhancements.includes(option.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => toggleEnhancement(option.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg
                  ${selectedEnhancements.includes(option.id)
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                  }
                `}>
                  <option.icon className={`w-5 h-5 ${
                    selectedEnhancements.includes(option.id)
                      ? 'text-purple-600'
                      : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                    <span className={`
                      text-xs px-2 py-1 rounded font-medium
                      ${option.impact === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }
                    `}>
                      {option.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {enhancing && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Enhancing guidelines...</span>
              <span>{enhancementProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${enhancementProgress}%` }}
                className="bg-purple-600 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {enhancementComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Enhancement Complete!</span>
            </div>
            <p className="text-sm text-green-700">
              Your brand guidelines have been enhanced with AI-generated content.
            </p>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedEnhancements.length} enhancement{selectedEnhancements.length !== 1 ? 's' : ''} selected
          </div>
          <Button
            onClick={enhanceGuidelines}
            disabled={selectedEnhancements.length === 0 || enhancing}
            loading={enhancing}
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enhance Guidelines</span>
          </Button>
        </div>
      </Card>

      {/* AI Suggestions */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">AI Suggestions</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Accessibility Enhancement</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Your color palette has excellent contrast ratios. Consider adding specific guidelines 
                  for colorblind accessibility and WCAG compliance examples.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedEnhancements(['accessibility'])
                    enhanceGuidelines()
                  }}
                >
                  Apply Suggestion
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">Usage Examples</h4>
                <p className="text-sm text-green-800 mb-2">
                  Add real-world application examples showing your brand elements in use across 
                  business cards, websites, and social media.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedEnhancements(['applications'])
                    enhanceGuidelines()
                  }}
                >
                  Generate Examples
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Digital Guidelines</h4>
                <p className="text-sm text-purple-800 mb-2">
                  Expand your guidelines with specific rules for digital platforms, including 
                  responsive logo usage and social media specifications.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedEnhancements(['digital'])
                    enhanceGuidelines()
                  }}
                >
                  Add Digital Rules
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Enhanced Guidelines */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Export Enhanced Guidelines</h3>
              <p className="text-sm text-gray-700 mb-4">
                Download your AI-enhanced brand guidelines in your preferred format.
              </p>
            </div>
          </div>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setActiveTab('export')}
          >
            <Download className="w-4 h-4" />
            <span>Export Options</span>
          </Button>
        </div>
      </Card>

      {/* AI Enhancement Tips */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Enhancement Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• AI analyzes industry best practices for guidelines</li>
              <li>• Enhancements are based on your specific brand context</li>
              <li>• Each enhancement adds 3-5 pages of relevant content</li>
              <li>• AI suggestions consider accessibility and usability</li>
              <li>• Enhanced guidelines maintain your brand's unique voice</li>
              <li>• All AI content is reviewed and can be customized</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}