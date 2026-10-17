import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  THEME_STORAGE_KEY,
  resolveAppliedTheme,
  resolveThemePreference,
  themeDocument,
} from "./theme.mjs";

const indexHtml = join(dirname(fileURLToPath(import.meta.url)), "../../index.html");

function bootScript() {
  const html = readFileSync(indexHtml, "utf8");
  const match = html.match(/<script id="theme-boot">([\s\S]*?)<\/script>/);
  assert.ok(match, "index.html is missing the theme-boot script");
  return match[1];
}

function runBoot(saved, prefersDark) {
  const classes = new Set();
  const root = {
    classList: {
      toggle(name, force) {
        if (force) classes.add(name);
        else classes.delete(name);
      },
    },
    style: {},
  };
  const meta = {
    setAttribute(name, value) {
      this[name] = value;
    },
  };
  const fn = new Function(
    "window",
    "document",
    "localStorage",
    bootScript()
  );

  fn(
    { matchMedia: () => ({ matches: prefersDark }) },
    {
      documentElement: root,
      querySelector: () => meta,
    },
    { getItem: (key) => (key === THEME_STORAGE_KEY ? saved : null) }
  );

  return {
    dark: classes.has("dark"),
    colorScheme: root.style.colorScheme,
    themeColor: meta.content,
  };
}

test("defaults to the system preference when nothing valid is saved", () => {
  assert.equal(resolveThemePreference(null), "system");
  assert.equal(resolveThemePreference(undefined), "system");
  assert.equal(resolveThemePreference(""), "system");
  assert.equal(resolveThemePreference("nope"), "system");
});

test("keeps a saved system, light, or dark preference", () => {
  assert.equal(resolveThemePreference("system"), "system");
  assert.equal(resolveThemePreference("light"), "light");
  assert.equal(resolveThemePreference("dark"), "dark");
});

test("follows the system color scheme only while the preference is system", () => {
  assert.equal(resolveAppliedTheme("system", true), "dark");
  assert.equal(resolveAppliedTheme("system", false), "light");
  assert.equal(resolveAppliedTheme("light", true), "light");
  assert.equal(resolveAppliedTheme("dark", false), "dark");
});

test("maps the applied theme to the document class, color scheme, and theme color", () => {
  assert.deepEqual(themeDocument("light"), {
    darkClass: false,
    colorScheme: "light",
    themeColor: "#f8fafc",
  });
  assert.deepEqual(themeDocument("dark"), {
    darkClass: true,
    colorScheme: "dark",
    themeColor: "#0b1220",
  });
});

test("the boot script matches the saved preference and the system scheme", () => {
  const cases = [
    [null, true],
    [null, false],
    ["system", true],
    ["system", false],
    ["light", true],
    ["dark", false],
    ["nope", true],
  ];

  for (const [saved, prefersDark] of cases) {
    const applied = resolveAppliedTheme(
      resolveThemePreference(saved),
      prefersDark
    );
    const expected = themeDocument(applied);
    const booted = runBoot(saved, prefersDark);

    assert.equal(booted.dark, expected.darkClass, `${saved} / dark=${prefersDark}`);
    assert.equal(booted.colorScheme, expected.colorScheme);
    assert.equal(booted.themeColor, expected.themeColor);
  }
});
