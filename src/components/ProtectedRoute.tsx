import React, { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const redirectSaved = useRef(false)

  // Save the attempted URL for redirecting after login (only once)
  useEffect(() => {
    if (!user && !loading && !redirectSaved.current) {
      // Only save if not already on auth page
      if (location.pathname !== '/auth') {
        sessionStorage.setItem('redirectAfterLogin', location.pathname)
        redirectSaved.current = true
      }
    }
  }, [user, loading, location])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}