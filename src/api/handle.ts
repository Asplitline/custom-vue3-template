import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getHandleList(params: QueryParams) {
  return service.get<QueryParams>('/apiHandle/pageList', { params })
}

export function addHandle(data: any) {
  return service.post<QueryParams>('/apiHandle/insert', data)
}
export function updateHandle(data: any) {
  return service.put<QueryParams>('/apiHandle/update', data)
}

export function deleteHandleById(params: QueryDeleteParams) {
  return service.delete('/apiHandle/delete', { params })
}
