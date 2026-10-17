<template>
  <section
    class="mx-auto w-full max-w-[520px] overflow-hidden rounded-lg border border-line bg-surface"
    :aria-label="$t('game.title')"
  >
    <header class="flex items-center gap-3 border-b border-line px-4 py-3">
      <img
        src="@/assets/images/avatar.jpg"
        alt=""
        width="32"
        height="32"
        class="h-8 w-8 rounded-md border border-line object-cover"
      />
      <div class="min-w-0 flex-1">
        <p class="truncate font-display text-sm font-bold text-dark">{{ site.name }}</p>
        <p class="truncate font-mono text-[11px] text-muted">{{ $t("hero.profileRole") }}</p>
      </div>
      <button
        v-if="audioSupported"
        type="button"
        class="rounded-md border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition hover:border-dark hover:text-dark"
        :class="soundOn ? 'border-primary text-primary-text' : 'text-muted'"
        :aria-pressed="soundOn"
        @click="toggleSound"
      >
        {{ soundOn ? $t("game.soundOn") : $t("game.soundOff") }}
      </button>
    </header>

    <div
      ref="stage"
      tabindex="0"
      class="relative select-none outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="hud.phase === 'running' ? 'touch-none' : 'touch-pan-y'"
    >
      <canvas
        ref="canvas"
        class="block w-full !rounded-none"
        role="img"
        :aria-label="$t('game.ariaLabel')"
        @pointerdown.prevent="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      />

      <div
        v-if="hud.phase === 'idle'"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
      >
        <p
          class="rounded-md border border-line bg-surface/95 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-dark shadow-sm"
        >
          {{ $t("game.idleHint") }}
        </p>
        <p v-if="reducedMotion" class="rounded-md bg-surface/90 px-3 py-1 text-xs text-muted">
          {{ $t("game.reducedMotionNote") }}
        </p>
      </div>

      <div
        v-else-if="hud.phase === 'over'"
        class="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
      >
        <div class="flex flex-col items-center gap-1 rounded-lg border border-line bg-surface/95 px-6 py-4 text-center shadow-sm">
          <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary-text">
            {{ $t("game.gameOver") }}
          </p>
          <p class="font-display text-4xl font-bold tabular-nums text-dark">{{ hud.score }}</p>
          <p class="text-sm font-semibold text-muted">{{ $t("game.titles." + hud.title) }}</p>
          <p class="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            {{ $t("game.retryHint") }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-end justify-between gap-4 border-t border-line px-4 py-3">
      <dl class="flex gap-6">
        <div>
          <dt class="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {{ $t("game.score") }}
          </dt>
          <dd class="font-display text-2xl font-bold tabular-nums text-dark">{{ hud.score }}</dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {{ $t("game.best") }}
          </dt>
          <dd class="font-display text-2xl font-bold tabular-nums text-dark">{{ Math.max(best, hud.score) }}</dd>
        </div>
      </dl>
      <p
        v-if="hud.multiplier > 1"
        class="rounded-md bg-primary px-2.5 py-1 font-mono text-xs font-bold text-white"
      >
        {{ $t("game.combo") }} x{{ hud.multiplier }}
      </p>
    </div>

    <ul class="flex flex-wrap gap-1.5 border-t border-line px-4 py-2.5" :aria-label="$t('game.techLabel')">
      <li
        v-for="tech in techLabels"
        :key="tech.id"
        class="rounded border px-2.5 py-0.5 font-mono text-[11px] font-medium transition"
        :class="
          hud.collected.includes(tech.id)
            ? 'border-primary bg-primary text-white'
            : 'border-line bg-well/50 text-muted'
        "
      >
        {{ tech.label }}
      </li>
    </ul>

    <p class="border-t border-line bg-well/30 px-4 py-2 font-mono text-[11px] text-muted">
      {{ $t("hero.profileLocation") }} · {{ $t("hero.profileFocus") }}
    </p>
  </section>
</template>

<script>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { site } from "@/constants";
import { createAudio } from "@/game/audio.mjs";
import { loadBest, saveBest } from "@/game/best.mjs";
import { draw } from "@/game/draw.mjs";
import { TECH, WORLD, createGame, jump, releaseJump, step, titleForScore } from "@/game/engine.mjs";

const TECH_LABELS = {
  vue: "Vue",
  react: "React",
  nestjs: "NestJS",
  postgres: "PostgreSQL",
  typescript: "TypeScript",
};
const SHAKE_MS = 180;

const getStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export default {
  name: "DevRunner",
  setup() {
    const stage = ref(null);
    const canvas = ref(null);
    const best = ref(0);
    const soundOn = ref(false);
    const reducedMotion = ref(false);
    const hud = reactive({
      phase: "idle",
      score: 0,
      multiplier: 1,
      collected: [],
      title: "junior",
    });

    const audio = createAudio();
    const game = createGame();
    let ctx = null;
    let rafId = 0;
    let lastTime = 0;
    let inView = true;
    let observer = null;
    let shakeUntil = 0;
    let hudKey = "";
    let downPhase = "idle";

    const syncHud = () => {
      const key = `${game.phase}|${game.score}|${game.combo.multiplier}|${game.collected.size}`;
      if (key === hudKey) return;
      hudKey = key;
      hud.phase = game.phase;
      hud.score = game.score;
      hud.multiplier = game.combo.multiplier;
      hud.collected = Array.from(game.collected);
      hud.title = titleForScore(game.score);
    };

    const render = (now) => {
      const shaking = !reducedMotion.value && now < shakeUntil;
      const amplitude = shaking ? 6 * ((shakeUntil - now) / SHAKE_MS) : 0;
      draw(ctx, game, now / 1000, {
        reducedMotion: reducedMotion.value,
        shakeX: Math.sin(now * 0.09) * amplitude,
        shakeY: Math.cos(now * 0.11) * amplitude,
      });
    };

    const onHit = (now) => {
      audio.hit();
      shakeUntil = now + SHAKE_MS;
      if (game.score > best.value) {
        best.value = game.score;
        saveBest(getStorage(), best.value);
      }
    };

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      const dt = lastTime ? (now - lastTime) / 1000 : 0;
      lastTime = now;
      const events = step(game, dt);
      for (const event of events) {
        if (event === "pickup") audio.pickup();
        else if (event === "hit") onHit(now);
      }
      render(now);
      syncHud();
    };

    // The loop only runs while the card is on screen and the tab is visible.
    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !rafId) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const press = () => {
      if (jump(game)) audio.jump();
      syncHud();
    };

    const isJumpKey = (e) => e.code === "Space" || e.code === "ArrowUp";
    const isInteractive = (el) =>
      Boolean(el) &&
      (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(el.tagName));

    // Only take the key when the game is focused, or while a run is in progress
    // on screen and nothing else (a field, a button, a link) has focus. Space
    // keeps scrolling the page everywhere else.
    const shouldHandle = (e) => {
      if (stage.value && stage.value.contains(e.target)) return true;
      if (isInteractive(e.target)) return false;
      return game.phase === "running" && inView;
    };

    const onKeyDown = (e) => {
      if (!isJumpKey(e) || e.metaKey || e.ctrlKey || e.altKey || !shouldHandle(e)) return;
      e.preventDefault();
      if (e.repeat) return;
      press();
    };
    const onKeyUp = (e) => {
      if (isJumpKey(e)) releaseJump(game);
    };

    // Touch: jumping while running reacts on pointerdown; starting or
    // restarting waits for pointerup so a scroll gesture does not start a run.
    const onPointerDown = (e) => {
      stage.value?.focus({ preventScroll: true });
      downPhase = game.phase;
      if (e.pointerType !== "touch" || game.phase === "running") press();
    };
    const onPointerUp = (e) => {
      if (e.pointerType === "touch" && downPhase !== "running") press();
      releaseJump(game);
    };
    const onPointerCancel = () => releaseJump(game);

    const toggleSound = () => {
      soundOn.value = audio.setEnabled(!audio.enabled);
    };

    onMounted(() => {
      const el = canvas.value;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = WORLD.width * dpr;
      el.height = WORLD.height * dpr;
      ctx = el.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      best.value = loadBest(getStorage());

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      document.addEventListener("visibilitychange", sync);
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            sync();
          },
          { threshold: 0.15 }
        );
        observer.observe(stage.value);
      }

      render(performance.now());
      sync();
    });

    onBeforeUnmount(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", sync);
      if (observer) observer.disconnect();
    });

    return {
      stage,
      canvas,
      hud,
      best,
      soundOn,
      reducedMotion,
      site,
      audioSupported: audio.supported,
      techLabels: TECH.map((id) => ({ id, label: TECH_LABELS[id] })),
      toggleSound,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
    };
  },
};
</script>

