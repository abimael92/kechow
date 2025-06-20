// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LandingPage from '../pages/LandingPage.vue'

const routes = [
  { path: '/', name: 'Landing', component: LandingPage },
  { path: '/home', name: 'Home', component: HomePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
