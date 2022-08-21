import { uploadImg } from '@/api/common'
import { Message, UploadRequest } from '@arco-design/web-vue'
import { ref } from 'vue'

export default function useUpload(formModel, filed = 'img') {
  const file = ref()
  const onChange = (_, currentFile) => {
    if (currentFile.file.size > 1 * 1024 * 1024) {
      // Message.error('图片大小不能超过1MB')
    } else {
      file.value = {
        ...currentFile,
        // url: URL.createObjectURL(currentFile.file),
      }
    }
    console.log('file.value', file.value)
  }
  const customRequest = (option: any): UploadRequest => {
    const { fileItem } = option
    const controller = new AbortController()
    if (fileItem.file.size > 1 * 1024 * 1024) {
      Message.error('图片大小不能超过1MB')
    } else {
      const updateUrl = async () => {
        const formData = new FormData()
        formData.append('files', fileItem.file)
        const res = await uploadImg(formData)
        formModel.value[filed] = res
      }
      updateUrl()
    }
    return {
      abort() {
        controller.abort()
      },
    }
  }
  const onProgress = (currentFile: unknown) => {
    file.value = currentFile
  }
  return {
    onChange,
    file,
    customRequest,
    onProgress,
  }
}
