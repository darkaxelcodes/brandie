import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutTemplate, Download, Filter, Search, Instagram, Facebook, Twitter, FileText, 
  Presentation, FileImage, Sparkles, Tag, Check, Grid, List
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { consistencyService } from '../../lib/consistencyService'
import { TemplateItem } from '../../lib/consistencyService'

interface TemplateLibraryProps {
  brandData: any
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  brandData
}) => {
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    // Load templates based on brand data
    if (brandData) {
      const brandTemplates = consistencyService.getTemplates(brandData)
      setTemplates(brandTemplates)
      setFilteredTemplates(brandTemplates)
    }
  }, [brandData])

  // Early return if brandData is null or undefined
  if (!brandData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <LayoutTemplate className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Loading brand data...</h4>
            <p className="text-gray-500">
              Please wait while we load your brand information
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterTemplates(query, activeFilter)
  }

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter)
    filterTemplates(searchQuery, filter === activeFilter ? null : filter)
  }

  const filterTemplates = (query: string, filter: string | null) => {
    let filtered = templates

    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Apply type filter
    if (filter) {
      filtered = filtered.filter(template => template.type === filter)
    }

    setFilteredTemplates(filtered)
  }

  const downloadTemplate = async (templateId: string) => {
    setDownloading(templateId)
    try {
      const blob = await consistencyService.generateTemplate(templateId, brandData)
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandData.brand?.name}-${templateId}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading template:', error)
    } finally {
      setDownloading(null)
    }
  }

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'social':
        return <Instagram className="w-5 h-5 text-pink-600" />
      case 'marketing':
        return <FileImage className="w-5 h-5 text-blue-600" />
      case 'presentation':
        return <Presentation className="w-5 h-5 text-amber-600" />
      case 'document':
        return <FileText className="w-5 h-5 text-green-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutTemplate className="w-6 h-6 text-blue-600" />
              Brand Template Library
            </h3>
            <p className="text-gray-600 mt-1">
              Ready-to-use templates with your brand assets
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeFilter === 'social' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('social')}
              className="flex items-center space-x-1"
            >
              <Instagram className="w-4 h-4" />
              <span>Social</span>
            </Button>
            <Button
              variant={activeFilter === 'marketing' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('marketing')}
              className="flex items-center space-x-1"
            >
              <FileImage className="w-4 h-4" />
              <span>Marketing</span>
            </Button>
            <Button
              variant={activeFilter === 'presentation' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('presentation')}
              className="flex items-center space-x-1"
            >
              <Presentation className="w-4 h-4" />
              <span>Presentations</span>
            </Button>
            <Button
              variant={activeFilter === 'document' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('document')}
              className="flex items-center space-x-1"
            >
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No templates found</h4>
            <p className="text-gray-500">
              Try adjusting your search or filters to find templates
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
                    {getTemplateIcon(template.type)}
                    <span className="capitalize">{template.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {template.formats.map((format) => (
                        <span key={format} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {format.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadTemplate(template.id)}
                      loading={downloading === template.id}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      {getTemplateIcon(template.type)}
                      <span className="capitalize">{template.type}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="flex space-x-1">
                    {template.formats.map((format) => (
                      <span key={format} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {format.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => downloadTemplate(template.id)}
                    loading={downloading === template.id}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Featured Templates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Templates</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Instagram className="w-5 h-5 text-pink-600" />
              <h4 className="font-medium text-gray-900">Social Media Bundle</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Complete set of templates for all major social platforms
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-1" />
              Download Bundle
            </Button>
          </div>
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Presentation className="w-5 h-5 text-amber-600" />
              <h4 className="font-medium text-gray-900">Pitch Deck Pro</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Professional presentation template with 20+ slide layouts
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-1" />
              Download Bundle
            </Button>
          </div>
          <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Business Essentials</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Business cards, letterhead, and email signatures
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-1" />
              Download Bundle
            </Button>
          </div>
        </div>
      </Card>

      {/* AI Template Generation */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Template Generation</h3>
            <p className="text-gray-700 mb-4">
              Need a custom template? Let AI generate a perfectly branded template based on your description.
            </p>
            <div className="flex space-x-3">
              <Input 
                placeholder="Describe the template you need..."
                className="flex-1"
              />
              <Button className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}