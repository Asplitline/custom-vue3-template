const store = window.localStorage
export default class Cache {
  static set(key: string, value: any) {
    if (typeof key !== 'string') return
    store.setItem(key, JSON.stringify(value))
  }

  static get(key: string, def?: any) {
    try {
      const result = store.getItem(key)
      if (/\[|\]|{|}/.test(result as string) && typeof result === 'string') {
        return JSON.parse(result)
      }
      return result
    } catch (error) {
      console.log('error: ', error)
      return def || ''
    }
  }

  static remove(key: string) {
    try {
      store.removeItem(key)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  static clear() {
    try {
      store.clear()
    } catch (error) {
      console.log('error: ', error)
    }
  }
}
