<template>
  <div>
    <div class="nav-box">
      <img src="@/assets/images/logo.png" class="logo" alt="" />
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
    </div>
    <div class="page">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
console.log('route: ', route)
const menuList = computed(() =>
  router.getRoutes().filter((i) => {
    return i.name?.startsWith('home-')
  })
)
const gotoNext = (item) => {
  console.log('item: ', item)
  router.push({ name: item.name })
}
const routes = useRoute()
</script>

<style lang="less" scoped>
.page {
  padding: 10px 20px;
}
.logo {
  height: 80px;
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
</style>
