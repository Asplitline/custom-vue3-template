export default {
  path: 'process',
  name: 'process',
  component: () => import('@/views/process/index.vue'),
  meta: {
    locale: '流程管理',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'list',
      name: 'process-list',
      component: () => import('@/views/process/list.vue'),
      meta: {
        locale: '入党申请',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
