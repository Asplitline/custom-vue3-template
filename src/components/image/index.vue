<template>
  <a-image v-bind="$attrs" :src="endSrc"> </a-image>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  src: String,
  local: {
    type: Boolean,
    default: false,
  },
})

const endSrc = computed(() => {
  return props.local
    ? props.src
    : (import.meta.env.VITE_API_IMG_URL as string) + props.src
})
</script>

<style lang="scss" scoped></style>
