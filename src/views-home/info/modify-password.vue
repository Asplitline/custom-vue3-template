<template>
  <div class="">
    <a-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      autocomplete="off"
      :auto-label-width="true"
    >
      <a-form-item field="oldPassword" label="旧密码" hide-asterisk>
        <a-input
          v-model="formModel.oldPassword"
          type="password"
          placeholder="请输入旧密码"
        />
      </a-form-item>
      <a-form-item field="newPassword" hide-asterisk label="新密码">
        <a-input
          v-model="formModel.newPassword"
          type="password"
          placeholder="请输入新密码"
        />
      </a-form-item>
      <a-form-item field="password" hide-asterisk label="确认密码">
        <a-input
          v-model="formModel.password"
          type="password"
          placeholder="请输入确认密码"
        />
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
import { modifyPassword } from '@/api/user'
import useForm from '@/hooks/useForm'
import { useUserStore } from '@/store'
import { Message } from '@arco-design/web-vue'
import { reactive } from 'vue'

const { formRef, formModel } = useForm()

const formRules = reactive({
  oldPassword: [{ required: true, message: '请输入旧密码' }],
  newPassword: [{ required: true, message: '请输入新密码' }],
  password: [
    {
      validator: (rule, callback) => {
        if (!rule) {
          return callback('请输入确认密码')
        }
        if (rule !== formModel.value.newPassword) {
          return callback('两次输入密码不一致')
        }
        return callback()
      },
    },
  ],
})
const userStore = useUserStore()

const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    const { success } = await modifyPassword({
      id: userStore.info.id,
      password: formModel.value,
    })
    if (success) {
      Message.success('修改成功，下次登录生效')
    }
  })
}
</script>

<style lang="less" scoped></style>
