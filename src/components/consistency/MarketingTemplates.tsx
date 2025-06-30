import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Download, Edit, Copy, Trash, Plus, Image, Type, Palette, 
  Sparkles, Check, Mail, FileImage, Presentation, Printer, Megaphone
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'

interface MarketingTemplatesProps {
  brandData: any
}

interface MarketingTemplate {
  id: string
  category: 'print' | 'digital' | 'email' | 'presentation'
  type: string
  name: string
  dimensions: string
  preview: string
  description: string
}

export const MarketingTemplates: React.FC<MarketingTemplatesProps> = ({
  brandData
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('print')
  const [searchQuery, setSearchQuery] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)

  // Early return if brandData is null or undefined
  if (!brandData) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Loading brand data...</h4>
            <p className="text-gray-500">
              Please wait while we load your brand information
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Sample marketing templates based on brand data
  const marketingTemplates: Record<string, MarketingTemplate[]> = {
    print: [
      {
        id: 'print-flyer-1',
        category: 'print',
        type: 'flyer',
        name: 'Product Flyer',
        dimensions: '8.5 × 11 in',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Showcase your products with this professional flyer template'
      },
      {
        id: 'print-brochure-1',
        category: 'print',
        type: 'brochure',
        name: 'Tri-fold Brochure',
        dimensions: '11 × 8.5 in',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Comprehensive tri-fold brochure for product or service information'
      },
      {
        id: 'print-business-card-1',
        category: 'print',
        type: 'business-card',
        name: 'Business Card',
        dimensions: '3.5 × 2 in',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Professional business card with your brand elements'
      }
    ],
    digital: [
      {
        id: 'digital-banner-1',
        category: 'digital',
        type: 'banner',
        name: 'Web Banner',
        dimensions: '728 × 90px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Standard leaderboard banner for websites'
      },
      {
        id: 'digital-ad-1',
        category: 'digital',
        type: 'ad',
        name: 'Display Ad',
        dimensions: '300 × 250px',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Medium rectangle display ad for digital campaigns'
      }
    ],
    email: [
      {
        id: 'email-newsletter-1',
        category: 'email',
        type: 'newsletter',
        name: 'Email Newsletter',
        dimensions: '600px width',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Monthly newsletter template with your branding'
      },
      {
        id: 'email-promotion-1',
        category: 'email',
        type: 'promotion',
        name: 'Promotional Email',
        dimensions: '600px width',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Special offer and promotion email template'
      }
    ],
    presentation: [
      {
        id: 'presentation-pitch-1',
        category: 'presentation',
        type: 'pitch',
        name: 'Pitch Deck',
        dimensions: '16:9 ratio',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Professional pitch deck with 20+ slide layouts'
      },
      {
        id: 'presentation-report-1',
        category: 'presentation',
        type: 'report',
        name: 'Annual Report',
        dimensions: '16:9 ratio',
        preview: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Financial report presentation template'
      }
    ]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'print': return <Printer className="w-5 h-5" />
      case 'digital': return <FileImage className="w-5 h-5" />
      case 'email': return <Mail className="w-5 h-5" />
      case 'presentation': return <Presentation className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const filteredTemplates = marketingTemplates[activeCategory]?.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const downloadTemplate = (templateId: string) => {
    setDownloading(templateId)
    
    // Simulate download
    setTimeout(() => {
      const template = Object.values(marketingTemplates)
        .flat()
        .find(t => t.id === templateId)
      
      if (!template) {
        setDownloading(null)
        return
      }
      
      // Create a mock template file
      const templateData = {
        ...template,
        brandName: brandData.brand?.name,
        colors: brandData.visual?.colors?.colors || [],
        typography: {
          heading: brandData.visual?.typography?.heading?.family,
          body: brandData.visual?.typography?.body?.family
        },
        logo: brandData.visual?.logo?.url || brandData.visual?.logo?.svg,
        generatedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandData.brand?.name}-${template.type}-template.json`
      a.click()
      URL.revokeObjectURL(url)
      
      setDownloading(null)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-blue-600" />
              Marketing Material Templates
            </h3>
            <p className="text-gray-600 mt-1">
              Ready-to-use marketing templates with your brand assets
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Custom</span>
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {['print', 'digital', 'email', 'presentation'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                flex flex-col items-center space-y-2 px-4 py-3 rounded-lg font-medium transition-all
                ${activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {getCategoryIcon(category)}
              <span className="text-xs capitalize">{category}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder={`Search ${activeCategory} templates...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No templates found</h4>
            <p className="text-gray-500">
              Try adjusting your search or select a different category
            </p>
          </div>
        ) : (
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
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center space-x-1">
                    {getCategoryIcon(template.category)}
                    <span className="capitalize">{template.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {template.dimensions}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {}}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Customize
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadTemplate(template.id)}
                        loading={downloading === template.id}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-1">
                      {brandData.visual?.colors?.colors?.slice(0, 3).map((color: string, index: number) => (
                        <div 
                          key={index}
                          className="w-5 h-5 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Featured Templates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Marketing Bundles</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Product Launch Kit</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Complete set of templates for new product launches
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-1" />
              Download Bundle
            </Button>
          </div>
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Email Campaign Bundle</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Email templates for nurture campaigns and promotions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-1" />
              Download Bundle
            </Button>
          </div>
          <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Printer className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Print Collateral Pack</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Essential print materials for your business
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
            <h3 className="font-semibold text-gray-900 mb-2">AI Marketing Template Generator</h3>
            <p className="text-gray-700 mb-4">
              Describe your marketing needs and let AI create a custom template with your brand elements.
            </p>
            <div className="flex space-x-3">
              <Input 
                placeholder="Describe the marketing material you need..."
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