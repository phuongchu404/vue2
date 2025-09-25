<template>
  <div class="fingerprint-list">
    <!-- Search Section -->
    <div class="search-section">
      <el-form :model="searchForm" inline label-width="130">
        <el-form-item :label="$t('fingerprint.search.detaineeCode')">
          <el-input
            v-model="searchForm.detaineeCode"
            :placeholder="$t('fingerprint.search.detaineeCode')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('fingerprint.search.detaineeName')">
          <el-input
            v-model="searchForm.detaineeName"
            :placeholder="$t('fingerprint.search.detaineeName')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('department.detentionCenter')">
          <el-select
            v-model="searchForm.detentionCenterId"
            :placeholder="$t('department.placeholder.detentionCenter')"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="prison in prisons"
              :key="prison.id"
              :label="prison.name"
              :value="prison.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">
            {{ $t("common.Search") }}
          </el-button>
          <el-button @click="handleReset" :icon="Refresh">
            {{ $t("common.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Action Bar -->
    <div class="action-card">
      <div class="action-bar">
        <div>
          <el-button
            type="primary"
            @click="$router.push('/fingerprint/add')"
            :icon="Plus"
          >
            {{ $t("common.add") }}
          </el-button>
          <!-- <el-button type="success" @click="handleExport" :icon="Download">
            Xuất Excel
          </el-button>
          <el-button type="warning" @click="handleCompare" :icon="Search">
            So sánh vân tay
          </el-button> -->
        </div>
        <div class="result-info">
          {{ $t("common.total") }}: {{ fingerprintStore.getTotal }}
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <el-table
      :data="fingerprintStore.getFingerprints"
      style="width: 100%"
      v-loading="loading"
      stripe
      border
    >
      <!-- <el-table-column prop="id" :label="$t('fingerprint.table.id')" width="80" sortable align="center"/> -->
      <el-table-column
        prop="detaineeCode"
        :label="$t('fingerprint.search.detaineeCode')"
        min-width="150"
        align="center"
      />
      <el-table-column
        prop="detaineeName"
        :label="$t('fingerprint.search.detaineeName')"
        min-width="200"
        align="center"
      />
      <el-table-column
        prop="createdDate"
        :label="$t('fingerprint.table.createdDate')"
        width="140"
        align="center"
      >
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createdPlace"
        :label="$t('fingerprint.table.createdPlace')"
        min-width="150"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="fpFormula"
        :label="$t('fingerprint.table.fpFormula')"
        width="170"
        align="center"
      />
      <el-table-column
        prop="dp"
        :label="$t('fingerprint.table.dp')"
        width="80"
        align="center"
      />
      <el-table-column
        prop="tw"
        :label="$t('fingerprint.table.tw')"
        width="80"
        align="center"
      />
      <el-table-column
        :label="$t('fingerprint.table.fingerprint')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <div class="fingerprint-summary">
            <el-tag
              :type="getIndividualFingerprintTagType(scope.row)"
              size="small"
            >
              {{ getIndividualFingerprintCount(scope.row) }}/10
            </el-tag>
            <el-tag :type="getSlapTagType(scope.row)" size="small" class="mt-1">
              4N: {{ getFourFingerSlapCount(scope.row) }}/2
            </el-tag>
            <el-tag :type="getHandTagType(scope.row)" size="small" class="mt-1">
              BT: {{ getFullHandCount(scope.row) }}/2
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('fingerprint.table.totalImages')"
        width="150"
        align="center"
      >
        <template #default="scope">
          <el-tag :type="getTotalFingerprintTagType(scope.row)" size="small">
            {{ getTotalFingerprintCount(scope.row) }}/14
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Chất lượng" width="120" align="center">
          <template #default="scope">
            <el-rate
              :model-value="getQualityRating(scope.row)"
              disabled
              size="small"
              :max="5"
              show-score
              text-color="#ff9900"
            />
          </template>
        </el-table-column> -->
      <el-table-column :label="$t('common.actions')" width="200" fixed="right">
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
          <!-- <el-button
              size="small"
              type="warning"
              @click="handleMatchSearch(scope.row)"
              :icon="Search"
            >
              Tìm
            </el-button> -->
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
      v-model:current-page="page"
      v-model:page-size="size"
      :total="fingerprintStore.getTotal"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="pagination"
    />

    <!-- Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="$t('fingerprint.detail.title')"
      width="90%"
      :before-close="handleDetailClose"
      class="dialog"
    >
      <div v-if="selectedCard" class="detail-content">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-descriptions :column="1" border>
              <el-descriptions-item
                :label="$t('fingerprint.detail.detaineeCode')"
              >
                {{ selectedCard.detaineeCode }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('fingerprint.detail.detaineeName')"
              >
                {{ selectedCard.detaineeName }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('fingerprint.detail.createdDate')"
              >
                {{ formatDate(selectedCard.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('fingerprint.detail.createdPlace')"
              >
                {{ selectedCard.createdPlace || "-" }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t('fingerprint.detail.fpFormula')">
                {{ selectedCard.fpFormula || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="DP">
                {{ selectedCard.dp || "-" }}
              </el-descriptions-item>
              <el-descriptions-item label="TW">
                {{ selectedCard.tw || "-" }}
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('fingerprint.detail.reasonNote')"
              >
                {{ selectedCard.reasonNote || "-" }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>

          <el-col :span="14">
            <div class="fingerprint-section">
              <h4>{{ $t("fingerprint.detail.section.collected") }}</h4>

              <!-- Individual Fingerprints -->
              <div class="fingerprint-subsection">
                <h5>
                  {{ $t("fingerprint.detail.section.individual") }} ({{
                    getIndividualFingerprintCount(selectedCard)
                  }}/10)
                </h5>
                <div class="fingerprint-grid">
                  <div
                    v-for="finger in fingerPositions"
                    :key="finger.key"
                    class="finger-item"
                  >
                    <div class="finger-label">{{ finger.label }}</div>
                    <div class="finger-container">
                      <img
                        v-if="
                          getFingerprintObjByFinger(selectedCard, finger.key)
                        "
                        :src="
                          getFingerprintImage(
                            getFingerprintObjByFinger(selectedCard, finger.key)
                          )
                        "
                        :alt="finger.label"
                        @error="handleFingerprintImageError"
                      />
                      <div v-else class="no-fingerprint">
                        <el-icon><Pointer /></el-icon>
                        <span>{{
                          $t("fingerprint.detail.noFingerprint")
                        }}</span>
                      </div>
                    </div>

                    <div
                      class="finger-quality"
                      v-if="getFingerprintObjByFinger(selectedCard, finger.key)"
                    >
                      <!-- <el-tag
                        size="small"
                        :type="
                          getQualityTagType(
                            getFingerprintQuality(
                              getFingerprintObjByFinger(
                                selectedCard,
                                finger.key
                              )
                            )
                          )
                        "
                      >
                        {{
                          getFingerprintQuality(
                            getFingerprintObjByFinger(selectedCard, finger.key)
                          ) ?? "N/A"
                        }}
                      </el-tag> -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- Four Finger Slaps -->
              <div class="fingerprint-subsection">
                <h5>
                  {{ $t("fingerprint.detail.section.fourFingers") }} ({{
                    getFourFingerSlapCount(selectedCard)
                  }}/2)
                </h5>
                <div class="slap-grid">
                  <div class="slap-item">
                    <div class="slap-label">
                      {{ $t("fingerprint.detail.rightFour") }}
                    </div>
                    <div class="slap-container">
                      <img
                        v-if="
                          getFingerprintObjByFinger(selectedCard, 'RIGHT_FOUR')
                        "
                        :src="
                          getFingerprintImage(
                            getFingerprintObjByFinger(
                              selectedCard,
                              'RIGHT_FOUR'
                            )
                          )
                        "
                        :alt="$t('fingerprint.detail.rightFour')"
                        @error="handleFingerprintImageError"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Pointer /></el-icon>
                        <span>{{ $t("fingerprint.detail.noData") }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="slap-item">
                    <div class="slap-label">
                      {{ $t("fingerprint.detail.leftFour") }}
                    </div>
                    <div class="slap-container">
                      <img
                        v-if="
                          getFingerprintObjByFinger(selectedCard, 'LEFT_FOUR')
                        "
                        :src="
                          getFingerprintImage(
                            getFingerprintObjByFinger(selectedCard, 'LEFT_FOUR')
                          )
                        "
                        :alt="$t('fingerprint.detail.leftFour')"
                        @error="handleFingerprintImageError"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Pointer /></el-icon>
                        <span>{{ $t("fingerprint.detail.noData") }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Full Hand Prints -->
              <div class="fingerprint-subsection">
                <h5>
                  {{ $t("fingerprint.detail.section.fullHands") }} ({{
                    getFullHandCount(selectedCard)
                  }}/2)
                </h5>
                <div class="hand-grid">
                  <div class="hand-item">
                    <div class="hand-label">
                      {{ $t("fingerprint.detail.rightHand") }}
                    </div>
                    <div class="hand-container">
                      <img
                        v-if="
                          getFingerprintObjByFinger(selectedCard, 'RIGHT_FULL')
                        "
                        :src="
                          getFingerprintImage(
                            getFingerprintObjByFinger(
                              selectedCard,
                              'RIGHT_FULL'
                            )
                          )
                        "
                        :alt="$t('fingerprint.detail.rightHand')"
                        @error="handleFingerprintImageError"
                      />
                      <div v-else class="no-hand">
                        <el-icon><Pointer /></el-icon>
                        <span>Chưa có</span>
                      </div>
                    </div>
                  </div>
                  <div class="hand-item">
                    <div class="hand-label">
                      {{ $t("fingerprint.detail.leftHand") }}
                    </div>
                    <div class="hand-container">
                      <img
                        v-if="
                          getFingerprintObjByFinger(selectedCard, 'LEFT_FULL')
                        "
                        :src="
                          getFingerprintImage(
                            getFingerprintObjByFinger(selectedCard, 'LEFT_FULL')
                          )
                        "
                        :alt="$t('fingerprint.detail.leftHand')"
                        @error="handleFingerprintImageError"
                      />
                      <div v-else class="no-hand">
                        <el-icon><Pointer /></el-icon>
                        <span>{{ $t("fingerprint.detail.noData") }}</span>
                      </div>
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
        <el-button type="primary" @click="handleEdit(selectedCard)"
          >Chỉnh sửa</el-button
        >
        <!-- <el-button type="warning" @click="handleMatchSearch(selectedCard)"
          >Tìm kiếm tương đồng</el-button
        > -->
      </template>
    </el-dialog>

    <!-- Compare Dialog -->
    <!-- <el-dialog
      v-model="compareDialogVisible"
      title="So sánh vân tay"
      width="60%"
    >
      <div class="compare-content">
        <el-alert
          title="Tính năng so sánh vân tay"
          type="info"
          description="Chức năng này sẽ so sánh vân tay trong cơ sở dữ liệu để tìm các trường hợp tương đồng."
          show-icon
          :closable="false"
        />

        <el-form :model="compareForm" class="mt-4">
          <el-form-item label="Ngưỡng tương đồng">
            <el-slider
              v-model="compareForm.threshold"
              :min="60"
              :max="100"
              :step="5"
              show-stops
              show-input
            />
          </el-form-item>
          <el-form-item label="Số kết quả tối đa">
            <el-input-number
              v-model="compareForm.maxResults"
              :min="1"
              :max="50"
            />
          </el-form-item>
        </el-form>

        <div v-if="compareResults.length > 0" class="compare-results">
          <h4>Kết quả so sánh</h4>
          <el-table :data="compareResults" border>
            <el-table-column
              prop="person_id"
              label="Mã phạm nhân"
              width="120"
            />
            <el-table-column prop="detainee_name" label="Tên phạm nhân" />
            <el-table-column
              prop="similarity"
              label="Độ tương đồng"
              width="120"
            >
              <template #default="scope">
                <el-tag :type="getSimilarityTagType(scope.row.similarity)">
                  {{ scope.row.similarity }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="matched_fingers"
              label="Ngón trùng khớp"
              width="120"
            />
            <el-table-column label="Thao tác" width="100">
              <template #default="scope">
                <el-button
                  size="small"
                  @click="handleViewComparedCard(scope.row)"
                >
                  Xem
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <el-button @click="compareDialogVisible = false">Đóng</el-button>
        <el-button
          type="primary"
          @click="handleStartCompare"
          :loading="comparing"
        >
          Bắt đầu so sánh
        </el-button>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Download,
  View,
  Edit,
  Delete,
  Pointer,
} from "@element-plus/icons-vue";
import { useFingerprintStore } from "@/stores/fingerprint";
import { useRouter } from "vue-router";
import type { PageQuery } from "@/types/fingerprint";
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useBaseMixin } from "@/components/BaseMixin";
import {
  individualFingers,
  fourFingers,
  thumbFingers,
} from "@/constants/fingerprint";
import type { FingerprintCard } from "@/types/fingerprint";
import { usePrisonStore } from "@/stores/prison";
import { storeToRefs } from "pinia";

const prisonStore = usePrisonStore();
const { prisons } = storeToRefs(prisonStore);
const { t } = useI18n();
const { isButtonEnabled } = useBaseMixin();

const router = useRouter();
const fingerprintStore = useFingerprintStore();

// Reactive data
const loading = ref(false);
const comparing = ref(false);
const searchForm = reactive<{
  detaineeCode?: string;
  detaineeName?: string;
  detentionCenterId?: number;
}>({
  detaineeCode: "",
  detaineeName: "",
  detentionCenterId: undefined,
});
const page = ref(1);
const size = ref(10);
const detailDialogVisible = ref(false);
const compareDialogVisible = ref(false);
const selectedCard = ref<FingerprintCard | null>(null);

const compareForm = ref({
  threshold: 80,
  maxResults: 10,
});
const compareResults = ref([]);

// Finger positions mapping
const fingerPositions = [
  { key: "RIGHT_THUMB", label: t("fingerprint.fingers.thumbright") },
  { key: "RIGHT_INDEX", label: t("fingerprint.fingers.indexright") },
  { key: "RIGHT_MIDDLE", label: t("fingerprint.fingers.middleright") },
  { key: "RIGHT_RING", label: t("fingerprint.fingers.ringright") },
  { key: "RIGHT_LITTLE", label: t("fingerprint.fingers.littleright") },
  { key: "LEFT_THUMB", label: t("fingerprint.fingers.thumbleft") },
  { key: "LEFT_INDEX", label: t("fingerprint.fingers.indexleft") },
  { key: "LEFT_MIDDLE", label: t("fingerprint.fingers.middleleft") },
  { key: "LEFT_RING", label: t("fingerprint.fingers.ringleft") },
  { key: "LEFT_LITTLE", label: t("fingerprint.fingers.littleleft") },
];

// Computed
// const filteredCards = computed(() => {
//   return fingerprintStore.fingerprintCards.filter((card) => {
//     const matchesPersonId =
//       !searchForm.value.personId ||
//       card.person_id
//         .toLowerCase()
//         .includes(searchForm.value.personId.toLowerCase());

//     const matchesDetaineeName =
//       !searchForm.value.detaineeName ||
//       (card.detainee_name &&
//         card.detainee_name
//           .toLowerCase()
//           .includes(searchForm.value.detaineeName.toLowerCase()));

//     const matchesFormula =
//       !searchForm.value.fpFormula ||
//       (card.fp_formula &&
//         card.fp_formula
//           .toLowerCase()
//           .includes(searchForm.value.fpFormula.toLowerCase()));

//     const matchesDateRange =
//       (!searchForm.value.fromDate ||
//         card.created_date >= searchForm.value.fromDate) &&
//       (!searchForm.value.toDate ||
//         card.created_date <= searchForm.value.toDate);

//     return (
//       matchesPersonId &&
//       matchesDetaineeName &&
//       matchesFormula &&
//       matchesDateRange
//     );
//   });
// });

const onPageChange = (p: number) => {
  page.value = p;
  search();
};
const onSizeChange = (s: number) => {
  size.value = s;
  search();
};
const filteredCards = computed(() => {
  return fingerprintStore.getFingerprints;
});

// Hàm đếm số lượng ngón tay riêng lẻ
const getIndividualFingerprintCount = (card: any) => {
  return individualFingers.filter((finger) =>
    card.fingerPrintImages.some((img: any) => img.finger === finger)
  ).length;
};

// Hàm đếm ảnh 4 ngón chụm
const getFourFingerSlapCount = (card: any) => {
  return fourFingers.filter((finger) =>
    card.fingerPrintImages.some((img: any) => img.finger === finger)
  ).length;
};

// Hàm đếm ảnh bàn tay đầy đủ
const getFullHandCount = (card: any) => {
  const fullHands = ["RIGHT_FULL", "LEFT_FULL"];
  return fullHands.filter((finger) =>
    card.fingerPrintImages.some((img: any) => img.finger === finger)
  ).length;
};

// Hàm đếm tổng số ảnh (tất cả ảnh hợp lệ)
const getTotalFingerprintCount = (card: any) => {
  return card.fingerPrintImages.filter((img: any) => !!img.finger).length;
};

const getIndividualFingerprintTagType = (card: any) => {
  const count = getIndividualFingerprintCount(card);
  if (count === 10) return "success"; // Xanh: Đầy đủ 10/10
  if (count >= 7) return "warning"; // Vàng: Gần đầy đủ ≥7/10
  return "danger"; // Đỏ: Thiếu nhiều <7/10
};

// Màu cho 4 ngón chụm
const getSlapTagType = (card: any) => {
  const count = getFourFingerSlapCount(card);
  if (count === 2) return "success"; // Xanh: Đầy đủ 2/2
  if (count === 1) return "warning"; // Vàng: Một bên 1/2
  return "danger"; // Đỏ: Chưa có 0/2
};

// Màu cho bàn tay
const getHandTagType = (card: any) => {
  const count = getFullHandCount(card);
  if (count === 2) return "success"; // Xanh: Đầy đủ 2/2
  if (count === 1) return "warning"; // Vàng: Một bên 1/2
  return "danger"; // Đỏ: Chưa có 0/2
};

// Màu cho tổng số ảnh
const getTotalFingerprintTagType = (card: any) => {
  const count = getTotalFingerprintCount(card);
  if (count === 14) return "success"; // Xanh: Hoàn hảo 14/14
  if (count >= 10) return "warning"; // Vàng: Đủ dùng ≥10/14
  return "danger"; // Đỏ: Thiếu nhiều <10/14
};

// Tạo hàm lấy object ảnh theo tên ngón
const getFingerprintObjByFinger = (card: any, fingerKey: string) =>
  card?.fingerPrintImages?.find((img: any) => img?.finger === fingerKey);

// Lấy URL ảnh (ưu tiên linkUrl đã ký)
const getFingerprintImage = (obj?: any) => obj?.linkUrl || "";

// Methods
const handleSearch = () => {
  page.value = 1;
  search({ pageNo: 1 });
};

const search = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    await fingerprintStore.listPage({
      pageNo: page.value,
      pageSize: size.value,
      detaineeCode: searchForm.detaineeCode ?? null,
      detaineeName: searchForm.detaineeName ?? null,
      detentionCenterId: searchForm.detentionCenterId ?? undefined,
      ...extra,
    } as PageQuery);
  } catch (error) {
    ElMessage.error(t("common.dataFail"));
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  searchForm.detaineeCode = "";
  searchForm.detaineeName = "";
  searchForm.detentionCenterId = undefined;
  page.value = 1;
  search({ pageNo: 1 });
};

const handleView = (card: any) => {
  selectedCard.value = card;
  detailDialogVisible.value = true;
};

const handleEdit = (card: any) => {
  router.push(`/fingerprint/edit/${card.id}`);
};

const handleDelete = async (card: any) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa chỉ bản của "${card.detainee_name}" không?`,
      "Xác nhận xóa",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    );

    fingerprintStore.deleteFingerprint(card.id);
    ElMessage.success("Xóa chỉ bản thành công!");
  } catch {
    ElMessage.info("Đã hủy thao tác xóa");
  }
};

const getFingerprintCount = (card: any) => {
  if (!card.fingerprints) return 0;
  return Object.values(card.fingerprints).filter((fp) => fp !== null).length;
};

const getFingerprintTagType = (card: any) => {
  const count = getFingerprintCount(card);
  if (count === 10) return "success";
  if (count >= 5) return "warning";
  return "danger";
};

const handleExport = () => {
  ElMessage.info("Chức năng xuất Excel đang được phát triển!");
};

const handleCompare = () => {
  compareDialogVisible.value = true;
  compareResults.value = [];
};

const handleMatchSearch = (card: any) => {
  selectedCard.value = card;
  compareDialogVisible.value = true;
  compareResults.value = [];
};

// const handleStartCompare = async () => {
//   comparing.value = true;

//   try {
//     // Simulate fingerprint comparison process
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // Mock comparison results
//     compareResults.value = [
//       {
//         person_id: "PN003",
//         detainee_name: "Nguyễn Văn C",
//         similarity: 95,
//         matched_fingers: 8,
//       },
//       {
//         person_id: "PN004",
//         detainee_name: "Trần Thị D",
//         similarity: 87,
//         matched_fingers: 6,
//       },
//       {
//         person_id: "PN005",
//         detainee_name: "Lê Văn E",
//         similarity: 78,
//         matched_fingers: 5,
//       },
//     ];

//     ElMessage.success(
//       `Tìm thấy ${compareResults.value.length} kết quả tương đồng!`
//     );
//   } catch (error) {
//     ElMessage.error("Có lỗi xảy ra khi so sánh vân tay!");
//   } finally {
//     comparing.value = false;
//   }
// };

const handleViewComparedCard = (result: any) => {
  ElMessage.info(`Xem chi tiết chỉ bản của ${result.detainee_name}`);
};

const handleDetailClose = () => {
  detailDialogVisible.value = false;
  selectedCard.value = null;
};

// const getQualityRating = (card: any) => {
//   if (!card.fingerprints) return 0;
//   const qualities = Object.values(card.fingerprints)
//     .filter((fp) => fp !== null)
//     .map((fp) => getFingerprintQualityScore(fp));

//   if (qualities.length === 0) return 0;
//   return Math.round(qualities.reduce((a, b) => a + b, 0) / qualities.length);
// };

// const getFingerprintQualityScore = (fingerprint: any) => {
//   // Mock quality assessment - in real implementation this would analyze the fingerprint image
//   const mockQualities = ["Excellent", "Good", "Fair", "Poor"];
//   const quality =
//     fingerprint.quality ||
//     mockQualities[Math.floor(Math.random() * mockQualities.length)];

//   const scoreMap = { Excellent: 5, Good: 4, Fair: 3, Poor: 2 };
//   return scoreMap[quality] || 3;
// };

const getFingerprintQuality = (fingerprint: any) => {
  const mockQualities = ["Excellent", "Good", "Fair", "Poor"];
  return (
    fingerprint.quality ||
    mockQualities[Math.floor(Math.random() * mockQualities.length)]
  );
};

// const getQualityTagType = (quality: any) => {
//   const typeMap = {
//     Excellent: "success",
//     Good: "success",
//     Fair: "warning",
//     Poor: "danger",
//   };
//   return typeMap[quality] || "info";
// };

const getSimilarityTagType = (similarity: any) => {
  if (similarity >= 90) return "success";
  if (similarity >= 80) return "warning";
  return "danger";
};

// const getFingerprintImage = (fingerprint: any) => {
//   return fingerprint.minioUrl || fingerprint.imageUrl || "#";
// };

const handleFingerprintImageError = (event: any) => {
  event.target.style.display = "none";
  event.target.nextElementSibling.style.display = "flex";
};

const formatDate = (dateStr: any) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

onMounted(async () => {
  await nextTick();
  await prisonStore.getAll();
  if (fingerprintStore.pageNo) page.value = fingerprintStore.pageNo;
  if (fingerprintStore.pageSize) size.value = fingerprintStore.pageSize;
  await search();
});
</script>

<style scoped>
.fingerprint-list {
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

.fingerprint-summary {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.mt-1 {
  margin-top: 4px;
}

.fingerprint-section h4 {
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.fingerprint-subsection {
  margin-bottom: 30px;
}

.fingerprint-subsection h5 {
  margin-bottom: 15px;
  color: #555;
  font-weight: 500;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

.fingerprint-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.finger-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

.finger-label {
  background: #f5f5f5;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.finger-container {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.finger-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.no-fingerprint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.no-fingerprint .el-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.no-fingerprint span {
  font-size: 11px;
}

.finger-quality {
  padding: 5px;
  background: #fff;
}

.slap-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.slap-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.slap-label {
  background: #f0f9ff;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #0369a1;
  text-align: center;
}

.slap-container {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.slap-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.no-slap {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.no-slap .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.no-slap span {
  font-size: 12px;
}

.hand-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.hand-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.hand-label {
  background: #f0fdf4;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #15803d;
  text-align: center;
}

.hand-container {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.hand-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.no-hand {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.no-hand .el-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.no-hand span {
  font-size: 12px;
}

.compare-content .mt-4 {
  margin-top: 20px;
}

.compare-results {
  margin-top: 20px;
}

.compare-results h4 {
  margin-bottom: 15px;
  color: #333;
}

@media (max-width: 768px) {
  .fingerprint-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .slap-grid,
  .hand-grid {
    grid-template-columns: 1fr;
  }

  .slap-container {
    height: 120px;
  }

  .hand-container {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .fingerprint-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
