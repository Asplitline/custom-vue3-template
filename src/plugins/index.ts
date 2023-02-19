import { App } from 'vue'
import dayjs from 'dayjs'
import { Message } from '@arco-design/web-vue'

export default {
  install(app: App) {
    app.provide('formateDate', (v, str = 'YYYY-MM-DD HH:mm:ss'): string => {
      const value = dayjs(v).format(str)
      return value === 'Invalid Date' ? '暂无' : value
    })

    app.provide(
      'handleCode',
      (
        flag: boolean,
        message: string[] = [],
        success?: () => void,
        fail?: () => void
      ) => {
        const [successText, errorText] = message
        if (flag) {
          if (successText) Message.success(successText)
          success?.()
        } else {
          if (errorText) Message.error(errorText)
          fail?.()
        }
      }
    )
    // app.provide
  },
}
