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
          <!-- <a-table-column title="状态" data-index="state">
            <template #cell="{ record }">
              <a-tag v-if="record.state == 1" color="red">异常 </a-tag>
              <a-tag v-else color="green">正常</a-tag>
            </template>
          </a-table-column> -->
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
          <a-form-item field="username" label="用户名">
            <a-input
              v-model="formModel.username"
              placeholder="请输入用户名"
              :readonly="isEdit"
            />
          </a-form-item>
          <a-form-item field="name" label="姓名">
            <a-input v-model="formModel.name" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item v-if="!isEdit" field="password" label="密码">
            <a-input
              v-model="formModel.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="new-password"
            />
          </a-form-item>
          <a-form-item field="gender" label="性别">
            <a-radio-group v-model="formModel.gender" :default-value="false">
              <a-radio value="0">男</a-radio>
              <a-radio value="1">女</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="level" label="身份">
            <a-radio-group v-model="formModel.level" :default-value="false">
              <a-radio value="0">小程序用户</a-radio>
              <a-radio value="1">管理员</a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item field="state" label="状态">
            <a-radio-group v-model="formModel.state">
              <a-radio value="0">正常</a-radio>
              <a-radio value="1">禁用</a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item field="email" label="邮箱">
            <a-input v-model="formModel.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item field="qq" label="QQ">
            <a-input v-model="formModel.qq" placeholder="请输入QQ" />
          </a-form-item>
          <a-form-item field="phone" label="手机号码">
            <a-input v-model="formModel.phone" placeholder="请输入手机号码" />
          </a-form-item>
          <a-form-item field="description" label="个人简介">
            <a-textarea
              v-model="formModel.description"
              placeholder="请输入个人简介"
              allow-clear
            />
          </a-form-item>

          <a-form-item field="url" label="头像">
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
import { deleteUserById, getUserList, updateUser, addUser } from '@/api/user'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useTable from '@/hooks/useTable'
import useUpload from '@/hooks/useUpload'
import { deepClone } from '@/utils/tools'
import { inject, onMounted, reactive } from 'vue'

const format = inject('formateDate')
const handleCode = inject('handleCode')
const expandable = reactive({
  title: '#',
  width: 80,
})
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
  'url'
)

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
const formRules = reactive({
  username: [{ required: true, message: '请输入账号' }],
  name: [{ required: true, message: '请输入用户昵称' }],
  password: [{ required: true, message: '请输入用户密码' }],
  gender: [{ required: true, message: '请选择性别' }],
  level: [{ required: true, message: '请选择身份' }],
  url: [{ required: true, message: '请选择用户头像' }],
})

const showModal = (row?: any) => {
  _showModal(formModel, () => {
    if (row) {
      isEdit.value = true
      file.value = { url: row.url }
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

const clearModal = () => {
  console.log('formModel.value : ', formModel.value)
  formModel.value = {}
  _cancelModal(resetForm)
}

const reload = () => {
  cancelModal()
  fetchData()
}

const submitForm = () => {
  formRef.value.validate(async (err) => {
    if (err) return
    if (isEdit.value) {
      const { success } = await updateUser(formModel.value)
      handleCode(success, ['修改用户成功', '修改用户失败'], () => reload())
    } else {
      const { success } = await addUser(formModel.value)
      handleCode(success, ['添加用户成功', '添加用户失败'], () => reload())
    }
  })
}
const confirmModal = () => submitForm()

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
