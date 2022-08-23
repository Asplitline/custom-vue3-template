import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getPlantList(params: QueryParams) {
  return service.get<QueryParams>('/apiPlant/pageList', { params })
}

export function addPlant(data: any) {
  return service.post<QueryParams>('/apiPlant/insert', data)
}
export function updatePlant(data: any) {
  return service.put<QueryParams>('/apiPlant/update', data)
}

export function deletePlantById(params: QueryDeleteParams) {
  return service.delete('/apiPlant/delete', { params })
}
