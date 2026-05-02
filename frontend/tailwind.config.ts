import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0d12',
          subtle: '#11141b',
          panel: '#161a23',
        },
        border: {
          DEFAULT: '#222835',
          subtle: '#1a1f2a',
        },
        text: {
          DEFAULT: '#e6e8ee',
          muted: '#8b93a7',
          subtle: '#5b6478',
        },
        brand: {
          DEFAULT: '#7c5cff',
          hover: '#8d70ff',
          soft: '#7c5cff20',
        },
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
