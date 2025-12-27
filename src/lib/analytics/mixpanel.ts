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
  push?: (item: unknown[]) => void
  __loaded?: boolean
}

declare global {
  interface Window {
    mixpanel?: MixpanelInstance
  }
}

let initialized = false

function createMixpanelStub(): void {
  if (window.mixpanel) return

  const mixpanel = {
    __loaded: false,
    queue: [] as unknown[][],
    track: function(event: string, properties?: Record<string, unknown>) {
      this.queue.push(['track', event, properties])
    },
    identify: function(userId: string) {
      this.queue.push(['identify', userId])
    },
    people: {
      set: function(properties: Record<string, unknown>) {
        mixpanel.queue.push(['people.set', properties])
      },
      set_once: function(properties: Record<string, unknown>) {
        mixpanel.queue.push(['people.set_once', properties])
      },
      increment: function(property: string, value?: number) {
        mixpanel.queue.push(['people.increment', property, value])
      },
    },
    register: function(properties: Record<string, unknown>) {
      this.queue.push(['register', properties])
    },
    register_once: function(properties: Record<string, unknown>) {
      this.queue.push(['register_once', properties])
    },
    reset: function() {
      this.queue.push(['reset'])
    },
    get_distinct_id: function() {
      return 'stub-id'
    },
    init: function() {
      this.queue.push(['init', ...arguments])
    },
  } as MixpanelInstance & { queue: unknown[][] }

  window.mixpanel = mixpanel
}

function loadMixpanelScript(): void {
  if (document.getElementById('mixpanel-script')) return

  createMixpanelStub()

  const script = document.createElement('script')
  script.id = 'mixpanel-script'
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'

  script.onload = () => {
    if (!window.mixpanel || !MIXPANEL_TOKEN) return

    try {
      const stub = window.mixpanel as MixpanelInstance & { queue?: unknown[][] }
      const queue = stub.queue || []

      window.mixpanel.init(MIXPANEL_TOKEN, {
        debug: import.meta.env.DEV,
        persistence: 'localStorage',
        ignore_dnt: false,
        loaded: function(mixpanel: MixpanelInstance) {
          if (import.meta.env.DEV) {
            console.log('Mixpanel loaded, replaying', queue.length, 'queued events')
          }

          queue.forEach((item: unknown[]) => {
            const method = item[0] as string
            const args = item.slice(1)

            try {
              if (method === 'track') {
                mixpanel.track(args[0] as string, args[1] as Record<string, unknown>)
              } else if (method === 'identify') {
                mixpanel.identify(args[0] as string)
              } else if (method === 'people.set') {
                mixpanel.people.set(args[0] as Record<string, unknown>)
              } else if (method === 'people.set_once') {
                mixpanel.people.set_once(args[0] as Record<string, unknown>)
              } else if (method === 'people.increment') {
                mixpanel.people.increment(args[0] as string, args[1] as number)
              } else if (method === 'register') {
                mixpanel.register(args[0] as Record<string, unknown>)
              } else if (method === 'register_once') {
                mixpanel.register_once(args[0] as Record<string, unknown>)
              } else if (method === 'reset') {
                mixpanel.reset()
              }
            } catch (err) {
              console.error('Error replaying Mixpanel queue item:', err)
            }
          })

          if (import.meta.env.DEV) {
            console.log('Mixpanel initialization complete')
          }
        },
      })

      if (window.mixpanel) {
        window.mixpanel.__loaded = true
      }
    } catch (error) {
      console.error('Mixpanel init error:', error)
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
