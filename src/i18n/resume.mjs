export function orderedResumeLocales(currentLocale) {
  const current = currentLocale === "tr" ? "tr" : "en";
  const other = current === "tr" ? "en" : "tr";
  return [current, other];
}

export function resumeFilename(locale) {
  return locale === "tr" ? "resume-tr.pdf" : "resume-en.pdf";
}

export function resumeDownloadName(locale) {
  return locale === "tr"
    ? "Yavuz-Serifoglu-CV-TR.pdf"
    : "Yavuz-Serifoglu-Resume-EN.pdf";
}
