<template>
  <div class="identity-form">
<!--    <el-page-header @back="$router.go(-1)">-->
<!--      <template #content>-->
<!--         <span class="text-large font-600 mr-3">-->
<!--          {{ isEdit ? $t('identity.editTitle') : $t('identity.createTitle') }}-->
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
        <el-divider content-position="left">{{ $t('identity.infoSection') }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.detaineeId')" prop="detainee_id">
              <el-select
                v-model="form.detainee_id"
                :placeholder="$t('identity.placeholder.detaineeId')"
                filterable
                @change="onDetaineeChange"
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
            <el-form-item :label="$t('identity.createdPlace')">
              <el-input
                v-model="form.created_place"
                :placeholder="$t('identity.placeholder.createdPlace')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.arrestDate')">
              <el-date-picker
                v-model="form.arrest_date"
                type="date"
                :placeholder="$t('identity.placeholder.arrestDate')"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.arrestUnit')">
              <el-input
                v-model="form.arrest_unit"
                :placeholder="$t('identity.placeholder.arrestUnit')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.fpClassification')">
              <el-input
                v-model="form.fp_classification"
                :placeholder="$t('identity.placeholder.fpClassification')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.reasonNote')">
              <el-input
                v-model="form.reason_note"
                :placeholder="$t('identity.placeholder.reasonNote')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Photo Upload Section -->
        <el-divider content-position="left">{{ $t('identity.photoSection') }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('identity.photoFront')">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="(res, file) => handlePhotoSuccess('front', file)"
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="file => handlePhotoChange('front', file)"
              >
                <img v-if="photoPreview.front" :src="photoPreview.front" class="photo-preview" />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('identity.photoLeft')">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="(res, file) => handlePhotoSuccess('left', file)"
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="file => handlePhotoChange('left', file)"
              >
                <img v-if="photoPreview.left" :src="photoPreview.left" class="photo-preview" />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('identity.photoRight')">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="(res, file) => handlePhotoSuccess('right', file)"
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="file => handlePhotoChange('right', file)"
              >
                <img v-if="photoPreview.right" :src="photoPreview.right" class="photo-preview" />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>


        <el-divider content-position="left">{{ $t('identity.anthropometry') }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.faceShape')">
              <el-input
                v-model="form.anthropometry.face_shape"
                :placeholder="$t('identity.placeholder.faceShape')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('identity.height')">
              <el-input-number
                v-model="form.anthropometry.height_cm"
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
            <el-form-item :label="$t('identity.noseBridge')">
              <el-input
                v-model="form.anthropometry.nose_bridge"
                :placeholder="$t('identity.placeholder.noseBridge')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('identity.earLowerFold')">
              <el-input
                v-model="form.anthropometry.ear_lower_fold"
                :placeholder="$t('identity.placeholder.earLowerFold')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('identity.earLobe')">
              <el-input
                v-model="form.anthropometry.ear_lobe"
                :placeholder="$t('identity.placeholder.earLobe')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('identity.distinctiveMarks')">
          <el-input
            v-model="form.anthropometry.distinctive_marks"
            type="textarea"
            :rows="3"
            :placeholder="$t('identity.placeholder.distinctiveMarks')"
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? $t('common.update') : $t('common.create') }}
          </el-button>
          <el-button @click="handleReset">{{ $t('common.reset') }}</el-button>
          <el-button @click="$router.go(-1)">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useIdentityStore, useDetaineeStore } from "@/stores";

const route = useRoute();
const router = useRouter();
const identityStore = useIdentityStore();
const detaineeStore = useDetaineeStore();

// Reactive data
const formRef = ref();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);

const form = reactive({
  detainee_id: "",
  created_place: "",
  reason_note: "",
  arrest_date: "",
  arrest_unit: "",
  fp_classification: "",
  anthropometry: {
    face_shape: "",
    height_cm: null,
    nose_bridge: "",
    ear_lower_fold: "",
    ear_lobe: "",
    distinctive_marks: "",
  },
});

const photoPreview = reactive({
  front: "",
  left: "",
  right: "",
});

const photoFiles = reactive({
  front: null,
  left: null,
  right: null,
});

// Validation rules
const rules = reactive({
  detainee_id: [
    { required: true, message: "Vui lòng chọn phạm nhân", trigger: "change" },
  ],
});

// Methods
const onDetaineeChange = (value) => {
  const detainee = detaineeStore.detainees.find(
    (d) => d.detainee_code === value
  );
  if (detainee) {
    form.arrest_date = detainee.detention_date;
  }
};

const handlePhotoChange = (type, file) => {
  if (file.raw) {
    photoFiles[type] = file.raw;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview[type] = e.target.result;
    };
    reader.readAsDataURL(file.raw);
  }
};

const handlePhotoSuccess = (type, file) => {
  ElMessage.success(`Tải ảnh ${type} thành công!`);
};

const beforePhotoUpload = (file) => {
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

const loadData = () => {
  if (isEdit.value) {
    const record = identityStore.getIdentityRecordById(route.params.id);
    if (record) {
      Object.assign(form, record);
      // Load photo previews if available
      if (record.photos) {
        Object.keys(record.photos).forEach((type) => {
          if (record.photos[type] && record.photos[type].minioUrl) {
            photoPreview[type] = record.photos[type].minioUrl;
          }
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

    // Check if detainee exists
    const detainee = detaineeStore.detainees.find(
      (d) => d.detainee_code === form.detainee_id
    );
    if (!detainee) {
      ElMessage.error("Không tìm thấy phạm nhân với mã này!");
      return;
    }

    // Check if identity record already exists for this detainee (for new records)
    if (!isEdit.value) {
      const existingRecord = identityStore.identityRecords.find(
        (r) => r.detainee_id === form.detainee_id
      );
      if (existingRecord) {
        ElMessage.error("Phạm nhân này đã có danh bản!");
        return;
      }
    }

    submitting.value = true;

    const recordData = {
      ...form,
      detainee_name: detainee.full_name,
      photos: photoFiles,
    };

    if (isEdit.value) {
      identityStore.updateIdentityRecord(parseInt(route.params.id), recordData);
      ElMessage.success("Cập nhật danh bản thành công!");
    } else {
      identityStore.addIdentityRecord(recordData);
      ElMessage.success("Tạo danh bản thành công!");
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
      created_place: "",
      reason_note: "",
      arrest_date: "",
      arrest_unit: "",
      fp_classification: "",
      anthropometry: {
        face_shape: "",
        height_cm: null,
        nose_bridge: "",
        ear_lower_fold: "",
        ear_lobe: "",
        distinctive_marks: "",
      },
    });
    Object.assign(photoPreview, { front: "", left: "", right: "" });
    Object.assign(photoFiles, { front: null, left: null, right: null });
  }
};

onMounted(() => {
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