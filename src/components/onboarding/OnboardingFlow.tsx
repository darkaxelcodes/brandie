import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Building2,
  Briefcase,
  Target,
  Gift,
  ChevronRight,
  ChevronLeft,
  X,
  Coins,
  Check,
  Sparkles,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { useTokens } from '../../contexts/TokenContext'
import {
  userProfileService,
  UserProfile,
  ROLE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  GOAL_OPTIONS,
  REFERRAL_OPTIONS,
  PROFILE_COMPLETION_REWARD,
} from '../../lib/userProfileService'
import { analyticsService, EventName } from '../../lib/analytics'

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
  initialProfile?: UserProfile | null
}

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: User },
  { id: 'company', title: 'Company', icon: Building2 },
  { id: 'role', title: 'About You', icon: Briefcase },
  { id: 'goals', title: 'Your Goals', icon: Target },
  { id: 'complete', title: 'Complete', icon: Gift },
]

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkip,
  initialProfile,
}) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { refreshTokenBalance } = useTokens()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokensEarned, setTokensEarned] = useState(0)

  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || '',
    company_name: initialProfile?.company_name || '',
    company_website: initialProfile?.company_website || '',
    role: initialProfile?.role || '',
    company_size: initialProfile?.company_size || '',
    industry: initialProfile?.industry || '',
    goals: initialProfile?.goals || [] as string[],
    referral_source: initialProfile?.referral_source || '',
  })

  useEffect(() => {
    analyticsService.trackOnboarding(EventName.ONBOARDING_STARTED, {
      step: 0,
      stepName: 'welcome',
      totalSteps: STEPS.length,
    })
  }, [])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      analyticsService.trackOnboarding(EventName.ONBOARDING_STEP_COMPLETED, {
        step: currentStep,
        stepName: STEPS[currentStep].id,
        totalSteps: STEPS.length,
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = async () => {
    if (!user) return

    try {
      await userProfileService.getOrCreateProfile(user.id)
      await userProfileService.skipOnboarding(user.id)
      showToast('info', 'You can complete your profile anytime in Settings')
      onSkip()
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      onSkip()
    }
  }

  const handleComplete = async () => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await userProfileService.getOrCreateProfile(user.id)

      const { profile, tokensRewarded } = await userProfileService.completeOnboarding(
        user.id,
        formData
      )

      if (profile) {
        setTokensEarned(tokensRewarded)

        if (tokensRewarded > 0) {
          await refreshTokenBalance()
          showToast('success', `Profile complete! You earned ${tokensRewarded} tokens`)
        } else {
          showToast('success', 'Profile updated successfully')
        }

        setCurrentStep(STEPS.length - 1)
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      showToast('error', 'Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.full_name.trim() !== ''
      case 1:
        return true
      case 2:
        return formData.role !== ''
      case 3:
        return formData.goals.length > 0
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Brandie!</h2>
              <p className="text-gray-600">
                Let's get to know you better. Complete your profile and earn{' '}
                <span className="font-semibold text-amber-600">{PROFILE_COMPLETION_REWARD} free tokens</span>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                className="text-lg"
                autoFocus
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
              <Coins className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Earn Tokens</p>
                <p className="text-sm text-amber-700">
                  Complete all steps to earn {PROFILE_COMPLETION_REWARD} tokens for AI features.
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your company</h2>
              <p className="text-gray-600">This helps us personalize your experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company name (optional)
              </label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company website (optional)
              </label>
              <Input
                value={formData.company_website}
                onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Company size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {COMPANY_SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, company_size: option.value })}
                    className={`
                      p-3 rounded-lg border-2 text-left transition-all
                      ${formData.company_size === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your role?</h2>
              <p className="text-gray-600">Help us tailor features to your needs</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, role: option.value })}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${formData.role === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span className={`font-medium ${formData.role === option.value ? 'text-blue-700' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How did you hear about us? (optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REFERRAL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, referral_source: option.value })}
                    className={`
                      p-2 rounded-lg border text-sm transition-all
                      ${formData.referral_source === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you want to achieve?</h2>
              <p className="text-gray-600">Select all that apply</p>
            </div>

            <div className="space-y-3">
              {GOAL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleGoal(option.value)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between
                    ${formData.goals.includes(option.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span className={`font-medium ${formData.goals.includes(option.value) ? 'text-blue-700' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                  {formData.goals.includes(option.value) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-600 mb-6">
              Your profile is complete. Time to build your brand.
            </p>

            {tokensEarned > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 mb-6"
              >
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Coins className="w-8 h-8 text-amber-500" />
                  <span className="text-3xl font-bold text-amber-600">+{tokensEarned}</span>
                </div>
                <p className="text-amber-700 font-medium">Tokens earned!</p>
                <p className="text-sm text-amber-600 mt-1">Use them for AI-powered features</p>
              </motion.div>
            )}

            <Button onClick={onComplete} size="lg" className="w-full">
              Start Building
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="p-6 relative">
          {currentStep < STEPS.length - 1 && (
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Skip onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {currentStep < STEPS.length - 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {STEPS.length - 1}
                </span>
                <span className="text-sm font-medium text-amber-600">
                  Earn {PROFILE_COMPLETION_REWARD} tokens
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / (STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {currentStep < STEPS.length - 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {currentStep < STEPS.length - 2 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed() || isSubmitting}
                  loading={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                >
                  Complete & Earn Tokens
                  <Gift className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
