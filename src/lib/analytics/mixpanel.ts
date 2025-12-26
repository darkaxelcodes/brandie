import type { EventNameType, EventProperties } from './events'

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN

if (import.meta.env.DEV) {
  console.log('Mixpanel token present:', !!MIXPANEL_TOKEN)
}

interface MixpanelInstance {
  init: (token: string, config?: Record<string, unknown>) => void
  track: (event: string, properties?: Record<string, unknown>) => void
  identify: (userId: string) => void
  people: {
    set: (properties: Record<string, unknown>) => void
    set_once: (properties: Record<string, unknown>) => void
    increment: (property: string, value?: number) => void
  }
  register: (properties: Record<string, unknown>) => void
  register_once: (properties: Record<string, unknown>) => void
  reset: () => void
  get_distinct_id: () => string
}

declare global {
  interface Window {
    mixpanel?: MixpanelInstance
  }
}

let initialized = false

function loadMixpanelScript(): void {
  if (window.mixpanel || document.getElementById('mixpanel-script')) return

  const script = document.createElement('script')
  script.id = 'mixpanel-script'
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'

  script.onload = () => {
    if (window.mixpanel && MIXPANEL_TOKEN) {
      window.mixpanel.init(MIXPANEL_TOKEN, {
        debug: import.meta.env.DEV,
        persistence: 'localStorage',
        ignore_dnt: false,
        autocapture: true,
        record_sessions_percent: 100,
      })
    }
  }

  document.head.appendChild(script)
}

export function initMixpanel(): void {
  if (initialized) return
  initialized = true

  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token not configured. Analytics will only be stored in database.')
    return
  }

  loadMixpanelScript()
}

export function trackMixpanelEvent(
  eventName: EventNameType | string,
  properties?: EventProperties & Record<string, unknown>
): void {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.track(eventName, {
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
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.identify(userId)

    if (properties) {
      window.mixpanel.people.set(properties)
    }
  } catch (error) {
    console.error('Mixpanel identify error:', error)
  }
}

export function setMixpanelUserProperties(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.people.set(properties)
  } catch (error) {
    console.error('Mixpanel set user properties error:', error)
  }
}

export function setMixpanelUserPropertiesOnce(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.people.set_once(properties)
  } catch (error) {
    console.error('Mixpanel set_once error:', error)
  }
}

export function incrementMixpanelProperty(property: string, value: number = 1): void {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.people.increment(property, value)
  } catch (error) {
    console.error('Mixpanel increment error:', error)
  }
}

export function registerMixpanelSuperProperties(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.register(properties)
  } catch (error) {
    console.error('Mixpanel register error:', error)
  }
}

export function resetMixpanel(): void {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return

  try {
    window.mixpanel.reset()
  } catch (error) {
    console.error('Mixpanel reset error:', error)
  }
}

export function getMixpanelDistinctId(): string | null {
  if (!MIXPANEL_TOKEN || !window.mixpanel) return null

  try {
    return window.mixpanel.get_distinct_id()
  } catch (error) {
    console.error('Mixpanel get_distinct_id error:', error)
    return null
  }
}
