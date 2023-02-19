import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getFeedbackList(params: QueryParams) {
  return service.get<QueryParams>('/apiHandle/pageList', { params })
}

export function addFeedback(data: any) {
  return service.post<QueryParams>('/apiHandle/insert', data)
}
export function updateFeedback(data: any) {
  return service.put<QueryParams>('/apiHandle/update', data)
}

export function deleteFeedbackById(params: QueryDeleteParams) {
  return service.delete('/apiHandle/delete', { params })
}
