export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'jpg'
  size?: { width: number; height: number }
  quality?: number
  transparent?: boolean
}

export interface BrandKitOptions {
  includeLogo: boolean
  includeColors: boolean
  includeTypography: boolean
  includeGuidelines: boolean
  formats: string[]
}

export const assetExportService = {
  // Logo export in multiple formats
  async exportLogo(logoData: any, options: ExportOptions): Promise<Blob> {
    const { format, size, quality = 1, transparent = true } = options
    
    if (format === 'svg' && logoData.svg) {
      return new Blob([logoData.svg], { type: 'image/svg+xml' })
    }
    
    // For raster formats, we need to convert SVG to canvas
    if (logoData.svg || logoData.url) {
      return this.convertToRasterFormat(logoData, options)
    }
    
    throw new Error('No logo data available for export')
  },

  async convertToRasterFormat(logoData: any, options: ExportOptions): Promise<Blob> {
    const { format, size = { width: 512, height: 512 }, quality, transparent } = options
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }
      
      canvas.width = size.width
      canvas.height = size.height
      
      if (!transparent && format !== 'png') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      if (logoData.svg) {
        // Convert SVG to image
        const img = new Image()
        const svgBlob = new Blob([logoData.svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(svgBlob)
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          URL.revokeObjectURL(url)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert to blob'))
            }
          }, `image/${format}`, quality)
        }
        
        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to load SVG'))
        }
        
        img.src = url
      } else if (logoData.url) {
        // Load existing image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert to blob'))
            }
          }, `image/${format}`, quality)
        }
        
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = logoData.url
      }
    })
  },

  // Color palette export for different tools
  exportColorPalette(colors: any, format: 'css' | 'scss' | 'json' | 'sketch' | 'adobe-ase' | 'adobe-aco'): string | Blob {
    const colorArray = colors.colors || []
    
    switch (format) {
      case 'css':
        return `:root {
${colorArray.map((color: string, index: number) => `  --color-${index + 1}: ${color};`).join('\n')}
}`

      case 'scss':
        return colorArray.map((color: string, index: number) => `$color-${index + 1}: ${color};`).join('\n')

      case 'json':
        return JSON.stringify({
          name: colors.name || 'Brand Colors',
          colors: colorArray.map((color: string, index: number) => ({
            name: `Color ${index + 1}`,
            hex: color,
            rgb: this.hexToRgb(color),
            hsl: this.hexToHsl(color)
          }))
        }, null, 2)

      case 'sketch':
        // Sketch palette format
        const sketchPalette = {
          compatibleVersion: "2.0",
          pluginVersion: "2.22",
          colors: colorArray.map((color: string, index: number) => ({
            name: `Color ${index + 1}`,
            red: parseInt(color.slice(1, 3), 16) / 255,
            green: parseInt(color.slice(3, 5), 16) / 255,
            blue: parseInt(color.slice(5, 7), 16) / 255,
            alpha: 1
          }))
        }
        return JSON.stringify(sketchPalette, null, 2)

      case 'adobe-ase':
        // Adobe Swatch Exchange format (simplified)
        return this.generateASEFile(colorArray)

      case 'adobe-aco':
        // Adobe Color format (simplified)
        return this.generateACOFile(colorArray)

      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  },

  // Generate comprehensive brand kit
  async generateBrandKit(brandData: any, options: BrandKitOptions): Promise<Blob> {
    const zip = await this.createZipFile()
    
    if (options.includeLogo && brandData.visual?.logo) {
      await this.addLogoToZip(zip, brandData.visual.logo, options.formats)
    }
    
    if (options.includeColors && brandData.visual?.colors) {
      await this.addColorsToZip(zip, brandData.visual.colors)
    }
    
    if (options.includeTypography && brandData.visual?.typography) {
      await this.addTypographyToZip(zip, brandData.visual.typography)
    }
    
    if (options.includeGuidelines && brandData.guidelines) {
      await this.addGuidelinesToZip(zip, brandData)
    }
    
    return zip.generateAsync({ type: 'blob' })
  },

  // Asset versioning
  createAssetVersion(assetData: any, versionNumber: number): any {
    return {
      ...assetData,
      version: versionNumber,
      versionHistory: [
        ...(assetData.versionHistory || []),
        {
          version: versionNumber,
          timestamp: new Date().toISOString(),
          changes: 'Asset updated'
        }
      ]
    }
  },

  // Helper methods
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  },

  hexToHsl(hex: string): { h: number; s: number; l: number } {
    const { r, g, b } = this.hexToRgb(hex)
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255
    
    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break
        case gNorm: h = (bNorm - rNorm) / d + 2; break
        case bNorm: h = (rNorm - gNorm) / d + 4; break
      }
      h /= 6
    }
    
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  },

  async createZipFile(): Promise<any> {
    // In a real implementation, this would use JSZip
    // For now, we'll simulate the structure
    return {
      file: (name: string, content: string | Blob) => {
        console.log(`Adding file to zip: ${name}`)
      },
      folder: (name: string) => {
        console.log(`Creating folder: ${name}`)
        return {
          file: (name: string, content: string | Blob) => {
            console.log(`Adding file to folder: ${name}`)
          }
        }
      },
      generateAsync: (options: any) => {
        // Return a mock blob for now
        return Promise.resolve(new Blob(['Mock brand kit'], { type: 'application/zip' }))
      }
    }
  },

  async addLogoToZip(zip: any, logoData: any, formats: string[]): Promise<void> {
    const logoFolder = zip.folder('logos')
    
    for (const format of formats) {
      if (format === 'svg' && logoData.svg) {
        logoFolder.file(`logo.${format}`, logoData.svg)
      } else if (['png', 'jpg', 'pdf'].includes(format)) {
        try {
          const blob = await this.exportLogo(logoData, { 
            format: format as any,
            size: { width: 512, height: 512 }
          })
          logoFolder.file(`logo.${format}`, blob)
        } catch (error) {
          console.error(`Failed to export logo as ${format}:`, error)
        }
      }
    }
  },

  async addColorsToZip(zip: any, colorsData: any): Promise<void> {
    const colorsFolder = zip.folder('colors')
    
    const formats = ['css', 'scss', 'json', 'sketch', 'adobe-ase']
    
    for (const format of formats) {
      try {
        const content = this.exportColorPalette(colorsData, format as any)
        const extension = format === 'adobe-ase' ? 'ase' : format === 'sketch' ? 'sketchpalette' : format
        colorsFolder.file(`colors.${extension}`, content)
      } catch (error) {
        console.error(`Failed to export colors as ${format}:`, error)
      }
    }
  },

  async addTypographyToZip(zip: any, typographyData: any): Promise<void> {
    const typographyFolder = zip.folder('typography')
    
    // CSS file
    const cssContent = `/* Typography Styles */
.heading {
  font-family: '${typographyData.heading?.family}', ${typographyData.heading?.fallback || 'sans-serif'};
  font-weight: 700;
  line-height: 1.2;
}

.body {
  font-family: '${typographyData.body?.family}', ${typographyData.body?.fallback || 'sans-serif'};
  font-weight: 400;
  line-height: 1.6;
}`

    typographyFolder.file('typography.css', cssContent)
    
    // Google Fonts import
    if (typographyData.heading?.googleFont || typographyData.body?.googleFont) {
      const googleFontsImport = `@import url('https://fonts.googleapis.com/css2?family=${typographyData.heading?.googleFont}&family=${typographyData.body?.googleFont}&display=swap');`
      typographyFolder.file('google-fonts.css', googleFontsImport)
    }
    
    // Typography guide
    const typographyGuide = `# Typography Guide

## Heading Font
- Family: ${typographyData.heading?.family}
- Weights: ${typographyData.heading?.weights?.join(', ') || 'Regular, Bold'}
- Fallback: ${typographyData.heading?.fallback || 'sans-serif'}

## Body Font
- Family: ${typographyData.body?.family}
- Weights: ${typographyData.body?.weights?.join(', ') || 'Regular'}
- Fallback: ${typographyData.body?.fallback || 'sans-serif'}

## Usage Guidelines
- Use heading font for all titles and headers
- Use body font for all paragraph text and content
- Maintain consistent line heights and spacing
`
    
    typographyFolder.file('typography-guide.md', typographyGuide)
  },

  async addGuidelinesToZip(zip: any, brandData: any): Promise<void> {
    const guidelinesFolder = zip.folder('guidelines')
    
    // Brand overview
    const brandOverview = `# ${brandData.brand?.name} Brand Guidelines

## Mission
${brandData.guidelines?.brandOverview?.mission || 'Not defined'}

## Vision
${brandData.guidelines?.brandOverview?.vision || 'Not defined'}

## Core Values
${brandData.guidelines?.brandOverview?.values?.map((value: string) => `- ${value}`).join('\n') || 'Not defined'}

## Brand Voice
${brandData.guidelines?.brandVoice?.messaging?.tagline || 'Not defined'}
`
    
    guidelinesFolder.file('brand-overview.md', brandOverview)
    
    // Usage guidelines
    const usageGuidelines = `# Usage Guidelines

## Do's
${brandData.guidelines?.usageGuidelines?.dos?.map((item: string) => `- ${item}`).join('\n') || 'Not defined'}

## Don'ts
${brandData.guidelines?.usageGuidelines?.donts?.map((item: string) => `- ${item}`).join('\n') || 'Not defined'}
`
    
    guidelinesFolder.file('usage-guidelines.md', usageGuidelines)
  },

  generateASEFile(colors: string[]): string {
    // Simplified ASE format representation
    return `Adobe Swatch Exchange File
Version: 1.0
Colors: ${colors.length}

${colors.map((color, index) => `Color ${index + 1}: ${color}`).join('\n')}`
  },

  generateACOFile(colors: string[]): string {
    // Simplified ACO format representation
    return `Adobe Color File
Version: 2.0
Colors: ${colors.length}

${colors.map((color, index) => {
      const { r, g, b } = this.hexToRgb(color)
      return `Color ${index + 1}: RGB(${r}, ${g}, ${b})`
    }).join('\n')}`
  }
}