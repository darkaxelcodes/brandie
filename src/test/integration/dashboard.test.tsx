import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { Dashboard } from '../../pages/Dashboard'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

// Mock the brand service
vi.mock('../../lib/brandService', () => ({
  brandService: {
    getUserBrands: vi.fn().mockResolvedValue([
      { id: '1', name: 'Test Brand', created_at: new Date().toISOString() }
    ]),
    createBrand: vi.fn().mockResolvedValue({
      id: '2', 
      name: 'New Brand', 
      created_at: new Date().toISOString()
    }),
    getStrategySections: vi.fn().mockResolvedValue([]),
  }
}))

vi.mock('../../lib/visualService', () => ({
  visualService: {
    getVisualAssets: vi.fn().mockResolvedValue([]),
    getBrandVoice: vi.fn().mockResolvedValue(null),
  }
}))

describe('Dashboard Integration', () => {
  it('renders welcome message', async () => {
    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    })
  })

  it('renders new brand button', async () => {
    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/New Brand/i)).toBeInTheDocument()
    })
  })

  it('displays existing brands', async () => {
    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Test Brand/i)).toBeInTheDocument()
    })
  })

  it('shows brand building steps', async () => {
    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Brand Strategy/i)).toBeInTheDocument()
      expect(screen.getByText(/Visual Identity/i)).toBeInTheDocument()
      expect(screen.getByText(/Brand Voice/i)).toBeInTheDocument()
      expect(screen.getByText(/Brand Guidelines/i)).toBeInTheDocument()
    })
  })
})