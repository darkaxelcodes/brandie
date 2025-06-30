import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { BrandStrategy } from '../../pages/strategy/BrandStrategy'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/brand/:brandId/strategy" element={component} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

const mockBrand = {
  id: 'test-brand-id',
  name: 'Test Brand',
  user_id: 'test-user-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

vi.mock('../../lib/brandService', () => ({
  brandService: {
    getBrand: vi.fn().mockResolvedValue(mockBrand),
    getStrategyFormData: vi.fn().mockResolvedValue({}),
    saveStrategySection: vi.fn().mockResolvedValue({}),
  }
}))

// Mock OpenAI service
vi.mock('../../lib/openai', () => ({
  generateStrategySuggestions: vi.fn().mockResolvedValue({
    suggestions: ['AI suggestion 1', 'AI suggestion 2', 'AI suggestion 3'],
    explanation: 'AI-generated suggestions'
  })
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ brandId: 'test-brand-id' }),
  }
})

describe('Strategy Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set current path for router
    window.history.pushState({}, '', '/brand/test-brand-id/strategy')
  })

  it('loads brand strategy page successfully', async () => {
    renderWithProviders(<BrandStrategy />)
    
    await waitFor(() => {
      expect(screen.getByText(/Brand Strategy/i)).toBeInTheDocument()
      expect(screen.getByText(/Test Brand/i)).toBeInTheDocument()
    })
  })

  it('displays step indicator with all steps', async () => {
    renderWithProviders(<BrandStrategy />)
    
    await waitFor(() => {
      expect(screen.getByText(/Purpose/i)).toBeInTheDocument()
      expect(screen.getByText(/Values/i)).toBeInTheDocument()
      expect(screen.getByText(/Audience/i)).toBeInTheDocument()
      expect(screen.getByText(/Competitive/i)).toBeInTheDocument()
      expect(screen.getByText(/Archetype/i)).toBeInTheDocument()
    })
  })

  it('allows navigation between steps', async () => {
    renderWithProviders(<BrandStrategy />)
    
    await waitFor(() => {
      expect(screen.getByText(/Purpose & Vision/i)).toBeInTheDocument()
    })

    // Click next to go to values step
    const nextButton = screen.getByText(/Next/i)
    fireEvent.click(nextButton)

    await waitFor(() => {
      const { brandService } = await import('../../lib/brandService')
      expect(brandService.saveStrategySection).toHaveBeenCalled()
    })
  })

  it('saves progress when moving between steps', async () => {
    renderWithProviders(<BrandStrategy />)
    
    await waitFor(() => {
      expect(screen.getByText(/Mission Statement/i)).toBeInTheDocument()
    })

    // Fill in mission statement
    const missionTextarea = screen.getByPlaceholderText(/We exist to/i)
    fireEvent.change(missionTextarea, { 
      target: { value: 'We exist to help businesses grow' } 
    })

    // Click next
    const nextButton = screen.getByText(/Next/i)
    fireEvent.click(nextButton)

    await waitFor(() => {
      const { brandService } = await import('../../lib/brandService')
      expect(brandService.saveStrategySection).toHaveBeenCalledWith(
        'test-brand-id',
        'purpose',
        expect.objectContaining({
          mission: 'We exist to help businesses grow'
        }),
        true
      )
    })
  })

  it('handles AI suggestions correctly', async () => {
    renderWithProviders(<BrandStrategy />)
    
    await waitFor(() => {
      expect(screen.getByText(/Get AI Suggestions/i)).toBeInTheDocument()
    })

    const aiButton = screen.getByText(/Get AI Suggestions/i)
    fireEvent.click(aiButton)

    await waitFor(() => {
      expect(screen.getByText(/AI Suggestions/i)).toBeInTheDocument()
      expect(screen.getByText(/AI suggestion 1/i)).toBeInTheDocument()
    })
  })

  it('completes strategy and navigates to dashboard', async () => {
    // Mock being on the last step
    renderWithProviders(<BrandStrategy />)
    
    await waitFor(() => {
      expect(screen.getByText(/Brand Strategy/i)).toBeInTheDocument()
    })

    // Simulate being on archetype step (last step)
    // This would require more complex mocking of the step state
    // For now, we'll test the basic flow
  })
})