<template>
  <Renderer
    ref="renderer"
    antialias
    :orbit-ctrl="{ target, autoRotate: true, enableZoom: false }"
    shadow
    resize
  >
    <Camera :position="{ x: 15, y: 15, z: 15 }" />
    <Scene ref="scene" background="transparent">
      <HemisphereLight />
      <DirectionalLight
        :position="{ x: 0, y: 200, z: 100 }"
        cast-shadow
        :shadow-camera="{ top: 180, bottom: -120, left: -120, right: 120 }"
      />

      <Plane
        :width="2000"
        :height="2000"
        :rotation="{ x: -Math.PI / 2 }"
        receive-shadow
      >
        <PhongMaterial color="#999999" :props="{ depthWrite: false }" />
      </Plane>

      <FbxModel src="/assets/models/serifdog.fbx" @load="onLoad" />
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
};
</script>