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
    isAdmin: (state) => {
      return +state.info.level! === 1
    },
  },

  actions: {
    resetInfo() {
      this.$reset()
      removeAction(this, 'info')
      removeAction(this, 'token')
    },
    updateUser(data: any) {
      if (!data) {
        removeAction(this, 'info')
        removeAction(this, 'token')
      } else {
        this.info = data
        this.token = data.id
        updateAction(this, 'info', data)
        updateAction(this, 'token', data.id)
      }
    },
    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm)
        this.updateUser(res.data)
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
