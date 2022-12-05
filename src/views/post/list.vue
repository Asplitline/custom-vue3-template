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
        @page-change="(v) => onPageChange(v, fetchCategory)"
      >
        <template #columns>
          <a-table-column title="标题" data-index="title" />

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
              <a-button type="text" size="small" @click="showModal(record)"> 修改 </a-button>
              <a-popconfirm :content="`是否确定要删除: ${record.name}`" @ok="deleteData(record.id, fetchCategory)">
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
import useForm from '@/hooks/useForm'
import useTable from '@/hooks/useTable'
import { formateDateKey, handleCodeKey } from '@/types/provide'
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { formRef, formModel, resetForm } = useForm()
const format = inject(formateDateKey)
const handleCode = inject(handleCodeKey)
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } = useTable(getPostList, deletePostById)
console.log('renderData: ', renderData)
const router = useRouter()

const submitForm = () => {
  // formRef.value.validate(async (err) => {
  //   if (err) return
  //   if (isEdit.value) {
  //     const { success } = await updatePlant({
  //       ...formModel.value,
  //       address: formModel.value.address.join('-'),
  //       updateTime: Date.now(),
  //     })
  //     handleCode?.(success, ['修改植物成功', '修改植物失败'], () => reload())
  //   } else {
  //     const { success } = await addPlant({
  //       ...formModel.value,
  //       address: formModel.value.address.join('-'),
  //       status: 0,
  //     })
  //     handleCode?.(success, ['添加植物成功', '添加植物失败'], () => reload())
  //   }
  // })
}
// watch(renderData, (pre, cur) => {
//   console.log('pre :', pre)
//   console.log('cur :', cur)
// })
const skipPostEditor = () => {
  router.push({ name: 'post-editor' })
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
