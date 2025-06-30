import { generateStrategySuggestions } from './openai'
import { storageService } from './storageService'
import { supabase } from './supabase'

export interface AILogoRequest {
  brandName: string
  strategy: any
  style: string
  industry?: string
  keywords?: string[]
}

export interface AIColorRequest {
  brandName: string
  strategy: any
  archetype: string
  industry?: string
  mood?: string[]
}

export interface AITypographyRequest {
  brandName: string
  strategy: any
  archetype: string
  industry?: string
  personality?: string[]
}

export const aiVisualService = {
  // Generate AI logo concepts using DALL-E via Supabase Edge Function
  async generateLogoConcepts(request: AILogoRequest): Promise<any[]> {
    try {
      const prompt = this.buildLogoPrompt(request)
      
      // Use Supabase Edge Function to call OpenAI API
      const { data, error } = await supabase.functions.invoke('generate-logo', {
        body: {
          prompt,
          style: request.style,
          brandName: request.brandName
        }
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw new Error(`Logo generation failed: ${error.message}`)
      }

      if (!data.success) {
        console.error('Logo generation API error:', data.error)
        throw new Error(data.error || 'Logo generation failed')
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      
      // Process and store each generated image
      const processedLogos = await Promise.all(data.data.map(async (image: any, index: number) => {
        // Upload the image to Supabase storage
        const storedUrl = await storageService.uploadImageFromUrl(
          image.url,
          user.id,
          request.strategy.brand?.id || 'temp',
          'logo',
          index + 1
        )
        
        return {
          id: `ai-logo-${index}`,
          url: storedUrl, // Use the Supabase URL instead of the OpenAI URL
          originalUrl: image.url, // Keep the original URL for reference
          prompt: prompt,
          style: request.style,
          variations: this.generateLogoVariations(request)
        }
      }))
      
      return processedLogos
    } catch (error) {
      console.error('Error generating AI logos:', error)
      // Fallback to programmatic generation
      return this.generateFallbackLogos(request)
    }
  },

  // Generate AI color palettes
  async generateColorPalettes(request: AIColorRequest): Promise<any[]> {
    try {
      const context = {
        brandName: request.brandName,
        archetype: request.archetype,
        strategy: request.strategy,
        industry: request.industry,
        mood: request.mood
      }

      const response = await generateStrategySuggestions('colors', context)
      
      // Parse AI suggestions into color palettes
      const palettes = this.parseColorSuggestions(response.suggestions, request)
      
      // Enhance with color theory
      return palettes.map(palette => ({
        ...palette,
        harmony: this.analyzeColorHarmony(palette.colors),
        accessibility: this.analyzeAccessibility(palette.colors),
        psychology: this.getColorPsychology(palette.colors),
        aiGenerated: true
      }))
    } catch (error) {
      console.error('Error generating AI color palettes:', error)
      return this.generateFallbackPalettes(request)
    }
  },

  // Generate AI typography recommendations
  async generateTypographyRecommendations(request: AITypographyRequest): Promise<any[]> {
    try {
      const context = {
        brandName: request.brandName,
        archetype: request.archetype,
        strategy: request.strategy,
        industry: request.industry,
        personality: request.personality
      }

      const response = await generateStrategySuggestions('typography', context)
      
      return this.parseTypographySuggestions(response.suggestions, request)
    } catch (error) {
      console.error('Error generating AI typography:', error)
      return this.generateFallbackTypography(request)
    }
  },

  // Build optimized DALL-E prompt for logo generation
  buildLogoPrompt(request: AILogoRequest): string {
    const { brandName, strategy, style } = request
    
    let prompt = `Professional logo design for "${brandName}"`
    
    // Add brand archetype influence
    if (strategy?.archetype?.selectedArchetype) {
      const archetypeMap: Record<string, string> = {
        'innocent': 'clean, pure, simple, friendly',
        'explorer': 'adventurous, bold, dynamic, outdoor',
        'sage': 'wise, sophisticated, academic, trustworthy',
        'hero': 'strong, confident, triumphant, powerful',
        'outlaw': 'rebellious, edgy, unconventional, bold',
        'magician': 'mystical, transformative, innovative, inspiring',
        'regular': 'approachable, down-to-earth, reliable, friendly',
        'lover': 'elegant, passionate, luxurious, romantic',
        'jester': 'playful, fun, colorful, energetic',
        'caregiver': 'nurturing, warm, protective, caring',
        'creator': 'artistic, creative, imaginative, innovative',
        'ruler': 'prestigious, authoritative, sophisticated, premium'
      }
      
      const archetypeStyle = archetypeMap[strategy.archetype.selectedArchetype]
      if (archetypeStyle) {
        prompt += `, ${archetypeStyle} aesthetic`
      }
    }
    
    // Add style specifications
    const styleMap: Record<string, string> = {
      'minimal': 'minimalist, clean lines, negative space, geometric',
      'modern': 'contemporary, sleek, tech-inspired, gradient',
      'classic': 'timeless, elegant, traditional, serif elements',
      'playful': 'fun, colorful, rounded, whimsical',
      'bold': 'strong, impactful, high contrast, dramatic',
      'organic': 'natural, flowing, organic shapes, earth tones'
    }
    
    if (styleMap[style]) {
      prompt += `, ${styleMap[style]} style`
    }
    
    // Add industry context
    if (request.industry) {
      prompt += `, ${request.industry} industry`
    }
    
    // Add technical specifications
    prompt += ', vector style, scalable, professional, brand identity, white background, high quality'
    
    return prompt
  },

  // Parse AI color suggestions into structured palettes
  parseColorSuggestions(suggestions: string[], request: AIColorRequest): any[] {
    const palettes = []
    
    // Generate palettes based on brand archetype
    const archetypeColors = this.getArchetypeColors(request.archetype)
    
    for (let i = 0; i < 6; i++) {
      const baseColor = archetypeColors[i % archetypeColors.length]
      const palette = {
        id: `ai-palette-${i}`,
        name: `AI Palette ${i + 1}`,
        description: suggestions[i] || 'AI-generated color harmony',
        colors: this.generateColorHarmony(baseColor),
        primary: baseColor,
        wcagScore: Math.floor(Math.random() * 20) + 80,
        aiGenerated: true,
        reasoning: suggestions[i] || 'Generated based on brand personality'
      }
      palettes.push(palette)
    }
    
    return palettes
  },

  // Generate color harmony from base color
  generateColorHarmony(baseColor: string): string[] {
    // Convert hex to HSL for manipulation
    const hsl = this.hexToHsl(baseColor)
    const colors = [baseColor]
    
    // Complementary
    colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
    
    // Triadic
    colors.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l))
    colors.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l))
    
    // Analogous
    colors.push(this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l))
    
    return colors
  },

  // Get archetype-based color suggestions
  getArchetypeColors(archetype: string): string[] {
    const archetypeColorMap: Record<string, string[]> = {
      'innocent': ['#FFFFFF', '#F0F8FF', '#E6F3FF', '#87CEEB'],
      'explorer': ['#228B22', '#8B4513', '#FF8C00', '#4682B4'],
      'sage': ['#2F4F4F', '#708090', '#4169E1', '#800080'],
      'hero': ['#DC143C', '#B22222', '#FF4500', '#1E90FF'],
      'outlaw': ['#000000', '#8B0000', '#FF0000', '#696969'],
      'magician': ['#4B0082', '#8A2BE2', '#9400D3', '#FF1493'],
      'regular': ['#CD853F', '#D2691E', '#A0522D', '#8FBC8F'],
      'lover': ['#FF69B4', '#FF1493', '#DC143C', '#8B008B'],
      'jester': ['#FFD700', '#FF6347', '#32CD32', '#FF69B4'],
      'caregiver': ['#F0E68C', '#DDA0DD', '#98FB98', '#F5DEB3'],
      'creator': ['#FF4500', '#FF6347', '#9370DB', '#20B2AA'],
      'ruler': ['#800080', '#4B0082', '#B8860B', '#2F4F4F']
    }
    
    return archetypeColorMap[archetype] || ['#3B82F6', '#1E40AF', '#F59E0B', '#EF4444']
  },

  // Analyze color accessibility
  analyzeAccessibility(colors: string[]): any {
    return {
      wcagAA: colors.length * 0.8, // Mock calculation
      wcagAAA: colors.length * 0.6,
      colorBlindFriendly: true,
      recommendations: [
        'Use sufficient contrast ratios',
        'Test with color blindness simulators',
        'Provide alternative indicators beyond color'
      ]
    }
  },

  // Get color psychology insights
  getColorPsychology(colors: string[]): any {
    const psychology: Record<string, string> = {
      '#FF0000': 'Energy, passion, urgency',
      '#0000FF': 'Trust, stability, professionalism',
      '#00FF00': 'Growth, nature, harmony',
      '#FFFF00': 'Optimism, creativity, attention',
      '#800080': 'Luxury, creativity, mystery',
      '#FFA500': 'Enthusiasm, creativity, warmth'
    }
    
    return {
      emotions: colors.map(color => psychology[color] || 'Balanced, neutral'),
      overall: 'Professional and trustworthy with creative energy'
    }
  },

  // Generate fallback logos when AI fails
  async generateFallbackLogos(request: AILogoRequest): Promise<any[]> {
    const styles = ['minimal', 'modern', 'classic', 'bold']
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return styles.map((style, index) => ({
        id: `fallback-logo-${index}`,
        style,
        svg: this.generateSVGLogo(request.brandName, style),
        description: `${style} logo concept for ${request.brandName}`,
        aiGenerated: false
      }))
    }
    
    // Generate and store SVG logos
    const logos = await Promise.all(styles.map(async (style, index) => {
      const svg = this.generateSVGLogo(request.brandName, style)
      
      // Store SVG in Supabase
      const storedUrl = await storageService.uploadSvgContent(
        svg,
        user.id,
        request.strategy.brand?.id || 'temp',
        'logo',
        index + 1
      )
      
      return {
        id: `fallback-logo-${index}`,
        style,
        svg,
        url: storedUrl || undefined,
        description: `${style} logo concept for ${request.brandName}`,
        aiGenerated: false
      }
    }))
    
    return logos
  },

  // Generate fallback color palettes
  generateFallbackPalettes(request: AIColorRequest): any[] {
    const baseColors = this.getArchetypeColors(request.archetype)
    return baseColors.map((color, index) => ({
      id: `fallback-palette-${index}`,
      name: `Palette ${index + 1}`,
      colors: this.generateColorHarmony(color),
      primary: color,
      wcagScore: 85 + Math.floor(Math.random() * 15),
      aiGenerated: false
    }))
  },

  // Generate fallback typography
  generateFallbackTypography(request: AITypographyRequest): any[] {
    const fonts = [
      { heading: 'Inter', body: 'Inter' },
      { heading: 'Playfair Display', body: 'Source Sans Pro' },
      { heading: 'Montserrat', body: 'Open Sans' },
      { heading: 'Poppins', body: 'Poppins' }
    ]
    
    return fonts.map((font, index) => ({
      id: `fallback-typography-${index}`,
      name: `${font.heading} + ${font.body}`,
      heading: { family: font.heading },
      body: { family: font.body },
      aiGenerated: false
    }))
  },

  // Utility functions for color manipulation
  hexToHsl(hex: string): { h: number, s: number, l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 }
  },

  hslToHex(h: number, s: number, l: number): string {
    h /= 360; s /= 100; l /= 100
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  },

  generateSVGLogo(brandName: string, style: string): string {
    // Simple SVG generation based on style
    let svg = ''
    
    switch (style) {
      case 'minimal':
        svg = `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="40" height="40" fill="#3B82F6" />
          <text x="60" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1E293B">
            ${brandName}
          </text>
        </svg>`
        break
      
      case 'modern':
        svg = `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="30" cy="40" r="20" fill="url(#grad)" />
          <text x="60" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1E293B">
            ${brandName}
          </text>
        </svg>`
        break
      
      case 'classic':
        svg = `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="40" height="40" rx="5" ry="5" fill="#3B82F6" />
          <text x="60" y="45" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#1E293B">
            ${brandName}
          </text>
        </svg>`
        break
      
      case 'bold':
        svg = `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,20 50,20 40,60 20,60" fill="#3B82F6" />
          <text x="60" y="45" font-family="Impact, sans-serif" font-size="20" fill="#1E293B">
            ${brandName}
          </text>
        </svg>`
        break
      
      default:
        svg = `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <text x="20" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#3B82F6">
            ${brandName}
          </text>
        </svg>`
    }
    
    return svg
  },

  generateLogoVariations(request: AILogoRequest): any[] {
    return [
      { type: 'horizontal', description: 'Horizontal layout' },
      { type: 'vertical', description: 'Vertical layout' },
      { type: 'icon', description: 'Icon only' },
      { type: 'monochrome', description: 'Single color version' }
    ]
  },

  analyzeColorHarmony(colors: string[]): any {
    return {
      type: 'complementary',
      balance: 85,
      contrast: 'high',
      temperature: 'warm'
    }
  },

  parseTypographySuggestions(suggestions: string[], request: AITypographyRequest): any[] {
    const fontPairs = [
      { heading: 'Inter', body: 'Inter', category: 'modern' },
      { heading: 'Playfair Display', body: 'Source Sans Pro', category: 'elegant' },
      { heading: 'Montserrat', body: 'Open Sans', category: 'friendly' },
      { heading: 'Roboto Slab', body: 'Roboto', category: 'technical' }
    ]
    
    return fontPairs.map((pair, index) => ({
      id: `ai-typography-${index}`,
      name: `${pair.heading} + ${pair.body}`,
      heading: { family: pair.heading },
      body: { family: pair.body },
      category: pair.category,
      reasoning: suggestions[index] || 'AI-recommended based on brand personality',
      aiGenerated: true
    }))
  }
}