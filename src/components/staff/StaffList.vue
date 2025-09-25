<template>
  <div class="staff-list">
    <!-- Search Section -->
    <div class="search-section">
      <el-form :model="searchForm" label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('staff.code')">
              <el-input
                v-model="searchForm.staffCode"
                :placeholder="t('staff.placeholder.code')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('staff.fullName')">
              <el-input
                v-model="searchForm.fullName"
                :placeholder="t('staff.placeholder.fullName')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('staff.rank')">
              <el-input
                v-model="searchForm.rank"
                :placeholder="t('staff.placeholder.rank')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('staff.status')">
              <el-select
                v-model="searchForm.status"
                :placeholder="t('common.inputStatus')"
              >
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            :disabled="isButtonEnabled('staff:search')"
            type="primary"
            @click="onSearch"
            :icon="Search"
          >
            {{ t("common.Search") }}
          </el-button>
          <el-button @click="onReset" :icon="Refresh">
            {{ t("common.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-card">
      <div class="action-bar">
        <div>
          <el-button
            type="primary"
            @click="$router.push('/staff/add')"
            :icon="Plus"
            :disabled="isButtonEnabled('staff:insert')"
          >
            {{ t("common.add") }}
          </el-button>
          <el-button
            type="success"
            @click="handleExport"
            :icon="Download"
            :disabled="isButtonEnabled('staff:search')"
          >
            {{ t("common.export") }}
          </el-button>
        </div>
        <div class="result-info">
          {{ t("common.total") }}: {{ staffStore.getTotal }}
          {{ t("common.unit") }}
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      :data="staffs"
      style="width: 100%"
      v-loading="loading"
      stripe
      border
    >
      <el-table-column
        prop="staffCode"
        :label="t('staff.code')"
        width="130"
        sortable
        fixed="left"
      />
      <el-table-column
        prop="fullName"
        :label="t('staff.fullName')"
        min-width="150"
      />
      <el-table-column
        prop="idNumber"
        :label="t('staff.idNumber')"
        min-width="170"
        align="center"
      />
      <el-table-column :label="t('staff.gender')" width="120" align="center ">
        <template #default="{ row }">
          {{ getGenderLabel(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="rank" :label="t('staff.rank')" width="120" align="center"/>
      <el-table-column prop="phone" :label="t('staff.phone')" width="150" align="center" />
      <el-table-column
        prop="email"
        :label="t('staff.email')"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column :label="t('staff.status')" width="170" align="center">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('common.actions')"
        min-width="160"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            :disabled="isButtonEnabled('staff:select:id')"
            size="small"
            @click="handleView(scope.row)"
            :icon="View"
          />
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
            :icon="Edit"
            :disabled="isButtonEnabled('staff:update')"
          />
          <el-button
            size="small"
            type="danger"
            @click="onDelete(scope.row.id)"
            :icon="Delete"
            :disabled="isButtonEnabled('staff:delete')"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="staffStore.getTotal"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="pagination"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="t('staff.detailTitle')"
      width="60%"
      class="dialog"
    >
      <div v-if="selectedStaff" class="space-y-6">
        <!-- Section 1: Basic Info -->
        <el-card class="rounded-xl mb-2">
          <template #header>
            <h5 class="m-0">{{ t("staff.basicInfo") }}</h5>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="t('staff.fullName')" :span="2">{{
              selectedStaff.fullName
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.code')">{{
              selectedStaff.staffCode
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.profileNumber')">{{
              selectedStaff.profileNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.gender')">{{
              getGenderLabel(selectedStaff.gender)
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.dateOfBirth')">{{
              formatDate(selectedStaff.dateOfBirth)
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.placeOfBirth')">{{
              selectedStaff.placeOfBirth
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.idNumber')">{{
              selectedStaff.idNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.idIssueDate')">{{
              selectedStaff.idIssueDate || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.idIssuePlace')">{{
              selectedStaff.idIssuePlace || "-"
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Section 2: Liên lạc -->
        <el-card class="rounded-xl mb-2">
          <template #header>
            <h5 class="m-0">{{ t("staff.contactInfo") }}</h5>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="t('staff.email')" :span="2">{{
              selectedStaff.email || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.phone')">{{
              selectedStaff.phone || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.emergencyPhone')">{{
              selectedStaff.emergencyPhone || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.emergencyContact')">{{
              selectedStaff.emergencyContact || "-"
            }}</el-descriptions-item>
            <el-descriptions-item
              :label="t('staff.permanentAddress')"
              :span="2"
            >
              {{ permanentFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item
              :label="t('staff.temporaryAddress')"
              :span="2"
            >
              {{ temporaryFullAddress }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Section 3: Công việc -->
        <el-card class="rounded-xl mb-2">
          <template #header>
            <h5 class="m-0">{{ t("staff.jobInfo") }}</h5>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="t('staff.rank')">{{
              selectedStaff.rank || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.department')">{{
              selectedStaff.departmentName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.position')">{{
              selectedStaff.positionName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.education')">{{
              selectedStaff.educationLevelName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.detentionCenter')">{{
              selectedStaff.detentionCenterName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('staff.status')">
              <el-tag :type="getStatusType(selectedStaff.status)">
                {{ getStatusText(selectedStaff.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="t('common.createTime')">{{
              formatDate(selectedStaff.createdAt)
            }}</el-descriptions-item>
            <el-descriptions-item :label="t('common.updateTime')">{{
              formatDate(selectedStaff.updatedAt)
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>

      <template #footer>
        <el-button @click="handleDetailClose()">
          {{ t("common.close") }}
        </el-button>
        <el-button type="primary" @click="handleEdit(selectedStaff)">
          {{ t("common.edit") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, nextTick, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Download,
  View,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import { useStaffStore } from "@/stores/staff";
import { useRouter } from "vue-router";
import type { Staff, PageQuery, ExportStaffQuery } from "@/types/staff";
import { statusOptions, Gender, Status, genderOptions } from "@/constants";
import { useI18n } from "vue-i18n";
import { useBaseMixin } from "@/components/BaseMixin";
// import { headerMap, columnWidths } from "@/excel/staff";

const { t } = useI18n();
const { isButtonEnabled } = useBaseMixin();
const router = useRouter();
const staffStore = useStaffStore();
const staffs = ref<Staff[]>([]);

// Reactive data
const loading = ref(false);
const searchForm = reactive<{
  staffCode?: string;
  fullName?: string;
  rank?: string;
  status?: string;
}>({
  staffCode: "",
  fullName: "",
  rank: "",
  status: "",
});
const page = ref(1);
const size = ref(10);
const detailDialogVisible = ref(false);
const selectedStaff = ref<Staff | null>(null);
const exporting = ref(false);

// Methods
const formatDate = (dateStr: any) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getGenderLabel = (value: any) => {
  const option = genderOptions.find((opt) => opt.value === value);
  return option ? option.label : t("common.unspecified");
};

const permanentFullAddress = computed(() => {
  const parts = [
    selectedStaff.value?.permanentAddress,
    selectedStaff.value?.permanentWardFullName,
    selectedStaff.value?.permanentProvinceFullName,
  ].filter((v) => !!(typeof v === "string" ? v.trim() : v));
  return parts.length ? parts.join(", ") : "-";
});

const temporaryFullAddress = computed(() => {
  const parts = [
    selectedStaff.value?.temporaryAddress,
    selectedStaff.value?.temporaryWardFullName,
    selectedStaff.value?.temporaryProvinceFullName,
  ].filter((v) => !!(typeof v === "string" ? v.trim() : v));
  return parts.length ? parts.join(", ") : "-";
});
const handleEdit = (staff: any) => {
  router.push(`/staff/edit/${staff.id}`);
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedStaff.value = null;
};

const handleView = (staff: any) => {
  selectedStaff.value = staff;
  detailDialogVisible.value = true;
};

const handleExport = async () => {
  try {
    await staffStore.exportExcel({
      staffCode: searchForm.staffCode?.trim() ?? null,
      fullName: searchForm.fullName?.trim() ?? null,
      rank: searchForm.rank?.trim() ?? null,
      status: searchForm.status?.trim() ?? null,
    } as ExportStaffQuery);
  } catch (error) {
    console.error("Export error:", error);
    ElMessage.error("Lỗi khi xuất Excel!");
  } finally {
  }
};

const search = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    await staffStore.fetchList({
      pageNo: page.value,
      pageSize: size.value,
      staffCode: searchForm.staffCode ?? null,
      fullName: searchForm.fullName ?? null,
      rank: searchForm.rank ?? null,
      status: searchForm.status ?? null,
      ...extra,
    } as PageQuery);

    staffs.value = staffStore.getStaffs || [];
  } catch (error) {
    ElMessage.error(t("common.dataFail"));
  } finally {
    loading.value = false;
  }
};
function toExportRow(item: any) {
  const genderText =
    item.gender === "MALE"
      ? "Nam"
      : item.gender === "FEMALE"
      ? "Nữ"
      : "Không xác định";

  return {
    staffCode: item.staffCode,
    fullName: item.fullName,
    idNumber: item.idNumber,
    gender: genderText,
    rank: item.rank,
    phone: item.phone,
    email: item.email,
    status: getStatusText(item.status),
  };
}
// const exportSelectedToExcel = async () => {
//   // if (selectedRows.value.length === 0) {
//   //   ElMessage.warning("Vui lòng chọn ít nhất một bản ghi để xuất!");
//   //   return;
//   // }

//   exporting.value = true;
//   try {
//     const keys = Object.keys(headerMap);
//     const rows = staffs.value.map((it: any) => toExportRow(it));

//     const chunkSize = 50_000;
//     const wb = XLSX.utils.book_new();

//     for (
//       let start = 0, part = 1;
//       start < rows.length;
//       start += chunkSize, part++
//     ) {
//       const chunk = rows.slice(start, start + chunkSize);

//       // matrix dữ liệu theo thứ tự keys
//       const dataMatrix = chunk.map((r: any) => keys.map((k) => r[k]));

//       // tạo sheet: thêm header tiếng Việt ở dòng đầu
//       const ws = XLSX.utils.aoa_to_sheet([
//         keys.map((k) => headerMap[k]),
//         ...dataMatrix,
//       ]);

//       (ws as any)["!cols"] = columnWidths;

//       XLSX.utils.book_append_sheet(wb, ws, `Cán bộ (${part})`);
//     }

//     // tên file
//     const today = new Date();
//     const filename = `can-bo-${today.getFullYear()}-${(today.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}.xlsx`;

//     await XLSX.writeFile(wb, filename);
//     ElMessage.success(`Xuất Excel thành công! File: ${filename}`);
//   } catch (error) {
//     console.error("Export error:", error);
//     ElMessage.error("Lỗi khi xuất Excel!");
//   } finally {
//     exporting.value = false;
//   }
// };
onMounted(async () => {
  await nextTick();
  if (staffStore.pageNo) page.value = staffStore.pageNo;
  if (staffStore.pageSize) size.value = staffStore.pageSize;
  await search();
});

const getStatusType = (status: any) => {
  const typeMap = {
    ACTIVE: "success",
    INACTIVE: "warning",
    RETIRED: "info",
    TRANSFERRED: "danger",
  };
  return typeMap[status as keyof typeof typeMap] || "info";
};
const getStatusText = (status?: string) => {
  const hit = statusOptions.find((o) => o.value === status);
  return hit?.label ?? status ?? "—";
};

// watch(page, (p) => {
//   staffStore.pageNo = p;
//   search();
// });
// watch(size, (s) => {
//   staffStore.pageSize = s;
//   search();
// });

const onSearch = () => {
  page.value = 1;
  search({ pageNo: 1 });
};
const onReset = () => {
  searchForm.staffCode = "";
  searchForm.fullName = "";
  searchForm.rank = "";
  searchForm.status = "";
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
  await staffStore.deleteStaff(id);
  search();
};
</script>

<style scoped>
.staff-list {
  padding: 20px;
}

.search-card,
.action-card {
  margin: 20px 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-info {
  color: #666;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  padding: 20px 0;
}
</style>
