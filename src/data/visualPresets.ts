import { LogoStyle, ColorPalette, Typography } from '../types/visual'

export const logoStyles: LogoStyle[] = [
  {
    id: 'wordmark',
    name: 'Wordmark',
    description: 'Text-based logo using stylized company name',
    style: 'wordmark'
  },
  {
    id: 'lettermark',
    name: 'Lettermark',
    description: 'Monogram or initials-based logo',
    style: 'lettermark'
  },
  {
    id: 'pictorial',
    name: 'Pictorial Mark',
    description: 'Icon or graphic-based logo',
    style: 'pictorial'
  },
  {
    id: 'abstract',
    name: 'Abstract Mark',
    description: 'Abstract geometric form',
    style: 'abstract'
  },
  {
    id: 'combination',
    name: 'Combination Mark',
    description: 'Text and symbol combined',
    style: 'combination'
  },
  {
    id: 'mascot',
    name: 'Mascot',
    description: 'Character or mascot-based logo',
    style: 'mascot'
  }
]

export const colorPalettes: ColorPalette[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    primary: '#2563EB',
    secondary: '#1E40AF',
    accent: '#F59E0B',
    neutral: ['#F8FAFC', '#E2E8F0', '#64748B', '#1E293B'],
    description: 'Professional and trustworthy',
    wcagScore: 95
  },
  {
    id: 'vibrant-purple',
    name: 'Vibrant Purple',
    primary: '#7C3AED',
    secondary: '#5B21B6',
    accent: '#EC4899',
    neutral: ['#FAF7FF', '#E9D5FF', '#6B7280', '#111827'],
    description: 'Creative and innovative',
    wcagScore: 92
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    primary: '#EA580C',
    secondary: '#C2410C',
    accent: '#0EA5E9',
    neutral: ['#FFF7ED', '#FED7AA', '#78716C', '#1C1917'],
    description: 'Energetic and friendly',
    wcagScore: 88
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    primary: '#059669',
    secondary: '#047857',
    accent: '#F59E0B',
    neutral: ['#F0FDF4', '#BBF7D0', '#6B7280', '#111827'],
    description: 'Natural and sustainable',
    wcagScore: 94
  },
  {
    id: 'elegant-navy',
    name: 'Elegant Navy',
    primary: '#1E3A8A',
    secondary: '#1E40AF',
    accent: '#DC2626',
    neutral: ['#F8FAFC', '#CBD5E1', '#64748B', '#0F172A'],
    description: 'Sophisticated and reliable',
    wcagScore: 96
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#8B5CF6',
    neutral: ['#FFF7ED', '#FDBA74', '#78716C', '#1C1917'],
    description: 'Warm and approachable',
    wcagScore: 89
  }
]

export const typographyPairs: Typography[] = [
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    heading: {
      family: 'Inter',
      weights: [400, 600, 700],
      fallback: 'system-ui, sans-serif'
    },
    body: {
      family: 'Inter',
      weights: [400, 500],
      fallback: 'system-ui, sans-serif'
    },
    description: 'Clean and professional'
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    heading: {
      family: 'Playfair Display',
      weights: [400, 600, 700],
      fallback: 'serif'
    },
    body: {
      family: 'Source Sans Pro',
      weights: [400, 500],
      fallback: 'sans-serif'
    },
    description: 'Sophisticated and classic'
  },
  {
    id: 'tech-mono',
    name: 'Tech Mono',
    heading: {
      family: 'JetBrains Mono',
      weights: [400, 600, 700],
      fallback: 'monospace'
    },
    body: {
      family: 'Roboto',
      weights: [400, 500],
      fallback: 'sans-serif'
    },
    description: 'Technical and precise'
  },
  {
    id: 'friendly-rounded',
    name: 'Friendly Rounded',
    heading: {
      family: 'Nunito',
      weights: [400, 600, 700],
      fallback: 'sans-serif'
    },
    body: {
      family: 'Nunito',
      weights: [400, 500],
      fallback: 'sans-serif'
    },
    description: 'Approachable and warm'
  },
  {
    id: 'bold-display',
    name: 'Bold Display',
    heading: {
      family: 'Oswald',
      weights: [400, 600, 700],
      fallback: 'sans-serif'
    },
    body: {
      family: 'Open Sans',
      weights: [400, 500],
      fallback: 'sans-serif'
    },
    description: 'Strong and impactful'
  },
  {
    id: 'minimal-geometric',
    name: 'Minimal Geometric',
    heading: {
      family: 'Poppins',
      weights: [400, 600, 700],
      fallback: 'sans-serif'
    },
    body: {
      family: 'Poppins',
      weights: [400, 500],
      fallback: 'sans-serif'
    },
    description: 'Clean and geometric'
  }
]