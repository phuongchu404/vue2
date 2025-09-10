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
            <el-form-item :label="$t('detainee.code')">
              <el-input
                v-model="searchForm.detaineeCode"
                :placeholder="$t('detainee.placeholder.code')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('detainee.fullName')">
              <el-input
                v-model="searchForm.fullName"
                :placeholder="$t('detainee.placeholder.fullName')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-form-item :label="$t('detainee.idNumber')">
              <el-input
                v-model="searchForm.idNumber"
                :placeholder="$t('detainee.placeholder.idNumber')"
                clearable
              /> </el-form-item
          ></el-col>
          <el-col :span="8"
            ><el-form-item :label="$t('detainee.status')">
              <el-select
                v-model="searchForm.status"
                :placeholder="$t('detainee.placeholder.status')"
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
            >{{ $t('common.Search') }}</el-button
          >
          <el-button @click="onReset" :icon="Refresh">{{ $t('common.reset') }}</el-button>
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
            {{ $t('common.add') }}
          </el-button>
          <el-button type="success" @click="handleExport" :icon="Download">
            {{ $t('common.export') }}
          </el-button>
        </div>
        <div class="result-info">
          {{ $t('common.total') }}: {{ detaineeStore.getTotal }} {{ $t('common.unit') }}
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
        :label="$t('detainee.code')"
        width="160"
        sortable show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="fullName"
        :label="$t('detainee.fullName')"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('detainee.gender')" width="120">
        <template #default="{ row }">
          {{ getGenderLabel(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="dateOfBirth"
        :label="$t('detainee.dateOfBirth')"
        width="135" show-overflow-tooltip
      >
        <template #default="scope">
          {{ formatDate(scope.row.dateOfBirth) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="idNumber"
        :label="$t('detainee.idNumber')"
        width="150" show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="detentionDate"
        :label="$t('detainee.detentionDate')"
        width="120" show-overflow-tooltip
      >
        <template #default="scope">
          {{ formatDate(scope.row.detentionDate) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="cellNumber"
        :label="$t('detainee.cellNumber')"
        width="145"
      />
      <el-table-column
        prop="charges"
        :label="$t('detainee.charges')"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column :label="$t('detainee.status')" width="150" align="center">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" width="200" fixed="right">
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
      :locale="{
        goto: t('el.pagination.goto'),
        pagesize: t('el.pagination.pagesize'),
        total: t('el.pagination.total'),
        pageClassifier: t('el.pagination.pageClassifier')
      }"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="$t('detainee.detailTitle')"
      width="60%"
      :before-close="handleDetailClose"
      class="dialog"
    >
      <div class="permsTree">
        <div v-if="selectedDetainee" class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="$t('detainee.code')">{{
              selectedDetainee.detaineeCode
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.profileNumber')">{{
              selectedDetainee.profileNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.fullName')" :span="2">{{
              selectedDetainee.fullName
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.aliasName')">{{
              selectedDetainee.aliasName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.gender')">{{
              getGenderLabel(selectedDetainee.gender)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.dateOfBirth')">{{
              formatDate(selectedDetainee.dateOfBirth)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.placeOfBirth')">{{
              selectedDetainee.placeOfBirth || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.idNumber')">{{
              selectedDetainee.idNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.idIssueDate')">{{
              formatDate(selectedDetainee.idIssueDate)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.idIssuePlace')">{{
              selectedDetainee.idIssuePlace || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.nationality')">{{
              selectedDetainee.nationalityName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.ethnicity')">{{
              selectedDetainee.ethnicityName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.religion')">{{
              selectedDetainee.religionName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.occupation')">{{
              selectedDetainee.occupation || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.fatherName')">{{
              selectedDetainee.fatherName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.motherName')">{{
              selectedDetainee.motherName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.spouseName')">{{
              selectedDetainee.spouseName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.detentionCenter')">{{
              selectedDetainee.detentionCenterName || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.detentionDate')">{{
              formatDate(selectedDetainee.detentionDate)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.expectedReleaseDate')">{{
              formatDate(selectedDetainee.expectedReleaseDate)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.actualReleaseDate')">{{
              formatDate(selectedDetainee.actualReleaseDate)
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.caseNumber')">{{
              selectedDetainee.caseNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.cellNumber')">{{
              selectedDetainee.cellNumber || "-"
            }}</el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.status')">
              <el-tag :type="getStatusType(selectedDetainee.status)">
                {{ getStatusText(selectedDetainee.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.permanentAddress')" :span="2">
              {{ permanentFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.temporaryAddress')" :span="2">
              {{ temporaryFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.currentAddress')" :span="2">
              {{ currentFullAddress }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.charges')" :span="2">
              {{ selectedDetainee.charges || "-" }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.sentenceDuration')" :span="2">
              {{ selectedDetainee.sentenceDuration || "-" }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.courtName')" :span="2">
              {{ selectedDetainee.courtName || "-" }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.notes')" :span="2">
              {{ selectedDetainee.notes || "-" }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.createdAt')"
              >{{ formatDate(selectedDetainee.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('detainee.updatedAt')"
              >{{ formatDate(selectedDetainee.updatedAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="handleEdit(selectedDetainee?.id)"
          >{{ $t('common.edit') }}</el-button
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
  ElMessage.info(t('common.exportUpdating'));
};
const handleView = (staff: any) => {
  selectedDetainee.value = staff;
  console.log(selectedDetainee.value);
  detailDialogVisible.value = true;
};

const search = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    await detaineeStore.listPage({
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
onMounted(async () => {
  await nextTick();
  if (detaineeStore.pageNo) page.value = detaineeStore.pageNo;
  if (detaineeStore.pageSize) size.value = detaineeStore.pageSize;
  await search();
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
.permsTree {
  width: 100%;
  height: 60vh;
  overflow-y: auto; /* auto mượt hơn scroll cứng */
  display: flex;
  justify-content: center; /* Căn giữa ngang */
  padding: 10px 0; /* Tạo khoảng cách trên dưới */
}
</style>
