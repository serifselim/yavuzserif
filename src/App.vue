<template>
  <router-view />
</template>
<script>
import setTheme from './utils/setTheme';
export default {
  data:()=>({
  }),
  created() {
    setTheme();
  },
};
</script>