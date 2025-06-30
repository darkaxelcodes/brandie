import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { Tour, TourStep } from '../components/ui/Tour'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'
import { supabase, withRetry } from '../lib/supabase'

interface TourContextType {
  showTour: (tourId: string) => void
  closeTour: () => void
  completeTour: (tourId: string) => void
  isTourActive: boolean
  activeTourId: string | null
  hasCompletedTour: (tourId: string) => boolean
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export const useTour = () => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: ReactNode
}

// Define available tours
const tours: Record<string, TourStep[]> = {
  'dashboard': [
    {
      target: '.dashboard-header',
      title: 'Welcome to Brandie',
      content: 'This is your brand dashboard where you can manage all your brands and access key features.',
      placement: 'bottom'
    },
    {
      target: '.create-brand-button',
      title: 'Create New Brands',
      content: 'Click here to create a new brand. You can create multiple brands to manage different projects.',
      placement: 'bottom'
    },
    {
      target: '.brand-card',
      title: 'Brand Cards',
      content: 'Each card represents one of your brands. Click on any card to access its details and building steps.',
      placement: 'top'
    },
    {
      target: '.brand-steps',
      title: 'Brand Building Steps',
      content: 'Follow these steps to build your brand. Start with Strategy, then create your Visual Identity and Voice.',
      placement: 'bottom'
    },
    {
      target: '.user-menu',
      title: 'User Menu',
      content: 'Access your account settings, preferences, and keyboard shortcuts from here.',
      placement: 'bottom'
    }
  ],
  'strategy': [
    {
      target: '.strategy-header',
      title: 'Brand Strategy',
      content: 'Define your brand strategy by completing each section. This will guide all your brand decisions.',
      placement: 'bottom'
    },
    {
      target: '.strategy-steps',
      title: 'Strategy Steps',
      content: 'Complete each step to build a comprehensive brand strategy. You can save your progress at any time.',
      placement: 'bottom'
    },
    {
      target: '.ai-button',
      title: 'AI Assistance',
      content: 'Get AI-powered suggestions to help you define your brand strategy elements.',
      placement: 'left'
    }
  ],
  'visual': [
    {
      target: '.visual-header',
      title: 'Visual Identity',
      content: "Create your brand's visual elements including logo, colors, and typography.",
      placement: 'bottom'
    },
    {
      target: '.visual-tabs',
      title: 'Visual Elements',
      content: 'Switch between tabs to create different visual elements for your brand.',
      placement: 'bottom'
    },
    {
      target: '.ai-generator',
      title: 'AI Generation',
      content: 'Use AI to generate professional visual elements based on your brand strategy.',
      placement: 'top'
    }
  ],
  'voice': [
    {
      target: '.voice-header',
      title: 'Brand Voice',
      content: 'Define how your brand communicates with its audience.',
      placement: 'bottom'
    },
    {
      target: '.tone-scales',
      title: 'Tone Scales',
      content: 'Adjust these scales to define your brand\'s tone of voice, from formal to casual, logical to emotional.',
      placement: 'right'
    },
    {
      target: '.messaging-section',
      title: 'Messaging Framework',
      content: 'Create your brand\'s key messages, tagline, and elevator pitch here.',
      placement: 'left'
    },
    {
      target: '.voice-examples',
      title: 'Content Examples',
      content: 'Generate platform-specific content examples that match your brand voice.',
      placement: 'top'
    }
  ],
  'guidelines': [
    {
      target: '.guidelines-header',
      title: 'Brand Guidelines',
      content: 'Create comprehensive guidelines to ensure brand consistency across all touchpoints.',
      placement: 'bottom'
    },
    {
      target: '.guidelines-preview',
      title: 'Guidelines Preview',
      content: 'Preview how your brand guidelines will look when exported.',
      placement: 'right'
    },
    {
      target: '.export-options',
      title: 'Export Options',
      content: 'Export your guidelines in various formats to share with your team or clients.',
      placement: 'left'
    }
  ],
  'consistency': [
    {
      target: '.consistency-header',
      title: 'Brand Consistency',
      content: 'Ensure your brand is consistently applied across all materials and platforms.',
      placement: 'bottom'
    },
    {
      target: '.compliance-checker',
      title: 'Compliance Checker',
      content: 'Upload materials to check if they comply with your brand guidelines.',
      placement: 'right'
    },
    {
      target: '.template-library',
      title: 'Template Library',
      content: 'Access ready-to-use templates that follow your brand guidelines.',
      placement: 'left'
    }
  ],
  'home': [
    {
      target: '.home-header',
      title: 'Welcome to Brandie',
      content: 'This is your home dashboard where you can see an overview of all your brand activities.',
      placement: 'bottom'
    },
    {
      target: '.stats-overview',
      title: 'Brand Statistics',
      content: 'See key metrics about your brands, including total count and progress.',
      placement: 'bottom'
    },
    {
      target: '.recent-brands',
      title: 'Recent Brands',
      content: 'Quickly access your most recently updated brands.',
      placement: 'top'
    },
    {
      target: '.quick-actions',
      title: 'Quick Actions',
      content: 'Access common actions like creating a new brand or using the AI assistant.',
      placement: 'bottom'
    }
  ],
  'chat': [
    {
      target: '.chat-header',
      title: 'AI Assistant',
      content: 'Get help with your branding questions and tasks from our AI assistant.',
      placement: 'bottom'
    },
    {
      target: '.conversation-history',
      title: 'Conversation History',
      content: 'Access your previous conversations with the AI assistant.',
      placement: 'right'
    },
    {
      target: '.chat-interface',
      title: 'Chat Interface',
      content: 'Type your questions or use voice input to communicate with the AI.',
      placement: 'left'
    }
  ],
  'preferences': [
    {
      target: '.preferences-header',
      title: 'User Preferences',
      content: 'Customize your Brandie experience with these settings.',
      placement: 'bottom'
    },
    {
      target: '.theme-settings',
      title: 'Theme Settings',
      content: 'Choose between light, dark, or system theme for the interface.',
      placement: 'right'
    },
    {
      target: '.accessibility-settings',
      title: 'Accessibility Settings',
      content: 'Adjust settings like reduced motion for a more comfortable experience.',
      placement: 'left'
    }
  ]
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [activeTourId, setActiveTourId] = useState<string | null>(null)
  const [completedTours, setCompletedTours] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  
  // Use a ref to track if we're in the middle of a tour
  const tourActiveRef = useRef(false)

  useEffect(() => {
    if (user) {
      loadCompletedTours()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadCompletedTours = async () => {
    try {
      setLoading(true)
      
      // Check if we have completed tours in localStorage first
      const localTours = localStorage.getItem('completedTours')
      if (localTours) {
        try {
          const parsedTours = JSON.parse(localTours)
          setCompletedTours(Array.isArray(parsedTours) ? parsedTours : [])
        } catch (parseError) {
          console.warn('Invalid localStorage data for completedTours, resetting:', parseError)
          localStorage.removeItem('completedTours')
          setCompletedTours([])
        }
      }
      
      // Then try to load from database if user is authenticated
      if (user) {
        try {
          // Check if Supabase is properly configured
          if (!supabase) {
            console.warn('Supabase client not initialized')
            return
          }

          const { data, error } = await withRetry(async () => {
            return supabase
              .from('user_preferences')
              .select('completed_tours')
              .eq('user_id', user.id)
              .single()
          })
          
          if (error) {
            // If no record exists, that's okay - user hasn't set preferences yet
            if (error.code === 'PGRST116') {
              console.log('No user preferences found, using defaults')
            } else {
              console.error('Error loading completed tours from database:', error)
            }
          } else if (data && data.completed_tours) {
            const dbTours = Array.isArray(data.completed_tours) ? data.completed_tours : []
            setCompletedTours(dbTours)
            localStorage.setItem('completedTours', JSON.stringify(dbTours))
          }
        } catch (fetchError) {
          console.error('Network error loading completed tours:', fetchError)
          // Continue with localStorage data if available
          if (localTours) {
            console.log('Using cached tour data due to network error')
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error loading completed tours:', error)
      // Fallback to empty array to prevent app crash
      setCompletedTours([])
    } finally {
      setLoading(false)
    }
  }

  const saveCompletedTour = async (tourId: string) => {
    try {
      // Prevent duplicates
      if (completedTours.includes(tourId)) {
        return
      }
      
      const updatedTours = [...completedTours, tourId]
      setCompletedTours(updatedTours)
      
      // Save to localStorage for immediate access
      localStorage.setItem('completedTours', JSON.stringify(updatedTours))
      
      // Save to database if user is logged in
      if (user) {
        try {
          // First, try to update existing record
          const { error: updateError } = await withRetry(async () => {
            return supabase
              .from('user_preferences')
              .update({ completed_tours: updatedTours })
              .eq('user_id', user.id)
          })
          
          // If update fails because no record exists, create one
          if (updateError && updateError.code === 'PGRST116') {
            const { error: insertError } = await withRetry(async () => {
              return supabase
                .from('user_preferences')
                .insert({
                  user_id: user.id,
                  completed_tours: updatedTours,
                  theme: 'light',
                  keyboard_shortcuts_enabled: true,
                  reduced_motion: false
                })
            })
            
            if (insertError) {
              console.error('Error creating user preferences:', insertError)
            }
          } else if (updateError) {
            console.error('Error updating completed tours:', updateError)
          }
        } catch (saveError) {
          console.error('Network error saving completed tour:', saveError)
          // Tour is still saved locally, so this is not critical
        }
      }
    } catch (error) {
      console.error('Unexpected error saving completed tour:', error)
      // Don't throw - the tour completion should still work locally
    }
  }

  const showTour = (tourId: string) => {
    // Already on this tour and it's open → do nothing
    if (tourActiveRef.current && activeTourId === tourId && isOpen) return;

    // Don't reopen if it was completed
    if (hasCompletedTour(tourId)) {
      // But allow explicit reopening for review
      // This is intentional - we want to allow users to review tours
    }

    if (!tours[tourId]) {
      showToast('error', 'Tour not found');
      return;
    }

    setActiveTourId(tourId);
    setCurrentStep(0);
    setIsOpen(true);
    tourActiveRef.current = true;
  }

  const closeTour = () => {
    tourActiveRef.current = false
    setIsOpen(false)
  }

  const completeTour = async (tourId: string) => {
    tourActiveRef.current = false
    setIsOpen(false)
    
    if (!completedTours.includes(tourId)) {
      await saveCompletedTour(tourId)
    }
    
    showToast('success', 'Tour completed!')
  }

  const hasCompletedTour = (tourId: string): boolean => {
    return completedTours.includes(tourId)
  }

  const handleStepChange = (step: number) => {
    // Only update step if tour is still active
    if (tourActiveRef.current) {
      setCurrentStep(step)
    }
  }

  return (
    <TourContext.Provider value={{
      showTour,
      closeTour,
      completeTour,
      isTourActive: tourActiveRef.current,
      activeTourId,
      hasCompletedTour
    }}>
      {children}
      
      {activeTourId && tours[activeTourId] && (
        <Tour
          steps={tours[activeTourId]}
          isOpen={isOpen && tourActiveRef.current}
          onClose={closeTour}
          onComplete={() => completeTour(activeTourId)}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
      )}
    </TourContext.Provider>
  )
}