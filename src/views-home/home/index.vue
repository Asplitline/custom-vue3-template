<template>
  <div>
    <a-row :gutter="20">
      <a-col :span="16">
        <banner-card title="农产轮播">
          <div class="fcc">
            <a-carousel
              :style="{
                width: '70vw',
                height: '400px',
              }"
              :default-current="2"
            >
              <a-carousel-item
                v-for="(image, index) in carouselList"
                :key="index"
              >
                <img
                  :src="bindImg(image.url)"
                  :style="{
                    width: '100%',
                  }"
                />
              </a-carousel-item>
            </a-carousel>
          </div>
        </banner-card>
      </a-col>
      <a-col :span="8">
        <banner-card title="农产分类">
          <ul class="category-list">
            <li
              v-for="(category, index) in categoryList"
              :key="index"
              class="category-item"
              @click="gotoCategory(category)"
            >
              <img :src="bindImg(category.icon)" alt="" class="category-icon" />
              <span>{{ category.name }}</span>
            </li>
            <template v-if="categoryList.length < 8">
              <li
                v-for="(category, index) in 8 - categoryList.length"
                :key="index"
                class="category-item disabled"
              >
                <img
                  src="@/assets/images/avatar_10019_clear.png"
                  alt=""
                  class="category-icon"
                />
                <span>敬请期待</span>
              </li>
            </template>
          </ul>
        </banner-card>
      </a-col>
    </a-row>

    <a-row :gutter="20">
      <a-col :span="16">
        <banner-card title="常见参数">
          <a-table
            row-key="id"
            :data="renderData"
            :bordered="false"
            :pagination="false"
          >
            <template #columns>
              <a-table-column title="作物类型" data-index="type">
                <template #cell="{ record }">
                  {{
                    cacheStore.getCategory(record.type)?.name || '无'
                  }}</template
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
            </template>
          </a-table>
        </banner-card>
      </a-col>
      <a-col :span="8">
        <banner-card title="科普文章">
          <template v-if="postList.length">
            <ul class="post-list">
              <li
                v-for="post in postList"
                :key="post.id"
                class="post-item"
                @click="gotoPost(post)"
              >
                <span class="title">{{ post.title }}{{ post.title }}</span>
                <span class="date">{{
                  formateDate(post.createTime, 'YYYY-MM-DD')
                }}</span>
              </li>
            </ul>
            <a-pagination
              :total="postQuery.total"
              :page-size="postQuery.size"
              :current="postQuery.page"
              @change="handlePostPageChange"
            />
          </template>
          <div v-else>暂无文章</div>
        </banner-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { getCarouselList } from '@/api/carousel'
import BannerCard from '@/components/banner-card/index.vue'
import { onMounted, ref, inject, computed } from 'vue'
import useStatic, { Unit } from '@/hooks/useStatic'
import { useCacheStore } from '@/store'
import { getContentList } from '@/api/content'
import { getConfigList } from '@/api/other'
import { useRouter } from 'vue-router'

const carouselList = ref([])
const { bindImg, formatValue } = useStatic()
const formateDate = inject('formateDate')
const fetchCarousel = async () => {
  const { list } = await getCarouselList({ page: 1, size: 999 })
  carouselList.value = list.filter((i) => +i.status === 1).slice(0, 5)
  console.log('list: ', list)
}
const cacheStore = useCacheStore()

const categoryList = computed(() => {
  return cacheStore.pCategory.slice(0, 8)
})

const postList = ref([])
const postQuery = ref({
  page: 1,
  size: 12,
  total: 10,
})
const fetchPostList = async () => {
  const { list, total } = await getContentList(postQuery.value)
  postQuery.value.total = total
  postList.value = list
}

const renderData = ref([])
const fetchConfigList = async () => {
  const { list } = await getConfigList({ page: 1, size: 10 })
  console.log('list: ', list)
  renderData.value = list
}
const router = useRouter()
const gotoCategory = (item) => {
  router.push({ name: 'home-product', query: { id: item.id } })
}
const handlePostPageChange = (v) => {
  postQuery.value.page = v
  fetchPostList()
}
const gotoPost = (item) => {
  router.push({ name: 'home-post', params: { id: item.id } })
}
onMounted(() => {
  fetchCarousel()
  fetchPostList()
  fetchConfigList()
  cacheStore.getAllCategory()
})
</script>

<style lang="less" scoped>
.fcc {
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  .category-item {
    width: 48%;
    display: flex;
    align-items: center;

    background-color: #fff;
    margin-bottom: 20px;
    justify-content: space-evenly;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #0fcea8;
    transition: all 0.2s linear;
    &.disabled {
      opacity: 0.7;
      pointer-events: none;
    }
    img {
      width: 40px;
      height: 40px;
    }
    span {
      font-size: 16px;
      color: #3f3f3f;
      margin-right: 20px;
    }
    &:nth-child(2n + 1) {
      margin-right: 4%;
    }
    &:hover {
      background-color: #0fcea8;
      cursor: pointer;
      span {
        color: #fff;
      }
    }
  }
}
.post-list {
  .post-item {
    display: flex;
    align-items: center;
    height: 40px;

    .span {
      display: inline-block;
      font-size: 14px;
    }

    .title {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:hover {
        cursor: pointer;
        color: #0fc0c0;
      }
    }
    .date {
      font-size: 12px;
      width: 80px;
      text-align: right;
    }
  }
}
</style>
