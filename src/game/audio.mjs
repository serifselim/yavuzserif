export function createAudio(win = typeof window === "undefined" ? undefined : window) {
  const Ctx = win ? win.AudioContext || win.webkitAudioContext : undefined;
  let ctx = null;
  let enabled = false;

  const ensure = () => {
    if (!ctx) ctx = new Ctx();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const tone = (type, from, to, duration, volume, delay = 0) => {
    const c = ensure();
    const start = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(start);
    osc.stop(start + duration);
  };

  const noise = (duration, volume) => {
    const c = ensure();
    const length = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const source = c.createBufferSource();
    const gain = c.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    source.connect(gain);
    gain.connect(c.destination);
    source.start();
  };

  const play = (fn) => {
    if (enabled && Ctx) fn();
  };

  return {
    supported: Boolean(Ctx),
    get enabled() {
      return enabled;
    },
    setEnabled(value) {
      enabled = Boolean(value) && Boolean(Ctx);
      if (enabled) ensure();
      return enabled;
    },
    jump: () => play(() => tone("square", 280, 620, 0.12, 0.04)),
    pickup: () =>
      play(() => {
        tone("triangle", 660, 660, 0.07, 0.05);
        tone("triangle", 990, 990, 0.09, 0.05, 0.07);
      }),
    hit: () =>
      play(() => {
        noise(0.22, 0.06);
        tone("square", 180, 45, 0.28, 0.05);
      }),
  };
}
