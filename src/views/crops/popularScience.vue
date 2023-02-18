<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <a-row style="margin-bottom: 20px">
        <a-col :span="24" style="text-align: right">
          <a-space>
            <a-button type="primary" @click="skip()">
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
          <!-- <a-table-column title="封面" data-index="url">
            <template #cell="{ record }">
              <cs-image width="60" height="60" :src="record.url"></cs-image>
            </template>
          </a-table-column> -->
          <a-table-column title="标题" data-index="title" />
          <!-- <a-table-column title="分类" data-index="lx">
            <template #cell="{ record }">
              <a-tag v-if="record.category?.name" color="blue">{{
                record.category.name
              }}</a-tag>
              <a-tag v-else color="gray"> 未知分类 </a-tag>
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
              <a-button type="text" size="small" @click="skipDetail(record)">
                修改
              </a-button>
              <a-popconfirm
                :content="`是否确定要删除: ${record.title}`"
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
import { deleteContentById, getContentList } from '@/api/content'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useTable from '@/hooks/useTable'
import { useCacheStore } from '@/store'
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getContentList, deleteContentById)

const router = useRouter()
const cacheStore = useCacheStore()
const format = inject('formateDate')
const skip = (id: any) => {
  if (id) {
    router.push({ name: 'up-popular-science', params: { id } })
  } else {
    router.push({ name: 'up-popular-science' })
  }
}

const skipDetail = (record: any) => {
  cacheStore.setPopularScience(record)
  skip(record.id)
}
onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less" scoped>
.desc {
  padding-left: 60px;
}
</style>
