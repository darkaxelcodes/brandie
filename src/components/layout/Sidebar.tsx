import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Layers, 
  Users, 
  FileImage, 
  HelpCircle, 
  Settings, 
  LogOut, 
  User,
  MessageSquare,
  Coins
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTour } from '../../contexts/TourContext'
import { Button } from '../ui/Button'
import { stripeService } from '../../lib/stripe'
import { getProductByPriceId } from '../../stripe-config'
import { useTokens } from '../../contexts/TokenContext'
import { TokenDisplay } from '../tokens/TokenDisplay'

interface SidebarProps {
  onSignOut: () => Promise<void>
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onSignOut, collapsed }) => {
  const { user } = useAuth()
  const { showTour } = useTour()
  const { tokenBalance, isLoading } = useTokens()
  const [subscription, setSubscription] = useState<any>(null)
  const location = useLocation()
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Brands', icon: Layers },
    { path: '/teams', label: 'Teams', icon: Users },
    { path: '/assets', label: 'Assets', icon: FileImage },
    { path: '/chat', label: 'AI Assistant', icon: MessageSquare }
  ]

  const bottomNavItems = [
    { path: '/preferences', label: 'Settings', icon: Settings }
  ]

  useEffect(() => {
    if (user) {
      loadSubscription()
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      const data = await stripeService.getUserSubscription()
      setSubscription(data)
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const isActive = (path: string) => {
    if (path === '/home' && location.pathname === '/home') return true
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname.includes('/brand/'))) return true
    return location.pathname === path
  }

  const handleMouseEnter = (label: string) => {
    setActiveTooltip(label)
  }

  const handleMouseLeave = () => {
    setActiveTooltip(null)
  }

  const getTooltipPosition = (element: Element | null) => {
    if (!element) return { top: 0 }
    const rect = element.getBoundingClientRect()
    return { top: rect.top + rect.height / 2 - 10 }
  }

  return (
    <motion.div 
      className="h-screen bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 flex flex-col w-20 luxury-surface"
      initial={false}
    >
      {/* Logo */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-center">
        <Link to="/home" className="flex items-center justify-center">
          <img 
            src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
            alt="Brandie Logo" 
            className="w-10 h-10 object-contain"
          />
        </Link>
      </div>

      {/* Token Display */}
      <div className="px-3 py-4 border-b border-secondary-200 dark:border-secondary-700">
        <TokenDisplay collapsed={true} />
        
        {/* Subscription Status */}
        {subscription && (
          <div className="mt-3 pt-3 border-t border-secondary-200 dark:border-secondary-700">
            <div 
              className="relative flex justify-center"
              onMouseEnter={() => handleMouseEnter('Subscription')}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                subscription.subscription_status === 'active' 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                <Crown className={`w-6 h-6 ${
                  subscription.subscription_status === 'active' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              
              {/* Status badge */}
              <div className={`absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                subscription.subscription_status === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-amber-600 text-white'
              }`}>
                {subscription.subscription_status === 'active' ? '✓' : '!'}
              </div>
              
              {/* Tooltip */}
              {activeTooltip === 'Subscription' && (
                <div 
                  className="fixed z-50 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm py-2 px-3 rounded-lg shadow-luxury-lg whitespace-nowrap border border-secondary-200 dark:border-secondary-600" 
                  style={{ 
                    left: '70px', 
                    top: `${getTooltipPosition(document.querySelector('.bg-green-100, .bg-amber-100')).top}px` 
                  }}
                >
                  <div className="font-medium">
                    {getProductByPriceId(subscription.price_id)?.name || 'Subscription'}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-secondary-400 capitalize">
                    {subscription.subscription_status.replace('_', ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <div key={item.path} className="relative" onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={handleMouseLeave}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-center px-3 py-3 rounded-lg transition-colors ${
                    active 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500 dark:text-secondary-400'}`} />
                </Link>
                
                {/* Tooltip */}
                {activeTooltip === item.label && (
                  <div 
                    className="fixed z-50 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm py-2 px-3 rounded-lg shadow-luxury-lg whitespace-nowrap border border-secondary-200 dark:border-secondary-600" 
                    style={{ 
                      left: '70px', 
                      top: `${getTooltipPosition(document.querySelector(`a[href="${item.path}"]`)).top}px` 
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-secondary-200 dark:border-secondary-700">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <div key={item.path} className="relative" onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={handleMouseLeave}>
              <Link
                to={item.path}
                className={`flex items-center justify-center px-3 py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                    : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500 dark:text-secondary-400'}`} />
              </Link>
              
              {/* Tooltip */}
              {activeTooltip === item.label && (
                <div 
                  className="fixed z-50 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm py-2 px-3 rounded-lg shadow-luxury-lg whitespace-nowrap border border-secondary-200 dark:border-secondary-600" 
                  style={{ 
                    left: '70px', 
                    top: `${getTooltipPosition(document.querySelector(`a[href="${item.path}"]`)).top}px` 
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          )
        })}

        {/* User Profile */}
        <div 
          className="mt-2 px-3 py-3 flex justify-center relative" 
          onMouseEnter={() => handleMouseEnter('Profile')} 
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-luxury rounded-full shadow-luxury">
            <User className="w-4 h-4 text-white" />
          </div>
          
          {/* Tooltip */}
          {activeTooltip === 'Profile' && (
            <div 
              className="fixed z-50 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm py-2 px-3 rounded-lg shadow-luxury-lg whitespace-nowrap border border-secondary-200 dark:border-secondary-600" 
              style={{ 
                left: '70px', 
                top: `${getTooltipPosition(document.querySelector('.mt-2.px-3.py-3')).top}px` 
              }}
            >
              {user?.email?.split('@')[0]}
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div 
          className="relative" 
          onMouseEnter={() => handleMouseEnter('Sign Out')} 
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" />
          </button>
          
          {/* Tooltip */}
          {activeTooltip === 'Sign Out' && (
            <div 
              className="fixed z-50 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white text-sm py-2 px-3 rounded-lg shadow-luxury-lg whitespace-nowrap border border-secondary-200 dark:border-secondary-600" 
              style={{ 
                left: '70px', 
                top: `${getTooltipPosition(document.querySelector('.text-red-600')).top}px` 
              }}
            >
              Sign Out
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}