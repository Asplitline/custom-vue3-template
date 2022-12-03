import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getAdviceList(params: QueryParams) {
  return service.get<QueryParams>('/addvice/getAddvice', { params })
}

export function addAdvice(data: any) {
  return service.post<any, ActionResponse>('/addvice/addAddvice', data)
}
export function updateAdvice(data: any) {
  return service.post<any, ActionResponse>('/addvice/updateAddvice', data)
}

export function deleteAdviceById(params: QueryDeleteParams) {
  return service.delete('/addvice/delete', { params })
}
