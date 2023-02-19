<template>
  <div>
    <div class="nav-box">
      <img
        src="@/assets/images/logo.png"
        class="logo"
        alt=""
        @click="gotoNext({ name: 'home-index' })"
      />
      <template v-if="route.name !== 'home-login'">
        <ul class="nav-list">
          <li
            v-for="menu in menuList"
            :key="menu.name"
            :class="{ active: route.name === menu.name }"
            class="nav-item"
            @click="gotoNext(menu)"
            >{{ menu.meta.locale }}</li
          >
        </ul>
      </template>
      <div v-else class="login">
        <span class="login-text">登录界面</span>
      </div>

      <div class="nav-right">
        <button class="btn" @click="gotoLogin">{{
          userStore.isLogin ? '注销' : '登录'
        }}</button>
        <button
          v-if="userStore.isAdmin && userStore.isLogin"
          class="btn goto"
          @click="gotoAdmin"
          >管理系统</button
        >
      </div>
    </div>
    <div class="page">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store'
import { Message } from '@arco-design/web-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const menuList = computed(() =>
  router.getRoutes().filter((i) => {
    return i.name?.startsWith('home-') && !i.meta.hideInMenu
  })
)
const gotoNext = (item) => {
  if (!userStore.isLogin && item.name === 'home-info') {
    router.push({ name: 'home-login' })
    Message.error('请先登录')
    return
  }
  router.push({ name: item.name })
}
const gotoAdmin = () => {
  router.push({ name: 'user' })
}

const gotoLogin = async () => {
  if (userStore.isLogin) {
    const success = await userStore.logout()
    if (success) {
      router.push({ name: 'home-index' })
    }
  } else {
    router.push({ name: 'home-login' })
  }
}
</script>

<style lang="less" scoped>
.page {
  padding: 10px 20px;
}
.logo {
  height: 80px;
  &:hover {
    cursor: pointer;
  }
}
.nav-box {
  display: flex;
  align-items: center;
  padding: 0 30px;
  height: 100px;
  background: url(@/assets/images/home-banner.png) no-repeat 50%;
  background-size: 100% 100%;
}
.nav-list {
  display: flex;
  flex: 1;
  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    height: 40px;
    border-radius: 20px;
    font-size: 24px;
    text-shadow: #be7016 1px 0 0, #be7016 0 1px 0, #be7016 -1px 0 0,
      #be7016 0 -1px 0;
    color: white;
    &:hover {
      cursor: pointer;
    }
    &.active {
      background-color: #0fc0c0;
      text-shadow: #697171 1px 0 0, #697171 0 1px 0, #697171 -1px 0 0,
        #697171 0 -1px 0;
    }
    &:not(:first-child) {
      margin-left: 20px;
    }
  }
}

.login {
  flex: 1;
  text-align: center;
  .login-text {
    text-shadow: #be7016 1px 0 0, #be7016 0 1px 0, #be7016 -1px 0 0,
      #be7016 0 -1px 0;
    color: white;
    font-size: 30px;
  }
}
.nav-right {
  display: flex;
  min-width: 200px;
}

.btn {
  max-width: 200px;
  width: 100%;
  height: 36px;
  background-color: #00b2b2;
  color: #fff;
  outline: none;
  line-height: 36px;
  text-align: center;
  border: 1px solid transparent;
  margin-top: 10px;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  &.disabled {
    pointer-events: none;
    background-color: #ccc;
    color: #222;
  }
  &.goto {
    margin-left: 20px;
  }
}
</style>
