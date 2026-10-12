import assert from "node:assert/strict";
import test from "node:test";
import { createAudio } from "./audio.mjs";

function fakeWindow() {
  const log = { contexts: 0, oscillators: 0, sources: 0 };
  class Param {
    setValueAtTime() {}
    exponentialRampToValueAtTime() {}
  }
  class FakeContext {
    constructor() {
      log.contexts++;
      this.currentTime = 0;
      this.state = "running";
      this.destination = {};
      this.sampleRate = 8000;
    }
    resume() {}
    createOscillator() {
      log.oscillators++;
      return { type: "", frequency: new Param(), connect() {}, start() {}, stop() {} };
    }
    createGain() {
      return { gain: new Param(), connect() {} };
    }
    createBuffer(channels, length) {
      return { getChannelData: () => new Float32Array(length) };
    }
    createBufferSource() {
      log.sources++;
      return { buffer: null, connect() {}, start() {} };
    }
  }
  return { win: { AudioContext: FakeContext }, log };
}

test("without Web Audio the module reports unsupported and stays silent", () => {
  const audio = createAudio({});
  assert.equal(audio.supported, false);
  assert.equal(audio.setEnabled(true), false);
  assert.doesNotThrow(() => {
    audio.jump();
    audio.pickup();
    audio.hit();
  });
});

test("it is muted by default and creates no audio context", () => {
  const { win, log } = fakeWindow();
  const audio = createAudio(win);
  audio.jump();
  audio.hit();
  assert.equal(audio.enabled, false);
  assert.equal(log.contexts, 0);
});

test("enabling creates one context and sounds play", () => {
  const { win, log } = fakeWindow();
  const audio = createAudio(win);
  assert.equal(audio.setEnabled(true), true);
  assert.equal(log.contexts, 1);
  audio.jump();
  assert.equal(log.oscillators, 1);
  audio.pickup();
  assert.equal(log.oscillators, 3);
  audio.hit();
  assert.equal(log.oscillators, 4);
  assert.equal(log.sources, 1);
  assert.equal(log.contexts, 1);
});

test("muting again stops all sounds", () => {
  const { win, log } = fakeWindow();
  const audio = createAudio(win);
  audio.setEnabled(true);
  audio.setEnabled(false);
  audio.jump();
  audio.pickup();
  audio.hit();
  assert.equal(log.oscillators, 0);
});
