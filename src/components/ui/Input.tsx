import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  icon,
  ...props
}, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-900">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`
            w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent
            hover:border-gray-400
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            ${icon ? 'pl-10' : ''}
            font-medium
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 font-medium" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'