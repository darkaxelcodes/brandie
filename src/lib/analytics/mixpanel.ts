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
let isReady = false
let readyCallbacks: (() => void)[] = []

function notifyReady(): void {
  isReady = true
  readyCallbacks.forEach(callback => callback())
  readyCallbacks = []
}

function onMixpanelReady(callback: () => void): void {
  if (isReady) {
    callback()
  } else {
    readyCallbacks.push(callback)
  }
}

function isMixpanelReady(): boolean {
  return isReady && window.mixpanel !== undefined
}

function loadMixpanelScript(): void {
  if (window.mixpanel || document.getElementById('mixpanel-script')) {
    if (window.mixpanel && MIXPANEL_TOKEN) {
      try {
        window.mixpanel.init(MIXPANEL_TOKEN, {
          debug: import.meta.env.DEV,
          persistence: 'localStorage',
          ignore_dnt: false,
          autocapture: false,
          record_sessions_percent: 0,
        })
        notifyReady()
      } catch (error) {
        console.error('Mixpanel init error:', error)
      }
    }
    return
  }

  const script = document.createElement('script')
  script.id = 'mixpanel-script'
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'

  script.onload = () => {
    if (window.mixpanel && MIXPANEL_TOKEN) {
      try {
        window.mixpanel.init(MIXPANEL_TOKEN, {
          debug: import.meta.env.DEV,
          persistence: 'localStorage',
          ignore_dnt: false,
          autocapture: false,
          record_sessions_percent: 0,
        })
        notifyReady()
      } catch (error) {
        console.error('Mixpanel init error:', error)
      }
    }
  }

  script.onerror = () => {
    console.error('Failed to load Mixpanel script')
  }

  document.head.appendChild(script)
}

export function initMixpanel(): void {
  if (initialized) return
  initialized = true

  if (!MIXPANEL_TOKEN) {
    if (import.meta.env.DEV) {
      console.log('Mixpanel token not configured. Analytics will only be stored in database.')
    }
    return
  }

  loadMixpanelScript()
}

export function trackMixpanelEvent(
  eventName: EventNameType | string,
  properties?: EventProperties & Record<string, unknown>
): void {
  if (!MIXPANEL_TOKEN) return

  const performTrack = () => {
    if (!isMixpanelReady()) return

    try {
      window.mixpanel!.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Mixpanel tracking error:', error)
    }
  }

  if (isMixpanelReady()) {
    performTrack()
  } else {
    onMixpanelReady(performTrack)
  }
}

export function identifyMixpanelUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (!MIXPANEL_TOKEN) return

  const performIdentify = () => {
    if (!isMixpanelReady()) return

    try {
      window.mixpanel!.identify(userId)

      if (properties) {
        window.mixpanel!.people.set(properties)
      }
    } catch (error) {
      console.error('Mixpanel identify error:', error)
    }
  }

  if (isMixpanelReady()) {
    performIdentify()
  } else {
    onMixpanelReady(performIdentify)
  }
}

export function setMixpanelUserProperties(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN) return

  const performSet = () => {
    if (!isMixpanelReady()) return

    try {
      window.mixpanel!.people.set(properties)
    } catch (error) {
      console.error('Mixpanel set user properties error:', error)
    }
  }

  if (isMixpanelReady()) {
    performSet()
  } else {
    onMixpanelReady(performSet)
  }
}

export function setMixpanelUserPropertiesOnce(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN) return

  const performSetOnce = () => {
    if (!isMixpanelReady()) return

    try {
      window.mixpanel!.people.set_once(properties)
    } catch (error) {
      console.error('Mixpanel set_once error:', error)
    }
  }

  if (isMixpanelReady()) {
    performSetOnce()
  } else {
    onMixpanelReady(performSetOnce)
  }
}

export function incrementMixpanelProperty(property: string, value: number = 1): void {
  if (!MIXPANEL_TOKEN) return

  const performIncrement = () => {
    if (!isMixpanelReady()) return

    try {
      window.mixpanel!.people.increment(property, value)
    } catch (error) {
      console.error('Mixpanel increment error:', error)
    }
  }

  if (isMixpanelReady()) {
    performIncrement()
  } else {
    onMixpanelReady(performIncrement)
  }
}

export function registerMixpanelSuperProperties(properties: Record<string, unknown>): void {
  if (!MIXPANEL_TOKEN) return

  const performRegister = () => {
    if (!isMixpanelReady()) return

    try {
      window.mixpanel!.register(properties)
    } catch (error) {
      console.error('Mixpanel register error:', error)
    }
  }

  if (isMixpanelReady()) {
    performRegister()
  } else {
    onMixpanelReady(performRegister)
  }
}

export function resetMixpanel(): void {
  if (!MIXPANEL_TOKEN) return

  if (!isMixpanelReady()) return

  try {
    window.mixpanel!.reset()
  } catch (error) {
    console.error('Mixpanel reset error:', error)
  }
}

export function getMixpanelDistinctId(): string | null {
  if (!MIXPANEL_TOKEN || !isMixpanelReady()) return null

  try {
    return window.mixpanel!.get_distinct_id()
  } catch (error) {
    console.error('Mixpanel get_distinct_id error:', error)
    return null
  }
}
