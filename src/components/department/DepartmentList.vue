<template>
  <div class="department-list">
    <!-- Search Form -->
    <div class="search-section">
      <el-form :model="searchForm" inline label-width="auto">
        <el-form-item label="Trại tạm giam">
          <el-input
              v-model="searchForm.detentionCenterId"
              placeholder="Nhập mã trại tạm giam"
              clearable
          />
        </el-form-item>

        <el-form-item label="Từ khóa">
          <el-input
              v-model="searchForm.keyword"
              placeholder="Nhập từ khóa"
              clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSearch" :icon="Search">
            {{ t("common.search") }}
          </el-button>
          <el-button @click="onReset" :icon="Refresh">
            {{ t("common.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Data Table -->
    <el-table
        :data="departments"
        stripe
        border
        v-loading="loading"
        style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Tên phòng ban" />
      <el-table-column prop="code" label="Mã" width="120" />
      <el-table-column prop="detentionCenterName" label="Trại tạm giam" />
      <el-table-column prop="description" label="Mô tả" />
      <el-table-column prop="isActive" label="Trạng thái" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
            {{ scope.row.isActive ? "Hoạt động" : "Ngừng hoạt động" }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="departmentStore.total"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="pagination"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useDepartmentStore } from "@/stores/department";
import { Search, Refresh } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import type { PageQuery } from "@/types/department";
import { ElMessage } from "element-plus";

const { t } = useI18n();
const departmentStore = useDepartmentStore();

// table sẽ bind trực tiếp từ store
const departments = computed(() => departmentStore.getDepartments);
const loading = computed(() => departmentStore.getLoading);

// search form
const searchForm = reactive<{
  keyword?: string;
  detentionCenterId?: string;
}>({
  keyword: "",
  detentionCenterId: "",
});

// pagination
const page = ref(1);
const pageSize = ref(10);

// fetch data
const search = async (extra?: Partial<PageQuery>) => {
  try {
    await departmentStore.fetchList({
      pageNo: page.value,
      pageSize: pageSize.value,
      code: searchForm.keyword || undefined,
      name: searchForm.keyword || undefined,
      detentionCenterId: searchForm.detentionCenterId
          ? Number(searchForm.detentionCenterId)
          : undefined,
      ...extra,
    });
  } catch (error) {
    ElMessage.error(t("common.dataFail"));
  }
};

// reset
const onReset = () => {
  searchForm.keyword = "";
  searchForm.detentionCenterId = "";
  page.value = 1;
  pageSize.value = 10;
  search({ pageNo: 1 });
};

const onSearch = () => {
  page.value = 1;
  search({ pageNo: 1 });
};

const onSizeChange = (s: number) => {
  pageSize.value = s;
  search();
};

const onPageChange = (p: number) => {
  page.value = p;
  search();
};

// fetch initial
onMounted(async () => {
  await search();
  departmentStore.fetchAll();
});
</script>





<style scoped>

</style>