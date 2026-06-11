/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0c', // Pure dark background
          card: '#121216',    // Glass card base
          lighter: '#1a1a22', // Hover border highlights
          text: '#f4f4f7'     // Off-white readable text
        },
        brand: {
          primary: '#6366f1',   // Electric Indigo
          secondary: '#3b82f6', // Cyber Blue
          accent: '#c084fc',    // Neon Purple
          gold: '#e2b857'       // Subtle Premium Gold
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0a0a0c 0%, #121216 100%)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)'
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px'
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
