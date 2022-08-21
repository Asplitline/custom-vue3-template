export default {
  path: 'config',
  name: 'config',
  component: () => import('@/views/config/index.vue'),
  meta: {
    locale: '基础配置',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'carousel',
      name: 'carousel',
      component: () => import('@/views/config/carousel.vue'),
      meta: {
        locale: '轮播图',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
