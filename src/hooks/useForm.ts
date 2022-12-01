import { ref } from 'vue'

export default function useForm() {
  const formRef = ref()
  const formModel = ref<any>({})

  const resetForm = () => {
    formRef.value.resetFields()
  }
  return { formRef, formModel, resetForm }
}
