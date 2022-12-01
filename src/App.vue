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
import { formatDateFunc, formateDateKey, handleCodeFunc, handleCodeKey } from './types/provide'

const handleCode: handleCodeFunc = (flag, message = [], success, fail) => {
  const [successText, errorText] = message
  if (flag) {
    if (successText) Message.success(successText)
    success?.()
  } else {
    if (errorText) Message.error(errorText)
    fail?.()
  }
}

provide(handleCodeKey, handleCode)

const formatDate: formatDateFunc = (v) => {
  const value = dayjs(v).format('YYYY-MM-DD HH:mm:ss')
  return value === 'Invalid Date' ? '暂无' : value
}

provide(formateDateKey, formatDate)
</script>
