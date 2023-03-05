import { ref } from 'vue'

export default function useForm(defForm: any = {}) {
  const formRef = ref()
  const formModel = ref(defForm)

  const resetForm = () => {
    formRef.value.resetFields()
  }
  return { formRef, formModel, resetForm }
}
