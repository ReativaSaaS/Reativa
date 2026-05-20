/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: '#06060a',
        surface: '#0c0c14',
        elevated: '#12121e',
        'accent-violet': '#8b5cf6',
        'accent-cyan': '#06b6d4',
        'accent-light': '#a78bfa',
        'accent-neon': '#b47aff',
        // Dashboard tokens
        'dash-bg': '#06060f',
        'dash-surface': '#0d0d1a',
        'dash-card': '#111122',
        'dash-card-hover': '#161630',
        'dash-border': 'rgba(255,255,255,0.06)',
        'dash-border-mid': 'rgba(255,255,255,0.12)',
        'dash-border-focus': 'rgba(139,92,246,0.5)',
        'dash-text': '#f0f0f5',
        'dash-text-muted': 'rgba(240,240,245,0.5)',
        'dash-text-subtle': 'rgba(240,240,245,0.25)',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
