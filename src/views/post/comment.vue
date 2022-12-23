<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <!-- <a-row style="margin-bottom: 20px">
        <a-col :span="24" style="text-align: right">
          <a-space>
            <a-button type="primary" @click="skipPostEditor()">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
          </a-space>
        </a-col>
      </a-row> -->
      <a-table
        row-key="id"
        :loading="loading"
        :current="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="(v) => onPageChange(v, handleData)"
      >
        <template #columns>
          <a-table-column title="帖子标题" data-index="title" />
          <a-table-column title="回复用户" data-index="username" />
          <a-table-column title="回复内容" data-index="content"> </a-table-column>
          <a-table-column title="回复时间" data-index="createTime">
            <template #cell="{ record }">
              {{ format?.(record.createTime) }}
            </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-popconfirm :content="`是否确定要删除: ${record.title}`" @ok="deleteData(record.id, handleData)">
                <a-button type="text" status="danger" size="small"> 删除 </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { deleteCommentById, getCommentList } from '@/api/comment'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useTable from '@/hooks/useTable'
import { useUpdaterStore } from '@/store'
import { formateDateKey, handleCodeKey } from '@/types/provide'
import { inject, onMounted } from 'vue'
// const updateStore =
const updaterStore = useUpdaterStore()

const format = inject(formateDateKey)
const handleCode = inject(handleCodeKey)
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } = useTable(
  getCommentList,
  deleteCommentById
)

const handleData = async () => {
  renderData.value = renderData.value.map((i: any) => {
    const username = updaterStore.getUserById(i.userId)?.username || '已注销'
    console.log('updaterStore.getUserById(i.userId): ', updaterStore.getUserById(i.userId))
    const title = updaterStore.getPostById(i.postId)?.title || '暂无'
    return {
      ...i,
      title,
      username,
    }
  })
}

onMounted(async () => {
  await updaterStore.fetchAllPost()
  await updaterStore.fetchAllUser()
  fetchData(handleData)
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
