import assert from "node:assert/strict";
import test from "node:test";
import { BEST_KEY, loadBest, saveBest } from "./best.mjs";

const store = (value) => ({
  data: value === undefined ? {} : { [BEST_KEY]: value },
  getItem(key) {
    return key in this.data ? this.data[key] : null;
  },
  setItem(key, v) {
    this.data[key] = v;
  },
});

test("a missing or empty value is 0", () => {
  assert.equal(loadBest(store()), 0);
  assert.equal(loadBest(store("")), 0);
  assert.equal(loadBest(undefined), 0);
});

test("a stored whole number is read back", () => {
  assert.equal(loadBest(store("120")), 120);
});

test("garbage, negative and fractional values are ignored", () => {
  assert.equal(loadBest(store("abc")), 0);
  assert.equal(loadBest(store("-5")), 0);
  assert.equal(loadBest(store("3.7")), 0);
  assert.equal(loadBest(store("Infinity")), 0);
});

test("a storage that throws never breaks the game", () => {
  const broken = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
  };
  assert.equal(loadBest(broken), 0);
  assert.equal(saveBest(broken, 50), false);
  assert.equal(saveBest(undefined, 50), false);
});

test("saving writes a whole number", () => {
  const s = store();
  assert.equal(saveBest(s, 99.9), true);
  assert.equal(s.data[BEST_KEY], "99");
});
