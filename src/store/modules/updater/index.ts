import { getAllPost } from '@/api/post'
import { getUserList } from '@/api/user'
import { defineStore } from 'pinia'

const useUpdaterStore = defineStore('updater', {
  state: () => ({
    userList: [] as any[],
    postList: [],
  }),

  getters: {
    getPostById: (state) => {
      return (id: number): any => state.postList.find((i: { id: number }) => i.id === +id)
    },
    getUserById: (state) => {
      return (id: string): any => state.postList.find((i: { id: string }) => i.id === id)
    },
  },

  actions: {
    async fetchAllPost() {
      const { data } = await getAllPost()
      this.postList = data
    },
    async fetchAllUser() {
      const { list } = await getUserList({ page: 1, size: 999 })
      this.userList = list!
    },
  },
})

export default useUpdaterStore
