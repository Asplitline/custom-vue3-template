import { deepClone } from '@/utils/tools'
import { ref } from 'vue'

export default function useModal() {
  const modalVisible = ref(false)
  const isEdit = ref(false)

  const showModal = (formModel, row) => {
    if (typeof row === 'function') {
      row()
    } else if (row) {
      isEdit.value = true
      formModel.value = deepClone(row)
    } else {
      isEdit.value = false
    }
    modalVisible.value = true
  }
  const cancelModal = (cancelFunc?: () => void) => {
    modalVisible.value = false
    if (typeof cancelFunc === 'function') {
      cancelFunc?.()
    }
  }

  const clearModal = (clearFunc?: () => void) => {
    // cancelModal()
    // modalVisible.value = false
    clearFunc?.()
  }

  return { modalVisible, isEdit, showModal, cancelModal, clearModal }
}
