import assert from "node:assert/strict";
import test from "node:test";
import {
  orderedResumeLocales,
  resumeDownloadName,
  resumeFilename,
} from "./resume.mjs";

test("orders the current locale first so both CV files stay reachable", () => {
  assert.deepEqual(orderedResumeLocales("tr"), ["tr", "en"]);
  assert.deepEqual(orderedResumeLocales("en"), ["en", "tr"]);
});

test("falls back to English when the locale is missing or unknown", () => {
  assert.deepEqual(orderedResumeLocales(undefined), ["en", "tr"]);
  assert.deepEqual(orderedResumeLocales("fr"), ["en", "tr"]);
});

test("maps each locale to its résumé filename", () => {
  assert.equal(resumeFilename("tr"), "resume-tr.pdf");
  assert.equal(resumeFilename("en"), "resume-en.pdf");
  assert.equal(resumeFilename("fr"), "resume-en.pdf");
});

test("gives downloaded files a language-tagged name", () => {
  assert.equal(resumeDownloadName("tr"), "Yavuz-Serifoglu-CV-TR.pdf");
  assert.equal(resumeDownloadName("en"), "Yavuz-Serifoglu-Resume-EN.pdf");
  assert.equal(resumeDownloadName("fr"), "Yavuz-Serifoglu-Resume-EN.pdf");
});
