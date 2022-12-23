import { ActionResponse, QueryDeleteParams, QueryParams } from './common'
import service from './index'

export function getJoinPartyList(params: QueryParams) {
  return service.get<QueryParams>('/apiJoiningTheParty/pageList', { params })
}

export function getJoinPartyById(id: string) {
  return service.get<any, ActionResponse>('/apiJoiningTheParty/getById', { params: { id } })
}
