import service, { handleQuery } from './index'
import { QueryDeleteParams, QueryParams } from './common'

// export function getUserInfo() {
//   return service.post<UserState>('/api/user/info')
// }

export function getCarouselList(params: QueryParams) {
  return service.get<QueryParams>('/apiCarousel/pageList', { params })
}

export function addCarousel(data: any) {
  return service.post<QueryParams>('/apiCarousel/insert', data)
}
export function updateCarousel(data: any) {
  return service.put<QueryParams>('/apiCarousel/update', data)
}

export function deleteCarouselById(params: QueryDeleteParams) {
  return service.delete('/apiCarousel/delete', { params })
}
