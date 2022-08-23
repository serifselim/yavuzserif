<template>
  <header class="header">
    <section class="header__content flex align-center justify-between">
      <div>
        <Logo />
      </div>
      <div class="flex items-center">
        <ul class="desktop flex nav">
          <li class="nav__item text-size">[<span>0</span>]About</li>
          <li class="nav__item text-size">[<span>1</span>]Projects</li>
          <li class="nav__item text-size">[<span>2</span>]Source</li>
        </ul>
        <div>
          <button class="resume text-size">Resume</button>
        </div>
      </div>
      <!-- Mobil için -->
      <div class="hamburger">
        <MenuIcon v-if="!drawer" @click="drawer = true" />
        <ExitIcon v-else @click="drawer = false" />

        <div class="hamburger__content" v-if="drawer">
          <ul class="flex nav">
            <li class="nav__item text-size">About</li>
            <li class="nav__item text-size">Projects</li>
            <li class="nav__item text-size">Source Code</li>
          </ul>
        </div>
      </div>
    </section>
  </header>
</template>
<script>
import Logo from "@/assets/materials/Logo.vue";
import { MenuIcon, ExitIcon } from "@/assets/icons";
// Components
import Nav from "./Nav.vue";

export default {
  components: {
    Logo,
    MenuIcon,
    ExitIcon,
    Nav,
  },
  data: () => ({
    drawer: false,
  }),
  methods: {},
};
</script>

<style scoped>
.header {
  width: 100%;
}

.header__content {
  width: 100%;
  padding: 2.4rem;
}

.resume {
  border-radius: 1.2rem;
  transition: background 0.3s;
  border: 3px solid var(--primary-color);
  padding: 0.9rem 2rem;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  justify-content: center;
}

.resume:hover {
  background: var(--primary-color);
  color: var(--negative-text-color);
}

.hamburger {
  display: none;
  position: relative;
  border: 3px solid var(--primary-color);
  border-radius: 15px;
}

.hamburger .hamburger__content {
  position: absolute;
  background: var(--primary-color);
  right: 0;
  top: 64px;
  flex-direction: column;
  padding: 2rem;
  min-width: 20rem;
  border-radius: 10px;
}

.hamburger .hamburger__content ul {
  flex-direction: column;
  text-align: right;
  row-gap: 2rem;
}

@media screen and (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .resume {
    display: none;
  }
  .desktop {
    display: none;
  }
}
</style>