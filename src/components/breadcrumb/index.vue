<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in items" :key="item">
      {{ $t(item) }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, PropType, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
    default() {
      return []
    },
  },
})

const router = useRouter()
const route = useRoute()
const defaultVal = reactive<string[]>([])

const initData = () => {
  const routeRouter = router.options.routes.find((i) => i.name === 'root')?.children
  routeRouter?.forEach((e) => {
    if (e.children) {
      const currentRoute = e.children.find((i) => {
        return i.name === route.name
      })
      if (currentRoute) {
        defaultVal.push(e.meta?.locale as string)
        defaultVal.push(currentRoute.meta?.locale as string)
      }
    }
  })
}

const items = computed(() => {
  return props.items.length > 0 ? props.items : defaultVal
})

onMounted(() => {
  initData()
})
</script>

<style scoped lang="less">
.container-breadcrumb {
  margin: 16px 0;
  :deep(.arco-breadcrumb-item) {
    color: rgb(var(--gray-6));
    &:last-child {
      color: rgb(var(--gray-8));
    }
  }
}
</style>
