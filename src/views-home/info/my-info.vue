<template>
  <div class="">
    <a-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      autocomplete="off"
      :auto-label-width="true"
    >
      <a-form-item field="username" label="用户名" hide-asterisk>
        <a-input v-model="formModel.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item field="name" hide-asterisk label="姓名">
        <a-input v-model="formModel.name" placeholder="请输入姓名" />
      </a-form-item>

      <a-form-item field="gender" hide-asterisk label="性别">
        <a-radio-group v-model="formModel.gender" :default-value="false">
          <a-radio value="0">男</a-radio>
          <a-radio value="1">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="email" hide-asterisk label="邮箱">
        <a-input v-model="formModel.email" placeholder="请输入邮箱" />
      </a-form-item>

      <a-form-item field="phone" hide-asterisk label="手机号码">
        <a-input v-model="formModel.phone" placeholder="请输入手机号码" />
      </a-form-item>
      <a-form-item field="description" hide-asterisk label="个人简介">
        <a-textarea
          v-model="formModel.description"
          placeholder="请输入个人简介"
          allow-clear
        />
      </a-form-item>

      <a-form-item field="url" hide-asterisk label="头像">
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
      <a-form-item>
        <a-button type="primary" style="width: 200px" @click="submitForm"
          >修改</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { updateUser } from '@/api/user'
import useForm from '@/hooks/useForm'
import useUpload from '@/hooks/useUpload'
import { useUserStore } from '@/store'
import { userLevelInfo } from '@/utils/static'
import { deepClone } from '@/utils/tools'
import { Message } from '@arco-design/web-vue'
import { jsxClosingElement } from '@babel/types'
import { reactive, inject, onMounted } from 'vue'

const handleCode = inject('handleCode')

const { formRef, formModel, resetForm } = useForm()
const { customRequest, file, onChange, onProgress } = useUpload(
  formModel,
  'url'
)

const formRules = reactive({
  username: [{ required: true, message: '请输入账号' }],
  name: [{ required: true, message: '请输入用户昵称' }],
  password: [{ required: true, message: '请输入用户密码' }],
  gender: [{ required: true, message: '请选择性别' }],
  level: [{ required: true, message: '请选择身份' }],
  url: [{ required: true, message: '请选择用户头像' }],
})
const userStore = useUserStore()

const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    const { success } = await updateUser(formModel.value)
    if (success) {
      Message.success('修改成功')
      userStore.updateUser(formModel.value)
    }
  })
}

const init = () => {
  const row = deepClone(userStore.info)
  file.value = { url: row.url }
  console.log('file.value: ', file.value.url)

  formModel.value = deepClone(row)
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped></style>
