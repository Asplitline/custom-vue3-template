<template>
  <div class="container">
    <Breadcrumb />
    <a-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      layout="vertical"
      class="ups-form"
    >
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
                      file && file.status === 'error'
                        ? ' arco-upload-list-item-error'
                        : ''
                    }`"
                  >
                    <div
                      v-if="file && file.url"
                      class="arco-upload-list-picture custom-upload-avatar"
                    >
                      <cs-image v-if="!file.uid" :src="file.url" />
                      <img v-else :src="file.url" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                      <a-progress
                        v-if="file.status === 'uploading' && file.percent < 100"
                        :percent="file.percent"
                        type="circle"
                        size="mini"
                        :style="{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                        }"
                      />
                    </div>
                    <div v-else class="arco-upload-picture-card">
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600"
                          >Upload</div
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-form-item>
            <a-form-item field="title" label="标题">
              <a-input
                v-model="formModel.title"
                placeholder="请输入标题"
              ></a-input>
            </a-form-item>
            <a-form-item field="lx" label="分类">
              <a-input
                v-model="formModel.lx"
                placeholder="请选择分类"
              ></a-input>
            </a-form-item>
            <a-alert
              >图片仅支持 gif / png / jpg , 大小不超过 1MB (1024KB)</a-alert
            >
          </a-card></a-col
        >
        <a-col :span="16">
          <a-card>
            <a-form-item field="title" label="内容" :content-flex="false">
              <QuillEditor
                ref="editor"
                v-model:content="formModel.content"
                theme="snow"
                class="quill-editor"
              />
            </a-form-item>
            <a-button type="primary" @click="submitForm">提交</a-button>
          </a-card>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import useForm from '@/hooks/useForm'
import useUpload from '@/hooks/useUpload'
import { computed, inject, reactive, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useRoute, useRouter } from 'vue-router'
import { addContent, updateContent } from '@/api/content'

const { formRef, formModel, resetForm } = useForm()

const handleCode = inject('handleCode')
const editor = ref()

const { customRequest, file, onChange, onProgress } = useUpload(
  formModel,
  'url'
)

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
  }
  :deep(.quill-editor) {
    height: 500px;
  }
}
</style>
