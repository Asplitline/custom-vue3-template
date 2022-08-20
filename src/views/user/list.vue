<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <a-row style="margin-bottom: 20px">
        <a-col :span="24" style="text-align: right">
          <a-space>
            <a-button type="primary" @click="showModal()">
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
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="(number) => onPageChange"
      >
        <template #columns>
          <a-table-column title="头像" data-index="url">
            <template #cell="{ record }">
              <cs-image width="60" height="60" :src="record.url"></cs-image>
            </template>
          </a-table-column>
          <a-table-column title="用户名" data-index="username" />
          <a-table-column title="昵称" data-index="name" />
          <a-table-column title="身份" data-index="level">
            <template #cell="{ record }">
              <a-tag v-if="record.level == 1" color="red">管理员 </a-tag>
              <a-tag v-else color="blue">小程序用户</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="state">
            <template #cell="{ record }">
              <a-tag v-if="record.state == 1" color="red">异常 </a-tag>
              <a-tag v-else color="green">正常</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="ctime" />
          <a-table-column title="更新时间" data-index="utime" />

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="showModal(record)">
                修改
              </a-button>

              <a-popconfirm
                :content="`是否确定要删除: ${record.name}`"
                @ok="handleDelete(record.id)"
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
import { getUserList } from '@/api/user'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useTable from '@/hooks/useTable'
import { onMounted, ref } from 'vue'

const formModel = ref({})
const showModal = () => {}
const handleDelete = () => {}

const {
  pagination,
  searchModel,
  renderData,
  fetchData,
  onPageChange,
  loading,
  search,
  reset,
} = useTable(getUserList)
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped></style>
