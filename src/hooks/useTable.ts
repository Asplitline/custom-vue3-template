import { resolve } from 'path'
import { Message, PaginationProps } from '@arco-design/web-vue'
import { ref } from 'vue'
import { deepClone } from '@/utils/tools'
import { QueryDeleteParams, QueryParams } from '../api/common'
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
  deleteApi?: (params: QueryDeleteParams) => any,
  options: TableOptions = {}
) {
  const { searchDefault = searchModelDef, paginationDefault = paginationDef } =
    options

  const searchModel = ref<QueryParams>(searchDefault)
  const { loading, setLoading } = useLoading()

  const pagination = ref<PaginationProps>(paginationDefault)

  const renderData = ref([])

  const fetchData = async (callback?: () => void) => {
    try {
      setLoading(true)
      const { list, total, pageSize, pageNum } = await fetchApi?.(
        searchModel.value
      )
      Object.assign(pagination.value, { total, current: pageNum, pageSize })
      renderData.value = list
      callback?.()
    } catch (error) {
      //
      console.log('error: ', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteData = async (id: string | number, callback?: () => void) => {
    try {
      const { success } = await deleteApi?.({ id })
      if (success) {
        Message.success('删除成功')
        await fetchData()
        callback?.()
      } else {
        Message.error('删除失败')
      }
    } catch (error) {
      Message.error('删除失败')
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

  const onPageChange = async (number: number, callback?: () => void) => {
    searchModel.value.page = number
    await fetchData()
    callback?.()
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
    deleteData,
  }
}
