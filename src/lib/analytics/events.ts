export const EventCategory = {
  BRAND: 'brand',
  DESIGN: 'design',
  AI: 'ai',
  EXPORT: 'export',
  ONBOARDING: 'onboarding',
  AUTH: 'auth',
  ENGAGEMENT: 'engagement',
} as const

export type EventCategoryType = typeof EventCategory[keyof typeof EventCategory]

export const EventName = {
  BRAND_CREATED: 'brand.created',
  BRAND_UPDATED: 'brand.updated',
  BRAND_DELETED: 'brand.deleted',
  BRAND_ARCHIVED: 'brand.archived',
  BRAND_RESTORED: 'brand.restored',
  BRAND_DUPLICATED: 'brand.duplicated',

  DESIGN_COLOR_SELECTED: 'design.color_selected',
  DESIGN_COLOR_GENERATED: 'design.color_generated',
  DESIGN_FONT_SELECTED: 'design.font_selected',
  DESIGN_TYPOGRAPHY_GENERATED: 'design.typography_generated',
  DESIGN_ARCHETYPE_SELECTED: 'design.archetype_selected',
  DESIGN_VALUES_SELECTED: 'design.values_selected',
  DESIGN_LOGO_STYLE_SELECTED: 'design.logo_style_selected',

  AI_LOGO_GENERATED: 'ai.logo_generated',
  AI_PALETTE_GENERATED: 'ai.palette_generated',
  AI_TYPOGRAPHY_GENERATED: 'ai.typography_generated',
  AI_VOICE_GENERATED: 'ai.voice_generated',
  AI_GUIDELINES_GENERATED: 'ai.guidelines_generated',
  AI_CONTENT_GENERATED: 'ai.content_generated',
  AI_LANDING_PAGE_GENERATED: 'ai.landing_page_generated',
  AI_CHAT_MESSAGE_SENT: 'ai.chat_message_sent',

  EXPORT_GUIDELINES_PDF: 'export.guidelines_pdf',
  EXPORT_ASSET_DOWNLOADED: 'export.asset_downloaded',
  EXPORT_LANDING_PAGE_CODE: 'export.landing_page_code',
  EXPORT_LOGO_DOWNLOADED: 'export.logo_downloaded',

  ONBOARDING_STARTED: 'onboarding.started',
  ONBOARDING_STEP_COMPLETED: 'onboarding.step_completed',
  ONBOARDING_SKIPPED: 'onboarding.skipped',
  ONBOARDING_COMPLETED: 'onboarding.completed',

  AUTH_SIGNED_UP: 'auth.signed_up',
  AUTH_LOGGED_IN: 'auth.logged_in',
  AUTH_LOGGED_OUT: 'auth.logged_out',

  PAGE_VIEWED: 'engagement.page_viewed',
  FEATURE_CLICKED: 'engagement.feature_clicked',
  TOKEN_PURCHASED: 'engagement.token_purchased',
  TOKEN_USED: 'engagement.token_used',
} as const

export type EventNameType = typeof EventName[keyof typeof EventName]

export interface BaseEventProperties {
  timestamp?: string
  sessionId?: string
}

export interface BrandEventProperties extends BaseEventProperties {
  brandId?: string
  brandName?: string
}

export interface DesignEventProperties extends BrandEventProperties {
  designType?: string
  value?: string | string[]
  previousValue?: string | string[]
}

export interface AIEventProperties extends BrandEventProperties {
  actionType?: string
  tokensUsed?: number
  success?: boolean
  errorMessage?: string
}

export interface ExportEventProperties extends BrandEventProperties {
  exportType?: string
  format?: string
  fileName?: string
}

export interface OnboardingEventProperties extends BaseEventProperties {
  step?: number
  stepName?: string
  totalSteps?: number
  skipped?: boolean
  tokensRewarded?: number
}

export interface PageViewProperties extends BaseEventProperties {
  pageName?: string
  path?: string
  referrer?: string
}

export type EventProperties =
  | BaseEventProperties
  | BrandEventProperties
  | DesignEventProperties
  | AIEventProperties
  | ExportEventProperties
  | OnboardingEventProperties
  | PageViewProperties

export function getCategoryForEvent(eventName: EventNameType): EventCategoryType {
  const prefix = eventName.split('.')[0]
  switch (prefix) {
    case 'brand':
      return EventCategory.BRAND
    case 'design':
      return EventCategory.DESIGN
    case 'ai':
      return EventCategory.AI
    case 'export':
      return EventCategory.EXPORT
    case 'onboarding':
      return EventCategory.ONBOARDING
    case 'auth':
      return EventCategory.AUTH
    case 'engagement':
      return EventCategory.ENGAGEMENT
    default:
      return EventCategory.ENGAGEMENT
  }
}
