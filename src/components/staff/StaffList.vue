<template>
  <div class="staff-list">
    <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">Quản lý cán bộ</span>
      </template>
    </el-page-header>

    <!-- Search Section -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="Mã cán bộ">
          <el-input
            v-model="searchForm.code"
            placeholder="Nhập mã cán bộ..."
            clearable
          />
        </el-form-item>
        <el-form-item label="Họ và tên">
          <el-input
            v-model="searchForm.name"
            placeholder="Nhập họ và tên..."
            clearable
          />
        </el-form-item>
        <el-form-item label="Cấp bậc">
          <el-input
            v-model="searchForm.rank"
            placeholder="Nhập cấp bậc..."
            clearable
          />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select
            v-model="searchForm.status"
            placeholder="Chọn trạng thái"
            clearable
          >
            <el-option label="Đang làm việc" value="ACTIVE" />
            <el-option label="Nghỉ phép" value="INACTIVE" />
            <el-option label="Nghỉ hưu" value="RETIRED" />
            <el-option label="Chuyển công tác" value="TRANSFERRED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search"
            >Tìm kiếm</el-button
          >
          <el-button @click="handleReset" :icon="Refresh">Làm mới</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Action Bar -->
    <el-card class="action-card">
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
          Tổng số: {{ filteredStaff.length }} cán bộ
        </div>
      </div>
    </el-card>

    <!-- Data Table -->
    <el-card>
      <el-table
        :data="paginatedStaff"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
      >
        <el-table-column
          prop="staff_code"
          label="Mã cán bộ"
          width="120"
          sortable
        />
        <el-table-column prop="full_name" label="Họ và tên" min-width="150" />
        <el-table-column prop="gender" label="Giới tính" width="80" />
        <el-table-column prop="rank" label="Cấp bậc" width="120" />
        <el-table-column prop="phone" label="Điện thoại" width="130" />
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)" :icon="View">
              Xem
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              :icon="Edit"
            >
              Sửa
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              :icon="Delete"
            >
              Xóa
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="filteredStaff.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Chi tiết cán bộ"
      width="60%"
      :before-close="handleDetailClose"
    >
      <div v-if="selectedStaff" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Mã cán bộ">{{
            selectedStaff.staff_code
          }}</el-descriptions-item>
          <el-descriptions-item label="Số hồ sơ">{{
            selectedStaff.profile_number || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Họ và tên" :span="2">{{
            selectedStaff.full_name
          }}</el-descriptions-item>
          <el-descriptions-item label="Giới tính">{{
            selectedStaff.gender || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Ngày sinh">{{
            formatDate(selectedStaff.date_of_birth)
          }}</el-descriptions-item>
          <el-descriptions-item label="Số CCCD/CMND">{{
            selectedStaff.id_number || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Điện thoại">{{
            selectedStaff.phone || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Email" :span="2">{{
            selectedStaff.email || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Cấp bậc">{{
            selectedStaff.rank || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Trạng thái">
            <el-tag :type="getStatusType(selectedStaff.status)">
              {{ getStatusText(selectedStaff.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Địa chỉ thường trú" :span="2">
            {{ selectedStaff.permanent_address || "-" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="handleEdit(selectedStaff)"
          >Chỉnh sửa</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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
import { useStaffStore } from "@/stores";
import { useRouter } from "vue-router";

const router = useRouter();
const staffStore = useStaffStore();

// Reactive data
const loading = ref(false);
const searchForm = ref({
  code: "",
  name: "",
  rank: "",
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const detailDialogVisible = ref(false);
const selectedStaff = ref(null);

// Computed
const filteredStaff = computed(() => {
  return staffStore.staff.filter((staff) => {
    return (
      (!searchForm.value.code ||
        staff.staff_code
          .toLowerCase()
          .includes(searchForm.value.code.toLowerCase())) &&
      (!searchForm.value.name ||
        staff.full_name
          .toLowerCase()
          .includes(searchForm.value.name.toLowerCase())) &&
      (!searchForm.value.rank ||
        (staff.rank &&
          staff.rank
            .toLowerCase()
            .includes(searchForm.value.rank.toLowerCase()))) &&
      (!searchForm.value.status || staff.status === searchForm.value.status)
    );
  });
});

const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredStaff.value.slice(start, end);
});

// Methods
const handleSearch = () => {
  currentPage.value = 1;
};

const handleReset = () => {
  searchForm.value = {
    code: "",
    name: "",
    rank: "",
    status: "",
  };
  currentPage.value = 1;
};

const handleView = (staff) => {
  selectedStaff.value = staff;
  detailDialogVisible.value = true;
};

const handleEdit = (staff) => {
  router.push(`/staff/edit/${staff.id}`);
};

const handleDelete = async (staff) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa cán bộ "${staff.full_name}" không?`,
      "Xác nhận xóa",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    );

    staffStore.deleteStaff(staff.id);
    ElMessage.success("Xóa cán bộ thành công!");
  } catch {
    ElMessage.info("Đã hủy thao tác xóa");
  }
};

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedStaff.value = null;
};

const getStatusType = (status) => {
  const typeMap = {
    ACTIVE: "success",
    INACTIVE: "warning",
    RETIRED: "info",
    TRANSFERRED: "danger",
  };
  return typeMap[status] || "info";
};

const getStatusText = (status) => {
  const textMap = {
    ACTIVE: "Đang làm việc",
    INACTIVE: "Nghỉ phép",
    RETIRED: "Nghỉ hưu",
    TRANSFERRED: "Chuyển công tác",
  };
  return textMap[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

onMounted(() => {
  // Load data if needed
});
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