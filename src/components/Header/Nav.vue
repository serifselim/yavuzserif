<template>
  <ul
    class="
      flex flex-col
      md:flex-row
      gap-y-8
      md:gap-x-8 md:mr-7 md:mt-0
      mt-10
      text-lg
    "
  >
    <li class="md:hover:text-primary" v-for="info in navInfo" :key='info.id'>
      <a :href="info.path"> [<span class="text-primary">{{info.id}}</span>] {{info.name}} </a>
    </li>
    
  </ul>
</template>
<script>
import { navInfo } from '@/constants';
export default {
  name: "Nav",
  data:() => ({
    navInfo
  })
};
</script>
