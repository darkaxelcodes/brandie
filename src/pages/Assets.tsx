import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileImage, 
  Search, 
  Filter, 
  Download, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Grid,
  List,
  Folder
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { brandService } from '../lib/brandService'
import { visualService } from '../lib/visualService'
import { Brand } from '../types/brand'

export const Assets: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string | 'all'>('all')
  const [selectedType, setSelectedType] = useState<string | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const brandsData = await brandService.getUserBrands()
      setBrands(brandsData)
      
      // Load assets for all brands
      const allAssets: any[] = []
      
      for (const brand of brandsData) {
        const brandAssets = await visualService.getVisualAssets(brand.id)
        
        // Transform assets to include brand info
        const transformedAssets = brandAssets.map(asset => ({
          ...asset,
          brandName: brand.name,
          brandId: brand.id,
          assetType: asset.asset_type,
          preview: getAssetPreview(asset),
          name: getAssetName(asset, brand.name)
        }))
        
        allAssets.push(...transformedAssets)
      }
      
      setAssets(allAssets)
    } catch (error) {
      console.error('Error loading assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAssetPreview = (asset: any): string => {
    if (asset.asset_type === 'logo' && asset.asset_data?.url) {
      return asset.asset_data.url
    }
    
    if (asset.asset_type === 'logo' && asset.asset_data?.svg) {
      return `data:image/svg+xml;base64,${btoa(asset.asset_data.svg)}`
    }
    
    if (asset.asset_type === 'color_palette' && asset.asset_data?.colors) {
      // Return a placeholder for color palettes
      return ''
    }
    
    if (asset.asset_type === 'typography' && asset.asset_data?.heading) {
      // Return a placeholder for typography
      return ''
    }
    
    return 'https://via.placeholder.com/150'
  }

  const getAssetName = (asset: any, brandName: string): string => {
    if (asset.asset_type === 'logo') {
      return `${brandName} Logo`
    }
    
    if (asset.asset_type === 'color_palette') {
      return `${brandName} Color Palette`
    }
    
    if (asset.asset_type === 'typography') {
      return `${brandName} Typography`
    }
    
    return 'Unknown Asset'
  }

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'logo':
        return <ImageIcon className="w-5 h-5 text-blue-600" />
      case 'color_palette':
        return <Palette className="w-5 h-5 text-purple-600" />
      case 'typography':
        return <Type className="w-5 h-5 text-green-600" />
      default:
        return <FileImage className="w-5 h-5 text-gray-600" />
    }
  }

  const filteredAssets = assets.filter(asset => {
    // Filter by search query
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by brand
    const matchesBrand = selectedBrand === 'all' || asset.brandId === selectedBrand
    
    // Filter by type
    const matchesType = selectedType === 'all' || asset.assetType === selectedType
    
    return matchesSearch && matchesBrand && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Asset Library
        </h1>
        <p className="text-gray-600">
          Manage all your brand assets in one place
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-4">
              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="logo">Logos</option>
                <option value="color_palette">Color Palettes</option>
                <option value="typography">Typography</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Assets Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredAssets.length === 0 ? (
          <Card className="p-6 text-center">
            <FileImage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedBrand !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Create brand assets to see them here'}
            </p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center p-4 relative">
                    {asset.assetType === 'logo' && asset.preview ? (
                      <img 
                        src={asset.preview} 
                        alt={asset.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : asset.assetType === 'color_palette' && asset.asset_data?.colors ? (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {asset.asset_data.colors.map((color: string, i: number) => (
                          <div 
                            key={i}
                            className="w-10 h-10 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    ) : asset.assetType === 'typography' ? (
                      <div className="text-center">
                        <p className="text-lg font-bold" style={{ fontFamily: asset.asset_data?.heading?.family || 'sans-serif' }}>
                          Aa
                        </p>
                        <p className="text-sm" style={{ fontFamily: asset.asset_data?.body?.family || 'sans-serif' }}>
                          Aa
                        </p>
                      </div>
                    ) : (
                      <FileImage className="w-12 h-12 text-gray-300" />
                    )}
                    
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                      {getAssetIcon(asset.assetType)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{asset.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{asset.brandName}</p>
                    
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + (index * 0.02) }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      {getAssetIcon(asset.assetType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{asset.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Folder className="w-4 h-4 mr-1" />
                        <span>{asset.brandName}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}