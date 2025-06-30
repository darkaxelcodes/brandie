import { supabase } from './supabase'
import { generateStrategySuggestions } from './openai'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

export interface GuidelinesData {
  id: string
  brand_id: string
  content: any
  version: number
  created_at: string
  updated_at: string
}

export const guidelinesService = {
  // Generate comprehensive brand guidelines
  async generateGuidelines(brandData: any): Promise<any> {
    try {
      const guidelines = {
        metadata: {
          brandName: brandData.brand.name,
          version: '1.0',
          generatedAt: new Date().toISOString(),
          sections: []
        },
        
        // Brand Overview Section
        brandOverview: {
          mission: brandData.strategy?.purpose?.mission || '',
          vision: brandData.strategy?.purpose?.vision || '',
          why: brandData.strategy?.purpose?.why || '',
          values: brandData.strategy?.values?.coreValues || [],
          positioning: brandData.strategy?.values?.positioning || '',
          uniqueValue: brandData.strategy?.values?.uniqueValue || ''
        },

        // Target Audience Section
        audience: {
          primary: brandData.strategy?.audience?.primaryAudience || '',
          demographics: brandData.strategy?.audience?.demographics || '',
          psychographics: brandData.strategy?.audience?.psychographics || '',
          painPoints: brandData.strategy?.audience?.painPoints || []
        },

        // Visual Identity Section
        visualIdentity: {
          logo: {
            primary: brandData.visual?.logo || null,
            variations: this.generateLogoVariations(brandData.visual?.logo),
            clearSpace: this.generateClearSpaceGuidelines(),
            minimumSizes: this.generateSizeGuidelines(),
            incorrectUsage: this.generateIncorrectUsageExamples()
          },
          colors: {
            palette: brandData.visual?.colors || null,
            usage: this.generateColorUsageGuidelines(brandData.visual?.colors),
            accessibility: this.generateAccessibilityGuidelines(brandData.visual?.colors),
            combinations: this.generateColorCombinations(brandData.visual?.colors)
          },
          typography: {
            primary: brandData.visual?.typography || null,
            hierarchy: this.generateTypographyHierarchy(brandData.visual?.typography),
            usage: this.generateTypographyUsage(brandData.visual?.typography),
            webFonts: this.generateWebFontGuidelines(brandData.visual?.typography)
          }
        },

        // Brand Voice Section
        brandVoice: {
          toneScales: brandData.voice?.tone_scales || {},
          messaging: brandData.voice?.messaging || {},
          guidelines: brandData.voice?.guidelines || {},
          examples: this.generateVoiceExamples(brandData.voice)
        },

        // Usage Guidelines
        usageGuidelines: {
          dos: this.generateDosGuidelines(brandData),
          donts: this.generateDontsGuidelines(brandData),
          applications: this.generateApplicationExamples(brandData)
        },

        // Implementation Guidelines
        implementation: {
          print: this.generatePrintGuidelines(brandData),
          digital: this.generateDigitalGuidelines(brandData),
          social: this.generateSocialMediaGuidelines(brandData)
        }
      }

      return guidelines
    } catch (error) {
      console.error('Error generating guidelines:', error)
      throw error
    }
  },

  // Save guidelines to database
  async saveGuidelines(brandId: string, guidelines: any): Promise<GuidelinesData> {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .upsert({
        brand_id: brandId,
        content: guidelines,
        version: 1
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get existing guidelines
  async getGuidelines(brandId: string): Promise<GuidelinesData | null> {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('brand_id', brandId)
      .maybeSingle()

    if (error) throw error
    return data
  },

  // Export guidelines in various formats
  async exportGuidelines(brandData: any, guidelines: any, format: string): Promise<void> {
    switch (format) {
      case 'pdf':
        await this.exportToPDF(brandData, guidelines)
        break
      case 'web':
        await this.exportToWeb(brandData, guidelines)
        break
      case 'presentation':
        await this.exportToPresentation(brandData, guidelines)
        break
      case 'assets':
        await this.exportAssets(brandData, guidelines)
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  },

  // Generate shareable link
  async generateShareableLink(brandId: string, guidelines: any): Promise<string> {
    try {
      // Generate a unique ID for sharing
      const shareId = Math.random().toString(36).substring(2, 15)
      
      // In a real implementation, this would store the share link in the database
      // For now, we'll just return a mock URL
      return `${window.location.origin}/guidelines/share/${shareId}`
    } catch (error) {
      console.error('Error generating shareable link:', error)
      throw error
    }
  },

  // Analyze guidelines with AI
  async analyzeGuidelines(brandData: any, guidelines: any): Promise<any> {
    try {
      const context = {
        brandData,
        guidelines,
        analysisType: 'comprehensive'
      }

      const response = await generateStrategySuggestions('guidelines_analysis', context)
      
      return {
        score: Math.floor(Math.random() * 20) + 80, // Mock score 80-100
        strengths: [
          'Consistent visual identity',
          'Clear brand messaging',
          'Comprehensive color palette',
          'Well-defined typography'
        ],
        opportunities: [
          'Add accessibility guidelines',
          'Include more usage examples',
          'Expand digital guidelines',
          'Add competitive differentiation'
        ],
        recommendations: response.suggestions
      }
    } catch (error) {
      console.error('Error analyzing guidelines:', error)
      throw error
    }
  },

  // Enhance guidelines with AI
  async enhanceGuidelines(brandData: any, guidelines: any, enhancements: string[]): Promise<any> {
    try {
      const enhancedGuidelines = { ...guidelines }

      for (const enhancement of enhancements) {
        switch (enhancement) {
          case 'accessibility':
            enhancedGuidelines.accessibility = await this.generateAccessibilitySection(brandData)
            break
          case 'applications':
            enhancedGuidelines.applications = await this.generateApplicationExamples(brandData)
            break
          case 'competitive':
            enhancedGuidelines.competitive = await this.generateCompetitiveSection(brandData)
            break
          case 'digital':
            enhancedGuidelines.digital = await this.generateDigitalSection(brandData)
            break
        }
      }

      return enhancedGuidelines
    } catch (error) {
      console.error('Error enhancing guidelines:', error)
      throw error
    }
  },

  // Helper methods for generating specific sections
  generateLogoVariations(logo: any): any[] {
    if (!logo) return []
    
    return [
      { type: 'horizontal', description: 'Primary horizontal layout' },
      { type: 'vertical', description: 'Vertical stacked layout' },
      { type: 'icon', description: 'Icon-only version' },
      { type: 'monochrome', description: 'Single color version' },
      { type: 'reverse', description: 'Reverse/knockout version' }
    ]
  },

  generateClearSpaceGuidelines(): any {
    return {
      minimum: '2x logo height',
      recommended: '3x logo height',
      description: 'Maintain adequate clear space around the logo to ensure visual impact and legibility'
    }
  },

  generateSizeGuidelines(): any {
    return {
      print: {
        minimum: '15mm width',
        recommended: '25mm width'
      },
      digital: {
        minimum: '120px width',
        recommended: '200px width'
      }
    }
  },

  generateIncorrectUsageExamples(): string[] {
    return [
      'Do not stretch or distort the logo',
      'Do not change the logo colors',
      'Do not add effects or shadows',
      'Do not place on busy backgrounds',
      'Do not use outdated versions'
    ]
  },

  generateColorUsageGuidelines(colors: any): any {
    if (!colors) return {}
    
    return {
      primary: 'Use for main brand elements and calls-to-action',
      secondary: 'Use for supporting elements and backgrounds',
      accent: 'Use sparingly for highlights and emphasis',
      neutral: 'Use for text and subtle backgrounds'
    }
  },

  generateAccessibilityGuidelines(colors: any): any {
    return {
      contrast: 'Ensure minimum 4.5:1 contrast ratio for normal text',
      colorBlind: 'Test designs with color blindness simulators',
      alternatives: 'Provide non-color indicators for important information'
    }
  },

  generateColorCombinations(colors: any): any[] {
    if (!colors?.colors) return []
    
    return [
      { primary: colors.colors[0], secondary: colors.colors[1], usage: 'High contrast pairing' },
      { primary: colors.colors[0], secondary: colors.colors[2], usage: 'Vibrant combination' },
      { primary: colors.colors[1], secondary: colors.colors[3], usage: 'Subtle pairing' }
    ]
  },

  generateTypographyHierarchy(typography: any): any {
    if (!typography) return {}
    
    return {
      h1: { size: '48px', weight: '700', usage: 'Main headlines' },
      h2: { size: '36px', weight: '600', usage: 'Section headers' },
      h3: { size: '24px', weight: '600', usage: 'Subsection headers' },
      h4: { size: '20px', weight: '500', usage: 'Minor headers' },
      body: { size: '16px', weight: '400', usage: 'Body text' },
      caption: { size: '14px', weight: '400', usage: 'Captions and notes' }
    }
  },

  generateTypographyUsage(typography: any): any {
    return {
      headings: 'Use heading font for all titles and headers',
      body: 'Use body font for all paragraph text and content',
      lineHeight: 'Maintain 1.5x line height for optimal readability',
      letterSpacing: 'Use default letter spacing unless specified'
    }
  },

  generateWebFontGuidelines(typography: any): any {
    if (!typography) return {}
    
    return {
      googleFonts: typography.heading?.googleFont || '',
      fallbacks: `${typography.heading?.family}, ${typography.heading?.fallback}`,
      loading: 'Use font-display: swap for better performance'
    }
  },

  generateVoiceExamples(voice: any): any[] {
    return [
      {
        context: 'Social Media Post',
        example: 'Exciting news! We\'re launching something amazing next week. Stay tuned! 🚀'
      },
      {
        context: 'Email Subject Line',
        example: 'Your weekly dose of inspiration is here'
      },
      {
        context: 'Website Copy',
        example: 'We believe in making complex things simple and beautiful things functional.'
      }
    ]
  },

  generateDosGuidelines(brandData: any): string[] {
    return [
      'Use the logo with adequate clear space',
      'Maintain consistent color usage across all materials',
      'Follow the established typography hierarchy',
      'Keep messaging aligned with brand voice',
      'Ensure accessibility standards are met',
      'Use high-resolution assets for print materials'
    ]
  },

  generateDontsGuidelines(brandData: any): string[] {
    return [
      'Don\'t stretch or distort the logo',
      'Don\'t use unauthorized color variations',
      'Don\'t mix fonts from different brand systems',
      'Don\'t deviate from established brand voice',
      'Don\'t use low-resolution or pixelated assets',
      'Don\'t place logo on busy or conflicting backgrounds'
    ]
  },

  generateApplicationExamples(brandData: any): any[] {
    return [
      {
        type: 'Business Card',
        description: 'Professional business card design with proper logo placement and typography',
        specifications: '3.5" x 2" (89mm x 51mm)'
      },
      {
        type: 'Website Header',
        description: 'Website navigation with logo, menu items, and call-to-action button',
        specifications: 'Responsive design, mobile-first approach'
      },
      {
        type: 'Social Media Profile',
        description: 'Consistent branding across social media platforms',
        specifications: 'Platform-specific dimensions and guidelines'
      }
    ]
  },

  generatePrintGuidelines(brandData: any): any {
    return {
      resolution: 'Use 300 DPI minimum for all print materials',
      colorMode: 'Use CMYK color mode for print production',
      bleed: 'Include 3mm bleed for materials that extend to page edge',
      fonts: 'Embed or outline fonts in final print files'
    }
  },

  generateDigitalGuidelines(brandData: any): any {
    return {
      resolution: 'Use 72 DPI for web and digital displays',
      colorMode: 'Use RGB color mode for digital applications',
      formats: 'Use SVG for logos, PNG for images with transparency',
      responsive: 'Ensure all elements scale appropriately across devices'
    }
  },

  generateSocialMediaGuidelines(brandData: any): any {
    return {
      profileImage: '400x400px minimum, square format',
      coverImage: 'Platform-specific dimensions (Facebook: 820x312px)',
      posts: 'Maintain consistent visual style and brand voice',
      hashtags: 'Use brand-relevant hashtags consistently'
    }
  },

  // Export methods
  async exportToPDF(brandData: any, guidelines: any): Promise<void> {
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // Add title page
      pdf.setFontSize(24)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${brandData.brand.name}`, 20, 30)
      pdf.setFontSize(18)
      pdf.text('Brand Guidelines', 20, 40)
      pdf.setFontSize(12)
      pdf.text(`Version ${guidelines.metadata.version}`, 20, 50)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55)
      
      // Add brand overview
      pdf.addPage()
      pdf.setFontSize(18)
      pdf.text('Brand Overview', 20, 20)
      
      pdf.setFontSize(14)
      pdf.text('Mission', 20, 30)
      pdf.setFontSize(12)
      pdf.text(guidelines.brandOverview.mission || 'Not defined', 20, 35, { maxWidth: 170 })
      
      pdf.setFontSize(14)
      pdf.text('Vision', 20, 50)
      pdf.setFontSize(12)
      pdf.text(guidelines.brandOverview.vision || 'Not defined', 20, 55, { maxWidth: 170 })
      
      pdf.setFontSize(14)
      pdf.text('Core Values', 20, 70)
      pdf.setFontSize(12)
      const values = guidelines.brandOverview.values || []
      values.forEach((value: string, index: number) => {
        pdf.text(`• ${value}`, 20, 75 + (index * 5))
      })
      
      // Add visual identity
      pdf.addPage()
      pdf.setFontSize(18)
      pdf.text('Visual Identity', 20, 20)
      
      // Add more sections as needed
      
      // Save the PDF
      pdf.save(`${brandData.brand.name}-brand-guidelines.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  },

  async exportToWeb(brandData: any, guidelines: any): Promise<void> {
    // Generate HTML version
    const html = this.generateHTMLContent(brandData, guidelines)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  },

  async exportToPresentation(brandData: any, guidelines: any): Promise<void> {
    // Generate presentation content
    console.log('Exporting to presentation format...')
    
    // Create a simple HTML presentation
    const html = this.generatePresentationHTML(brandData, guidelines)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  },

  async exportAssets(brandData: any, guidelines: any): Promise<void> {
    // Package all brand assets
    try {
      // Create a zip-like structure (in a real implementation, this would use JSZip)
      const assets = {
        logo: brandData.visual?.logo,
        colors: brandData.visual?.colors,
        typography: brandData.visual?.typography,
        guidelines: guidelines
      }
      
      // For now, just download as JSON
      const blob = new Blob([JSON.stringify(assets, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandData.brand.name}-brand-assets.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting assets:', error)
      throw error
    }
  },

  generateHTMLContent(brandData: any, guidelines: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${brandData.brand.name} - Brand Guidelines</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.6;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            header {
              text-align: center;
              margin-bottom: 60px;
            }
            h1 { 
              color: ${brandData.visual?.colors?.colors?.[0] || '#333'}; 
              font-size: 36px;
              margin-bottom: 10px;
            }
            h2 {
              font-size: 24px;
              margin-top: 40px;
              margin-bottom: 20px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            h3 {
              font-size: 20px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .section {
              margin-bottom: 60px;
            }
            .color-swatch {
              display: inline-block;
              width: 100px;
              height: 100px;
              margin-right: 20px;
              margin-bottom: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .color-info {
              margin-top: 5px;
              font-size: 14px;
              text-align: center;
            }
            .typography-sample {
              margin-bottom: 30px;
            }
            .font-heading {
              font-family: ${brandData.visual?.typography?.heading?.family || 'Arial'}, sans-serif;
            }
            .font-body {
              font-family: ${brandData.visual?.typography?.body?.family || 'Arial'}, sans-serif;
            }
            .values-list {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-bottom: 20px;
            }
            .value-tag {
              background-color: #f0f0f0;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 14px;
            }
            .dos-donts {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-top: 20px;
            }
            .dos, .donts {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
            }
            .dos h4 {
              color: #4CAF50;
            }
            .donts h4 {
              color: #F44336;
            }
            footer {
              text-align: center;
              margin-top: 80px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>${brandData.brand.name} Brand Guidelines</h1>
              <p>Version ${guidelines.metadata.version} | Generated on ${new Date().toLocaleDateString()}</p>
            </header>
            
            <div class="section">
              <h2>Brand Overview</h2>
              
              <h3>Mission</h3>
              <p>${guidelines.brandOverview.mission || 'Not defined'}</p>
              
              <h3>Vision</h3>
              <p>${guidelines.brandOverview.vision || 'Not defined'}</p>
              
              <h3>Core Values</h3>
              <div class="values-list">
                ${(guidelines.brandOverview.values || []).map((value: string) => 
                  `<span class="value-tag">${value}</span>`
                ).join('')}
              </div>
              
              <h3>Positioning</h3>
              <p>${guidelines.brandOverview.positioning || 'Not defined'}</p>
            </div>
            
            <div class="section">
              <h2>Visual Identity</h2>
              
              <h3>Color Palette</h3>
              <div>
                ${(brandData.visual?.colors?.colors || []).map((color: string, index: number) => `
                  <div>
                    <div class="color-swatch" style="background-color: ${color}"></div>
                    <div class="color-info">${color}</div>
                  </div>
                `).join('')}
              </div>
              
              <h3>Typography</h3>
              <div class="typography-sample">
                <h4>Heading Font: ${brandData.visual?.typography?.heading?.family || 'Not defined'}</h4>
                <div class="font-heading" style="font-size: 24px; font-weight: bold;">
                  This is a heading example
                </div>
                <div class="font-heading" style="font-size: 18px; font-weight: bold;">
                  This is a subheading example
                </div>
                
                <h4>Body Font: ${brandData.visual?.typography?.body?.family || 'Not defined'}</h4>
                <div class="font-body" style="font-size: 16px;">
                  This is an example of body text. This is where most of your content will appear.
                  It should be highly readable and work well at different sizes.
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2>Brand Voice</h2>
              
              <h3>Tone of Voice</h3>
              <p>Our brand voice is ${this.getToneDescription(guidelines.brandVoice?.toneScales)}</p>
              
              <h3>Key Messages</h3>
              <ul>
                ${(guidelines.brandVoice?.messaging?.keyMessages || []).map((message: string) => 
                  `<li>${message}</li>`
                ).join('')}
              </ul>
              
              <h3>Guidelines</h3>
              <div class="dos-donts">
                <div class="dos">
                  <h4>Do's</h4>
                  <ul>
                    ${(guidelines.brandVoice?.guidelines?.dosList || []).map((item: string) => 
                      `<li>${item}</li>`
                    ).join('')}
                  </ul>
                </div>
                <div class="donts">
                  <h4>Don'ts</h4>
                  <ul>
                    ${(guidelines.brandVoice?.guidelines?.dontsList || []).map((item: string) => 
                      `<li>${item}</li>`
                    ).join('')}
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2>Usage Guidelines</h2>
              
              <div class="dos-donts">
                <div class="dos">
                  <h4>Do's</h4>
                  <ul>
                    ${(guidelines.usageGuidelines?.dos || []).map((item: string) => 
                      `<li>${item}</li>`
                    ).join('')}
                  </ul>
                </div>
                <div class="donts">
                  <h4>Don'ts</h4>
                  <ul>
                    ${(guidelines.usageGuidelines?.donts || []).map((item: string) => 
                      `<li>${item}</li>`
                    ).join('')}
                  </ul>
                </div>
              </div>
            </div>
            
            <footer>
              <p>© ${new Date().getFullYear()} ${brandData.brand.name}. All rights reserved.</p>
              <p>Generated with Brandie - Build every brand overnight</p>
            </footer>
          </div>
        </body>
      </html>
    `
  },

  generatePresentationHTML(brandData: any, guidelines: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${brandData.brand.name} - Brand Guidelines Presentation</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .slide {
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              padding: 40px;
              box-sizing: border-box;
            }
            .slide-content {
              max-width: 800px;
            }
            h1 {
              font-size: 48px;
              margin-bottom: 20px;
              color: ${brandData.visual?.colors?.colors?.[0] || '#333'};
            }
            h2 {
              font-size: 36px;
              margin-bottom: 30px;
            }
            p {
              font-size: 24px;
              line-height: 1.5;
            }
            .color-swatches {
              display: flex;
              justify-content: center;
              gap: 20px;
              margin: 30px 0;
            }
            .color-swatch {
              width: 100px;
              height: 100px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .values {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 15px;
              margin: 30px 0;
            }
            .value {
              background-color: #f0f0f0;
              padding: 10px 20px;
              border-radius: 30px;
              font-size: 20px;
            }
            .navigation {
              position: fixed;
              bottom: 20px;
              right: 20px;
              display: flex;
              gap: 10px;
            }
            .nav-button {
              background-color: #333;
              color: white;
              border: none;
              padding: 10px 15px;
              border-radius: 5px;
              cursor: pointer;
            }
            .slide-number {
              position: fixed;
              bottom: 20px;
              left: 20px;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="slide" id="slide1">
            <div class="slide-content">
              <h1>${brandData.brand.name}</h1>
              <h2>Brand Guidelines</h2>
              <p>Version ${guidelines.metadata.version}</p>
            </div>
            <div class="slide-number">1</div>
          </div>
          
          <div class="slide" id="slide2" style="display: none;">
            <div class="slide-content">
              <h2>Brand Overview</h2>
              <p><strong>Mission:</strong> ${guidelines.brandOverview.mission || 'Not defined'}</p>
              <p><strong>Vision:</strong> ${guidelines.brandOverview.vision || 'Not defined'}</p>
            </div>
            <div class="slide-number">2</div>
          </div>
          
          <div class="slide" id="slide3" style="display: none;">
            <div class="slide-content">
              <h2>Core Values</h2>
              <div class="values">
                ${(guidelines.brandOverview.values || []).map((value: string) => 
                  `<span class="value">${value}</span>`
                ).join('')}
              </div>
            </div>
            <div class="slide-number">3</div>
          </div>
          
          <div class="slide" id="slide4" style="display: none;">
            <div class="slide-content">
              <h2>Color Palette</h2>
              <div class="color-swatches">
                ${(brandData.visual?.colors?.colors || []).map((color: string) => 
                  `<div class="color-swatch" style="background-color: ${color}"></div>`
                ).join('')}
              </div>
            </div>
            <div class="slide-number">4</div>
          </div>
          
          <div class="slide" id="slide5" style="display: none;">
            <div class="slide-content">
              <h2>Typography</h2>
              <p style="font-family: ${brandData.visual?.typography?.heading?.family || 'Arial'}, sans-serif; font-size: 36px; font-weight: bold;">
                Heading Font: ${brandData.visual?.typography?.heading?.family || 'Not defined'}
              </p>
              <p style="font-family: ${brandData.visual?.typography?.body?.family || 'Arial'}, sans-serif; font-size: 24px;">
                Body Font: ${brandData.visual?.typography?.body?.family || 'Not defined'}
              </p>
            </div>
            <div class="slide-number">5</div>
          </div>
          
          <div class="navigation">
            <button class="nav-button" id="prev">Previous</button>
            <button class="nav-button" id="next">Next</button>
          </div>
          
          <script>
            let currentSlide = 1;
            const totalSlides = 5;
            
            function showSlide(slideNumber) {
              // Hide all slides
              for (let i = 1; i <= totalSlides; i++) {
                document.getElementById('slide' + i).style.display = 'none';
              }
              
              // Show the current slide
              document.getElementById('slide' + slideNumber).style.display = 'flex';
            }
            
            document.getElementById('next').addEventListener('click', () => {
              if (currentSlide < totalSlides) {
                currentSlide++;
                showSlide(currentSlide);
              }
            });
            
            document.getElementById('prev').addEventListener('click', () => {
              if (currentSlide > 1) {
                currentSlide--;
                showSlide(currentSlide);
              }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
                currentSlide++;
                showSlide(currentSlide);
              } else if (e.key === 'ArrowLeft' && currentSlide > 1) {
                currentSlide--;
                showSlide(currentSlide);
              }
            });
          </script>
        </body>
      </html>
    `
  },

  getToneDescription(scales: any): string {
    if (!scales) return 'balanced'
    
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

    return descriptions.join(', ')
  },

  async generateAccessibilitySection(brandData: any): Promise<any> {
    return {
      colorContrast: 'All color combinations meet WCAG AA standards',
      typography: 'Font sizes meet minimum readability requirements',
      navigation: 'All interactive elements are keyboard accessible'
    }
  },

  async generateCompetitiveSection(brandData: any): Promise<any> {
    return {
      differentiation: 'Key visual and messaging differentiators from competitors',
      positioning: 'Unique market position and value proposition',
      guidelines: 'Specific guidelines to maintain competitive advantage'
    }
  },

  async generateDigitalSection(brandData: any): Promise<any> {
    return {
      responsive: 'Guidelines for responsive design implementation',
      platforms: 'Platform-specific guidelines for web, mobile, and apps',
      performance: 'Optimization guidelines for digital performance'
    }
  }
}