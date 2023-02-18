export default {
  path: 'plant',
  name: 'plant',
  component: () => import('@/views/plant/index.vue'),
  meta: {
    locale: '科普 & 农作物',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'popular-science',
      name: 'plant-popular-science',
      component: () => import('@/views/plant/popularScience.vue'),
      meta: {
        locale: '科普列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'up-popular-science/:id?',
      name: 'up-popular-science',
      component: () => import('@/views/plant/updatePopularScience.vue'),
      props: true,
      meta: {
        locale: '科普操作',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'list',
      name: 'plant-list',
      component: () => import('@/views/plant/list.vue'),
      meta: {
        locale: '农作物清单',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'feedback',
      name: 'plant-feedback',
      component: () => import('@/views/plant/feedback.vue'),
      meta: {
        locale: '农作物反馈',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
