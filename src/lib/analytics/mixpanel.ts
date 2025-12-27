import mixpanel from 'mixpanel-browser'
import type { EventNameType, EventProperties } from './events'

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN

if (import.meta.env.DEV) {
  console.log('Mixpanel token present:', !!MIXPANEL_TOKEN)
}

let initialized = false

export function initMixpanel(): void {
  if (initialized) return
  initialized = true

  if (!MIXPANEL_TOKEN) {
    if (import.meta.env.DEV) {
      console.log('Mixpanel token not configured. Analytics will only be stored in database.')
    }
    return
  }

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: import.meta.env.DEV,
      persistence: 'localStorage',
      ignore_dnt: false,
      track_pageview: true,
      track_links: true,
      track_forms: true,
      property_blacklist: ['$password', 'password', 'token', 'api_key'],
    })

    if (import.meta.env.DEV) {
      console.log('Mixpanel initialized successfully')
    }
  } catch (error) {
    console.error('Mixpanel init error:', error)
  }
}

export function trackMixpanelEvent(
  eventName: EventNameType | string,
  properties?: EventProperties & Record<string, unknown>
): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Mixpanel tracking error:', error)
  }
}

export function identifyMixpanelUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.identify(userId)

    if (properties) {
      mixpanel.people.set(properties)
    }
  } catch (error) {
    console.error('Mixpanel identify error:', error)
  }
}

export function setMixpanelUserProperties(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.people.set(properties)
  } catch (error) {
    console.error('Mixpanel set user properties error:', error)
  }
}

export function setMixpanelUserPropertiesOnce(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.people.set_once(properties)
  } catch (error) {
    console.error('Mixpanel set_once error:', error)
  }
}

export function incrementMixpanelProperty(property: string, value: number = 1): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.people.increment(property, value)
  } catch (error) {
    console.error('Mixpanel increment error:', error)
  }
}

export function registerMixpanelSuperProperties(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.register(properties)
  } catch (error) {
    console.error('Mixpanel register error:', error)
  }
}

export function resetMixpanel(): void {
  if (!MIXPANEL_TOKEN || !initialized) return

  try {
    mixpanel.reset()
  } catch (error) {
    console.error('Mixpanel reset error:', error)
  }
}

export function getMixpanelDistinctId(): string | null {
  if (!MIXPANEL_TOKEN || !initialized) return null

  try {
    return mixpanel.get_distinct_id()
  } catch (error) {
    console.error('Mixpanel get_distinct_id error:', error)
    return null
  }
}
