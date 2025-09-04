<template>
  <div class="staff-list">
    <!-- <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">Quản lý cán bộ</span>
      </template>
    </el-page-header> -->

    <!-- Search Section -->
    <div class="search-section">
      <el-form :model="searchForm" label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Mã cán bộ">
              <el-input
                v-model="searchForm.staffCode"
                placeholder="Nhập mã cán bộ..."
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Họ và tên">
              <el-input
                v-model="searchForm.fullName"
                placeholder="Nhập họ và tên..."
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Cấp bậc">
              <el-input
                v-model="searchForm.rank"
                placeholder="Nhập cấp bậc..."
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Trạng thái">
              <el-select
                v-model="searchForm.status"
                placeholder="Chọn trạng thái"
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
          <el-button type="primary" @click="onSearch" :icon="Search"
            >Tìm kiếm</el-button
          >
          <el-button @click="onReset" :icon="Refresh">Làm mới</el-button>
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
          >
            Thêm cán bộ mới
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            Xuất Excel
          </el-button>
        </div>
        <div class="result-info">
          Tổng số: {{ staffStore.getTotal }} trại giam
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
        label="Mã cán bộ"
        width="130"
        sortable
        fixed="left"
      />
      <el-table-column prop="fullName" label="Họ và tên" min-width="150" />
      <el-table-column prop="idNumber" label="Số căn cước" min-width="120" />
      <el-table-column label="Giới tính" width="120">
        <template #default="{ row }">
          {{ getGenderLabel(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="rank" label="Cấp bậc" width="120" />
      <el-table-column prop="phone" label="Điện thoại" width="130" />
      <el-table-column
        prop="email"
        label="Email"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column label="Trạng thái" width="130" align="center">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" min-width="130" fixed="right">
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
      title="Chi tiết cán bộ"
      width="60%"
      class="dialog"
    >
      <div v-if="selectedStaff" class="space-y-6">
        <!-- Section 1: Thông tin cơ bản -->
        <el-card class="rounded-xl mb-2">
          <template #header>
            <h5 class="m-0">Thông tin cơ bản</h5>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Họ và tên" :span="2">{{
              selectedStaff.fullName
            }}</el-descriptions-item>
            <el-descriptions-item label="Mã cán bộ">{{
              selectedStaff.staffCode
            }}</el-descriptions-item>
            <el-descriptions-item label="Số hồ sơ">{{
              selectedStaff.profileNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Giới tính">{{
              getGenderLabel(selectedStaff.gender)
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày sinh">{{
              formatDate(selectedStaff.dateOfBirth)
            }}</el-descriptions-item>
            <el-descriptions-item label="Nơi sinh">{{
              selectedStaff.placeOfBirth
            }}</el-descriptions-item>
            <el-descriptions-item label="Số CCCD/CMND">{{
              selectedStaff.idNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày cấp">{{
              selectedStaff.idIssueDate || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Nơi cấp">{{
              selectedStaff.idIssuePlace || "-"
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Section 2: Liên lạc -->
        <el-card class="rounded-xl mb-2">
          <template #header>
            <h5 class="m-0">Liên lạc</h5>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Email" :span="2">{{
              selectedStaff.email || "-"
            }}</el-descriptions-item>

            <el-descriptions-item label="Điện thoại">{{
              selectedStaff.phone || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Điện thoại liên hệ khẩn cấp">{{
              selectedStaff.emergencyPhone || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Người liên hệ khẩn cấp">{{
              selectedStaff.emergencyContact || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Địa chỉ thường trú" :span="2">
              {{ permanentFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="Địa chỉ tạm trú" :span="2">
              {{ temporaryFullAddress }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Section 3: Công việc -->
        <el-card class="rounded-xl mb-2">
          <template #header>
            <h5 class="m-0">Công việc</h5>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Cấp bậc">{{
              selectedStaff.rank || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Phòng ban">{{
              selectedStaff.departmentName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Chức vụ">{{
              selectedStaff.positionName || "-"
            }}
            </el-descriptions-item>
            <el-descriptions-item label="Học vấn">{{
              selectedStaff.educationLevelName || "-"
            }}
            </el-descriptions-item>
            <el-descriptions-item label="Trại giam công tác">{{
              selectedStaff.detentionCenterName || "-"
            }}
            </el-descriptions-item>
            <el-descriptions-item label="Trạng thái">
              <el-tag :type="getStatusType(selectedStaff.status)">
                {{ getStatusText(selectedStaff.status) }}
              </el-tag>
            </el-descriptions-item>
            
            <el-descriptions-item label="Ngày tạo">{{
              formatDate(selectedStaff.createdAt)
            }}
            </el-descriptions-item>
            <el-descriptions-item label="Ngày cập nhật">{{
              formatDate(selectedStaff.updatedAt)
            }}
            </el-descriptions-item>

          </el-descriptions>
        </el-card>
      </div>

      <template #footer>
        <el-button @click="handleDetailClose()">Đóng</el-button>
        <el-button type="primary" @click="handleEdit(selectedStaff)"
          >Chỉnh sửa</el-button
        >
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
import type { Staff, PageQuery } from "@/types/staff";
import { statusOptions, Gender, Status, genderOptions } from "@/constants";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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

// Methods
const formatDate = (dateStr: any) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

const getGenderLabel = (value: any) => {
  const option = genderOptions.find((opt) => opt.value === value);
  return option ? option.label : "Không xác định";
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
})
const handleEdit = (staff: any) => {
  router.push(`/staff/edit/${staff.id}`);
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedStaff.value = null;
};

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};
const handleView = (staff: any) => {
  selectedStaff.value = staff;
  console.log(selectedStaff.value);
  detailDialogVisible.value = true;
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
    console.error("Error fetching prison list:", error);
    ElMessage.error("Có lỗi xảy ra khi tải danh sách trại giam!");
  } finally {
    loading.value = false;
  }
};

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

watch(page, (p) => {
  staffStore.pageNo = p;
  search();
});
watch(size, (s) => {
  staffStore.pageSize = s;
  search();
});

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
