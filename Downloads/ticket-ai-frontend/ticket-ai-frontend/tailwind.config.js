/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#12141A',
        surface: '#1B1E27',
        surfaceHover: '#232733',
        border: '#2A2E3A',
        textPrimary: '#ECEDF1',
        textSecondary: '#8B90A0',
        amber: '#FF8A3D',
        teal: '#5EEAD4',
        danger: '#FF5470',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
