import { createRouter, createWebHistory } from 'vue-router'
import TemporaryView from '../views/TemporaryView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'temporary',
      component: TemporaryView,
    },
  ],
})

export default router
