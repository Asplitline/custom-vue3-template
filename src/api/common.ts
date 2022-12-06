import service from '.'

export interface QueryParams {
  page: number
  size: number
  keyword?: string
}

export interface QueryDeleteParams {
  id: string | number
}

export interface ActionResponse {
  success: boolean
  message: string
  data?: any
  list?: any[]
}
export function uploadImg(data: FormData) {
  return service.post('/file/uploadFile', data)
}
