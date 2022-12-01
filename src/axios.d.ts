import axios from 'axios'

// notes axios + typescript 返回值
declare module 'axios' {
  export interface AxiosInstance {
    (config: AxiosRequestConfig): AxiosPromise
    (url: string, config?: AxiosRequestConfig): AxiosPromise
    defaults: AxiosRequestConfig
    interceptors: {
      request: AxiosInterceptorManager<AxiosRequestConfig>
      response: AxiosInterceptorManager<AxiosResponse>
    }
    request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>
    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>
    post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
    put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
    patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>
  }
}
