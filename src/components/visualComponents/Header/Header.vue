<template>
  <header class="header">
    <section class="header__content flex align-center justify-between">
      <div>
        <Logo />
      </div>
      <div class="flex items-center">
        <ul class="flex nav">
          <li class="nav__item text-size">[<span>0</span>]About</li>
          <li class="nav__item text-size">[<span>1</span>]Projects</li>
          <li class="nav__item text-size">[<span>2</span>]Source</li>
        </ul>
        <div>
          <button class="resume text-size">Resume</button>
        </div>
      </div>
    </section>
  </header>
</template>
<script>
import Logo from "../../../assets/Logo.vue";
export default {
  components: {
    Logo,
  },
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

.nav {
  margin-right: 2rem;
}

.nav__item {
  cursor: pointer;
  margin-block: auto;
}

.nav__item:not(:first-child) {
  margin-left: 2rem;
}

.nav__item:hover {
  color: var(--primary-color);
}

.nav__item span {
  color: var(--primary-color);
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
</style>