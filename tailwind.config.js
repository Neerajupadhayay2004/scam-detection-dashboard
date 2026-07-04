/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        cyber: {
          dark: '#0a0e1a',
          darker: '#060812',
          light: '#1a1f2e',
          lighter: '#252b3d',
          accent: '#00d4ff',
          glow: '#00ffff',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          critical: '#dc2626',
          muted: '#64748b',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px theme("colors.cyber.accent"), 0 0 10px theme("colors.cyber.accent")' },
          '100%': { boxShadow: '0 0 10px theme("colors.cyber.accent"), 0 0 20px theme("colors.cyber.accent"), 0 0 30px theme("colors.cyber.accent")' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 20px rgba(0, 212, 255, 0.4)',
        'glow-danger': '0 0 10px rgba(239, 68, 68, 0.3)',
        'glow-warning': '0 0 10px rgba(245, 158, 11, 0.3)',
        'glow-success': '0 0 10px rgba(16, 185, 129, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.1)',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(transparent 0%, rgba(0, 212, 255, 0.03) 50%, transparent 100%)',
        'scan-line': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.03) 2px, rgba(0, 212, 255, 0.03) 4px)',
      },
    },
  },
  plugins: [],
};
