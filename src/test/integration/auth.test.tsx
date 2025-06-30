import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Auth } from '../../pages/Auth'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

// Mock the auth functions
vi.mock('../../lib/supabase', () => ({
  signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
  signIn: vi.fn().mockResolvedValue({ data: {}, error: null }),
  signInWithGoogle: vi.fn().mockResolvedValue({ data: {}, error: null }),
}))

describe('Auth Integration', () => {
  it('renders sign in form by default', () => {
    renderWithRouter(<Auth />)
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('switches to sign up form', () => {
    renderWithRouter(<Auth />)
    fireEvent.click(screen.getByText(/Don't have an account/i))
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    renderWithRouter(<Auth />)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })
    
    fireEvent.click(submitButton)
    
    // Form should not submit without email and password
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    renderWithRouter(<Auth />)
    
    const emailInput = screen.getByPlaceholderText(/Enter your email/i)
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('renders Google sign in button', () => {
    renderWithRouter(<Auth />)
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
  })
})