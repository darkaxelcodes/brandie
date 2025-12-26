import React from 'react'
import { motion } from 'framer-motion'
import { Gift, ChevronRight, X, Coins, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { UserProfile, PROFILE_COMPLETION_REWARD, userProfileService } from '../../lib/userProfileService'

interface ProfileCompletionBannerProps {
  profile: UserProfile | null
  onCompleteProfile: () => void
  onDismiss: () => void
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({
  profile,
  onCompleteProfile,
  onDismiss,
}) => {
  const { percentage, missingFields } = userProfileService.calculateProfileCompletion(profile)
  const canEarnReward = userProfileService.canEarnReward(profile)

  if (percentage === 100 || !canEarnReward) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-xl p-4 mb-6 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Complete your profile
            </h3>
            <p className="text-blue-100 text-sm">
              {percentage}% complete - {missingFields.length} field{missingFields.length !== 1 ? 's' : ''} remaining
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-amber-400/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <Coins className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-amber-100">
                  +{PROFILE_COMPLETION_REWARD} tokens
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                <Gift className="w-4 h-4 text-white/80" />
                <span className="text-sm text-white/80">Reward waiting</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block w-32">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <Button
            onClick={onCompleteProfile}
            className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap"
          >
            Complete Now
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
