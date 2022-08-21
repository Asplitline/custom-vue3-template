export default {
  path: 'user',
  name: 'user',
  redirect: { name: 'user-list' },
  component: () => import('@/views/user/index.vue'),
  meta: {
    locale: '用户管理',
    icon: 'icon-user',
    requiresAuth: true,
  },
  children: [
    {
      path: 'list',
      name: 'user-list',
      component: () => import('@/views/user/list.vue'),
      meta: {
        locale: '用户信息',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'info',
    //   name: 'info',
    //   component: () => import('@/views/user/info/index.vue'),
    //   meta: {
    //     locale: '用户信息',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // {
    //   path: 'setting',
    //   name: 'setting',
    //   component: () => import('@/views/user/setting/index.vue'),
    //   meta: {
    //     locale: '用户设置',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  ],
}
