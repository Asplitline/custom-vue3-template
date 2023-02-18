import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout, LoginData } from '@/api/user'
import { setToken, clearToken } from '@/utils/auth'
import { Cache, isEmpty } from '@/utils/tools'
import { updateAction } from '@/store/utils'
import { getCategoryList } from '@/api/category'

const useCacheStore = defineStore('cache', {
  state: () => ({
    popularScience: Cache.get('popularScience'),
    categoryList: Cache.get('categoryList'),
  }),

  getters: {
    pCategory() {
      return this.categoryList.filter((i) => !i.pid)
    },
    getCategory() {
      return (id) => this.categoryList.find((i) => i.id === id)
    },
  },

  actions: {
    setPopularScience(data) {
      updateAction(this, 'popularScience', data)
    },
    async getAllCategory() {
      const { list } = await getCategoryList({ page: 1, size: 9999 })
      this.categoryList = list
      Cache.set('categoryList', list)
    },
  },
})

export default useCacheStore
