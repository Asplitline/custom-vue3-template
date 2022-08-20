export type RoleType = '' | '*' | 'admin' | 'user'
export interface UserState {
  id?: string
  name?: string
  username?: string
  password?: string
  qq?: string
  phone?: string
  url?: string
  description?: string
  level?: string
  ctime?: string
  utime?: string
  state?: string
  email?: string
  cls?: string
  gender?: string
  openid?: string
}
