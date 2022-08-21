import { deepClone } from '@/utils/tools'
import { ref } from 'vue'

export default function useModal() {
  const modalVisible = ref(false)
  const isEdit = ref(false)

  const showModal = (formModel, row) => {
    modalVisible.value = true
    if (typeof row === 'function') {
      isEdit.value = true
      row()
    } else if (row) {
      isEdit.value = true
      formModel.value = deepClone(row)
    }
  }
  const cancelModal = (cancalFunc?: () => void) => {
    modalVisible.value = false
    cancalFunc?.()
  }

  const clearModal = (clearFunc?: () => void) => {
    cancelModal()
    clearFunc?.()
  }

  return { modalVisible, isEdit, showModal, cancelModal, clearModal }
}
