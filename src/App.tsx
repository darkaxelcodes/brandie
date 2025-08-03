import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { AppLayout } from './components/layout/AppLayout'
import { useAuth } from './contexts/AuthContext'
import { TokenProvider } from './contexts/TokenContext'

// Lazy-loaded components
const Landing = lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })))
const Features = lazy(() => import('./pages/Features').then(module => ({ default: module.Features })))
const Pricing = lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })))
const Success = lazy(() => import('./pages/Success').then(module => ({ default: module.Success })))
const Auth = lazy(() => import('./pages/Auth').then(module => ({ default: module.Auth })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })))
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })))
const Assets = lazy(() => import('./pages/Assets').then(module => ({ default: module.Assets })))
const Teams = lazy(() => import('./pages/Teams').then(module => ({ default: module.Teams })))
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'))
const BrandStrategy = lazy(() => import('./pages/strategy/BrandStrategy').then(module => ({ default: module.BrandStrategy })))
const VisualIdentity = lazy(() => import('./pages/visual/VisualIdentity').then(module => ({ default: module.VisualIdentity })))
const BrandVoice = lazy(() => import('./pages/voice/BrandVoice').then(module => ({ default: module.BrandVoice })))
const BrandGuidelines = lazy(() => import('./pages/guidelines/BrandGuidelines').then(module => ({ default: module.BrandGuidelines })))
const BrandConsistency = lazy(() => import('./pages/consistency/BrandConsistency').then(module => ({ default: module.BrandConsistency })))
const BrandHealth = lazy(() => import('./pages/BrandHealth').then(module => ({ default: module.BrandHealth })))
const UserPreferences = lazy(() => import('./pages/UserPreferences').then(module => ({ default: module.UserPreferences })))
const ChatBubble = lazy(() => import('./components/chat/ChatBubble').then(module => ({ default: module.ChatBubble })))

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
)

// ChatBubble wrapper that only shows for authenticated users
const AuthenticatedChatBubble = () => {
  const { user } = useAuth()
  
  // Only render ChatBubble if user is authenticated
  if (user) {
    return (
      <Suspense fallback={null}>
        <ChatBubble />
      </Suspense>
    )
  }
  
  return null
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <TokenProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={
                    <Suspense fallback={<PageLoader />}>
                      <Landing />
                    </Suspense>
                  } />
                  <Route path="/features" element={
                    <Suspense fallback={<PageLoader />}>
                      <Features />
                    </Suspense>
                  } />
                  <Route path="/pricing" element={
                    <Suspense fallback={<PageLoader />}>
                      <Pricing />
                    </Suspense>
                  } />
                  <Route path="/success" element={
                    <Suspense fallback={<PageLoader />}>
                      <Success />
                    </Suspense>
                  } />
                  <Route path="/auth" element={
                    <Suspense fallback={<PageLoader />}>
                      <Auth />
                    </Suspense>
                  } />
                  
                  {/* Protected Routes with AppLayout */}
                  <Route element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/home" element={
                      <Suspense fallback={<PageLoader />}>
                        <Home />
                      </Suspense>
                    } />
                    
                    <Route path="/dashboard" element={
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    } />
                    
                    <Route path="/teams" element={
                      <Suspense fallback={<PageLoader />}>
                        <Teams />
                      </Suspense>
                    } />
                    
                    <Route path="/assets" element={
                      <Suspense fallback={<PageLoader />}>
                        <Assets />
                      </Suspense>
                    } />
                    
                    <Route path="/chat" element={
                      <Suspense fallback={<PageLoader />}>
                        <ChatAssistant />
                      </Suspense>
                    } />
                    
                    <Route path="/preferences" element={
                      <Suspense fallback={<PageLoader />}>
                        <UserPreferences />
                      </Suspense>
                    } />
                    
                    <Route path="/brand/:brandId/strategy" element={
                      <Suspense fallback={<PageLoader />}>
                        <BrandStrategy />
                      </Suspense>
                    } />

                    <Route path="/brand/:brandId/visual" element={
                      <Suspense fallback={<PageLoader />}>
                        <VisualIdentity />
                      </Suspense>
                    } />

                    <Route path="/brand/:brandId/voice" element={
                      <Suspense fallback={<PageLoader />}>
                        <BrandVoice />
                      </Suspense>
                    } />

                    <Route path="/brand/:brandId/guidelines" element={
                      <Suspense fallback={<PageLoader />}>
                        <BrandGuidelines />
                      </Suspense>
                    } />
                    
                    <Route path="/brand/:brandId/consistency" element={
                      <Suspense fallback={<PageLoader />}>
                        <BrandConsistency />
                      </Suspense>
                    } />
                    
                    <Route path="/brand/:brandId/health" element={
                      <Suspense fallback={<PageLoader />}>
                        <BrandHealth />
                      </Suspense>
                    } />
                  </Route>
                  
                  {/* Redirect unknown routes */}
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
                
                {/* Global Chat Bubble - only for authenticated users */}
                <AuthenticatedChatBubble />
              </div>
            </Router>
          </TokenProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App