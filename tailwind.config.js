/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // Removed the catch-all pattern that was scanning node_modules
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#800000',
          light: '#A00000',
          dark: '#600000',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          cream: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
