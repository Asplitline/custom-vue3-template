import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout, LoginData } from '@/api/user'
import { setToken, clearToken } from '@/utils/auth'
import { Cache, isEmpty } from '@/utils/tools'
import { updateAction } from '@/store/utils'

const useCacheStore = defineStore('cache', {
  state: () => ({
    popularScience: Cache.get('popularScience'),
  }),

  getters: {},

  actions: {
    setPopularScience(data) {
      updateAction(this, 'popularScience', data)
    },
  },
})

export default useCacheStore
