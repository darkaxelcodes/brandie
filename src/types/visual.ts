export interface VisualAsset {
  id: string
  brand_id: string
  asset_type: 'logo' | 'color_palette' | 'typography'
  asset_data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface LogoStyle {
  id: string
  name: string
  description: string
  style: 'wordmark' | 'lettermark' | 'pictorial' | 'abstract' | 'mascot' | 'combination'
  preview?: string
}

export interface ColorPalette {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  neutral: string[]
  description?: string
  wcagScore?: number
}

export interface Typography {
  id: string
  name: string
  heading: {
    family: string
    weights: number[]
    fallback: string
  }
  body: {
    family: string
    weights: number[]
    fallback: string
  }
  description?: string
}

export interface BrandVoice {
  id: string
  brand_id: string
  tone_scales: {
    formalCasual: number
    logicalEmotional: number
    playfulSerious: number
    traditionalInnovative: number
  }
  messaging: {
    tagline: string
    elevatorPitch: string
    keyMessages: string[]
  }
  guidelines: {
    dosList: string[]
    dontsList: string[]
    exampleContent: string
  }
  created_at: string
  updated_at: string
}

// Re-export Brand from brand types to avoid conflicts
export type { Brand } from './brand'