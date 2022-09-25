export default {
  path: 'trade',
  name: 'trade',
  component: () => import('@/views/trade/index.vue'),
  meta: {
    locale: '交易 & 服务',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'order',
      name: 'trade-order',
      component: () => import('@/views/trade/order.vue'),
      meta: {
        locale: '订单管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'advice',
      name: 'trade-advice',
      component: () => import('@/views/trade/advice.vue'),
      meta: {
        locale: '投诉建议',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
