import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useCacheStore from './modules/cache'
import useUserStore from './modules/user'
import useUpdaterStore from './modules/updater'

const pinia = createPinia()

export { useAppStore, useUserStore, useCacheStore, useUpdaterStore }
export default pinia
