import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getContentList(params: QueryParams) {
  return service.get<QueryParams>('/apiPost/pageList', { params })
}

export function addContent(data: any) {
  return service.post<QueryParams>('/apiPost/insert', data)
}
export function updateContent(data: any) {
  return service.put<QueryParams>('/apiPost/update', data)
}

export function deleteContentById(params: QueryDeleteParams) {
  return service.delete('/apiPost/delete', { params })
}
