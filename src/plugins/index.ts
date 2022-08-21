import { App } from 'vue'
import dayjs from 'dayjs'
import { Message } from '@arco-design/web-vue'

export default {
  install(app: App) {
    app.provide('formateDate', (v): string => {
      return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
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
