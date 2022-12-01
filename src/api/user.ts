import service, { handleQuery } from './index'
import { ActionResponse, QueryDeleteParams, QueryParams } from './common'

export interface LoginData {
  username: string
  password: string
}

export interface LoginRes {
  id: string
}
export function login(data: LoginData) {
  return service.post<LoginRes>(`/user/back/login${handleQuery(data)}`)
}

export function logout() {
  return service.post<LoginRes>('/api/user/logout')
}

// export function getUserInfo() {
//   return service.post<UserState>('/api/user/info')
// }

export function addUser(data: any) {
  return service.post<any, ActionResponse>('/user/login', data)
}
export function updateUser(data: any) {
  return service.put<any, ActionResponse>('/user/updateUser', data)
}

export function getUserList(params: QueryParams) {
  return service.get<QueryParams>('/user/getUser', { params })
}

export function deleteUserById(params: QueryDeleteParams) {
  return service.delete('/user/deleteUser', { params })
}
