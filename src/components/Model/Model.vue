<template>
  <Renderer
    ref="renderer"
    antialias
    :height="400"
    :width="400"
    :orbit-ctrl="{ 
      target, 
      enableZoom: false, 
      autoRotate: true, 
      enablePan: false,  
      maxPolarAngle: Math.PI / 3.5 , 
      minPolarAngle: Math.PI / 3.5 
      }"
    shadow
  >
    <Camera :position="{ x: 16, y: 16, z: 15 }" />
    <Scene ref="scene" background="#d2d8d9">

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
// Model from mixamo.com
import { AnimationMixer, Clock, Vector3, Fog, GridHelper } from "three";
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  FbxModel,
  HemisphereLight,
  Renderer,
  PhongMaterial,
  Plane,
  Scene,
  ShadowMaterial,
} from "troisjs";
export default {
  name: "Model",
  components: {
    AmbientLight,
    Camera,
    DirectionalLight,
    FbxModel,
    HemisphereLight,
    Renderer,
    PhongMaterial,
    Plane,
    Scene,
    ShadowMaterial,
  },
  data() {
    return {
      target: new Vector3(0, 0, 0),
      modelScale:
        window.screen.width < 768
          ? { x: 1, y: 1, z: 1 }
          : { x: 1.3, y: 1.3, z: 1.3 },
    };
  },
  mounted() {
    this.setGrid()
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
    setGrid(){
      const scene = this.$refs.scene.scene;
      scene.fog = new Fog(0xa0a0a0, 200, 1000)
      const grid = new GridHelper(2000, 20, 0x000000, 0x000000)
      grid.material.opacity = 0.5
      grid.material.transparent = true
      this.$refs.scene.add(grid)
    }
  },
  watch: {
    modelScale() {
      console.log(this.modelScale);
    },
  },
};
</script>