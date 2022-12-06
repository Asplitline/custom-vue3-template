<template>
  <div class="container">
    <a-card class="post-editor">
      <div>
        <div class="pe-box">
          <div class="flex">
            <span>文章标题</span>
            <a-input v-model="formModel.title" class="pe-input" placeholder="请输入文章标题" />
          </div>
          <a-button @click="router.push({ name: 'post' })">返回</a-button>
        </div>
        <Toolbar :editor="editorRef" class="pe-toolbar" :default-config="toolbarConfig" :mode="mode" />
        <Editor
          v-model="formModel.html"
          class="pe-editor"
          :default-config="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
        <div class="pe-btns">
          <a-button type="primary" @click="submitPost">提交</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { deepClone, handleCode, isEmpty } from '@/utils/tools'
import { Message } from '@arco-design/web-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'
import { addPost, updatePost, getPostById } from '@/api/post'
import { useUserStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const editorRef = shallowRef()
const formModel = reactive({
  title: '',
  html: '',
})

const tempData = ref({})
const mode = 'default'
// 内容 HTML

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
const userStore = useUserStore()
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const isEdit = computed(() => !!route.query.id)

const fetchPostDetail = async () => {
  if (!isEdit.value) return
  const { data } = await getPostById(route.query.id as string)
  // formModel = deepClone({
  //   title: data.title,
  //   html: data.htmlContent,
  // })
  tempData.value = data
  formModel.title = data.title
  editorRef.value.setHtml(data.htmlContent)
}

const submitPost = async () => {
  if (isEmpty(formModel.title)) {
    Message.warning('文章标题不能为空')
    return
  }
  if (isEmpty(formModel.html)) {
    Message.error('内容不能为空')
    return
  }

  const form = {
    title: formModel.title,
    htmlContent: formModel.html,
    textContent: editorRef.value.getText(),
  }

  if (!isEdit.value) {
    const { success } = await addPost({
      createTime: Date.now(),
      authorId: userStore.info.id,
      lx: '',
      ...form,
    })
    handleCode?.(success, ['添加文章成功', '添加文章失败'], () => {
      router.push({ name: 'post-list' })
    })
  } else {
    const { success } = await updatePost({
      ...tempData.value,
      ...form,
      updateTime: Date.now(),
    })
    handleCode?.(success, ['修改文章成功', '修改文章失败'], () => {
      router.push({ name: 'post-list' })
    })
  }
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<style lang="less" scoped>
.post-editor {
  & > div {
    border: 1px solid #ccc;
  }

  .pe-box {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .pe-input {
      width: 400px;
      margin-right: 10px;
    }
    span {
      margin-right: 10px;
    }
  }
  .pe-toolbar {
    border: 1px solid #ccc;
    border-bottom: none;
  }
  .pe-editor {
    height: 500px !important;
    border: 1px solid #ccc;
  }
  .pe-btns {
    margin-top: 20px;
    text-align: right;
  }
}

// :deep(.w-e-text-container) {
//   height: 500px;
//   overflow: hidden;
// }
</style>
