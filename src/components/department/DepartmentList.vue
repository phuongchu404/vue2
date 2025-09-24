<template>
  <div class="department-list">
    <!-- Search Form -->
    <div class="search-section">
      <el-form :model="searchForm" inline label-width="130">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('department.detentionCenter')">
              <el-select
                v-model="searchForm.detentionCenterId"
                :placeholder="$t('department.placeholder.detentionCenter')"
                style="width: 200px"
                clearable
              >
                <el-option
                  v-for="prison in prisons"
                  :key="prison.id"
                  :label="prison.name"
                  :value="prison.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('department.name')">
              <el-input
                v-model="searchForm.name"
                :placeholder="$t('department.placeholder.name')"
                clearable
                style="width: 175px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="onSearch" :icon="Search">
                {{ t("common.Search") }}
              </el-button>
              <el-button @click="onReset" :icon="Refresh">
                {{ t("common.reset") }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- Action Bar -->
    <div class="action-card">
      <div class="action-bar">
        <div>
          <el-button
            type="primary"
            @click="$router.push('/department/add')"
            :icon="Plus"
          >
            {{ t("common.add") }}
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            {{ t("common.export") }}
          </el-button>
        </div>
        <div class="result-info">
          {{ t("common.total") }}: {{ departmentStore.getTotal }}
          {{ t("common.unit") }}
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      :data="departments"
      stripe
      border
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
        fixed
        sortable
      />
      <el-table-column
        prop="detentionCenterCode"
        :label="$t('department.detentionCenterId')"
        width="150"
        align="center"
      />
      <el-table-column
        prop="detentionCenterName"
        :label="$t('department.detentionCenter')"
        width="170"
        align="center"
      />
      <el-table-column prop="code" :label="$t('department.code')" width="150" />
      <el-table-column
        prop="name"
        :label="$t('department.name')"
        align="center"
        width="170"
      />
      <!--      <el-table-column prop="detentionCenterId" label="Mã trại giam" width="120" />-->
      <el-table-column
        prop="description"
        :label="$t('department.description')"
        align="center"
        width="170"
      >
        <template #default="{ row }">
          {{ row.description || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isActive"
        label="Trạng thái"
        width="150"
        align="center"
      >
        <template #default="scope">
          <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
            {{ scope.row.isActive ? t("prison.active") : t("prison.inactive") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" width="200" fixed="right">
        <template #default="scope">
          <el-button @click="handleView(scope.row)" :icon="View"> </el-button>
          <el-button
            type="primary"
            @click="handleEdit(scope.row.id)"
            :icon="Edit"
          >
          </el-button>
          <el-button
            type="danger"
            @click="onDelete(scope.row.id)"
            :icon="Delete"
          >
          </el-button>
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
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useDepartmentStore } from "@/stores/department";
import {
  Search,
  Refresh,
  View,
  Edit,
  Delete,
  Plus,
  Download,
} from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import type { PageQuery } from "@/types/department";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePrisonStore } from "@/stores/prison.ts";

const router = useRouter();
const { t } = useI18n();
const detailDialogVisible = ref(false);
const departmentStore = useDepartmentStore();
const prisonStore = usePrisonStore();
const { prisons } = storeToRefs(prisonStore);

// table sẽ bind trực tiếp từ store
const departments = computed(() => departmentStore.getDepartments);
const loading = computed(() => departmentStore.getLoading);

// search form
const searchForm = reactive<{
  name?: string;
  detentionCenterId?: string;
}>({
  name: "",
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
      keyword: searchForm.name || undefined,
      detentionCenterId: searchForm.detentionCenterId
        ? Number(searchForm.detentionCenterId)
        : undefined,
      ...extra,
    } as PageQuery);
  } catch (error) {
    ElMessage.error(t("common.dataFail"));
  }
};

// reset
const onReset = () => {
  searchForm.name = "";
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

const handleView = (department: any) => {
  // selectedDepartment.value = staff;
  detailDialogVisible.value = true;
};

const handleEdit = (id: any) => {
  router.push(`/department/edit/${id}`);
};

const handleExport = () => {
  ElMessage.info(t("common.exportUpdating"));
};

const onDelete = async (id: number) => {
  const ok = await ElMessageBox.confirm(
    t("common.deleteConfirm"),
    t("common.reminder"),
    { type: "warning" }
  )
    .then(() => true)
    .catch(() => false);

  if (!ok) return;
  await departmentStore.deleteDepartment(id);
  search();
};

// fetch initial
onMounted(async () => {
  await search();
  await prisonStore.getAll();
  departmentStore.fetchAll();
});
</script>

<style scoped>
.department-list {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.action-card {
  margin: 20px 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
