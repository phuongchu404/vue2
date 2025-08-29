<template>
  <div class="prison-list">
    <!-- <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">Quản lý trại giam</span>
      </template>
    </el-page-header> -->

    <!-- Search Section -->
    <div class="search-section">
      <el-form class="search-grid" :model="searchForm" inline>
        <el-form-item label="Mã trại giam">
          <el-input
            v-model="searchForm.code"
            placeholder="Nhập mã trại giam..."
            clearable
          />
        </el-form-item>
        <el-form-item label="Tên trại giam">
          <el-input
            v-model="searchForm.name"
            placeholder="Nhập tên trại giam..."
            clearable
          />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select
            style="width: 240px"
            v-model="searchForm.isActive"
            placeholder="Chọn trạng thái"
            clearable
          >
            <el-option label="Hoạt động" :value="true" />
            <el-option label="Tạm dừng" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :icon="Search"
            >Tìm kiếm</el-button
          >
          <el-button @click="onReset" :icon="Refresh">Làm mới</el-button>
        </el-form-item>
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
            Thêm trại giam mới
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            Xuất Excel
          </el-button>
        </div>
        <div class="result-info">
          Tổng số: {{ prisonStore.getTotal }} trại giam
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
        fixed="left"
        prop="code"
        label="Mã trại giam"
        width="120"
        sortable
      />
      <el-table-column prop="name" label="Tên trại giam" min-width="200" />
      <el-table-column
        prop="address"
        label="Địa chỉ"
        min-width="250"
        show-overflow-tooltip
      />
      <el-table-column prop="director" label="Giám thị" width="150" />
      <el-table-column label="Sức chứa" width="130" align="center">
        <template #default="scope">
          <el-tag type="info"
            >{{ scope.row.currentPopulation }}/{{ scope.row.capacity }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="Tỷ lệ lấp đầy" width="150">
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
      <el-table-column prop="phone" label="Điện thoại" width="130" />
      <el-table-column label="Trạng thái" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.isActive === true ? 'success' : 'danger'">
            {{ scope.row.isActive === true ? "Hoạt động" : "Tạm dừng" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" min-width="200" fixed="right">
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
            @click="onDelete(scope.row)"
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
      title="Chi tiết trại giam"
      width="60%"
      :before-close="handleDetailClose"
    >
      <div v-if="selectedPrison" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Mã trại giam">{{
            selectedPrison.code
          }}</el-descriptions-item>
          <el-descriptions-item label="Tên trại giam">{{
            selectedPrison.name
          }}</el-descriptions-item>
          <el-descriptions-item label="Giám thị" :span="2">{{
            selectedPrison.director
          }}</el-descriptions-item>
          <el-descriptions-item label="Địa chỉ" :span="2">{{
            selectedPrison.address
          }}</el-descriptions-item>
          <el-descriptions-item label="Điện thoại">{{
            selectedPrison.phone
          }}</el-descriptions-item>
          <el-descriptions-item label="Sức chứa tối đa"
            >{{ selectedPrison.capacity }} người</el-descriptions-item
          >
          <el-descriptions-item label="Số phạm nhân hiện tại"
            >{{ selectedPrison?.currentPopulation }} người</el-descriptions-item
          >
          <el-descriptions-item label="Tỷ lệ lấp đầy">
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
          <el-descriptions-item label="Trạng thái">
            <el-tag
              :type="selectedPrison.isActive === true ? 'success' : 'danger'"
            >
              {{ selectedPrison.isActive === true ? "Hoạt động" : "Tạm dừng" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Ngày tạo">{{
            formatDate(selectedPrison.createdAt)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="handleEdit(selectedPrison)"
          >Chỉnh sửa</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { usePrisonStore } from "@/stores/prison";
import { useRouter } from "vue-router";
import type { PageQuery, Prison } from "@/types/prison";
import {
  Delete,
  Edit,
  Refresh,
  Plus,
  Search,
  View,
  Download,
} from "@element-plus/icons-vue";

const prisonStore = usePrisonStore();
const router = useRouter();

// Reactive data
const loading = ref(false);
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

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};
const handleView = (prison: any) => {
  selectedPrison.value = prison;
  detailDialogVisible.value = true;
};

const search = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    const request = {
      pageNo: page.value,
      pageSize: size.value,
      code: searchForm.code?.trim() ?? null,
      name: searchForm.name?.trim() ?? null,
      isActive: searchForm.isActive ?? undefined,
      ...extra,
    } as PageQuery;
    console.log(request);
    await prisonStore.fetchList(request);

    prisons.value = prisonStore.getPrisons || [];
  } catch (error) {
    // console.error("Error fetching prison list:", error);
    ElMessage.error("Có lỗi xảy ra khi tải danh sách trại giam!");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  if (prisonStore.pageNo) page.value = prisonStore.pageNo;
  if (prisonStore.pageSize) size.value = prisonStore.pageSize;
  await search();
});

watch(page, (p) => {
  prisonStore.pageNo = p;
  search();
});
watch(size, (s) => {
  prisonStore.pageSize = s;
  search();
});

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
  await prisonStore.deletePrison(id);
  search();
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