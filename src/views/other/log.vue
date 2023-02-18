<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="日志内容" data-index="msg" />
          <a-table-column title="操作用户id" data-index="userid" />
          <a-table-column title="操作用户" data-index="username" />
          <a-table-column title="ip地址" data-index="ip"> </a-table-column>

          <a-table-column title="创建时间" data-index="ctime">
            <template #cell="{ record }">
              {{ format(record.ctime) }}
            </template>
          </a-table-column>
          <a-table-column title="更新时间" data-index="utime">
            <template #cell="{ record }">
              {{ format(record.utime) }}
            </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-popconfirm
                :content="`是否确定要删除: ${record.msg}`"
                @ok="deleteData(record.id)"
              >
                <a-button type="text" status="danger" size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { deleteLogById, getLogList } from '@/api/other'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useTable from '@/hooks/useTable'
import { inject, onMounted } from 'vue'

const format = inject('formateDate')

const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getLogList, deleteLogById)
onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
