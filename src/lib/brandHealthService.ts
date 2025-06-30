import { supabase, withRetry } from './supabase'
import { BrandHealth } from '../types/brand'

export const brandHealthService = {
  // Calculate brand health score
  async calculateBrandHealth(brandId: string): Promise<BrandHealth> {
    try {
      // Get all brand data
      const [brand, strategySections, visualAssets, brandVoice, guidelines, complianceChecks] = await Promise.all([
        withRetry(async () => {
          const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('id', brandId)
            .single()
          if (error) throw error
          return data
        }),
        withRetry(async () => {
          const { data, error } = await supabase
            .from('strategy_sections')
            .select('*')
            .eq('brand_id', brandId)
          if (error) throw error
          return data || []
        }),
        withRetry(async () => {
          const { data, error } = await supabase
            .from('visual_assets')
            .select('*')
            .eq('brand_id', brandId)
          if (error) throw error
          return data || []
        }),
        withRetry(async () => {
          const { data, error } = await supabase
            .from('brand_voice')
            .select('*')
            .eq('brand_id', brandId)
            .maybeSingle()
          if (error) throw error
          return data
        }),
        withRetry(async () => {
          const { data, error } = await supabase
            .from('brand_guidelines')
            .select('*')
            .eq('brand_id', brandId)
            .maybeSingle()
          if (error) throw error
          return data
        }),
        withRetry(async () => {
          const { data, error } = await supabase
            .from('compliance_checks')
            .select('*')
            .eq('brand_id', brandId)
            .order('created_at', { ascending: false })
            .limit(5)
          if (error) throw error
          return data || []
        })
      ])

      // Calculate completeness score (30% of total)
      const completenessScore = this.calculateCompletenessScore(
        strategySections,
        visualAssets,
        brandVoice,
        guidelines
      )

      // Calculate consistency score (30% of total)
      const consistencyScore = this.calculateConsistencyScore(
        complianceChecks,
        visualAssets,
        brandVoice
      )

      // Calculate uniqueness score (20% of total)
      const uniquenessScore = this.calculateUniquenessScore(
        strategySections,
        brand
      )

      // Calculate relevance score (20% of total)
      const relevanceScore = this.calculateRelevanceScore(
        strategySections,
        brand
      )

      // Calculate overall score
      const overallScore = Math.round(
        (completenessScore * 0.3) +
        (consistencyScore * 0.3) +
        (uniquenessScore * 0.2) +
        (relevanceScore * 0.2)
      )

      // Generate strengths and weaknesses
      const { strengths, weaknesses, opportunities } = this.generateInsights(
        completenessScore,
        consistencyScore,
        uniquenessScore,
        relevanceScore,
        strategySections,
        visualAssets,
        brandVoice,
        guidelines
      )

      return {
        overall_score: overallScore,
        completeness_score: completenessScore,
        consistency_score: consistencyScore,
        uniqueness_score: uniquenessScore,
        relevance_score: relevanceScore,
        details: {
          strengths,
          weaknesses,
          opportunities
        }
      }
    } catch (error) {
      console.error('Error calculating brand health:', error)
      // Return default values in case of error
      return {
        overall_score: 0,
        completeness_score: 0,
        consistency_score: 0,
        uniqueness_score: 0,
        relevance_score: 0,
        details: {
          strengths: [],
          weaknesses: ['Unable to calculate brand health due to an error'],
          opportunities: []
        }
      }
    }
  },

  // Calculate completeness score
  calculateCompletenessScore(
    strategySections: any[],
    visualAssets: any[],
    brandVoice: any,
    guidelines: any
  ): number {
    let totalPoints = 0
    let maxPoints = 100

    // Strategy sections (50 points max, 10 per section)
    const strategyTypes = ['purpose', 'values', 'audience', 'competitive', 'archetype']
    strategyTypes.forEach(type => {
      const section = strategySections.find(s => s.section_type === type)
      if (section && section.completed) {
        totalPoints += 10
      } else if (section) {
        // Partial credit for incomplete sections
        totalPoints += 5
      }
    })

    // Visual assets (30 points max, 10 per asset type)
    const hasLogo = visualAssets.some(a => a.asset_type === 'logo')
    const hasColors = visualAssets.some(a => a.asset_type === 'color_palette')
    const hasTypography = visualAssets.some(a => a.asset_type === 'typography')
    
    if (hasLogo) totalPoints += 10
    if (hasColors) totalPoints += 10
    if (hasTypography) totalPoints += 10

    // Brand voice (10 points)
    if (brandVoice) {
      totalPoints += 10
    }

    // Guidelines (10 points)
    if (guidelines) {
      totalPoints += 10
    }

    return Math.round((totalPoints / maxPoints) * 100)
  },

  // Calculate consistency score
  calculateConsistencyScore(
    complianceChecks: any[],
    visualAssets: any[],
    brandVoice: any
  ): number {
    // If no compliance checks, base score on assets
    if (complianceChecks.length === 0) {
      // Default score based on having complete assets
      const hasAllAssets = 
        visualAssets.some(a => a.asset_type === 'logo') &&
        visualAssets.some(a => a.asset_type === 'color_palette') &&
        visualAssets.some(a => a.asset_type === 'typography') &&
        brandVoice !== null
      
      return hasAllAssets ? 70 : 50
    }

    // Average the scores from compliance checks
    const avgScore = complianceChecks.reduce((sum, check) => sum + check.score, 0) / complianceChecks.length
    
    return Math.round(avgScore)
  },

  // Calculate uniqueness score
  calculateUniquenessScore(
    strategySections: any[],
    brand: any
  ): number {
    // This would ideally use competitive analysis data
    // For now, use a simplified approach based on strategy sections
    
    const competitiveSection = strategySections.find(s => s.section_type === 'competitive')
    const valuesSection = strategySections.find(s => s.section_type === 'values')
    
    // Default score
    let score = 50
    
    // If we have competitive analysis data
    if (competitiveSection && competitiveSection.content) {
      const { competitiveAdvantage, marketGap } = competitiveSection.content
      
      // Add points for having defined competitive advantages
      if (competitiveAdvantage && competitiveAdvantage.length > 20) {
        score += 15
      }
      
      // Add points for identifying market gaps
      if (marketGap && marketGap.length > 20) {
        score += 15
      }
    }
    
    // If we have values data
    if (valuesSection && valuesSection.content) {
      const { uniqueValue } = valuesSection.content
      
      // Add points for having a unique value proposition
      if (uniqueValue && uniqueValue.length > 20) {
        score += 20
      }
    }
    
    // Cap at 100
    return Math.min(score, 100)
  },

  // Calculate relevance score
  calculateRelevanceScore(
    strategySections: any[],
    brand: any
  ): number {
    // This would ideally use audience and industry data
    // For now, use a simplified approach
    
    const audienceSection = strategySections.find(s => s.section_type === 'audience')
    
    // Default score
    let score = 60
    
    // If we have audience data
    if (audienceSection && audienceSection.content) {
      const { primaryAudience, painPoints } = audienceSection.content
      
      // Add points for having defined audience
      if (primaryAudience && primaryAudience.length > 20) {
        score += 20
      }
      
      // Add points for identifying pain points
      if (painPoints && painPoints.length > 0) {
        score += Math.min(painPoints.length * 5, 20)
      }
    }
    
    // If we have industry data
    if (brand.industry) {
      score += 10
    }
    
    // Cap at 100
    return Math.min(score, 100)
  },

  // Generate insights based on scores
  generateInsights(
    completenessScore: number,
    consistencyScore: number,
    uniquenessScore: number,
    relevanceScore: number,
    strategySections: any[],
    visualAssets: any[],
    brandVoice: any,
    guidelines: any
  ): { strengths: string[], weaknesses: string[], opportunities: string[] } {
    const strengths = []
    const weaknesses = []
    const opportunities = []

    // Analyze completeness
    if (completenessScore >= 80) {
      strengths.push('Comprehensive brand identity with all key elements defined')
    } else if (completenessScore < 50) {
      weaknesses.push('Incomplete brand identity with missing key elements')
      
      // Check what's missing
      const strategyTypes = ['purpose', 'values', 'audience', 'competitive', 'archetype']
      const missingStrategy = strategyTypes.filter(type => 
        !strategySections.some(s => s.section_type === type && s.completed)
      )
      
      if (missingStrategy.length > 0) {
        opportunities.push(`Complete your brand strategy: ${missingStrategy.join(', ')}`)
      }
      
      if (!visualAssets.some(a => a.asset_type === 'logo')) {
        opportunities.push('Create a logo to strengthen your visual identity')
      }
      
      if (!visualAssets.some(a => a.asset_type === 'color_palette')) {
        opportunities.push('Define a color palette for consistent visual communication')
      }
      
      if (!visualAssets.some(a => a.asset_type === 'typography')) {
        opportunities.push('Select typography to enhance your brand personality')
      }
      
      if (!brandVoice) {
        opportunities.push('Establish your brand voice for consistent communication')
      }
    }

    // Analyze consistency
    if (consistencyScore >= 80) {
      strengths.push('Strong brand consistency across all materials')
    } else if (consistencyScore < 60) {
      weaknesses.push('Inconsistent brand application across materials')
      opportunities.push('Use the compliance checker to ensure brand consistency')
    }

    // Analyze uniqueness
    if (uniquenessScore >= 80) {
      strengths.push('Distinctive brand positioning with clear differentiation')
    } else if (uniquenessScore < 60) {
      weaknesses.push('Limited brand differentiation from competitors')
      opportunities.push('Refine your competitive advantage and unique value proposition')
    }

    // Analyze relevance
    if (relevanceScore >= 80) {
      strengths.push('Highly relevant brand for target audience needs')
    } else if (relevanceScore < 60) {
      weaknesses.push('Brand may not fully address audience needs')
      opportunities.push('Enhance audience understanding and pain point alignment')
    }

    // If no guidelines
    if (!guidelines) {
      opportunities.push('Generate comprehensive brand guidelines to ensure consistency')
    }

    return { strengths, weaknesses, opportunities }
  },

  // Save brand health score to database (removed activity_log dependency)
  async saveBrandHealthScore(brandId: string, healthData: BrandHealth): Promise<void> {
    try {
      // For now, we'll just log the health data locally since activity_log table doesn't exist
      // This can be implemented later when the activity_log table is created
      console.log('Brand health score calculated:', { brandId, healthData })
      
      // Optionally, we could save this data to the brand record itself
      // or create a separate brand_health table in the future
    } catch (error) {
      console.error('Error saving brand health score:', error)
      // Don't throw the error since this is not critical for the main functionality
    }
  }
}