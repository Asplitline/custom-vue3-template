<template>
  <a-config-provider>
    <router-view></router-view>
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
import GlobalSetting from '@/components/global-setting/index.vue'
import { Message } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { provide } from 'vue'

provide('handleCode', (flag: boolean, message: string[] = [], success?: () => void, fail?: () => void) => {
  const [successText, errorText] = message
  if (flag) {
    if (successText) Message.success(successText)
    success?.()
  } else {
    if (errorText) Message.error(errorText)
    fail?.()
  }
})

provide('formateDate', (v): string => {
  const value = dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  return value === 'Invalid Date' ? '暂无' : value
})
</script>
