import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'

import homeRoutes from './home-modules'
import adminRoutes from './modules'
import Login from './modules/login'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(''),
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    Login,
    {
      path: '/',
      name: 'home',
      component: () => import('@/layout/home-layout.vue'),
      children: homeRoutes,
    },
    {
      path: '/admin',
      name: 'root',
      component: () => import('@/layout/page-layout.vue'),
      children: adminRoutes,
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
