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
          <a-table-column title="商品名称" data-index="goodsName" />
          <a-table-column title="成交数量" data-index="num" />
          <a-table-column title="成交金额" data-index="price">
            <template #cell="{ record }">
              <a-tag color="#7bc616"> ￥{{ record.price }} </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="订单状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="getCurrentStatus(record.status).color">
                {{ getCurrentStatus(record.status).label }}</a-tag
              >
            </template>
          </a-table-column>

          <a-table-column title="创建时间" data-index="createTime">
            <template #cell="{ record }">
              {{ format(record.createTime) }}
            </template>
          </a-table-column>
          <a-table-column title="更新时间" data-index="updateTime">
            <template #cell="{ record }">
              {{ format(record.updateTime) }}
            </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="newShowModal(record)">
                订单管理
              </a-button>
              <a-popconfirm
                :content="`是否确定要删除: ${record.goodsName}`"
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

    <a-modal
      v-model:visible="modalVisible"
      @before-ok="confirmModal"
      @before-close="clearModal"
    >
      <template #title> 订单处理 </template>
      <div>
        <a-steps :current="currentStep" label-placement="vertical">
          <a-step description="等待商家出货">出货</a-step>
          <a-step description="等待用户签收">签收</a-step>
          <a-step description="交易成功">成功</a-step>
        </a-steps></div
      >
      <template #footer>
        <a-button @click="cancelModal">取消</a-button>
        <a-button
          type="primary"
          :disabled="currentStatus.disabled"
          @click="submitForm"
          >{{ currentStatus.submitText }}</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  addPlantOrder,
  deletePlantOrderById,
  getPlantOrderList,
  updatePlantOrder,
} from '@/api/order'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useTable from '@/hooks/useTable'
import { deepClone } from '@/utils/tools'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'

const { formRef, formModel, resetForm } = useForm()
const { isEdit, modalVisible, showModal, cancelModal, clearModal } = useModal()
const format = inject('formateDate')
const handleCode = inject('handleCode')
const currentStep = ref(0)
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getPlantOrderList, deletePlantOrderById)
const currentStatus = ref({})

const options = ref([
  {
    label: '-',
    status: -1,
    color: 'gray',
    disabled: true,
    submitText: '未知状态',
  },
  {
    label: '待出货',
    status: 0,
    color: 'gray',
    disabled: false,
    submitText: '出货',
    nextStatus: 1,
  },
  {
    label: '已出货',
    status: 1,
    color: 'gold',
    disabled: true,
    submitText: '等待用户签收',
    nextStatus: 2,
  },
  {
    label: '已签收',
    status: 2,
    color: 'blue',
    disabled: false,
    submitText: '关闭交易',
    nextStatus: 3,
  },
  {
    label: '交易完成',
    status: 3,
    disabled: true,
    color: 'green',
    submitText: '交易完成',
  },
])

// const showModal = ()
const getCurrentStatus = (status: number) => {
  return options.value.find((i) => i.status === status) || options.value[0]
}
const newShowModal = (row) => {
  showModal(undefined, () => {
    formModel.value = deepClone(row)
    currentStep.value = row.status
    currentStatus.value = getCurrentStatus(row.status)
    // return options.value[idx]
  })
}
const reload = () => {
  cancelModal()
  fetchData()
}

const submitForm = async () => {
  const currentText = currentStatus.value.submitText
  const { success } = await updatePlantOrder({
    ...formModel.value,
    status: currentStatus.value?.nextStatus,
  })
  handleCode(success, [`${currentText}成功`, `${currentText}失败`], () =>
    reload()
  )
}

const confirmModal = () => submitForm()
onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
