<template>
  <div class="">
    <div class="box">
      <template v-if="currentIndex === 0">
        <h2>登录</h2>
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
          <a-form-item field="password" hide-asterisk label="密码">
            <a-input
              v-model="formModel.password"
              type="password"
              placeholder="请输入密码"
            />
          </a-form-item>

          <a-form-item>
            <button class="btn" @click="submitForm('login')">登录</button>
          </a-form-item>
          <span class="tips"
            >没有账号，去<em class="link" @click="setCurrentIndex(1)"
              >注册</em
            ></span
          >
        </a-form>
      </template>

      <template v-else>
        <h2>注册</h2>
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
          <a-form-item field="password" hide-asterisk label="密码">
            <a-input
              v-model="formModel.password"
              type="password"
              placeholder="请输入密码"
            />
          </a-form-item>

          <a-form-item>
            <button class="btn" @click="submitForm('register')">注册</button>
          </a-form-item>
          <span class="tips"
            >已有账号，去<em class="link" @click="setCurrentIndex(0)"
              >登陆</em
            ></span
          >
        </a-form>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useForm from '@/hooks/useForm'
import { useUserStore } from '@/store'
import { reactive, ref } from 'vue'
import { addUser } from '@/api/user'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const { formRef, formModel } = useForm()

const currentIndex = ref(0)
const formRules = reactive({
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
})
const userStore = useUserStore()

const setCurrentIndex = (idx: number) => {
  currentIndex.value = idx
  formModel.value = {}
}
const router = useRouter()
const submitForm = (key) => {
  formRef.value.validate(async (err) => {
    if (err) return
    if (key === 'login') {
      try {
        const success = await userStore.login(formModel.value)
        if (success) router.push({ name: 'home-index' })
      } catch (error) {
        console.log('error :', error)
      }
    } else if (key === 'register') {
      const { success } = await addUser({
        state: 0,
        username: formModel.value.username,
        level: 0,
        name: formModel.value.username,
        ctime: Date.now(),
        id: '13',
      })
      if (success) {
        Message.success('注册成功，请登录体验吧~')
        setCurrentIndex(0)
      }
    }
  })
}
</script>

<style lang="less" scoped>
.box {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  margin: 100px auto 0;
  border: 1px solid #0fcea8;
  border-radius: 4px;
  .tips {
    text-align: center;
    font-size: 14px;
    .link {
      font-style: normal;
      color: #0fcea8;
      margin-left: 4px;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}

.btn {
  width: 100%;
  height: 32px;
  background-color: #00b2b2;
  color: #fff;
  outline: none;
  line-height: 32px;
  text-align: center;
  border: 1px solid transparent;
  margin-top: 10px;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}

h2 {
  margin: 0;
  font-weight: normal;
  margin-bottom: 20px;
  text-align: center;
}
</style>
