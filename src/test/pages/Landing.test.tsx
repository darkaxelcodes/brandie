import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Landing } from '../../pages/Landing'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Landing Page', () => {
  it('renders the main heading', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText(/Build every brand/i)).toBeInTheDocument()
    expect(screen.getByText(/overnight/i)).toBeInTheDocument()
  })

  it('renders the description', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText(/AI-powered branding platform/i)).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText(/Get Started Free/i)).toBeInTheDocument()
    expect(screen.getByText(/Watch Demo/i)).toBeInTheDocument()
  })

  it('renders feature sections', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText(/Brand Strategy/i)).toBeInTheDocument()
    expect(screen.getByText(/Visual Identity/i)).toBeInTheDocument()
    expect(screen.getByText(/Brand Voice/i)).toBeInTheDocument()
    expect(screen.getByText(/Brand Guidelines/i)).toBeInTheDocument()
  })

  it('renders the final CTA section', () => {
    renderWithRouter(<Landing />)
    expect(screen.getByText(/Ready to build your brand/i)).toBeInTheDocument()
    expect(screen.getByText(/Start Building Today/i)).toBeInTheDocument()
  })
})