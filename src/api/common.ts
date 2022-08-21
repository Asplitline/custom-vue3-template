import service from '.'

export interface QueryParams {
  page: number
  size: number
  keyword?: string
}

export interface QueryDeleteParams {
  id: string | number
}

export function uploadImg(data: FormData) {
  return service.post('/file/uploadFile', data)
}
