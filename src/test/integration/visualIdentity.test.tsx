import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { VisualIdentity } from '../../pages/visual/VisualIdentity'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/brand/:brandId/visual" element={component} />
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
  }
}))

vi.mock('../../lib/visualService', () => ({
  visualService: {
    getVisualAssets: vi.fn().mockResolvedValue([]),
    saveVisualAsset: vi.fn().mockResolvedValue({}),
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

describe('Visual Identity Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState({}, '', '/brand/test-brand-id/visual')
  })

  it('loads visual identity page successfully', async () => {
    renderWithProviders(<VisualIdentity />)
    
    await waitFor(() => {
      expect(screen.getByText(/Visual Identity/i)).toBeInTheDocument()
      expect(screen.getByText(/Test Brand/i)).toBeInTheDocument()
    })
  })

  it('displays all visual identity tabs', async () => {
    renderWithProviders(<VisualIdentity />)
    
    await waitFor(() => {
      expect(screen.getByText(/Logo Style/i)).toBeInTheDocument()
      expect(screen.getByText(/Colors/i)).toBeInTheDocument()
      expect(screen.getByText(/Typography/i)).toBeInTheDocument()
    })
  })

  it('allows logo style selection', async () => {
    renderWithProviders(<VisualIdentity />)
    
    await waitFor(() => {
      expect(screen.getByText(/Wordmark/i)).toBeInTheDocument()
      expect(screen.getByText(/Lettermark/i)).toBeInTheDocument()
    })

    // Click on wordmark style
    const wordmarkOption = screen.getByText(/Wordmark/i).closest('div')
    fireEvent.click(wordmarkOption!)

    await waitFor(() => {
      const { visualService } = await import('../../lib/visualService')
      expect(visualService.saveVisualAsset).toHaveBeenCalledWith(
        'test-brand-id',
        'logo',
        expect.objectContaining({
          styleId: 'wordmark'
        })
      )
    })
  })

  it('allows color palette selection', async () => {
    renderWithProviders(<VisualIdentity />)
    
    // Switch to colors tab
    const colorsTab = screen.getByText(/Colors/i)
    fireEvent.click(colorsTab)

    await waitFor(() => {
      expect(screen.getByText(/Color Palette/i)).toBeInTheDocument()
      expect(screen.getByText(/Modern Blue/i)).toBeInTheDocument()
    })

    // Select a color palette
    const modernBlueOption = screen.getByText(/Modern Blue/i).closest('div')
    fireEvent.click(modernBlueOption!)

    await waitFor(() => {
      const { visualService } = await import('../../lib/visualService')
      expect(visualService.saveVisualAsset).toHaveBeenCalledWith(
        'test-brand-id',
        'color_palette',
        expect.objectContaining({
          paletteId: 'modern-blue'
        })
      )
    })
  })

  it('allows typography selection', async () => {
    renderWithProviders(<VisualIdentity />)
    
    // Switch to typography tab
    const typographyTab = screen.getByText(/Typography/i)
    fireEvent.click(typographyTab)

    await waitFor(() => {
      expect(screen.getByText(/Choose fonts/i)).toBeInTheDocument()
      expect(screen.getByText(/Modern Sans/i)).toBeInTheDocument()
    })

    // Select a typography option
    const modernSansOption = screen.getByText(/Modern Sans/i).closest('div')
    fireEvent.click(modernSansOption!)

    await waitFor(() => {
      const { visualService } = await import('../../lib/visualService')
      expect(visualService.saveVisualAsset).toHaveBeenCalledWith(
        'test-brand-id',
        'typography',
        expect.objectContaining({
          typographyId: 'modern-sans'
        })
      )
    })
  })

  it('handles custom color changes', async () => {
    renderWithProviders(<VisualIdentity />)
    
    // Switch to colors tab
    const colorsTab = screen.getByText(/Colors/i)
    fireEvent.click(colorsTab)

    await waitFor(() => {
      expect(screen.getByText(/Custom Colors/i)).toBeInTheDocument()
    })

    // Change primary color
    const primaryColorInput = screen.getByDisplayValue('#2563EB')
    fireEvent.change(primaryColorInput, { target: { value: '#FF0000' } })

    await waitFor(() => {
      const { visualService } = await import('../../lib/visualService')
      expect(visualService.saveVisualAsset).toHaveBeenCalledWith(
        'test-brand-id',
        'color_palette',
        expect.objectContaining({
          customColors: expect.objectContaining({
            primary: '#FF0000'
          })
        })
      )
    })
  })
})