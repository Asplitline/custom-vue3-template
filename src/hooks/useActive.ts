import { ref } from 'vue'

// note useActive
export default function useActive(def?: any, key = 'value') {
  const active = ref(def)

  const setActive = (value?: any, initData = def) => {
    if (value?.[key] === undefined) {
      active.value = initData || def
    } else {
      active.value = value[key]
    }
  }

  const isActive = (value: any) => {
    return value === active.value
  }

  const getActiveItem = (list: any, value = active.value) => {
    return list.find((i) => i[key] === value)
  }
  return { active, setActive, isActive, getActiveItem }
}
