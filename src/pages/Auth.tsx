import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { signUp, signIn, signInWithGoogle } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Check for redirect after login
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin')
      navigate(redirectPath)
    }
  }, [navigate])

  // Keyboard shortcut for form submission
  useKeyboardShortcut('Enter', () => {
    if (email && password) {
      handleSubmit(new Event('submit') as any)
    }
  }, { enabled: !loading })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        showToast('success', 'Account created successfully! You can now sign in.')
        setIsSignUp(false)
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        showToast('success', 'Signed in successfully!')
        navigate('/home')
      }
    } catch (err: any) {
      setError(err.message)
      showToast('error', err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message)
      showToast('error', err.message || 'Google sign in failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-electric-purple/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>
      
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-2xl shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Start building your brand identity today' 
                : 'Sign in to continue building your brand'
              }
            </p>
          </div>

          <Card className="p-8 luxury-card">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-4 h-4" />}
                aria-label="Email"
              />
              
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-4 h-4" />}
                aria-label="Password"
              />

              <Button
                type="submit"
                className="btn-primary w-full text-lg py-4 mt-8"
                loading={loading}
                aria-label={isSignUp ? "Create Account" : "Sign In"}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full mt-6 py-4"
                onClick={handleGoogleSignIn}
                loading={loading}
                aria-label="Continue with Google"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-electric-blue hover:text-electric-blue-dark font-medium transition-colors"
                aria-label={isSignUp ? "Sign in to existing account" : "Create new account"}
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}