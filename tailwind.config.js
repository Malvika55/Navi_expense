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
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6339f5', // Navi's primary vibrant purple
          700: '#4f26d9',
          800: '#3b1c9e',
          900: '#261266',
          950: '#170b3d',
        },
        navi: {
          green: '#00b368',
          'green-bg': '#e8f8f0',
          'green-dark': '#008a4f',
          red: '#ef4444',
          'red-bg': '#fee2e2',
          purple: '#6339f5',
          'purple-light': '#f3f0ff',
          'purple-subtle': '#ede9fe',
          dark: '#12111a',
          'dark-card': '#1a1825',
          'dark-border': '#2a263d',
          gray: {
            50: '#fafafc',
            100: '#f4f4f7',
            200: '#e8e8ed',
            300: '#d5d5df',
            400: '#a1a1b3',
            500: '#717184',
            600: '#525264',
            700: '#3c3c4a',
            800: '#272631',
            900: '#171620'
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'navi-card': '0 2px 8px -2px rgba(99, 57, 245, 0.06), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
        'navi-float': '0 10px 30px -5px rgba(99, 57, 245, 0.2)',
        'navi-lg': '0 12px 32px -8px rgba(18, 17, 26, 0.12)',
        'navi-glow': '0 0 25px -5px rgba(99, 57, 245, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

