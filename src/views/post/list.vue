<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <a-row style="margin-bottom: 20px">
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
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :current="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="标题" data-index="title" />

          <a-table-column title="课题" data-index="lx">
            <template #cell="{ record }">
              {{ findCategory(record.lx)?.name || '无' }}
            </template>
          </a-table-column>

          <a-table-column title="回复数量" data-index="replyNum" />

          <a-table-column title="创建时间" data-index="createTime">
            <template #cell="{ record }">
              {{ format?.(record.createTime) }}
            </template>
          </a-table-column>
          <a-table-column title="更新时间" data-index="updateTime">
            <template #cell="{ record }">
              {{ format?.(record.updateTime) }}
            </template>
          </a-table-column>
          <a-table-column title="上次回复时间" data-index="lastReplyTime">
            <template #cell="{ record }">
              {{ format?.(record.updateTime) }}
            </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="skipPostEditor(record.id)"> 修改 </a-button>
              <a-popconfirm :content="`是否确定要删除: ${record.title}`" @ok="deleteData(record.id)">
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
import { deletePostById, getPostList } from '@/api/post'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useTable from '@/hooks/useTable'
import { formateDateKey } from '@/types/provide'
import { categoryList } from '@/utils/static'
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const format = inject(formateDateKey)
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } = useTable(getPostList, deletePostById)
const router = useRouter()

const findCategory = (lx: number) => {
  return categoryList.find((i) => i.id === +lx)
}
const skipPostEditor = (id?: string) => {
  router.push({ name: 'post-editor', query: { id } })
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
