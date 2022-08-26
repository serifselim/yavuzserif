// Set theme settings before start application
export default function () {
  const dataTheme = localStorage.getItem('data-theme')

  if (dataTheme) {
    document.documentElement.className = 'dark'
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.className = 'dark'
    }
  }
}

