import { assetExportService } from './assetExportService'
import { templateGeneratorService, SOCIAL_MEDIA_SIZES, MARKETING_SIZES, TemplateElements } from './templateGeneratorService'

export interface ConsistencyCheckResult {
  score: number
  issues: ConsistencyIssue[]
  recommendations: string[]
}

export interface ConsistencyIssue {
  type: 'color' | 'typography' | 'logo' | 'voice'
  severity: 'high' | 'medium' | 'low'
  description: string
  recommendation: string
}

export interface TemplateItem {
  id: string
  name: string
  type: 'social' | 'marketing' | 'presentation' | 'document'
  description: string
  thumbnail: string
  formats: string[]
}

export interface TemplateUsage {
  id: string
  brand_id: string
  template_id: string
  template_type: string
  usage_count: number
  last_used_at: string
  created_at: string
  updated_at: string
}

export interface ComplianceCheck {
  id: string
  brand_id: string
  file_name: string
  file_type: string
  score: number
  issues: ConsistencyIssue[]
  recommendations: string[]
  created_at: string
}

export const consistencyService = {
  // Check brand consistency across assets
  async checkConsistency(brandData: any, assetToCheck: any): Promise<ConsistencyCheckResult> {
    const issues: ConsistencyIssue[] = []
    
    // Check colors
    if (assetToCheck.colors) {
      const colorIssues = this.checkColorConsistency(brandData.visual?.colors, assetToCheck.colors)
      issues.push(...colorIssues)
    }
    
    // Check typography
    if (assetToCheck.typography) {
      const typographyIssues = this.checkTypographyConsistency(brandData.visual?.typography, assetToCheck.typography)
      issues.push(...typographyIssues)
    }
    
    // Check logo usage
    if (assetToCheck.logo) {
      const logoIssues = this.checkLogoConsistency(brandData.visual?.logo, assetToCheck.logo)
      issues.push(...logoIssues)
    }
    
    // Check voice and tone
    if (assetToCheck.text) {
      const voiceIssues = this.checkVoiceConsistency(brandData.voice, assetToCheck.text)
      issues.push(...voiceIssues)
    }
    
    // Calculate overall score
    const score = this.calculateConsistencyScore(issues)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(issues)
    
    // Save compliance check to database
    if (brandData.brand?.id && assetToCheck.name) {
      this.saveComplianceCheck(brandData.brand.id, {
        file_name: assetToCheck.name,
        file_type: assetToCheck.type || 'unknown',
        score,
        issues,
        recommendations
      }).catch(err => console.error('Error saving compliance check:', err))
    }
    
    return {
      score,
      issues,
      recommendations
    }
  },
  
  // Save compliance check to database
  async saveComplianceCheck(brandId: string, checkData: any): Promise<void> {
    try {
      const { supabase } = await import('./supabase')
      await supabase
        .from('compliance_checks')
        .insert([{
          brand_id: brandId,
          file_name: checkData.file_name,
          file_type: checkData.file_type,
          score: checkData.score,
          issues: checkData.issues,
          recommendations: checkData.recommendations
        }])
    } catch (error) {
      console.error('Error saving compliance check:', error)
      throw error
    }
  },
  
  // Get compliance check history
  async getComplianceHistory(brandId: string): Promise<ComplianceCheck[]> {
    try {
      const { supabase } = await import('./supabase')
      const { data, error } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting compliance history:', error)
      throw error
    }
  },
  
  // Check color consistency
  checkColorConsistency(brandColors: any, assetColors: string[]): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = []
    
    if (!brandColors || !brandColors.colors || !assetColors || assetColors.length === 0) {
      return issues
    }
    
    const brandColorSet = new Set(brandColors.colors.map((color: string) => color.toLowerCase()))
    
    for (const color of assetColors) {
      // Check if color is in brand palette
      if (!brandColorSet.has(color.toLowerCase())) {
        // Check if it's close to a brand color
        const closestColor = this.findClosestColor(color, brandColors.colors)
        const distance = this.getColorDistance(color, closestColor)
        
        if (distance < 10) {
          // Small difference, likely a mistake
          issues.push({
            type: 'color',
            severity: 'medium',
            description: `Color ${color} is similar to brand color ${closestColor} but not exact`,
            recommendation: `Replace ${color} with ${closestColor} for brand consistency`
          })
        } else {
          // Significant difference
          issues.push({
            type: 'color',
            severity: 'high',
            description: `Color ${color} is not part of the brand palette`,
            recommendation: `Replace with an approved brand color`
          })
        }
      }
    }
    
    return issues
  },
  
  // Check typography consistency
  checkTypographyConsistency(brandTypography: any, assetTypography: any): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = []
    
    if (!brandTypography || !assetTypography) {
      return issues
    }
    
    // Check heading font
    if (brandTypography.heading?.family && 
        assetTypography.heading && 
        assetTypography.heading.toLowerCase() !== brandTypography.heading.family.toLowerCase()) {
      issues.push({
        type: 'typography',
        severity: 'high',
        description: `Heading font "${assetTypography.heading}" doesn't match brand font "${brandTypography.heading.family}"`,
        recommendation: `Use "${brandTypography.heading.family}" for headings`
      })
    }
    
    // Check body font
    if (brandTypography.body?.family && 
        assetTypography.body && 
        assetTypography.body.toLowerCase() !== brandTypography.body.family.toLowerCase()) {
      issues.push({
        type: 'typography',
        severity: 'high',
        description: `Body font "${assetTypography.body}" doesn't match brand font "${brandTypography.body.family}"`,
        recommendation: `Use "${brandTypography.body.family}" for body text`
      })
    }
    
    return issues
  },
  
  // Check logo consistency
  checkLogoConsistency(brandLogo: any, assetLogo: any): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = []
    
    if (!brandLogo || !assetLogo) {
      return issues
    }
    
    // Check if logo is stretched
    if (assetLogo.aspectRatio && brandLogo.aspectRatio && 
        Math.abs(assetLogo.aspectRatio - brandLogo.aspectRatio) > 0.1) {
      issues.push({
        type: 'logo',
        severity: 'high',
        description: 'Logo appears to be stretched or distorted',
        recommendation: 'Maintain the original aspect ratio of the logo'
      })
    }
    
    // Check if logo has enough clear space
    if (assetLogo.clearSpace && assetLogo.clearSpace < 0.5) {
      issues.push({
        type: 'logo',
        severity: 'medium',
        description: 'Logo does not have enough clear space around it',
        recommendation: 'Maintain at least 1x logo height of clear space around the logo'
      })
    }
    
    // Check if logo is too small
    if (assetLogo.size && assetLogo.size.width < 100) {
      issues.push({
        type: 'logo',
        severity: 'medium',
        description: 'Logo appears too small for legibility',
        recommendation: 'Ensure logo is at least 100px wide for digital applications'
      })
    }
    
    return issues
  },
  
  // Check voice consistency
  checkVoiceConsistency(brandVoice: any, text: string): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = []
    
    if (!brandVoice || !text) {
      return issues
    }
    
    // Check for formal/casual consistency
    if (brandVoice.tone_scales?.formalCasual < 30 && this.hasCasualLanguage(text)) {
      issues.push({
        type: 'voice',
        severity: 'high',
        description: 'Text uses casual language but brand voice is formal',
        recommendation: 'Use more formal language and avoid contractions or slang'
      })
    } else if (brandVoice.tone_scales?.formalCasual > 70 && this.hasFormalLanguage(text)) {
      issues.push({
        type: 'voice',
        severity: 'medium',
        description: 'Text uses formal language but brand voice is casual',
        recommendation: 'Use more conversational language and a friendly tone'
      })
    }
    
    // Check for playful/serious consistency
    if (brandVoice.tone_scales?.playfulSerious < 30 && this.hasPlayfulLanguage(text)) {
      issues.push({
        type: 'voice',
        severity: 'medium',
        description: 'Text uses playful language but brand voice is serious',
        recommendation: 'Use more straightforward language and avoid humor or wordplay'
      })
    }
    
    // Check for key messaging
    if (brandVoice.messaging?.keyMessages && brandVoice.messaging.keyMessages.length > 0) {
      const keyMessagePresent = brandVoice.messaging.keyMessages.some((message: string) => 
        text.toLowerCase().includes(message.toLowerCase())
      )
      
      if (!keyMessagePresent && text.length > 100) {
        issues.push({
          type: 'voice',
          severity: 'low',
          description: 'Text does not include any key brand messages',
          recommendation: 'Include at least one key message for brand consistency'
        })
      }
    }
    
    return issues
  },
  
  // Calculate overall consistency score
  calculateConsistencyScore(issues: ConsistencyIssue[]): number {
    if (issues.length === 0) return 100
    
    // Weight issues by severity
    const weights = {
      high: 10,
      medium: 5,
      low: 2
    }
    
    const totalWeight = issues.reduce((sum, issue) => sum + weights[issue.severity], 0)
    const maxPossibleWeight = 30 // Arbitrary max weight for normalization
    
    return Math.max(0, Math.round(100 - (totalWeight / maxPossibleWeight) * 100))
  },
  
  // Generate recommendations based on issues
  generateRecommendations(issues: ConsistencyIssue[]): string[] {
    if (issues.length === 0) {
      return ['No consistency issues found. Great job!']
    }
    
    // Group recommendations by type
    const recommendations = new Set<string>()
    
    // Add specific recommendations from issues
    issues.forEach(issue => recommendations.add(issue.recommendation))
    
    // Add general recommendations based on issue types
    const issueTypes = new Set(issues.map(issue => issue.type))
    
    if (issueTypes.has('color')) {
      recommendations.add('Use the brand color palette consistently across all materials')
    }
    
    if (issueTypes.has('typography')) {
      recommendations.add('Maintain consistent typography using only approved brand fonts')
    }
    
    if (issueTypes.has('logo')) {
      recommendations.add('Follow logo usage guidelines for placement, size, and clear space')
    }
    
    if (issueTypes.has('voice')) {
      recommendations.add('Ensure all communications maintain a consistent brand voice and tone')
    }
    
    return Array.from(recommendations)
  },
  
  // Get brand templates
  getTemplates(brandData: any): TemplateItem[] {
    // Generate templates based on brand data
    const templates: TemplateItem[] = []
    
    // Social media templates
    templates.push(
      {
        id: 'social-instagram',
        name: 'Instagram Post',
        type: 'social',
        description: 'Square format optimized for Instagram feed',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['png', 'psd']
      },
      {
        id: 'social-facebook',
        name: 'Facebook Cover',
        type: 'social',
        description: 'Cover image for Facebook business page',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['png', 'psd']
      },
      {
        id: 'social-twitter',
        name: 'Twitter Post',
        type: 'social',
        description: 'Optimized for Twitter feed',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['png', 'psd']
      }
    )
    
    // Marketing templates
    templates.push(
      {
        id: 'marketing-flyer',
        name: 'Marketing Flyer',
        type: 'marketing',
        description: 'Print-ready flyer template',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['pdf', 'indd']
      },
      {
        id: 'marketing-banner',
        name: 'Web Banner',
        type: 'marketing',
        description: 'Digital banner for websites',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['png', 'psd']
      },
      {
        id: 'marketing-email',
        name: 'Email Template',
        type: 'marketing',
        description: 'HTML email template with brand styling',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['html']
      }
    )
    
    // Presentation templates
    templates.push(
      {
        id: 'presentation-pitch',
        name: 'Pitch Deck',
        type: 'presentation',
        description: 'Branded presentation template',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['pptx', 'pdf']
      },
      {
        id: 'presentation-report',
        name: 'Annual Report',
        type: 'presentation',
        description: 'Financial report template',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['pptx', 'pdf']
      }
    )
    
    // Document templates
    templates.push(
      {
        id: 'document-letterhead',
        name: 'Letterhead',
        type: 'document',
        description: 'Official company letterhead',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['docx', 'pdf']
      },
      {
        id: 'document-business-card',
        name: 'Business Card',
        type: 'document',
        description: 'Standard business card design',
        thumbnail: 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        formats: ['pdf', 'ai']
      }
    )
    
    return templates
  },
  
  // Track template usage
  async trackTemplateUsage(brandId: string, templateId: string, templateType: string): Promise<void> {
    try {
      const { supabase } = await import('./supabase')
      
      // Check if template usage record exists
      const { data } = await supabase
        .from('template_usage')
        .select('*')
        .eq('brand_id', brandId)
        .eq('template_id', templateId)
        .maybeSingle()
      
      if (data) {
        // Update existing record
        await supabase
          .from('template_usage')
          .update({
            usage_count: data.usage_count + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', data.id)
      } else {
        // Create new record
        await supabase
          .from('template_usage')
          .insert([{
            brand_id: brandId,
            template_id: templateId,
            template_type: templateType
          }])
      }
    } catch (error) {
      console.error('Error tracking template usage:', error)
    }
  },
  
  // Get template usage statistics
  async getTemplateUsageStats(brandId: string): Promise<TemplateUsage[]> {
    try {
      const { supabase } = await import('./supabase')
      const { data, error } = await supabase
        .from('template_usage')
        .select('*')
        .eq('brand_id', brandId)
        .order('usage_count', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting template usage stats:', error)
      throw error
    }
  },
  
  async generateTemplate(templateId: string, brandData: any): Promise<Blob> {
    const colors = brandData.visual?.colors?.colors || ['#3B82F6', '#1E40AF']

    const elements: TemplateElements = {
      background: colors[0] || '#3B82F6',
      secondaryColor: colors[1] || colors[0],
      text: brandData.brand?.name || 'Your Brand',
      subtext: brandData.brand?.tagline || '',
      logo: brandData.visual?.logo ? {
        url: brandData.visual.logo.url,
        svg: brandData.visual.logo.svg
      } : undefined,
      typography: {
        heading: { family: brandData.visual?.typography?.heading?.family || 'Arial' },
        body: { family: brandData.visual?.typography?.body?.family || 'Arial' }
      },
      brandName: brandData.brand?.name,
      showLogo: true
    }

    const templateType = templateId.split('-')[0]
    let config = SOCIAL_MEDIA_SIZES[templateId] || MARKETING_SIZES[templateId]

    if (!config) {
      config = { id: templateId, name: templateId, width: 1200, height: 630 }
    }

    let generated
    if (templateType === 'social' || SOCIAL_MEDIA_SIZES[templateId]) {
      generated = await templateGeneratorService.generateSocialMediaTemplate(config, elements, 'png')
    } else {
      generated = await templateGeneratorService.generateMarketingTemplate(config, elements, 'png')
    }

    if (brandData.brand?.id) {
      this.trackTemplateUsage(brandData.brand.id, templateId, templateType)
        .catch(err => console.error('Error tracking template usage:', err))
    }

    return generated.blob
  },
  
  // Helper methods
  findClosestColor(color: string, brandColors: string[]): string {
    if (!brandColors || brandColors.length === 0) return color
    
    let closestColor = brandColors[0]
    let minDistance = this.getColorDistance(color, closestColor)
    
    for (let i = 1; i < brandColors.length; i++) {
      const distance = this.getColorDistance(color, brandColors[i])
      if (distance < minDistance) {
        minDistance = distance
        closestColor = brandColors[i]
      }
    }
    
    return closestColor
  },
  
  getColorDistance(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)
    
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    )
  },
  
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  },
  
  hasCasualLanguage(text: string): boolean {
    const casualMarkers = [
      "hey", "hi there", "what's up", "gonna", "wanna", "y'all", 
      "awesome", "cool", "super", "totally", "yeah", "yep", "nope"
    ]
    
    return casualMarkers.some(marker => 
      text.toLowerCase().includes(marker.toLowerCase())
    )
  },
  
  hasFormalLanguage(text: string): boolean {
    const formalMarkers = [
      "hereby", "thus", "therefore", "furthermore", "moreover",
      "subsequently", "accordingly", "henceforth", "pursuant to"
    ]
    
    return formalMarkers.some(marker => 
      text.toLowerCase().includes(marker.toLowerCase())
    )
  },
  
  hasPlayfulLanguage(text: string): boolean {
    const playfulMarkers = [
      "!", "!!", "?!", "woohoo", "yay", "wow", "amazing", "fantastic",
      "incredible", "awesome", "exciting", "fun", "happy", "joy"
    ]
    
    // Count exclamation marks
    const exclamationCount = (text.match(/!/g) || []).length
    
    return playfulMarkers.some(marker => 
      text.toLowerCase().includes(marker.toLowerCase())
    ) || exclamationCount > 2
  }
}