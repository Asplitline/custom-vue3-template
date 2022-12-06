import { ActionResponse, QueryDeleteParams, QueryParams } from './common'
import service from './index'

export function getAllPost() {
  return service.get('/apiPost/list')
}
export function getPostList(params: QueryParams) {
  return service.get<QueryParams>('/apiPost/pageList', { params })
}

export function getPostById(id: string) {
  return service.get<any, ActionResponse>('/apiPost/getById', { params: { id } })
}

export function addPost(data: any) {
  return service.post<any, ActionResponse>('/apiPost/insert', data)
}

export function updatePost(data: any) {
  return service.put<any, ActionResponse>('/apiPost/update', data)
}

export function deletePostById(params: QueryDeleteParams) {
  return service.delete('/apiPost/delete', { params })
}
