import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, Palette, MessageSquare, FileText, Plus, TrendingUp, Sparkles, CheckCircle,
  Star, StarOff, MoreHorizontal, Archive, Trash2, Copy, Edit, RefreshCw, Factory, Activity,
  HelpCircle, Globe
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ProgressBar } from '../components/ui/ProgressBar'
import { brandService } from '../lib/brandService'
import { industries } from '../lib/industryService'
import { IndustrySelector } from '../components/strategy/IndustrySelector'
import { Brand } from '../types/brand'
import { useToast } from '../contexts/ToastContext'
import { useTour } from '../contexts/TourContext'
import { TourButton } from '../components/ui/TourButton'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { showTour, hasCompletedTour } = useTour()
  const [brands, setBrands] = useState<Brand[]>([])
  const [archivedBrands, setArchivedBrands] = useState<Brand[]>([])
  const [brandProgress, setBrandProgress] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showArchivedBrands, setShowArchivedBrands] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandIndustry, setNewBrandIndustry] = useState<string>('technology')
  const [editBrandName, setEditBrandName] = useState('')
  const [editBrandIndustry, setEditBrandIndustry] = useState<string>('technology')
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadBrands()
  }, [])

  // Show tour automatically for first-time users
  useEffect(() => {
    if (!loading && brands.length > 0 && !hasCompletedTour('dashboard')) {
      // Small delay to ensure the UI is fully rendered
      const timer = setTimeout(() => {
        showTour('dashboard')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [loading, brands, hasCompletedTour, showTour])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const [userBrands, archived] = await Promise.all([
        brandService.getUserBrands(),
        brandService.getArchivedBrands()
      ])
      
      setBrands(userBrands)
      setArchivedBrands(archived)

      // Load detailed progress for each brand
      const progressData: Record<string, any> = {}
      for (const brand of [...userBrands, ...archived]) {
        const progress = await brandService.getBrandProgress(brand.id)
        progressData[brand.id] = progress
      }
      setBrandProgress(progressData)
    } catch (error) {
      console.error('Error loading brands:', error)
      showToast('error', 'Failed to load brands')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBrand = () => {
    setNewBrandName('')
    setNewBrandIndustry('technology')
    setShowCreateModal(true)
  }

  const createNewBrand = async () => {
    if (!newBrandName.trim()) return

    try {
      setCreating(true)
      const newBrand = await brandService.createBrand(newBrandName.trim())
      
      // Update the brand with industry information
      if (newBrandIndustry) {
        await brandService.updateBrand(newBrand.id, { 
          industry: newBrandIndustry,
          industry_details: {}
        })
      }
      
      setBrands([newBrand, ...brands])
      setShowCreateModal(false)
      showToast('success', 'Brand created successfully')
      navigate(`/brand/${newBrand.id}/strategy`)
    } catch (error) {
      console.error('Error creating brand:', error)
      showToast('error', 'Failed to create brand')
    } finally {
      setCreating(false)
    }
  }

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    setEditBrandName(brand.name)
    setEditBrandIndustry(brand.industry || 'technology')
    setShowEditModal(true)
  }

  const saveEditedBrand = async () => {
    if (!selectedBrand || !editBrandName.trim()) return

    try {
      setActionLoading(true)
      const updated = await brandService.updateBrand(selectedBrand.id, { 
        name: editBrandName.trim(),
        industry: editBrandIndustry
      })
      setBrands(brands.map(b => b.id === updated.id ? updated : b))
      setShowEditModal(false)
      showToast('success', 'Brand updated successfully')
    } catch (error) {
      console.error('Error updating brand:', error)
      showToast('error', 'Failed to update brand')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleFavorite = async (brand: Brand) => {
    try {
      const updated = await brandService.toggleFavorite(brand.id, !brand.is_favorite)
      setBrands(brands.map(b => b.id === updated.id ? updated : b))
      showToast('success', updated.is_favorite ? 'Added to favorites' : 'Removed from favorites')
    } catch (error) {
      console.error('Error toggling favorite:', error)
      showToast('error', 'Failed to update favorite status')
    }
  }

  const handleArchiveBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowArchiveModal(true)
  }

  const confirmArchive = async () => {
    if (!selectedBrand) return

    try {
      setActionLoading(true)
      await brandService.archiveBrand(selectedBrand.id)
      setBrands(brands.filter(b => b.id !== selectedBrand.id))
      const archived = await brandService.getArchivedBrands()
      setArchivedBrands(archived)
      setShowArchiveModal(false)
      showToast('success', 'Brand archived successfully')
    } catch (error) {
      console.error('Error archiving brand:', error)
      showToast('error', 'Failed to archive brand')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestoreBrand = async (brand: Brand) => {
    try {
      await brandService.restoreBrand(brand.id)
      setArchivedBrands(archivedBrands.filter(b => b.id !== brand.id))
      const activeBrands = await brandService.getUserBrands()
      setBrands(activeBrands)
      showToast('success', 'Brand restored successfully')
    } catch (error) {
      console.error('Error restoring brand:', error)
      showToast('error', 'Failed to restore brand')
    }
  }

  const handleDeleteBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedBrand) return

    try {
      setActionLoading(true)
      await brandService.deleteBrand(selectedBrand.id)
      setArchivedBrands(archivedBrands.filter(b => b.id !== selectedBrand.id))
      setShowDeleteModal(false)
      showToast('success', 'Brand deleted permanently')
    } catch (error) {
      console.error('Error deleting brand:', error)
      showToast('error', 'Failed to delete brand')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDuplicateBrand = async (brand: Brand) => {
    try {
      showToast('info', 'Duplicating brand...')
      const duplicated = await brandService.duplicateBrand(brand.id)
      setBrands([duplicated, ...brands])
      showToast('success', 'Brand duplicated successfully')
    } catch (error) {
      console.error('Error duplicating brand:', error)
      showToast('error', 'Failed to duplicate brand')
    }
  }

  const getBrandSteps = (brandId: string) => {
    const progress = brandProgress[brandId]
    
    return [
      {
        id: 'strategy',
        title: 'Brand Strategy',
        description: 'Define your purpose, values, and positioning',
        icon: Target,
        progress: progress?.strategy?.percentage || 0,
        status: progress?.strategy?.percentage >= 100 ? 'completed' : 
                progress?.strategy?.percentage > 0 ? 'in-progress' : 'not-started',
        path: `/brand/${brandId}/strategy`
      },
      {
        id: 'visual',
        title: 'Visual Identity',
        description: 'Create your logo, colors, and typography',
        icon: Palette,
        progress: progress?.visual?.percentage || 0,
        status: progress?.visual?.percentage >= 100 ? 'completed' : 
                progress?.visual?.percentage > 0 ? 'in-progress' : 'not-started',
        path: `/brand/${brandId}/visual`
      },
      {
        id: 'voice',
        title: 'Brand Voice',
        description: 'Establish your communication style',
        icon: MessageSquare,
        progress: progress?.voice?.percentage || 0,
        status: progress?.voice?.percentage >= 100 ? 'completed' : 
                progress?.voice?.percentage > 0 ? 'in-progress' : 'not-started',
        path: `/brand/${brandId}/voice`
      },
      {
        id: 'guidelines',
        title: 'Brand Guidelines',
        description: 'Generate your comprehensive brand guide',
        icon: FileText,
        progress: progress?.guidelines?.percentage || 0,
        status: progress?.guidelines?.percentage >= 100 ? 'completed' : 
                progress?.guidelines?.percentage > 0 ? 'in-progress' : 'not-started',
        path: `/brand/${brandId}/guidelines`
      },
      {
        id: 'consistency',
        title: 'Brand Consistency',
        description: 'Templates and compliance tools',
        icon: CheckCircle,
        progress: progress?.consistency?.percentage || 0,
        status: progress?.consistency?.percentage >= 100 ? 'completed' : 
                progress?.consistency?.percentage > 0 ? 'in-progress' : 'not-started',
        path: `/brand/${brandId}/consistency`
      },
      {
        id: 'health',
        title: 'Brand Health',
        description: 'Analytics and performance metrics',
        icon: Activity,
        progress: progress?.health?.percentage || 0,
        status: progress?.health?.percentage >= 100 ? 'completed' : 
                progress?.health?.percentage > 0 ? 'in-progress' : 'not-started',
        path: `/brand/${brandId}/health`
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      default: return 'Not Started'
    }
  }

  const getIndustryName = (industryId: string | undefined) => {
    if (!industryId) return 'Not specified'
    const industry = industries.find(i => i.id === industryId)
    return industry ? industry.name : 'Not specified'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const displayedBrands = showArchivedBrands ? archivedBrands : brands

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 dashboard-header"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-700">
              {brands.length === 0 
                ? "Let's create your first brand identity. Click below to get started."
                : "Continue building your brand identities or create a new one."
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TourButton tourId="dashboard" />
            
            {archivedBrands.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowArchivedBrands(!showArchivedBrands)}
                className="flex items-center space-x-2"
              >
                {showArchivedBrands ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Show Active Brands</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span>Show Archived</span>
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={handleCreateBrand}
              className="flex items-center space-x-2 create-brand-button"
            >
              <Plus className="w-4 h-4" />
              <span>New Brand</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {displayedBrands.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-16"
        >
          <Card className="p-12 max-w-md mx-auto luxury-card">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-2xl mx-auto mb-6 shadow-lg">
              <img 
                src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
                alt="Brandie Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">
              {showArchivedBrands ? "No Archived Brands" : "Create Your First Brand"}
            </h2>
            <p className="text-gray-700 mb-6">
              {showArchivedBrands 
                ? "You don't have any archived brands. Archived brands will appear here."
                : "Start building a compelling brand identity with our AI-powered platform. We'll guide you through every step of the process."
              }
            </p>
            {showArchivedBrands ? (
              <Button
                onClick={() => setShowArchivedBrands(false)}
                size="lg"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Back to Active Brands</span>
              </Button>
            ) : (
              <Button
                onClick={handleCreateBrand}
                size="lg"
                className="flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Get Started</span>
              </Button>
            )}
          </Card>
        </motion.div>
      ) : (
        /* Brands List */
        <div className="space-y-8">
          {displayedBrands.map((brand, index) => {
            const progress = brandProgress[brand.id]
            const overallProgress = progress?.overall?.percentage || 0
            
            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="brand-card"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleToggleFavorite(brand)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        title={brand.is_favorite ? "Unfavorite" : "Favorite"}
                      >
                        {brand.is_favorite ? (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{brand.name}</h2>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Factory className="w-4 h-4" />
                          <span>{getIndustryName(brand.industry)}</span>
                          <span>•</span>
                          <span>Created {new Date(brand.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{overallProgress}% Complete</span>
                        </div>
                        {progress && (
                          <div className="text-xs text-gray-500 mt-1">
                            Strategy: {progress.strategy.percentage}% • 
                            Visual: {progress.visual.percentage}% • 
                            Voice: {progress.voice.percentage}%
                          </div>
                        )}
                      </div>
                      <div className="relative group user-menu">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full p-2"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                          <button
                            onClick={() => handleEditBrand(brand)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Brand
                          </button>
                          <button
                            onClick={() => handleDuplicateBrand(brand)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </button>
                          {showArchivedBrands ? (
                            <>
                              <button
                                onClick={() => handleRestoreBrand(brand)}
                                className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Restore
                              </button>
                              <button
                                onClick={() => handleDeleteBrand(brand)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Permanently
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleArchiveBrand(brand)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <ProgressBar progress={overallProgress} className="mb-6" />

                  {/* Brand Building Steps */}
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 brand-steps">
                    {getBrandSteps(brand.id).map((step) => (
                      <motion.div
                        key={step.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                        onClick={() => navigate(step.path)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                            <step.icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">{step.title}</h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                              {getStatusText(step.status)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                        {step.progress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Landing Page Generator */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer bg-gradient-to-r from-green-50 to-blue-50"
                      onClick={() => navigate(`/brand/${brand.id}/landing-page`)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-luxury rounded-lg shadow-lg">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-black text-sm">Landing Page</h3>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Generate & Deploy
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">Create and deploy a professional landing page</p>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Create Brand Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Brand"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Give your brand a name and select its industry to get started. You can always change these later.
          </p>
          
          <Input
            label="Brand Name"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Enter brand name..."
            onKeyPress={(e) => e.key === 'Enter' && createNewBrand()}
            autoFocus
          />
          
          <div className="mt-4">
            <IndustrySelector
              selectedIndustry={newBrandIndustry}
              onIndustryChange={setNewBrandIndustry}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={createNewBrand}
              loading={creating}
              disabled={!newBrandName.trim()}
              className="flex-1"
            >
              Create Brand
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Brand Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Brand"
      >
        <div className="space-y-4">
          <Input
            label="Brand Name"
            value={editBrandName}
            onChange={(e) => setEditBrandName(e.target.value)}
            placeholder="Enter brand name..."
            onKeyPress={(e) => e.key === 'Enter' && saveEditedBrand()}
            autoFocus
          />
          
          <div className="mt-4">
            <IndustrySelector
              selectedIndustry={editBrandIndustry}
              onIndustryChange={setEditBrandIndustry}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEditedBrand}
              loading={actionLoading}
              disabled={!editBrandName.trim()}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Archive Brand Modal */}
      <Modal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        title="Archive Brand"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to archive <strong>{selectedBrand?.name}</strong>? 
            Archived brands can be restored later.
          </p>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowArchiveModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmArchive}
              loading={actionLoading}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              Archive Brand
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Brand Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Brand Permanently"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete <strong>{selectedBrand?.name}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              All brand data including strategy, visual assets, and guidelines will be permanently deleted.
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              loading={actionLoading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard