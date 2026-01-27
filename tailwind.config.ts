/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
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
        maroon: {
          DEFAULT: '#800000',
          light: '#A00000',
          dark: '#660000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  important: true, // Force all Tailwind classes to use !important
}


