<template>
  <div class="identity-form">
    <!--    <el-page-header @back="$router.go(-1)">-->
    <!--      <template #content>-->
    <!--         <span class="text-large font-600 mr-3">-->
    <!--          {{ isEdit ? t('identity.editTitle') : t('identity.createTitle') }}-->
    <!--        </span>-->
    <!--      </template>-->
    <!--    </el-page-header>-->

    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <el-divider content-position="left">{{
          t("identity.infoSection")
        }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.detaineeId')" prop="detaineeCode">
              <el-select
                v-model="form.detaineeCode"
                :placeholder="t('identity.placeholder.detaineeId')"
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
            <el-form-item :label="t('identity.createdPlace')">
              <el-input
                v-model="form.createdPlace"
                :placeholder="t('identity.placeholder.createdPlace')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.arrestDate')">
              <el-date-picker
                v-model="form.arrestDate"
                type="date"
                :placeholder="t('identity.placeholder.arrestDate')"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.arrestUnit')">
              <el-input
                v-model="form.arrestUnit"
                :placeholder="t('identity.placeholder.arrestUnit')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.fpClassification')">
              <el-input
                v-model="form.fpClassification"
                :placeholder="t('identity.placeholder.fpClassification')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.reasonNote')">
              <el-input
                v-model="form.reasonNote"
                :placeholder="t('identity.placeholder.reasonNote')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.dp')">
              <el-input
                v-model="form.dp"
                :placeholder="t('identity.placeholder.dp')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.tw')">
              <el-input
                v-model="form.tw"
                :placeholder="t('identity.placeholder.tw')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.akFileNo')">
              <el-input
                v-model="form.akFileNo"
                :placeholder="t('identity.placeholder.akFileNo')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.notes')">
              <el-input
                v-model="form.notes"
                :placeholder="t('identity.placeholder.notes')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Photo Upload Section -->
        <el-divider content-position="left">{{
          t("identity.photoSection")
        }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="t('identity.photoLeft')">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="
                  (res, file) => handlePhotoSuccess('leftProfile', file)
                "
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="(file) => handlePhotoChange('leftProfile', file)"
              >
                <img
                  v-if="photoPreview.leftProfile"
                  :src="photoPreview.leftProfile"
                  class="photo-preview"
                />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('identity.photoFront')">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="(res, file) => handlePhotoSuccess('front', file)"
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="(file) => handlePhotoChange('front', file)"
              >
                <img
                  v-if="photoPreview.front"
                  :src="photoPreview.front"
                  class="photo-preview"
                />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('identity.photoRight')">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="
                  (res, file) => handlePhotoSuccess('rightProfile', file)
                "
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="(file) => handlePhotoChange('rightProfile', file)"
              >
                <img
                  v-if="photoPreview.rightProfile"
                  :src="photoPreview.rightProfile"
                  class="photo-preview"
                />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{
          t("identity.anthropometry")
        }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.faceShape')">
              <el-input
                v-model="form.anthropometry.faceShape"
                :placeholder="t('identity.placeholder.faceShape')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('identity.height')">
              <el-input-number
                v-model="form.anthropometry.heightCm"
                :min="100"
                :max="250"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="t('identity.noseBridge')">
              <el-input
                v-model="form.anthropometry.noseBridge"
                :placeholder="t('identity.placeholder.noseBridge')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('identity.earLowerFold')">
              <el-input
                v-model="form.anthropometry.earLowerFold"
                :placeholder="t('identity.placeholder.earLowerFold')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('identity.earLobe')">
              <el-input
                v-model="form.anthropometry.earLobe"
                :placeholder="t('identity.placeholder.earLobe')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('identity.distinctiveMarks')">
          <el-input
            v-model="form.anthropometry.distinctiveMarks"
            type="textarea"
            :rows="3"
            :placeholder="t('identity.placeholder.distinctiveMarks')"
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? t("common.update") : t("common.create") }}
          </el-button>
          <el-button @click="handleReset">{{ t("common.reset") }}</el-button>
          <el-button @click="$router.go(-1)">{{
            t("common.cancel")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useIdentityStore } from "@/stores/identity";
import { useDetaineeStore } from "@/stores/detainee";
import { useI18n } from "vue-i18n";
import type {
  Identity,
  IdentityRecordUpdateRequest,
  IdentityRecordCreateRequest,
  AnthropometryResponse,
} from "@/types/identity";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const identityStore = useIdentityStore();
const detaineeStore = useDetaineeStore();

// Reactive data
const formRef = ref();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);

const form = reactive<Partial<Identity>>({
  // IdentityRecord
  detaineeCode: "",
  createdPlace: "",
  reasonNote: "",
  arrestDate: "",
  arrestUnit: "",
  fpClassification: "",
  dp: "",
  tw: "",
  akFileNo: "",
  notes: "",
  //  Anthropometry
  anthropometry: {
    faceShape: "",
    heightCm: undefined,
    noseBridge: "",
    earLowerFold: "",
    earLobe: "",
    distinctiveMarks: "",
  } as AnthropometryResponse,
});

const photoPreview: any = reactive({
  front: "",
  leftProfile: "",
  rightProfile: "",
});

const photoFiles: any = reactive({
  front: null,
  leftProfile: null,
  rightProfile: null,
});

// Validation rules
const rules = reactive({
  detainee_id: [
    { required: true, message: "Vui lòng chọn phạm nhân", trigger: "change" },
  ],
});

// Methods
const viewToKey = (
  v: string
): "front" | "leftProfile" | "rightProfile" | undefined => {
  const map: Record<string, "front" | "leftProfile" | "rightProfile"> = {
    FRONT: "front",
    LEFT_PROFILE: "leftProfile",
    RIGHT_PROFILE: "rightProfile",
  };
  return map[v];
};
const onDetaineeChange = (value: any) => {
  const detainee = detaineeStore.getDetainees?.find(
    (d) => d.detaineeCode === value
  );
  if (detainee) {
    form.arrestDate = detainee.detentionDate || "";
  }
};

const handlePhotoChange = (type: any, file: any) => {
  if (file.raw) {
    photoFiles[type] = file.raw;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      photoPreview[type] = e.target.result;
    };
    reader.readAsDataURL(file.raw);
  }
};

const handlePhotoSuccess = (type: any, file: any) => {
  ElMessage.success(`Tải ảnh ${type} thành công!`);
};

const beforePhotoUpload = (file: any) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("Chỉ được tải lên file ảnh!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("Kích thước ảnh phải nhỏ hơn 2MB!");
    return false;
  }
  return true;
};

const loadData = async () => {
  if (isEdit.value) {
    const record = await identityStore.fetchDetail(Number(route.params.id));
    if (record) {
      Object.assign(form, record);
      // Load photo previews if available
      if (Array.isArray(record?.photos)) {
        // (tuỳ chọn) reset trước khi fill
        photoPreview.front = "";
        photoPreview.leftProfile = "";
        photoPreview.rightProfile = "";

        record.photos.forEach((p: any) => {
          const key = viewToKey(p.view);
          if (!key) return;
          // ưu tiên presigned linkUrl; fallback objectUrl
          photoPreview[key] = p.linkUrl ?? p.objectUrl ?? "";
        });
      }
    } else {
      ElMessage.error("Không tìm thấy thông tin danh bản!");
      router.push("/identity");
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    submitting.value = true;

    const fd = new FormData();
    for (const key in photoFiles) {
      if (photoFiles[key]) {
        fd.append(key, photoFiles[key]);
      }
    }

    if (isEdit.value) {
      const recordData: IdentityRecordUpdateRequest = {
        createdPlace: form.createdPlace,
        reasonNote: form.reasonNote,
        arrestDate: form.arrestDate,
        arrestUnit: form.arrestUnit,
        fpClassification: form.fpClassification,
        dp: form.dp,
        tw: form.tw,
        akFileNo: form.akFileNo,
        notes: form.notes,
        faceShape: (form.anthropometry as AnthropometryResponse).faceShape,
        heightCm: (form.anthropometry as AnthropometryResponse).heightCm,
        noseBridge: (form.anthropometry as AnthropometryResponse).noseBridge,
        earLowerFold: (form.anthropometry as AnthropometryResponse)
          .earLowerFold,
        earLobe: (form.anthropometry as AnthropometryResponse).earLobe,
        distinctiveMarks: (form.anthropometry as AnthropometryResponse)
          .distinctiveMarks,
      };
      fd.append(
        "payload",
        new Blob([JSON.stringify(recordData)], { type: "application/json" })
      );
      await identityStore.updateIdentity(Number(route.params.id), fd);
    } else {
      const recordData: IdentityRecordCreateRequest = {
        detaineeCode: form.detaineeCode,
        createdPlace: form.createdPlace,
        reasonNote: form.reasonNote,
        arrestDate: form.arrestDate,
        arrestUnit: form.arrestUnit,
        fpClassification: form.fpClassification,
        dp: form.dp,
        tw: form.tw,
        akFileNo: form.akFileNo,
        notes: form.notes,
        faceShape: (form.anthropometry as AnthropometryResponse).faceShape,
        heightCm: (form.anthropometry as AnthropometryResponse).heightCm,
        noseBridge: (form.anthropometry as AnthropometryResponse).noseBridge,
        earLowerFold: (form.anthropometry as AnthropometryResponse)
          .earLowerFold,
        earLobe: (form.anthropometry as AnthropometryResponse).earLobe,
        distinctiveMarks: (form.anthropometry as AnthropometryResponse)
          .distinctiveMarks,
      };
      fd.append(
        "payload",
        new Blob([JSON.stringify(recordData)], { type: "application/json" })
      );
      await identityStore.createIdentity(fd);
    }

    router.push("/identity");
  } catch (error) {
    console.error("Validation failed:", error);
  } finally {
    submitting.value = false;
  }
};

const handleReset = () => {
  if (isEdit.value) {
    loadData();
  } else {
    formRef.value?.resetFields();
    Object.assign(form, {
      detainee_id: "",
      detainee_code: "",
      reason: "",
      reasonNote: "",
      arrestDate: "",
      arrestUnit: "",
      fpClassification: "",
      dp: "",
      tw: "",
      akFileNo: "",
      notes: "",
      anthropometry: {
        faceShape: "",
        heightCm: undefined,
        noseBridge: "",
        distinctiveMarks: "",
        earLowerFold: "",
        earLobe: "",
      },
    });
    Object.assign(photoPreview, {
      front: "",
      leftProfile: "",
      rightProfile: "",
    });
    Object.assign(photoFiles, {
      front: null,
      leftProfile: null,
      rightProfile: null,
    });
  }
};

const getAllDetainees = () => {
  detaineeStore.getAll();
};

onMounted(async () => {
  await getAllDetainees();
  loadData();
});
</script>

<style scoped>
.identity-form {
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions .el-button {
  margin: 0 10px;
  min-width: 100px;
}

.photo-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 150px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-uploader:hover {
  border-color: #409eff;
}

.photo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
