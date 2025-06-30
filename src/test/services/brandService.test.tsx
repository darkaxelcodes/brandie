import { describe, it, expect, vi, beforeEach } from 'vitest'
import { brandService } from '../../lib/brandService'

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '1', name: 'Test Brand', created_at: new Date().toISOString() },
            error: null
          })
        })
      }),
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [
            { id: '1', name: 'Brand 1', created_at: new Date().toISOString() },
            { id: '2', name: 'Brand 2', created_at: new Date().toISOString() }
          ],
          error: null
        }),
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '1', name: 'Test Brand', created_at: new Date().toISOString() },
            error: null
          })
        })
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: '1', name: 'Updated Brand', created_at: new Date().toISOString() },
              error: null
            })
          })
        })
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null })
      })
    })
  }
}))

describe('Brand Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createBrand', () => {
    it('creates a new brand successfully', async () => {
      const result = await brandService.createBrand('Test Brand')
      
      expect(result).toEqual({
        id: '1',
        name: 'Test Brand',
        created_at: expect.any(String)
      })
    })
  })

  describe('getUserBrands', () => {
    it('retrieves user brands successfully', async () => {
      const result = await brandService.getUserBrands()
      
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: '1',
        name: 'Brand 1',
        created_at: expect.any(String)
      })
    })
  })

  describe('getBrand', () => {
    it('retrieves a specific brand by ID', async () => {
      const result = await brandService.getBrand('1')
      
      expect(result).toEqual({
        id: '1',
        name: 'Test Brand',
        created_at: expect.any(String)
      })
    })
  })

  describe('updateBrand', () => {
    it('updates a brand successfully', async () => {
      const result = await brandService.updateBrand('1', { name: 'Updated Brand' })
      
      expect(result).toEqual({
        id: '1',
        name: 'Updated Brand',
        created_at: expect.any(String)
      })
    })
  })

  describe('deleteBrand', () => {
    it('deletes a brand successfully', async () => {
      await expect(brandService.deleteBrand('1')).resolves.toBeUndefined()
    })
  })
})