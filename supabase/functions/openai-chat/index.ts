import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatRequest {
  sectionType?: string;
  context?: Record<string, any>;
  industry?: string;
  analysisType?: 'trends' | 'competitors' | 'audience' | 'challenges' | 'opportunities';
  prompt?: string;
  systemPrompt?: string;
  maxTokens?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const requestData: ChatRequest = await req.json();
    const { sectionType, context = {}, industry, analysisType, prompt, systemPrompt, maxTokens = 1000 } = requestData;

    let messages: any[] = [];

    if (prompt && systemPrompt) {
      // Custom prompt mode
      messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ];
    } else if (analysisType && industry) {
      // Industry analysis mode
      const prompts = {
        trends: `Provide a detailed analysis of current trends in the ${industry} industry. Focus on emerging technologies, changing consumer behaviors, regulatory shifts, and market dynamics that are shaping the industry landscape.`,
        competitors: `Identify and analyze the top competitors in the ${industry} industry. For each competitor, highlight their strengths, weaknesses, market positioning, unique selling propositions, and brand strategies.`,
        audience: `Describe the typical customer segments in the ${industry} industry. For each segment, provide demographics, psychographics, pain points, motivations, and decision-making factors.`,
        challenges: `Outline the major challenges facing businesses in the ${industry} industry. Consider operational, marketing, technological, regulatory, and competitive challenges.`,
        opportunities: `Identify key opportunities for differentiation and growth in the ${industry} industry. Focus on unmet needs, underserved segments, technological innovations, and emerging market spaces.`
      };

      messages = [
        {
          role: 'system',
          content: `You are an expert industry analyst with deep knowledge of the ${industry} sector. Provide detailed, actionable insights that would help a brand position itself effectively in this market. Focus on practical, specific information rather than general observations.`
        },
        {
          role: 'user',
          content: prompts[analysisType]
        }
      ];
    } else if (sectionType) {
      // Strategy suggestions mode
      const industryContext = context.industry
        ? `for a ${context.industry} industry brand`
        : '';

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
        competitive_analysis: `Based on this business context: ${JSON.stringify(context)}, provide a detailed competitive analysis ${industryContext} including: key competitors' strengths and weaknesses, market positioning, typical messaging approaches, visual identity patterns, and opportunities for differentiation.`,
        landing_page: `Based on this brand context: ${JSON.stringify(context)}, generate compelling landing page content ${industryContext} including: hero headlines, value propositions, feature descriptions, benefit statements, and call-to-action copy. Focus on conversion-optimized copy that resonates with the target audience and reflects the brand voice.`
      };

      messages = [
        {
          role: 'system',
          content: `You are a world-class brand strategist and visual identity expert. You understand color psychology, typography science, brand archetypes, and consumer behavior. Provide practical, actionable suggestions that are specific to the business context. Format your response as clear, concise bullet points or structured recommendations. Pay special attention to industry-specific best practices for ${context.industry || 'the relevant industry'}.`
        },
        {
          role: 'user',
          content: prompts[sectionType as keyof typeof prompts]
        }
      ];
    } else {
      throw new Error("Invalid request: must provide either sectionType, industry analysis params, or custom prompt");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the response into suggestions
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^[-•*]\s*/, '').trim())
      .filter((suggestion: string) => suggestion.length > 0);

    return new Response(
      JSON.stringify({
        suggestions: suggestions.slice(0, analysisType ? 10 : 8),
        explanation: analysisType
          ? `AI-generated ${analysisType} analysis for the ${industry} industry`
          : 'AI-generated suggestions based on your brand context, industry best practices, and market trends'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
