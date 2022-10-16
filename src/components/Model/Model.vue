<template>
  <Renderer
    ref="renderer"
    antialias
    :height="400"
    :width="400"
    :orbit-ctrl="{ target, autoRotate: true, enableZoom: false }"
    shadow
  >
    <Camera :position="{ x: 16, y: 16, z: 15 }" />
    <Scene ref="scene" background="#d2d8d9">
      <HemisphereLight />

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
import { AnimationMixer, Clock, Vector3 } from "three";
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
      scene: null,
    };
  },
  mounted() {
    this.scene = this.$refs.scene.scene;
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
  },
  watch: {
    modelScale() {
      console.log(this.modelScale);
    },
  },
};
</script>