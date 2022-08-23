<template lang="">
    <ul class="flex nav">
        <li class="nav__item text-size">[<span>0</span>]About</li>
        <li class="nav__item text-size">[<span>1</span>]Projects</li>
        <li class="nav__item text-size">[<span>2</span>]Source</li>
    </ul>
</template>
<script>
export default {
  props: ["class"],
};
</script>
<style scoped>
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
</style>