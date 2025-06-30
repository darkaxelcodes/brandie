import { supabase, withRetry } from './supabase'
import { Brand, StrategySection, StrategyFormData } from '../types/brand'

export const brandService = {
  // Create a new brand
  async createBrand(name: string): Promise<Brand> {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .insert([{ 
          name,
          user_id: user.id, // Explicitly set the user_id
          is_favorite: false,
          archived: false
        }])
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Get user's brands
  async getUserBrands(): Promise<Brand[]> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('archived', false)
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    })
  },

  // Get archived brands
  async getArchivedBrands(): Promise<Brand[]> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('archived', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    })
  },

  // Get brand by ID
  async getBrand(id: string): Promise<Brand | null> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      return data
    })
  },

  // Update brand
  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Toggle favorite status
  async toggleFavorite(id: string, isFavorite: boolean): Promise<Brand> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Archive brand
  async archiveBrand(id: string): Promise<Brand> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .update({ archived: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Restore brand from archive
  async restoreBrand(id: string): Promise<Brand> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('brands')
        .update({ archived: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Duplicate brand
  async duplicateBrand(id: string): Promise<Brand> {
    // First get the original brand
    const original = await this.getBrand(id)
    if (!original) throw new Error('Brand not found')

    // Create a new brand with similar name
    const newBrand = await this.createBrand(`${original.name} (Copy)`)

    // Get all strategy sections
    const sections = await this.getStrategySections(id)
    
    // Copy each section to the new brand
    for (const section of sections) {
      await this.saveStrategySection(
        newBrand.id,
        section.section_type,
        section.content,
        section.completed
      )
    }

    // Get visual assets
    const { visualService } = await import('./visualService')
    const visualAssets = await visualService.getVisualAssets(id)
    
    // Copy each visual asset
    for (const asset of visualAssets) {
      await visualService.saveVisualAsset(
        newBrand.id,
        asset.asset_type as any,
        asset.asset_data
      )
    }

    // Copy brand voice if exists
    const brandVoice = await visualService.getBrandVoice(id)
    if (brandVoice) {
      await visualService.saveBrandVoice(newBrand.id, {
        tone_scales: brandVoice.tone_scales,
        messaging: brandVoice.messaging,
        guidelines: brandVoice.guidelines
      })
    }

    // Copy guidelines if exists
    try {
      const { guidelinesService } = await import('./guidelinesService')
      const guidelines = await guidelinesService.getGuidelines(id)
      if (guidelines) {
        await guidelinesService.saveGuidelines(newBrand.id, guidelines.content)
      }
    } catch (error) {
      console.error('Error copying guidelines:', error)
    }

    return newBrand
  },

  // Delete brand permanently
  async deleteBrand(id: string): Promise<void> {
    return withRetry(async () => {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id)

      if (error) throw error
    })
  },

  // Get strategy sections for a brand
  async getStrategySections(brandId: string): Promise<StrategySection[]> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('strategy_sections')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    })
  },

  // Save strategy section
  async saveStrategySection(
    brandId: string,
    sectionType: string,
    content: Record<string, any>,
    completed: boolean = false
  ): Promise<StrategySection> {
    // First, try to update existing section
    const existing = await withRetry(async () => {
      const { data } = await supabase
        .from('strategy_sections')
        .select('id')
        .eq('brand_id', brandId)
        .eq('section_type', sectionType)
        .maybeSingle()
      return data
    })

    if (existing) {
      // Update existing section
      return withRetry(async () => {
        const { data, error } = await supabase
          .from('strategy_sections')
          .update({ content, completed })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      })
    } else {
      // Create new section
      return withRetry(async () => {
        const { data, error } = await supabase
          .from('strategy_sections')
          .insert([{
            brand_id: brandId,
            section_type: sectionType,
            content,
            completed
          }])
          .select()
          .single()

        if (error) throw error
        return data
      })
    }
  },

  // Get brand progress with detailed breakdown
  async getBrandProgress(brandId: string): Promise<{ 
    strategy: { completed: number; total: number; percentage: number }
    visual: { completed: number; total: number; percentage: number }
    voice: { completed: number; total: number; percentage: number }
    guidelines: { completed: number; total: number; percentage: number }
    consistency: { completed: number; total: number; percentage: number }
    health: { completed: number; total: number; percentage: number }
    overall: { completed: number; total: number; percentage: number }
  }> {
    try {
      const [sections, visualAssets, brandVoice, guidelines, complianceChecks, brandHealth] = await Promise.all([
        this.getStrategySections(brandId),
        withRetry(async () => supabase.from('visual_assets').select('*').eq('brand_id', brandId)),
        withRetry(async () => supabase.from('brand_voice').select('*').eq('brand_id', brandId).maybeSingle()),
        withRetry(async () => supabase.from('brand_guidelines').select('*').eq('brand_id', brandId).maybeSingle()),
        withRetry(async () => supabase.from('compliance_checks').select('*').eq('brand_id', brandId)),
        withRetry(async () => supabase.from('brand_health_scores').select('*').eq('brand_id', brandId).maybeSingle())
      ])

      // Strategy progress (5 sections)
      const strategyTotal = 5
      const strategyCompleted = sections.filter(section => section.completed).length
      const strategyPercentage = Math.round((strategyCompleted / strategyTotal) * 100)

      // Visual progress (3 asset types: logo, color_palette, typography)
      const visualTotal = 3
      const visualData = visualAssets.data || []
      const hasLogo = visualData.some(a => a.asset_type === 'logo')
      const hasColors = visualData.some(a => a.asset_type === 'color_palette')
      const hasTypography = visualData.some(a => a.asset_type === 'typography')
      const visualCompleted = [hasLogo, hasColors, hasTypography].filter(Boolean).length
      const visualPercentage = Math.round((visualCompleted / visualTotal) * 100)

      // Voice progress (1 section)
      const voiceTotal = 1
      const voiceCompleted = brandVoice.data ? 1 : 0
      const voicePercentage = Math.round((voiceCompleted / voiceTotal) * 100)

      // Guidelines progress (1 section)
      const guidelinesTotal = 1
      const guidelinesCompleted = guidelines.data ? 1 : 0
      const guidelinesPercentage = Math.round((guidelinesCompleted / guidelinesTotal) * 100)

      // Consistency progress (1 section)
      const consistencyTotal = 1
      const consistencyCompleted = (complianceChecks.data && complianceChecks.data.length > 0) ? 1 : 0
      const consistencyPercentage = Math.round((consistencyCompleted / consistencyTotal) * 100)

      // Health progress (1 section)
      const healthTotal = 1
      const healthCompleted = brandHealth.data ? 1 : 0
      const healthPercentage = Math.round((healthCompleted / healthTotal) * 100)

      // Overall progress
      const overallTotal = strategyTotal + visualTotal + voiceTotal + guidelinesTotal + consistencyTotal + healthTotal
      const overallCompleted = strategyCompleted + visualCompleted + voiceCompleted + guidelinesCompleted + consistencyCompleted + healthCompleted
      const overallPercentage = Math.round((overallCompleted / overallTotal) * 100)

      return {
        strategy: { completed: strategyCompleted, total: strategyTotal, percentage: strategyPercentage },
        visual: { completed: visualCompleted, total: visualTotal, percentage: visualPercentage },
        voice: { completed: voiceCompleted, total: voiceTotal, percentage: voicePercentage },
        guidelines: { completed: guidelinesCompleted, total: guidelinesTotal, percentage: guidelinesPercentage },
        consistency: { completed: consistencyCompleted, total: consistencyTotal, percentage: consistencyPercentage },
        health: { completed: healthCompleted, total: healthTotal, percentage: healthPercentage },
        overall: { completed: overallCompleted, total: overallTotal, percentage: overallPercentage }
      }
    } catch (error) {
      console.error('Error calculating brand progress:', error)
      // Return default values in case of error
      return {
        strategy: { completed: 0, total: 5, percentage: 0 },
        visual: { completed: 0, total: 3, percentage: 0 },
        voice: { completed: 0, total: 1, percentage: 0 },
        guidelines: { completed: 0, total: 1, percentage: 0 },
        consistency: { completed: 0, total: 1, percentage: 0 },
        health: { completed: 0, total: 1, percentage: 0 },
        overall: { completed: 0, total: 12, percentage: 0 }
      }
    }
  },

  // Get strategy form data
  async getStrategyFormData(brandId: string): Promise<Partial<StrategyFormData>> {
    try {
      const sections = await this.getStrategySections(brandId)
      const formData: Partial<StrategyFormData> = {}

      sections.forEach(section => {
        if (section.section_type === 'purpose') {
          formData.purpose = section.content as StrategyFormData['purpose']
        } else if (section.section_type === 'values') {
          formData.values = section.content as StrategyFormData['values']
        } else if (section.section_type === 'audience') {
          formData.audience = section.content as StrategyFormData['audience']
        } else if (section.section_type === 'competitive') {
          formData.competitive = section.content as StrategyFormData['competitive']
        } else if (section.section_type === 'archetype') {
          formData.archetype = section.content as StrategyFormData['archetype']
        }
      })

      return formData
    } catch (error) {
      console.error('Error loading strategy form data:', error)
      return {}
    }
  },

  // Check if strategy is complete
  async isStrategyComplete(brandId: string): Promise<boolean> {
    try {
      const sections = await this.getStrategySections(brandId)
      const requiredSections = ['purpose', 'values', 'audience', 'competitive', 'archetype']
      
      return requiredSections.every(sectionType => 
        sections.some(section => 
          section.section_type === sectionType && 
          section.completed &&
          section.content &&
          Object.keys(section.content).length > 0
        )
      )
    } catch (error) {
      console.error('Error checking strategy completion:', error)
      return false
    }
  }
}