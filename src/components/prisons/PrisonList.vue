<!--suppress ALL -->
<template>
  <div class="prison-list">
    <!-- <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">Quản lý trại giam</span>
      </template>
    </el-page-header> -->

    <!-- Search Section -->
    <div class="search-section">
      <el-form
        :model="searchForm"
        inline
        label-width="auto"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('prison.code')">
              <el-input
                v-model="searchForm.code"
                :placeholder="t('prison.placeholder.code')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('prison.name')">
              <el-input
                v-model="searchForm.name"
                :placeholder="t('prison.placeholder.name')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('prison.status')">
              <el-select
                style="width: 194px"
                v-model="searchForm.isActive"
                :placeholder="t('prison.placeholder.status')"
                clearable
              >
                <el-option :label="t('prison.active')" :value="true" />
                <el-option :label="t('prison.inactive')" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
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
      <!-- <div>
        <el-button
          type="primary"
          @click="$router.push('/prisons/add')"
          :icon="Plus"
        >
          Thêm trại giam mới
        </el-button>
        <el-button type="success" @click="handleExport" :icon="Download">
            Xuất Excel
          </el-button>
      </div> -->
    </div>

    <!-- Action Bar -->
    <div class="action-card">
      <div class="action-bar">
        <div>
          <el-button
            type="primary"
            @click="$router.push('/prisons/add')"
            :icon="Plus"
          >
            {{ t("common.add") }}
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            {{ t("common.export") }}
          </el-button>
        </div>
        <div class="result-info">
          {{ t("common.total") }}: {{ prisonStore.getTotal }}
          {{ t("common.unit") }}
        </div>
      </div>
    </div>

    <!-- Data Table -->

    <el-table
      :data="prisons"
      style="width: 100%"
      v-loading="prisonStore.getLoading"
      stripe
      border
    >
      <el-table-column
        prop="code"
        :label="t('prison.code')"
        width="145"
        sortable
        fixed="left"
      />
      <el-table-column prop="name" :label="t('prison.name')" width="200" />
      <el-table-column
        :label="t('prison.address')"
        min-width="250"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ scope.row.address }}, {{ scope.row.wardFullName }},
          {{ scope.row.provinceFullName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="director"
        :label="t('prison.director')"
        width="150"
      />
      <el-table-column :label="t('prison.capacity')" width="130" align="center">
        <template #default="scope">
          <el-tag type="info">
            {{ scope.row.currentPopulation }}/{{ scope.row.capacity }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('prison.occupancyRate')" width="150">
        <template #default="scope">
          <el-progress
            :percentage="
              Number(
                (
                  (scope.row.currentPopulation / scope.row.capacity) *
                  100
                ).toFixed(2)
              )
            "
            :color="
              getProgressColor(scope.row.currentPopulation / scope.row.capacity)
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="phone" :label="t('prison.phone')" width="130" />
      <el-table-column :label="t('prison.status')" width="110" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.isActive === true ? 'success' : 'danger'">
            {{
              scope.row.isActive === true
                ? t("prison.active")
                : t("prison.inactive")
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="160" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleView(scope.row)" :icon="View">
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
            :icon="Edit"
          >
          </el-button>
          <el-button
            size="small"
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
      v-model:page-size="size"
      :total="prisonStore.getTotal"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="pagination"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="t('prison.detailTitle')"
      width="60%"
      :before-close="handleDetailClose"
      class="dialog"
    >
      <div v-if="selectedPrison" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="t('prison.code')">
            {{ selectedPrison.code }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.name')">
            {{ selectedPrison.name }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.director')" :span="2">
            {{ selectedPrison.director }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.address')" :span="2">
            {{ selectedPrison.address }}, {{ selectedPrison.wardFullName }},
            {{ selectedPrison.provinceFullName }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.phone')">
            {{ selectedPrison.phone }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.capacity')">
            {{ selectedPrison.capacity }} {{ t("prison.people") }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.currentPopulation')">
            {{ selectedPrison?.currentPopulation }} {{ t("prison.people") }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.occupancyRate')">
            <el-progress
              :percentage="
                selectedPrison?.currentPopulation && selectedPrison?.capacity
                  ? Number(
                      (
                        (selectedPrison.currentPopulation /
                          selectedPrison.capacity) *
                        100
                      ).toFixed(2)
                    )
                  : 0
              "
              :color="
                getProgressColor(
                  (selectedPrison?.currentPopulation || 0) /
                    (selectedPrison?.capacity || 1)
                )
              "
            />
          </el-descriptions-item>
          <el-descriptions-item :label="t('prison.status')">
            <el-tag
              :type="selectedPrison.isActive === true ? 'success' : 'danger'"
            >
              {{
                selectedPrison.isActive === true
                  ? t("prison.active")
                  : t("prison.inactive")
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="t('common.createTime')">
            {{ formatDate(selectedPrison.createdAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">
          {{ t("common.close") }}
        </el-button>
        <el-button type="primary" @click="handleEdit(selectedPrison)">
          {{ t("common.ok") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Delete,
  Edit,
  Refresh,
  Plus,
  Search,
  View,
  Download,
} from "@element-plus/icons-vue";
import { usePrisonStore } from "@/stores/prison";
import { useRouter } from "vue-router";
import type { PageQuery, Prison, ExportExcelQuery } from "@/types/prison";
import { useBaseMixin } from "@/components/BaseMixin";
import { useI18n } from "vue-i18n";

const { isButtonEnabled } = useBaseMixin();

const { t } = useI18n();

const prisonStore = usePrisonStore();
const router = useRouter();

// Reactive data
const prisons = ref<Prison[]>([]);
const searchForm = reactive<{
  code?: string;
  name?: string;
  isActive?: string;
}>({
  code: "",
  name: "",
  isActive: "",
});
const page = ref(1);
const size = ref(10);
const detailDialogVisible = ref(false);
const selectedPrison = ref<Prison | null>(null);
const exporting = ref(false);
const getProgressColor = (ratio: any) => {
  if (ratio < 0.7) return "#67C23A";
  if (ratio < 0.9) return "#E6A23C";
  return "#F56C6C";
};

const formatDate = (dateStr: any) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};
const handleEdit = (prison: any) => {
  router.push(`/prisons/edit/${prison.id}`);
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedPrison.value = null;
};

const handleExport = async () => {
  try {
    await prisonStore.exportExcel({
      code: searchForm.code?.trim() ?? null,
      name: searchForm.name?.trim() ?? null,
      isActive: searchForm.isActive ?? undefined,
    } as ExportExcelQuery);
  } catch (error) {
    console.error("Export error:", error);
    ElMessage.error("Lỗi khi xuất Excel!");
  } finally {
  }
};
const handleView = (prison: any) => {
  selectedPrison.value = prison;
  detailDialogVisible.value = true;
};

const search = async (extra?: Partial<PageQuery>) => {
  try {
    const request = {
      pageNo: page.value,
      pageSize: size.value,
      code: searchForm.code?.trim() ?? null,
      name: searchForm.name?.trim() ?? null,
      isActive: searchForm.isActive ?? undefined,
      ...extra,
    } as PageQuery;
    await prisonStore.fetchList(request);

    prisons.value = prisonStore.getPrisons || [];
  } catch (error) {
    // console.error("Error fetching prison list:", error);
    ElMessage.error(t("common.dataFail"));
  } finally {
  }
};

onMounted(async () => {
  await nextTick();
  if (prisonStore.pageNo) page.value = prisonStore.pageNo;
  if (prisonStore.pageSize) size.value = prisonStore.pageSize;
  await search();
});

// watch(page, (p) => {
//   prisonStore.pageNo = p;
//   search();
// });
// watch(size, (s) => {
//   prisonStore.pageSize = s;
//   search();
// });

const onSearch = () => {
  page.value = 1;
  search({ pageNo: 1 });
};
const onReset = () => {
  searchForm.code = "";
  searchForm.name = "";
  searchForm.isActive = "";
  page.value = 1;
  search({ pageNo: 1 });
};

const onPageChange = (p: number) => {
  page.value = p;
  search();
};
const onSizeChange = (s: number) => {
  size.value = s;
  search();
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

  await prisonStore.deletePrison(id);
  await search(); // <- hàm search của bạn
};
</script>

<style scoped>
.prison-list {
  padding: 20px;
}

.search-card,
.action-card {
  margin: 20px 0;
  /* them */
  /* border-collapse: collapse;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white; */
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* .result-info {
  color: #666;
  font-size: 14px;
} */

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: 20px 0;
}

::v-deep(.el-table__fixed),
::v-deep(.el-table__fixed-right) {
  z-index: 3 !important;
  background: #fff;
  height: 100%;
}

::v-deep(.el-table__fixed-header-wrapper),
::v-deep(.el-table__fixed-body-wrapper) {
  background: #fff;
}
</style>
