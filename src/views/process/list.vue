<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <a-table
        row-key="id"
        :loading="loading"
        :current="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="当前阶段" data-index="type">
            <template #cell="{ record }">
              {{ findInfoText(record.type) }}
            </template>
          </a-table-column>
          <a-table-column title="申请学生" data-index="name"> </a-table-column>
          <a-table-column title="审核老师" data-index="teacherName"> </a-table-column>
          <a-table-column title="当前状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="statusInfo[record.status].type">
                {{ statusInfo[record.status].text }}
              </a-tag>
            </template>
          </a-table-column>
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
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { getJoinPartyList } from '@/api/joinParty'
import useTable from '@/hooks/useTable'
import { useUpdaterStore } from '@/store'
import { formateDateKey } from '@/types/provide'
import { infoList, statusInfo } from '@/utils/static'
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const format = inject(formateDateKey)
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } = useTable(getJoinPartyList)
const router = useRouter()

const updaterStore = useUpdaterStore()

const findInfoText = (type: number) => {
  return infoList.find((i) => i.status === type)?.text || '未知'
}

const handleRenderData = async () => {
  await fetchData()
  renderData.value = renderData.value.map((i) => {
    return {
      ...i,
    }
  })
  console.log('uo :', updaterStore.userList)
}

onMounted(async () => {
  await updaterStore.fetchAllUser()
  handleRenderData()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
