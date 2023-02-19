import nProgress from 'nprogress'
import { useUserStore } from '@/store'
import router from './index'

router.beforeEach((to, from, next) => {
  nProgress.start()
  const userStore = useUserStore()
  const { info, isLogin, isAdmin } = userStore

  if (isLogin) {
    if (to.name === 'login') {
      next({ name: 'user' })
    } else {
      console.log('isAdmin: ', isAdmin)
      console.log('to.name: ', to.name)
      if (!isAdmin && !to.name.startsWith('home-')) {
        next({ name: from.name || 'home-index' })
      } else {
        next()
      }
    }
    nProgress.done()
  } else {
    if (to.name !== 'home-login' && to.name !== 'login') {
      if (to.name === 'home-info') {
        next({
          name: 'home-login',
          // query: {
          //   redirect: to.name,
          //   ...to.query,
          // } as any,
        })
      } else {
        next()
      }
    } else {
      next()
    }
    nProgress.done()
  }
})
