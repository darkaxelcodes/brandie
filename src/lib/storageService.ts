import { supabase } from './supabase'

export const storageService = {
  /**
   * Uploads an image from a URL to Supabase storage
   * @param imageUrl The URL of the image to upload
   * @param userId The user ID
   * @param brandId The brand ID
   * @param assetType The type of asset (e.g., 'logo', 'color_palette')
   * @param version The version of the asset
   * @returns The URL of the uploaded image in Supabase storage
   */
  async uploadImageFromUrl(
    imageUrl: string,
    userId: string,
    brandId: string,
    assetType: string,
    version: number = 1
  ): Promise<string> {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }
      
      const imageBlob = await response.blob()
      
      // Generate a unique file path
      const fileExtension = this.getFileExtensionFromBlob(imageBlob)
      const filePath = `${userId}/${brandId}/${assetType}/v${version}.${fileExtension}`
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('brand_assets')
        .upload(filePath, imageBlob, {
          upsert: true,
          contentType: imageBlob.type
        })
      
      if (error) throw error
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('brand_assets')
        .getPublicUrl(filePath)
      
      return publicUrlData.publicUrl
    } catch (error) {
      console.error('Error uploading image to Supabase storage:', error)
      // Re-throw the error instead of returning the original URL
      throw error
    }
  },
  
  /**
   * Get file extension from a blob
   */
  getFileExtensionFromBlob(blob: Blob): string {
    const mimeTypeToExtension: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/svg+xml': 'svg',
      'image/gif': 'gif',
      'image/webp': 'webp'
    }
    
    return mimeTypeToExtension[blob.type] || 'png'
  },
  
  /**
   * Uploads an SVG string to Supabase storage
   * @param svgContent The SVG content as a string
   * @param userId The user ID
   * @param brandId The brand ID
   * @param assetType The type of asset (e.g., 'logo')
   * @param version The version of the asset
   * @returns The URL of the uploaded SVG in Supabase storage
   */
  async uploadSvgContent(
    svgContent: string,
    userId: string,
    brandId: string,
    assetType: string,
    version: number = 1
  ): Promise<string> {
    try {
      // Convert SVG string to blob
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      
      // Generate a unique file path
      const filePath = `${userId}/${brandId}/${assetType}/v${version}.svg`
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('brand_assets')
        .upload(filePath, blob, {
          upsert: true,
          contentType: 'image/svg+xml'
        })
      
      if (error) throw error
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('brand_assets')
        .getPublicUrl(filePath)
      
      return publicUrlData.publicUrl
    } catch (error) {
      console.error('Error uploading SVG to Supabase storage:', error)
      // Re-throw the error instead of returning empty string
      throw error
    }
  }
}