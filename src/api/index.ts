import axios from 'axios'
import { Cache } from '@/utils/tools'
import { Message } from '@arco-design/web-vue'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 10000,
  validateStatus() {
    return true
  },
})

export const handleQuery = (obj = {}) => {
  const resObj = {}
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== '') resObj[key] = value
  })
  const params = new URLSearchParams(resObj)
  return params ? `?${params}` : ''
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = Cache.get('token')
    if (token && config.headers) {
      config.headers['access-auth-token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, message } = response.data
    if (code) {
      Message.error(message)
    }
    return response.data
  },
  (error) => {
    // 错误抛到业务代码
    error.data = {}
    error.data.msg = '请求超时或服务器异常'
    return Promise.reject(error)
  }
)

export default service
