import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Factory, Check, Info } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { industries } from '../../lib/industryService'

interface IndustrySelectorProps {
  selectedIndustry: string | undefined
  onIndustryChange: (industry: string) => void
  className?: string
}

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustry,
  onIndustryChange,
  className = ''
}) => {
  const [showInfo, setShowInfo] = useState<string | null>(null)

  // Get industry descriptions
  const industryDescriptions: Record<string, string> = {
    technology: 'Software, hardware, IT services, telecommunications, and tech consulting.',
    healthcare: 'Hospitals, clinics, medical devices, pharmaceuticals, and health services.',
    finance: 'Banking, insurance, investment, financial services, and fintech.',
    education: 'Schools, universities, e-learning platforms, and educational resources.',
    retail: 'E-commerce, brick-and-mortar stores, consumer goods, and retail services.',
    food: 'Restaurants, food production, catering, and beverage companies.',
    travel: 'Hotels, airlines, travel agencies, tourism, and hospitality services.',
    real_estate: 'Property development, real estate agencies, and property management.',
    manufacturing: 'Production facilities, industrial goods, and manufacturing services.',
    media: 'Publishing, broadcasting, film, music, and entertainment companies.',
    professional: 'Consulting, legal, accounting, and other professional services.',
    nonprofit: 'Charities, foundations, NGOs, and social enterprises.',
    other: 'Other industries not listed above.'
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Factory className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Industry Classification</h3>
        </div>
        <div className="text-sm text-gray-500">
          Enhances AI suggestions
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {industries.map((industry) => {
          const Icon = industry.icon as any
          const isSelected = selectedIndustry === industry.id
          
          return (
            <motion.div
              key={industry.id}
              whileHover={{ scale: 1.02 }}
              className={`
                relative p-3 border rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => onIndustryChange(industry.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Factory className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-sm">{industry.name}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfo(showInfo === industry.id ? null : industry.id)
                  }}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              
              {showInfo === industry.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 bottom-full mb-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 text-xs text-gray-600"
                >
                  {industryDescriptions[industry.id] || 'No description available.'}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}