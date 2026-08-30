/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        danbar: {
          50: '#f4f7fa',
          100: '#e5ecf3',
          200: '#cbdbe8',
          300: '#a3c2d7',
          400: '#73a3c2',
          500: '#5186ab',
          600: '#3e6c90',
          700: '#335775',
          800: '#2d4a63',
          900: '#1b2a38',
          950: '#0f1721',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
