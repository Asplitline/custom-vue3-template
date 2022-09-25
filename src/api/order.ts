import service from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getPlantOrderList(params: QueryParams) {
  return service.get<QueryParams>('/apiPlantOrder/pageList', { params })
}

export function addPlantOrder(data: any) {
  return service.post<QueryParams>('/apiPlantOrder/insert', data)
}
export function updatePlantOrder(data: any) {
  return service.put<QueryParams>('/apiPlantOrder/update', data)
}

export function deletePlantOrderById(params: QueryDeleteParams) {
  return service.delete('/apiPlantOrder/delete', { params })
}
