import { Cache, isEmpty } from '@/utils/tools'

export function removeAction(_this, key: string) {
  _this[key] = {}
  Cache.remove(key)
}
export function updateAction(_this, key: string, data: any) {
  if (!isEmpty(data)) {
    _this[key] = data
    Cache.set(key, data)
  } else {
    removeAction(_this, key)
  }
}

export default {}
