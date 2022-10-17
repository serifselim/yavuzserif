<template>
  <spinner-vue v-if="isLoading"/>
  <main-vue/>
</template>
<script>
import MainVue from './views/Main.vue';
import {SpinnerVue} from './components'
export default {
  name: 'App',
  data:() => ({
    isLoading: true
  }),
  mounted(){
    setTimeout(() => {
      this.isLoading = false
    }, 1500);
  },
  components: {MainVue, SpinnerVue},
};
</script>