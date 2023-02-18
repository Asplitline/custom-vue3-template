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
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="作物类型" data-index="type">
            <template #cell="{ record }">
              {{ cacheStore.getCategory(record.type)?.name || '无' }}</template
            >
          </a-table-column>
          <a-table-column title="作物名称" data-index="name" />
          <a-table-column title="温度" data-index="temperature">
            <template #cell="{ record }">
              {{ formatValue(record.temperature, Unit.temperature) }}
            </template>
          </a-table-column>
          <a-table-column title="湿度" data-index="humidity">
            <template #cell="{ record }">
              {{ formatValue(record.humidity, Unit.humidity) }}
            </template>
          </a-table-column>

          <a-table-column title="二氧化碳浓度" data-index="carbonDioxide">
            <template #cell="{ record }">
              {{ formatValue(record.carbonDioxide, Unit.carbonDioxide) }}
            </template>
          </a-table-column>
          <a-table-column title="日照时间" data-index="sunshineTime">
            <template #cell="{ record }">
              {{ formatValue(record.sunshineTime, Unit.sunshineTime) }}
            </template>
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
    <!-- todo a-modal -->
    <a-modal
      v-if="modalVisible"
      v-model:visible="modalVisible"
      unmount-on-close
      @before-ok="confirmModal"
    >
      <template #title
        >{{ isEdit ? '修改阈值配置' : '新增阈值配置' }}
      </template>

      <div>
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          autocomplete="off"
        >
          <!-- <template v-if="modalVisible"> -->
          <a-form-item field="type" label="作物类型">
            <a-select
              v-model="formModel.type"
              :style="{ width: '100%' }"
              placeholder="请选择作物类型"
            >
              <a-option
                v-for="option in cacheStore.pCategory"
                :key="option.id"
                :value="option.id"
                >{{ option.name }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="name" label="作物名称">
            <a-input v-model="formModel.name" placeholder="请输入农作物名称" />
          </a-form-item>
          <a-form-item field="temperature" label="温度">
            <double-input-number
              v-model="formModel.temperature"
            ></double-input-number>
          </a-form-item>
          <a-form-item field="humidity" label="湿度">
            <double-input-number
              v-model="formModel.humidity"
            ></double-input-number>
          </a-form-item>
          <a-form-item field="carbonDioxide" label="二氧化碳浓度">
            <double-input-number v-model="formModel.carbonDioxide" />
          </a-form-item>
          <a-form-item field="sunshineTime" label="日照时间">
            <double-input-number v-model="formModel.sunshineTime" />
          </a-form-item>
          <!-- </template> -->
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
import {
  addConfig,
  deleteConfigById,
  getConfigList,
  updateConfig,
} from '@/api/other'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import DoubleInputNumber from '@/components/double-input-number/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useStatic, { Unit } from '@/hooks/useStatic'
import useTable from '@/hooks/useTable'
import { useCacheStore } from '@/store'
import { deepClone } from '@/utils/tools'
import { inject, onMounted, reactive } from 'vue'

const { formRef, formModel } = useForm()
const { isEdit, modalVisible, cancelModal } = useModal()
const showModal = (row) => {
  if (row) {
    formModel.value = deepClone(row)
    isEdit.value = true
  } else {
    formModel.value = {}
    isEdit.value = false
  }
  modalVisible.value = true
}

const format = inject('formateDate')
const handleCode = inject('handleCode')
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getConfigList, deleteConfigById)
const cacheStore = useCacheStore()

const { parseValue, formatValue } = useStatic()
const formRules = reactive({
  type: [{ required: true, message: '请选择作物类型' }],
  name: [{ required: true, message: '请输入农作物名称' }],
})

const reload = () => {
  cancelModal()
  fetchData()
}

const submitForm = async () => {
  formRef.value.validate(async (err) => {
    if (err) return
    if (isEdit.value) {
      const { success } = await updateConfig(formModel.value)
      handleCode(success, ['修改用户成功', '修改用户失败'], () => reload())
    } else {
      const { success } = await addConfig(formModel.value)
      handleCode(success, ['添加用户成功', '添加用户失败'], () => reload())
    }
  })
}

const confirmModal = () => submitForm()
onMounted(async () => {
  cacheStore.getAllCategory()
  await fetchData()
  console.log('renderData: ', renderData.value)
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
