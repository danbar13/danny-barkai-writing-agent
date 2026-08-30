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
          50: '#f7faea',
          100: '#edf4ce',
          200: '#dceca0',
          300: '#c5e069',
          400: '#aad039',
          500: '#8db717',
          600: '#73970e', // Primary DANBAR logo green
          700: '#587310',
          800: '#475b13',
          900: '#3c4d15',
          950: '#1f2b05',
        },
        luxury: {
          bg: '#080d17',
          surface: '#0d1524',
          card: '#111a2e',
          cardHover: '#16223b',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(115, 151, 14, 0.35)',
        },
        slate: {
          850: '#111a2e',
          900: '#0c1322',
          950: '#080d17',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(115, 151, 14, 0.3)',
        'glow-md': '0 0 30px -3px rgba(115, 151, 14, 0.45)',
        'luxury-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['"Assistant"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Heebo"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Frank Ruhl Libre"', '"Assistant"', 'serif'],
      },
    },
  },
  plugins: [],
}