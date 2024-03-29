import { deepClone } from '@/utils/tools'
import { ref } from 'vue'

export default function useModal() {
  const modalVisible = ref(false)
  const isEdit = ref(false)

  const showModal = (formModel, row) => {
    modalVisible.value = true
    if (typeof row === 'function') {
      row()
    } else if (row) {
      isEdit.value = true
      formModel.value = deepClone(row)
      console.log(formModel.value)
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
    clearFunc?.()
  }

  return { modalVisible, isEdit, showModal, cancelModal, clearModal }
}
