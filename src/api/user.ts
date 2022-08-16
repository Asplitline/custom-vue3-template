import axios from 'axios'
import { UserState } from '@/store/modules/user/types'
import { QueryParams } from './common'

export interface LoginData {
  username: string
  password: string
}

export interface LoginRes {
  id: string
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/user/back/login', data)
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout')
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info')
}

export function getUserList(params: QueryParams) {
  return axios.get<QueryParams>('/user/getUser', { params })
}
