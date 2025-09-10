<template>
  <div class="detainee-list">
    <!-- <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">Quản lý phạm nhân</span>
      </template>
    </el-page-header> -->

    <!-- Search Section -->
    <div class="search-section">
      <el-form :model="searchForm" label-width="130px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Mã phạm nhân">
              <el-input
                v-model="searchForm.detaineeCode"
                placeholder="Nhập mã phạm nhân..."
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
                <el-option
                  v-for="option in DetaineeStatus"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="onSearch" :icon="Search"
            >Tìm kiếm</el-button
          >
          <el-button @click="onReset" :icon="Refresh">Làm mới</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Action Bar -->
    <div class="action-card">
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
          Tổng số: {{ detaineeStore.getTotal }} phạm nhân
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      :data="detainees"
      style="width: 100%"
      v-loading="loading"
      stripe
      border
    >
      <el-table-column
        align="center"
        prop="detaineeCode"
        label="Mã phạm nhân"
        width="160"
        sortable show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="fullName"
        label="Họ và tên"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column label="Giới tính" width="120">
        <template #default="{ row }">
          {{ getGenderLabel(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="dateOfBirth"
        label="Ngày sinh"
        width="135" show-overflow-tooltip
      >
        <template #default="scope">
          {{ formatDate(scope.row.dateOfBirth) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="idNumber"
        label="CCCD/CMND"
        width="150" show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="detentionDate"
        label="Ngày bắt"
        width="120" show-overflow-tooltip
      >
        <template #default="scope">
          {{ formatDate(scope.row.detentionDate) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cellNumber"
        label="Buồng giam"
        width="145"
      />
      <el-table-column
        prop="charges"
        label="Tội danh"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column label="Trạng thái" width="150" align="center">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" width="200" fixed="right">
        <template #default="scope">
          <el-button  @click="handleView(scope.row)" :icon="View">
          </el-button>
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
      v-model:page-size="size"
      :total="detaineeStore.getTotal"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="pagination"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Chi tiết phạm nhân"
      width="60%"
      :before-close="handleDetailClose"
      class="dialog"
    >
      <div class="permsTree">
        <div v-if="selectedDetainee" class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Mã phạm nhân">{{
              selectedDetainee.detaineeCode
            }}</el-descriptions-item>
            <el-descriptions-item label="Số hồ sơ">{{
              selectedDetainee.profileNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Họ và tên" :span="2">{{
              selectedDetainee.fullName
            }}</el-descriptions-item>
            <el-descriptions-item label="Tên gọi khác">{{
              selectedDetainee.aliasName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Giới tính">{{
              getGenderLabel(selectedDetainee.gender)
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày sinh">{{
              formatDate(selectedDetainee.dateOfBirth)
            }}</el-descriptions-item>
            <el-descriptions-item label="Nơi sinh">{{
              selectedDetainee.placeOfBirth || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Số CCCD/CMND">{{
              selectedDetainee.idNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày cấp">{{
              formatDate(selectedDetainee.idIssueDate)
            }}</el-descriptions-item>
            <el-descriptions-item label="Nơi cấp">{{
              selectedDetainee.idIssuePlace || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Quốc tịch">{{
              selectedDetainee.nationalityName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Dân tộc">{{
              selectedDetainee.ethnicityName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Tôn giáo">{{
              selectedDetainee.religionName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Nghề nghiệp">{{
              selectedDetainee.occupation || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Họ tên cha">{{
              selectedDetainee.fatherName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Họ tên mẹ">{{
              selectedDetainee.motherName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Họ tên vợ/chồng">{{
              selectedDetainee.spouseName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Tên trại giam">{{
              selectedDetainee.detentionCenterName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày bắt">{{
              formatDate(selectedDetainee.detentionDate)
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày dự kiến thả">{{
              formatDate(selectedDetainee.expectedReleaseDate)
            }}</el-descriptions-item>
            <el-descriptions-item label="Ngày thả chính thức">{{
              formatDate(selectedDetainee.actualReleaseDate)
            }}</el-descriptions-item>
            <el-descriptions-item label="Số án">{{
              selectedDetainee.caseNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Buồng giam">{{
              selectedDetainee.cellNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item label="Trạng thái">
              <el-tag :type="getStatusType(selectedDetainee.status)">
                {{ getStatusText(selectedDetainee.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Địa chỉ thường trú" :span="2">
              {{ permanentFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="Địa chỉ tạm trú" :span="2">
              {{ temporaryFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="Nơi ở hiện tại" :span="2">
              {{ currentFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="Tội danh" :span="2">
              {{ selectedDetainee.charges || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="Thời hạn án" :span="2">
              {{ selectedDetainee.sentenceDuration || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="Tòa án xét xử" :span="2">
              {{ selectedDetainee.courtName || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="Ghi chú" :span="2">
              {{ selectedDetainee.notes || "-" }}
            </el-descriptions-item>
            <el-descriptions-item label="Ngày tạo"
              >{{ formatDate(selectedDetainee.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="Ngày cập nhật"
              >{{ formatDate(selectedDetainee.updatedAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="handleEdit(selectedDetainee?.id)"
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
import { useDetaineeStore } from "@/stores/detainee";
import type { Detainee, PageQuery } from "@/types/detainee";
import { DetaineeStatus, Gender, Status, genderOptions } from "@/constants";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const detaineeStore = useDetaineeStore();

// Reactive data
const detainees = ref<Detainee[]>([]);
const loading = ref(false);
const searchForm = reactive<{
  detaineeCode?: string;
  fullName?: string;
  idNumber?: string;
  status?: string;
}>({
  detaineeCode: "",
  fullName: "",
  idNumber: "",
  status: "",
});
const page = ref(1);
const size = ref(10);
const detailDialogVisible = ref(false);
const selectedDetainee = ref<Detainee | null>(null);

// Computed

// Methods
const formatDate = (dateStr: any) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getGenderLabel = (value: any) => {
  const option = genderOptions.find((opt) => opt.value === value);
  return option ? option.label : "Không xác định";
};

const permanentFullAddress = computed(() => {
  const parts = [
    selectedDetainee.value?.permanentAddress,
    selectedDetainee.value?.permanentWardFullName,
    selectedDetainee.value?.permanentProvinceFullName,
  ].filter((v) => !!(typeof v === "string" ? v.trim() : v));
  return parts.length ? parts.join(", ") : "-";
});

const temporaryFullAddress = computed(() => {
  const parts = [
    selectedDetainee.value?.temporaryAddress,
    selectedDetainee.value?.temporaryWardFullName,
    selectedDetainee.value?.temporaryProvinceFullName,
  ].filter((v) => !!(typeof v === "string" ? v.trim() : v));
  return parts.length ? parts.join(", ") : "-";
});

const currentFullAddress = computed(() => {
  const parts = [
    selectedDetainee.value?.currentAddress,
    selectedDetainee.value?.currentWardFullName,
    selectedDetainee.value?.currentProvinceFullName,
  ].filter((v) => !!(typeof v === "string" ? v.trim() : v));
  return parts.length ? parts.join(", ") : "-";
});
const handleEdit = (id:any) => {
  router.push(`/detainees/edit/${id}`);
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedDetainee.value = null;
};

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};
const handleView = (staff: any) => {
  selectedDetainee.value = staff;
  console.log(selectedDetainee.value);
  detailDialogVisible.value = true;
};

const search = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    await detaineeStore.fetchList({
      pageNo: page.value,
      pageSize: size.value,
      detaineeCode: searchForm.detaineeCode ?? null,
      fullName: searchForm.fullName ?? null,
      idNumber: searchForm.idNumber ?? null,
      status: searchForm.status ?? null,
      ...extra,
    } as PageQuery);

    detainees.value = detaineeStore.getDetainees || [];
  } catch (error) {
    console.error("Error fetching prison list:", error);
    ElMessage.error("Có lỗi xảy ra khi tải danh sách trại giam!");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  if (detaineeStore.pageNo) page.value = detaineeStore.pageNo;
  if (detaineeStore.pageSize) size.value = detaineeStore.pageSize;
  await search();
});

const getStatusType = (status: any) => {
  const typeMap = {
    DETAINED: "success",
    DECEASED: "warning",
    RELEASED: "info",
    TRANSFERRED: "danger",
  };
  return typeMap[status as keyof typeof typeMap] || "info";
};
const getStatusText = (status?: string) => {
  const hit = DetaineeStatus.find((o) => o.value === status);
  return hit?.label ?? status ?? "—";
};

watch(page, (p) => {
  detaineeStore.pageNo = p;
  search();
});
watch(size, (s) => {
  detaineeStore.pageSize = s;
  search();
});

const onSearch = () => {
  page.value = 1;
  search({ pageNo: 1 });
};
const onReset = () => {
  searchForm.detaineeCode = "";
  searchForm.fullName = "";
  searchForm.idNumber = "";
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
  await detaineeStore.deleteDetainee(id);
  search();
};
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
.permsTree {
  width: 100%;
  height: 60vh;
  overflow-y: auto; /* auto mượt hơn scroll cứng */
  display: flex;
  justify-content: center; /* Căn giữa ngang */
  padding: 10px 0; /* Tạo khoảng cách trên dưới */
}
</style>
