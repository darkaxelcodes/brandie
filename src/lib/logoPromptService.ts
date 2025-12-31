import type {
  BrandContext,
  VisualPreferences,
  GenerationOptions,
  LogoPrompt,
  LogoPromptContext,
  ArchetypeVisuals,
  StyleVisuals,
  VisualKeywords,
  LogoStyle,
  LogoType
} from '../types/logoGeneration'

const ARCHETYPE_VISUALS: Record<string, ArchetypeVisuals> = {
  innocent: {
    colors: ['white', 'sky blue', 'soft pink', 'light yellow', 'pure pastels'],
    shapes: ['circles', 'soft curves', 'rounded forms', 'gentle arcs'],
    typography: 'clean, simple sans-serif with generous spacing',
    mood: ['pure', 'simple', 'honest', 'optimistic', 'youthful'],
    symbols: ['sun', 'dove', 'cloud', 'flower', 'smile'],
    avoid: ['dark colors', 'sharp angles', 'complex patterns', 'aggressive forms']
  },
  explorer: {
    colors: ['forest green', 'earth brown', 'sunset orange', 'mountain blue', 'sand'],
    shapes: ['arrows', 'paths', 'horizons', 'mountains', 'compass points'],
    typography: 'rugged, adventurous sans-serif or slab serif',
    mood: ['bold', 'free', 'authentic', 'adventurous', 'independent'],
    symbols: ['compass', 'mountain', 'path', 'footprint', 'horizon'],
    avoid: ['confined shapes', 'delicate forms', 'corporate sterility']
  },
  sage: {
    colors: ['deep navy', 'royal purple', 'gold', 'forest green', 'burgundy'],
    shapes: ['books', 'circles of wisdom', 'balanced geometric forms', 'owls'],
    typography: 'refined serif or elegant sans-serif with authority',
    mood: ['wise', 'trusted', 'expert', 'thoughtful', 'credible'],
    symbols: ['owl', 'book', 'light bulb', 'tree of knowledge', 'key'],
    avoid: ['childish elements', 'trendy styles', 'frivolous decoration']
  },
  hero: {
    colors: ['bold red', 'gold', 'black', 'royal blue', 'silver'],
    shapes: ['shields', 'stars', 'strong geometric forms', 'upward angles'],
    typography: 'bold, commanding sans-serif with strong presence',
    mood: ['powerful', 'confident', 'courageous', 'determined', 'triumphant'],
    symbols: ['shield', 'star', 'lightning bolt', 'eagle', 'sword'],
    avoid: ['soft curves', 'passive forms', 'muted colors', 'weakness']
  },
  outlaw: {
    colors: ['black', 'crimson red', 'metallic silver', 'dark gray', 'electric'],
    shapes: ['edgy angles', 'broken forms', 'unconventional geometry', 'sharp points'],
    typography: 'distressed, unconventional, or deliberately imperfect',
    mood: ['rebellious', 'disruptive', 'bold', 'revolutionary', 'fearless'],
    symbols: ['skull', 'flame', 'broken chains', 'lightning', 'fist'],
    avoid: ['corporate sterility', 'safe choices', 'conventional forms']
  },
  magician: {
    colors: ['deep purple', 'iridescent', 'starlight silver', 'midnight blue', 'gold'],
    shapes: ['spirals', 'stars', 'transformation symbols', 'fluid forms'],
    typography: 'mystical, elegant, or otherworldly letterforms',
    mood: ['inspiring', 'transformative', 'visionary', 'magical', 'innovative'],
    symbols: ['star', 'wand', 'crystal', 'butterfly', 'infinity'],
    avoid: ['mundane imagery', 'overly literal symbols', 'boring geometry']
  },
  regular: {
    colors: ['warm brown', 'friendly green', 'sky blue', 'warm neutrals', 'earthy tones'],
    shapes: ['friendly rounded forms', 'handshake imagery', 'home-like shapes'],
    typography: 'approachable, readable sans-serif without pretension',
    mood: ['relatable', 'honest', 'dependable', 'friendly', 'down-to-earth'],
    symbols: ['handshake', 'home', 'heart', 'checkmark', 'smile'],
    avoid: ['luxury signals', 'elitist styling', 'cold corporate forms']
  },
  lover: {
    colors: ['romantic red', 'blush pink', 'gold', 'burgundy', 'champagne'],
    shapes: ['flowing curves', 'heart-inspired forms', 'sensual lines', 'embrace shapes'],
    typography: 'elegant, sensual serif or flowing script elements',
    mood: ['passionate', 'intimate', 'luxurious', 'beautiful', 'devoted'],
    symbols: ['heart', 'rose', 'lips', 'embrace', 'flame'],
    avoid: ['cold geometry', 'harsh angles', 'sterile forms']
  },
  jester: {
    colors: ['bright yellow', 'playful orange', 'vibrant red', 'electric blue', 'multi-color'],
    shapes: ['playful asymmetry', 'bouncy forms', 'unexpected combinations', 'smiles'],
    typography: 'fun, bouncy, playful letterforms with personality',
    mood: ['joyful', 'entertaining', 'spontaneous', 'irreverent', 'fun'],
    symbols: ['smile', 'confetti', 'balloon', 'star burst', 'party elements'],
    avoid: ['serious corporate styling', 'dark themes', 'boring symmetry']
  },
  caregiver: {
    colors: ['nurturing blue', 'healing green', 'warm cream', 'soft pink', 'gentle gold'],
    shapes: ['embracing curves', 'protective forms', 'hands', 'hearts', 'shields'],
    typography: 'warm, caring, readable with human touch',
    mood: ['nurturing', 'protective', 'compassionate', 'supportive', 'safe'],
    symbols: ['hands', 'heart', 'embrace', 'home', 'shield'],
    avoid: ['cold forms', 'aggressive angles', 'impersonal geometry']
  },
  creator: {
    colors: ['creative orange', 'artistic purple', 'unique combinations', 'bold accents'],
    shapes: ['artistic forms', 'abstract expressions', 'unique geometry', 'creative marks'],
    typography: 'distinctive, creative, often custom or artistic',
    mood: ['innovative', 'expressive', 'artistic', 'imaginative', 'original'],
    symbols: ['paintbrush', 'lightbulb', 'spark', 'abstract form', 'unique mark'],
    avoid: ['generic templates', 'boring conformity', 'lack of originality']
  },
  ruler: {
    colors: ['royal purple', 'gold', 'black', 'deep navy', 'rich burgundy'],
    shapes: ['crowns', 'columns', 'strong geometric forms', 'commanding presence'],
    typography: 'prestigious, authoritative serif or refined sans-serif',
    mood: ['luxurious', 'commanding', 'prestigious', 'successful', 'powerful'],
    symbols: ['crown', 'lion', 'eagle', 'column', 'crest'],
    avoid: ['casual styling', 'cheap appearance', 'weakness signals']
  }
}

const STYLE_VISUALS: Record<LogoStyle, StyleVisuals> = {
  minimal: {
    description: 'Clean, essential design with maximum impact from minimum elements',
    characteristics: [
      'Single or dual color palette only',
      'Maximum 2-3 visual elements',
      'Strategic use of negative space',
      'Typography as the primary hero',
      'Clean geometric shapes',
      'No gradients or complex effects'
    ],
    technical_notes: [
      'Must work perfectly in single color',
      'Excellent scalability from 16px to billboard',
      'Quick brand recognition from simplicity'
    ]
  },
  modern: {
    description: 'Contemporary aesthetic with subtle sophistication and tech-forward sensibility',
    characteristics: [
      'Sleek, refined forms',
      'Subtle gradients or color transitions acceptable',
      'Contemporary typography choices',
      'Clean but not stark',
      'Slight dimensionality or depth',
      'Tech-forward but human'
    ],
    technical_notes: [
      'Ensure gradients work in print (CMYK)',
      'Maintain clarity at all sizes',
      'Balance between trendy and timeless'
    ]
  },
  classic: {
    description: 'Timeless elegance with refined proportions and traditional craftsmanship',
    characteristics: [
      'Serif typography or custom lettering',
      'Balanced, symmetrical compositions',
      'Traditional proportions',
      'Sophisticated color palette',
      'Heritage feel without being dated',
      'Refined details that age well'
    ],
    technical_notes: [
      'Avoid trendy elements that will date',
      'Focus on lasting design principles',
      'Ensure legibility of refined details'
    ]
  },
  playful: {
    description: 'Energetic, approachable design that brings joy and personality',
    characteristics: [
      'Rounded, friendly forms',
      'Vibrant colors within brand palette',
      'Movement and dynamism',
      'Personality-driven elements',
      'Smile-inducing design choices',
      'Approachable typography'
    ],
    technical_notes: [
      'Balance playfulness with professionalism',
      'Ensure it appeals to target audience age',
      'Maintain brand credibility'
    ]
  },
  bold: {
    description: 'Strong, confident presence that commands attention and respect',
    characteristics: [
      'High contrast elements',
      'Thick strokes and solid forms',
      'Impactful shapes',
      'Statement typography',
      'Commanding visual weight',
      'Confident color choices'
    ],
    technical_notes: [
      'Ensure bold elements scale well',
      'Maintain legibility at small sizes',
      'Balance strength without aggression'
    ]
  },
  organic: {
    description: 'Natural, flowing design with handcrafted feel and earth-inspired forms',
    characteristics: [
      'Flowing, natural shapes',
      'Hand-crafted aesthetic',
      'Earth-inspired color palette',
      'Subtle imperfections for character',
      'Warm, inviting forms',
      'Nature-derived patterns'
    ],
    technical_notes: [
      'Maintain consistency in hand-drawn elements',
      'Ensure organic forms reproduce well',
      'Balance organic feel with professionalism'
    ]
  }
}

const LOGO_TYPE_DESCRIPTIONS: Record<LogoType, string> = {
  wordmark: 'Text-based logo using the brand name in distinctive typography (like Google, Coca-Cola)',
  lettermark: 'Initials or acronym-based logo for longer brand names (like IBM, HBO)',
  pictorial: 'Iconic image or symbol that represents the brand (like Apple, Twitter bird)',
  abstract: 'Unique geometric or abstract form that captures brand essence (like Pepsi, Nike swoosh)',
  mascot: 'Character or illustrated figure representing the brand (like KFC Colonel, Michelin Man)',
  combination: 'Icon paired with wordmark that can work together or separately (like Burger King, Lacoste)'
}

export const logoPromptService = {
  extractVisualKeywords(brand: BrandContext): VisualKeywords {
    const archetype = brand.brand_strategy.archetype.primary.toLowerCase()
    const archetypeVisuals = ARCHETYPE_VISUALS[archetype] || ARCHETYPE_VISUALS.sage
    const values = brand.brand_strategy.values.core_values
    const industry = brand.brand_identity.industry.toLowerCase()
    const positioning = brand.brand_strategy.values.positioning
    const audience = brand.brand_strategy.audience

    const moodFromValues = values.map(v => v.toLowerCase())
    const moodFromAudience = this.extractMoodFromAudience(audience)

    return {
      primary_mood: [...archetypeVisuals.mood.slice(0, 3), ...moodFromValues.slice(0, 2)],
      secondary_mood: [...archetypeVisuals.mood.slice(3), ...moodFromAudience],
      shapes: archetypeVisuals.shapes,
      symbols: archetypeVisuals.symbols,
      colors_suggested: archetypeVisuals.colors,
      typography_style: archetypeVisuals.typography,
      avoid: [
        ...archetypeVisuals.avoid,
        ...this.getIndustryAvoid(industry),
        'generic clipart',
        'overly complex details that disappear at small sizes'
      ]
    }
  },

  extractMoodFromAudience(audience: BrandContext['brand_strategy']['audience']): string[] {
    const moods: string[] = []
    const psycho = audience.psychographics.toLowerCase()

    if (psycho.includes('professional') || psycho.includes('business')) moods.push('professional')
    if (psycho.includes('creative') || psycho.includes('artistic')) moods.push('creative')
    if (psycho.includes('young') || psycho.includes('millennial')) moods.push('contemporary')
    if (psycho.includes('traditional') || psycho.includes('conservative')) moods.push('established')
    if (psycho.includes('tech') || psycho.includes('digital')) moods.push('innovative')
    if (psycho.includes('luxury') || psycho.includes('premium')) moods.push('sophisticated')
    if (psycho.includes('eco') || psycho.includes('sustainable')) moods.push('natural')
    if (psycho.includes('family') || psycho.includes('parent')) moods.push('trustworthy')

    return moods.length > 0 ? moods : ['professional', 'approachable']
  },

  getIndustryAvoid(industry: string): string[] {
    const avoidByIndustry: Record<string, string[]> = {
      technology: ['outdated tech imagery', 'generic globe or circuit patterns'],
      finance: ['dollar signs', 'piggy banks', 'generic money imagery'],
      healthcare: ['red crosses (trademarked)', 'generic heart with pulse'],
      food: ['generic fork and knife', 'obvious food clipart'],
      education: ['graduation caps', 'generic book stacks'],
      legal: ['scales of justice cliche', 'gavel imagery'],
      real_estate: ['generic house outline', 'roof shapes'],
      fitness: ['generic muscle arms', 'running figures']
    }

    for (const [key, avoid] of Object.entries(avoidByIndustry)) {
      if (industry.includes(key)) return avoid
    }
    return ['industry cliches', 'overused symbols']
  },

  getArchetypeVisuals(archetype: string, secondary?: string): ArchetypeVisuals {
    const primary = ARCHETYPE_VISUALS[archetype.toLowerCase()] || ARCHETYPE_VISUALS.sage

    if (!secondary) return primary

    const secondaryVisuals = ARCHETYPE_VISUALS[secondary.toLowerCase()]
    if (!secondaryVisuals) return primary

    return {
      colors: [...primary.colors.slice(0, 3), ...secondaryVisuals.colors.slice(0, 2)],
      shapes: [...primary.shapes.slice(0, 3), ...secondaryVisuals.shapes.slice(0, 2)],
      typography: primary.typography,
      mood: [...primary.mood.slice(0, 3), ...secondaryVisuals.mood.slice(0, 2)],
      symbols: [...primary.symbols.slice(0, 3), ...secondaryVisuals.symbols.slice(0, 2)],
      avoid: [...new Set([...primary.avoid, ...secondaryVisuals.avoid])]
    }
  },

  recommendLogoType(brand: BrandContext): LogoType {
    const name = brand.brand_identity.name
    const archetype = brand.brand_strategy.archetype.primary.toLowerCase()
    const industry = brand.brand_identity.industry.toLowerCase()

    if (name.length > 12) return 'lettermark'
    if (name.length <= 4) return 'wordmark'

    if (['jester', 'caregiver'].includes(archetype)) return 'mascot'
    if (['creator', 'magician'].includes(archetype)) return 'abstract'
    if (['ruler', 'sage'].includes(archetype)) return 'combination'

    if (industry.includes('tech') || industry.includes('software')) return 'abstract'
    if (industry.includes('food') || industry.includes('restaurant')) return 'combination'
    if (industry.includes('luxury') || industry.includes('fashion')) return 'wordmark'

    return 'combination'
  },

  getStyleVisuals(style: LogoStyle): StyleVisuals {
    return STYLE_VISUALS[style]
  },

  buildPrompt(context: LogoPromptContext): LogoPrompt {
    const { brand, preferences, options } = context
    const keywords = this.extractVisualKeywords(brand)
    const archetypeVisuals = this.getArchetypeVisuals(
      brand.brand_strategy.archetype.primary,
      brand.brand_strategy.archetype.secondary
    )
    const styleVisuals = this.getStyleVisuals(preferences.selected_style)
    const recommendedType = preferences.logo_type_preference || this.recommendLogoType(brand)

    const brandContextSection = this.buildBrandContextSection(brand, keywords)
    const visualDirectionSection = this.buildVisualDirectionSection(preferences, styleVisuals, archetypeVisuals, keywords)
    const requirementsSection = this.buildRequirementsSection(recommendedType, brand)
    const constraintsSection = this.buildConstraintsSection(keywords, preferences)
    const technicalSpecsSection = this.buildTechnicalSpecsSection(options, styleVisuals)

    const fullPrompt = `${brandContextSection}

${visualDirectionSection}

${requirementsSection}

${constraintsSection}

${technicalSpecsSection}

Create a distinctive, memorable, and professional logo that embodies ${brand.brand_identity.name}'s identity as "${brand.brand_strategy.values.positioning}". The logo should instantly communicate ${keywords.primary_mood.slice(0, 3).join(', ')} while being unique and ownable.`

    return {
      full_prompt: fullPrompt,
      sections: {
        brand_context: brandContextSection,
        visual_direction: visualDirectionSection,
        requirements: requirementsSection,
        constraints: constraintsSection,
        technical_specs: technicalSpecsSection
      },
      generation_params: {
        model: 'gpt-image-1',
        size: options.size,
        quality: options.quality,
        background: options.background,
        format: options.format,
        n: options.count
      }
    }
  },

  buildBrandContextSection(brand: BrandContext, keywords: VisualKeywords): string {
    const { brand_identity, brand_strategy } = brand

    return `Design a professional brand logo for "${brand_identity.name}".

BRAND IDENTITY:
- Name: ${brand_identity.name}
- Industry: ${brand_identity.industry}${brand_identity.industry_segment ? ` (${brand_identity.industry_segment})` : ''}

BRAND PURPOSE:
- Mission: ${brand_strategy.purpose.mission}
- Vision: ${brand_strategy.purpose.vision}
- Core Values: ${brand_strategy.values.core_values.join(', ')}

BRAND POSITIONING:
- "${brand_strategy.values.positioning}"
- Unique Value: ${brand_strategy.values.unique_value}
- Competitive Advantage: ${brand_strategy.competitive.advantage}

TARGET AUDIENCE:
- ${brand_strategy.audience.primary}
- Psychographics: ${brand_strategy.audience.psychographics}

BRAND PERSONALITY (${brand_strategy.archetype.primary.charAt(0).toUpperCase() + brand_strategy.archetype.primary.slice(1)} Archetype):
- Primary mood: ${keywords.primary_mood.join(', ')}
- The brand should feel: ${keywords.secondary_mood.join(', ')}`
  },

  buildVisualDirectionSection(
    preferences: VisualPreferences,
    styleVisuals: StyleVisuals,
    archetypeVisuals: ArchetypeVisuals,
    keywords: VisualKeywords
  ): string {
    return `VISUAL DIRECTION:

Style: ${preferences.selected_style.charAt(0).toUpperCase() + preferences.selected_style.slice(1)}
${styleVisuals.description}

Style Characteristics:
${styleVisuals.characteristics.map(c => `- ${c}`).join('\n')}

Visual Elements to Consider:
- Shapes: ${archetypeVisuals.shapes.slice(0, 4).join(', ')}
- Potential Symbols: ${archetypeVisuals.symbols.slice(0, 4).join(', ')}
- Color Direction: ${archetypeVisuals.colors.slice(0, 4).join(', ')}
- Typography Feel: ${keywords.typography_style}

Desired Mood: ${preferences.mood.join(', ')}`
  },

  buildRequirementsSection(logoType: LogoType, brand: BrandContext): string {
    return `REQUIREMENTS:

Logo Type: ${logoType.charAt(0).toUpperCase() + logoType.slice(1)}
${LOGO_TYPE_DESCRIPTIONS[logoType]}

Essential Requirements:
- The brand name "${brand.brand_identity.name}" must be clearly legible
- Must work at all sizes from 16px favicon to large format
- Needs to work on both light and dark backgrounds
- Should be instantly recognizable and memorable
- Must be unique and ownable (not generic)
- Should convey the brand's ${brand.brand_strategy.archetype.primary} personality`
  },

  buildConstraintsSection(keywords: VisualKeywords, preferences: VisualPreferences): string {
    const avoidList = [
      ...keywords.avoid,
      ...(preferences.avoid || []),
      'Generic stock imagery or clipart',
      'Overly complex details that disappear at small sizes',
      'Trendy effects that will quickly date',
      'Difficult to reproduce elements'
    ]

    return `CONSTRAINTS - AVOID:
${[...new Set(avoidList)].map(a => `- ${a}`).join('\n')}

ENSURE:
- Unique, distinctive mark that stands out from competitors
- Clean, professional execution
- Balanced visual weight and composition
- Clear hierarchy if combining elements`
  },

  buildTechnicalSpecsSection(options: GenerationOptions, styleVisuals: StyleVisuals): string {
    const bgInstruction = options.background === 'transparent'
      ? 'Transparent background (PNG format)'
      : options.background === 'opaque'
        ? 'Clean white background'
        : 'Clean, neutral background suitable for versatile use'

    return `TECHNICAL SPECIFICATIONS:
- ${bgInstruction}
- Vector-style rendering with clean edges
- Professional quality suitable for brand guidelines
- Scalable design that maintains integrity at all sizes
${styleVisuals.technical_notes.map(n => `- ${n}`).join('\n')}`
  },

  validatePrompt(prompt: LogoPrompt): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    if (prompt.full_prompt.length < 200) {
      issues.push('Prompt may be too short for quality generation')
    }
    if (prompt.full_prompt.length > 4000) {
      issues.push('Prompt may be too long, consider condensing')
    }
    if (!prompt.sections.brand_context.includes('Name:')) {
      issues.push('Brand name not clearly specified')
    }
    if (!prompt.sections.requirements.includes('must')) {
      issues.push('Requirements section may lack specificity')
    }

    return {
      valid: issues.length === 0,
      issues
    }
  },

  buildContextFromBrandData(brandData: {
    brand?: { name: string; industry?: string }
    strategy?: {
      purpose?: { mission?: string; vision?: string; why?: string }
      values?: { coreValues?: string[]; positioning?: string; uniqueValue?: string }
      audience?: { primaryAudience?: string; demographics?: string; psychographics?: string; painPoints?: string[] }
      competitive?: { competitiveAdvantage?: string; marketGap?: string; directCompetitors?: string[] }
      archetype?: { selectedArchetype?: string; reasoning?: string }
    }
  }): BrandContext {
    const brand = brandData.brand || { name: 'Brand' }
    const strategy = brandData.strategy || {}

    return {
      brand_identity: {
        name: brand.name || 'Brand',
        industry: brand.industry || 'Business',
        industry_segment: undefined
      },
      brand_strategy: {
        purpose: {
          mission: strategy.purpose?.mission || 'To deliver excellence',
          vision: strategy.purpose?.vision || 'To be the best in our field',
          why: strategy.purpose?.why || 'To make a difference'
        },
        values: {
          core_values: strategy.values?.coreValues || ['Quality', 'Innovation', 'Trust'],
          positioning: strategy.values?.positioning || `${brand.name} delivers exceptional value`,
          unique_value: strategy.values?.uniqueValue || 'Unique combination of quality and service'
        },
        audience: {
          primary: strategy.audience?.primaryAudience || 'Professionals seeking quality',
          demographics: strategy.audience?.demographics || 'Adults 25-55',
          psychographics: strategy.audience?.psychographics || 'Value-conscious, quality-focused',
          pain_points: strategy.audience?.painPoints || ['Finding reliable solutions']
        },
        competitive: {
          advantage: strategy.competitive?.competitiveAdvantage || 'Superior quality and service',
          market_gap: strategy.competitive?.marketGap || 'Underserved quality segment',
          direct_competitors: strategy.competitive?.directCompetitors || []
        },
        archetype: {
          primary: strategy.archetype?.selectedArchetype || 'sage',
          reasoning: strategy.archetype?.reasoning || 'Reflects brand wisdom and expertise'
        }
      }
    }
  }
}
