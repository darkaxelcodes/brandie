export interface TemplateConfig {
  id: string
  name: string
  width: number
  height: number
  platform?: string
  type?: string
}

export interface TemplateElements {
  background: string
  secondaryColor?: string
  text?: string
  subtext?: string
  logo?: {
    url?: string
    svg?: string
  }
  typography?: {
    heading?: { family: string; weight?: number }
    body?: { family: string; weight?: number }
  }
  brandName?: string
  showLogo?: boolean
}

export interface GeneratedTemplate {
  id: string
  name: string
  blob: Blob
  dataUrl: string
  width: number
  height: number
  format: 'png' | 'jpg'
}

export const SOCIAL_MEDIA_SIZES: Record<string, TemplateConfig> = {
  'instagram-post': { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080, platform: 'instagram', type: 'post' },
  'instagram-story': { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, platform: 'instagram', type: 'story' },
  'facebook-post': { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, platform: 'facebook', type: 'post' },
  'facebook-cover': { id: 'facebook-cover', name: 'Facebook Cover', width: 820, height: 312, platform: 'facebook', type: 'cover' },
  'twitter-post': { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675, platform: 'twitter', type: 'post' },
  'twitter-header': { id: 'twitter-header', name: 'Twitter Header', width: 1500, height: 500, platform: 'twitter', type: 'header' },
  'linkedin-post': { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, platform: 'linkedin', type: 'post' },
  'linkedin-cover': { id: 'linkedin-cover', name: 'LinkedIn Cover', width: 1584, height: 396, platform: 'linkedin', type: 'cover' },
  'youtube-thumbnail': { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'youtube', type: 'thumbnail' },
  'youtube-banner': { id: 'youtube-banner', name: 'YouTube Banner', width: 2560, height: 1440, platform: 'youtube', type: 'banner' },
}

export const MARKETING_SIZES: Record<string, TemplateConfig> = {
  'flyer-letter': { id: 'flyer-letter', name: 'Flyer (Letter)', width: 2550, height: 3300, type: 'print' },
  'flyer-a4': { id: 'flyer-a4', name: 'Flyer (A4)', width: 2480, height: 3508, type: 'print' },
  'business-card': { id: 'business-card', name: 'Business Card', width: 1050, height: 600, type: 'print' },
  'brochure-trifold': { id: 'brochure-trifold', name: 'Tri-fold Brochure', width: 3300, height: 2550, type: 'print' },
  'web-banner-leaderboard': { id: 'web-banner-leaderboard', name: 'Web Banner (Leaderboard)', width: 728, height: 90, type: 'digital' },
  'web-banner-rectangle': { id: 'web-banner-rectangle', name: 'Web Banner (Rectangle)', width: 300, height: 250, type: 'digital' },
  'web-banner-skyscraper': { id: 'web-banner-skyscraper', name: 'Web Banner (Skyscraper)', width: 160, height: 600, type: 'digital' },
  'email-header': { id: 'email-header', name: 'Email Header', width: 600, height: 200, type: 'email' },
  'presentation-16x9': { id: 'presentation-16x9', name: 'Presentation (16:9)', width: 1920, height: 1080, type: 'presentation' },
  'presentation-4x3': { id: 'presentation-4x3', name: 'Presentation (4:3)', width: 1024, height: 768, type: 'presentation' },
}

export const templateGeneratorService = {
  async generateSocialMediaTemplate(
    config: TemplateConfig,
    elements: TemplateElements,
    format: 'png' | 'jpg' = 'png'
  ): Promise<GeneratedTemplate> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    canvas.width = config.width
    canvas.height = config.height

    await this.drawTemplate(ctx, config, elements)

    return this.canvasToTemplate(canvas, config, format)
  },

  async generateMarketingTemplate(
    config: TemplateConfig,
    elements: TemplateElements,
    format: 'png' | 'jpg' = 'png'
  ): Promise<GeneratedTemplate> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    canvas.width = config.width
    canvas.height = config.height

    await this.drawMarketingTemplate(ctx, config, elements)

    return this.canvasToTemplate(canvas, config, format)
  },

  async drawTemplate(
    ctx: CanvasRenderingContext2D,
    config: TemplateConfig,
    elements: TemplateElements
  ): Promise<void> {
    const { width, height } = config
    const { background, secondaryColor, text, subtext, logo, typography, brandName, showLogo = true } = elements

    this.drawGradientBackground(ctx, width, height, background, secondaryColor)

    this.drawDecorativeElements(ctx, width, height, background, secondaryColor)

    if (showLogo && logo) {
      await this.drawLogo(ctx, logo, width, height, config.type)
    }

    if (text) {
      this.drawText(ctx, text, width, height, typography, config.type, 'heading')
    }

    if (subtext) {
      this.drawText(ctx, subtext, width, height, typography, config.type, 'subtext')
    }

    if (brandName && !showLogo) {
      this.drawBrandName(ctx, brandName, width, height, background)
    }

    this.drawWatermark(ctx, width, height)
  },

  async drawMarketingTemplate(
    ctx: CanvasRenderingContext2D,
    config: TemplateConfig,
    elements: TemplateElements
  ): Promise<void> {
    const { width, height } = config
    const { background, secondaryColor, text, subtext, logo, typography, brandName, showLogo = true } = elements

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    this.drawHeaderBand(ctx, width, height, background, secondaryColor)

    if (showLogo && logo) {
      await this.drawLogo(ctx, logo, width, height, 'marketing')
    }

    if (text) {
      this.drawMarketingText(ctx, text, width, height, typography, background)
    }

    if (subtext) {
      this.drawMarketingSubtext(ctx, subtext, width, height, typography)
    }

    this.drawFooterBand(ctx, width, height, background)

    if (brandName) {
      this.drawBrandNameFooter(ctx, brandName, width, height)
    }
  },

  drawGradientBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    primaryColor: string,
    secondaryColor?: string
  ): void {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, primaryColor)
    gradient.addColorStop(1, secondaryColor || this.darkenColor(primaryColor, 20))

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  },

  drawDecorativeElements(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    primaryColor: string,
    secondaryColor?: string
  ): void {
    ctx.save()
    ctx.globalAlpha = 0.1

    const circleRadius = Math.min(width, height) * 0.3
    ctx.beginPath()
    ctx.arc(width * 0.85, height * 0.15, circleRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(width * 0.1, height * 0.9, circleRadius * 0.6, 0, Math.PI * 2)
    ctx.fillStyle = secondaryColor || this.lightenColor(primaryColor, 20)
    ctx.fill()

    ctx.restore()

    ctx.save()
    ctx.globalAlpha = 0.05
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(0, height * (0.3 + i * 0.2))
      ctx.quadraticCurveTo(
        width * 0.5,
        height * (0.2 + i * 0.2),
        width,
        height * (0.4 + i * 0.2)
      )
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
    }
    ctx.restore()
  },

  drawHeaderBand(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    primaryColor: string,
    secondaryColor?: string
  ): void {
    const bandHeight = height * 0.25
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, primaryColor)
    gradient.addColorStop(1, secondaryColor || this.darkenColor(primaryColor, 15))

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, bandHeight)

    ctx.save()
    ctx.globalAlpha = 0.1
    ctx.beginPath()
    ctx.moveTo(0, bandHeight)
    ctx.quadraticCurveTo(width * 0.5, bandHeight + 40, width, bandHeight)
    ctx.lineTo(width, 0)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.restore()
  },

  drawFooterBand(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    primaryColor: string
  ): void {
    const bandHeight = height * 0.08
    ctx.fillStyle = primaryColor
    ctx.fillRect(0, height - bandHeight, width, bandHeight)
  },

  async drawLogo(
    ctx: CanvasRenderingContext2D,
    logo: { url?: string; svg?: string },
    width: number,
    height: number,
    type?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      const logoSize = type === 'story' ? Math.min(width, height) * 0.15 : Math.min(width, height) * 0.12
      const logoX = type === 'story' ? (width - logoSize) / 2 : width * 0.05
      const logoY = type === 'story' ? height * 0.08 : height * 0.08

      img.onload = () => {
        const aspectRatio = img.width / img.height
        let drawWidth = logoSize
        let drawHeight = logoSize / aspectRatio

        if (drawHeight > logoSize) {
          drawHeight = logoSize
          drawWidth = logoSize * aspectRatio
        }

        ctx.save()
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
        ctx.drawImage(img, logoX, logoY, drawWidth, drawHeight)
        ctx.restore()
        resolve()
      }

      img.onerror = () => {
        this.drawPlaceholderLogo(ctx, logoX, logoY, logoSize)
        resolve()
      }

      if (logo.url) {
        img.src = logo.url
      } else if (logo.svg) {
        const svgBlob = new Blob([logo.svg], { type: 'image/svg+xml' })
        img.src = URL.createObjectURL(svgBlob)
      } else {
        this.drawPlaceholderLogo(ctx, logoX, logoY, logoSize)
        resolve()
      }
    })
  },

  drawPlaceholderLogo(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ): void {
    ctx.save()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(x, y, size, size, size * 0.15)
    ctx.fill()

    ctx.fillStyle = '#3B82F6'
    ctx.font = `bold ${size * 0.5}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('B', x + size / 2, y + size / 2)
    ctx.restore()
  },

  drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    typography?: TemplateElements['typography'],
    type?: string,
    textType: 'heading' | 'subtext' = 'heading'
  ): void {
    const fontFamily = typography?.heading?.family || 'Arial'
    const isStory = type === 'story'
    const baseFontSize = Math.min(width, height) * (isStory ? 0.06 : 0.08)
    const fontSize = textType === 'heading' ? baseFontSize : baseFontSize * 0.6

    ctx.save()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `${textType === 'heading' ? 'bold' : 'normal'} ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    const maxWidth = width * 0.8
    const lines = this.wrapText(ctx, text, maxWidth)
    const lineHeight = fontSize * 1.3
    const totalTextHeight = lines.length * lineHeight

    let startY: number
    if (textType === 'heading') {
      startY = isStory ? height * 0.45 : height * 0.5
    } else {
      startY = isStory ? height * 0.55 : height * 0.62
    }
    startY -= totalTextHeight / 2

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight)
    })

    ctx.restore()
  },

  drawMarketingText(
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    typography?: TemplateElements['typography'],
    accentColor?: string
  ): void {
    const fontFamily = typography?.heading?.family || 'Arial'
    const fontSize = Math.min(width, height) * 0.05

    ctx.save()
    ctx.fillStyle = accentColor || '#1F2937'
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const maxWidth = width * 0.85
    const lines = this.wrapText(ctx, text, maxWidth)
    const lineHeight = fontSize * 1.3
    const startY = height * 0.45

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight)
    })

    ctx.restore()
  },

  drawMarketingSubtext(
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    typography?: TemplateElements['typography']
  ): void {
    const fontFamily = typography?.body?.family || 'Arial'
    const fontSize = Math.min(width, height) * 0.025

    ctx.save()
    ctx.fillStyle = '#6B7280'
    ctx.font = `normal ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const maxWidth = width * 0.75
    const lines = this.wrapText(ctx, text, maxWidth)
    const lineHeight = fontSize * 1.5
    const startY = height * 0.6

    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight)
    })

    ctx.restore()
  },

  drawBrandName(
    ctx: CanvasRenderingContext2D,
    brandName: string,
    width: number,
    height: number,
    accentColor: string
  ): void {
    const fontSize = Math.min(width, height) * 0.04

    ctx.save()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 4
    ctx.fillText(brandName, width * 0.05, height - height * 0.05)
    ctx.restore()
  },

  drawBrandNameFooter(
    ctx: CanvasRenderingContext2D,
    brandName: string,
    width: number,
    height: number
  ): void {
    const fontSize = Math.min(width, height) * 0.02
    const bandHeight = height * 0.08

    ctx.save()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(brandName, width / 2, height - bandHeight / 2)
    ctx.restore()
  },

  drawWatermark(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const fontSize = Math.min(width, height) * 0.015

    ctx.save()
    ctx.globalAlpha = 0.3
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `normal ${fontSize}px Arial`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('Created with Brandie', width - width * 0.02, height - height * 0.02)
    ctx.restore()
  },

  wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  },

  async canvasToTemplate(
    canvas: HTMLCanvasElement,
    config: TemplateConfig,
    format: 'png' | 'jpg'
  ): Promise<GeneratedTemplate> {
    return new Promise((resolve, reject) => {
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
      const quality = format === 'jpg' ? 0.92 : undefined

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate template image'))
            return
          }

          const dataUrl = canvas.toDataURL(mimeType, quality)

          resolve({
            id: `${config.id}-${Date.now()}`,
            name: config.name,
            blob,
            dataUrl,
            width: config.width,
            height: config.height,
            format
          })
        },
        mimeType,
        quality
      )
    })
  },

  downloadTemplate(template: GeneratedTemplate, filename?: string): void {
    const link = document.createElement('a')
    link.href = template.dataUrl
    link.download = filename || `${template.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${template.format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  async generateBatchTemplates(
    configs: TemplateConfig[],
    elements: TemplateElements,
    format: 'png' | 'jpg' = 'png'
  ): Promise<GeneratedTemplate[]> {
    const templates: GeneratedTemplate[] = []

    for (const config of configs) {
      const template = await this.generateSocialMediaTemplate(config, elements, format)
      templates.push(template)
    }

    return templates
  },

  darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max((num >> 16) - amt, 0)
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0)
    const B = Math.max((num & 0x0000FF) - amt, 0)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  },

  lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min((num >> 16) + amt, 255)
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255)
    const B = Math.min((num & 0x0000FF) + amt, 255)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  },

  getContrastColor(hex: string): string {
    const { r, g, b } = this.hexToRgb(hex)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  },

  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }
}
