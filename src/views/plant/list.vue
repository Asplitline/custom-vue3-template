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
          <a-table-column title="植物插图" data-index="url">
            <template #cell="{ record }">
              <cs-image width="60" height="60" :src="record.url"></cs-image>
            </template>
          </a-table-column>
          <a-table-column title="植物名称" data-index="name" />
          <a-table-column title="植物分类" data-index="type">
            <template #cell="{ record }">
              <a-tag v-if="record.category?.name" color="blue">{{
                record.category.name
              }}</a-tag>
              <a-tag v-else color="gray"> 未知分类 </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="植物价格" data-index="price" />
          <a-table-column title="种植地点" data-index="address" />
          <a-table-column title="当前库存" data-index="num" />
          <a-table-column title="售卖状态" data-index="status">
            <template #cell="{ record }">
              <a-tag v-if="record.status == 0" color="gray">未上架 </a-tag>
              <a-tag v-else-if="record.status == 1" color="blue"> 已上架</a-tag>
              <a-tag v-else color="red"> 已售罄</a-tag>
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
      @before-ok="confirmModal"
      @before-close="clearModal"
    >
      <template #title>{{ isEdit ? '修改用户' : '新增用户' }} </template>
      <div>
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          autocomplete="off"
        >
          <a-form-item field="name" label="植物名称">
            <a-input v-model="formModel.name" placeholder="请输入植物名称" />
          </a-form-item>
          <a-form-item field="type" label="植物分类">
            <a-select v-model="formModel.type" placeholder="请选择植物分类">
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
          <a-form-item field="price" label="植物价格">
            <a-input-number
              v-model="formModel.price"
              placeholder="请输入植物价格"
              :min="1"
            />
          </a-form-item>
          <a-form-item field="address" label="种植地点">
            <a-select
              v-model="formModel.address"
              placeholder="请选择种植地点"
              multiple
            >
              <a-option>窗台</a-option>
              <a-option>楼顶</a-option>
              <a-option>庭院</a-option>
              <a-option>花园</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="num" label="当前库存">
            <a-input-number
              v-model="formModel.num"
              placeholder="请输入当前库存"
              :min="1"
            />
          </a-form-item>

          <a-form-item v-if="isEdit" field="status" label="售卖状态">
            <a-radio-group v-model="formModel.status" :default-value="false">
              <a-radio :value="0">未上架</a-radio>
              <a-radio :value="1">已上架</a-radio>
              <a-radio :value="2">已售罄</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item field="url" label="植物插图">
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
  addPlant,
  deletePlantById,
  getPlantList,
  updatePlant,
} from '@/api/plant'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useTable from '@/hooks/useTable'
import useUpload from '@/hooks/useUpload'
import { deepClone } from '@/utils/tools'
import { inject, onMounted, reactive, ref, watch } from 'vue'

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
  useTable(getPlantList, deletePlantById)
const newRenderData = ref([])
const options = ref()

const formRules = reactive({
  name: [{ required: true, message: '请输入植物名称' }],
  type: [{ required: true, message: '请输入植物分类' }],
  price: [{ required: true, message: '请输入植物价格' }],
  address: [{ required: true, message: '请输入种植地点' }],
  num: [{ required: true, message: '请输入当前库存' }],
  status: [{ required: true, message: '请选择售卖状态' }],
  url: [{ required: true, message: '请选择用户头像' }],
})

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
  console.log('newRenderData.value :', newRenderData.value)
}

const showModal = (row?: any) => {
  _showModal(formModel, () => {
    if (row) {
      isEdit.value = true
      file.value = { url: row.url }
      formModel.value = deepClone({ ...row, address: row.address.split('-') })
    } else {
      isEdit.value = false
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
      const { success } = await updatePlant({
        ...formModel.value,
        address: formModel.value.address.join('-'),
        updateTime: Date.now(),
      })
      handleCode(success, ['修改植物成功', '修改植物失败'], () => reload())
    } else {
      const { success } = await addPlant({
        ...formModel.value,
        address: formModel.value.address.join('-'),
        status: 0,
      })
      handleCode(success, ['添加植物成功', '添加植物失败'], () => reload())
    }
  })
}
// watch(renderData, (pre, cur) => {
//   console.log('pre :', pre)
//   console.log('cur :', cur)
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
</style>
