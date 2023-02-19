<template>
  <div class="post-page">
    <a-row :gutter="60">
      <a-col :span="16">
        <banner-card :title="postDetail.title">
          <div class="post-header">
            <!-- <cs-image src="" alt=""> -->
            <span>本文作者：</span>
            <div>
              <cs-image
                :src="bindImg(postDetail.author?.url)"
                alt=""
                class="avatar"
              />
              <span class="name">{{
                postDetail?.author?.name || '已注销'
              }}</span>
            </div>
          </div>
          <a-divider :margin="10"></a-divider>
          <div class="post-content">
            <div v-html="postDetail?.htmlContent"></div>
          </div>
          <a-divider :margin="10">正文完</a-divider>
        </banner-card>
      </a-col>
      <a-col :span="8">
        <banner-card title="评论">
          <template v-if="commentList.length">
            <ul class="comment-list">
              <li v-for="i in commentList" :key="i.id" class="comment-item">
                <span
                  class="author"
                  :class="{ my: i.user.username === userStore.info.username }"
                  >{{ i.user.username }} :
                </span>
                <span class="content">{{ i.content }}</span>
              </li>
            </ul>
          </template>
          <div v-else> 暂无评论 </div>

          <div v-if="userStore.isLogin" class="comment-btn">
            <a-textarea v-model="comment" type="请输入内容"></a-textarea>
            <a-button
              type="primary"
              class="btn"
              status="success"
              @click="handleComment"
              >评论</a-button
            >
          </div>

          <div v-else class="empty" style="margin-top: 10px">
            登陆后才能评论
          </div>
        </banner-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import BannerCard from '@/components/banner-card/index.vue'
import { useRoute } from 'vue-router'
import { getContentById } from '@/api/content'
import { addComment, getAllCommentList } from '@/api/comment'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store'
import useStatic from '@/hooks/useStatic'
import { Message } from '@arco-design/web-vue'

const { bindImg } = useStatic()
const userStore = useUserStore()
const comment = ref('')
const route = useRoute()
const postDetail = ref({})
const fetchPostDetail = async () => {
  const { data } = await getContentById({ id: route.params.id })
  const author = userStore.findUser(data.authorId)
  postDetail.value = { ...data, author }
}

const commentList = ref([])
const fetchCommentList = async () => {
  const { data } = await getAllCommentList()
  console.log('data: ', data)
  commentList.value = data
    .filter((i) => i.postId === route.params.id)
    .map((i) => {
      const user = userStore.findUser(i.userId) || { username: '已注销' }
      return {
        ...i,
        user,
      }
    })
    .sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
  console.log('commentList.value :', commentList.value)
}
const handleComment = async () => {
  if (!comment.value) {
    Message.error('评论不能为空')
  }
  const { success } = await addComment({
    postId: route.params.id,
    userId: userStore.info.id,
    createTime: Date.now(),
    content: comment.value,
  })
  if (success) {
    Message.success('评论成功')
    fetchCommentList()
    comment.value = ''
  }
}
onMounted(async () => {
  await userStore.getAllUser()
  await fetchCommentList()
  fetchPostDetail()
})
</script>

<style lang="less" scoped>
.post-page {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
.post-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > div {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
    }
    span {
      margin-left: 10px;
    }
  }
}

.comment-list {
  .comment-item {
    padding: 10px 0;
    border-bottom: 1px dashed #c1eee5;
    .author {
      color: #222;
      &.my {
        color: #0fcea8;
      }
    }
    .content {
      color: #666;
      font-size: 12px;
    }
  }
}
.comment-btn {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .btn {
    margin-top: 10px;
  }
}
</style>
