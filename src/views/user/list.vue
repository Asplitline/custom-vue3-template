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
        :expandable="expandable"
        @page-change="onPageChange"
      >
        <template #expand-row="{ record }">
          <a-descriptions
            class="desc"
            :data="handleRow(record)"
            :column="1"
          ></a-descriptions>
        </template>
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
          <a-table-column title="创建时间" data-index="ctime">
            <template #cell="{ record }"> {{ format(record.ctime) }} </template>
          </a-table-column>
          <a-table-column title="更新时间" data-index="utime">
            <template #cell="{ record }"> {{ format(record.utime) }} </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="showModal(record)">
                修改
              </a-button>
              <a-popconfirm
                :content="`是否确定要删除: ${record.name}`"
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
import { deleteUserById, getUserList } from '@/api/user'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useTable from '@/hooks/useTable'
import { inject, onMounted, reactive } from 'vue'

const { formRef, formModel, resetForm } = useForm()
const {
  isEdit,
  modalVisible,
  showModal: _showModal,
  cancelModal: _cancelModal,
  clearModal: _clearModal,
} = useModal()
const format = inject('formateDate')
const expandable = reactive({
  title: '#',
  width: 80,
})
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getUserList, deleteUserById)

const handleRow = (row) => {
  const res = [
    { label: '账号', value: row.username },
    { label: '昵称', value: row.name },
    { label: '电子邮箱', value: row.email },
    { label: '性别', value: row.state === '0' ? '男' : '女' },
    { label: 'QQ', value: row.qq },
    { label: '手机号', value: row.phone },
    { label: '个人简介', value: row.description },
  ]
  return res
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
