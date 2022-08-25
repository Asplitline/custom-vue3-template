import { removeAction, updateAction } from '@/store/utils'
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
    resetInfo() {
      this.$reset()
      removeAction(this, 'info')
      removeAction(this, 'token')
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm)
        updateAction(this, 'info', res.data)
        updateAction(this, 'token', res.data.id)
      } catch (error) {
        removeAction(this, 'info')
        removeAction(this, 'token')
      }
    },

    // Logout
    async logout() {
      await userLogout()
      this.resetInfo()
    },
  },
})

export default useUserStore
