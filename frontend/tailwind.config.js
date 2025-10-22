/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff88',
        secondary: '#0088ff',
        accent: '#ff0088',
        dark: {
          100: '#0a0e27',
          200: '#141829',
          300: '#1e2235',
          400: '#9ca3af',
          500: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.5), 0 0 10px rgba(0, 255, 136, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.5)' },
        },
      },
      screens: {
        'xs': '320px',
        'sm': '768px',
        'md': '1024px',
        'lg': '1440px',
      },
    },
  },
  plugins: [],
}

