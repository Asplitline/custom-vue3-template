export default [
  {
    path: '/index',
    name: 'home-index',
    meta: {
      requiresAuth: false,
      locale: '首页',
    },
    component: () => import('@/views-home/home/index.vue'),
  },
  {
    path: '/product',
    name: 'home-product',
    meta: {
      requiresAuth: false,
      locale: '农产市场',
    },
    component: () => import('@/views-home/product/index.vue'),
  },

  {
    path: '/info',
    name: 'home-info',
    meta: {
      requiresAuth: false,
      locale: '个人中心',
    },
    component: () => import('@/views-home/info/index.vue'),
  },
]
