import {
  productStatus,
  toggleInfo,
  userLevelInfo,
  IMG_URL,
} from '@/utils/static'

export enum Unit {
  temperature = '℃',
  humidity = '%',
  carbonDioxide = 'ppm',
  sunshineTime = 'μmol/m²/s',
}

// note useStatic
export default function useStatic() {
  const findLevelInfo = (level: number, key?: string) => {
    const value = userLevelInfo.find((i) => i.level === +level)
    return key ? value?.[key] : value
  }
  const findToggleInfo = (value: number, key?: string) => {
    const res = toggleInfo.find((i) => i.value === +value)
    return key ? res?.[key] : res
  }
  const findProductStatus = (value: number, key?: string) => {
    const res = productStatus.find((i) => i.value === +value)
    return key ? res?.[key] : res
  }

  const bindImg = (url: string) => {
    return `${IMG_URL}${url}`
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
    findProductStatus,
    parseValue,
    formatValue,
    bindImg,
  }
}
