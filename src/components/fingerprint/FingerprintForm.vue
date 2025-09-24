<template>
  <div class="fingerprint-form">
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <el-divider content-position="left">Thông tin chỉ bản</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Mã phạm nhân" prop="person_id">
              <el-select
                v-model="form.person_id"
                placeholder="Chọn phạm nhân"
                filterable
                @change="onDetaineeChange"
                :disabled="isEdit"
              >
                <el-option
                  v-for="detainee in detaineeStore.detainees"
                  :key="detainee.id"
                  :label="`${detainee.detainee_code} - ${detainee.full_name}`"
                  :value="detainee.detainee_code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Ngày lập" prop="created_date">
              <el-date-picker
                v-model="form.created_date"
                type="date"
                placeholder="Chọn ngày lập"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Tạo tại">
              <el-input
                v-model="form.created_place"
                placeholder="Nhập nơi tạo chỉ bản..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Lý do lập">
              <el-input
                v-model="form.reason_note"
                placeholder="Nhập lý do lập chỉ bản..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Thông số kỹ thuật</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Công thức vân tay">
              <el-input
                v-model="form.fp_formula"
                placeholder="Nhập công thức vân tay..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="DP">
              <el-input v-model="form.dp" placeholder="Nhập DP..." />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="TW">
              <el-input v-model="form.tw" placeholder="Nhập TW..." />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Thu thập vân tay</el-divider>

        <div class="fingerprint-upload-section">
          <el-alert
            title="Hướng dẫn thu thập vân tay"
            type="info"
            description="Thu thập đầy đủ: 10 vân tay đơn, 4 ngón chụm (2 tay), toàn bộ bàn tay (2 tay). Định dạng: JPG, PNG, WSQ. Tối đa: 5MB."
            show-icon
            :closable="false"
            class="mb-4"
          />

          <!-- Individual Fingerprints -->
          <div class="section-title">
            <h4>1. Vân tay từng ngón (10 ngón)</h4>
          </div>
          <div class="fingerprint-grid">
            <!-- Right Hand -->
            <div class="hand-section">
              <h4>Tay phải</h4>
              <div class="fingers-row">
                <div
                  v-for="finger in rightHandFingers"
                  :key="finger.key"
                  class="finger-slot"
                  @click="selectFinger(finger.key)"
                >
                  <div class="finger-label">{{ finger.label }}</div>
                  <div class="finger-container">
                    <img
                      v-if="fingerprintPreviews[finger.key]"
                      :src="fingerprintPreviews[finger.key]"
                      :alt="finger.label"
                      class="fingerprint-preview"
                    />
                    <div v-else class="no-fingerprint">
                      <el-icon><Plus /></el-icon>
                      <span>Thêm ảnh</span>
                    </div>
                  </div>
                  <div
                    v-if="fingerprintFiles[finger.key]"
                    class="finger-actions"
                  >
                    <el-tag size="small" type="success">
                      {{ getFileSize(fingerprintFiles[finger.key]) }}
                    </el-tag>
                    <el-button
                      size="small"
                      type="danger"
                      @click.stop="removeFinger(finger.key)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Left Hand -->
            <div class="hand-section">
              <h4>Tay trái</h4>
              <div class="fingers-row">
                <div
                  v-for="finger in leftHandFingers"
                  :key="finger.key"
                  class="finger-slot"
                  @click="selectFinger(finger.key)"
                >
                  <div class="finger-label">{{ finger.label }}</div>
                  <div class="finger-container">
                    <img
                      v-if="fingerprintPreviews[finger.key]"
                      :src="fingerprintPreviews[finger.key]"
                      :alt="finger.label"
                      class="fingerprint-preview"
                    />
                    <div v-else class="no-fingerprint">
                      <el-icon><Plus /></el-icon>
                      <span>Thêm ảnh</span>
                    </div>
                  </div>
                  <div
                    v-if="fingerprintFiles[finger.key]"
                    class="finger-actions"
                  >
                    <el-tag size="small" type="success">
                      {{ getFileSize(fingerprintFiles[finger.key]) }}
                    </el-tag>
                    <el-button
                      size="small"
                      type="danger"
                      @click.stop="removeFinger(finger.key)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Four Finger Slaps -->
          <div class="section-title">
            <h4>2. Ảnh 4 ngón chụm</h4>
            <p class="section-description">
              Chụp 4 ngón tay (trừ ngón cái) ép xuống cùng lúc
            </p>
          </div>
          <div class="four-finger-section">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="slap-card">
                  <h5>4 ngón chụm tay phải</h5>
                  <div
                    class="slap-slot"
                    @click="selectFinger('RIGHT_FOUR_SLAP')"
                  >
                    <div class="slap-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FOUR_SLAP']"
                        :src="fingerprintPreviews['RIGHT_FOUR_SLAP']"
                        alt="4 ngón chụm tay phải"
                        class="slap-preview"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Plus /></el-icon>
                        <span>Thêm ảnh 4 ngón chụm tay phải</span>
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['RIGHT_FOUR_SLAP']"
                      class="slap-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["RIGHT_FOUR_SLAP"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('RIGHT_FOUR_SLAP')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="slap-card">
                  <h5>4 ngón chụm tay trái</h5>
                  <div
                    class="slap-slot"
                    @click="selectFinger('LEFT_FOUR_SLAP')"
                  >
                    <div class="slap-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FOUR_SLAP']"
                        :src="fingerprintPreviews['LEFT_FOUR_SLAP']"
                        alt="4 ngón chụm tay trái"
                        class="slap-preview"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Plus /></el-icon>
                        <span>Thêm ảnh 4 ngón chụm tay trái</span>
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['LEFT_FOUR_SLAP']"
                      class="slap-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["LEFT_FOUR_SLAP"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('LEFT_FOUR_SLAP')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Full Hand Prints -->
          <div class="section-title">
            <h4>3. Ảnh toàn bộ bàn tay</h4>
            <p class="section-description">
              Chụp toàn bộ bàn tay bao gồm cả lòng bàn tay
            </p>
          </div>
          <div class="full-hand-section">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="hand-card">
                  <h5>Bàn tay phải</h5>
                  <div
                    class="hand-slot"
                    @click="selectFinger('RIGHT_FULL_HAND')"
                  >
                    <div class="hand-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FULL_HAND']"
                        :src="fingerprintPreviews['RIGHT_FULL_HAND']"
                        alt="Bàn tay phải"
                        class="hand-preview"
                      />
                      <div v-else class="no-hand">
                        <el-icon><Plus /></el-icon>
                        <span>Thêm ảnh bàn tay phải</span>
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['RIGHT_FULL_HAND']"
                      class="hand-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["RIGHT_FULL_HAND"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('RIGHT_FULL_HAND')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="hand-card">
                  <h5>Bàn tay trái</h5>
                  <div
                    class="hand-slot"
                    @click="selectFinger('LEFT_FULL_HAND')"
                  >
                    <div class="hand-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FULL_HAND']"
                        :src="fingerprintPreviews['LEFT_FULL_HAND']"
                        alt="Bàn tay trái"
                        class="hand-preview"
                      />
                      <div v-else class="no-hand">
                        <el-icon><Plus /></el-icon>
                        <span>Thêm ảnh bàn tay trái</span>
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['LEFT_FULL_HAND']"
                      class="hand-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["LEFT_FULL_HAND"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('LEFT_FULL_HAND')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- File input (hidden) -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*,.wsq"
            style="display: none"
            @change="handleFileChange"
          />

          <!-- Progress indicator -->
          <div
            v-if="uploadProgress > 0 && uploadProgress < 100"
            class="upload-progress"
          >
            <el-progress :percentage="uploadProgress" :status="uploadStatus" />
          </div>
        </div>

        <!-- Quality Assessment -->
        <el-divider content-position="left">Đánh giá chất lượng</el-divider>

        <div class="quality-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="quality-stats">
                <h4>Thống kê vân tay</h4>
                <el-descriptions :column="1" size="small" border>
                  <el-descriptions-item label="Vân tay từng ngón">
                    <el-tag type="info"
                      >{{ getIndividualFingerprints() }}/10</el-tag
                    >
                  </el-descriptions-item>
                  <el-descriptions-item label="Ảnh 4 ngón chụm">
                    <el-tag type="info">{{ getFourFingerSlaps() }}/2</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="Ảnh toàn bộ bàn tay">
                    <el-tag type="info">{{ getFullHands() }}/2</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="Tổng số ảnh">
                    <el-tag type="success"
                      >{{ getTotalFingerprints() }}/14</el-tag
                    >
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="quality-rating">
                <h4>Đánh giá tổng thể</h4>
                <div class="overall-rating">
                  <el-rate
                    :model-value="getOverallQuality()"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value} điểm"
                  />
                </div>
                <el-progress
                  :percentage="getCompletionPercentage()"
                  :color="getProgressColor()"
                  class="completion-progress"
                />
                <p class="completion-text">
                  Hoàn thành {{ getCompletionPercentage() }}%
                </p>

                <!-- Completion checklist -->
                <div class="completion-checklist">
                  <el-tag
                    :type="
                      getIndividualFingerprints() === 10 ? 'success' : 'warning'
                    "
                    size="small"
                  >
                    {{ getIndividualFingerprints() === 10 ? "✓" : "○" }} 10 vân
                    tay đơn
                  </el-tag>
                  <el-tag
                    :type="getFourFingerSlaps() === 2 ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ getFourFingerSlaps() === 2 ? "✓" : "○" }} 2 ảnh 4 ngón
                    chụm
                  </el-tag>
                  <el-tag
                    :type="getFullHands() === 2 ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ getFullHands() === 2 ? "✓" : "○" }} 2 ảnh bàn tay
                  </el-tag>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-form-item class="form-actions">
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitting"
            :disabled="getTotalFingerprints() === 0"
          >
            {{ isEdit ? "Cập nhật" : "Tạo mới" }}
          </el-button>
          <el-button @click="handleReset">Làm mới</el-button>
          <el-button @click="$router.go(-1)">Hủy</el-button>
          <el-button
            type="success"
            @click="handlePreview"
            v-if="getTotalFingerprints() > 0"
          >
            Xem trước
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Preview Dialog -->
    <el-dialog
      v-model="previewDialogVisible"
      title="Xem trước chỉ bản"
      width="80%"
    >
      <div class="preview-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <template #header>Thông tin cơ bản</template>
              <el-descriptions :column="1" size="small">
                <el-descriptions-item label="Mã phạm nhân">{{
                  form.person_id
                }}</el-descriptions-item>
                <el-descriptions-item label="Ngày lập">{{
                  formatDate(form.created_date)
                }}</el-descriptions-item>
                <el-descriptions-item label="Tạo tại">{{
                  form.created_place || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="Công thức VT">{{
                  form.fp_formula || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="DP">{{
                  form.dp || "-"
                }}</el-descriptions-item>
                <el-descriptions-item label="TW">{{
                  form.tw || "-"
                }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card>
              <template #header>Vân tay thu thập được</template>

              <!-- Individual fingerprints -->
              <div class="preview-section">
                <h5>
                  Vân tay từng ngón ({{ getIndividualFingerprints() }}/10)
                </h5>
                <div class="preview-fingerprint-grid">
                  <div
                    v-for="finger in allFingers"
                    :key="finger.key"
                    class="preview-finger-item"
                    :class="{
                      'has-fingerprint': fingerprintPreviews[finger.key],
                    }"
                  >
                    <div class="preview-finger-label">{{ finger.label }}</div>
                    <div class="preview-finger-container">
                      <img
                        v-if="fingerprintPreviews[finger.key]"
                        :src="fingerprintPreviews[finger.key]"
                        :alt="finger.label"
                      />
                      <div v-else class="preview-no-fingerprint">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Four finger slaps -->
              <div class="preview-section">
                <h5>Ảnh 4 ngón chụm ({{ getFourFingerSlaps() }}/2)</h5>
                <div class="preview-slap-grid">
                  <div
                    class="preview-slap-item"
                    :class="{
                      'has-image': fingerprintPreviews['RIGHT_FOUR_SLAP'],
                    }"
                  >
                    <div class="preview-slap-label">4 ngón chụm tay phải</div>
                    <div class="preview-slap-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FOUR_SLAP']"
                        :src="fingerprintPreviews['RIGHT_FOUR_SLAP']"
                        alt="4 ngón chụm tay phải"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div
                    class="preview-slap-item"
                    :class="{
                      'has-image': fingerprintPreviews['LEFT_FOUR_SLAP'],
                    }"
                  >
                    <div class="preview-slap-label">4 ngón chụm tay trái</div>
                    <div class="preview-slap-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FOUR_SLAP']"
                        :src="fingerprintPreviews['LEFT_FOUR_SLAP']"
                        alt="4 ngón chụm tay trái"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Full hands -->
              <div class="preview-section">
                <h5>Ảnh toàn bộ bàn tay ({{ getFullHands() }}/2)</h5>
                <div class="preview-hand-grid">
                  <div
                    class="preview-hand-item"
                    :class="{
                      'has-image': fingerprintPreviews['RIGHT_FULL_HAND'],
                    }"
                  >
                    <div class="preview-hand-label">Bàn tay phải</div>
                    <div class="preview-hand-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FULL_HAND']"
                        :src="fingerprintPreviews['RIGHT_FULL_HAND']"
                        alt="Bàn tay phải"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div
                    class="preview-hand-item"
                    :class="{
                      'has-image': fingerprintPreviews['LEFT_FULL_HAND'],
                    }"
                  >
                    <div class="preview-hand-label">Bàn tay trái</div>
                    <div class="preview-hand-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FULL_HAND']"
                        :src="fingerprintPreviews['LEFT_FULL_HAND']"
                        alt="Bàn tay trái"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <el-button @click="previewDialogVisible = false">Đóng</el-button>
        <el-button
          type="primary"
          @click="handleSubmitFromPreview"
          :loading="submitting"
        >
          {{ isEdit ? "Cập nhật chỉ bản" : "Tạo chỉ bản" }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus, Delete, Close } from "@element-plus/icons-vue";
import { useFingerprintStore } from "@/stores/fingerprint";
import { useDetaineeStore } from "@/stores/detainee";

const route = useRoute();
const router = useRouter();
const fingerprintStore = useFingerprintStore();
const detaineeStore = useDetaineeStore();

// Reactive data
const formRef = ref();
const fileInput = ref();
const submitting = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref("");
const previewDialogVisible = ref(false);
const currentSelectedFinger = ref(null);
const isEdit = computed(() => !!route.params.id);

const form = reactive({
  person_id: "",
  created_date: "",
  created_place: "",
  reason_note: "",
  fp_formula: "",
  dp: "",
  tw: "",
});

const fingerprintFiles = reactive({});
const fingerprintPreviews = reactive({});

// Finger positions
const rightHandFingers = [
  { key: "RIGHT_THUMB", label: "Cái" },
  { key: "RIGHT_INDEX", label: "Trỏ" },
  { key: "RIGHT_MIDDLE", label: "Giữa" },
  { key: "RIGHT_RING", label: "Áp út" },
  { key: "RIGHT_LITTLE", label: "Út" },
];

const leftHandFingers = [
  { key: "LEFT_THUMB", label: "Cái" },
  { key: "LEFT_INDEX", label: "Trỏ" },
  { key: "LEFT_MIDDLE", label: "Giữa" },
  { key: "LEFT_RING", label: "Áp út" },
  { key: "LEFT_LITTLE", label: "Út" },
];

const allFingers = [...rightHandFingers, ...leftHandFingers];

// Additional fingerprint types
const additionalTypes = [
  { key: "RIGHT_FOUR_SLAP", label: "4 ngón chụm tay phải" },
  { key: "LEFT_FOUR_SLAP", label: "4 ngón chụm tay trái" },
  { key: "RIGHT_FULL_HAND", label: "Toàn bộ bàn tay phải" },
  { key: "LEFT_FULL_HAND", label: "Toàn bộ bàn tay trái" },
];

const allFingerprintTypes = [...allFingers, ...additionalTypes];

// Validation rules
const rules = reactive({
  person_id: [
    { required: true, message: "Vui lòng chọn phạm nhân", trigger: "change" },
  ],
  created_date: [
    { required: true, message: "Vui lòng chọn ngày lập", trigger: "change" },
  ],
});

// Methods
const onDetaineeChange = (value) => {
  const detainee = detaineeStore.detainees.find(
    (d) => d.detainee_code === value
  );
  if (detainee) {
    // Auto-fill some information based on detainee
    ElMessage.success(`Đã chọn phạm nhân: ${detainee.full_name}`);
  }
};

const selectFinger = (fingerKey) => {
  currentSelectedFinger.value = fingerKey;
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file || !currentSelectedFinger.value) return;

  // Validate file
  if (!validateFile(file)) return;

  // Store file
  fingerprintFiles[currentSelectedFinger.value] = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    fingerprintPreviews[currentSelectedFinger.value] = e.target.result;
  };
  reader.readAsDataURL(file);

  ElMessage.success(
    `Đã thêm vân tay ${getFingerLabel(currentSelectedFinger.value)}`
  );

  // Reset file input
  event.target.value = "";
  currentSelectedFinger.value = null;
};

const validateFile = (file) => {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "application/octet-stream",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (
    !validTypes.includes(file.type) &&
    !file.name.toLowerCase().endsWith(".wsq")
  ) {
    ElMessage.error("Chỉ hỗ trợ file ảnh (JPG, PNG, BMP) hoặc WSQ!");
    return false;
  }

  if (file.size > maxSize) {
    ElMessage.error("File không được lớn hơn 5MB!");
    return false;
  }

  return true;
};

const removeFinger = (fingerKey) => {
  delete fingerprintFiles[fingerKey];
  delete fingerprintPreviews[fingerKey];
  ElMessage.info(`Đã xóa vân tay ${getFingerLabel(fingerKey)}`);
};

const getFingerLabel = (fingerKey) => {
  const finger = allFingerprintTypes.find((f) => f.key === fingerKey);
  return finger ? finger.label : fingerKey;
};

const getFileSize = (file) => {
  if (!file) return "";
  const size = file.size;
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  return `${Math.round((size / (1024 * 1024)) * 10) / 10}MB`;
};

const getTotalFingerprints = () => {
  return Object.keys(fingerprintFiles).length;
};

const getIndividualFingerprints = () => {
  return allFingers.filter((finger) => fingerprintFiles[finger.key]).length;
};

const getFourFingerSlaps = () => {
  let count = 0;
  if (fingerprintFiles["RIGHT_FOUR_SLAP"]) count++;
  if (fingerprintFiles["LEFT_FOUR_SLAP"]) count++;
  return count;
};

const getFullHands = () => {
  let count = 0;
  if (fingerprintFiles["RIGHT_FULL_HAND"]) count++;
  if (fingerprintFiles["LEFT_FULL_HAND"]) count++;
  return count;
};

const getGoodQualityCount = () => {
  // Mock implementation - in real app this would analyze fingerprint quality
  return Math.floor(getTotalFingerprints() * 0.7);
};

const getFairQualityCount = () => {
  return Math.floor(getTotalFingerprints() * 0.2);
};

const getPoorQualityCount = () => {
  return getTotalFingerprints() - getGoodQualityCount() - getFairQualityCount();
};

const getOverallQuality = () => {
  const total = getTotalFingerprints();
  if (total === 0) return 0;

  const score =
    (getGoodQualityCount() * 5 +
      getFairQualityCount() * 3 +
      getPoorQualityCount() * 2) /
    total;
  return Math.round(score);
};

const getCompletionPercentage = () => {
  return Math.round((getTotalFingerprints() / 14) * 100);
};

const getProgressColor = () => {
  const percentage = getCompletionPercentage();
  if (percentage === 100) return "#67C23A";
  if (percentage >= 50) return "#E6A23C";
  return "#F56C6C";
};

const handlePreview = () => {
  previewDialogVisible.value = true;
};

const handleSubmitFromPreview = () => {
  previewDialogVisible.value = false;
  handleSubmit();
};

const loadData = () => {
  if (isEdit.value) {
    const card = fingerprintStore.getFingerprintCardById(route.params.id);
    if (card) {
      Object.assign(form, card);

      // Load existing fingerprints
      if (card.fingerprints) {
        Object.keys(card.fingerprints).forEach((key) => {
          if (card.fingerprints[key]) {
            fingerprintFiles[key] = card.fingerprints[key];
            fingerprintPreviews[key] =
              card.fingerprints[key].minioUrl ||
              card.fingerprints[key].imageUrl;
          }
        });
      }
    } else {
      ElMessage.error("Không tìm thấy thông tin chỉ bản!");
      router.push("/fingerprint");
    }
  } else {
    // Set default values for new fingerprint card
    form.created_date = new Date().toISOString().split("T")[0];
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    if (getTotalFingerprints() === 0) {
      ElMessage.error("Vui lòng thêm ít nhất một vân tay!");
      return;
    }

    // Check if detainee exists
    const detainee = detaineeStore.detainees.find(
      (d) => d.detainee_code === form.person_id
    );
    if (!detainee) {
      ElMessage.error("Không tìm thấy phạm nhân với mã này!");
      return;
    }

    // Check if fingerprint card already exists for this detainee (for new records)
    if (!isEdit.value) {
      const existingCard = fingerprintStore.fingerprintCards.find(
        (c) => c.person_id === form.person_id
      );
      if (existingCard) {
        ElMessage.error("Phạm nhân này đã có chỉ bản!");
        return;
      }
    }

    submitting.value = true;

    // Simulate file upload progress
    uploadProgress.value = 10;
    uploadStatus.value = "active";

    const cardData = {
      ...form,
      detainee_name: detainee.full_name,
      fingerprints: { ...fingerprintFiles },
    };

    // Simulate upload progress
    for (let i = 20; i <= 90; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      uploadProgress.value = i;
    }

    if (isEdit.value) {
      fingerprintStore.updateFingerprintCard(
        parseInt(route.params.id),
        cardData
      );
      ElMessage.success("Cập nhật chỉ bản thành công!");
    } else {
      fingerprintStore.addFingerprintCard(cardData);
      ElMessage.success("Tạo chỉ bản thành công!");
    }

    uploadProgress.value = 100;
    uploadStatus.value = "success";

    setTimeout(() => {
      router.push("/fingerprint");
    }, 1000);
  } catch (error) {
    uploadStatus.value = "exception";
    console.error("Validation failed:", error);
  } finally {
    setTimeout(() => {
      submitting.value = false;
      uploadProgress.value = 0;
      uploadStatus.value = "";
    }, 2000);
  }
};

const handleReset = () => {
  if (isEdit.value) {
    loadData();
  } else {
    formRef.value?.resetFields();
    Object.assign(form, {
      person_id: "",
      created_date: new Date().toISOString().split("T")[0],
      created_place: "",
      reason_note: "",
      fp_formula: "",
      dp: "",
      tw: "",
    });

    // Clear fingerprints
    Object.keys(fingerprintFiles).forEach((key) => {
      delete fingerprintFiles[key];
      delete fingerprintPreviews[key];
    });
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

onMounted(() => {
  loadData();
});
</script>
<style scoped>
.fingerprint-form {
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}

.fingerprint-upload-section {
  margin: 20px 0;
}

.section-title {
  margin: 30px 0 15px 0;
}

.section-title h4 {
  color: #333;
  font-weight: 600;
  margin-bottom: 5px;
}

.section-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.mb-4 {
  margin-bottom: 20px;
}

.fingerprint-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.hand-section h4 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

.fingers-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.finger-slot {
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.finger-slot:hover {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.finger-label {
  background: #f5f5f5;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #666;
}

.finger-container {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.fingerprint-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-fingerprint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.no-fingerprint .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.no-fingerprint span {
  font-size: 12px;
}

.finger-actions {
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

/* Four finger slap styles */
.four-finger-section,
.full-hand-section {
  margin: 20px 0;
}

.slap-card,
.hand-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
}

.slap-card h5,
.hand-card h5 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

.slap-slot,
.hand-slot {
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.slap-slot:hover,
.hand-slot:hover {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.slap-container,
.hand-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.slap-preview,
.hand-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-slap,
.no-hand {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
  text-align: center;
}

.no-slap .el-icon,
.no-hand .el-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.no-slap span,
.no-hand span {
  font-size: 14px;
}

.slap-actions,
.hand-actions {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.upload-progress {
  margin-top: 20px;
}

.quality-section {
  margin: 20px 0;
}

.quality-stats h4,
.quality-rating h4 {
  margin-bottom: 15px;
  color: #333;
}

.overall-rating {
  text-align: center;
  margin: 20px 0;
}

.completion-progress {
  margin-top: 15px;
}

.completion-text {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.completion-checklist {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.completion-checklist .el-tag {
  width: 100%;
  justify-content: flex-start;
}

.preview-content {
  padding: 20px 0;
}

.preview-section {
  margin-bottom: 30px;
}

.preview-section h5 {
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

.preview-fingerprint-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.preview-finger-item {
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.preview-finger-item.has-fingerprint {
  border-color: #67c23a;
}

.preview-finger-label {
  background: #f5f5f5;
  padding: 6px;
  font-size: 11px;
  text-align: center;
  color: #666;
}

.preview-finger-container {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.preview-finger-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-no-fingerprint,
.preview-no-image {
  color: #ccc;
}

.preview-slap-grid,
.preview-hand-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.preview-slap-item,
.preview-hand-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.preview-slap-item.has-image,
.preview-hand-item.has-image {
  border-color: #67c23a;
}

.preview-slap-label,
.preview-hand-label {
  background: #f5f5f5;
  padding: 8px;
  font-size: 12px;
  text-align: center;
  color: #666;
  font-weight: 500;
}

.preview-slap-container,
.preview-hand-container {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.preview-slap-container img,
.preview-hand-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions .el-button {
  margin: 0 10px;
  min-width: 100px;
}

@media (max-width: 768px) {
  .fingerprint-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .fingers-row {
    grid-template-columns: repeat(3, 1fr);
  }

  .preview-fingerprint-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .preview-slap-grid,
  .preview-hand-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .fingers-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-fingerprint-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
