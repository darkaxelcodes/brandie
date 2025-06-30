import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Package, FileImage, Palette, Type, FileText, Settings, Check, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { assetExportService } from '../../lib/assetExportService'

interface AssetExportManagerProps {
  brandData: any
  guidelines: any
}

export const AssetExportManager: React.FC<AssetExportManagerProps> = ({
  brandData,
  guidelines
}) => {
  const [exportOptions, setExportOptions] = useState({
    logo: {
      formats: ['svg', 'png'],
      sizes: [
        { name: 'Small', width: 256, height: 256 },
        { name: 'Medium', width: 512, height: 512 },
        { name: 'Large', width: 1024, height: 1024 }
      ],
      selectedSizes: ['Medium']
    },
    colors: {
      formats: ['css', 'scss', 'json', 'sketch'],
      selectedFormats: ['css', 'json']
    },
    typography: {
      formats: ['css', 'scss', 'google-fonts'],
      selectedFormats: ['css', 'google-fonts']
    },
    brandKit: {
      includeLogo: true,
      includeColors: true,
      includeTypography: true,
      includeGuidelines: true
    }
  })
  
  const [exporting, setExporting] = useState<string | null>(null)
  const [exportStatus, setExportStatus] = useState<{ [key: string]: 'success' | 'error' | null }>({})

  const exportAsset = async (assetType: 'logo' | 'colors' | 'typography' | 'brand-kit') => {
    setExporting(assetType)
    setExportStatus(prev => ({ ...prev, [assetType]: null }))
    
    try {
      switch (assetType) {
        case 'logo':
          await exportLogo()
          break
        case 'colors':
          await exportColors()
          break
        case 'typography':
          await exportTypography()
          break
        case 'brand-kit':
          await exportBrandKit()
          break
      }
      
      setExportStatus(prev => ({ ...prev, [assetType]: 'success' }))
    } catch (error) {
      console.error(`Export error for ${assetType}:`, error)
      setExportStatus(prev => ({ ...prev, [assetType]: 'error' }))
    } finally {
      setExporting(null)
    }
  }

  const exportLogo = async () => {
    if (!brandData.visual?.logo) {
      throw new Error('No logo data available')
    }

    const { formats, sizes, selectedSizes } = exportOptions.logo
    
    for (const format of formats) {
      for (const sizeName of selectedSizes) {
        const sizeConfig = sizes.find(s => s.name === sizeName)
        if (!sizeConfig) continue
        
        try {
          const blob = await assetExportService.exportLogo(brandData.visual.logo, {
            format: format as any,
            size: { width: sizeConfig.width, height: sizeConfig.height },
            transparent: true
          })
          
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${brandData.brand?.name}-logo-${sizeName.toLowerCase()}.${format}`
          a.click()
          URL.revokeObjectURL(url)
        } catch (error) {
          console.error(`Failed to export logo as ${format}:`, error)
        }
      }
    }
  }

  const exportColors = async () => {
    if (!brandData.visual?.colors) {
      throw new Error('No color data available')
    }

    const { selectedFormats } = exportOptions.colors
    
    for (const format of selectedFormats) {
      try {
        const content = assetExportService.exportColorPalette(brandData.visual.colors, format as any)
        
        const blob = new Blob([content], { 
          type: format === 'json' ? 'application/json' : 'text/plain' 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${brandData.brand?.name}-colors.${format === 'sketch' ? 'sketchpalette' : format}`
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error(`Failed to export colors as ${format}:`, error)
      }
    }
  }

  const exportTypography = async () => {
    if (!brandData.visual?.typography) {
      throw new Error('No typography data available')
    }

    const { selectedFormats } = exportOptions.typography
    
    for (const format of selectedFormats) {
      try {
        let content = ''
        let filename = ''
        
        switch (format) {
          case 'css':
            content = `/* Typography Styles */
.heading {
  font-family: '${brandData.visual.typography.heading?.family}', ${brandData.visual.typography.heading?.fallback || 'sans-serif'};
  font-weight: 700;
  line-height: 1.2;
}

.body {
  font-family: '${brandData.visual.typography.body?.family}', ${brandData.visual.typography.body?.fallback || 'sans-serif'};
  font-weight: 400;
  line-height: 1.6;
}`
            filename = `${brandData.brand?.name}-typography.css`
            break
            
          case 'scss':
            content = `// Typography Variables
$font-heading: '${brandData.visual.typography.heading?.family}', ${brandData.visual.typography.heading?.fallback || 'sans-serif'};
$font-body: '${brandData.visual.typography.body?.family}', ${brandData.visual.typography.body?.fallback || 'sans-serif'};

// Typography Mixins
@mixin heading-font {
  font-family: $font-heading;
  font-weight: 700;
  line-height: 1.2;
}

@mixin body-font {
  font-family: $font-body;
  font-weight: 400;
  line-height: 1.6;
}`
            filename = `${brandData.brand?.name}-typography.scss`
            break
            
          case 'google-fonts':
            const headingFont = brandData.visual.typography.heading?.googleFont
            const bodyFont = brandData.visual.typography.body?.googleFont
            content = `@import url('https://fonts.googleapis.com/css2?family=${headingFont}&family=${bodyFont}&display=swap');`
            filename = `${brandData.brand?.name}-google-fonts.css`
            break
        }
        
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error(`Failed to export typography as ${format}:`, error)
      }
    }
  }

  const exportBrandKit = async () => {
    try {
      const blob = await assetExportService.generateBrandKit(brandData, {
        includeLogo: exportOptions.brandKit.includeLogo,
        includeColors: exportOptions.brandKit.includeColors,
        includeTypography: exportOptions.brandKit.includeTypography,
        includeGuidelines: exportOptions.brandKit.includeGuidelines,
        formats: ['svg', 'png', 'css', 'json']
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brandData.brand?.name}-brand-kit.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export brand kit:', error)
      throw error
    }
  }

  const updateExportOption = (category: string, field: string, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const getStatusIcon = (status: 'success' | 'error' | null) => {
    if (status === 'success') return <Check className="w-4 h-4 text-green-600" />
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-600" />
    return null
  }

  return (
    <div className="space-y-6">
      {/* Brand Kit Export */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Complete Brand Kit</h3>
              <p className="text-gray-600">Download everything in one organized package</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusIcon(exportStatus['brand-kit'])}
            <Button
              onClick={() => exportAsset('brand-kit')}
              loading={exporting === 'brand-kit'}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Package className="w-4 h-4 mr-2" />
              Download Brand Kit
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { key: 'includeLogo', label: 'Logo Files', icon: FileImage },
            { key: 'includeColors', label: 'Color Palettes', icon: Palette },
            { key: 'includeTypography', label: 'Typography', icon: Type },
            { key: 'includeGuidelines', label: 'Guidelines', icon: FileText }
          ].map((item) => (
            <label key={item.key} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
              <input
                type="checkbox"
                checked={exportOptions.brandKit[item.key as keyof typeof exportOptions.brandKit]}
                onChange={(e) => updateExportOption('brandKit', item.key, e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <item.icon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Individual Asset Exports */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Logo Export */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileImage className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Logo Export</h3>
            </div>
            {getStatusIcon(exportStatus.logo)}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formats</label>
              <div className="space-y-2">
                {['svg', 'png', 'jpg', 'pdf'].map((format) => (
                  <label key={format} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.logo.formats.includes(format)}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...exportOptions.logo.formats, format]
                          : exportOptions.logo.formats.filter(f => f !== format)
                        updateExportOption('logo', 'formats', formats)
                      }}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 uppercase">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
              <div className="space-y-2">
                {exportOptions.logo.sizes.map((size) => (
                  <label key={size.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.logo.selectedSizes.includes(size.name)}
                      onChange={(e) => {
                        const sizes = e.target.checked
                          ? [...exportOptions.logo.selectedSizes, size.name]
                          : exportOptions.logo.selectedSizes.filter(s => s !== size.name)
                        updateExportOption('logo', 'selectedSizes', sizes)
                      }}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{size.name} ({size.width}×{size.height})</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={() => exportAsset('logo')}
              loading={exporting === 'logo'}
              disabled={!brandData.visual?.logo}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Logo
            </Button>
          </div>
        </Card>

        {/* Colors Export */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Colors Export</h3>
            </div>
            {getStatusIcon(exportStatus.colors)}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formats</label>
              <div className="space-y-2">
                {[
                  { id: 'css', name: 'CSS Variables' },
                  { id: 'scss', name: 'SCSS Variables' },
                  { id: 'json', name: 'JSON Data' },
                  { id: 'sketch', name: 'Sketch Palette' },
                  { id: 'adobe-ase', name: 'Adobe ASE' }
                ].map((format) => (
                  <label key={format.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.colors.selectedFormats.includes(format.id)}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...exportOptions.colors.selectedFormats, format.id]
                          : exportOptions.colors.selectedFormats.filter(f => f !== format.id)
                        updateExportOption('colors', 'selectedFormats', formats)
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{format.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={() => exportAsset('colors')}
              loading={exporting === 'colors'}
              disabled={!brandData.visual?.colors}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Colors
            </Button>
          </div>
        </Card>

        {/* Typography Export */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Type className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Typography Export</h3>
            </div>
            {getStatusIcon(exportStatus.typography)}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formats</label>
              <div className="space-y-2">
                {[
                  { id: 'css', name: 'CSS Styles' },
                  { id: 'scss', name: 'SCSS Variables' },
                  { id: 'google-fonts', name: 'Google Fonts Import' }
                ].map((format) => (
                  <label key={format.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.typography.selectedFormats.includes(format.id)}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...exportOptions.typography.selectedFormats, format.id]
                          : exportOptions.typography.selectedFormats.filter(f => f !== format.id)
                        updateExportOption('typography', 'selectedFormats', formats)
                      }}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{format.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={() => exportAsset('typography')}
              loading={exporting === 'typography'}
              disabled={!brandData.visual?.typography}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Typography
            </Button>
          </div>
        </Card>
      </div>

      {/* Asset Versioning */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-6 h-6 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Asset Versioning</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {brandData.visual?.logo && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Logo</h4>
              <p className="text-sm text-gray-600 mb-2">
                Version: {brandData.visual.logo.version || '1.0'}
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {new Date(brandData.visual.logo.updated_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {brandData.visual?.colors && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Colors</h4>
              <p className="text-sm text-gray-600 mb-2">
                Version: {brandData.visual.colors.version || '1.0'}
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {new Date(brandData.visual.colors.updated_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {brandData.visual?.typography && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Typography</h4>
              <p className="text-sm text-gray-600 mb-2">
                Version: {brandData.visual.typography.version || '1.0'}
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {new Date(brandData.visual.typography.updated_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}