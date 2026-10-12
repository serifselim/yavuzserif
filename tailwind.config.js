/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'accent': '#ea580c',
        'light': '#f8fafc',
        'dark': '#0f172a',
        'muted': '#64748b',
        'line': '#e2e8f0',
        'surface': '#ffffff',
        'background': '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Cascadia Code', 'SFMono-Regular', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
