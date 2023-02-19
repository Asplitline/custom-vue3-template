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
    path: '/post/:id',
    name: 'home-post',
    meta: {
      requiresAuth: false,
      locale: '农产市场',
      hideInMenu: true,
    },
    component: () => import('@/views-home/home/post-detail.vue'),
  },

  {
    path: '/info',
    name: 'home-info',
    meta: {
      requiresAuth: false,
      locale: '个人中心',
      isLogin: true,
    },
    component: () => import('@/views-home/info/index.vue'),
  },
  {
    path: '/home-login',
    name: 'home-login',
    meta: {
      requiresAuth: false,
      locale: '登录界面',
      hideInMenu: true,
    },
    component: () => import('@/views-home/home/login.vue'),
  },
]
