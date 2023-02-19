<template>
  <div class="">
    <a-table
      row-key="id"
      :pagination="pagination"
      :data="newRenderData"
      :bordered="false"
      @page-change="onPageChange"
    >
      <template #columns>
        <a-table-column title="农产插图" data-index="url">
          <template #cell="{ record }">
            <cs-image width="60" height="60" :src="record.url"></cs-image>
          </template>
        </a-table-column>
        <a-table-column title="农产名称" data-index="crops.name" />
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

        <a-table-column title="处理状态" data-index="state">
          <template #cell="{ record }">
            <a-tag :color="findHandleStatus(+record.state, 'color')">
              {{ findHandleStatus(+record.state, 'text') }}</a-tag
            >
          </template>
        </a-table-column>

        <a-table-column title="创建时间" data-index="ctime">
          <template #cell="{ record }"> {{ format(record.ctime) }} </template>
        </a-table-column>
        <a-table-column title="操作" data-index="operations">
          <template #cell="{ record }">
            <a-button type="text" size="small" @click="newShowModal(record)">
              查看
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal
      v-model:visible="modalVisible"
      :width="800"
      :footer="false"
      @before-ok="confirmModal"
      @before-close="clearModal"
    >
      <template #title> 反馈 </template>
      <ul v-if="modalVisible" class="feedback-list">
        <li class="feedback-item header">
          <span class="name">名称</span>
          <span class="old">标准</span>
          <span class="new">当前</span>
          <span class="res">状态</span>
        </li>
        <li class="feedback-item">
          <span class="name">温度</span>
          <span class="old">
            {{
              formatValue(currentItem?.crops.temperature, Unit.temperature)
            }}</span
          >
          <span class="new">
            {{ formatValue(currentItem.temperature, Unit.temperature) }}</span
          >
          <span class="res">
            <icon-check-circle
              v-if="judgeList?.temperature"
              style="color: #00b42a; font-size: 28px"
            />
            <icon-close-circle v-else style="color: red; font-size: 28px" />
          </span>
        </li>
        <li class="feedback-item">
          <span class="name">湿度</span>
          <span class="old">
            {{ formatValue(currentItem?.crops.humidity, Unit.humidity) }}</span
          >
          <span class="new">
            {{ formatValue(currentItem.humidity, Unit.humidity) }}</span
          >
          <span class="res">
            <icon-check-circle
              v-if="judgeList?.humidity"
              style="color: #00b42a; font-size: 28px" />
            <icon-close-circle v-else style="color: red; font-size: 28px"
          /></span>
        </li>
        <li class="feedback-item">
          <span class="name">二氧化碳浓度</span>
          <span class="old">
            {{
              formatValue(currentItem?.crops.carbonDioxide, Unit.carbonDioxide)
            }}</span
          >
          <span class="new">
            {{
              formatValue(currentItem.carbonDioxide, Unit.carbonDioxide)
            }}</span
          >
          <span class="res">
            <icon-check-circle
              v-if="judgeList?.carbonDioxide"
              style="color: #00b42a; font-size: 28px" />
            <icon-close-circle v-else style="color: red; font-size: 28px"
          /></span>
        </li>
        <li class="feedback-item">
          <span class="name">日照时间</span>
          <span class="old">
            {{
              formatValue(currentItem?.crops.sunshineTime, Unit.sunshineTime)
            }}</span
          >
          <span class="new">
            {{ formatValue(currentItem.sunshineTime, Unit.sunshineTime) }}</span
          >
          <span class="res">
            <icon-check-circle
              v-if="judgeList?.sunshineTime"
              style="color: #00b42a; font-size: 28px" />
            <icon-close-circle v-else style="color: red; font-size: 28px"
          /></span>
        </li>
      </ul>
      <div class="result-box">
        <span>达标率：</span>
        <span class="num">{{ okPercentage }}%</span>
      </div>

      <div>
        <a-textarea
          v-model="currentItem.description"
          disabled
          placeholder="写出建议"
        ></a-textarea>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { getAllCropsList } from '@/api/crops'
import { deleteFeedbackById, getFeedbackList } from '@/api/feedback'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useStatic, { Unit } from '@/hooks/useStatic'
import useTable from '@/hooks/useTable'
import { useUserStore } from '@/store'
import { deepClone } from '@/utils/tools'
import { computed, inject, onMounted, ref } from 'vue'

const { formRef, formModel, resetForm } = useForm()
const { isEdit, modalVisible, showModal, cancelModal, clearModal } = useModal()
const format = inject('formateDate')
const handleCode = inject('handleCode')
const { pagination, renderData, fetchData, onPageChange, loading, deleteData } =
  useTable(getFeedbackList, deleteFeedbackById)
const currentStatus = ref({})
const { formatValue, findHandleStatus, parseValue } = useStatic()
// const showModal = ()

const currentItem = ref({})
const judgeNum = (newVal, range) => {
  const { left, right } = parseValue(range)

  if (+newVal >= left && +newVal <= +right) {
    return true
  }
  return false
}

const judgeList = computed(() => {
  const rangValue = currentItem.value
  const newValue = currentItem.value.crops
  return {
    temperature: judgeNum(rangValue?.temperature, newValue?.temperature),
    humidity: judgeNum(rangValue?.humidity, newValue?.humidity),
    carbonDioxide: judgeNum(rangValue?.carbonDioxide, newValue?.carbonDioxide),
    sunshineTime: judgeNum(rangValue?.sunshineTime, newValue?.sunshineTime),
  }
})

const okPercentage = computed(() => {
  const all = Object.values(judgeList.value).length
  const ok = Object.values(judgeList.value).filter((i) => i).length
  return (ok / all) * 100
})

const newShowModal = (row) => {
  currentItem.value = deepClone(row)
  formModel.value = deepClone(row)
  showModal()
}
const reload = () => {
  cancelModal()
  fetchData()
}

const userStore = useUserStore()
const newRenderData = ref([])
const newFetchData = async () => {
  await fetchData()

  const { data } = await getAllCropsList()
  newRenderData.value = renderData.value
    .filter((i) => i.userid === userStore.info.id)
    .map((i) => {
      const crops = data.find((j) => j.id === i.cropsId) || { name: '未知' }
      return {
        ...i,
        crops,
      }
    })
}

onMounted(async () => {
  await userStore.getAllUser()

  await newFetchData()
})
</script>

<style lang="less" scoped>
.feedback-list {
  .feedback-item {
    display: flex;
    span {
      flex: 2;
      padding: 10px 0;
    }
    span:nth-child(4) {
      flex: 1;
    }

    &.header {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
.result-box {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  margin-right: 30px;
  .num {
    font-size: 20px;
  }
}
</style>
