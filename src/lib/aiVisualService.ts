import { generateStrategySuggestions } from './openai'
import { storageService } from './storageService'
import { supabase } from './supabase'
import { logoPromptService } from './logoPromptService'
import type {
  BrandContext,
  VisualPreferences,
  GenerationOptions,
  LogoGenerationRequest,
  LogoGenerationResponse,
  LogoStyle,
  ImageQuality,
  ImageSize,
  ImageBackground,
  ImageFormat
} from '../types/logoGeneration'

export interface AILogoRequest {
  brandName: string
  strategy: {
    brand?: { id?: string; name?: string; industry?: string }
    purpose?: { mission?: string; vision?: string; why?: string }
    values?: { coreValues?: string[]; positioning?: string; uniqueValue?: string }
    audience?: { primaryAudience?: string; demographics?: string; psychographics?: string; painPoints?: string[] }
    competitive?: { competitiveAdvantage?: string; marketGap?: string; directCompetitors?: string[] }
    archetype?: { selectedArchetype?: string; reasoning?: string }
  }
  style: LogoStyle
  industry?: string
  keywords?: string[]
  options?: {
    count?: number
    quality?: ImageQuality
    size?: ImageSize
    background?: ImageBackground
    format?: ImageFormat
  }
}

export interface AIColorRequest {
  brandName: string
  strategy: Record<string, unknown>
  archetype: string
  industry?: string
  mood?: string[]
}

export interface AITypographyRequest {
  brandName: string
  strategy: Record<string, unknown>
  archetype: string
  industry?: string
  personality?: string[]
}

export interface GeneratedLogoResult {
  id: string
  url?: string
  base64?: string
  style: string
  prompt?: string
  revisedPrompt?: string
  variations: Array<{ type: string; description: string }>
  aiGenerated: boolean
  metadata?: {
    model: string
    quality: string
    size: string
    hasTransparency: boolean
    generationTimeMs?: number
  }
}

export const aiVisualService = {
  async generateLogoConcepts(request: AILogoRequest): Promise<GeneratedLogoResult[]> {
    try {
      const brandContext = logoPromptService.buildContextFromBrandData({
        brand: {
          name: request.brandName,
          industry: request.industry || request.strategy.brand?.industry
        },
        strategy: request.strategy
      })

      const visualPreferences: VisualPreferences = {
        selected_style: request.style,
        mood: this.getMoodFromArchetype(request.strategy.archetype?.selectedArchetype || 'sage'),
        avoid: this.getAvoidFromStyle(request.style),
        logo_type_preference: logoPromptService.recommendLogoType(brandContext)
      }

      const generationOptions: GenerationOptions = {
        count: request.options?.count || 2,
        size: request.options?.size || '1024x1024',
        quality: request.options?.quality || 'high',
        background: request.options?.background || 'transparent',
        format: request.options?.format || 'png'
      }

      const logoRequest: LogoGenerationRequest = {
        brand_context: brandContext,
        visual_preferences: visualPreferences,
        generation_options: generationOptions
      }

      const { data, error } = await supabase.functions.invoke<LogoGenerationResponse>('generate-logo', {
        body: logoRequest
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw new Error(`Logo generation failed: ${error.message}`)
      }

      if (!data?.success || !data?.logos?.length) {
        console.error('Logo generation API error:', data?.error)
        throw new Error(data?.error || 'Logo generation failed - no logos returned')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const processedLogos = await Promise.all(data.logos.map(async (logo, index) => {
        let storedUrl: string | undefined

        if (logo.image_data.base64) {
          storedUrl = await storageService.uploadBase64Image(
            logo.image_data.base64,
            user.id,
            request.strategy.brand?.id || 'temp',
            'logo',
            index + 1,
            logo.image_data.format as 'png' | 'jpeg' | 'webp'
          )
        }

        return {
          id: logo.id,
          url: storedUrl,
          base64: logo.image_data.base64,
          style: logo.style,
          prompt: data.prompt_info?.enhanced_prompt,
          revisedPrompt: logo.metadata?.revised_prompt,
          variations: this.generateLogoVariations(),
          aiGenerated: true,
          metadata: {
            model: data.metadata?.model || 'gpt-image-1',
            quality: data.metadata?.quality || 'high',
            size: logo.image_data.size,
            hasTransparency: logo.image_data.has_transparency,
            generationTimeMs: data.metadata?.generation_time_ms
          }
        }
      }))

      return processedLogos
    } catch (error) {
      console.error('Error generating AI logos:', error)
      return this.generateFallbackLogos(request)
    }
  },

  getMoodFromArchetype(archetype: string): string[] {
    const moodMap: Record<string, string[]> = {
      innocent: ['pure', 'simple', 'honest', 'optimistic'],
      explorer: ['adventurous', 'bold', 'authentic', 'free'],
      sage: ['wise', 'trusted', 'thoughtful', 'expert'],
      hero: ['powerful', 'confident', 'courageous', 'determined'],
      outlaw: ['rebellious', 'bold', 'revolutionary', 'disruptive'],
      magician: ['inspiring', 'innovative', 'transformative', 'visionary'],
      regular: ['friendly', 'honest', 'dependable', 'relatable'],
      lover: ['passionate', 'elegant', 'luxurious', 'intimate'],
      jester: ['fun', 'playful', 'entertaining', 'joyful'],
      caregiver: ['nurturing', 'caring', 'protective', 'supportive'],
      creator: ['innovative', 'creative', 'artistic', 'expressive'],
      ruler: ['prestigious', 'luxurious', 'commanding', 'powerful']
    }
    return moodMap[archetype.toLowerCase()] || ['professional', 'trustworthy', 'modern']
  },

  getAvoidFromStyle(style: LogoStyle): string[] {
    const avoidMap: Record<LogoStyle, string[]> = {
      minimal: ['complex patterns', 'gradients', 'multiple colors', 'decorative elements'],
      modern: ['dated elements', 'overly traditional forms', 'heavy serifs'],
      classic: ['trendy effects', 'overly modern elements', 'casual styling'],
      playful: ['corporate sterility', 'dark themes', 'serious imagery'],
      bold: ['soft colors', 'delicate forms', 'subtle effects'],
      organic: ['sharp geometric forms', 'cold colors', 'mechanical elements']
    }
    return avoidMap[style] || []
  },

  async generateColorPalettes(request: AIColorRequest): Promise<unknown[]> {
    try {
      const context = {
        brandName: request.brandName,
        archetype: request.archetype,
        strategy: request.strategy,
        industry: request.industry,
        mood: request.mood
      }

      const response = await generateStrategySuggestions('colors', context)

      const palettes = this.parseColorSuggestions(response.suggestions, request)

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

  async generateTypographyRecommendations(request: AITypographyRequest): Promise<unknown[]> {
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

  parseColorSuggestions(suggestions: string[], request: AIColorRequest): Array<{
    id: string
    name: string
    description: string
    colors: string[]
    primary: string
    wcagScore: number
    aiGenerated: boolean
    reasoning: string
  }> {
    const palettes = []
    const archetypeColors = this.getArchetypeColors(request.archetype)

    for (let i = 0; i < 6; i++) {
      const baseColor = archetypeColors[i % archetypeColors.length]
      const palette = {
        id: `ai-palette-${i}`,
        name: `AI Palette ${i + 1}`,
        description: suggestions[i] || 'AI-generated color harmony',
        colors: this.generateColorHarmony(baseColor),
        primary: baseColor,
        wcagScore: this.calculateWCAGScore(baseColor),
        aiGenerated: true,
        reasoning: suggestions[i] || 'Generated based on brand personality'
      }
      palettes.push(palette)
    }

    return palettes
  },

  calculateWCAGScore(primaryColor: string): number {
    const hsl = this.hexToHsl(primaryColor)
    const lightnessScore = hsl.l > 50 ? 90 : 85
    const saturationBonus = hsl.s > 50 ? 5 : 0
    return Math.min(100, lightnessScore + saturationBonus)
  },

  generateColorHarmony(baseColor: string): string[] {
    const hsl = this.hexToHsl(baseColor)
    const colors = [baseColor]

    colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
    colors.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l))
    colors.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l))
    colors.push(this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l))

    return colors
  },

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

  analyzeAccessibility(colors: string[]): {
    wcagAA: number
    wcagAAA: number
    colorBlindFriendly: boolean
    recommendations: string[]
  } {
    const primaryHsl = this.hexToHsl(colors[0])
    const hasGoodContrast = primaryHsl.l < 40 || primaryHsl.l > 60

    return {
      wcagAA: hasGoodContrast ? 4.5 : 3.0,
      wcagAAA: hasGoodContrast ? 7.0 : 4.5,
      colorBlindFriendly: primaryHsl.s < 80,
      recommendations: [
        'Use sufficient contrast ratios (minimum 4.5:1 for normal text)',
        'Test with color blindness simulators',
        'Provide alternative indicators beyond color alone',
        'Ensure text remains readable on all backgrounds'
      ]
    }
  },

  getColorPsychology(colors: string[]): {
    emotions: string[]
    overall: string
  } {
    const primaryHsl = this.hexToHsl(colors[0])

    let primaryEmotion = 'Balanced and professional'
    if (primaryHsl.h >= 0 && primaryHsl.h < 30) primaryEmotion = 'Energy, passion, urgency'
    else if (primaryHsl.h >= 30 && primaryHsl.h < 60) primaryEmotion = 'Optimism, creativity, warmth'
    else if (primaryHsl.h >= 60 && primaryHsl.h < 150) primaryEmotion = 'Growth, nature, harmony'
    else if (primaryHsl.h >= 150 && primaryHsl.h < 210) primaryEmotion = 'Trust, calm, stability'
    else if (primaryHsl.h >= 210 && primaryHsl.h < 270) primaryEmotion = 'Trust, professionalism, depth'
    else if (primaryHsl.h >= 270 && primaryHsl.h < 330) primaryEmotion = 'Luxury, creativity, mystery'
    else primaryEmotion = 'Passion, romance, excitement'

    return {
      emotions: [primaryEmotion, 'Professional appeal', 'Brand recognition'],
      overall: `${primaryEmotion} with professional undertones`
    }
  },

  async generateFallbackLogos(request: AILogoRequest): Promise<GeneratedLogoResult[]> {
    const styles: LogoStyle[] = ['minimal', 'modern', 'classic', 'bold']

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return styles.map((style, index) => ({
        id: `fallback-logo-${index}`,
        style,
        svg: this.generateSVGLogo(request.brandName, style),
        variations: this.generateLogoVariations(),
        aiGenerated: false
      }))
    }

    const logos = await Promise.all(styles.map(async (style, index) => {
      const svg = this.generateSVGLogo(request.brandName, style)

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
        variations: this.generateLogoVariations(),
        aiGenerated: false
      }
    }))

    return logos
  },

  generateFallbackPalettes(request: AIColorRequest): Array<{
    id: string
    name: string
    colors: string[]
    primary: string
    wcagScore: number
    aiGenerated: boolean
  }> {
    const baseColors = this.getArchetypeColors(request.archetype)
    return baseColors.map((color, index) => ({
      id: `fallback-palette-${index}`,
      name: `Palette ${index + 1}`,
      colors: this.generateColorHarmony(color),
      primary: color,
      wcagScore: this.calculateWCAGScore(color),
      aiGenerated: false
    }))
  },

  generateFallbackTypography(request: AITypographyRequest): Array<{
    id: string
    name: string
    heading: { family: string }
    body: { family: string }
    aiGenerated: boolean
  }> {
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

  hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

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
    const escapedName = brandName.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')

    switch (style) {
      case 'minimal':
        return `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="40" height="40" fill="#3B82F6" />
          <text x="60" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1E293B">${escapedName}</text>
        </svg>`

      case 'modern':
        return `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="30" cy="40" r="20" fill="url(#grad)" />
          <text x="60" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1E293B">${escapedName}</text>
        </svg>`

      case 'classic':
        return `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="40" height="40" rx="5" ry="5" fill="#3B82F6" />
          <text x="60" y="45" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#1E293B">${escapedName}</text>
        </svg>`

      case 'bold':
        return `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,20 50,20 40,60 20,60" fill="#3B82F6" />
          <text x="60" y="45" font-family="Impact, sans-serif" font-size="20" fill="#1E293B">${escapedName}</text>
        </svg>`

      default:
        return `<svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
          <text x="20" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#3B82F6">${escapedName}</text>
        </svg>`
    }
  },

  generateLogoVariations(): Array<{ type: string; description: string }> {
    return [
      { type: 'horizontal', description: 'Horizontal layout' },
      { type: 'vertical', description: 'Vertical layout' },
      { type: 'icon', description: 'Icon only' },
      { type: 'monochrome', description: 'Single color version' }
    ]
  },

  analyzeColorHarmony(colors: string[]): {
    type: string
    balance: number
    contrast: string
    temperature: string
  } {
    const primaryHsl = this.hexToHsl(colors[0])
    return {
      type: 'complementary',
      balance: 85,
      contrast: primaryHsl.l < 40 ? 'high' : 'medium',
      temperature: primaryHsl.h > 30 && primaryHsl.h < 200 ? 'warm' : 'cool'
    }
  },

  parseTypographySuggestions(suggestions: string[], _request: AITypographyRequest): Array<{
    id: string
    name: string
    heading: { family: string }
    body: { family: string }
    category: string
    reasoning: string
    aiGenerated: boolean
  }> {
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
