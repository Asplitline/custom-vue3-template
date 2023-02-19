import nProgress from 'nprogress'
import { useUserStore } from '@/store'
import router from './index'

router.beforeEach(async (to, from, next) => {
  nProgress.start()
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
    nProgress.done()
  } else {
    if (to.name !== 'login') {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as any,
      })
    } else {
      next()
    }
    nProgress.done()
  }
})
