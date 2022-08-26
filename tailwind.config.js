/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#828c6d',
        'light-text': '#d2d8d9',
        'dark-text': '#ff49db',
        'background': '#d2d8d9'
      },
      fontFamily:{
        sans: ['Cascadia Code', 'sans-serif']
      }
    },
  },
  plugins: [],
}
