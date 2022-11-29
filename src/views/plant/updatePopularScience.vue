<template>
  <div class="container">
    <Breadcrumb />
    <a-form ref="formRef" :model="formModel" :rules="formRules" layout="vertical" class="ups-form">
      <a-row :gutter="60">
        <a-col :span="8">
          <a-card>
            <a-form-item field="url" label="科普封面">
              <a-upload
                :file-list="file ? [file] : []"
                :show-file-list="false"
                :custom-request="customRequest"
                @change="onChange"
                @progress="onProgress"
              >
                <template #upload-button>
                  <div
                    :class="`arco-upload-list-item${
                      file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
                    }`"
                  >
                    <div v-if="file && file.url" class="arco-upload-list-picture custom-upload-avatar">
                      <cs-image v-if="!file.uid" :src="file.url" />
                      <img v-else :src="file.url" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                    </div>
                    <div v-else class="arco-upload-picture-card">
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">Upload</div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-form-item>
            <a-form-item field="title" label="标题">
              <a-input v-model="formModel.title" placeholder="请输入标题"></a-input>
            </a-form-item>
            <a-form-item field="lx" label="分类">
              <a-select v-model="formModel.lx" placeholder="请选择分类">
                <a-optgroup v-for="option in options" :key="option.id" :label="option.name">
                  <a-option v-for="opt in option.children" :key="opt.id" :value="opt.id">{{ opt.name }}</a-option>
                </a-optgroup>
              </a-select>
            </a-form-item>
            <a-alert>图片仅支持 gif / png / jpg , 大小不超过 1MB (1024KB)</a-alert>
          </a-card></a-col
        >
        <a-col :span="16">
          <a-card>
            <a-form-item field="title" label="内容" :content-flex="false">
              <QuillEditor ref="editor" v-model:content="formModel.content" theme="snow" class="quill-editor" />
            </a-form-item>
            <a-button @click="back">返回</a-button>
            <a-button type="primary" class="submit-btn" @click="submitForm">提交</a-button>
          </a-card>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import useForm from '@/hooks/useForm'
import useUpload from '@/hooks/useUpload'
import { computed, inject, reactive, ref, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getAllCategory } from '@/api/category'
import { useRoute, useRouter } from 'vue-router'
import { addContent, updateContent } from '@/api/content'
import { useCacheStore } from '@/store'
import { deepClone } from '@/utils/tools'

const { formRef, formModel, resetForm } = useForm()
const cacheStore = useCacheStore()
const handleCode = inject('handleCode')
const editor = ref()
const options = ref()
const { customRequest, file, onChange, onProgress } = useUpload(formModel, 'url')

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => {
  return !!route.params.id
})

const formRules = reactive({
  title: [{ required: true, message: '请输入科普标题' }],
  lx: [{ required: true, message: '请选择科普分类' }],
  url: [{ required: true, message: '请选择科普封面' }],
  content: [{ required: true, message: '请输入科普内容' }],
})
const fetchData = async () => {
  const { data } = await getAllCategory()
  const parents = data.filter((i) => !i.pid)
  options.value = parents
    .map((i) => {
      const children = data.filter((j) => i.id === j.pid)

      return {
        ...i,
        children,
      }
    })
    .filter((i) => i.children?.length > 0)
}
const back = () => {
  router.go(-1)
}
const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    const { content, ...formData } = formModel.value
    if (isEdit.value) {
      const { success } = await updateContent({
        ...formData,
        content: editor.value.getHTML(),
      })
      handleCode(success, ['修改轮播图成功', '修改轮播图失败'], () => back())
    } else {
      const { success } = await addContent({
        ...formData,
        content: editor.value.getHTML(),
      })
      handleCode(success, ['添加轮播图成功', '添加轮播图失败'], () => back())
    }
  })
}

onMounted(() => {
  if (isEdit.value) {
    const { id, content, title, lx, url } = cacheStore.popularScience
    editor.value.setHTML(content)
    file.value = { url }
    formModel.value = {
      id,
      content,
      title,
      lx,
      url,
    }
  }
  console.log('formModel.value: ', formModel.value)

  //
  fetchData()
})
</script>

<style lang="less" scoped>
.ups-form {
  padding: 20px;
  :deep(.arco-upload-picture-card) {
    height: 200px;
    min-width: 200px;
    text-align: center;
  }
  :deep(.arco-upload-list-picture) {
    width: 200px;
    height: 200px;
    .arco-image {
      width: 100%;
    }
    .arco-upload-list-picture-mask {
      line-height: 200px;
      .arco-icon {
        width: 2em;
        height: 2em;
      }
    }
  }
  :deep(.quill-editor) {
    height: 500px;
  }
}
.submit-btn {
  margin-left: 20px;
}
</style>
