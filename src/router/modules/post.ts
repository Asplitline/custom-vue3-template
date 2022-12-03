export default {
  path: 'post',
  name: 'post',
  component: () => import('@/views/post/index.vue'),
  meta: {
    locale: '帖子 & 评论',
    requiresAuth: true,
    icon: 'icon-exclamation-circle',
  },
  children: [
    {
      path: 'list',
      name: 'post-list',
      component: () => import('@/views/post/list.vue'),
      meta: {
        locale: '帖子管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'editor',
      name: 'post-editor',
      component: () => import('@/views/post/postEditor.vue'),
      meta: {
        locale: '帖子操作',
        requiresAuth: true,
        hideInMenu: true,

        roles: ['*'],
      },
    },
    {
      path: 'comment',
      name: 'post-comment',
      component: () => import('@/views/post/comment.vue'),
      meta: {
        locale: '评论管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
}
