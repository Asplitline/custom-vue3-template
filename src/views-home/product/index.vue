<template>
  <div>
    <ul class="nav-list">
      <li
        class="nav-item"
        :class="{
          active: currentCategoryId === '',
          home: currentCategoryId === '',
        }"
        @click="setActive()"
      >
        <img src="@/assets/images/avatar_10019_clear.png" alt="" />
        <span>全部</span>
      </li>
      <li
        v-for="(i, index) in categoryList"
        :key="index"
        :class="{ active: currentCategoryId === i.id }"
        class="nav-item"
        @click="setActive(i)"
      >
        <img :src="bindImg(i.icon)" alt="" />
        <span>{{ i.name }}</span>
      </li>
    </ul>
    <ul v-if="subCategoryList.length > 0" class="sub-nav-list">
      <li
        v-for="(i, index) in subCategoryList"
        :key="index"
        class="sub-nav-item"
      >
        <img :src="bindImg(i.icon)" alt="" />
        <span>{{ i.name }}</span>
      </li>
    </ul>
    <div v-else class="place"> </div>

    <a-row class="content" :gutter="40">
      <a-col :span="4">
        <banner-card title="生长周期">
          <ul class="aside-list">
            <li
              class="aside-item"
              :class="{ active: currentStatus === '' }"
              @click="setStatus()"
            >
              <img src="@/assets/images/avatar_10019_clear.png" alt="" />
              <span> 全部 </span>
            </li>
            <li
              v-for="status in productStatus"
              :key="status.value"
              class="aside-item"
              :class="{ active: currentStatus === status.value }"
              @click="setStatus(status)"
            >
              <img src="@/assets/images/avatar_10019_clear.png" alt="" />
              <span>
                {{ status.text }}
              </span>
            </li>
          </ul>
        </banner-card>
      </a-col>
      <a-col :span="20">
        <banner-card title="农产列表">
          <template #right>
            <div class="reset-btn" @click="reset">
              <icon-refresh />
              <span>重置条件</span>
            </div>
          </template>

          <ul v-if="newCropsList.length > 0" class="product-list">
            <li
              v-for="crops in newCropsList"
              :key="crops.id"
              class="product-item"
            >
              <img :src="bindImg(crops.url)" alt="" />
              <span>{{ crops.name }}</span>
              <div class="product-params">
                <span>产地</span>
                <span
                  ><a-tag v-if="crops.category?.name" color="#00b2b2">{{
                    crops.category.name
                  }}</a-tag>
                  <a-tag v-else color="gray"> 未知分类 </a-tag></span
                >
              </div>
              <div class="product-params">
                <span>温度</span>
                <span>
                  {{ formatValue(crops.temperature, Unit.temperature) }}</span
                >
              </div>
              <div class="product-params">
                <span>湿度</span>
                <span> {{ formatValue(crops.humidity, Unit.humidity) }}</span>
              </div>
              <div class="product-params">
                <span>二氧化碳浓度</span>
                <span>
                  {{
                    formatValue(crops.carbonDioxide, Unit.carbonDioxide)
                  }}</span
                >
              </div>
              <div class="product-params">
                <span>日照时间</span>
                <span>
                  {{ formatValue(crops.sunshineTime, Unit.sunshineTime) }}</span
                >
              </div>
              <div class="product-params">
                <span>产地</span>
                <span>{{ crops.address || '未知' }}</span>
              </div>
              <div class="product-params">
                <span>当前阶段</span>
                <span>
                  <a-tag :color="findProductStatus(crops.status, 'color')">{{
                    findProductStatus(crops.status, 'text')
                  }}</a-tag>
                </span>
              </div>
              <button
                class="btn"
                :class="{ disabled: !userStore.isLogin }"
                @click="showFeedback(crops)"
                >{{ !userStore.isLogin ? '登陆后才能操作' : '反馈' }}</button
              >
            </li>
          </ul>

          <div v-else> 暂无数据 </div>
        </banner-card>
      </a-col>
    </a-row>

    <a-modal
      v-model:visible="modalVisible"
      unmount-on-close
      @before-ok="confirmModal"
      @before-close="clearModal"
    >
      <template #title> 提交信息 </template>
      <div>
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          autocomplete="off"
          :auto-label-width="true"
        >
          <a-form-item field="temperature" label="温度">
            <a-input-number
              v-model="formModel.temperature"
              :min="0"
              placeholder="请输入温度"
            ></a-input-number>
          </a-form-item>
          <a-form-item field="humidity" label="湿度">
            <a-input-number
              v-model="formModel.humidity"
              :min="0"
              placeholder="请输入湿度"
            ></a-input-number>
          </a-form-item>
          <a-form-item field="carbonDioxide" label="二氧化碳浓度">
            <a-input-number
              v-model="formModel.carbonDioxide"
              :min="0"
              placeholder="请输入二氧化碳浓度"
            />
          </a-form-item>
          <a-form-item field="sunshineTime" label="日照时间">
            <a-input-number
              v-model="formModel.sunshineTime"
              :min="0"
              placeholder="请输入日照时间"
            />
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="cancelModal">取消</a-button>
        <a-button type="primary" @click="confirmModal">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { getCropsList } from '@/api/crops'
import { addHandle } from '@/api/handle'
import BannerCard from '@/components/banner-card/index.vue'
import useForm from '@/hooks/useForm'
import useModal from '@/hooks/useModal'
import useStatic, { Unit } from '@/hooks/useStatic'
import { useCacheStore, useUserStore } from '@/store'
import { productStatus } from '@/utils/static'
import { deepClone } from '@/utils/tools'
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const handleCode = inject('handleCode')

const { formRef, formModel } = useForm()
const { modalVisible, showModal, cancelModal, clearModal } = useModal()
const cacheStore = useCacheStore()
const { bindImg, formatValue, findProductStatus } = useStatic()
const currentCategoryId = ref('')
const categoryList = computed(() => {
  return cacheStore.pCategory.slice(0, 8)
})
const router = useRouter()
const formRules = reactive({
  temperature: [{ required: true, message: '请输入温度' }],
  humidity: [{ required: true, message: '请输入湿度' }],
  carbonDioxide: [{ required: true, message: '请输入二氧化碳浓度' }],
  sunshineTime: [{ required: true, message: '请输入日照时间' }],
})

const subCategoryList = computed(() => {
  return cacheStore.categoryList.filter(
    (i) => i.pid === currentCategoryId.value
  )
})
const setActive = (item?: any) => {
  if (!item) {
    currentCategoryId.value = ''
  } else {
    currentCategoryId.value = item.id
  }
}

const cropsList = ref([])
const currentStatus = ref<number | string>('')
const newCropsList = computed(() => {
  const crops =
    currentStatus.value === ''
      ? cropsList.value
      : cropsList.value.filter((i) => i.status === currentStatus.value)
  if (currentCategoryId.value === '') return crops
  const ids = [
    currentCategoryId.value,
    ...subCategoryList.value.map((i) => i.id),
  ]

  return crops.filter((i) => ids.includes(i.type))
})

const setStatus = (item?: any) => {
  if (!item) {
    currentStatus.value = ''
  } else {
    currentStatus.value = item.value
  }
}
const fetchData = async () => {
  const { list } = await getCropsList({ page: 1, size: 999 })
  cropsList.value = list.map((i) => {
    const category = cacheStore.getCategory(i.type)
    return {
      ...i,
      category,
    }
  })
}
const currentItem = ref([])
const showFeedback = (row: any) => {
  formModel.value = {}
  currentItem.value = deepClone(row)
  showModal()
}
const route = useRoute()

const reset = () => {
  currentStatus.value = ''
  currentCategoryId.value = ''
  if (route.query.id) {
    router.replace({ name: 'home-product' })
  }
}
const userStore = useUserStore()
const confirmModal = () => {
  const payload = {
    ...formModel.value,
    cropsId: currentItem.value.id,
    ctime: Date.now(),
    state: 0,
    url: currentItem.value.url,
    userid: userStore.info.id,
  }

  formRef.value.validate(async (err) => {
    if (err) return
    const { success } = await addHandle(payload)
    handleCode(success, ['添加成功', '添加失败'])
    modalVisible.value = false
  })
}
onMounted(async () => {
  if (route.query.id) {
    currentCategoryId.value = route.query.id as string
  }
  await cacheStore.getAllCategory()
  fetchData()
})
</script>

<style lang="less" scoped>
.nav-list {
  display: flex;
  border-radius: 6px;
  background-color: #00b2b2;

  .nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 140px;
    bottom: 0;
    border-radius: 4px 4px 0 0;
    padding: 6px 20px;
    // transition: bottom 0.2s linear;
    img {
      width: 50px;
      height: 50px;
    }
    span {
      font-size: 18px;
      margin-left: 6px;
      font-weight: bold;
      color: white;
    }
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 20px;
      background: #fff;
    }
    &:hover {
      cursor: pointer;
    }
    &.active {
      background-color: #d5f3f3;
      bottom: -6px;
      left: -2px;
      right: -2px;
      span {
        color: #00b2b2;
      }
    }
    &.home {
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}

.sub-nav-list {
  margin-top: 4px;
  display: flex;
  background-color: #d5f3f3;
  padding: 8px;
  justify-content: center;
  .sub-nav-item {
    display: flex;
    align-items: center;
    min-width: 80px;
    padding: 0 6px;
    img {
      width: 28px;
      height: 28px;
    }
    span {
      font-size: 14px;
      margin-left: 6px;
      color: #222;
    }
  }
}

.place {
  height: 48px;
}

.content {
  margin-top: 20px;
}

.aside-list {
  display: flex;
  flex-direction: column;
  .aside-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    span {
      font-size: 14px;
    }
    img {
      margin-right: 4px;
      width: 30px;
      height: 30px;
    }
    &:hover {
      cursor: pointer;
    }
    &.active {
      color: #00b2b2;
    }
  }
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  .product-item {
    padding: 20px;
    border: 1px solid #00b2b2;
    width: 22%;
    border-radius: 4px;
    margin-right: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    & > span {
      font-size: 18px;
      text-align: center;
      margin-top: 10px;
      line-height: 40px;
    }
    & > img {
      width: 80px;
      height: 80px;
    }
    .product-params {
      width: 100%;
      // min-width: 160px;
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      img {
        width: 20px;
        height: 20px;
      }
      span {
        font-size: 12px;
      }
    }
  }
}

.btn {
  max-width: 200px;
  width: 100%;
  height: 36px;
  background-color: #00b2b2;
  color: #fff;
  outline: none;
  line-height: 36px;
  text-align: center;
  border: 1px solid transparent;
  margin-top: 10px;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  &.disabled {
    pointer-events: none;
    background-color: #ccc;
    color: #222;
  }
}
.reset-btn {
  display: flex;
  align-items: center;
  span {
    color: #222;
    font-size: 14px;
  }
  &:hover {
    cursor: pointer;
  }
}
</style>
