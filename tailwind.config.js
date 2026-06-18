/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2f7d6b',
        'accent': '#d9703f',
        'light': '#f8fafc',
        'dark': '#151515',
        'muted': '#626a73',
        'line': '#d8ded8',
        'surface': '#ffffff',
        'background': '#f5f2ec',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Cascadia Code', 'SFMono-Regular', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
