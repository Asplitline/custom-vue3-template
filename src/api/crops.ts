import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

export function getAllCropsList() {
  return service.get<QueryParams>('/apiCrops/list')
}
export function getCropsList(params: QueryParams) {
  return service.get<QueryParams>('/apiCrops/pageList', { params })
}

export function addCrops(data: any) {
  return service.post<QueryParams>('/apiCrops/insert', data)
}
export function updateCrops(data: any) {
  return service.put<QueryParams>('/apiCrops/update', data)
}

export function deleteCropsById(params: QueryDeleteParams) {
  return service.delete('/apiCrops/delete', { params })
}
