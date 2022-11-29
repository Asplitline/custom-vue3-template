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
          <a-table-column title="投诉标题" data-index="title" />
          <a-table-column title="投诉内容" data-index="description" />
          <!-- <a-table-column title="用户" data-index="userid" /> -->
          <a-table-column title="当前" data-index="state">
            <template #cell="{ record }">
              <a-tag v-if="record.state == 0" color="gray">未回复 </a-tag>
              <a-tag v-else-if="record.state == 1" color="blue"> 已处理</a-tag>
            </template>
          </a-table-column>

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
              <a-button type="text" size="small" :disabled="record.state == 1" @click="showModal(record)">
                处理
              </a-button>
              <a-popconfirm :content="`是否确定要删除: ${record.title}`" @ok="deleteData(record.id)">
                <a-button type="text" status="danger" size="small"> 删除 </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="modalVisible" @before-ok="confirmModal" @before-close="clearModal">
      <template #title>处理投诉 </template>
      <div>
        <a-form ref="formRef" :model="formModel" :rules="formRules" autocomplete="off">
          <a-form-item field="title" label="标题">
            <a-input v-model="formModel.title" readonly />
          </a-form-item>
          <a-form-item field="description" label="内容">
            <a-textarea v-model="formModel.description" readonly />
          </a-form-item>
          <a-form-item field="content" label="回复">
            <a-textarea v-model="formModel.content" />
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="cancelModal">取消</a-button>
        <a-button type="primary" @click="submitForm">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { deleteAdviceById, getAdviceList, updateAdvice } from '@/api/advice'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useTable from '@/hooks/useTable'
import { deepClone } from '@/utils/tools'
import { inject, onMounted, reactive } from 'vue'

const { formRef, formModel, resetForm } = useForm()
const { isEdit, modalVisible, showModal: _showModal, cancelModal: _cancelModal, clearModal: _clearModal } = useModal()
const format = inject('formateDate')
const handleCode = inject('handleCode')

const { pagination, renderData, fetchData, onPageChange, loading, deleteData } = useTable(
  getAdviceList,
  deleteAdviceById
)

const formRules = reactive({
  name: [{ required: true, message: '请输入植物名称' }],
})

const showModal = (row?: any) => {
  _showModal(formModel, () => {
    formModel.value = deepClone(row)
  })
}

const cancelModal = () => _cancelModal(() => {})

const reload = () => {
  cancelModal()
  fetchData()
}

const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    const { success } = await updateAdvice({
      ...formModel.value,
      state: 1,
      utime: Date.now(),
    })
    handleCode(success, ['处理投诉成功', '处理投诉失败'], () => reload())
    // if (isEdit.value) {
    //   const { success } = await updateAdvice({
    //     ...formModel.value,
    //     address: formModel.value.address.join('-'),
    //     updateTime: Date.now(),
    //   })
    //   handleCode(success, ['修改植物成功', '修改植物失败'], () => reload())
    // } else {
    //   const { success } = await addAdvice({
    //     ...formModel.value,
    //     address: formModel.value.address.join('-'),
    //     status: 0,
    //   })
    //   handleCode(success, ['添加植物成功', '添加植物失败'], () => reload())
    // }
  })
}
// watch(renderData, (pre, cur) => {
//   console.log('pre :', pre)
//   console.log('cur :', cur)
// })
const confirmModal = () => submitForm()
onMounted(async () => {
  await fetchData()
  console.log('renderData.value: ', renderData.value)
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
