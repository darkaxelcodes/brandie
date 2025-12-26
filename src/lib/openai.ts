const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase configuration not found. AI suggestions will be disabled.')
}

export interface AIResponse {
  suggestions: string[]
  explanation?: string
}

export const generateStrategySuggestions = async (
  sectionType: string,
  context: Record<string, any>
): Promise<AIResponse> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration not found')
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        sectionType,
        context
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`AI suggestions error: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    throw error
  }
}

export const generateLogoImages = async (prompt: string, count: number = 4): Promise<string[]> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration not found')
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        prompt,
        count: Math.min(count, 1)
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Image generation error: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    return data.images
  } catch (error) {
    console.error('Error generating DALL-E images:', error)
    throw error
  }
}

export const generateIndustryAnalysis = async (
  industry: string,
  analysisType: 'trends' | 'competitors' | 'audience' | 'challenges' | 'opportunities'
): Promise<AIResponse> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration not found')
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        industry,
        analysisType,
        maxTokens: 1200
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Industry analysis error: ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error generating ${industry} ${analysisType} analysis:`, error)
    throw error
  }
}