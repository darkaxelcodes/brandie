import { supabase } from './supabase'
import { tokenService } from './tokenService'
import { analyticsService, EventName } from './analytics'

export interface UserProfile {
  id?: string
  user_id: string
  full_name?: string | null
  company_name?: string | null
  company_website?: string | null
  role?: string | null
  company_size?: string | null
  industry?: string | null
  goals?: string[]
  referral_source?: string | null
  onboarding_completed_at?: string | null
  onboarding_skipped_at?: string | null
  profile_completion_rewarded?: boolean
  created_at?: string
  updated_at?: string
}

export const ROLE_OPTIONS = [
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'designer', label: 'Designer' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'developer', label: 'Developer' },
  { value: 'agency', label: 'Agency' },
  { value: 'other', label: 'Other' },
] as const

export const COMPANY_SIZE_OPTIONS = [
  { value: 'solo', label: 'Just me' },
  { value: '2-10', label: '2-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
] as const

export const GOAL_OPTIONS = [
  { value: 'brand_identity', label: 'Build brand identity' },
  { value: 'marketing_assets', label: 'Create marketing assets' },
  { value: 'guidelines', label: 'Generate brand guidelines' },
  { value: 'website', label: 'Design a website/landing page' },
] as const

export const REFERRAL_OPTIONS = [
  { value: 'google', label: 'Google search' },
  { value: 'social', label: 'Social media' },
  { value: 'friend', label: 'Friend or colleague' },
  { value: 'blog', label: 'Blog or article' },
  { value: 'other', label: 'Other' },
] as const

export const PROFILE_COMPLETION_REWARD = 5

export const userProfileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  },

  async createUserProfile(userId: string, profile?: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          ...profile,
          goals: profile?.goals || [],
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  },

  async getOrCreateProfile(userId: string): Promise<UserProfile | null> {
    const existing = await this.getUserProfile(userId)
    if (existing) return existing
    return this.createUserProfile(userId)
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      analyticsService.setUserProperties({
        full_name: data.full_name,
        company_name: data.company_name,
        role: data.role,
        company_size: data.company_size,
        industry: data.industry,
        goals: data.goals,
      })

      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  },

  async completeOnboarding(userId: string, profileData: Partial<UserProfile>): Promise<{
    profile: UserProfile | null
    tokensRewarded: number
  }> {
    try {
      const existingProfile = await this.getUserProfile(userId)
      const alreadyRewarded = existingProfile?.profile_completion_rewarded || false

      const updates: Partial<UserProfile> = {
        ...profileData,
        onboarding_completed_at: new Date().toISOString(),
        profile_completion_rewarded: true,
      }

      const profile = await this.updateUserProfile(userId, updates)

      let tokensRewarded = 0
      if (!alreadyRewarded && profile) {
        await tokenService.addTokens(
          userId,
          PROFILE_COMPLETION_REWARD,
          'Profile completion reward'
        )
        tokensRewarded = PROFILE_COMPLETION_REWARD

        await analyticsService.trackOnboarding(EventName.ONBOARDING_COMPLETED, {
          tokensRewarded: PROFILE_COMPLETION_REWARD,
        })
      }

      return { profile, tokensRewarded }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      return { profile: null, tokensRewarded: 0 }
    }
  },

  async skipOnboarding(userId: string): Promise<UserProfile | null> {
    try {
      const profile = await this.updateUserProfile(userId, {
        onboarding_skipped_at: new Date().toISOString(),
      })

      await analyticsService.trackOnboarding(EventName.ONBOARDING_SKIPPED, {
        skipped: true,
      })

      return profile
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      return null
    }
  },

  calculateProfileCompletion(profile: UserProfile | null): {
    percentage: number
    missingFields: string[]
  } {
    if (!profile) {
      return { percentage: 0, missingFields: ['All fields'] }
    }

    const fields = [
      { key: 'full_name', label: 'Full name' },
      { key: 'company_name', label: 'Company name' },
      { key: 'role', label: 'Role' },
      { key: 'company_size', label: 'Company size' },
      { key: 'industry', label: 'Industry' },
      { key: 'goals', label: 'Goals' },
    ]

    const missingFields: string[] = []
    let completedCount = 0

    for (const field of fields) {
      const value = profile[field.key as keyof UserProfile]
      if (field.key === 'goals') {
        if (Array.isArray(value) && value.length > 0) {
          completedCount++
        } else {
          missingFields.push(field.label)
        }
      } else if (value && String(value).trim() !== '') {
        completedCount++
      } else {
        missingFields.push(field.label)
      }
    }

    const percentage = Math.round((completedCount / fields.length) * 100)
    return { percentage, missingFields }
  },

  needsOnboarding(profile: UserProfile | null): boolean {
    if (!profile) return true
    if (profile.onboarding_completed_at) return false
    if (profile.onboarding_skipped_at) return false
    return true
  },

  canEarnReward(profile: UserProfile | null): boolean {
    if (!profile) return true
    return !profile.profile_completion_rewarded
  },
}
