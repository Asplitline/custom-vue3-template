import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useCacheStore from './modules/cache'
import useUserStore from './modules/user'

const pinia = createPinia()

export { useAppStore, useUserStore, useCacheStore }
export default pinia
