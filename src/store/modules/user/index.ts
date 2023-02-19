import {
  LoginData,
  getUserList,
  login as userLogin,
  logout as userLogout,
} from '@/api/user'
import { removeAction, updateAction } from '@/store/utils'
import { Cache, isEmpty } from '@/utils/tools'
import { defineStore } from 'pinia'
import { UserState } from './types'

const useUserStore = defineStore('user', {
  state: (): { token: string; info: UserState; userList: any[] } => ({
    token: Cache.get('token'),
    info: Cache.get('info'),
    userList: [],
  }),

  getters: {
    isLogin: (state) => {
      return !isEmpty(state.token)
    },
    isAdmin: (state) => {
      return +state.info?.level === 1
    },
    findUser: (state) => {
      return (id: string) => state.userList.find((i) => i.id === id)
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
        const { success, data, message } = await userLogin(loginForm)
        if (success) {
          this.updateUser(data)
        }
        return success
      } catch (error) {
        removeAction(this, 'info')
        removeAction(this, 'token')
        return false
      }
    },

    // Logout
    async logout() {
      await userLogout()
      this.resetInfo()
    },

    async getAllUser() {
      const { list } = await getUserList({ page: 1, size: 999 })
      this.userList = list
    },
  },
})

export default useUserStore
