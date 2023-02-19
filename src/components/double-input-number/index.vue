<template>
  <div class="double-input-number">
    <a-input-number
      v-model="leftValue"
      class="left-input"
      model-event="input"
      :min="0"
      :max="10000"
    />
    <div class="bar" :class="{ reverse: isReverse }">
      <img src="@/assets/images/Right-Arrow.png" alt="" />
    </div>
    <a-input-number
      v-model="rightValue"
      class="right-input"
      model-event="input"
      :min="0"
      :max="10000"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'

const leftValue = ref()
const rightValue = ref()

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const isReverse = computed(() => {
  return (leftValue.value || 0) > (rightValue.value || 0)
})

const str = computed(() => {
  const arr = isReverse.value
    ? [rightValue.value || 0, leftValue.value || 0]
    : [leftValue.value || 0, rightValue.value || 0]
  return arr.join(',')
})

watch(
  () => str.value,
  (cur, pre) => {
    emits('update:modelValue', cur)
  }
)

const initData = (value) => {
  if (value) {
    const [leftVal, rightVal] = value?.split(',')
    leftValue.value = +leftVal
    rightValue.value = +rightVal
  }
}
// watch(
//   () => props.modelValue,
//   (cur) => {
//     initData(cur)
//   }
// )

onMounted(() => {
  initData(props.modelValue)
})
</script>

<style lang="less" scoped>
.double-input-number {
  display: flex;
}
.bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  margin: 0 10px;
  transform: rotate(0);
  transition: transform 0.2s ease;
  img {
    width: 100%;
    height: auto;
  }
  &.reverse {
    transform: rotate(180deg);
  }
}
</style>
