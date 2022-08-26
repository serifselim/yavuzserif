// Set browser language to the application before start
export default function () {
    const dataLang = localStorage.getItem('data-lang')
    return dataLang ? dataLang : 'en-EN';
}
  
  