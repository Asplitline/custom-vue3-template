import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getLogList(params: QueryParams) {
  return service.get<QueryParams>('/log/getlogs', { params })
}

export function deleteLogById(params: QueryDeleteParams) {
  return service.delete('/log/deletelog', { params })
}

export function getAllConfig() {
  return service.get<QueryParams>('/apiConfig/list')
}

export function getConfigList(params: QueryParams) {
  return service.get<QueryParams>('/apiConfig/pageList', { params })
}
export function addConfig(data: any) {
  return service.post<QueryParams>('/apiConfig/insert', data)
}
export function updateConfig(data: any) {
  return service.put<QueryParams>('/apiConfig/update', data)
}

export function deleteConfigById(params: QueryDeleteParams) {
  return service.delete('/apiConfig/delete', { params })
}
