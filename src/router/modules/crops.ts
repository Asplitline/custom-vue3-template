export default {
  path: 'crops',
  name: 'crops',
  component: () => import('@/views/crops/index.vue'),
  meta: {
    locale: '科普 & 农作物',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'popular-science',
      name: 'crops-popular-science',
      component: () => import('@/views/crops/popularScience.vue'),
      meta: {
        locale: '科普列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'up-popular-science/:id?',
      name: 'up-popular-science',
      component: () => import('@/views/crops/updatePopularScience.vue'),
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
      name: 'crops-list',
      component: () => import('@/views/crops/list.vue'),
      meta: {
        locale: '农作物清单',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'feedback',
      name: 'crops-feedback',
      component: () => import('@/views/crops/feedback.vue'),
      meta: {
        locale: '农作物反馈',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
