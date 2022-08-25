import { Message } from '@arco-design/web-vue'

export function getType(value: unknown) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export function deepClone(source: unknown) {
  return JSON.parse(JSON.stringify(source))
}

// 22 0 undefined null [] {} ''
export function isEmpty(value: any) {
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  if (value === undefined || value === null) {
    return !value
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return !value
}

export function handleCode(
  flag: boolean,
  message: string[] = [],
  success?: () => void,
  fail?: () => void
) {
  const [successText, errorText] = message
  if (flag) {
    if (successText) Message.success(successText)
    success?.()
  } else {
    if (errorText) Message.error(errorText)
    fail?.()
  }
}

export function* ObjectEntries(this: any) {
  const entries = Object.entries(this)
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries) {
    yield [key, value]
  }
}

export function objToMap(obj: any): Map<any, any> {
  if (typeof obj !== 'object') return new Map()
  obj[Symbol.iterator] = ObjectEntries
  const map = new Map()
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of obj) {
    map.set(key, value)
  }
  return map
}

export function num2Hex(num: number): string {
  return num ? `0x${num.toString(16)}` : ''
}

export function deDuplication(arr: any[]) {
  return [...new Set(arr)]
}

export function filterEmptyValue(obj: any) {
  const result = {}
  Reflect.ownKeys(obj).forEach((key) => {
    if (!isEmpty(obj[key])) {
      result[key] = obj[key]
    }
  })

  return result
}

/**
 *
 * @param {Object} obj
 * @param {String | Array} omitKey
 * @returns {Object}
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const omitObj1 = omit(obj, 'a') // { a: 1, b: 2, c: 3 }
 * const omitObj2 = omit(obj, ['a', 'c']) // { b: 2 }
 */
export function omit(obj, omitKey: string | string[]) {
  const allKeys = Object.keys(obj)
  if (Array.isArray(omitKey)) {
    const rest = {}
    allKeys.forEach((key) => {
      if (!omitKey.includes(key)) {
        rest[key] = obj[key]
      }
    })
    return rest
  }
  const { omitKey: _, ...rest } = obj
  return rest
}

/**
 * @param {Object} obj
 * @param {String | Array} pickKey
 * @returns {Object}
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const pickObj1 = pick(obj, 'a') // { a: 1 }
 * const pickObj2 = pick(obj, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick(obj, pickKey: string | string[]) {
  const allKeys = Object.keys(obj)
  if (Array.isArray(pickKey)) {
    const rest = {}
    pickKey.forEach((key) => {
      if (allKeys.includes(key)) {
        rest[key] = obj[key]
      }
    })
    return rest
  }
  if (!allKeys.includes(pickKey)) return {}
  return {
    [pickKey]: obj[pickKey],
  }
}
