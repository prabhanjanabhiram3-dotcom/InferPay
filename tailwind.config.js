/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070b15',
          900: '#0b1120',
          850: '#0f1626',
          800: '#141d33',
          700: '#1c2742',
          600: '#283355',
          500: '#3a4668',
          400: '#5b6788',
          300: '#8590b0',
          200: '#b4bdd6',
          100: '#d8deee',
          50: '#eef1f8',
        },
        brand: {
          50: '#eafaff',
          100: '#cdf3ff',
          200: '#a3e8ff',
          300: '#5dd8ff',
          400: '#1cc4f0',
          500: '#06a3d4',
          600: '#0786b4',
          700: '#0c6c92',
          800: '#115876',
          900: '#134962',
        },
        accent: {
          400: '#34e2c0',
          500: '#14c9a3',
          600: '#0aa888',
        },
        success: '#16c784',
        warning: '#f0a040',
        error: '#ea4d4d',
      },
      boxShadow: {
        'glow-brand': '0 0 0 1px rgba(28,196,240,0.18), 0 8px 30px -8px rgba(28,196,240,0.35)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 30px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
