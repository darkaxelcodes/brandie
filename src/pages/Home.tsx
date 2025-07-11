import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Layers, 
  Users, 
  FileImage, 
  Activity, 
  Zap, 
  TrendingUp, 
  Star, 
  Clock, 
  ArrowRight,
  Plus,
  MessageSquare
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { brandService } from '../lib/brandService'
import { visualService } from '../lib/visualService'
import { useAuth } from '../contexts/AuthContext'
import { Brand } from '../types/brand'
import { TourButton } from '../components/ui/TourButton'
import { useToast } from '../contexts/ToastContext'

export const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [recentBrands, setRecentBrands] = useState<Brand[]>([])
  const [favoriteBrands, setFavoriteBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBrands: 0,
    completedBrands: 0,
    inProgress: 0,
    assetsCount: 0,
    recentActivity: []
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const brands = await brandService.getUserBrands()
      
      // Set recent brands (last 5)
      setRecentBrands(brands.slice(0, 5))
      
      // Set favorite brands
      setFavoriteBrands(brands.filter(brand => brand.is_favorite).slice(0, 5))
      
      // Count total assets across all brands
      let totalAssets = 0
      for (const brand of brands) {
        const assets = await visualService.getVisualAssets(brand.id)
        totalAssets += assets.length
      }
      
      // Calculate stats
      setStats({
        totalBrands: brands.length,
        completedBrands: 0, // This would come from a real calculation
        inProgress: brands.length,
        assetsCount: totalAssets,
        recentActivity: []
      })

      // Generate mock recent activity
      const mockActivity = generateMockActivity(brands)
      setRecentActivity(mockActivity)
    } catch (error) {
      console.error('Error loading home data:', error)
      showToast('error', 'Failed to load home data')
    } finally {
      setLoading(false)
    }
  }

  // Generate mock activity data based on actual brands
  const generateMockActivity = (brands: Brand[]): any[] => {
    if (brands.length === 0) return []
    
    const activities = [
      { type: 'brand_created', message: 'created a new brand' },
      { type: 'logo_updated', message: 'updated logo for' },
      { type: 'colors_generated', message: 'generated color palette for' },
      { type: 'typography_selected', message: 'selected typography for' },
      { type: 'strategy_updated', message: 'updated brand strategy for' },
      { type: 'voice_defined', message: 'defined brand voice for' }
    ]
    
    return brands.slice(0, 3).map((brand, index) => {
      const activity = activities[Math.floor(Math.random() * activities.length)]
      return {
        id: `activity-${index}`,
        type: activity.type,
        message: `${activity.message} ${brand.name}`,
        brandId: brand.id,
        brandName: brand.name,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random time in last week
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 home-header"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your brand building progress
            </p>
          </div>
          <TourButton tourId="home" />
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stats-overview"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Brands</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalBrands}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
              <FileImage className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Assets Created</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.assetsCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Team Members</p>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Brands */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 recent-brands"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Brands</h2>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {recentBrands.length === 0 ? (
          <Card className="p-6 text-center">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands yet</h3>
            <p className="text-gray-500 mb-4">Create your first brand to get started</p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Brand</span>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    {brand.is_favorite && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Updated {new Date(brand.updated_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/brand/${brand.id}/strategy`)}
                      className="flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 quick-actions"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Create New Brand</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Start building a new brand identity from scratch
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <FileImage className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Browse Assets</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              View and manage all your brand assets in one place
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => navigate('/assets')}
                className="flex items-center space-x-2"
              >
                <span>View Assets</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get AI-powered help with your branding questions
            </p>
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => navigate('/chat')}
                className="flex items-center space-x-2"
              >
                <span>Chat Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Favorite Brands */}
      {favoriteBrands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Brands</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Updated {new Date(brand.updated_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/brand/${brand.id}/strategy`)}
                      className="flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>

        <Card className="p-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-500">
                Your recent brand activities will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 mt-1">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-gray-900">You</span>
                      <span className="text-gray-600">{activity.message}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/brand/${activity.brandId}/strategy`)}
                    className="text-blue-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}