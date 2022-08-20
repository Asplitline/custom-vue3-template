import { resolve } from 'path'
import { PaginationProps } from '@arco-design/web-vue'
import { ref } from 'vue'
import { deepClone } from '@/utils/tools'
import { QueryParams } from '../api/common'
import useLoading from './loading'

interface TableOptions {
  searchDefault?: QueryParams
  paginationDefault?: PaginationProps
}

const searchModelDef = {
  page: 1,
  size: 10,
  keyword: '',
}
const paginationDef = {
  total: 1,
  current: 1,
  pageSize: 10,
}

export default function useTable(
  fetchApi: (params: QueryParams) => any,
  options: TableOptions = {}
) {
  const { searchDefault = searchModelDef, paginationDefault = paginationDef } =
    options

  const searchModel = ref<QueryParams>(searchDefault)
  const { loading, setLoading } = useLoading()

  const pagination = ref<PaginationProps>(paginationDefault)

  const renderData = ref([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { list, total, pageSize, pageNum } = await fetchApi?.(
        searchModel.value
      )
      Object.assign(pagination.value, { total, current: pageNum, pageSize })
      renderData.value = list
    } catch (error) {
      //
      console.log('error: ', error)
    } finally {
      setLoading(false)
    }
  }

  const search = () => {
    fetchData()
  }

  const reset = () => {
    searchModel.value = deepClone(searchModelDef)
    pagination.value = deepClone(paginationDef)
    fetchData()
  }

  const onPageChange = (number: number) => {
    pagination.value.current = number
    fetchData()
  }

  return {
    pagination,
    searchModel,
    renderData,
    fetchData,
    onPageChange,
    loading,
    search,
    reset,
  }
}
