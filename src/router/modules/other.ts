export default {
  path: 'other',
  name: 'other',
  component: () => import('@/views/other/index.vue'),
  meta: {
    locale: '日志 & 配置',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'log',
      name: 'other-log',
      component: () => import('@/views/other/log.vue'),
      meta: {
        locale: '日志系统',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'config',
      name: 'other-config',
      component: () => import('@/views/other/config.vue'),
      meta: {
        locale: '阈值管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
