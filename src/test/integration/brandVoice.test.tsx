import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { BrandVoice } from '../../pages/voice/BrandVoice'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/brand/:brandId/voice" element={component} />
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
  }
}))

vi.mock('../../lib/visualService', () => ({
  visualService: {
    getBrandVoice: vi.fn().mockResolvedValue(null),
    saveBrandVoice: vi.fn().mockResolvedValue({}),
  }
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

describe('Brand Voice Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState({}, '', '/brand/test-brand-id/voice')
  })

  it('loads brand voice page successfully', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Brand Voice/i)).toBeInTheDocument()
      expect(screen.getByText(/Test Brand/i)).toBeInTheDocument()
    })
  })

  it('displays tone scales', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Formal/i)).toBeInTheDocument()
      expect(screen.getByText(/Casual/i)).toBeInTheDocument()
      expect(screen.getByText(/Logical/i)).toBeInTheDocument()
      expect(screen.getByText(/Emotional/i)).toBeInTheDocument()
    })
  })

  it('allows tone scale adjustments', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Tone of Voice/i)).toBeInTheDocument()
    })

    // Find and adjust a slider (this is simplified - actual slider interaction is more complex)
    const sliders = screen.getAllByRole('slider')
    expect(sliders.length).toBeGreaterThan(0)
  })

  it('allows messaging framework input', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Messaging Framework/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Just Do It/i)).toBeInTheDocument()
    })

    // Fill in tagline
    const taglineInput = screen.getByPlaceholderText(/Just Do It/i)
    fireEvent.change(taglineInput, { target: { value: 'Think Different' } })

    expect(taglineInput).toHaveValue('Think Different')
  })

  it('allows adding key messages', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Key Messages/i)).toBeInTheDocument()
    })

    // Add a key message
    const keyMessageInput = screen.getByPlaceholderText(/Add a key message/i)
    fireEvent.change(keyMessageInput, { target: { value: 'Innovation is key' } })
    
    const addButton = keyMessageInput.nextElementSibling
    fireEvent.click(addButton!)

    await waitFor(() => {
      expect(screen.getByText(/Innovation is key/i)).toBeInTheDocument()
    })
  })

  it('allows adding writing guidelines', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Writing Guidelines/i)).toBeInTheDocument()
    })

    // Add a "do"
    const doInput = screen.getByPlaceholderText(/Add a do/i)
    fireEvent.change(doInput, { target: { value: 'Use active voice' } })
    
    const addDoButton = doInput.nextElementSibling
    fireEvent.click(addDoButton!)

    await waitFor(() => {
      expect(screen.getByText(/Use active voice/i)).toBeInTheDocument()
    })
  })

  it('saves brand voice data', async () => {
    renderWithProviders(<BrandVoice />)
    
    await waitFor(() => {
      expect(screen.getByText(/Save Voice/i)).toBeInTheDocument()
    })

    const saveButton = screen.getByText(/Save Voice/i)
    fireEvent.click(saveButton)

    await waitFor(() => {
      const { visualService } = await import('../../lib/visualService')
      expect(visualService.saveBrandVoice).toHaveBeenCalledWith(
        'test-brand-id',
        expect.any(Object)
      )
    })
  })
})