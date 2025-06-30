import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, MessageSquare, Mail, Instagram, Facebook, Twitter, Linkedin, 
  Copy, RefreshCw, Download, Check, FileText, Zap
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { generateStrategySuggestions } from '../../lib/openai'

interface PlatformContentGeneratorProps {
  brandData: any
  brandVoice: any
}

interface GeneratedContent {
  platform: string
  contentType: string
  content: string
  tone: string
}

export const PlatformContentGenerator: React.FC<PlatformContentGeneratorProps> = ({
  brandData,
  brandVoice
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram')
  const [contentType, setContentType] = useState<string>('post')
  const [contentPrompt, setContentPrompt] = useState<string>('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [generating, setGenerating] = useState<boolean>(false)
  const [copied, setCopied] = useState<string | null>(null)

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'email', name: 'Email', icon: Mail }
  ]

  const contentTypes = {
    instagram: [
      { id: 'post', name: 'Feed Post' },
      { id: 'story', name: 'Story' },
      { id: 'reel', name: 'Reel Caption' },
      { id: 'bio', name: 'Bio' }
    ],
    facebook: [
      { id: 'post', name: 'Post' },
      { id: 'ad', name: 'Ad Copy' },
      { id: 'event', name: 'Event Description' },
      { id: 'about', name: 'About Section' }
    ],
    twitter: [
      { id: 'tweet', name: 'Tweet' },
      { id: 'thread', name: 'Thread' },
      { id: 'bio', name: 'Bio' }
    ],
    linkedin: [
      { id: 'post', name: 'Post' },
      { id: 'article', name: 'Article Intro' },
      { id: 'job', name: 'Job Description' },
      { id: 'company', name: 'Company Description' }
    ],
    email: [
      { id: 'subject', name: 'Subject Line' },
      { id: 'intro', name: 'Introduction' },
      { id: 'newsletter', name: 'Newsletter' },
      { id: 'cta', name: 'Call to Action' }
    ]
  }

  const generateContent = async () => {
    if (!contentPrompt) return
    
    setGenerating(true)
    try {
      const context = {
        brandName: brandData.brand?.name,
        industry: brandData.brand?.industry,
        platform: selectedPlatform,
        contentType,
        prompt: contentPrompt,
        voice: brandVoice,
        strategy: brandData.strategy
      }

      const response = await generateStrategySuggestions('voice', context)
      
      // Create content variations
      const variations: GeneratedContent[] = response.suggestions.slice(0, 3).map((content, index) => ({
        platform: selectedPlatform,
        contentType,
        content,
        tone: getToneDescription(brandVoice?.tone_scales)
      }))
      
      setGeneratedContent([...variations, ...generatedContent].slice(0, 10))
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getToneDescription = (scales: any): string => {
    if (!scales) return 'balanced'
    
    const descriptions = []

    if (scales.formalCasual < 30) descriptions.push('formal')
    else if (scales.formalCasual > 70) descriptions.push('casual')
    else descriptions.push('balanced')

    if (scales.logicalEmotional < 30) descriptions.push('logical')
    else if (scales.logicalEmotional > 70) descriptions.push('emotional')

    if (scales.playfulSerious < 30) descriptions.push('serious')
    else if (scales.playfulSerious > 70) descriptions.push('playful')

    return descriptions.join(', ')
  }

  const copyToClipboard = (content: string, index: number) => {
    navigator.clipboard.writeText(content)
    setCopied(`${index}`)
    setTimeout(() => setCopied(null), 2000)
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return <MessageSquare className="w-5 h-5" />
    
    const Icon = platform.icon
    return <Icon className="w-5 h-5" />
  }

  const getContentTypeName = (platformId: string, typeId: string) => {
    const types = contentTypes[platformId as keyof typeof contentTypes] || []
    const type = types.find(t => t.id === typeId)
    return type ? type.name : typeId
  }

  const exportAllContent = () => {
    const content = generatedContent.map(item => {
      const platform = platforms.find(p => p.id === item.platform)?.name || item.platform
      const type = getContentTypeName(item.platform, item.contentType)
      
      return `# ${platform} - ${type}\n\n${item.content}\n\nTone: ${item.tone}\n\n---\n\n`
    }).join('')
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandData.brand?.name}-platform-content.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Platform Content Generator
            </h3>
            <p className="text-gray-600 mt-1">
              Generate on-brand content for specific platforms
            </p>
          </div>
          {generatedContent.length > 0 && (
            <Button
              variant="outline"
              onClick={exportAllContent}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </Button>
          )}
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon
              return (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{platform.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Content Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content Type
          </label>
          <div className="flex flex-wrap gap-2">
            {contentTypes[selectedPlatform as keyof typeof contentTypes]?.map((type) => (
              <Button
                key={type.id}
                variant={contentType === type.id ? 'primary' : 'outline'}
                onClick={() => setContentType(type.id)}
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Prompt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What do you want to communicate?
          </label>
          <div className="flex space-x-2">
            <Input
              value={contentPrompt}
              onChange={(e) => setContentPrompt(e.target.value)}
              placeholder="E.g., Announce our new product launch, Share a customer success story..."
              className="flex-1"
            />
            <Button
              onClick={generateContent}
              loading={generating}
              disabled={!contentPrompt.trim()}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </Button>
          </div>
        </div>

        {/* Generated Content */}
        {generatedContent.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Generated Content</h4>
            
            {generatedContent.map((content, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(content.platform)}
                    <span className="font-medium text-gray-900">
                      {platforms.find(p => p.id === content.platform)?.name} - {getContentTypeName(content.platform, content.contentType)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {content.tone}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(content.content, index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {copied === `${index}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-line">{content.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* AI Enhancement Tips */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Content Generation Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Be specific about what you want to communicate</li>
              <li>• Include key details like product features or event information</li>
              <li>• Specify the desired tone if different from your brand voice</li>
              <li>• Generate multiple variations to find the perfect message</li>
              <li>• Customize the generated content to add your personal touch</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}