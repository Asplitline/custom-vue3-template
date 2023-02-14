<template>
  <div class="navbar">
    <div class="left-side">
      <!-- <a-space>
        <img
          alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
        />
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          智慧农业后台系统
        </a-typography-title>
      </a-space> -->
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>

      <li>
        <a-dropdown trigger="click">
          <a-avatar :size="32" :style="{ marginRight: '8px' }">
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <template #content>
            <!-- <a-doption>
              <a-space @click="switchGit">
                <icon-github />
                <span> 开源地址 </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="switchRoles">
                <icon-tag />
                <span>
                  {{ $t('messageBox.switchRoles') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="$router.push({ name: 'info' })">
                <icon-user />
                <span>
                  {{ $t('messageBox.userCenter') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="$router.push({ name: 'setting' })">
                <icon-settings />
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption> -->
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useDark, useToggle } from '@vueuse/core'
import { useAppStore, useUserStore } from '@/store'
import { LOCALE_OPTIONS } from '@/locale'
import useLocale from '@/hooks/locale'
import useUser from '@/hooks/user'

const appStore = useAppStore()
const userStore = useUserStore()
const { logout } = useUser()
const { changeLocale } = useLocale()
const locales = [...LOCALE_OPTIONS]
const avatar = computed(() => {
  return `${import.meta.env.VITE_API_IMG_URL}/${userStore.info.url}`
})
const theme = computed(() => {
  return appStore.theme
})
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridded default behavior
    appStore.toggleTheme(dark)
  },
})
const toggleTheme = useToggle(isDark)
const setVisible = () => {
  appStore.updateSettings({ globalSettings: true })
}
const refBtn = ref()
const triggerBtn = ref()
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  refBtn.value.dispatchEvent(event)
}
const handleLogout = () => {
  logout()
}
const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  triggerBtn.value.dispatchEvent(event)
}
const switchRoles = async () => {
  const res = await userStore.switchRoles()
  Message.success(res as string)
}
const switchGit = () => {
  window.open('https://github.com/chuzhixin')
}
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  width: calc(100% - 250px);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;
  :deep(.locale-select) {
    border-radius: 20px;
  }
  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }
  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }
  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }
  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
