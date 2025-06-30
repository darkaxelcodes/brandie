import { supabase, withRetry } from './supabase'
import { IndustrySuggestion } from '../types/brand'

// List of supported industries
export const industries = [
  { id: 'technology', name: 'Technology', icon: 'Laptop' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart' },
  { id: 'finance', name: 'Finance', icon: 'DollarSign' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
  { id: 'retail', name: 'Retail', icon: 'ShoppingBag' },
  { id: 'food', name: 'Food & Beverage', icon: 'Utensils' },
  { id: 'travel', name: 'Travel & Hospitality', icon: 'Plane' },
  { id: 'real_estate', name: 'Real Estate', icon: 'Home' },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'Factory' },
  { id: 'media', name: 'Media & Entertainment', icon: 'Film' },
  { id: 'professional', name: 'Professional Services', icon: 'Briefcase' },
  { id: 'nonprofit', name: 'Nonprofit', icon: 'Heart' },
  { id: 'other', name: 'Other', icon: 'Grid' }
]

export const industryService = {
  // Get industry-specific suggestions
  async getIndustrySuggestions(
    industry: string,
    suggestionType: string
  ): Promise<IndustrySuggestion[]> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', suggestionType)
        .order('relevance', { ascending: false })

      if (error) throw error
      return data || []
    })
  },

  // Get industry-specific best practices
  async getIndustryBestPractices(industry: string): Promise<any> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', 'best_practices')
        .maybeSingle()

      if (error) throw error
      return data?.content || null
    })
  },

  // Get industry-specific color recommendations
  async getIndustryColorRecommendations(industry: string): Promise<any> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', 'colors')
        .maybeSingle()

      if (error) throw error
      return data?.content || null
    })
  },

  // Get industry-specific typography recommendations
  async getIndustryTypographyRecommendations(industry: string): Promise<any> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', 'typography')
        .maybeSingle()

      if (error) throw error
      return data?.content || null
    })
  },

  // Get industry-specific voice recommendations
  async getIndustryVoiceRecommendations(industry: string): Promise<any> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', 'voice')
        .maybeSingle()

      if (error) throw error
      return data?.content || null
    })
  },

  // Get industry-specific competitors
  async getIndustryCompetitors(industry: string): Promise<any> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', 'competitors')
        .maybeSingle()

      if (error) throw error
      return data?.content || null
    })
  },

  // Get industry-specific audience insights
  async getIndustryAudienceInsights(industry: string): Promise<any> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('industry_suggestions')
        .select('*')
        .eq('industry', industry)
        .eq('suggestion_type', 'audience')
        .maybeSingle()

      if (error) throw error
      return data?.content || null
    })
  },

  // Get fallback industry suggestions when database has no data
  getFallbackIndustrySuggestions(industry: string, suggestionType: string): any {
    const fallbackData: Record<string, Record<string, any>> = {
      technology: {
        purpose: {
          mission: "To innovate and create technology solutions that solve complex problems and improve people's lives.",
          vision: "A world where technology is accessible, intuitive, and empowers everyone to achieve more.",
          values: ["Innovation", "User-Centric", "Quality", "Adaptability", "Integrity"]
        },
        voice: {
          tone: "Clear, knowledgeable, and forward-thinking with a balance of technical expertise and accessibility.",
          avoid: "Overly technical jargon without explanation, dated references, or condescending tone."
        },
        colors: {
          recommended: ["#0078D7", "#333333", "#7FBA00", "#FFFFFF"],
          avoid: "Overly ornate or vintage color schemes that may suggest outdated technology."
        }
      },
      healthcare: {
        purpose: {
          mission: "To provide compassionate, high-quality care that improves health outcomes and enhances quality of life.",
          vision: "A healthier world where everyone has access to exceptional healthcare services.",
          values: ["Compassion", "Excellence", "Integrity", "Patient-Centered", "Innovation"]
        },
        voice: {
          tone: "Warm, trustworthy, and clear with a balance of professionalism and empathy.",
          avoid: "Overly clinical language, jargon without explanation, or alarmist tone."
        },
        colors: {
          recommended: ["#0077C8", "#FFFFFF", "#44D62C", "#F5F5F5"],
          avoid: "Dark or aggressive colors that may create anxiety in healthcare contexts."
        }
      },
      finance: {
        purpose: {
          mission: "To provide secure, transparent financial services that help clients achieve their financial goals.",
          vision: "A world where financial well-being is accessible to all through smart, ethical solutions.",
          values: ["Trust", "Security", "Transparency", "Excellence", "Client-Focused"]
        },
        voice: {
          tone: "Clear, authoritative, and trustworthy with a balance of expertise and accessibility.",
          avoid: "Overly casual language, financial jargon without explanation, or hyperbolic claims."
        },
        colors: {
          recommended: ["#006F51", "#002D72", "#FFFFFF", "#E5E5E5"],
          avoid: "Bright, flashy colors that may undermine the sense of security and stability."
        }
      }
    }

    // Default to technology if the industry isn't in our fallbacks
    const industryData = fallbackData[industry] || fallbackData.technology
    return industryData[suggestionType] || {}
  }
}