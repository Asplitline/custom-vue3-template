import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getAllCategory() {
  return service.get('/apiLx/list')
}
export function getCategoryList(params: QueryParams) {
  return service.get<QueryParams>('/apiLx/pageList', { params })
}

export function addCategory(data: any) {
  return service.post<QueryParams>('/apiLx/insert', data)
}
export function updateCategory(data: any) {
  return service.put<QueryParams>('/apiLx/update', data)
}

export function deleteCategoryById(params: QueryDeleteParams) {
  return service.delete('/apiLx/delete', { params })
}
