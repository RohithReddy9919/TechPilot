/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          950: '#0d1f1f',
          900: '#1A2F2F',
          800: '#1e3838',
          700: '#24433a',
          600: '#2a5048',
          500: '#316058',
          400: '#3d7a70',
          300: '#5a9e94',
          200: '#8dc4bd',
          100: '#c6e3df',
          50: '#eaf4f3',
        },
        cream: {
          50: '#FAFAF7',
          100: '#F5F3EE',
          200: '#EDE9DF',
        },
        orange: {
          500: '#E8541A',
          400: '#ed6b35',
          600: '#c94616',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
