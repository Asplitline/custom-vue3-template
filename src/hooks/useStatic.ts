import { toggleInfo, userLevelInfo } from '@/utils/static'

export default function useStatic() {
  const findLevelInfo = (level: number, key?: string) => {
    const value = userLevelInfo.find((i) => i.level === +level)
    return key ? value?.[key] : value
  }
  const findToggleInfo = (value: number, key?: string) => {
    const res = toggleInfo.find((i) => i.value === +value)
    return key ? res?.[key] : res
  }

  return {
    findLevelInfo,
    findToggleInfo,
  }
}
