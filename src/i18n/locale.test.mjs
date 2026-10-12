import assert from "node:assert/strict";
import test from "node:test";
import { mailtoHref, resolveLocale } from "./locale.mjs";

test("uses a saved locale when it is supported", () => {
  assert.equal(resolveLocale("tr", "en-US"), "tr");
  assert.equal(resolveLocale("en", "tr-TR"), "en");
});

test("uses Turkish when the browser language is tr and nothing is saved", () => {
  assert.equal(resolveLocale(null, "tr"), "tr");
  assert.equal(resolveLocale(null, "tr-TR"), "tr");
  assert.equal(resolveLocale("", "tr-tr"), "tr");
});

test("defaults to English for other browser languages", () => {
  assert.equal(resolveLocale(null, "en-US"), "en");
  assert.equal(resolveLocale(null, "de-DE"), "en");
  assert.equal(resolveLocale(null, undefined), "en");
});

test("ignores an unsupported saved locale", () => {
  assert.equal(resolveLocale("fr", "tr-TR"), "tr");
  assert.equal(resolveLocale("fr", "en-US"), "en");
});

test("builds an encoded mailto href with a subject", () => {
  assert.equal(
    mailtoHref("yavuzserifoglu@gmail.com", "Role inquiry — Yavuz Serifoglu"),
    "mailto:yavuzserifoglu@gmail.com?subject=Role%20inquiry%20%E2%80%94%20Yavuz%20Serifoglu"
  );
});
