<template>
  <div class="identity-list">
    <div class="search-section">
      <el-form
        :model="searchForm"
        inline
        label-width="auto"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('identity.detaineeId')">
              <el-input
                v-model="searchForm.detaineeCode"
                :placeholder="t('identity.placeholder.detaineeId')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('identity.detaineeName')">
              <el-input
                v-model="searchForm.detaineeName"
                :placeholder="t('identity.placeholder.detaineeName')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="t('identity.arrestUnit')">
              <el-input
                v-model="searchForm.arrestUnit"
                :placeholder="t('identity.placeholder.arrestUnit')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="onSearch" :icon="Search">
                {{ $t("common.Search") }}
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
            @click="$router.push('/identity/add')"
            :icon="Plus"
          >
            {{ t("common.add") }}
          </el-button>
          <!-- <el-button
            type="success"
            @click="exportSelectedToExcel"
            :icon="Download"
          >
            {{ t("common.export") }}
          </el-button> -->
        </div>
        <div class="result-info">
          {{ t("common.total") }}: {{ identityStore.getTotal }}
          {{ t("common.unit") }}
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      :data="identities"
      style="width: 100%"
      v-loading="loading"
      stripe
      border
    >
      <el-table-column
        type="index"
        prop="id"
        :label="$t('common.index')"
        width="85"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="detaineeCode"
        :label="t('identity.detaineeId')"
        width="170"
        align="center"
      />
      <el-table-column
        prop="detaineeName"
        :label="t('identity.detaineeName')"
        min-width="180"
      />
      <el-table-column
        prop="arrestDate"
        :label="t('identity.arrestDate')"
        width="140"
        align="center"
      >
        <template #default="scope">
          {{ formatDate(scope.row.arrestDate) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="arrestUnit"
        :label="t('identity.arrestUnit')"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="fpClassification"
        :label="t('identity.fpClassification')"
        align="center"
        width="150"
      />
      <el-table-column
        :label="t('identity.photoTable')"
        width="150"
        align="center"
      >
        <template #default="scope">
          <el-tag v-if="hasPhotos(scope.row)" type="success" size="small">
            {{ getPhotoCount(scope.row) }}/3
          </el-tag>
          <el-tag v-else type="info" size="small">0/3</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        align="center"
        :label="t('common.createTime')"
        width="180"
      >
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="200" fixed="right">
        <template #default="scope">
          <el-button @click="handleView(scope.row)" :icon="View" />
          <el-button
            type="primary"
            @click="handleEdit(scope.row)"
            :icon="Edit"
          />
          <el-button
            type="danger"
            @click="handleDelete(scope.row)"
            :icon="Delete"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="identityStore.getTotal"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="pagination"
    />
    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Chi tiết danh bản"
      width="80%"
      :before-close="handleDetailClose"
      class="dialog"
    >
      <div v-if="selectedRecord" class="detail-content">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Mã phạm nhân">{{
                selectedRecord.detaineeCode
              }}</el-descriptions-item>
              <el-descriptions-item label="Tên phạm nhân">{{
                selectedRecord.detaineeName
              }}</el-descriptions-item>
              <el-descriptions-item label="Tạo tại">{{
                selectedRecord.createdPlace || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Lý do lập">{{
                selectedRecord.reasonNote || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Ngày bắt">{{
                formatDate(selectedRecord.arrestDate)
              }}</el-descriptions-item>
              <el-descriptions-item label="Đơn vị bắt">{{
                selectedRecord.arrestUnit || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Phân loại VT" :span="2">{{
                selectedRecord.fpClassification || "-"
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
                selectedRecord.anthropometry.faceShape || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Chiều cao">{{
                selectedRecord.anthropometry.heightCm
                  ? selectedRecord.anthropometry.heightCm + " cm"
                  : "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Sống mũi">{{
                selectedRecord.anthropometry.noseBridge || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Nếp tai dưới">{{
                selectedRecord.anthropometry.earLowerFold || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Dái tai" :span="2">{{
                selectedRecord.anthropometry.earLobe || "-"
              }}</el-descriptions-item>
              <el-descriptions-item label="Dấu vết riêng" :span="2">{{
                selectedRecord.anthropometry.distinctiveMarks || "-"
              }}</el-descriptions-item>
            </el-descriptions>
          </el-col>

          <el-col :span="10">
            <div class="photo-section">
              <h4>Ảnh danh bản</h4>
              <div class="photo-grid">
                <div
                  v-for="[key, label] in photoTypeEntries"
                  :key="key"
                  class="photo-item"
                >
                  <div class="photo-label">{{ label }}</div>
                  <div class="photo-container">
                    <img
                      v-if="photoMap[key]"
                      :src="photoMap[key]"
                      :alt="label"
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

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch, nextTick } from "vue";
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
import { useIdentityStore } from "@/stores/identity";
import type { Identity, PageQuery } from "@/types/identity";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useBaseMixin } from "@/components/BaseMixin";
// import * as XLSX from "xlsx";
// import { headerMap, columnWidths } from "@/excel/identity";

const { t } = useI18n();
const { isButtonEnabled } = useBaseMixin();

const router = useRouter();
const identityStore = useIdentityStore();
const identities = ref<Identity[]>([]);

// Reactive data
const loading = ref(false);
const searchForm = reactive<{
  detaineeCode?: string;
  detaineeName?: string;
  arrestUnit?: string;
}>({
  detaineeCode: "",
  detaineeName: "",
  arrestUnit: "",
});
const page = ref(1);
const size = ref(10);
const detailDialogVisible = ref(false);
const selectedRecord = ref<Identity | null>(null);
// const exporting = ref(false);

const photoTypes = {
  front: "Mặt trước",
  left: "Nghiêng trái",
  right: "Nghiêng phải",
};

const viewToKey: Record<string, keyof typeof photoTypes> = {
  FRONT: "front",
  LEFT_PROFILE: "left",
  RIGHT_PROFILE: "right",
};
const photoMap = computed<Record<keyof typeof photoTypes, string>>(() => {
  const out = { front: "", left: "", right: "" } as Record<
    keyof typeof photoTypes,
    string
  >;
  const list = selectedRecord.value?.photos ?? [];
  for (const p of list) {
    const k = viewToKey[p.view as string];
    if (!k) continue;
    // ưu tiên presigned linkUrl, fallback objectUrl
    out[k] = p.linkUrl || p.objectUrl || "";
  }
  return out;
});

// Computed
const photoTypeEntries = computed(
  () => Object.entries(photoTypes) as [keyof typeof photoTypes, string][]
);
// Methods
const formatDate = (dateStr: any) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
const search = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    await identityStore.listPage({
      pageNo: page.value,
      pageSize: size.value,
      detaineeCode: searchForm.detaineeCode ?? null,
      detaineeName: searchForm.detaineeName ?? null,
      arrestUnit: searchForm.arrestUnit ?? null,
      ...extra,
    } as PageQuery);

    identities.value = identityStore.getIdentities || [];
  } catch (error) {
    ElMessage.error(t("common.dataFail"));
  } finally {
    loading.value = false;
  }
};
// function toExportRow(item: any) {
//   const ant = item.anthropometry || {};
//   return {
//     detaineeCode: item.detaineeCode ?? "",
//     detaineeName: item.detaineeName ?? "",
//     createdPlace: item.createdPlace ?? "",
//     reasonNote: item.reasonNote ?? "",
//     arrestDate: item.arrestDate
//       ? new Date(item.arrestDate).toLocaleDateString()
//       : "",
//     arrestUnit: item.arrestUnit ?? "",
//     fpClassification: item.fpClassification ?? "",
//     dp: item.dp ?? "",
//     tw: item.tw ?? "",
//     akFileNo: item.akFileNo ?? "",
//     notes: item.notes ?? "",
//
//     // anthropometry flatten
//     "anthropometry.faceShape": ant.faceShape ?? "",
//     "anthropometry.heightCm": ant.heightCm ?? "",
//     "anthropometry.noseBridge": ant.noseBridge ?? "",
//     "anthropometry.distinctiveMarks": ant.distinctiveMarks ?? "",
//     "anthropometry.earLowerFold": ant.earLowerFold ?? "",
//     "anthropometry.earLobe": ant.earLobe ?? "",
//   };
// }

const exportSelectedToExcel = async () => {
  // if (selectedRows.value.length === 0) {
  //   ElMessage.warning("Vui lòng chọn ít nhất một bản ghi để xuất!");
  //   return;
  // }
  // exporting.value = true;
  // try {
  //   const keys = Object.keys(headerMap);
  //   const rows = identities.value.map((it: any) => toExportRow(it));
  //
  //   const chunkSize = 50_000;
  //   const wb = XLSX.utils.book_new();
  //
  //   for (
  //     let start = 0, part = 1;
  //     start < rows.length;
  //     start += chunkSize, part++
  //   ) {
  //     const chunk = rows.slice(start, start + chunkSize);
  //
  //     // matrix dữ liệu theo thứ tự keys
  //     const dataMatrix = chunk.map((r: any) => keys.map((k) => r[k]));
  //
  //     // tạo sheet: thêm header tiếng Việt ở dòng đầu
  //     const ws = XLSX.utils.aoa_to_sheet([
  //       keys.map((k) => headerMap[k]),
  //       ...dataMatrix,
  //     ]);
  //
  //     (ws as any)["!cols"] = columnWidths;
  //
  //     XLSX.utils.book_append_sheet(wb, ws, `Danh bản (${part})`);
  //   }
  //
  //   // tên file
  //   const today = new Date();
  //   const filename = `danh-ban-${today.getFullYear()}-${(today.getMonth() + 1)
  //     .toString()
  //     .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}.xlsx`;
  //
  //   await XLSX.writeFile(wb, filename);
  //   ElMessage.success(`Xuất Excel thành công! File: ${filename}`);
  // } catch (error) {
  //   console.error("Export error:", error);
  //   ElMessage.error("Lỗi khi xuất Excel!");
  // } finally {
  //   exporting.value = false;
  // }
};
const onSearch = () => {
  page.value = 1;
  search({ pageNo: 1 });
};
const onReset = () => {
  searchForm.detaineeCode = "";
  searchForm.detaineeName = "";
  searchForm.arrestUnit = "";
  page.value = 1;
  search({ pageNo: 1 });
};

const handleView = (record: any) => {
  selectedRecord.value = record;
  detailDialogVisible.value = true;
};

const handleEdit = (record: any) => {
  router.push(`/identity/edit/${record.id}`);
};

const handleDelete = async (record: any) => {
  try {
    const ok = await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa danh bản của "${record.detaineeName}" không?`,
      "Xác nhận xóa",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    )
      .then(() => true)
      .catch(() => false);

    if (!ok) return;
    await identityStore.deleteIdentity(record.id);
    search();
  } catch {
    ElMessage.info("Đã hủy thao tác xóa");
  }
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedRecord.value = null;
};

const hasPhotos = (record: any) => {
  if (!record.photos) return false;
  return Object.values(record.photos).some((photo) => photo !== null);
};

const getPhotoCount = (record: any) => {
  if (!record.photos) return 0;
  return Object.values(record.photos).filter((photo) => photo !== null).length;
};

const handleImageError = (event: any) => {
  event.target.style.display = "none";
  event.target.nextElementSibling.style.display = "flex";
};
// watch(page, (p) => {
//   identityStore.pageNo = p;
//   search();
// });
// watch(size, (s) => {
//   identityStore.pageSize = s;
//   search();
// });

const onPageChange = (p: number) => {
  page.value = p;
  search();
};
const onSizeChange = (s: number) => {
  size.value = s;
  search();
};

onMounted(async () => {
  await nextTick();
  if (identityStore.pageNo) page.value = identityStore.pageNo;
  if (identityStore.pageSize) size.value = identityStore.pageSize;
  await search();
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
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
