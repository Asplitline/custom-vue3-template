import { App } from 'vue'
import dayjs from 'dayjs'

export default {
  install(app: App) {
    console.log('app :', app)
    app.provide('formateDate', (v): string => {
      return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
    })
    // app.provide
  },
}
