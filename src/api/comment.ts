import { ActionResponse, QueryDeleteParams, QueryParams } from './common'
import service from './index'

export function getCommentList(params: QueryParams) {
  return service.get<QueryParams>('/apiComment/pageList', { params })
}

export function getCommentById(id: string) {
  return service.get<any, ActionResponse>('/apiComment/getById', { params: { id } })
}

export function addComment(data: any) {
  return service.post<any, ActionResponse>('/apiComment/insert', data)
}

export function updateComment(data: any) {
  return service.put<any, ActionResponse>('/apiComment/update', data)
}

export function deleteCommentById(params: QueryDeleteParams) {
  return service.delete('/apiComment/delete', { params })
}
