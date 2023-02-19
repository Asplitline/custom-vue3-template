<template>
  <a-row class="info-page">
    <a-col :span="6">
      <ul class="aside-list">
        <li
          v-for="nav in navList"
          :key="nav.value"
          class="aside-item"
          :class="{ active: isActive(nav.value) }"
          @click="setActive(nav)"
        >
          <img src="@/assets/images/avatar_10019_clear.png" alt="" />
          <span>
            {{ nav.text }}
          </span>
        </li>
      </ul>
    </a-col>
    <a-col :span="18" class="content">
      <component :is="currentInfo.component"></component>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import useActive from '@/hooks/useActive'
import { computed } from 'vue'
import MyInfo from './my-info.vue'
import ModifyPassword from './modify-password.vue'
import MyFeedback from './my-feedback.vue'

const navList = [
  { text: '个人信息', value: 0, component: MyInfo },
  { text: '修改密码', value: 1, component: ModifyPassword },
  { text: '我的反馈', value: 2, component: MyFeedback },
]

const { setActive, isActive, getActiveItem } = useActive(0)

const currentInfo = computed(() => getActiveItem(navList))
</script>

<style lang="less" scoped>
.info-page {
  max-width: 1000px;
  margin: 0 auto;
  min-height: 70vh;
}

.aside-list {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  .aside-item {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 10px;
    span {
      font-size: 14px;
      margin-right: 20px;
    }
    img {
      margin-right: 4px;
      width: 30px;
      height: 30px;
    }
    &:hover {
      cursor: pointer;
    }
    &.active {
      background-color: #00b2b2;
      color: #fff;
    }
  }
}
.content {
  padding: 14px 10px;
}
</style>
