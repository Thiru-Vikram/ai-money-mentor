/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep-finance base palette
        ink: {
          950: '#050810',
          900: '#0a0f1a',
          800: '#111827',
          750: '#151e2d',
          700: '#1a2235',
          600: '#1e2a40',
          500: '#253047',
        },
        // Trust accent - Electric blue
        blue: {
          trust: '#3b82f6',
          soft: '#60a5fa',
          dim: '#1d4ed8',
          glow: 'rgba(59,130,246,0.15)',
        },
        // Data accent - Cyan (AI, chart lines)
        cyan: {
          data: '#06b6d4',
          soft: '#22d3ee',
          dim: '#0e7490',
          glow: 'rgba(6,182,212,0.12)',
        },
        // Positive signal - Amber/gold (gains, goals met)
        amber: {
          gain: '#f59e0b',
          soft: '#fbbf24',
          dim: '#92400e',
          glow: 'rgba(245,158,11,0.15)',
        },
        // Growth - Emerald (portfolio returns)
        emerald: {
          growth: '#10b981',
          soft: '#34d399',
          dim: '#065f46',
          glow: 'rgba(16,185,129,0.12)',
        },
        // Warning/risk - Soft red
        red: {
          risk: '#ef4444',
          soft: '#f87171',
          dim: '#7f1d1d',
          glow: 'rgba(239,68,68,0.12)',
        },
        // Neutral data - Slate
        slate: {
          label: '#94a3b8',
          muted: '#64748b',
          border: 'rgba(148,163,184,0.12)',
          glass: 'rgba(255,255,255,0.03)',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Sora', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'metric': ['2.25rem', { lineHeight: '1', fontWeight: '400', letterSpacing: '-0.02em' }],
        'metric-lg': ['3rem', { lineHeight: '1', fontWeight: '400', letterSpacing: '-0.03em' }],
        'metric-xl': ['3.75rem', { lineHeight: '1', fontWeight: '400', letterSpacing: '-0.04em' }],
      },
      backdropBlur: {
        xs: '2px',
        card: '12px',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'ring-fill': 'ringFill 1.2s ease-out forwards',
        'count-up': 'countUp 0.8s ease-out forwards',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
