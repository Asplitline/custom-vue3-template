import { deepClone } from '@/utils/tools'
import { ref } from 'vue'

export default function useModal(formModel?: any) {
  const modalVisible = ref(false)
  const isEdit = ref(false)

  const showModal = (row) => {
    modalVisible.value = true
    if (row) {
      isEdit.value = true
      formModel.value = deepClone(row)
    } else {
      isEdit.value = false
    }
  }
  const cancelModal = (cancelFunc?: () => void) => {
    modalVisible.value = false
    if (typeof cancelFunc === 'function') {
      cancelFunc?.()
    }
  }

  const clearModal = (clearFunc?: () => void) => {
    cancelModal()
    formModel.value = {}
  }

  return { modalVisible, isEdit, showModal, cancelModal, clearModal }
}
