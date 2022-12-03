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
        :current="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="轮播图" data-index="url">
            <template #cell="{ record }">
              <cs-image width="60" height="60" :src="record.url"></cs-image>
            </template>
          </a-table-column>
          <a-table-column title="标题" data-index="title" />
          <a-table-column title="描述" data-index="description" :width="400" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="record.status !== '1' ? 'green' : 'red'">
                {{ record.status !== '1' ? '有效' : '失效' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="ctime">
            <template #cell="{ record }"> {{ format?.(record.ctime) }} </template>
          </a-table-column>
          <a-table-column title="更新时间" data-index="utime">
            <template #cell="{ record }"> {{ format?.(record.utime) }} </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="showModal(record)"> 修改 </a-button>
              <a-popconfirm :content="`是否确定要删除: ${record.title}`" @ok="deleteData(record.id)">
                <a-button type="text" status="danger" size="small"> 删除 </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="modalVisible" @before-ok="confirmModal">
      <template #title>{{ isEdit ? '修改轮播图' : '新增轮播图' }} </template>
      <div>
        <a-form ref="formRef" :model="formModel" :rules="formRules">
          <a-form-item field="title" label="标题">
            <a-input v-model="formModel.title" placeholder="请输入轮播图标题" />
          </a-form-item>
          <a-form-item field="description" label="描述">
            <a-input v-model="formModel.description" placeholder="请输入轮播图描述" />
          </a-form-item>
          <a-form-item field="img" label="轮播图">
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
                    file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
                  }`"
                >
                  <div v-if="file && file.url" class="arco-upload-list-picture custom-upload-avatar">
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
                      <div style="margin-top: 10px; font-weight: 600">Upload</div>
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
import { addCarousel, deleteCarouselById, getCarouselList, updateCarousel } from '@/api/carousel'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useTable from '@/hooks/useTable'
import useUpload from '@/hooks/useUpload'
import { inject, onMounted, reactive } from 'vue'
import { formateDateKey, handleCodeKey } from '@/types/provide'

const format = inject(formateDateKey)
const handleCode = inject(handleCodeKey)

const { formRef, formModel, resetForm } = useForm()
const { isEdit, modalVisible, showModal: _showModal, cancelModal: _cancelModal } = useModal(formModel)
const { customRequest, file, onChange, onProgress } = useUpload(formModel, 'url')
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } = useTable(
  getCarouselList,
  deleteCarouselById
)

const formRules = reactive({
  title: [{ required: true, message: '请输入轮播图标题' }],
  description: [{ required: true, message: '请输入轮播图描述' }],
  url: [{ required: true, message: '请选择轮播图' }],
})

const showModal = (row?: any) => {
  console.log('row: ', row)
  _showModal(row)
  if (row?.url) {
    file.value = { url: row.url }
  }
}
const cancelModal = () => {
  _cancelModal()
  resetForm()
  file.value = null
}

const reload = () => {
  cancelModal()
  fetchData()
}
const submitForm = () => {
  formRef.value.validate(async (err: any) => {
    if (err) return
    if (isEdit.value) {
      const { success } = await updateCarousel(formModel.value)
      handleCode?.(success, ['修改轮播图成功', '修改轮播图失败'], () => reload())
    } else {
      const { success } = await addCarousel(formModel.value)
      handleCode?.(success, ['添加轮播图成功', '添加轮播图失败'], () => reload())
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
