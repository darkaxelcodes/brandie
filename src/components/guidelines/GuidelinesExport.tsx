import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, Printer, FileText, Image, Globe, Mail, Link2, Check, Copy, Sparkles, Eye, Package } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AssetExportManager } from './AssetExportManager'
import { guidelinesService } from '../../lib/guidelinesService'

interface GuidelinesExportProps {
  brand: any
  guidelines: any
  brandData: any
}

export const GuidelinesExport: React.FC<GuidelinesExportProps> = ({
  brand,
  guidelines,
  brandData
}) => {
  const [exporting, setExporting] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'brandOverview', 'visualIdentity', 'brandVoice', 'usageGuidelines'
  ])
  const [exportSettings, setExportSettings] = useState({
    pageSize: 'a4',
    quality: 'high',
    includeExamples: true
  })
  const [activeTab, setActiveTab] = useState<'guidelines' | 'assets'>('guidelines')
  const previewRef = useRef<HTMLDivElement>(null)

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Complete guidelines as a PDF file',
      icon: FileText,
      size: '2.5 MB',
      recommended: true
    },
    {
      id: 'web',
      name: 'Web Guidelines',
      description: 'Interactive web-based guidelines',
      icon: Globe,
      size: 'Online',
      recommended: false
    },
    {
      id: 'presentation',
      name: 'Presentation',
      description: 'PowerPoint/Keynote presentation',
      icon: Image,
      size: '1.8 MB',
      recommended: false
    }
  ]

  const shareOptions = [
    {
      id: 'link',
      name: 'Share Link',
      description: 'Generate a shareable link',
      icon: Link2,
      action: 'generateLink'
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Send via email',
      icon: Mail,
      action: 'email'
    },
    {
      id: 'print',
      name: 'Print',
      description: 'Print guidelines',
      icon: Printer,
      action: 'print'
    }
  ]

  const sectionOptions = [
    { id: 'brandOverview', name: 'Brand Overview' },
    { id: 'audience', name: 'Target Audience' },
    { id: 'visualIdentity', name: 'Visual Identity' },
    { id: 'brandVoice', name: 'Brand Voice' },
    { id: 'usageGuidelines', name: 'Usage Guidelines' },
    { id: 'implementation', name: 'Implementation' }
  ]

  const handleExport = async (format: string) => {
    if (!guidelines || !brandData) return

    setExporting(format)
    try {
      // Create a customized version of the guidelines with only selected sections
      const customGuidelines = { ...guidelines }
      
      // Filter out unselected sections
      Object.keys(customGuidelines).forEach(key => {
        if (!selectedSections.includes(key) && key !== 'metadata') {
          delete customGuidelines[key]
        }
      })
      
      // Add export settings to metadata
      customGuidelines.metadata = {
        ...customGuidelines.metadata,
        exportSettings: {
          pageSize: exportSettings.pageSize,
          quality: exportSettings.quality,
          includeExamples: exportSettings.includeExamples,
          selectedSections
        }
      }
      
      await guidelinesService.exportGuidelines(brandData, customGuidelines, format)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setExporting(null)
    }
  }

  const handleShare = async (action: string) => {
    if (!guidelines || !brandData) return

    try {
      switch (action) {
        case 'generateLink':
          const url = await guidelinesService.generateShareableLink(brand.id, guidelines)
          setShareUrl(url)
          navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 3000)
          break
        case 'email':
          const emailBody = `Check out the brand guidelines for ${brand.name}: ${shareUrl || 'Link will be generated'}`
          window.open(`mailto:?subject=Brand Guidelines - ${brand.name}&body=${encodeURIComponent(emailBody)}`)
          break
        case 'print':
          window.print()
          break
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const updateExportSetting = (key: keyof typeof exportSettings, value: any) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!guidelines) {
    return (
      <Card className="p-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-6">
          <Download className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Guidelines to Export
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Generate your brand guidelines first to access export and sharing options.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="p-2">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`
              flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${activeTab === 'guidelines'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <FileText className="w-5 h-5" />
            <span>Guidelines Export</span>
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`
              flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${activeTab === 'assets'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <Package className="w-5 h-5" />
            <span>Asset Export</span>
          </button>
        </div>
      </Card>

      {activeTab === 'guidelines' ? (
        <>
          {/* Export Formats */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Export Guidelines</h3>
            <p className="text-gray-600 mb-6">
              Download your brand guidelines in various formats for different use cases.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {exportFormats.map((format) => (
                <motion.div
                  key={format.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    relative border-2 rounded-xl p-6 cursor-pointer transition-all hover:border-gray-300
                    ${format.recommended ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}
                  `}
                  onClick={() => handleExport(format.id)}
                >
                  {format.recommended && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Recommended
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-xl
                      ${format.recommended ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      <format.icon className={`w-6 h-6 ${
                        format.recommended ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{format.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{format.size}</span>
                        <Button
                          size="sm"
                          variant={format.recommended ? 'primary' : 'outline'}
                          loading={exporting === format.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExport(format.id)
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Share Options */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Guidelines</h3>
            <p className="text-gray-600 mb-6">
              Share your brand guidelines with team members, clients, or stakeholders.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {shareOptions.map((option) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleShare(option.action)}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-3">
                    <option.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </motion.div>
              ))}
            </div>

            {shareUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Shareable Link Generated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 3000)
                    }}
                    className="flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Custom Export Options */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Export</h3>
            <p className="text-gray-600 mb-6">
              Customize what to include in your brand guidelines export.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sections to Include</h4>
                <div className="space-y-2">
                  {sectionOptions.map((section) => (
                    <label key={section.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={selectedSections.includes(section.id)} 
                        onChange={() => toggleSection(section.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{section.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Export Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Size
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={exportSettings.pageSize}
                      onChange={(e) => updateExportSetting('pageSize', e.target.value)}
                    >
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="letter">Letter (8.5 × 11 in)</option>
                      <option value="legal">Legal (8.5 × 14 in)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quality
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={exportSettings.quality}
                      onChange={(e) => updateExportSetting('quality', e.target.value)}
                    >
                      <option value="high">High (Print Ready)</option>
                      <option value="medium">Medium (Web)</option>
                      <option value="low">Low (Preview)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={exportSettings.includeExamples} 
                        onChange={(e) => updateExportSetting('includeExamples', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Include usage examples</span>
                    </label>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleExport(selectedFormat)}
                    loading={exporting === 'custom'}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Custom Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Export Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Export Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('web')}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Full Preview</span>
              </Button>
            </div>
            
            <div ref={previewRef} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{brand.name}</h1>
                <p className="text-gray-600">Brand Guidelines</p>
                <p className="text-sm text-gray-500">Version {guidelines.metadata?.version || '1.0'}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Brand Overview
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Mission</h3>
                    <p className="text-gray-700">{guidelines.brandOverview?.mission || 'Not defined'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Core Values</h3>
                    <div className="flex flex-wrap gap-2">
                      {guidelines.brandOverview?.values?.map((value: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Visual Identity
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Color Palette</h3>
                    <div className="flex space-x-2">
                      {brandData.visual?.colors?.colors?.slice(0, 4).map((color: string, index: number) => (
                        <div 
                          key={index}
                          className="w-8 h-8 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Typography</h3>
                    <p className="text-sm text-gray-700">
                      <strong>Heading:</strong> {brandData.visual?.typography?.heading?.family || 'Not defined'}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Body:</strong> {brandData.visual?.typography?.body?.family || 'Not defined'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Brand Voice
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tone</h3>
                    <p className="text-gray-700 capitalize">
                      {guidelinesService.getToneDescription(guidelines.brandVoice?.toneScales)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Key Message</h3>
                    <p className="text-gray-700">
                      {guidelines.brandVoice?.messaging?.tagline || 'Not defined'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} {brand.name}. All rights reserved.
                </p>
              </div>
            </div>
          </Card>

          {/* AI Enhancement */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Export Enhancement</h3>
                <p className="text-gray-700 mb-4">
                  Our AI can enhance your exports with additional content and optimizations.
                </p>
                <Button className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Enhance Export with AI</span>
                </Button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <AssetExportManager brandData={brandData} guidelines={guidelines} />
      )}
    </div>
  )
}