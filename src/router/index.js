// import { Code, Visual } from "../views";
import Code from '../views/Code/Code.vue';
import Visual from '../views/Visual/Visual.vue';
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/', name: 'Visaul', component: Visual },
    { path: '/code', name: 'Code', component: Code },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router