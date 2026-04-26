import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Light: warm editorial cream
        // Dark: deep navy/blue with subtle blue-tinted ink
        bg: {
          DEFAULT: '#FAFAF7',
          dark: '#0A1426',
          'dark-elevated': '#0F1B30',
        },
        ink: {
          DEFAULT: '#111111',
          dark: '#E8EEF7',
        },
        muted: {
          DEFAULT: '#6B6B6B',
          dark: '#8FA3C0',
        },
        accent: {
          DEFAULT: '#1E40AF',
          dark: '#7AB0FF',
        },
        hairline: {
          DEFAULT: '#E5E5E0',
          dark: '#1B2940',
        },
        ok: {
          DEFAULT: '#15803D',
          dark: '#34D399',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '720px',
        grid: '1100px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
