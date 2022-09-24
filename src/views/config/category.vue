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
        :data="filterTableData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="图标" data-index="icon">
            <template #cell="{ record }">
              <cs-image width="60" height="60" :src="record.icon"></cs-image>
            </template>
          </a-table-column>
          <a-table-column title="标题" data-index="name" />
          <a-table-column title="描述" data-index="description" :width="400" />
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
              <!-- v-if="record.pid" -->
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

    <a-modal
      v-model:visible="modalVisible"
      @before-ok="confirmModal"
      @before-close="clearModal"
    >
      <template #title>{{ isEdit ? '修改分类' : '新增分类' }} </template>
      <div>
        <a-form ref="formRef" :model="formModel" :rules="formRules">
          <a-form-item field="pid" label="父级分类">
            <a-select
              v-model="formModel.pid"
              :style="{ width: '100%' }"
              placeholder="请选择父级分类"
              :disabled="!formModel.pid && isEdit"
            >
              <a-option
                v-for="option in parents"
                :key="option.id"
                :value="option.id"
                >{{ option.name }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="name" label="标题">
            <a-input v-model="formModel.name" placeholder="请输入分类标题" />
          </a-form-item>
          <a-form-item field="description" label="描述">
            <a-input
              v-model="formModel.description"
              placeholder="请输入分类描述"
            />
          </a-form-item>
          <a-form-item field="icon" label="分类">
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
                    <a-progress
                      v-if="file.status === 'uploading' && file.percent < 100"
                      :percent="file.percent"
                      type="circle"
                      size="mini"
                      :style="{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translateX(-50%) translateY(-50%)',
                      }"
                    />
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
import {
  getCategoryList,
  deleteCategoryById,
  updateCategory,
  addCategory,
} from '@/api/category'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useTable from '@/hooks/useTable'
import useUpload from '@/hooks/useUpload'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import { deepClone } from '@/utils/tools'
import { computed, inject, onMounted, reactive, ref } from 'vue'

const { formRef, formModel, resetForm } = useForm()
const {
  isEdit,
  modalVisible,
  showModal: _showModal,
  cancelModal: _cancelModal,
  clearModal: _clearModal,
} = useModal()
const { customRequest, file, onChange, onProgress } = useUpload(
  formModel,
  'icon'
)
const format = inject('formateDate')
const handleCode = inject('handleCode')
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getCategoryList, deleteCategoryById, {
    searchDefault: {
      page: 1,
      size: 9999,
      keyword: '',
    },
    paginationDefault: {
      total: 1,
      current: 1,
      pageSize: 9999,
    },
  })

const formRules = reactive({
  name: [{ required: true, message: '请输入分类标题' }],
  description: [{ required: true, message: '请输入分类描述' }],
  icon: [{ required: true, message: '请选择分类图标' }],
})

const showModal = (row?: any) => {
  _showModal(formModel, () => {
    if (row) {
      isEdit.value = true
      file.value = { url: row.icon }
      formModel.value = deepClone(row)
    } else {
      isEdit.value = false
    }
  })
}
const cancelModal = () =>
  _cancelModal(() => {
    file.value = null
  })

const clearModal = () => _cancelModal(resetForm)

const reload = () => {
  cancelModal()
  fetchData()
}

const parents = computed(() => {
  if (renderData.value.length === 0) return []
  const pids = renderData.value.filter((i) => !i.pid).map((i) => i.id)

  const endPids = Array.from(new Set(pids))
  return endPids.map((i) => {
    const parent = renderData.value.find((j) => j.id === i)
    return parent
  })
})

const filterTableData = computed(() => {
  console.log(parents.value)
  if (parents.value.length === 0) return []
  const result = parents.value.map((i) => {
    const children = renderData.value.filter((j) => j.pid === i.id)
    return {
      ...i,
      children,
    }
  })
  return result
})

console.log(filterTableData)

const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    if (isEdit.value) {
      const { success } = await updateCategory({
        ...formModel.value,
        updateTime: Date.now(),
      })
      handleCode(success, ['修改分类成功', '修改分类失败'], () => reload())
    } else {
      const { success } = await addCategory(formModel.value)
      handleCode(success, ['添加分类成功', '添加分类失败'], () => reload())
    }
  })
}
const confirmModal = () => submitForm()

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.arco-upload-list-item {
  margin-top: 0;
}
.desc {
  padding-left: 60px;
}
</style>
