import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  validateStatus: function () {
    return true
  }
})

// 请求拦截器
service.interceptors.request.use((config) => {
  const token = getVal('token')
  token&&config.headers['access-auth-token'] = token
  return config
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '服务器异常'
  return Promise.reject(error)
})


// 响应拦截器
service.interceptors.response.use((response) => {
  // code || status
  const status = response.status
  const code = response.data.code
  let message = ''
  if (code !== 0) {
    // 处理http错误，抛到业务代码
    message = showStatus(code)
    if (typeof response.data === 'string') {
      response.data = { message }
    } else {
      response.data.message = message
    }
  }
  return response
}, (error) => {
  // 错误抛到业务代码
  error.data = {}
  error.data.msg = '请求超时或服务器异常'
  return Promise.reject(error)
})

export default service