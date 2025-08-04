import { generateStrategySuggestions } from './openai'

export interface LandingPageContent {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  ctaUrl: string
  features: Array<{
    title: string
    description: string
    icon: string
  }>
  testimonials: Array<{
    quote: string
    author: string
    role: string
    company: string
    avatar: string
  }>
  socialProof: string[]
  footerText: string
  contactEmail: string
}

export const landingPageService = {
  // Generate landing page content using AI
  async generateLandingPageContent(
    brandData: any, 
    template: string
  ): Promise<Partial<LandingPageContent>> {
    try {
      const context = {
        brandName: brandData.brand?.name,
        strategy: brandData.strategy,
        visual: brandData.visual,
        voice: brandData.voice,
        template,
        industry: brandData.brand?.industry
      }

      const response = await generateStrategySuggestions('landing_page', context)
      
      // Parse AI suggestions into structured content
      return {
        heroTitle: this.extractHeroTitle(response.suggestions, brandData.brand?.name),
        heroSubtitle: this.extractHeroSubtitle(response.suggestions, brandData.strategy),
        features: this.extractFeatures(response.suggestions, brandData.strategy),
        testimonials: this.generateTestimonials(brandData.brand?.name),
        socialProof: this.generateSocialProof(template)
      }
    } catch (error) {
      console.error('Error generating AI content:', error)
      throw error
    }
  },

  // Generate complete HTML for the landing page
  async generateLandingPageHTML(brandData: any, landingPageData: any): Promise<string> {
    const { brand, visual, voice } = brandData
    const colors = visual?.colors?.colors || ['#0066FF', '#1E40AF', '#F59E0B']
    const typography = visual?.typography || { heading: { family: 'Inter' }, body: { family: 'Inter' } }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${landingPageData.heroTitle} | ${brand?.name}</title>
    <meta name="description" content="${landingPageData.heroSubtitle}">
    <link href="https://fonts.googleapis.com/css2?family=${typography.heading?.family?.replace(' ', '+')}:wght@400;600;700&family=${typography.body?.family?.replace(' ', '+')}:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${colors[0]}',
                        secondary: '${colors[1]}',
                        accent: '${colors[2]}'
                    },
                    fontFamily: {
                        heading: ['${typography.heading?.family}', 'sans-serif'],
                        body: ['${typography.body?.family}', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%); }
        .glass { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    </style>
</head>
<body class="font-body">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    ${visual?.logo?.url ? 
                      `<img src="${visual.logo.url}" alt="${brand?.name}" class="w-10 h-10 object-contain">` :
                      `<div class="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                         <span class="text-white font-bold text-lg">${brand?.name?.charAt(0) || 'B'}</span>
                       </div>`
                    }
                    <span class="text-xl font-heading font-bold text-gray-900">${brand?.name}</span>
                </div>
                <a href="${landingPageData.ctaUrl}" class="gradient-bg text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    ${landingPageData.ctaText}
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 gradient-bg text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-6 text-center">
            <h1 class="text-5xl md:text-7xl font-heading font-black mb-6 leading-tight">
                ${landingPageData.heroTitle}
            </h1>
            <p class="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
                ${landingPageData.heroSubtitle}
            </p>
            <a href="${landingPageData.ctaUrl}" class="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-2xl">
                <span>${landingPageData.ctaText}</span>
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                    Why Choose ${brand?.name}?
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the features that make us the perfect choice for your needs
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                ${landingPageData.features.map((feature, index) => `
                    <div class="text-center p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
                            ${this.getIconSVG(feature.icon)}
                        </div>
                        <h3 class="text-xl font-heading font-bold text-gray-900 mb-4">${feature.title}</h3>
                        <p class="text-gray-600 leading-relaxed">${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    ${landingPageData.testimonials.length > 0 ? `
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                    What Our Customers Say
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Don't just take our word for it - hear from our satisfied customers
                </p>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
                ${landingPageData.testimonials.map(testimonial => `
                    <div class="bg-white p-8 rounded-2xl shadow-lg">
                        <div class="flex text-yellow-400 mb-4">
                            ${'★'.repeat(5)}
                        </div>
                        <blockquote class="text-gray-700 text-lg leading-relaxed mb-6 italic">
                            "${testimonial.quote}"
                        </blockquote>
                        <div class="flex items-center space-x-4">
                            <img src="${testimonial.avatar}" alt="${testimonial.author}" class="w-12 h-12 rounded-full object-cover">
                            <div>
                                <div class="font-bold text-gray-900">${testimonial.author}</div>
                                <div class="text-sm text-gray-600">${testimonial.role}, ${testimonial.company}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- CTA Section -->
    <section class="py-20 gradient-bg text-white">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h2 class="text-4xl md:text-5xl font-heading font-bold mb-6">
                Ready to Get Started?
            </h2>
            <p class="text-xl mb-12 max-w-2xl mx-auto opacity-90">
                Join thousands of satisfied customers who have transformed their business with ${brand?.name}
            </p>
            <a href="${landingPageData.ctaUrl}" class="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-2xl">
                <span>${landingPageData.ctaText}</span>
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center space-x-3 mb-4 md:mb-0">
                    ${visual?.logo?.url ? 
                      `<img src="${visual.logo.url}" alt="${brand?.name}" class="w-8 h-8 object-contain">` :
                      `<div class="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                         <span class="text-white font-bold">${brand?.name?.charAt(0) || 'B'}</span>
                       </div>`
                    }
                    <span class="text-xl font-heading font-bold">${brand?.name}</span>
                </div>
                <div class="text-center md:text-right">
                    <p class="text-gray-400 mb-2">${landingPageData.footerText}</p>
                    <a href="mailto:${landingPageData.contactEmail}" class="text-gray-300 hover:text-white transition-colors">
                        ${landingPageData.contactEmail}
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Analytics and Scripts -->
    <script>
        // Add any analytics or tracking scripts here
        console.log('Landing page loaded for ${brand?.name}');
    </script>
</body>
</html>`
  },

  // Deploy landing page to hosting service
  async deployLandingPage(brandData: any, html: string): Promise<string> {
    try {
      // In a real implementation, this would deploy to Netlify, Vercel, or similar
      // For now, we'll simulate the deployment process
      
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate deployment time
      
      const subdomain = brandData.brand?.name?.toLowerCase().replace(/\s+/g, '-') || 'brand'
      const deployedUrl = `https://${subdomain}-${Date.now()}.netlify.app`
      
      // In production, you would:
      // 1. Create a new Netlify site
      // 2. Upload the HTML and assets
      // 3. Configure custom domain if needed
      // 4. Return the live URL
      
      return deployedUrl
    } catch (error) {
      console.error('Error deploying landing page:', error)
      throw error
    }
  },

  // Helper methods for content extraction
  extractHeroTitle(suggestions: string[], brandName: string): string {
    const titleSuggestion = suggestions.find(s => 
      s.toLowerCase().includes('title') || s.toLowerCase().includes('headline')
    )
    return titleSuggestion || `Transform Your Business with ${brandName}`
  },

  extractHeroSubtitle(suggestions: string[], strategy: any): string {
    const subtitleSuggestion = suggestions.find(s => 
      s.toLowerCase().includes('subtitle') || s.toLowerCase().includes('description')
    )
    return subtitleSuggestion || strategy?.purpose?.mission || 'Discover innovative solutions that drive real results'
  },

  extractFeatures(suggestions: string[], strategy: any): Array<{title: string, description: string, icon: string}> {
    const featureSuggestions = suggestions.filter(s => 
      s.toLowerCase().includes('feature') || s.toLowerCase().includes('benefit')
    )
    
    if (strategy?.values?.coreValues) {
      return strategy.values.coreValues.slice(0, 3).map((value: string, index: number) => ({
        title: value,
        description: `Experience the power of ${value.toLowerCase()} in everything we do`,
        icon: ['zap', 'target', 'shield'][index] || 'sparkles'
      }))
    }
    
    return [
      { title: 'Fast & Reliable', description: 'Get results quickly with our optimized platform', icon: 'zap' },
      { title: 'Easy to Use', description: 'Intuitive interface designed for everyone', icon: 'target' },
      { title: '24/7 Support', description: 'We\'re here to help whenever you need us', icon: 'shield' }
    ]
  },

  generateTestimonials(brandName: string): Array<{quote: string, author: string, role: string, company: string, avatar: string}> {
    return [
      {
        quote: `${brandName} transformed our business completely. The results exceeded our expectations and we saw immediate improvements.`,
        author: 'Sarah Chen',
        role: 'CEO',
        company: 'TechFlow',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        quote: `Working with ${brandName} was a game-changer for our company. Their innovative approach delivered outstanding results.`,
        author: 'Marcus Rodriguez',
        role: 'Founder',
        company: 'InnovateCorp',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ]
  },

  generateSocialProof(template: string): string[] {
    const proofByTemplate: Record<string, string[]> = {
      startup: ['Featured in TechCrunch', '10,000+ Users', 'Y Combinator Backed'],
      agency: ['500+ Clients Served', 'Award-Winning Team', 'Industry Leaders'],
      saas: ['99.9% Uptime', 'SOC 2 Compliant', 'Trusted by Fortune 500'],
      portfolio: ['Featured Designer', '100+ Projects', 'Global Recognition'],
      ecommerce: ['1M+ Products Sold', 'Secure Payments', 'Fast Shipping']
    }
    
    return proofByTemplate[template] || proofByTemplate.startup
  },

  getIconSVG(iconName: string): string {
    const icons: Record<string, string> = {
      zap: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      target: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      shield: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
      'message-square': '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
      sparkles: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>',
      rocket: '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>'
    }
    
    return icons[iconName] || icons.sparkles
  }
}