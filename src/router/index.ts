import {
  createRouter,
  createWebHashHistory,
  LocationQueryRaw,
} from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

import usePermission from '@/hooks/permission'
import { useUserStore } from '@/store'
import PageLayout from '@/layout/page-layout.vue'
import { Cache } from '@/utils/tools'
import Login from './modules/login'
import appRoutes from './modules'

// const endAppRoutes = appRoutes.filter((i) => {
//   return i.meta.hidden !== true
// })

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
      name: 'root',
      path: '/',
      component: PageLayout,
      children: appRoutes,
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

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  const { info, isLogin } = userStore
  console.log('isLogin: ', isLogin)
  console.log('to.name: ', to.name)
  if (isLogin) {
    if (to.name === 'login') {
      next({ name: 'user' })
    } else {
      next()
    }
    NProgress.done()
  } else {
    if (to.name !== 'login') {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      })
    } else {
      next()
    }
    NProgress.done()
  }
})

export default router
