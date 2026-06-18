<template>
  <Renderer
    ref="renderer"
    antialias
    :height="canvasSize"
    :width="canvasSize"
    :orbit-ctrl="{ 
      target, 
      enableZoom: false, 
      autoRotate: true, 
      enablePan: false,  
      maxPolarAngle: polarAngle, 
      minPolarAngle: polarAngle 
      }"
    shadow
  >
    <Camera :position="{ x: 16, y: 16, z: 15 }" />
    <Scene ref="scene" background="#f5f2ec">
      <AmbientLight color="#ffffff" :intensity="0.55" />

      <DirectionalLight
        :position="{ x: 0, y: 30, z: 100 }"
        cast-shadow :shadow-camera="{ top: 180, bottom: 100, left: -120, right: 120 }"
      />

      <DirectionalLight
        :position="{ x: -50, y: -30, z: -100 }"
        cast-shadow :shadow-camera="{ top: 180, bottom: 100, left: -120, right: 120 }"
      />

      <FbxModel
        src="/assets/models/serifdog.fbx"
        @load="onLoad"
        :scale="modelScale"
      />
    </Scene>
  </Renderer>
</template>

<script>
import { AnimationMixer, Clock, Vector3, Fog, GridHelper } from "three";
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  FbxModel,
  Renderer,
  Scene,
} from "troisjs";

export default {
  name: "Model",
  components: {
    AmbientLight,
    Camera,
    DirectionalLight,
    FbxModel,
    Renderer,
    Scene,
  },
  data() {
    return {
      target: new Vector3(0, 0, 0),
      polarAngle: Math.PI / 3.5,
      canvasSize: window.innerWidth < 768 ? 320 : 420,
      modelScale: window.innerWidth < 768
        ? { x: 1, y: 1, z: 1 }
        : { x: 1.3, y: 1.3, z: 1.3 },
    };
  },
  mounted() {
    this.setGrid();
    window.addEventListener("resize", this.updateCanvasSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCanvasSize);
  },
  methods: {
    onLoad(object) {
      this.mixer = new AnimationMixer(object);
      this.clock = new Clock();
      this.$refs.renderer.onBeforeRender(this.updateMixer);
    },
    updateMixer() {
      this.mixer.update(this.clock.getDelta());
    },
    setGrid() {
      const scene = this.$refs.scene.scene;
      scene.fog = new Fog(0xf5f2ec, 200, 1000);
      const grid = new GridHelper(2000, 20, 0x2f7d6b, 0x151515);
      grid.material.opacity = 0.18;
      grid.material.transparent = true;
      this.$refs.scene.add(grid);
    },
    updateCanvasSize() {
      const isCompact = window.innerWidth < 768;
      this.canvasSize = isCompact ? 320 : 420;
      this.modelScale = isCompact
        ? { x: 1, y: 1, z: 1 }
        : { x: 1.3, y: 1.3, z: 1.3 };
    },
  },
};
</script>
