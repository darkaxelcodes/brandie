import { supabase } from '../supabase'
import {
  EventName,
  EventNameType,
  EventProperties,
  getCategoryForEvent,
  type AIEventProperties,
  type BrandEventProperties,
  type DesignEventProperties,
  type ExportEventProperties,
  type OnboardingEventProperties,
  type PageViewProperties,
} from './events'
import {
  initMixpanel,
  trackMixpanelEvent,
  identifyMixpanelUser,
  setMixpanelUserProperties,
  setMixpanelUserPropertiesOnce,
  incrementMixpanelProperty,
  registerMixpanelSuperProperties,
  resetMixpanel,
} from './mixpanel'

let currentUserId: string | null = null
let sessionId: string | null = null

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function getSessionId(): string {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = generateSessionId()
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
  }
  return sessionId
}

async function storeEventInDatabase(
  eventName: EventNameType | string,
  properties: EventProperties & Record<string, unknown>,
  brandId?: string
): Promise<void> {
  if (!currentUserId) return

  try {
    const { error } = await supabase.from('analytics_events').insert({
      user_id: currentUserId,
      brand_id: brandId || null,
      event_name: eventName,
      event_category: getCategoryForEvent(eventName as EventNameType),
      event_properties: properties,
    })

    if (error) {
      console.error('Failed to store analytics event:', error)
    }
  } catch (error) {
    console.error('Analytics DB error:', error)
  }
}

export const analyticsService = {
  async init(): Promise<void> {
    await initMixpanel()
  },

  async identify(userId: string, userProperties?: Record<string, unknown>): Promise<void> {
    currentUserId = userId

    identifyMixpanelUser(userId, userProperties)

    if (userProperties) {
      setMixpanelUserPropertiesOnce({
        $created: new Date().toISOString(),
        first_seen: new Date().toISOString(),
      })
      setMixpanelUserProperties(userProperties)
    }

    registerMixpanelSuperProperties({
      user_id: userId,
      session_id: getSessionId(),
    })
  },

  setUserProperties(properties: Record<string, unknown>): void {
    setMixpanelUserProperties(properties)
  },

  setSuperProperties(properties: Record<string, unknown>): void {
    registerMixpanelSuperProperties(properties)
  },

  reset(): void {
    currentUserId = null
    sessionId = null
    sessionStorage.removeItem('analytics_session_id')
    resetMixpanel()
  },

  async track(
    eventName: EventNameType | string,
    properties?: EventProperties & Record<string, unknown>,
    brandId?: string
  ): Promise<void> {
    const enrichedProperties = {
      ...properties,
      session_id: getSessionId(),
      timestamp: new Date().toISOString(),
    }

    trackMixpanelEvent(eventName, enrichedProperties)

    await storeEventInDatabase(eventName, enrichedProperties, brandId)
  },

  async trackBrand(
    eventName: EventNameType,
    properties: BrandEventProperties
  ): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(eventName, enrichedProps)
    await storeEventInDatabase(eventName, enrichedProps, properties.brandId)

    if (eventName === EventName.BRAND_CREATED) {
      incrementMixpanelProperty('brands_created')
    }
  },

  async trackDesignChoice(
    eventName: EventNameType,
    properties: DesignEventProperties
  ): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(eventName, enrichedProps)
    await storeEventInDatabase(eventName, enrichedProps, properties.brandId)

    incrementMixpanelProperty('design_choices_made')
  },

  async trackAIGeneration(
    eventName: EventNameType,
    properties: AIEventProperties
  ): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(eventName, enrichedProps)
    await storeEventInDatabase(eventName, enrichedProps, properties.brandId)

    incrementMixpanelProperty('ai_generations')
    if (properties.tokensUsed) {
      incrementMixpanelProperty('tokens_spent', properties.tokensUsed)
    }
  },

  async trackExport(
    eventName: EventNameType,
    properties: ExportEventProperties
  ): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(eventName, enrichedProps)
    await storeEventInDatabase(eventName, enrichedProps, properties.brandId)

    incrementMixpanelProperty('exports')
  },

  async trackOnboarding(
    eventName: EventNameType,
    properties: OnboardingEventProperties
  ): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(eventName, enrichedProps)
    await storeEventInDatabase(eventName, enrichedProps)
  },

  async trackPageView(properties: PageViewProperties): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(EventName.PAGE_VIEWED, enrichedProps)
    await storeEventInDatabase(EventName.PAGE_VIEWED, enrichedProps)
  },

  async trackAuth(
    eventName: EventNameType,
    properties?: Record<string, unknown>
  ): Promise<void> {
    const enrichedProps = {
      ...properties,
      session_id: getSessionId(),
    }

    trackMixpanelEvent(eventName, enrichedProps)
    await storeEventInDatabase(eventName, enrichedProps)
  },

  async getRecentEvents(limit: number = 50): Promise<unknown[]> {
    if (!currentUserId) return []

    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recent events:', error)
      return []
    }
  },

  async getEventsByCategory(category: string, limit: number = 50): Promise<unknown[]> {
    if (!currentUserId) return []

    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('event_category', category)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching events by category:', error)
      return []
    }
  },
}
