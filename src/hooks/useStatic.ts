import { toggleInfo, userLevelInfo } from '@/utils/static'

export enum Unit {
  temperature = '℃',
  humidity = '%',
  carbonDioxide = 'ppm',
  sunshineTime = 'μmol/m²/s',
}

export default function useStatic() {
  const findLevelInfo = (level: number, key?: string) => {
    const value = userLevelInfo.find((i) => i.level === +level)
    return key ? value?.[key] : value
  }
  const findToggleInfo = (value: number, key?: string) => {
    const res = toggleInfo.find((i) => i.value === +value)
    return key ? res?.[key] : res
  }

  const parseValue = (str: string, type: Unit) => {
    const [left, right] = str?.split(',') || ''
    return {
      unit: type,
      left,
      right,
    }
  }

  const formatValue = (str: string, type: Unit) => {
    const { unit, left, right } = parseValue(str, type)
    return `${left} ~ ${right} ${unit}`
  }
  return {
    findLevelInfo,
    findToggleInfo,
    parseValue,
    formatValue,
  }
}
