<template>
  <div class="identity-form">
    <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ isEdit ? "Chỉnh sửa danh bản" : "Tạo danh bản mới" }}
        </span>
      </template>
    </el-page-header>

    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <el-divider content-position="left">Thông tin danh bản</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Mã phạm nhân" prop="detainee_id">
              <el-select
                v-model="form.detainee_id"
                placeholder="Chọn phạm nhân"
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
            <el-form-item label="Tạo tại">
              <el-input
                v-model="form.created_place"
                placeholder="Nhập nơi tạo danh bản..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Ngày bắt">
              <el-date-picker
                v-model="form.arrest_date"
                type="date"
                placeholder="Chọn ngày bắt"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Đơn vị bắt">
              <el-input
                v-model="form.arrest_unit"
                placeholder="Nhập đơn vị bắt..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Phân loại vân tay">
              <el-input
                v-model="form.fp_classification"
                placeholder="Nhập phân loại vân tay..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Lý do lập">
              <el-input
                v-model="form.reason_note"
                placeholder="Nhập lý do lập danh bản..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Ảnh danh bản</el-divider>

        <!-- Photo Upload Section -->
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Ảnh mặt trước">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="
                  (response, file) => handlePhotoSuccess('front', file)
                "
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
            <el-form-item label="Ảnh nghiêng trái">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="
                  (response, file) => handlePhotoSuccess('left', file)
                "
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="(file) => handlePhotoChange('left', file)"
              >
                <img
                  v-if="photoPreview.left"
                  :src="photoPreview.left"
                  class="photo-preview"
                />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Ảnh nghiêng phải">
              <el-upload
                class="photo-uploader"
                :show-file-list="false"
                :on-success="
                  (response, file) => handlePhotoSuccess('right', file)
                "
                :before-upload="beforePhotoUpload"
                action="#"
                :auto-upload="false"
                :on-change="(file) => handlePhotoChange('right', file)"
              >
                <img
                  v-if="photoPreview.right"
                  :src="photoPreview.right"
                  class="photo-preview"
                />
                <el-icon v-else class="photo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Đặc điểm hình thái học</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Khuôn mặt">
              <el-input
                v-model="form.anthropometry.face_shape"
                placeholder="Mô tả khuôn mặt..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Chiều cao (cm)">
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
            <el-form-item label="Sống mũi">
              <el-input
                v-model="form.anthropometry.nose_bridge"
                placeholder="Mô tả sống mũi..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Nếp tai dưới">
              <el-input
                v-model="form.anthropometry.ear_lower_fold"
                placeholder="Mô tả nếp tai dưới..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Dái tai">
              <el-input
                v-model="form.anthropometry.ear_lobe"
                placeholder="Mô tả dái tai..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Dấu vết riêng">
          <el-input
            v-model="form.anthropometry.distinctive_marks"
            type="textarea"
            :rows="3"
            placeholder="Mô tả các dấu vết đặc biệt, scar, hình xăm..."
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? "Cập nhật" : "Tạo mới" }}
          </el-button>
          <el-button @click="handleReset">Làm mới</el-button>
          <el-button @click="$router.go(-1)">Hủy</el-button>
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