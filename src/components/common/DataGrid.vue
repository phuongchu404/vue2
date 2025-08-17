<template>
  <div>
    <!--Table Area-->
    <el-table :data="pageData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" v-if="showIndex"></el-table-column>
      <el-table-column 
        v-for="item in columnData" 
        :key="item.prop" 
        :prop="item.prop" 
        :formatter="item.format" 
        :label="item.label" 
        :width="item.width" 
        v-if="item.show == null ? true : item.show">
      </el-table-column>
      <el-table-column 
        label="Vận hành" 
        fixed="right" 
        :width="btnWidth" 
        v-if="showButton">
        <template #default="{ row }">
          <el-button 
            v-for="item in buttonData" 
            :key="item.name" 
            :type="item.type" 
            :size="item.size" 
            class="compact-button" 
            @click="item.click(row, item.params)">
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination 
      v-if="showPager" 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes" 
      :layout="layout" 
      :page-size="pageSizeMirror" 
      :current-page="pageNumMirror" 
      :total="total">
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
interface Props {
  btnWidth?: string
  pageData?: any[]
  columnData?: any[]
  buttonData?: any[]
  pageNum?: number
  pageSize?: number
  total?: number
  showButton?: boolean
  showIndex?: boolean
  showPager?: boolean
  pageSizes?: number[]
  layout?: string
}

const props = withDefaults(defineProps<Props>(), {
  btnWidth: '200',
  pageData: () => [],
  columnData: () => [],
  buttonData: () => [],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  showButton: true,
  showIndex: true,
  showPager: true,
  pageSizes: () => [5, 10, 20, 50],
  layout: 'total, prev, pager, next'
})

// Emits
const emit = defineEmits<{
  'update:pageNum': [value: number]
  'update:pageSize': [value: number]
  'current-change': [value: number]
  'size-change': [value: number]
}>()

// Reactive data
const pageNumMirror = ref(props.pageNum)
const pageSizeMirror = ref(props.pageSize)

// Methods
const handleSizeChange = (newSize: number) => {
  emit('update:pageSize', newSize)
  emit('size-change', newSize)
}

const handleCurrentChange = (newPage: number) => {
  emit('update:pageNum', newPage)
  emit('current-change', newPage)
}

// Watchers
watch(() => props.pageNum, (value) => {
  pageNumMirror.value = value
})

watch(() => props.pageSize, (value) => {
  pageSizeMirror.value = value
})

watch(pageNumMirror, (newValue) => {
  emit('update:pageNum', newValue)
  emit('current-change', newValue)
})
</script>

<style>
/* Add your styles here */
</style>