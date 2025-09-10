<template>
  <div class="identity-list">
<!--    <el-page-header @back="$router.go(-1)">-->
<!--      <template #content>-->
<!--        <span class="text-large font-600 mr-3">Quản lý danh bản</span>-->
<!--      </template>-->
<!--    </el-page-header>-->
    <!-- Search Section -->
    <div class="search-section">
      <el-form :model="searchForm" inline label-width="auto" label-position="left">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('identity.detaineeId')">
              <el-input
                  v-model="searchForm.detaineeId"
                  :placeholder="$t('identity.placeholder.detaineeId')"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('identity.detaineeName')">
              <el-input
                  v-model="searchForm.detaineeName"
                  :placeholder="$t('identity.placeholder.detaineeName')"
                  clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('identity.arrestUnit')">
              <el-input
                  v-model="searchForm.arrestUnit"
                  :placeholder="$t('identity.placeholder.arrestUnit')"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="handleSearch" :icon="Search">
                {{ $t('Search') }}
              </el-button>
              <el-button @click="handleReset" :icon="Refresh">
                {{ $t('common.reset') }}
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
              @click="$router.push('/identity/add')"
              :icon="Plus"
          >
            {{ $t('common.add') }}
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            {{ $t('common.export') }}
          </el-button>
        </div>
        <div class="result-info">
          {{ $t('common.total') }}: {{ filteredRecords.length }} {{ $t('common.unit') }}
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      :data="paginatedRecords"
      style="width: 100%"
      v-loading="loading"
      stripe
      border
    >
      <el-table-column prop="id" :label="$t('identity.id')" width="80" sortable />
      <el-table-column prop="detainee_id" :label="$t('identity.detaineeId')" width="170" />
      <el-table-column prop="detainee_name" :label="$t('identity.detaineeName')" min-width="180" />
      <el-table-column prop="arrest_date" :label="$t('identity.arrestDate')" width="140">
        <template #default="scope">
          {{ formatDate(scope.row.arrest_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="arrest_unit" :label="$t('identity.arrestUnit')" min-width="130" show-overflow-tooltip />
      <el-table-column prop="fp_classification" :label="$t('identity.fpClassification')" width="150" />
      <el-table-column :label="$t('identity.photo')" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="hasPhotos(scope.row)" type="success" size="small">
            {{ getPhotoCount(scope.row) }}/3
          </el-tag>
          <el-tag v-else type="info" size="small">0/3</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('common.createTime')" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary"
                     @click="handleEdit(scope.row)"
                     :icon="Edit">
            {{ $t('common.view') }}
          </el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row)" :icon="Edit">
            {{ $t('common.edit') }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)" :icon="Delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="filteredRecords.length"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Chi tiết danh bản"
      width="80%"
      :before-close="handleDetailClose"
    >
      <div v-if="selectedRecord" class="detail-content">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Mã phạm nhân">{{
                selectedRecord.detainee_id
              }}</el-descriptions-item>
              <el-descriptions-item label="Tên phạm nhân">{{
                selectedRecord.detainee_name
              }}</el-descriptions-item>
              <el-descriptions-item label="Tạo tại">{{
                selectedRecord.created_place || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Lý do lập">{{
                selectedRecord.reason_note || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Ngày bắt">{{
                formatDate(selectedRecord.arrest_date)
              }}</el-descriptions-item>
              <el-descriptions-item label="Đơn vị bắt">{{
                selectedRecord.arrest_unit || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Phân loại VT" :span="2">{{
                selectedRecord.fp_classification || "-"
              }}</el-descriptions-item>
            </el-descriptions>

            <el-divider content-position="left"
              >Đặc điểm hình thái học</el-divider
            >
            <el-descriptions
              :column="2"
              border
              v-if="selectedRecord.anthropometry"
            >
              <el-descriptions-item label="Khuôn mặt">{{
                selectedRecord.anthropometry.face_shape || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Chiều cao">{{
                selectedRecord.anthropometry.height_cm
                  ? selectedRecord.anthropometry.height_cm + " cm"
                  : "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Sống mũi">{{
                selectedRecord.anthropometry.nose_bridge || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Nếp tai dưới">{{
                selectedRecord.anthropometry.ear_lower_fold || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Dái tai" :span="2">{{
                selectedRecord.anthropometry.ear_lobe || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Dấu vết riêng" :span="2">{{
                selectedRecord.anthropometry.distinctive_marks || "-"
              }}</el-descriptions-item>
            </el-descriptions>
          </el-col>

          <el-col :span="10">
            <div class="photo-section">
              <h4>Ảnh danh bản</h4>
              <div class="photo-grid">
                <div
                  v-for="(type, key) in photoTypes"
                  :key="key"
                  class="photo-item"
                >
                  <div class="photo-label">{{ type }}</div>
                  <div class="photo-container">
                    <img
                      v-if="selectedRecord.photos && selectedRecord.photos[key]"
                      :src="
                        selectedRecord.photos[key].minioUrl ||
                        selectedRecord.photos[key]
                      "
                      :alt="type"
                      @error="handleImageError"
                    />
                    <div v-else class="no-photo">
                      <el-icon><Picture /></el-icon>
                      <span>Chưa có ảnh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="handleEdit(selectedRecord)"
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
  Picture,
} from "@element-plus/icons-vue";
import { useIdentityStore } from "@/stores";
import { useRouter } from "vue-router";

const router = useRouter();
const identityStore = useIdentityStore();

// Reactive data
const loading = ref(false);
const searchForm = ref({
  detaineeId: "",
  detaineeName: "",
  arrestUnit: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const detailDialogVisible = ref(false);
const selectedRecord = ref(null);

const photoTypes = {
  front: "Mặt trước",
  left: "Nghiêng trái",
  right: "Nghiêng phải",
};

// Computed
const filteredRecords = computed(() => {
  return identityStore.identityRecords.filter((record) => {
    return (
      (!searchForm.value.detaineeId ||
        record.detainee_id
          .toLowerCase()
          .includes(searchForm.value.detaineeId.toLowerCase())) &&
      (!searchForm.value.detaineeName ||
        (record.detainee_name &&
          record.detainee_name
            .toLowerCase()
            .includes(searchForm.value.detaineeName.toLowerCase()))) &&
      (!searchForm.value.arrestUnit ||
        (record.arrest_unit &&
          record.arrest_unit
            .toLowerCase()
            .includes(searchForm.value.arrestUnit.toLowerCase())))
    );
  });
});

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRecords.value.slice(start, end);
});

// Methods
const handleSearch = () => {
  currentPage.value = 1;
};

const handleReset = () => {
  searchForm.value = {
    detaineeId: "",
    detaineeName: "",
    arrestUnit: "",
  };
  currentPage.value = 1;
};

const handleView = (record) => {
  selectedRecord.value = record;
  detailDialogVisible.value = true;
};

const handleEdit = (record) => {
  router.push(`/identity/edit/${record.id}`);
};

const handleDelete = async (record) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa danh bản của "${record.detainee_name}" không?`,
      "Xác nhận xóa",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    );

    identityStore.deleteIdentityRecord(record.id);
    ElMessage.success("Xóa danh bản thành công!");
  } catch {
    ElMessage.info("Đã hủy thao tác xóa");
  }
};

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedRecord.value = null;
};

const hasPhotos = (record) => {
  if (!record.photos) return false;
  return Object.values(record.photos).some((photo) => photo !== null);
};

const getPhotoCount = (record) => {
  if (!record.photos) return 0;
  return Object.values(record.photos).filter((photo) => photo !== null).length;
};

const handleImageError = (event) => {
  event.target.style.display = "none";
  event.target.nextElementSibling.style.display = "flex";
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
.identity-list {
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

.photo-section h4 {
  margin-bottom: 15px;
  color: #333;
}

.photo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.photo-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.photo-label {
  background: #f5f5f5;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  text-align: center;
}

.photo-container {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.photo-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.no-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.no-photo .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.no-photo span {
  font-size: 12px;
}
</style>