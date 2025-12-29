import { supabase } from './supabase'
import { VisualAsset, BrandVoice } from '../types/visual'

export const visualService = {
  // Visual Assets
  async getVisualAssets(brandId: string): Promise<VisualAsset[]> {
    try {
      const { data, error } = await supabase
        .from('visual_assets')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching visual assets:', error)
      return []
    }
  },

  async saveVisualAsset(
    brandId: string,
    assetType: 'logo' | 'color_palette' | 'typography',
    assetData: Record<string, any>
  ): Promise<VisualAsset> {
    try {
      // First, try to update existing asset
      const { data: existing } = await supabase
        .from('visual_assets')
        .select('id, version, version_history')
        .eq('brand_id', brandId)
        .eq('asset_type', assetType)
        .maybeSingle()

      if (existing) {
        // Update existing asset with version tracking
        const newVersion = existing.version + 1
        const versionHistory = existing.version_history || []
        
        // Add current version to history
        versionHistory.push({
          version: existing.version,
          timestamp: new Date().toISOString(),
          data: assetData
        })
        
        // Keep only the last 5 versions
        const trimmedHistory = versionHistory.slice(-5)
        
        const { data, error } = await supabase
          .from('visual_assets')
          .update({ 
            asset_data: assetData,
            version: newVersion,
            version_history: trimmedHistory
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new asset
        const { data, error } = await supabase
          .from('visual_assets')
          .insert([{
            brand_id: brandId,
            asset_type: assetType,
            asset_data: assetData,
            version: 1,
            version_history: []
          }])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error(`Error saving ${assetType}:`, error)
      throw error
    }
  },

  // Get asset version history
  async getAssetVersionHistory(assetId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('visual_assets')
        .select('version_history')
        .eq('id', assetId)
        .maybeSingle()

      if (error) throw error
      return data?.version_history || []
    } catch (error) {
      console.error('Error fetching asset version history:', error)
      return []
    }
  },

  // Restore previous version
  async restoreAssetVersion(assetId: string, version: number): Promise<VisualAsset> {
    try {
      // Get the asset with version history
      const { data: asset, error: assetError } = await supabase
        .from('visual_assets')
        .select('*')
        .eq('id', assetId)
        .maybeSingle()

      if (assetError) throw assetError
      if (!asset) throw new Error('Asset not found')
      
      // Find the version to restore
      const versionToRestore = asset.version_history.find((v: any) => v.version === version)
      if (!versionToRestore) {
        throw new Error(`Version ${version} not found`)
      }
      
      // Update the asset with the restored version data
      const { data, error } = await supabase
        .from('visual_assets')
        .update({ 
          asset_data: versionToRestore.data,
          version: asset.version + 1,
          // Add current version to history
          version_history: [
            ...asset.version_history,
            {
              version: asset.version,
              timestamp: new Date().toISOString(),
              data: asset.asset_data,
              note: 'Auto-saved before version restore'
            }
          ]
        })
        .eq('id', assetId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error restoring asset version:', error)
      throw error
    }
  },

  // Brand Voice
  async getBrandVoice(brandId: string): Promise<BrandVoice | null> {
    try {
      const { data, error } = await supabase
        .from('brand_voice')
        .select('*')
        .eq('brand_id', brandId)
        .maybeSingle()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching brand voice:', error)
      return null
    }
  },

  async saveBrandVoice(brandId: string, voiceData: Partial<BrandVoice>): Promise<BrandVoice> {
    try {
      // First, try to update existing voice
      const { data: existing } = await supabase
        .from('brand_voice')
        .select('id')
        .eq('brand_id', brandId)
        .maybeSingle()

      if (existing) {
        // Update existing voice
        const { data, error } = await supabase
          .from('brand_voice')
          .update(voiceData)
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new voice
        const { data, error } = await supabase
          .from('brand_voice')
          .insert([{
            brand_id: brandId,
            ...voiceData
          }])
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error saving brand voice:', error)
      throw error
    }
  },

  // Count total assets for a user
  async countUserAssets(userId: string): Promise<number> {
    try {
      // First get all brands for the user
      const { data: brands, error: brandsError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', userId)
      
      if (brandsError) throw brandsError
      if (!brands || brands.length === 0) return 0
      
      // Then count assets for each brand
      const brandIds = brands.map(brand => brand.id)
      
      const { count, error: countError } = await supabase
        .from('visual_assets')
        .select('*', { count: 'exact', head: true })
        .in('brand_id', brandIds)
      
      if (countError) throw countError
      return count || 0
    } catch (error) {
      console.error('Error counting user assets:', error)
      return 0
    }
  }
}