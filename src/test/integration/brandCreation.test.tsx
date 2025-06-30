import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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

// Mock successful brand creation
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
    getStrategySections: vi.fn().mockResolvedValue([]),
  }
}))

vi.mock('../../lib/visualService', () => ({
  visualService: {
    getVisualAssets: vi.fn().mockResolvedValue([]),
    getBrandVoice: vi.fn().mockResolvedValue(null),
  }
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Brand Creation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a new brand successfully', async () => {
    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/New Brand/i)).toBeInTheDocument()
    })

    const newBrandButton = screen.getByText(/New Brand/i)
    fireEvent.click(newBrandButton)

    await waitFor(() => {
      const { brandService } = await import('../../lib/brandService')
      expect(brandService.createBrand).toHaveBeenCalledWith('Brand 1')
      expect(mockNavigate).toHaveBeenCalledWith('/brand/test-brand-id/strategy')
    })
  })

  it('handles brand creation errors gracefully', async () => {
    // Mock error response
    const { brandService } = await import('../../lib/brandService')
    vi.mocked(brandService.createBrand).mockRejectedValueOnce(
      new Error('RLS policy violation')
    )

    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/New Brand/i)).toBeInTheDocument()
    })

    const newBrandButton = screen.getByText(/New Brand/i)
    fireEvent.click(newBrandButton)

    await waitFor(() => {
      expect(brandService.createBrand).toHaveBeenCalled()
      // Should not navigate on error
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('displays empty state when no brands exist', async () => {
    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Create Your First Brand/i)).toBeInTheDocument()
      expect(screen.getByText(/Start building a compelling brand identity/i)).toBeInTheDocument()
    })
  })

  it('calculates brand progress correctly', async () => {
    // Mock brand with some completed sections
    const { brandService } = await import('../../lib/brandService')
    vi.mocked(brandService.getUserBrands).mockResolvedValueOnce([
      {
        id: 'test-brand',
        name: 'Test Brand',
        user_id: 'test-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])

    vi.mocked(brandService.getStrategySections).mockResolvedValueOnce([
      { id: '1', section_type: 'purpose', completed: true },
      { id: '2', section_type: 'values', completed: true },
      { id: '3', section_type: 'audience', completed: false },
    ])

    renderWithProviders(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Test Brand/i)).toBeInTheDocument()
      // Should show some progress (2/7 sections completed ≈ 29%)
      expect(screen.getByText(/29% Complete/i)).toBeInTheDocument()
    })
  })
})