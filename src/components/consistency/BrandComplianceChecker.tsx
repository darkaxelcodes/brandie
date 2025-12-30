import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Upload, FileText, Sparkles, RefreshCw, Check, X, Info } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { consistencyService } from '../../lib/consistencyService'
import { useToast } from '../../contexts/ToastContext'

interface BrandComplianceCheckerProps {
  brandData: any
}

export const BrandComplianceChecker: React.FC<BrandComplianceCheckerProps> = ({
  brandData
}) => {
  const { showToast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<any>(null)
  const [fileType, setFileType] = useState<string>('')
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload')

  // Early return if brandData is null or undefined
  if (!brandData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Loading brand data...</h4>
            <p className="text-gray-500">
              Please wait while we load your brand information
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileType(selectedFile.type)
    
    // Read file content
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        // For text files, try to parse as JSON
        if (selectedFile.type.includes('text') || selectedFile.type.includes('json')) {
          try {
            const content = JSON.parse(event.target?.result as string)
            setFileContent(content)
          } catch {
            // If not valid JSON, treat as plain text
            setFileContent({ text: event.target?.result })
          }
        } else if (selectedFile.type.includes('image')) {
          // For images, store the data URL
          setFileContent({ imageUrl: event.target?.result })
        } else {
          // For other files, store basic info
          setFileContent({ 
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size
          })
        }
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }
    
    if (selectedFile.type.includes('text') || selectedFile.type.includes('json')) {
      reader.readAsText(selectedFile)
    } else if (selectedFile.type.includes('image')) {
      reader.readAsDataURL(selectedFile)
    } else {
      reader.readAsArrayBuffer(selectedFile)
    }
  }

  const checkCompliance = async () => {
    if (!fileContent) return
    
    setChecking(true)
    try {
      // Extract relevant data from file content
      const assetToCheck: any = {}
      
      // For images, check colors and logo usage
      if (fileType.includes('image') && fileContent.imageUrl) {
        // Note: Image analysis is not yet implemented
        // Future implementation will extract colors and analyze logo usage
        showToast('info', 'Image analysis coming soon! For now, checking basic properties only.')
        assetToCheck.colors = brandData?.visual?.colors?.colors || []
        assetToCheck.logo = brandData?.visual?.logo || {}
      }
      
      // For text files, check voice and messaging
      if (fileContent.text) {
        assetToCheck.text = fileContent.text
      }
      
      // For JSON files with design data
      if (fileContent.colors || fileContent.typography) {
        assetToCheck.colors = fileContent.colors
        assetToCheck.typography = fileContent.typography
      }
      
      const checkResults = await consistencyService.checkConsistency(brandData, assetToCheck)
      setResults(checkResults)
      setActiveTab('results')
    } catch (error) {
      console.error('Error checking compliance:', error)
    } finally {
      setChecking(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <X className="w-5 h-5 text-red-600" />
      case 'medium': return <AlertCircle className="w-5 h-5 text-amber-600" />
      case 'low': return <Info className="w-5 h-5 text-blue-600" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Brand Compliance Checker
            </h3>
            <p className="text-gray-600 mt-1">
              Verify if your marketing materials follow brand guidelines
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'upload' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </Button>
            <Button
              variant={activeTab === 'results' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('results')}
              disabled={!results}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Results</span>
            </Button>
          </div>
        </div>

        {activeTab === 'upload' ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/json,text/plain,text/html,application/pdf"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-1">
                  Upload a file to check
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Select File
                </Button>
              </label>
            </div>

            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">{file.name}</p>
                      <p className="text-sm text-blue-700">
                        {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={checkCompliance}
                    loading={checking}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Check Compliance</span>
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Supported File Types</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="font-medium">Images</p>
                  <p className="text-gray-500">JPG, PNG, SVG</p>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="font-medium">Documents</p>
                  <p className="text-gray-500">PDF, DOCX</p>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="font-medium">Web</p>
                  <p className="text-gray-500">HTML, CSS</p>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="font-medium">Design</p>
                  <p className="text-gray-500">JSON, Sketch</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {results && (
              <>
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Compliance Score</h4>
                    <p className="text-sm text-gray-600">
                      Based on brand guidelines alignment
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(results.score)}`}>
                      {results.score}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {results.score >= 90 ? 'Excellent' : 
                       results.score >= 70 ? 'Good' : 
                       results.score >= 50 ? 'Needs Improvement' : 
                       'Poor'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Issues Found</h4>
                  {results.issues.length === 0 ? (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="font-medium text-green-900">No issues found!</p>
                      </div>
                      <p className="text-sm text-green-700 mt-1 ml-7">
                        This file follows all brand guidelines perfectly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {results.issues.map((issue: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-start space-x-3">
                            {getSeverityIcon(issue.severity)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900">{issue.description}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-medium
                                  ${issue.severity === 'high' ? 'bg-red-100 text-red-800' : 
                                    issue.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                                    'bg-blue-100 text-blue-800'}`}
                                >
                                  {issue.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{issue.recommendation}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <ul className="space-y-2">
                      {results.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-blue-800">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('upload')}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Another File</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null)
                      setFileContent(null)
                      setResults(null)
                      setActiveTab('upload')
                    }}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Start Over</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* AI Enhancement */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Compliance Enhancement</h3>
            <p className="text-gray-700 mb-4">
              Let AI analyze your marketing materials and automatically fix brand compliance issues.
            </p>
            <Button className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Enhance with AI</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}