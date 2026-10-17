<template>
  <div
    ref="stage"
    class="relative mx-auto aspect-square w-full max-w-[440px] cursor-grab touch-none outline-none select-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing md:mx-0"
    tabindex="0"
    role="group"
    :aria-label="$t('about.modelLabel')"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeyDown"
  >
    <canvas ref="canvas" class="block h-full w-full" aria-hidden="true" />
  </div>
</template>

<script>
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import {
  frameCamera,
  orbitLayout,
  orbitOffset,
  stepYaw,
  yawFromDrag,
} from "./orbit.mjs";
import { SKILL_LOGOS, skillTexture } from "./skillMarks.mjs";

const MODEL_URL = "/assets/models/serifdog.fbx";
const MODEL_HEIGHT = 5;
const KEY_STEP = 48;

export default {
  name: "Model",
  data() {
    return {
      yaw: 0,
      dragging: false,
    };
  },
  mounted() {
    this.elapsed = 0;
    this.lastX = 0;
    this.logos = [];
    this.orbitRadius = 4;
    this.orbitHeight = 2.8;
    this.reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduced = this.reducedQuery.matches;
    this.onMotion = (event) => {
      this.reduced = event.matches;
    };
    this.reducedQuery.addEventListener("change", this.onMotion);
    this.tick = () => {
      this.raf = requestAnimationFrame(this.tick);
      this.frame();
    };
    this.setupScene();
    this.loadModel();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.$refs.stage);
    this.visible = true;
    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        this.syncLoop();
      },
      { threshold: 0.08 }
    );
    this.visibilityObserver.observe(this.$refs.stage);
    this.syncLoop();
  },
  beforeUnmount() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    this.reducedQuery?.removeEventListener("change", this.onMotion);
    this.scene?.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const materials = obj.material
        ? Array.isArray(obj.material)
          ? obj.material
          : [obj.material]
        : [];
      for (const material of materials) {
        material.map?.dispose();
        material.dispose();
      }
    });
    this.renderer?.dispose();
  },
  methods: {
    setupScene() {
      const canvas = this.$refs.canvas;
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.setClearColor(0xf8fafc, 1);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      this.placeCamera(MODEL_HEIGHT, 4.5);
      this.clock = new THREE.Clock();

      this.scene.add(new THREE.HemisphereLight(0xffffff, 0xc5d0de, 0.55));
      const key = new THREE.DirectionalLight(0xfff6ea, 0.85);
      key.position.set(8, 16, 7);
      this.scene.add(key);
      const fill = new THREE.DirectionalLight(0xd7e6ff, 0.4);
      fill.position.set(-8, 8, -3);
      this.scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffffff, 0.45);
      rim.position.set(-3, 11, -10);
      this.scene.add(rim);

      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1, 64),
        new THREE.MeshBasicMaterial({
          map: this.contactShadow(),
          transparent: true,
          depthWrite: false,
        })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.01;
      shadow.scale.setScalar(3.4);
      this.scene.add(shadow);
      this.shadow = shadow;

      this.modelPivot = new THREE.Group();
      this.scene.add(this.modelPivot);
      this.resize();
    },
    contactShadow() {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const fade = ctx.createRadialGradient(size / 2, size / 2, size * 0.02, size / 2, size / 2, size * 0.5);
      fade.addColorStop(0, "rgba(15, 23, 42, 0.22)");
      fade.addColorStop(0.42, "rgba(15, 23, 42, 0.08)");
      fade.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, size, size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.encoding = THREE.sRGBEncoding;
      return texture;
    },
    placeCamera(height, orbitRadius) {
      const frame = frameCamera(height, orbitRadius);
      this.camera.fov = frame.fov;
      this.camera.position.set(frame.position.x, frame.position.y, frame.position.z);
      this.camera.lookAt(frame.lookAt.x, frame.lookAt.y, frame.lookAt.z);
      this.camera.updateProjectionMatrix();
    },
    loadModel() {
      const loader = new FBXLoader();
      loader.load(MODEL_URL, (object) => this.mountModel(object));
    },
    mountModel(object) {
      this.modelPivot.add(object);
      const raw = new THREE.Box3().setFromObject(object);
      const rawSize = raw.getSize(new THREE.Vector3());
      if (rawSize.y > 0) object.scale.setScalar(MODEL_HEIGHT / rawSize.y);
      object.updateMatrixWorld(true);
      const fitted = new THREE.Box3().setFromObject(object);
      const center = fitted.getCenter(new THREE.Vector3());
      object.position.x -= center.x;
      object.position.z -= center.z;
      object.position.y -= fitted.min.y;

      const size = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
      const halfWidth = Math.max(size.x, size.z) / 2;
      this.shadow.scale.setScalar(Math.max(halfWidth * 2.15, 2.8));
      const layout = orbitLayout(size.y || MODEL_HEIGHT, halfWidth);
      this.orbitRadius = layout.radius;
      this.orbitHeight = layout.height;
      this.placeCamera(size.y || MODEL_HEIGHT, layout.radius);
      this.addLogos();

      if (object.animations?.length) {
        this.mixer = new THREE.AnimationMixer(object);
        this.mixer.clipAction(object.animations[0]).play();
      }
    },
    addLogos() {
      for (let i = 0; i < SKILL_LOGOS.length; i += 1) {
        const material = new THREE.SpriteMaterial({
          map: skillTexture(THREE, SKILL_LOGOS[i]),
          transparent: true,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1.15, 1.15, 1);
        const at = orbitOffset(i, SKILL_LOGOS.length, 0, this.orbitRadius, this.orbitHeight);
        sprite.position.set(at.x, at.y, at.z);
        this.scene.add(sprite);
        this.logos.push(sprite);
      }
    },
    frame() {
      const dt = Math.min(this.clock.getDelta(), 0.05);
      if (!this.reduced) this.elapsed += dt;
      this.yaw = stepYaw({
        yaw: this.yaw,
        dt,
        dragging: this.dragging,
        reducedMotion: this.reduced,
      });
      this.modelPivot.rotation.y = this.yaw;
      const count = this.logos.length;
      for (let i = 0; i < count; i += 1) {
        const at = orbitOffset(i, count, this.elapsed, this.orbitRadius, this.orbitHeight);
        this.logos[i].position.set(at.x, at.y, at.z);
      }
      if (this.mixer && !this.reduced) this.mixer.update(dt);
      this.renderer.render(this.scene, this.camera);
    },
    resize() {
      const stage = this.$refs.stage;
      if (!stage || !this.renderer) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width < 2 || height < 2) return;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    syncLoop() {
      if (this.visible && !this.raf) {
        this.clock?.getDelta();
        this.raf = requestAnimationFrame(this.tick);
      } else if (!this.visible && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    },
    onPointerDown(event) {
      this.dragging = true;
      this.lastX = event.clientX;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event) {
      if (!this.dragging) return;
      this.yaw = yawFromDrag(this.yaw, event.clientX - this.lastX);
      this.lastX = event.clientX;
    },
    onPointerUp() {
      this.dragging = false;
    },
    onKeyDown(event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? KEY_STEP : -KEY_STEP;
      this.yaw = yawFromDrag(this.yaw, delta);
    },
  },
};
</script>
