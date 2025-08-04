/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        // Futuristic Dark Palette
        void: '#000000',
        dark: {
          50: '#888888',
          100: '#777777',
          200: '#666666',
          300: '#555555',
          400: '#444444',
          500: '#333333',
          600: '#2A2A2A',
          700: '#222222',
          800: '#1A1A1A',
          900: '#111111',
          950: '#0A0A0A',
        },
        light: '#FFFFFF',
        
        // Neon AI Colors
        'neon-green': {
          50: '#ECFFF6',
          100: '#D1FFE8',
          200: '#A7FFD1',
          300: '#6FFFB3',
          400: '#2FFF8F',
          DEFAULT: '#00FF88',
          500: '#00FF88',
          600: '#00E066',
          700: '#00B84D',
          800: '#009138',
          900: '#007529',
          950: '#004015',
        },
        'neon-cyan': {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          DEFAULT: '#00D4FF',
          500: '#00D4FF',
          600: '#00B8E6',
          700: '#0093BA',
          800: '#007A9A',
          900: '#006580',
          950: '#004155',
        },
        'neon-magenta': {
          50: '#FFF0F8',
          100: '#FFE3F1',
          200: '#FFC6E3',
          300: '#FF9ACB',
          400: '#FF5DA6',
          DEFAULT: '#FF0080',
          500: '#FF0080',
          600: '#E6006B',
          700: '#C20055',
          800: '#A10047',
          900: '#85003D',
          950: '#520020',
        },
        'neon-yellow': {
          50: '#FFFEF0',
          100: '#FFFCDB',
          200: '#FFF8B8',
          300: '#FFF085',
          400: '#FFE651',
          DEFAULT: '#FFFF00',
          500: '#FFFF00',
          600: '#E6E600',
          700: '#CCCC00',
          800: '#A3A300',
          900: '#858500',
          950: '#4D4D00',
        },
        
        // Electric colors (keeping for compatibility)
        'electric-blue': {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          DEFAULT: '#0066FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#0043A3',
          800: '#003580',
          900: '#002966',
          950: '#001A4D',
        },
        'electric-purple': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          DEFAULT: '#8B5CF6',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'cyber-hero': ['clamp(3rem, 8vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'cyber-display': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'cyber-headline': ['clamp(2rem, 4vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'cyber-subheadline': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-lg': '0 0 40px rgba(0, 255, 136, 0.2)',
        'neon-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-magenta': '0 0 20px rgba(255, 0, 128, 0.3)',
        'cyber': '0 8px 32px rgba(0, 0, 0, 0.8)',
        'grid': 'inset 0 0 0 1px rgba(51, 51, 51, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'grid-pulse': 'gridPulse 4s ease-in-out infinite',
        'data-flow': 'dataFlow 2s ease-in-out infinite',
        'neon-flicker': 'neonFlicker 2s ease-in-out infinite',
        'holographic': 'holographicScan 3s linear infinite',
        'ai-pulse': 'aiPulse 2s ease-in-out infinite',
      },
      keyframes: {
        gridPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        dataFlow: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        neonFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        holographicScan: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        },
        aiPulse: {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(0, 255, 136, 0.4)'
          },
          '50%': { 
            opacity: '0.9', 
            transform: 'scale(1.02)',
            boxShadow: '0 0 0 10px rgba(0, 255, 136, 0)'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-ai': 'linear-gradient(135deg, #00FF88 0%, #00D4FF 50%, #FF0080 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0A0A 0%, #111111 100%)',
        'gradient-grid': 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 136, 0.1) 50%, transparent 100%)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.grid-lines': {
          'background-image': 'linear-gradient(rgba(51, 51, 51, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 51, 51, 0.2) 1px, transparent 1px)',
          'background-size': '24px 24px',
        },
      })
    }
  ],
};