import { Cache, isEmpty } from '@/utils/tools'

export function updateAction(_this, key: string, data: any) {
  if (!isEmpty(data)) {
    _this[key] = data
    Cache.set(key, data)
  } else {
    _this[key] = {}
    Cache.remove(key)
  }
}

export default {}
