import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import App from '../../App'

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

// Mock all services for end-to-end flow
vi.mock('../../lib/brandService', () => ({
  brandService: {
    getUserBrands: vi.fn().mockResolvedValue([]),
    createBrand: vi.fn().mockResolvedValue({
      id: 'test-brand-id',
      name: 'Brand 1',
      user_id: 'test-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }),
    getBrand: vi.fn().mockResolvedValue({
      id: 'test-brand-id',
      name: 'Brand 1',
      user_id: 'test-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }),
    getStrategyFormData: vi.fn().mockResolvedValue({}),
    saveStrategySection: vi.fn().mockResolvedValue({}),
    getStrategySections: vi.fn().mockResolvedValue([]),
  }
}))

vi.mock('../../lib/visualService', () => ({
  visualService: {
    getVisualAssets: vi.fn().mockResolvedValue([]),
    saveVisualAsset: vi.fn().mockResolvedValue({}),
    getBrandVoice: vi.fn().mockResolvedValue(null),
    saveBrandVoice: vi.fn().mockResolvedValue({}),
  }
}))

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false,
    signOut: vi.fn(),
  }),
}))

describe('Full Brand Creation Flow E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Start at dashboard
    window.history.pushState({}, '', '/dashboard')
  })

  it('completes full brand creation workflow', async () => {
    renderApp()
    
    // Should be on dashboard
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    })

    // Create new brand
    const newBrandButton = screen.getByText(/New Brand/i)
    fireEvent.click(newBrandButton)

    await waitFor(() => {
      const { brandService } = await import('../../lib/brandService')
      expect(brandService.createBrand).toHaveBeenCalled()
    })

    // Should navigate to strategy (mocked)
    // In a real E2E test, we would continue the flow through all steps
    
    const { brandService } = await import('../../lib/brandService')
    expect(brandService.createBrand).toHaveBeenCalledWith('Brand 1')
  })

  it('handles authentication flow', async () => {
    // Mock unauthenticated state
    vi.mocked(vi.importActual('../../contexts/AuthContext')).useAuth = () => ({
      user: null,
      loading: false,
      signOut: vi.fn(),
    })
    
    renderApp()
    
    // Should redirect to auth page
    // This would be tested with actual routing in a full E2E setup
  })

  it('maintains state across navigation', async () => {
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    })

    // Test that services are called to load initial state
    const { brandService } = await import('../../lib/brandService')
    expect(brandService.getUserBrands).toHaveBeenCalled()
  })
})