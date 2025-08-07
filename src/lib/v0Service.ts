// Lazy import v0 to prevent initialization issues
let v0: any = null

const getV0Client = async () => {
  if (!v0) {
    try {
      const { v0: v0Client } = await import('v0-sdk')
      v0 = v0Client
    } catch (error) {
      console.error('Failed to load v0 SDK:', error)
      throw new Error('v0 SDK not available')
    }
  }
  return v0
}

export interface V0LandingPageRequest {
  brandData: any
  landingPageData: any
  template: string
  style: string
}

export interface V0LandingPageResponse {
  chatId: string
  demoUrl: string
  files: Array<{
    name: string
    content: string
    type: string
  }>
  previewHtml?: string
}

export const v0Service = {
  // Generate landing page using v0 AI
  async generateLandingPage(request: V0LandingPageRequest): Promise<V0LandingPageResponse> {
    try {
      const v0Client = await getV0Client()
      
      const prompt = this.buildV0Prompt(request)
      const systemContext = this.buildSystemContext(request)
      
      // Create a new chat with v0
      const chat = await v0Client.chats.create({
        message: prompt,
        system: systemContext,
        chatPrivacy: 'private',
        modelConfiguration: {
          modelId: 'v0-1.5-md',
          imageGenerations: false,
        }
      })

      // Wait a moment for generation to complete
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Get the chat details with files
      const chatDetails = await v0Client.chats.getById({ chatId: chat.id })
      
      return {
        chatId: chat.id,
        demoUrl: chat.demo || '',
        files: chatDetails.files || [],
        previewHtml: chat.demo ? `<iframe src="${chat.demo}" width="100%" height="600px" frameborder="0"></iframe>` : undefined
      }
    } catch (error) {
      console.error('Error generating landing page with v0:', error)
      throw new Error(`v0 API Error: ${error.message || 'Failed to generate landing page'}`)
    }
  },

  // Build the v0 prompt with brand context
  buildV0Prompt(request: V0LandingPageRequest): string {
    const { brandData, landingPageData, template, style } = request
    
    let prompt = `Create a professional, SEO-optimized Next.js landing page for "${brandData.brand?.name}" with the following specifications:

## Brand Context:
- **Brand Name**: ${brandData.brand?.name}
- **Industry**: ${brandData.brand?.industry || 'Technology'}
- **Mission**: ${brandData.strategy?.purpose?.mission || 'Not specified'}
- **Vision**: ${brandData.strategy?.purpose?.vision || 'Not specified'}
- **Core Values**: ${brandData.strategy?.values?.coreValues?.join(', ') || 'Not specified'}
- **Target Audience**: ${brandData.strategy?.audience?.primaryAudience || 'Not specified'}
- **Brand Archetype**: ${brandData.strategy?.archetype?.selectedArchetype || 'Not specified'}

## Visual Identity:
- **Primary Colors**: ${brandData.visual?.colors?.colors?.slice(0, 3).join(', ') || '#3B82F6, #1E40AF, #F59E0B'}
- **Typography**: Heading: ${brandData.visual?.typography?.heading?.family || 'Inter'}, Body: ${brandData.visual?.typography?.body?.family || 'Inter'}
- **Logo**: ${brandData.visual?.logo ? 'Available (will be provided)' : 'Use brand name as text logo'}

## Brand Voice:
- **Tone**: ${this.getToneDescription(brandData.voice?.tone_scales)}
- **Tagline**: ${brandData.voice?.messaging?.tagline || landingPageData.heroTitle}
- **Key Messages**: ${brandData.voice?.messaging?.keyMessages?.join(', ') || 'Not specified'}

## Landing Page Content:
- **Hero Title**: ${landingPageData.heroTitle}
- **Hero Subtitle**: ${landingPageData.heroSubtitle}
- **CTA Text**: ${landingPageData.ctaText}
- **CTA URL**: ${landingPageData.ctaUrl}

## Features to Include:
${landingPageData.features.map((feature, index) => 
  `${index + 1}. **${feature.title}**: ${feature.description}`
).join('\n')}

## Testimonials:
${landingPageData.testimonials.map((testimonial, index) => 
  `${index + 1}. "${testimonial.quote}" - ${testimonial.author}, ${testimonial.role} at ${testimonial.company}`
).join('\n')}

## Template & Style Requirements:
- **Template Type**: ${template} (${this.getTemplateDescription(template)})
- **Design Style**: ${style} (${this.getStyleDescription(style)})
- **Contact Email**: ${landingPageData.contactEmail}
- **Footer Text**: ${landingPageData.footerText}

## Technical Requirements:
- Use Next.js 14+ with App Router
- Implement with TypeScript and Tailwind CSS
- Make it fully responsive (mobile-first)
- Include proper SEO meta tags and structured data
- Add email capture form with validation
- Include smooth animations and micro-interactions
- Ensure accessibility (WCAG AA compliance)
- Optimize for Core Web Vitals
- Include proper error handling for forms

## Lead Magnet Features:
- Email signup form with validation
- Newsletter subscription integration
- Contact form with proper validation
- Social media links integration
- Call-to-action buttons throughout
- Trust signals and social proof sections
- Mobile-optimized design

Please create a complete, production-ready landing page that converts visitors into leads.`

    return prompt
  },

  // Build system context for v0 AI
  buildSystemContext(request: V0LandingPageRequest): string {
    return `You are an expert Next.js developer and conversion optimization specialist with deep expertise in:

## Technical Excellence:
- Next.js 14+ with App Router, TypeScript, and Tailwind CSS
- Modern React patterns and performance optimization
- SEO best practices and Core Web Vitals optimization
- Accessibility standards (WCAG AA compliance)
- Responsive design and mobile-first development

## Conversion Optimization:
- Landing page psychology and user experience design
- Lead generation and email capture optimization
- Trust signal placement and social proof integration
- Call-to-action optimization and A/B testing principles
- Conversion funnel design and user journey mapping

## Brand Integration:
- Consistent brand application across all elements
- Color psychology and visual hierarchy
- Typography that enhances readability and brand personality
- Brand voice integration in all copy and messaging

## Lead Magnet Expertise:
- Email marketing integration and list building
- Form design and validation best practices
- Newsletter signup optimization
- Contact form design and user experience
- Social media integration and sharing optimization

## Code Quality Standards:
- Write clean, maintainable, and well-documented code
- Use semantic HTML and proper component structure
- Implement proper error handling and loading states
- Follow Next.js and React best practices
- Ensure type safety with TypeScript

## SEO & Performance:
- Implement proper meta tags, Open Graph, and structured data
- Optimize images and assets for fast loading
- Use proper heading hierarchy and semantic markup
- Implement analytics tracking preparation
- Ensure fast loading times and good Core Web Vitals scores

Create landing pages that not only look professional but also convert visitors into leads effectively while maintaining the brand's unique identity and voice.`
  },

  // Get tone description from brand voice scales
  getToneDescription(scales: any): string {
    if (!scales) return 'Professional and balanced'
    
    const descriptions = []

    if (scales.formalCasual < 30) descriptions.push('formal')
    else if (scales.formalCasual > 70) descriptions.push('casual')
    else descriptions.push('balanced')

    if (scales.logicalEmotional < 30) descriptions.push('logical')
    else if (scales.logicalEmotional > 70) descriptions.push('emotional')

    if (scales.playfulSerious < 30) descriptions.push('serious')
    else if (scales.playfulSerious > 70) descriptions.push('playful')

    if (scales.traditionalInnovative < 30) descriptions.push('traditional')
    else if (scales.traditionalInnovative > 70) descriptions.push('innovative')

    return descriptions.join(', ') || 'Professional and balanced'
  },

  // Get template description
  getTemplateDescription(template: string): string {
    const descriptions = {
      startup: 'Modern startup landing page with hero section, features, testimonials, and strong CTAs',
      agency: 'Professional agency showcase with portfolio elements, team section, and service highlights',
      saas: 'SaaS product landing page with feature comparison, pricing, and trial signup',
      portfolio: 'Personal/creative portfolio with project showcase and contact information',
      ecommerce: 'E-commerce landing page with product highlights, reviews, and purchase CTAs'
    }
    return descriptions[template as keyof typeof descriptions] || 'Modern business landing page'
  },

  // Get style description
  getStyleDescription(style: string): string {
    const descriptions = {
      minimal: 'Clean, minimal design with lots of white space and subtle elements',
      modern: 'Contemporary design with gradients, shadows, and modern UI patterns',
      bold: 'Strong, impactful design with high contrast and bold typography',
      elegant: 'Sophisticated design with refined typography and premium aesthetics'
    }
    return descriptions[style as keyof typeof descriptions] || 'Modern and professional'
  },

  // Continue conversation with v0
  async refineGeneration(chatId: string, refinementMessage: string): Promise<V0LandingPageResponse> {
    try {
      const v0Client = await getV0Client()
      
      const response = await v0Client.chats.sendMessage({
        chatId,
        message: refinementMessage
      })

      // Get updated chat details
      const chatDetails = await v0Client.chats.getById({ chatId })
      
      return {
        chatId,
        demoUrl: chatDetails.demo || '',
        files: chatDetails.files || [],
        previewHtml: chatDetails.demo ? `<iframe src="${chatDetails.demo}" width="100%" height="600px" frameborder="0"></iframe>` : undefined
      }
    } catch (error) {
      console.error('Error refining v0 generation:', error)
      throw new Error(`v0 API Error: ${error.message || 'Failed to refine landing page'}`)
    }
  },

  // Get chat versions for iteration
  async getChatVersions(chatId: string) {
    try {
      const v0Client = await getV0Client()
      const versions = await v0Client.chats.findVersions({ chatId })
      return versions
    } catch (error) {
      console.error('Error getting chat versions:', error)
      throw error
    }
  },

  // Export generated files
  async exportFiles(chatId: string): Promise<{ name: string; content: string; type: string }[]> {
    try {
      const v0Client = await getV0Client()
      const chat = await v0Client.chats.getById({ chatId })
      return chat.files || []
    } catch (error) {
      console.error('Error exporting files:', error)
      throw error
    }
  }
}