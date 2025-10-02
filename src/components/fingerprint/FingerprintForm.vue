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
        <el-divider content-position="left">{{
          t("fingerprint.form.basicInfo")
        }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item
              :label="t('fingerprint.form.detaineeCode')"
              prop="person_id"
            >
              <el-select
                v-model="form.detaineeCode"
                :placeholder="t('fingerprint.form.placeholder.detaineeCode')"
                filterable
                @change="onDetaineeChange"
                :disabled="isEdit"
              >
                <el-option
                  v-for="detainee in detaineeStore.getDetainees"
                  :key="detainee.detaineeCode"
                  :label="`${detainee.detaineeCode} - ${detainee.fullName}`"
                  :value="detainee.detaineeCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('fingerprint.form.createdPlace')">
              <el-input
                v-model="form.createdPlace"
                :placeholder="t('fingerprint.form.placeholder.createdPlace')"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :md="12" :span="24">
            <el-form-item label="Ngày lập" prop="createdDate">
              <el-date-picker
                v-model="form.createdDate"
                type="date"
                placeholder="Chọn ngày lập"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('fingerprint.form.reasonNote')">
              <el-input
                v-model="form.reasonNote"
                :placeholder="t('fingerprint.form.placeholder.reasonNote')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{
          t("fingerprint.section.technicalSpecs")
        }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="t('fingerprint.form.fpFormula')">
              <el-input
                v-model="form.fpFormula"
                :placeholder="t('fingerprint.form.placeholder.fpFormula')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('fingerprint.form.dp')">
              <el-input
                v-model="form.dp"
                :placeholder="t('fingerprint.form.placeholder.dp')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('fingerprint.form.tw')">
              <el-input
                v-model="form.tw"
                :placeholder="t('fingerprint.form.placeholder.tw')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{
          t("fingerprint.section.collect")
        }}</el-divider>

        <div class="fingerprint-upload-section">
          <el-alert
            :title="t('fingerprint.collect.guideTitle')"
            type="info"
            :description="t('fingerprint.collect.guideDesc')"
            show-icon
            :closable="false"
            class="mb-4"
          />

          <!-- WebSocket Status Indicator -->
          <el-alert
            :title="
              wsConnected
                ? 'Thiết bị quét vân tay đã kết nối'
                : 'Thiết bị quét vân tay chưa kết nối'
            "
            :type="wsConnected ? 'success' : 'warning'"
            :closable="false"
            show-icon
            class="ws-status-alert"
          >
            <template #default>
              <!-- <div v-if="wsConnected">
            Nhấn vào ô vân tay và đặt ngón tay lên thiết bị để quét
          </div> -->
              <!-- <div v-else>
            <span>Đang thử kết nối lại... Hoặc bạn có thể </span>
            <el-button type="text" @click="connectWebSocket" size="small">
              Kết nối lại
            </el-button>
            <span> hoặc </span>
            <el-button type="text" size="small"> Upload từ file </el-button>
          </div> -->
              <div>
                <el-button v-if="!wsConnected" @click="connectWebSocket"
                  >Mở kết nối đến thiết bị</el-button
                >
                <el-button v-else @click="disconnectWebSocket(true)"
                  >Kết nối lại</el-button
                >
              </div>
            </template>
          </el-alert>

          <!-- Individual Fingerprints -->
          <div class="section-title">
            <h4>{{ t("fingerprint.collect.individual.title") }}</h4>
          </div>
          <div class="fingerprint-grid">
            <!-- Left Hand -->
            <div class="hand-section">
              <h4>{{ t("fingerprint.collect.leftHand") }}</h4>
              <div class="fingers-row">
                <div
                  v-for="finger in leftHandFingers"
                  :key="finger.key"
                  class="finger-slot"
                  @click="selectFinger(finger.key, 2)"
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
                      <span>{{ t("fingerprint.action.addImage") }}</span>
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
            <!-- Right Hand -->
            <div class="hand-section">
              <h4>{{ t("fingerprint.collect.rightHand") }}</h4>
              <div class="fingers-row">
                <div
                  v-for="finger in rightHandFingers"
                  :key="finger.key"
                  class="finger-slot"
                  @click="selectFinger(finger.key, 2)"
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
                      <span>{{ t("fingerprint.action.addImage") }}</span>
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
            <h4>{{ t("fingerprint.collect.fourFingers.title") }}</h4>
            <p class="section-description">
              {{ t("fingerprint.collect.fourFingers.desc") }}
            </p>
          </div>
          <div class="four-finger-section">
            <el-row :gutter="20">
              <el-col :span="9">
                <div class="slap-card">
                  <h5>{{ t("fingerprint.collect.fourFingers.titleLeft") }}</h5>
                  <div class="slap-slot" @click="selectFinger('LEFT_FOUR', 4)">
                    <div class="slap-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FOUR']"
                        :src="fingerprintPreviews['LEFT_FOUR']"
                        :alt="t('fingerprint.collect.fourFingers.titleLeft')"
                        class="slap-preview"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Plus /></el-icon>
                        <span
                          >{{ t("fingerprint.action.addImage") }}
                          {{
                            t("fingerprint.collect.fourFingers.titleLeft")
                          }}</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['LEFT_FOUR']"
                      class="slap-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["LEFT_FOUR"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('LEFT_FOUR')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="slap-card">
                  <h5>2 ngón cái cùng lúc</h5>
                  <div
                    class="slap-slot"
                    @click="selectFinger('BOTH_THUMBS', 3)"
                  >
                    <div class="slap-container">
                      <img
                        v-if="fingerprintPreviews['BOTH_THUMBS']"
                        :src="fingerprintPreviews['BOTH_THUMBS']"
                        alt="2 ngón cái"
                        class="slap-preview"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Plus /></el-icon>
                        <span>Thêm ảnh 2 ngón cái cùng lúc</span>
                        <small>Ép 2 ngón cái xuống cùng nhau</small>
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['BOTH_THUMBS']"
                      class="slap-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["BOTH_THUMBS"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('BOTH_THUMBS')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="9">
                <div class="slap-card">
                  <h5>
                    {{ t("fingerprint.collect.fourFingers.titleRight") }}
                  </h5>
                  <div class="slap-slot" @click="selectFinger('RIGHT_FOUR', 4)">
                    <div class="slap-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FOUR']"
                        :src="fingerprintPreviews['RIGHT_FOUR']"
                        :alt="t('fingerprint.collect.fourFingers.titleRight')"
                        class="slap-preview"
                      />
                      <div v-else class="no-slap">
                        <el-icon><Plus /></el-icon>
                        <span
                          >{{ t("fingerprint.action.addImage") }}
                          {{
                            t("fingerprint.collect.fourFingers.titleRight")
                          }}</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['RIGHT_FOUR']"
                      class="slap-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["RIGHT_FOUR"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('RIGHT_FOUR')"
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
            <h4>{{ t("fingerprint.collect.fullHands.title") }}</h4>
            <p class="section-description">
              {{ t("fingerprint.collect.fullHands.desc") }}
            </p>
          </div>
          <div class="full-hand-section">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="hand-card">
                  <h5>{{ t("fingerprint.collect.fullHands.left") }}</h5>
                  <div class="hand-slot" @click="selectFinger('LEFT_FULL', 6)">
                    <div class="hand-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FULL']"
                        :src="fingerprintPreviews['LEFT_FULL']"
                        :alt="t('fingerprint.collect.fullHands.left')"
                        class="hand-preview"
                      />
                      <div v-else class="no-hand">
                        <el-icon><Plus /></el-icon>
                        <span
                          >{{ t("fingerprint.action.addImage") }}
                          {{ t("fingerprint.collect.fullHands.left") }}</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['LEFT_FULL']"
                      class="hand-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["LEFT_FULL"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('LEFT_FULL')"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="hand-card">
                  <h5>{{ t("fingerprint.collect.fullHands.right") }}</h5>
                  <div class="hand-slot" @click="selectFinger('RIGHT_FULL', 7)">
                    <div class="hand-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FULL']"
                        :src="fingerprintPreviews['RIGHT_FULL']"
                        :alt="t('fingerprint.collect.fullHands.right')"
                        class="hand-preview"
                      />
                      <div v-else class="no-hand">
                        <el-icon><Plus /></el-icon>
                        <span
                          >{{ t("fingerprint.action.addImage") }}
                          {{ t("fingerprint.collect.fullHands.right") }}</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="fingerprintFiles['RIGHT_FULL']"
                      class="hand-actions"
                    >
                      <el-tag size="small" type="success">
                        {{ getFileSize(fingerprintFiles["RIGHT_FULL"]) }}
                      </el-tag>
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeFinger('RIGHT_FULL')"
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
        <el-divider content-position="left">{{
          t("fingerprint.quality.title")
        }}</el-divider>

        <div class="quality-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="quality-stats">
                <h4>{{ t("fingerprint.quality.stats") }}</h4>
                <el-descriptions :column="1" size="small" border>
                  <el-descriptions-item
                    :label="t('fingerprint.quality.individual')"
                  >
                    <el-tag type="info"
                      >{{ getIndividualFingerprints() }}/10</el-tag
                    >
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="t('fingerprint.quality.fourSlaps')"
                  >
                    <el-tag type="info"
                      >{{ getFourFingerSlapsAndTwoThumbs() }}/3</el-tag
                    >
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="t('fingerprint.quality.fullHands')"
                  >
                    <el-tag type="info">{{ getFullHands() }}/2</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item :label="t('fingerprint.quality.total')">
                    <el-tag type="success"
                      >{{ getTotalFingerprints() }}/14</el-tag
                    >
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="quality-rating">
                <h4>{{ t("fingerprint.quality.overall") }}</h4>
                <!-- <div class="overall-rating">
                  <el-rate
                    :model-value="getOverallQuality()"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value} điểm"
                  />
                </div> -->
                <el-progress
                  :percentage="getCompletionPercentage()"
                  :color="getProgressColor()"
                  class="completion-progress"
                />
                <p class="completion-text">
                  {{ t("fingerprint.quality.completed") }}
                  {{ getCompletionPercentage() }}%
                </p>

                <!-- Completion checklist -->
                <div class="completion-checklist">
                  <el-tag
                    :type="
                      getIndividualFingerprints() === 10 ? 'success' : 'warning'
                    "
                    size="small"
                  >
                    {{ getIndividualFingerprints() === 10 ? "✓" : "○" }}
                    {{ t("fingerprint.quality.check.individual") }}
                  </el-tag>
                  <el-tag
                    :type="
                      getFourFingerSlapsAndTwoThumbs() === 3
                        ? 'success'
                        : 'warning'
                    "
                    size="small"
                  >
                    {{ getFourFingerSlapsAndTwoThumbs() === 3 ? "✓" : "○" }}
                    {{ t("fingerprint.quality.check.fourSlaps") }}
                  </el-tag>
                  <el-tag
                    :type="getFullHands() === 2 ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ getFullHands() === 2 ? "✓" : "○" }}
                    {{ t("fingerprint.quality.check.fullHands") }}
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
            {{ isEdit ? t("common.update") : t("common.create") }}
          </el-button>
          <el-button @click="handleReset">{{ t("common.reset") }}</el-button>
          <el-button @click="$router.go(-1)">{{
            t("common.cancel")
          }}</el-button>
          <el-button
            type="success"
            @click="handlePreview"
            v-if="getTotalFingerprints() > 0"
          >
            {{ t("common.preview") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Preview Dialog -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="t('fingerprint.preview.title')"
      width="80%"
      class="dialog"
    >
      <div class="preview-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
              <template #header>{{
                t("fingerprint.preview.basicInfo")
              }}</template>
              <el-descriptions :column="1" size="small">
                <el-descriptions-item
                  :label="t('fingerprint.preview.personId')"
                  >{{ form.detaineeCode }}</el-descriptions-item
                >
                <el-descriptions-item
                  :label="t('fingerprint.preview.createdDate')"
                  >{{ formatDate(form.createdAt) }}</el-descriptions-item
                >
                <el-descriptions-item
                  :label="t('fingerprint.preview.createdPlace')"
                  >{{ form.createdPlace || "-" }}</el-descriptions-item
                >
                <el-descriptions-item
                  :label="t('fingerprint.preview.fpFormula')"
                  >{{ form.fpFormula || "-" }}</el-descriptions-item
                >
                <el-descriptions-item :label="t('fingerprint.preview.dp')">{{
                  form.dp || "-"
                }}</el-descriptions-item>
                <el-descriptions-item :label="t('fingerprint.preview.tw')">{{
                  form.tw || "-"
                }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card>
              <template #header>{{
                t("fingerprint.preview.collected")
              }}</template>

              <!-- Individual fingerprints -->
              <div class="preview-section">
                <h5>
                  {{
                    t("fingerprint.preview.individual", {
                      count: getIndividualFingerprints(),
                    })
                  }}
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
                <h5>
                  {{
                    t("fingerprint.preview.fourSlaps", {
                      count: getFourFingerSlapsAndTwoThumbs(),
                    })
                  }}
                </h5>
                <div class="preview-slap-grid">
                  <div
                    class="preview-slap-item"
                    :class="{
                      'has-image': fingerprintPreviews['LEFT_FOUR'],
                    }"
                  >
                    <div class="preview-slap-label">
                      {{ t("fingerprint.preview.leftFour") }}
                    </div>
                    <div class="preview-slap-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FOUR']"
                        :src="fingerprintPreviews['LEFT_FOUR']"
                        :alt="t('fingerprint.preview.leftFour')"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div
                    class="preview-slap-item"
                    :class="{ 'has-image': fingerprintPreviews['BOTH_THUMBS'] }"
                  >
                    <div class="preview-slap-label">2 ngón cái cùng lúc</div>
                    <div class="preview-slap-container">
                      <img
                        v-if="fingerprintPreviews['BOTH_THUMBS']"
                        :src="fingerprintPreviews['BOTH_THUMBS']"
                        alt="2 ngón cái"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div
                    class="preview-slap-item"
                    :class="{
                      'has-image': fingerprintPreviews['RIGHT_FOUR'],
                    }"
                  >
                    <div class="preview-slap-label">
                      {{ t("fingerprint.preview.rightFour") }}
                    </div>
                    <div class="preview-slap-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FOUR']"
                        :src="fingerprintPreviews['RIGHT_FOUR']"
                        :alt="t('fingerprint.preview.rightFour')"
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
                <h5>
                  {{
                    $t("fingerprint.preview.fullHands", {
                      count: getFullHands(),
                    })
                  }}
                </h5>
                <div class="preview-hand-grid">
                  <div
                    class="preview-hand-item"
                    :class="{
                      'has-image': fingerprintPreviews['LEFT_FULL'],
                    }"
                  >
                    <div class="preview-hand-label">
                      {{ t("fingerprint.preview.leftHand") }}
                    </div>
                    <div class="preview-hand-container">
                      <img
                        v-if="fingerprintPreviews['LEFT_FULL']"
                        :src="fingerprintPreviews['LEFT_FULL']"
                        :alt="t('fingerprint.preview.leftHand')"
                      />
                      <div v-else class="preview-no-image">
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div
                    class="preview-hand-item"
                    :class="{
                      'has-image': fingerprintPreviews['RIGHT_FULL'],
                    }"
                  >
                    <div class="preview-hand-label">
                      {{ t("fingerprint.preview.rightHand") }}
                    </div>
                    <div class="preview-hand-container">
                      <img
                        v-if="fingerprintPreviews['RIGHT_FULL']"
                        :src="fingerprintPreviews['RIGHT_FULL']"
                        :alt="t('fingerprint.preview.rightHand')"
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
        <el-button @click="previewDialogVisible = false">{{
          t("common.close")
        }}</el-button>
        <el-button
          type="primary"
          @click="handleSubmitFromPreview"
          :loading="submitting"
        >
          {{ isEdit ? t("common.update") : t("common.create") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete, Close } from "@element-plus/icons-vue";
import { useFingerprintStore } from "@/stores/fingerprint";
import { useDetaineeStore } from "@/stores/detainee";
import type {
  FingerprintCard,
  FingerprintCardCreateRequest,
  FingerprintCardUpdateRequest,
} from "@/types/fingerprint";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const fingerprintStore = useFingerprintStore();
const detaineeStore = useDetaineeStore();

// Reactive data
const formRef = ref();
const submitting = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref("");
const previewDialogVisible = ref(false);
const fingerprintFiles: Record<string, File> = reactive({});
const fingerprintPreviews: Record<string, string> = reactive({});
const currentSelectedFinger = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isEdit = computed(() => !!route.params.id);

// WebSocket connection
const ws = ref<WebSocket | null>(null);
const wsConnected = ref(false);
const wsUrl = "ws://127.0.0.1:7172/finger-ws";
const repeat = ref(false);

const form = reactive<Partial<FingerprintCard>>({
  detaineeCode: "",
  createdDate: "",
  createdPlace: "",
  reasonNote: "",
  fpFormula: "",
  dp: "",
  tw: "",
});

// Script setup

// Finger positions
const rightHandFingers = [
  { key: "RIGHT_THUMB", label: t("fingerprint.fingers.thumbright") },
  { key: "RIGHT_INDEX", label: t("fingerprint.fingers.indexright") },
  { key: "RIGHT_MIDDLE", label: t("fingerprint.fingers.middleright") },
  { key: "RIGHT_RING", label: t("fingerprint.fingers.ringright") },
  { key: "RIGHT_LITTLE", label: t("fingerprint.fingers.littleright") },
];

const leftHandFingers = [
  { key: "LEFT_THUMB", label: t("fingerprint.fingers.thumbleft") },
  { key: "LEFT_INDEX", label: t("fingerprint.fingers.indexleft") },
  { key: "LEFT_MIDDLE", label: t("fingerprint.fingers.middleleft") },
  { key: "LEFT_RING", label: t("fingerprint.fingers.ringleft") },
  { key: "LEFT_LITTLE", label: t("fingerprint.fingers.littleleft") },
];

const allFingers = [...rightHandFingers, ...leftHandFingers];

// Additional fingerprint types
const additionalTypes = [
  { key: "RIGHT_FOUR", label: t("fingerprint.preview.rightFour") },
  { key: "LEFT_FOUR", label: t("fingerprint.preview.leftFour") },
  { key: "BOTH_THUMBS", label: "2 ngón cái cùng lúc" },
  { key: "RIGHT_FULL", label: t("fingerprint.preview.rightHand") },
  { key: "LEFT_FULL", label: t("fingerprint.preview.leftHand") },
];

const allFingerprintTypes = [...allFingers, ...additionalTypes];

// Validation rules
const rules = reactive({
  detaineeCode: [
    {
      required: true,
      message: t("fingerprint.rule.detaineeCode"),
      trigger: "change",
    },
  ],
  createdDate: [
    { required: true, message: "Vui lòng chọn ngày lập", trigger: "change" },
  ],
});

// Methods

function base64ToFile(
  base64: string,
  fileName: string,
  mimeType = "image/bmp"
): File {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uintArray], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}
function connectWebSocket() {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) return;

  ws.value = new WebSocket(wsUrl);

  ws.value.onopen = () => {
    wsConnected.value = true;
    ElMessage.success("Đã kết nối thiết bị quét vân tay!");
  };

  ws.value.onmessage = (event) => {
    try {
      handleFingerprintData(JSON.parse(event.data));
    } catch {
      ElMessage.error("Lỗi dữ liệu từ thiết bị!");
    }
  };

  ws.value.onerror = () => {
    console.log("WebSocket connection error.");
    wsConnected.value = false;
    ElMessage.error("Lỗi kết nối thiết bị!");
  };

  ws.value.onclose = () => {
    console.log("WebSocket connection closed.");
    wsConnected.value = false;

    if (repeat.value) {
      ElMessage.warning("Kết nội lại thiết bị sau 2s...");
      setTimeout(connectWebSocket, 2000);
    }
  };
}

function disconnectWebSocket(isRepeat: any) {
  ws.value?.close();
  ws.value = null;
  wsConnected.value = false;
  repeat.value = isRepeat;
}

function handleFingerprintData(data: any) {
  console.log("data", data);
  if (!currentSelectedFinger.value) {
    return ElMessage.warning("Vui lòng chọn vị trí ngón tay trước!");
  }

  // if (data.status !== 0) {
  //   return ElMessage.error(`Lỗi quét vân tay! Status: ${data.status}`);
  // }

  // if (data.quality < 3) {
  //   ElMessage.warning(
  //     `Chất lượng thấp (${data.quality}/10). Vui lòng quét lại!`
  //   );
  // }

  if (data.image) {
    try {
      const imageData = `data:image/bmp;base64,${data.image}`;
      fingerprintPreviews[currentSelectedFinger.value] = imageData;

      if (data.status === 2) {
        const file = base64ToFile(
          data.image,
          `${currentSelectedFinger.value}.bmp`
        );
        fingerprintFiles[currentSelectedFinger.value] = file;
        currentSelectedFinger.value = null;
        repeat.value = true;
      }

      // ElMessage.success(
      //   `Đã quét ${getFingerLabel(currentSelectedFinger.value)} - Chất lượng: ${
      //     data.quality
      //   }/10`
      // );
    } catch (error) {
      console.error(error);
      ElMessage.error("Lỗi xử lý ảnh vân tay!");
    } finally {
    }
  }
}
const getAllDetainees = () => {
  detaineeStore.getAll();
};
const onDetaineeChange = (value: any) => {
  const detainee = detaineeStore.getDetainees?.find(
    (d) => d.detaineeCode === value
  );
  if (detainee) {
    // Auto-fill some information based on detainee
    ElMessage.success(`Đã chọn phạm nhân: ${detainee.fullName}`);
  }
};
const selectFinger = (fingerKey: any, type: any) => {
  if (!wsConnected.value) {
    ElMessage.error("Chưa kết nối với thiết bị quét vân tay!");
    return;
  }

  currentSelectedFinger.value = fingerKey;
  console.log("type", type);
  ElMessage.info(
    `Đã chọn ${getFingerLabel(
      fingerKey
    )}. Vui lòng đặt ngón tay lên thiết bị quét...`
  );

  // Gửi yêu cầu quét vân tay qua WebSocket
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(
      JSON.stringify(
        type // Minimum quality level
      )
    );
  }
};

// const selectFinger = (fingerKey: string) => {
//   currentSelectedFinger.value = fingerKey;
//   fileInput.value?.click();
// };

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !currentSelectedFinger.value) return;

  // Chỉ preview các định dạng ảnh hiển thị được
  const canPreview = /^image\//.test(file.type); // png, jpg, bmp...
  fingerprintFiles[currentSelectedFinger.value] = file;

  if (canPreview) {
    // URL preview
    const url = URL.createObjectURL(file);
    fingerprintPreviews[currentSelectedFinger.value] = url;
  } else {
    // WSQ hoặc định dạng khác: không preview được
    fingerprintPreviews[currentSelectedFinger.value] = ""; // hoặc đặt icon placeholder
  }

  // reset input để chọn lại cùng file không bị “không đổi”
  input.value = "";
  currentSelectedFinger.value = null;
};

const validateFile = (file: any) => {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/gif",
    "image/webp",
  ];
  const isWSQ = file.name.toLowerCase().endsWith(".wsq");
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type) && !isWSQ) {
    ElMessage.error("Chỉ hỗ trợ file ảnh (JPG, PNG, BMP, GIF, WebP) hoặc WSQ!");
    return false;
  }

  if (file.size > maxSize) {
    ElMessage.error("File không được lớn hơn 5MB!");
    return false;
  }

  if (file.size < 1024) {
    ElMessage.warning("File quá nhỏ, có thể không đủ chất lượng!");
  }

  return true;
};

const removeFinger = (fingerKey: string) => {
  const url = fingerprintPreviews[fingerKey];
  if (url) URL.revokeObjectURL(url);
  delete fingerprintFiles[fingerKey];
  delete fingerprintPreviews[fingerKey];
};

const getFingerLabel = (fingerKey: any) => {
  const finger = allFingerprintTypes.find((f) => f.key === fingerKey);
  return finger ? finger.label : fingerKey;
};

// const getFileSize = (file: any) => {
//   console.log("file", file);
//   if (!file) return "";

//   // Nếu là File (tải từ input)
//   if (file instanceof File) {
//     const size = file.size;
//     if (size < 1024) return `${size}B`;
//     if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
//     return `${Math.round((size / (1024 * 1024)) * 10) / 10}MB`;
//   }

//   // Nếu là object từ backend (không có size)
//   if (file.size) {
//     const size = file.size;
//     if (size < 1024) return `${size}B`;
//     if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
//     return `${Math.round((size / (1024 * 1024)) * 10) / 10}MB`;
//   }

//   // Trường hợp không có size → hiển thị tên ảnh hoặc chuỗi trống
//   return "";
// };

const getFileSize = (file: any): string => {
  if (!file) return "";

  // Lấy size nếu có
  const size = file instanceof File ? file.size : file?.size;
  if (!size) return "";

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

const getFourFingerSlapsAndTwoThumbs = () => {
  let count = 0;
  if (fingerprintFiles["RIGHT_FOUR"]) count++;
  if (fingerprintFiles["LEFT_FOUR"]) count++;
  if (fingerprintFiles["BOTH_THUMBS"]) count++;
  return count;
};

const getFullHands = () => {
  let count = 0;
  if (fingerprintFiles["RIGHT_FULL"]) count++;
  if (fingerprintFiles["LEFT_FULL"]) count++;

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
  return Math.round((getTotalFingerprints() / 15) * 100);
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

const loadData = async () => {
  if (isEdit.value) {
    const card = await fingerprintStore.getById(Number(route.params.id));
    if (card) {
      Object.assign(form, card);

      if (card.fingerPrintImages && Array.isArray(card.fingerPrintImages)) {
        card.fingerPrintImages.forEach((img: any) => {
          if (img && img.finger) {
            // Lưu file info (ở đây có thể chỉ là object metadata, chưa phải File thực)
            fingerprintFiles[img.finger] = img;

            // Lưu preview (ưu tiên linkUrl, fallback sang objectUrl)
            fingerprintPreviews[img.finger] = img.linkUrl || img.objectUrl;
          }
        });
      }
    } else {
      ElMessage.error("Không tìm thấy thông tin chỉ bản!");
      router.push("/fingerprint");
    }
  } else {
    // Set default values for new fingerprint card
    form.createdDate = new Date().toISOString().split("T")[0];
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

    submitting.value = true;

    // Simulate file upload progress
    uploadProgress.value = 10;
    uploadStatus.value = "active";

    const fd = new FormData();
    for (const key in fingerprintFiles) {
      if (fingerprintFiles[key]) {
        fd.append(key, fingerprintFiles[key]);
      }
    }

    // Simulate upload progress
    for (let i = 20; i <= 90; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      uploadProgress.value = i;
    }

    if (isEdit.value) {
      const payload: FingerprintCardUpdateRequest = { ...form };
      fd.append(
        "payload",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      await fingerprintStore.updateFingerprint(Number(route.params.id), fd);
    } else {
      const payload: FingerprintCardCreateRequest = { ...form };
      fd.append(
        "payload",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      await fingerprintStore.createFingerprint(fd);
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
      detaineeCode: "",
      // created_date: new Date().toISOString().split("T")[0],
      createdPlace: "",
      reasonNote: "",
      fpFormula: "",
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

const formatDate = (dateStr: any) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

onMounted(async () => {
  await getAllDetainees();
  await loadData();
  if (!isEdit.value) {
    connectWebSocket();
  }
});
onUnmounted(() => {
  disconnectWebSocket(false);
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
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.fingerprint-preview {
  /* width: 100%;
  height: 100%;
  object-fit: cover; */
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* QUAN TRỌNG: không crop ảnh */
  object-position: center;
  image-rendering: crisp-edges; /* giữ nét */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
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
.two-thumbs-section,
.full-hand-section {
  margin: 20px 0;
}

.slap-card,
.thumbs-card,
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
.thumbs-slot,
.hand-slot {
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.slap-slot:hover,
.thumbs-slot:hover,
.hand-slot:hover {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.05);
}

.slap-container,
.hand-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.thumbs-container {
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
  object-fit: contain; /* QUAN TRỌNG: không crop ảnh */
  object-position: center;
  image-rendering: crisp-edges; /* giữ nét */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
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
  object-fit: contain; /* QUAN TRỌNG: không crop ảnh */
  object-position: center;
  image-rendering: crisp-edges; /* giữ nét */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
}

.preview-no-fingerprint,
.preview-no-image {
  color: #ccc;
}

.preview-slap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.preview-hand-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
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
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.preview-slap-container img,
.preview-hand-container img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* QUAN TRỌNG: không crop ảnh */
  object-position: center;
  image-rendering: crisp-edges; /* giữ nét */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
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
