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

  if (isLogin) {
    if (to.name === 'login') {
      next({ name: 'user' })
    } else {
      next()
    }
    NProgress.done()
  } else {
    next({
      name: 'login',
      query: {
        redirect: to.name,
        ...to.query,
      } as LocationQueryRaw,
    })
    NProgress.done()
  }
  // next()
  // async function crossroads() {
  //   const Permission = usePermission()
  //   if (Permission.accessRouter(to)) await next()
  //   else {
  //     const destination = Permission.findFirstPermissionRoute(
  //       appRoutes,
  //       userStore.role
  //     ) || {
  //       name: 'notFound',
  //     }
  //     await next(destination)
  //   }
  //   NProgress.done()
  // }
  // try {
  //   if (isLogin()) {
  //     if (userStore.role) {
  //       crossroads()
  //     } else {
  //       try {
  //         await userStore.info()
  //         crossroads()
  //       } catch (error) {
  //         next({
  //           name: 'login',
  //           query: {
  //             redirect: to.name,
  //             ...to.query,
  //           } as LocationQueryRaw,
  //         })
  //         NProgress.done()
  //       }
  //     }
  //   } else {
  //     if (to.name === 'login') {
  //       next()
  //       NProgress.done()
  //       return
  //     }
  //     next({
  //       name: 'login',
  //       query: {
  //         redirect: to.name,
  //         ...to.query,
  //       } as LocationQueryRaw,
  //     })
  //     NProgress.done()
  //   }
  // } catch (error) {
  //   next()
  // }
})

export default router
