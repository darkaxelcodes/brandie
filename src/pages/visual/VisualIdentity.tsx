import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Palette, Type, Image, Save, Sparkles, Brain, Zap, Eye, Download, HelpCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ModeToggle } from '../../components/ui/ModeToggle'
import { brandService } from '../../lib/brandService'
import { visualService } from '../../lib/visualService'
import { Brand, VisualAsset } from '../../types/visual'
import { AILogoGenerator } from '../../components/visual/AILogoGenerator'
import { AIColorPaletteGenerator } from '../../components/visual/AIColorPaletteGenerator'
import { AITypographyGenerator } from '../../components/visual/AITypographyGenerator'
import { AIPilotVisual } from '../../components/visual/AIPilotVisual'
import { TourButton } from '../../components/ui/TourButton'
import { useToast } from '../../contexts/ToastContext'

export const VisualIdentity: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'typography'>('logo')
  const [mode, setMode] = useState<'manual' | 'ai-pilot'>('manual')
  const [visualAssets, setVisualAssets] = useState<VisualAsset[]>([])
  const [brandStrategy, setBrandStrategy] = useState<any>(null)
  const [selectedLogo, setSelectedLogo] = useState<any>(null)
  const [selectedPalette, setSelectedPalette] = useState<any>(null)
  const [selectedTypography, setSelectedTypography] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [brand, setBrand] = useState<Brand | null>(null)

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
      const [brandData, assets, strategyData] = await Promise.all([
        brandService.getBrand(brandId!),
        visualService.getVisualAssets(brandId!),
        brandService.getStrategyFormData(brandId!)
      ])

      if (!brandData) {
        navigate('/dashboard')
        return
      }

      setBrand(brandData)
      setVisualAssets(assets)
      setBrandStrategy(strategyData)

      // Load existing selections
      const logoAsset = assets.find(a => a.asset_type === 'logo')
      const colorAsset = assets.find(a => a.asset_type === 'color_palette')
      const typographyAsset = assets.find(a => a.asset_type === 'typography')

      if (logoAsset) setSelectedLogo(logoAsset.asset_data)
      if (colorAsset) setSelectedPalette(colorAsset.asset_data)
      if (typographyAsset) setSelectedTypography(typographyAsset.asset_data)
    } catch (error) {
      console.error('Error loading visual data:', error)
      showToast('error', 'Failed to load visual identity data')
    } finally {
      setLoading(false)
    }
  }

  const saveAsset = async (assetType: 'logo' | 'color_palette' | 'typography', data: any) => {
    if (!brandId) return

    try {
      setSaving(true)
      await visualService.saveVisualAsset(brandId, assetType, data)
      await loadData() // Reload to get updated data
      showToast('success', 'Visual asset saved successfully')
    } catch (error) {
      console.error('Error saving visual asset:', error)
      showToast('error', 'Failed to save visual asset')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoGenerated = async (logoData: any) => {
    setSelectedLogo(logoData)
    await saveAsset('logo', logoData)
  }

  const handlePaletteGenerated = async (paletteData: any) => {
    setSelectedPalette(paletteData)
    await saveAsset('color_palette', paletteData)
  }

  const handleTypographySelected = async (typographyData: any) => {
    setSelectedTypography(typographyData)
    await saveAsset('typography', typographyData)
  }

  const handleAIPilotComplete = async (data: any) => {
    const assetType = data.type === 'logo' ? 'logo' : 
                    data.type === 'colors' ? 'color_palette' : 'typography'
    
    await saveAsset(assetType, data)
    setMode('manual') // Switch back to manual to show results
  }

  const getCompletionPercentage = () => {
    let completed = 0
    if (selectedLogo) completed += 33
    if (selectedPalette) completed += 33
    if (selectedTypography) completed += 34
    return completed
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI visual identity tools...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { 
      id: 'logo', 
      label: 'AI Logo Design', 
      icon: Image,
      description: 'DALL-E powered logo generation'
    },
    { 
      id: 'colors', 
      label: 'AI Color Intelligence', 
      icon: Palette,
      description: 'Psychology-based color palettes'
    },
    { 
      id: 'typography', 
      label: 'AI Typography', 
      icon: Type,
      description: 'Science-backed font pairings'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 visual-header"
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
              AI Visual Identity
            </h1>
            <p className="text-gray-600 mt-1">
              Create stunning visual elements for {brand?.name} using advanced AI
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <TourButton tourId="visual" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Visual Progress</div>
              <div className="text-lg font-semibold text-blue-600">
                {getCompletionPercentage()}%
              </div>
            </div>
            <Button
              variant="outline"
              loading={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Auto-saving</span>
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
                  ? 'AI Ready - Strategy Complete!' 
                  : 'Enhance AI Results'
                }
              </h3>
              <p className="text-gray-600">
                {getStrategyCompleteness() >= 80 
                  ? 'Your brand strategy is complete. AI will generate highly personalized visual elements.'
                  : `Complete your brand strategy (${getStrategyCompleteness()}%) for better AI suggestions.`
                }
              </p>
            </div>
            {getStrategyCompleteness() < 80 && (
              <Button
                variant="outline"
                onClick={() => navigate(`/brand/${brandId}/strategy`)}
                className="flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Complete Strategy</span>
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Progress Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Strategy Completeness</span>
              <span>{getStrategyCompleteness()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getStrategyCompleteness()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-blue-600 h-2 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Visual Identity Progress</span>
              <span>{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionPercentage()}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="bg-green-600 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI-Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 visual-tabs"
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
                  {/* AI Badge */}
                  <div className={`w-2 h-2 rounded-full ${
                    activeTab === tab.id ? 'bg-white' : 'bg-blue-500'
                  }`} />
                </div>
                <span className={`text-xs ${
                  activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {tab.description}
                </span>
                {/* Completion indicator */}
                {((tab.id === 'logo' && selectedLogo) ||
                  (tab.id === 'colors' && selectedPalette) ||
                  (tab.id === 'typography' && selectedTypography)) && (
                  <div className={`w-2 h-2 rounded-full ${
                    activeTab === tab.id ? 'bg-green-300' : 'bg-green-500'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Choose Your Approach</h3>
              <p className="text-sm text-gray-600">
                {mode === 'manual' 
                  ? 'Browse and select from AI-generated options'
                  : 'Let AI guide you through personalized questions'
                }
              </p>
            </div>
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </Card>
      </motion.div>

      {/* AI-Powered Content */}
      <motion.div
        key={`${activeTab}-${mode}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="ai-generator"
      >
        {mode === 'ai-pilot' ? (
          <AIPilotVisual
            brandName={brand?.name || ''}
            onComplete={handleAIPilotComplete}
            strategyContext={brandStrategy}
            visualType={activeTab}
          />
        ) : (
          <>
            {activeTab === 'logo' && (
              <AILogoGenerator
                brandName={brand?.name || ''}
                brandStrategy={brandStrategy}
                onLogoGenerated={handleLogoGenerated}
                selectedLogo={selectedLogo}
              />
            )}

            {activeTab === 'colors' && (
              <AIColorPaletteGenerator
                brandName={brand?.name || ''}
                brandStrategy={brandStrategy}
                onPaletteGenerated={handlePaletteGenerated}
                selectedPalette={selectedPalette}
              />
            )}

            {activeTab === 'typography' && (
              <AITypographyGenerator
                brandName={brand?.name || ''}
                brandStrategy={brandStrategy}
                selectedTypography={selectedTypography}
                onTypographySelected={handleTypographySelected}
                brandContent={{
                  tagline: brandStrategy?.purpose?.mission,
                  description: brandStrategy?.values?.positioning,
                  sampleText: brandStrategy?.audience?.primaryAudience
                }}
              />
            )}
          </>
        )}
      </motion.div>

      {/* AI-Enhanced Summary */}
      {(selectedLogo || selectedPalette || selectedTypography) && mode === 'manual' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI Visual Identity Summary
              </h3>
              <div className="text-sm text-blue-700">
                {getCompletionPercentage()}% Complete
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {selectedLogo && (
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Image className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">AI Logo</h4>
                  <p className="text-sm text-gray-600">{selectedLogo.style || 'Custom Design'}</p>
                  {selectedLogo.aiGenerated && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mt-1 inline-block">
                      AI Generated
                    </span>
                  )}
                </div>
              )}
              
              {selectedPalette && (
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="flex justify-center mb-3">
                    {selectedPalette.colors?.slice(0, 4).map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: color, marginLeft: index > 0 ? '-4px' : '0' }}
                      />
                    ))}
                  </div>
                  <h4 className="font-medium text-gray-900">AI Colors</h4>
                  <p className="text-sm text-gray-600">{selectedPalette.name || 'Custom Palette'}</p>
                  {selectedPalette.aiGenerated && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 inline-block">
                      AI Generated
                    </span>
                  )}
                </div>
              )}
              
              {selectedTypography && (
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Type className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">AI Typography</h4>
                  <p className="text-sm text-gray-600">{selectedTypography.name || 'Custom Fonts'}</p>
                  {selectedTypography.aiGenerated && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1 inline-block">
                      AI Generated
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-blue-200">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Brand Guidelines
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}