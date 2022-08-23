import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getContentList(params: QueryParams) {
  return service.get<QueryParams>('/apiContent/pageList', { params })
}

export function addContent(data: any) {
  return service.post<QueryParams>('/apiContent/insert', data)
}
export function updateContent(data: any) {
  return service.put<QueryParams>('/apiContent/update', data)
}

export function deleteContentById(params: QueryDeleteParams) {
  return service.delete('/apiContent/delete', { params })
}
