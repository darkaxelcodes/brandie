export interface BrandContext {
  brand_identity: {
    name: string
    industry: string
    industry_segment?: string
  }
  brand_strategy: {
    purpose: {
      mission: string
      vision: string
      why: string
    }
    values: {
      core_values: string[]
      positioning: string
      unique_value: string
    }
    audience: {
      primary: string
      demographics: string
      psychographics: string
      pain_points: string[]
    }
    competitive: {
      advantage: string
      market_gap: string
      differentiation?: string
      direct_competitors?: string[]
    }
    archetype: {
      primary: string
      secondary?: string
      reasoning: string
    }
  }
}

export interface VisualPreferences {
  selected_style: LogoStyle
  mood: string[]
  avoid?: string[]
  logo_type_preference?: LogoType
}

export type LogoStyle = 'minimal' | 'modern' | 'classic' | 'playful' | 'bold' | 'organic'

export type LogoType = 'wordmark' | 'lettermark' | 'pictorial' | 'abstract' | 'mascot' | 'combination'

export type ImageQuality = 'low' | 'medium' | 'high' | 'auto'

export type ImageSize = '1024x1024' | '1024x1536' | '1536x1024' | 'auto'

export type ImageBackground = 'transparent' | 'opaque' | 'auto'

export type ImageFormat = 'png' | 'jpeg' | 'webp'

export interface GenerationOptions {
  count: number
  size: ImageSize
  quality: ImageQuality
  background: ImageBackground
  format: ImageFormat
}

export interface LogoGenerationRequest {
  brand_context: BrandContext
  visual_preferences: VisualPreferences
  generation_options: GenerationOptions
}

export interface GeneratedLogo {
  id: string
  variant: string
  style: LogoStyle
  image_data: {
    base64: string
    url?: string
    format: ImageFormat
    size: string
    has_transparency: boolean
  }
  metadata: {
    revised_prompt?: string
    generation_params: Record<string, unknown>
  }
}

export interface PromptInfo {
  original_request: string
  enhanced_prompt: string
  revised_prompt?: string
  context_used: string[]
}

export interface GenerationMetadata {
  model: string
  quality: ImageQuality
  size: ImageSize
  tokens_used?: number
  generation_time_ms?: number
}

export interface LogoGenerationResponse {
  success: boolean
  generation_id: string
  logos: GeneratedLogo[]
  prompt_info: PromptInfo
  metadata: GenerationMetadata
  error?: string
}

export interface ArchetypeVisuals {
  colors: string[]
  shapes: string[]
  typography: string
  mood: string[]
  symbols: string[]
  avoid: string[]
}

export interface StyleVisuals {
  description: string
  characteristics: string[]
  technical_notes: string[]
}

export interface VisualKeywords {
  primary_mood: string[]
  secondary_mood: string[]
  shapes: string[]
  symbols: string[]
  colors_suggested: string[]
  typography_style: string
  avoid: string[]
}

export interface LogoPrompt {
  full_prompt: string
  sections: {
    brand_context: string
    visual_direction: string
    requirements: string
    constraints: string
    technical_specs: string
  }
  generation_params: {
    model: string
    size: ImageSize
    quality: ImageQuality
    background: ImageBackground
    format: ImageFormat
    n: number
  }
}

export interface LogoPromptContext {
  brand: BrandContext
  preferences: VisualPreferences
  options: GenerationOptions
}
