export interface Brand {
  id: string
  name: string
  user_id: string
  is_favorite?: boolean
  archived?: boolean
  industry?: string
  industry_details?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface StrategySection {
  id: string
  brand_id: string
  section_type: 'purpose' | 'values' | 'audience' | 'competitive' | 'archetype'
  content: Record<string, any>
  completed: boolean
  created_at: string
  updated_at: string
}

export interface BrandArchetype {
  id: string
  name: string
  description: string
  traits: string[]
  examples: string[]
}

export interface StrategyFormData {
  purpose: {
    mission: string
    vision: string
    why: string
  }
  values: {
    coreValues: string[]
    positioning: string
    uniqueValue: string
  }
  audience: {
    primaryAudience: string
    demographics: string
    psychographics: string
    painPoints: string[]
  }
  competitive: {
    directCompetitors: string[]
    indirectCompetitors: string[]
    competitiveAdvantage: string
    marketGap: string
  }
  archetype: {
    selectedArchetype: string
    reasoning: string
  }
}

export interface IndustrySuggestion {
  id: string
  industry: string
  suggestion_type: 'purpose' | 'values' | 'audience' | 'competitive' | 'archetype' | 'voice' | 'visual'
  content: Record<string, any>
  relevance: number
  created_at: string
  updated_at: string
}

export interface BrandHealth {
  overall_score: number
  consistency_score: number
  completeness_score: number
  uniqueness_score: number
  relevance_score: number
  details: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
  }
}