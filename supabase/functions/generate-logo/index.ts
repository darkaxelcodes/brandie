const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface BrandContext {
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
      direct_competitors?: string[]
    }
    archetype: {
      primary: string
      secondary?: string
      reasoning: string
    }
  }
}

interface VisualPreferences {
  selected_style: string
  mood: string[]
  avoid?: string[]
  logo_type_preference?: string
}

interface GenerationOptions {
  count: number
  size: string
  quality: string
  background: string
  format: string
}

interface LogoGenerationRequest {
  brand_context: BrandContext
  visual_preferences: VisualPreferences
  generation_options: GenerationOptions
  prompt?: string
}

interface GeneratedLogo {
  id: string
  variant: string
  style: string
  image_data: {
    base64: string
    format: string
    size: string
    has_transparency: boolean
  }
  metadata: {
    revised_prompt?: string
    generation_params: Record<string, unknown>
  }
}

const ARCHETYPE_VISUALS: Record<string, { mood: string[], shapes: string[], symbols: string[], avoid: string[] }> = {
  innocent: {
    mood: ['pure', 'simple', 'honest', 'optimistic'],
    shapes: ['circles', 'soft curves', 'rounded forms'],
    symbols: ['sun', 'dove', 'cloud', 'flower'],
    avoid: ['dark colors', 'sharp angles', 'complex patterns']
  },
  explorer: {
    mood: ['bold', 'free', 'authentic', 'adventurous'],
    shapes: ['arrows', 'paths', 'horizons', 'mountains'],
    symbols: ['compass', 'mountain', 'path', 'horizon'],
    avoid: ['confined shapes', 'delicate forms']
  },
  sage: {
    mood: ['wise', 'trusted', 'expert', 'thoughtful'],
    shapes: ['balanced geometric forms', 'circles of wisdom'],
    symbols: ['owl', 'book', 'light bulb', 'tree'],
    avoid: ['childish elements', 'trendy styles']
  },
  hero: {
    mood: ['powerful', 'confident', 'courageous', 'triumphant'],
    shapes: ['shields', 'stars', 'strong geometric forms'],
    symbols: ['shield', 'star', 'lightning bolt', 'eagle'],
    avoid: ['soft curves', 'passive forms', 'muted colors']
  },
  outlaw: {
    mood: ['rebellious', 'disruptive', 'bold', 'revolutionary'],
    shapes: ['edgy angles', 'broken forms', 'sharp points'],
    symbols: ['flame', 'broken chains', 'lightning'],
    avoid: ['corporate sterility', 'safe choices']
  },
  magician: {
    mood: ['inspiring', 'transformative', 'visionary', 'innovative'],
    shapes: ['spirals', 'stars', 'fluid forms'],
    symbols: ['star', 'wand', 'crystal', 'infinity'],
    avoid: ['mundane imagery', 'boring geometry']
  },
  regular: {
    mood: ['relatable', 'honest', 'dependable', 'friendly'],
    shapes: ['friendly rounded forms', 'home-like shapes'],
    symbols: ['handshake', 'home', 'heart', 'checkmark'],
    avoid: ['luxury signals', 'elitist styling']
  },
  lover: {
    mood: ['passionate', 'intimate', 'luxurious', 'beautiful'],
    shapes: ['flowing curves', 'heart-inspired forms'],
    symbols: ['heart', 'rose', 'embrace', 'flame'],
    avoid: ['cold geometry', 'harsh angles']
  },
  jester: {
    mood: ['joyful', 'entertaining', 'spontaneous', 'fun'],
    shapes: ['playful asymmetry', 'bouncy forms'],
    symbols: ['smile', 'confetti', 'star burst'],
    avoid: ['serious corporate styling', 'dark themes']
  },
  caregiver: {
    mood: ['nurturing', 'protective', 'compassionate', 'safe'],
    shapes: ['embracing curves', 'protective forms'],
    symbols: ['hands', 'heart', 'embrace', 'shield'],
    avoid: ['cold forms', 'aggressive angles']
  },
  creator: {
    mood: ['innovative', 'expressive', 'artistic', 'original'],
    shapes: ['artistic forms', 'abstract expressions'],
    symbols: ['paintbrush', 'lightbulb', 'spark'],
    avoid: ['generic templates', 'boring conformity']
  },
  ruler: {
    mood: ['luxurious', 'commanding', 'prestigious', 'powerful'],
    shapes: ['crowns', 'columns', 'strong geometric forms'],
    symbols: ['crown', 'lion', 'eagle', 'crest'],
    avoid: ['casual styling', 'cheap appearance']
  }
}

const STYLE_DESCRIPTIONS: Record<string, { description: string, characteristics: string[] }> = {
  minimal: {
    description: 'Clean, essential design with maximum impact from minimum elements',
    characteristics: ['single or dual color', 'negative space', 'clean geometry', 'typography-focused']
  },
  modern: {
    description: 'Contemporary aesthetic with subtle sophistication',
    characteristics: ['sleek forms', 'subtle gradients', 'tech-forward', 'contemporary typography']
  },
  classic: {
    description: 'Timeless elegance with refined proportions',
    characteristics: ['serif typography', 'balanced symmetry', 'sophisticated', 'heritage feel']
  },
  playful: {
    description: 'Energetic, approachable design that brings personality',
    characteristics: ['rounded forms', 'vibrant colors', 'movement', 'friendly']
  },
  bold: {
    description: 'Strong, confident presence that commands attention',
    characteristics: ['high contrast', 'thick strokes', 'impactful', 'statement typography']
  },
  organic: {
    description: 'Natural, flowing design with handcrafted feel',
    characteristics: ['flowing shapes', 'earth-inspired', 'natural', 'warm']
  }
}

function buildIntelligentPrompt(request: LogoGenerationRequest): string {
  const { brand_context, visual_preferences, generation_options } = request
  const { brand_identity, brand_strategy } = brand_context

  const archetype = brand_strategy.archetype.primary.toLowerCase()
  const archetypeData = ARCHETYPE_VISUALS[archetype] || ARCHETYPE_VISUALS.sage
  const styleData = STYLE_DESCRIPTIONS[visual_preferences.selected_style] || STYLE_DESCRIPTIONS.modern

  const bgInstruction = generation_options.background === 'transparent'
    ? 'on a transparent background'
    : generation_options.background === 'opaque'
      ? 'on a clean white background'
      : 'on a clean, neutral background'

  const prompt = `Design a professional brand logo for "${brand_identity.name}" ${bgInstruction}.

BRAND CONTEXT:
- Industry: ${brand_identity.industry}${brand_identity.industry_segment ? ` (${brand_identity.industry_segment})` : ''}
- Mission: ${brand_strategy.purpose.mission}
- Core Values: ${brand_strategy.values.core_values.join(', ')}
- Positioning: "${brand_strategy.values.positioning}"
- Competitive Advantage: ${brand_strategy.competitive.advantage}
- Target Audience: ${brand_strategy.audience.primary}
- Audience Mindset: ${brand_strategy.audience.psychographics}

BRAND PERSONALITY (${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Archetype):
- Mood: ${archetypeData.mood.join(', ')}
- Visual Elements: ${archetypeData.shapes.join(', ')}
- Symbolic Direction: ${archetypeData.symbols.join(', ')}

VISUAL STYLE - ${visual_preferences.selected_style.toUpperCase()}:
${styleData.description}
Characteristics: ${styleData.characteristics.join(', ')}
Desired Mood: ${visual_preferences.mood.join(', ')}

REQUIREMENTS:
- Logo must clearly feature the brand name "${brand_identity.name}"
- Must work at all sizes from favicon (16px) to billboard
- Must work on both light and dark backgrounds
- Should be unique, memorable, and ownable
- Professional quality suitable for brand guidelines

AVOID:
${[...archetypeData.avoid, ...(visual_preferences.avoid || []), 'generic clipart', 'overly complex details', 'industry clichés'].map(a => `- ${a}`).join('\n')}

TECHNICAL SPECS:
- Vector-style rendering with clean edges
- Balanced composition and visual weight
- ${visual_preferences.selected_style === 'minimal' ? 'Maximum 2-3 visual elements' : 'Clear hierarchy of elements'}
- Scalable design that maintains integrity at all sizes

Create a distinctive logo that embodies ${brand_identity.name}'s identity as "${brand_strategy.values.positioning}" while conveying ${archetypeData.mood.slice(0, 2).join(' and ')} energy.`

  return prompt
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const requestData: LogoGenerationRequest = await req.json()

    if (!requestData.brand_context?.brand_identity?.name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Brand context with brand name is required',
          generation_id: null,
          logos: [],
          prompt_info: null,
          metadata: null
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured',
          generation_id: null,
          logos: [],
          prompt_info: null,
          metadata: null
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    }

    const options = requestData.generation_options || {
      count: 1,
      size: '1024x1024',
      quality: 'high',
      background: 'transparent',
      format: 'png'
    }

    const enhancedPrompt = requestData.prompt || buildIntelligentPrompt(requestData)
    const generationId = `logo_gen_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const startTime = Date.now()

    const validSizes = ['1024x1024', '1024x1536', '1536x1024']
    const size = validSizes.includes(options.size) ? options.size : '1024x1024'

    const validQualities = ['low', 'medium', 'high', 'auto']
    const quality = validQualities.includes(options.quality) ? options.quality : 'high'

    const validFormats = ['png', 'jpeg', 'webp']
    const outputFormat = validFormats.includes(options.format) ? options.format : 'png'

    const background = options.background === 'transparent' ? 'transparent' : 'auto'

    const apiRequestBody: Record<string, unknown> = {
      model: 'gpt-image-1',
      prompt: enhancedPrompt,
      n: Math.min(Math.max(options.count || 1, 1), 4),
      size: size,
      quality: quality,
      output_format: outputFormat
    }

    if (background === 'transparent' && (outputFormat === 'png' || outputFormat === 'webp')) {
      apiRequestBody.background = 'transparent'
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify(apiRequestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API Error:', response.status, errorData)

      return new Response(
        JSON.stringify({
          success: false,
          error: `Image generation failed: ${response.status} ${response.statusText}`,
          details: errorData,
          generation_id: generationId,
          logos: [],
          prompt_info: {
            original_request: requestData.visual_preferences?.selected_style || 'default',
            enhanced_prompt: enhancedPrompt,
            context_used: [
              'brand_identity',
              'brand_strategy',
              'archetype',
              'visual_preferences'
            ]
          },
          metadata: {
            model: 'gpt-image-1',
            quality: quality,
            size: size,
            generation_time_ms: Date.now() - startTime
          }
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    }

    const data = await response.json()
    const generationTimeMs = Date.now() - startTime

    const logos: GeneratedLogo[] = data.data.map((img: { b64_json?: string; url?: string; revised_prompt?: string }, index: number) => ({
      id: `${generationId}_${index}`,
      variant: index === 0 ? 'primary' : `variant_${index}`,
      style: requestData.visual_preferences?.selected_style || 'modern',
      image_data: {
        base64: img.b64_json || '',
        format: outputFormat,
        size: size,
        has_transparency: background === 'transparent'
      },
      metadata: {
        revised_prompt: img.revised_prompt || undefined,
        generation_params: {
          model: 'gpt-image-1',
          quality: quality,
          size: size,
          background: background
        }
      }
    }))

    const responsePayload = {
      success: true,
      generation_id: generationId,
      logos: logos,
      prompt_info: {
        original_request: requestData.visual_preferences?.selected_style || 'default',
        enhanced_prompt: enhancedPrompt,
        revised_prompt: logos[0]?.metadata?.revised_prompt || undefined,
        context_used: [
          'brand_identity.name',
          'brand_identity.industry',
          'brand_strategy.purpose.mission',
          'brand_strategy.values.core_values',
          'brand_strategy.values.positioning',
          'brand_strategy.competitive.advantage',
          'brand_strategy.audience.primary',
          'brand_strategy.audience.psychographics',
          'brand_strategy.archetype.primary',
          'visual_preferences.selected_style',
          'visual_preferences.mood'
        ]
      },
      metadata: {
        model: 'gpt-image-1',
        quality: quality,
        size: size,
        format: outputFormat,
        background: background,
        count: logos.length,
        generation_time_ms: generationTimeMs,
        generated_at: new Date().toISOString()
      }
    }

    return new Response(
      JSON.stringify(responsePayload),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )

  } catch (error) {
    console.error('Error in generate-logo function:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        generation_id: null,
        logos: [],
        prompt_info: null,
        metadata: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    )
  }
})
