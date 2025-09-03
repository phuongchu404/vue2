<template>
  <div class="detainee-list">
    <!-- <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">Quản lý phạm nhân</span>
      </template>
    </el-page-header> -->

    <!-- Search Section -->
    <el-card class="search-section">
      <el-form :model="searchForm"label-width="130px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Mã phạm nhân">
              <el-input
                v-model="searchForm.code"
                placeholder="Nhập mã phạm nhân..."
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Họ và tên">
              <el-input
                v-model="searchForm.name"
                placeholder="Nhập họ và tên..."
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-form-item label="Số CCCD/CMND">
              <el-input
                v-model="searchForm.idNumber"
                placeholder="Nhập số CCCD/CMND..."
                clearable
              /> </el-form-item
          ></el-col>
          <el-col :span="8"
            ><el-form-item label="Trạng thái">
              <el-select
                v-model="searchForm.status"
                placeholder="Chọn trạng thái"
                clearable
              >
                <el-option label="Đang giam giữ" value="DETAINED" />
                <el-option label="Đã thả" value="RELEASED" />
                <el-option label="Chuyển trại" value="TRANSFERRED" />
                <el-option label="Đã chết" value="DECEASED" />
              </el-select> </el-form-item
          ></el-col>
        </el-row>

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
            @click="$router.push('/detainees/add')"
            :icon="Plus"
          >
            Thêm phạm nhân mới
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            Xuất Excel
          </el-button>
        </div>
        <div class="result-info">
          Tổng số: {{ filteredDetainees.length }} phạm nhân
        </div>
      </div>
    </el-card>

    <!-- Data Table -->
    <el-table
      :data="paginatedDetainees"
      style="width: 100%"
      v-loading="loading"
      stripe
      border
    >
      <el-table-column
        prop="detainee_code"
        label="Mã phạm nhân"
        width="120"
        sortable
      />
      <el-table-column prop="full_name" label="Họ và tên" min-width="150" />
      <el-table-column prop="gender" label="Giới tính" width="80" />
      <el-table-column prop="date_of_birth" label="Ngày sinh" width="120">
        <template #default="scope">
          {{ formatDate(scope.row.date_of_birth) }}
        </template>
      </el-table-column>
      <el-table-column prop="id_number" label="CCCD/CMND" width="130" />
      <el-table-column prop="detention_date" label="Ngày bắt" width="120">
        <template #default="scope">
          {{ formatDate(scope.row.detention_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="cell_number" label="Buồng giam" width="100" />
      <el-table-column
        prop="charges"
        label="Tội danh"
        min-width="200"
        show-overflow-tooltip
      />
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
            @click="handleDelete(scope.row)"
            :icon="Delete"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="filteredDetainees.length"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Chi tiết phạm nhân"
      width="60%"
      :before-close="handleDetailClose"
    >
      <div v-if="selectedDetainee" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Mã phạm nhân">{{
            selectedDetainee.detainee_code
          }}</el-descriptions-item>
          <el-descriptions-item label="Số hồ sơ">{{
            selectedDetainee.profile_number || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Họ và tên" :span="2">{{
            selectedDetainee.full_name
          }}</el-descriptions-item>
          <el-descriptions-item label="Tên gọi khác">{{
            selectedDetainee.alias_name || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Giới tính">{{
            selectedDetainee.gender || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Ngày sinh">{{
            formatDate(selectedDetainee.date_of_birth)
          }}</el-descriptions-item>
          <el-descriptions-item label="Nơi sinh">{{
            selectedDetainee.place_of_birth || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Số CCCD/CMND">{{
            selectedDetainee.id_number || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Nghề nghiệp">{{
            selectedDetainee.occupation || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Ngày bắt">{{
            formatDate(selectedDetainee.detention_date)
          }}</el-descriptions-item>
          <el-descriptions-item label="Số án">{{
            selectedDetainee.case_number || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Buồng giam">{{
            selectedDetainee.cell_number || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="Trạng thái">
            <el-tag :type="getStatusType(selectedDetainee.status)">
              {{ getStatusText(selectedDetainee.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Địa chỉ thường trú" :span="2">
            {{ selectedDetainee.permanent_address || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="Tội danh" :span="2">
            {{ selectedDetainee.charges || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="Ghi chú" :span="2">
            {{ selectedDetainee.notes || "-" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="handleEdit(selectedDetainee)"
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
import { useDetaineeStore } from "@/stores";
import { useRouter } from "vue-router";

const router = useRouter();
const detaineeStore = useDetaineeStore();

// Reactive data
const loading = ref(false);
const searchForm = ref({
  code: "",
  name: "",
  idNumber: "",
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const detailDialogVisible = ref(false);
const selectedDetainee = ref(null);

// Computed
const filteredDetainees = computed(() => {
  return detaineeStore.detainees.filter((detainee) => {
    return (
      (!searchForm.value.code ||
        detainee.detainee_code
          .toLowerCase()
          .includes(searchForm.value.code.toLowerCase())) &&
      (!searchForm.value.name ||
        detainee.full_name
          .toLowerCase()
          .includes(searchForm.value.name.toLowerCase())) &&
      (!searchForm.value.idNumber ||
        (detainee.id_number &&
          detainee.id_number.includes(searchForm.value.idNumber))) &&
      (!searchForm.value.status || detainee.status === searchForm.value.status)
    );
  });
});

const paginatedDetainees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredDetainees.value.slice(start, end);
});

// Methods
const handleSearch = () => {
  currentPage.value = 1;
};

const handleReset = () => {
  searchForm.value = {
    code: "",
    name: "",
    idNumber: "",
    status: "",
  };
  currentPage.value = 1;
};

const handleView = (detainee) => {
  selectedDetainee.value = detainee;
  detailDialogVisible.value = true;
};

const handleEdit = (detainee) => {
  router.push(`/detainees/edit/${detainee.id}`);
};

const handleDelete = async (detainee) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa phạm nhân "${detainee.full_name}" không?`,
      "Xác nhận xóa",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    );

    detaineeStore.deleteDetainee(detainee.id);
    ElMessage.success("Xóa phạm nhân thành công!");
  } catch {
    ElMessage.info("Đã hủy thao tác xóa");
  }
};

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedDetainee.value = null;
};

const getStatusType = (status) => {
  const typeMap = {
    DETAINED: "danger",
    RELEASED: "success",
    TRANSFERRED: "warning",
    DECEASED: "info",
  };
  return typeMap[status] || "info";
};

const getStatusText = (status) => {
  const textMap = {
    DETAINED: "Đang giam giữ",
    RELEASED: "Đã thả",
    TRANSFERRED: "Chuyển trại",
    DECEASED: "Đã chết",
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
.detainee-list {
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
