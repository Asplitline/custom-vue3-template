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
        :data="newRenderData"
        :bordered="false"
        @page-change="(v) => onPageChange(v, fetchCategory)"
      >
        <template #columns>
          <a-table-column title="农产插图" data-index="url">
            <template #cell="{ record }">
              <cs-image width="60" height="60" :src="record.url"></cs-image>
            </template>
          </a-table-column>
          <a-table-column title="农产名称" data-index="name" />
          <a-table-column title="农产分类" data-index="type">
            <template #cell="{ record }">
              <a-tag v-if="record.category?.name" color="blue">{{
                record.category.name
              }}</a-tag>
              <a-tag v-else color="gray"> 未知分类 </a-tag>
            </template>
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

          <a-table-column title="售卖状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="findProductStatus(record.status, 'color')">{{
                findProductStatus(record.status, 'text')
              }}</a-tag>
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
              <a-button type="text" size="small" @click="showModal(record)">
                修改
              </a-button>
              <a-popconfirm
                :content="`是否确定要删除: ${record.name}`"
                @ok="deleteData(record.id, fetchCategory)"
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
      :key="isEdit ? 'edit' : 'add'"
      v-model:visible="modalVisible"
      unmount-on-close
      @before-ok="confirmModal"
      @before-close="clearModal"
    >
      <template #title>{{ isEdit ? '修改农产' : '新增农产' }} </template>
      <div>
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          autocomplete="off"
        >
          <a-form-item field="name" label="农产名称">
            <a-input v-model="formModel.name" placeholder="请输入农产名称" />
          </a-form-item>
          <a-form-item field="type" label="农产分类">
            <a-select v-model="formModel.type" placeholder="请选择农产分类">
              <a-optgroup
                v-for="option in options"
                :key="option.id"
                :label="option.name"
              >
                <a-option
                  v-for="opt in option.children"
                  :key="opt.id"
                  :value="opt.id"
                  >{{ opt.name }}</a-option
                >
              </a-optgroup>
            </a-select>
          </a-form-item>
          <a-form-item field="status" label="生长阶段">
            <a-select v-model="formModel.status" placeholder="请选择生长阶段">
              <a-option
                v-for="option in productStatus"
                :key="option.value"
                :value="option.value"
                :label="option.text"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select v-model="readId" placeholder="作物参数模板（可选）">
              <a-option
                v-for="config in configList"
                :key="config.id"
                :value="config.id"
                :label="config.name"
              ></a-option>
            </a-select>

            <a-button type="primary" class="read-btn" @click="readConfig"
              >读取模板</a-button
            >
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
          <a-form-item field="address" label="产物地址">
            <a-input v-model="formModel.address" placeholder="请输入产物地址" />
          </a-form-item>

          <a-form-item field="description" label="农产描述">
            <a-textarea
              v-model="formModel.description"
              placeholder="请输入农产描述"
            />
          </a-form-item>
          <a-form-item field="url" label="农产插图">
            <a-upload
              :file-list="file ? [file] : []"
              :show-file-list="false"
              :custom-request="customRequest"
              @change="onChange"
              @progress="onProgress"
            >
              <template #upload-button>
                <div
                  :class="`arco-upload-list-item${
                    file && file.status === 'error'
                      ? ' arco-upload-list-item-error'
                      : ''
                  }`"
                >
                  <div
                    v-if="file && file.url"
                    class="arco-upload-list-picture custom-upload-avatar"
                  >
                    <cs-image v-if="!file.uid" :src="file.url" />
                    <img v-else :src="file.url" />
                    <div class="arco-upload-list-picture-mask">
                      <IconEdit />
                    </div>
                  </div>
                  <div v-else class="arco-upload-picture-card">
                    <div class="arco-upload-picture-card-text">
                      <IconPlus />
                      <div style="margin-top: 10px; font-weight: 600"
                        >Upload</div
                      >
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
          </a-form-item>
        </a-form>
        <a-alert>图片仅支持 gif / png / jpg , 大小不超过 1MB (1024KB)</a-alert>
      </div>
      <template #footer>
        <a-button @click="cancelModal">取消</a-button>
        <a-button type="primary" @click="submitForm">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { getAllCategory } from '@/api/category'
import {
  addCrops,
  deleteCropsById,
  getCropsList,
  updateCrops,
} from '@/api/crops'
import { getAllConfig } from '@/api/other'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import DoubleInputNumber from '@/components/double-input-number/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useStatic, { Unit } from '@/hooks/useStatic'
import useTable from '@/hooks/useTable'
import useUpload from '@/hooks/useUpload'
import { productStatus } from '@/utils/static'
import { deepClone } from '@/utils/tools'
import { Message } from '@arco-design/web-vue'
import { inject, onMounted, reactive, ref } from 'vue'

const { formRef, formModel, resetForm } = useForm()
const {
  isEdit,
  modalVisible,
  showModal: _showModal,
  cancelModal: _cancelModal,
  clearModal: _clearModal,
} = useModal()
const format = inject('formateDate')
const handleCode = inject('handleCode')
const { customRequest, file, onChange, onProgress } = useUpload(
  formModel,
  'url'
)
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getCropsList, deleteCropsById)
const options = ref()
const newRenderData = ref([])
const formRules = reactive({
  name: [{ required: true, message: '请输入农产名称' }],
  type: [{ required: true, message: '请选择农产分类' }],
  status: [{ required: true, message: '请选择生长阶段' }],
  // description: [{ required: true, message: '农产插图' }],
  url: [{ required: true, message: '请选择产物插图' }],
})
const { formatValue, findProductStatus } = useStatic()
const fetchCategory = async () => {
  const { data } = await getAllCategory()
  const parents = data.filter((i) => !i.pid)
  options.value = parents
    .map((i) => {
      const children = data.filter((j) => i.id === j.pid)
      return {
        ...i,
        children,
      }
    })
    .filter((i) => i.children?.length > 0)

  newRenderData.value = renderData.value.map((i) => {
    const category = data.find((j) => j.id === i.type)
    return {
      ...i,
      category,
    }
  })
}
const configList = ref([])
const readId = ref('')
const readConfig = () => {
  if (!readId.value) return Message.error('无法读取空配置')
  const config = configList.value.find((i) => i.id === readId.value)
  formModel.value = {
    ...formModel.value,
    temperature: config.temperature,
    humidity: config.humidity,
    carbonDioxide: config.carbonDioxide,
    sunshineTime: config.sunshineTime,
  }
  return null
}

const clearModal = () => {
  readId.value = ''
  _clearModal()
}
const fetchConfig = async () => {
  const { data } = await getAllConfig()
  configList.value = data
}
const showModal = async (row?: any) => {
  console.log('renderData.value :', renderData.value)
  await fetchConfig()

  _showModal(formModel, () => {
    if (row) {
      isEdit.value = true
      file.value = { url: row.url }
      formModel.value = deepClone(row)
    } else {
      isEdit.value = false
      formModel.value = {}
    }
  })
}

const cancelModal = () =>
  _cancelModal(() => {
    file.value = null
  })

const reload = () => {
  cancelModal()
  fetchData(fetchCategory)
}

const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    if (isEdit.value) {
      const { success } = await updateCrops({
        ...formModel.value,
        updateTime: Date.now(),
      })
      handleCode(success, ['修改农产成功', '修改农产失败'], () => reload())
    } else {
      const { success } = await addCrops({
        ...formModel.value,
      })
      handleCode(success, ['添加农产成功', '添加农产失败'], () => reload())
    }
  })
}
// watch(renderData, (pre, cur) => {
//
//
// })
const confirmModal = () => submitForm()

onMounted(async () => {
  await fetchData()
  fetchCategory()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
.read-btn {
  margin-left: 20px;
}
</style>
