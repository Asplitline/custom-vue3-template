import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getAllCommentList() {
  return service.get<QueryParams>('/apiComment/list')
}
export function getCommentList(params: QueryParams) {
  return service.get<QueryParams>('/apiComment/pageList', { params })
}

export function addComment(data: any) {
  return service.post<QueryParams>('/apiComment/insert', data)
}
export function updateComment(data: any) {
  return service.put<QueryParams>('/apiComment/update', data)
}

export function deleteCommentById(params: QueryDeleteParams) {
  return service.delete('/apiComment/delete', { params })
}

export function getCommentById(params: { id: string }) {
  return service.get('/apiComment/getById', { params })
}
