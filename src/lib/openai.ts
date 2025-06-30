const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. AI suggestions will be disabled.')
}

export interface AIResponse {
  suggestions: string[]
  explanation?: string
}

export const generateStrategySuggestions = async (
  sectionType: string,
  context: Record<string, any>
): Promise<AIResponse> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  // Add industry context to the prompts if available
  const industryContext = context.industry 
    ? `for a ${context.industry} industry brand` 
    : ''

  const prompts = {
    purpose: `Based on this business context: ${JSON.stringify(context)}, suggest 3 compelling mission statements, 3 inspiring vision statements, and 3 "why" statements that explain the deeper purpose ${industryContext}. Focus on emotional connection and clarity.`,
    
    values: `For a business with this context: ${JSON.stringify(context)}, suggest 5-7 core values that would resonate with their audience, a positioning statement, and a unique value proposition ${industryContext}. Make them authentic and differentiating.`,
    
    audience: `Given this business context: ${JSON.stringify(context)}, help define the target audience ${industryContext} by suggesting: primary audience description, key demographics, psychographics, and 3-5 main pain points this business could solve.`,
    
    competitive: `For this business context: ${JSON.stringify(context)}, suggest potential direct competitors, indirect competitors, competitive advantages, and market gaps or opportunities ${industryContext}. Be specific and actionable.`,
    
    archetype: `Based on this brand context: ${JSON.stringify(context)}, recommend the most suitable brand archetype ${industryContext} from: The Innocent, The Explorer, The Sage, The Hero, The Outlaw, The Magician, The Regular Person, The Lover, The Jester, The Caregiver, The Creator, The Ruler. Explain why this archetype fits.`,

    colors: `Based on this brand context: ${JSON.stringify(context)}, suggest 6 different color palette concepts with psychological reasoning ${industryContext}. Consider the brand archetype, target audience, and industry. For each palette, explain the emotional impact and brand alignment. Include specific hex codes and palette names.`,

    typography: `Based on this brand context: ${JSON.stringify(context)}, recommend 4 typography pairings (heading + body font combinations) ${industryContext}. Consider readability, brand personality, target audience, and accessibility. Explain why each pairing works for this specific brand.`,

    voice: `Based on this brand context: ${JSON.stringify(context)}, suggest brand voice characteristics, tone guidelines, messaging frameworks, and communication style recommendations ${industryContext}. Consider the brand archetype and target audience.`,
    
    industry_analysis: `Provide a detailed industry analysis for ${context.industry || 'this business'} including: key trends, major players, typical customer expectations, common challenges, and opportunities for differentiation. Focus on actionable insights that can inform brand strategy.`,
    
    competitive_analysis: `Based on this business context: ${JSON.stringify(context)}, provide a detailed competitive analysis ${industryContext} including: key competitors' strengths and weaknesses, market positioning, typical messaging approaches, visual identity patterns, and opportunities for differentiation.`
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a world-class brand strategist and visual identity expert. You understand color psychology, typography science, brand archetypes, and consumer behavior. Provide practical, actionable suggestions that are specific to the business context. Format your response as clear, concise bullet points or structured recommendations. Pay special attention to industry-specific best practices for ${context.industry || 'the relevant industry'}.`
          },
          {
            role: 'user',
            content: prompts[sectionType as keyof typeof prompts]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    // Parse the response into suggestions
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^[-•*]\s*/, '').trim())
      .filter((suggestion: string) => suggestion.length > 0)

    return {
      suggestions: suggestions.slice(0, 8), // Limit to 8 suggestions
      explanation: 'AI-generated suggestions based on your brand context, industry best practices, and market trends'
    }
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    throw error
  }
}

// Generate DALL-E images for logos
export const generateLogoImages = async (prompt: string, count: number = 4): Promise<string[]> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: Math.min(count, 4), // DALL-E 3 supports max 4 images
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      })
    })

    if (!response.ok) {
      throw new Error(`DALL-E API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data.map((image: any) => image.url)
  } catch (error) {
    console.error('Error generating DALL-E images:', error)
    throw error
  }
}

// Generate industry-specific analysis
export const generateIndustryAnalysis = async (
  industry: string,
  analysisType: 'trends' | 'competitors' | 'audience' | 'challenges' | 'opportunities'
): Promise<AIResponse> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const prompts = {
    trends: `Provide a detailed analysis of current trends in the ${industry} industry. Focus on emerging technologies, changing consumer behaviors, regulatory shifts, and market dynamics that are shaping the industry landscape.`,
    
    competitors: `Identify and analyze the top competitors in the ${industry} industry. For each competitor, highlight their strengths, weaknesses, market positioning, unique selling propositions, and brand strategies.`,
    
    audience: `Describe the typical customer segments in the ${industry} industry. For each segment, provide demographics, psychographics, pain points, motivations, and decision-making factors.`,
    
    challenges: `Outline the major challenges facing businesses in the ${industry} industry. Consider operational, marketing, technological, regulatory, and competitive challenges.`,
    
    opportunities: `Identify key opportunities for differentiation and growth in the ${industry} industry. Focus on unmet needs, underserved segments, technological innovations, and emerging market spaces.`
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert industry analyst with deep knowledge of the ${industry} sector. Provide detailed, actionable insights that would help a brand position itself effectively in this market. Focus on practical, specific information rather than general observations.`
          },
          {
            role: 'user',
            content: prompts[analysisType]
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    // Parse the response into suggestions
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^[-•*]\s*/, '').trim())
      .filter((suggestion: string) => suggestion.length > 0)

    return {
      suggestions: suggestions.slice(0, 10), // Limit to 10 insights
      explanation: `AI-generated ${analysisType} analysis for the ${industry} industry`
    }
  } catch (error) {
    console.error(`Error generating ${industry} ${analysisType} analysis:`, error)
    throw error
  }
}