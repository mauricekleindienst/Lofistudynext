/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css', // Include all CSS files in the styles directory
  ],
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['Comfortaa', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      // scrollbar: ['rounded'] // Remove this line
    },
  },
  plugins: [
    // require('tailwind-scrollbar')({ nocompatible: true }), // Remove this line
  ],
}