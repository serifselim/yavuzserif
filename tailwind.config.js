/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#828c6d',
        'light': '#d2d8d9',
        'dark': '#1F2426',
        'background': '#d2d8d9',
      },
      fontFamily: {
        sans: ['Cascadia Code', 'sans-serif']
      }
    },
  },
  plugins: [],
}
