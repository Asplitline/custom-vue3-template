import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getPlantList(params: QueryParams) {
  return service.get<QueryParams>('/apiPlant/pageList', { params })
}

export function addPlant(data: any) {
  return service.post<any, ActionResponse>('/apiPlant/insert', data)
}
export function updatePlant(data: any) {
  return service.put<any, ActionResponse>('/apiPlant/update', data)
}

export function deletePlantById(params: QueryDeleteParams) {
  return service.delete('/apiPlant/delete', { params })
}
