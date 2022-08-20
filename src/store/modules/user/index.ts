import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout, LoginData } from '@/api/user'
import { setToken, clearToken } from '@/utils/auth'
import { Cache, isEmpty } from '@/utils/tools'
import { UserState } from './types'

const useUserStore = defineStore('user', {
  state: (): { token: string; info: UserState } => ({
    token: Cache.get('token'),
    info: Cache.get('info'),
  }),

  getters: {
    isLogin: (state) => {
      return !isEmpty(state.token)
    },
  },

  actions: {
    // switchRoles() {
    //   return new Promise((resolve) => {
    //     this.role = this.role === 'user' ? 'admin' : 'user'
    //     resolve(this.role)
    //   })
    // },
    // Set user's information
    // setInfo(info: any) {
    //   this.info = info
    // },

    // Reset user's information
    resetInfo() {
      this.$reset()
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm)
        this.info = res.data
        Cache.set('info', res.data)
        Cache.set('token', res.data.id)
      } catch (err) {
        Cache.remove('token')
        Cache.remove('info')
        throw err
      }
    },

    // Logout
    async logout() {
      await userLogout()

      this.resetInfo()
      clearToken()
    },
  },
})

export default useUserStore
