/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#08090D',
        surface: '#12141B',
        edge: 'rgba(255,255,255,0.08)',
        mist: '#8B8F9C',
        fog: '#E8E9EE',
        cyan: '#4CE7D8',
        violet: '#8B7CF6',
        danger: '#F1667A',
      },
      boxShadow: {
        elevate: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
        'elevate-hover': '0 1px 0 0 rgba(255,255,255,0.1) inset, 0 30px 60px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08), 0 0 40px -10px rgba(76,231,216,0.15)',
        glow: '0 0 30px -6px rgba(76,231,216,0.5), 0 0 60px -20px rgba(139,124,246,0.4)',
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #4CE7D8 0%, #8B7CF6 100%)',
      },
    },
  },
  plugins: [],
}
