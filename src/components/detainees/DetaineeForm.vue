<template>
  <div class="detainee-form">
    <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ isEdit ? "Chỉnh sửa phạm nhân" : "Thêm phạm nhân mới" }}
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
        <el-divider content-position="left">Thông tin cơ bản</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Mã phạm nhân" prop="detainee_code">
              <el-input
                v-model="form.detainee_code"
                placeholder="Nhập mã phạm nhân..."
                :disabled="isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Số hồ sơ" prop="profile_number">
              <el-input
                v-model="form.profile_number"
                placeholder="Nhập số hồ sơ..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Họ và tên" prop="full_name">
              <el-input
                v-model="form.full_name"
                placeholder="Nhập họ và tên..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Tên gọi khác">
              <el-input
                v-model="form.alias_name"
                placeholder="Nhập tên gọi khác..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Giới tính" prop="gender">
              <el-select v-model="form.gender" placeholder="Chọn giới tính">
                <el-option label="Nam" value="Nam" />
                <el-option label="Nữ" value="Nữ" />
                <el-option label="Khác" value="Khác" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày sinh" prop="date_of_birth">
              <el-date-picker
                v-model="form.date_of_birth"
                type="date"
                placeholder="Chọn ngày sinh"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Nơi sinh">
              <el-input
                v-model="form.place_of_birth"
                placeholder="Nhập nơi sinh..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Giấy tờ tùy thân</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Số CCCD/CMND" prop="id_number">
              <el-input
                v-model="form.id_number"
                placeholder="Nhập số CCCD/CMND..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày cấp">
              <el-date-picker
                v-model="form.id_issue_date"
                type="date"
                placeholder="Chọn ngày cấp"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Nơi cấp">
              <el-input
                v-model="form.id_issue_place"
                placeholder="Nhập nơi cấp..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Nghề nghiệp">
          <el-input
            v-model="form.occupation"
            placeholder="Nhập nghề nghiệp..."
          />
        </el-form-item>

        <el-form-item label="Địa chỉ thường trú">
          <el-input
            v-model="form.permanent_address"
            type="textarea"
            :rows="3"
            placeholder="Nhập địa chỉ thường trú..."
          />
        </el-form-item>

        <el-divider content-position="left">Thông tin giam giữ</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày bắt" prop="detention_date">
              <el-date-picker
                v-model="form.detention_date"
                type="date"
                placeholder="Chọn ngày bắt"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Số án">
              <el-input
                v-model="form.case_number"
                placeholder="Nhập số án..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Số buồng giam">
              <el-input
                v-model="form.cell_number"
                placeholder="Nhập số buồng giam..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Trại giam" prop="prison_id">
              <el-select v-model="form.prison_id" placeholder="Chọn trại giam">
                <el-option
                  v-for="prison in prisonStore.prisons"
                  :key="prison.id"
                  :label="prison.name"
                  :value="prison.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Trạng thái" prop="status">
              <el-select v-model="form.status" placeholder="Chọn trạng thái">
                <el-option label="Đang giam giữ" value="DETAINED" />
                <el-option label="Đã thả" value="RELEASED" />
                <el-option label="Chuyển trại" value="TRANSFERRED" />
                <el-option label="Đã chết" value="DECEASED" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Tội danh">
          <el-input
            v-model="form.charges"
            type="textarea"
            :rows="3"
            placeholder="Nhập tội danh..."
          />
        </el-form-item>

        <el-form-item label="Ghi chú">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="Nhập ghi chú..."
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? "Cập nhật" : "Thêm mới" }}
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
import { useDetaineeStore, usePrisonStore } from "@/stores";

const route = useRoute();
const router = useRouter();
const detaineeStore = useDetaineeStore();
const prisonStore = usePrisonStore();

// Reactive data
const formRef = ref();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);

const form = reactive({
  detainee_code: "",
  profile_number: "",
  full_name: "",
  alias_name: "",
  gender: "",
  date_of_birth: "",
  place_of_birth: "",
  id_number: "",
  id_issue_date: "",
  id_issue_place: "",
  occupation: "",
  permanent_address: "",
  detention_date: "",
  case_number: "",
  cell_number: "",
  prison_id: null,
  status: "DETAINED",
  charges: "",
  notes: "",
});

// Validation rules
const rules = reactive({
  detainee_code: [
    { required: true, message: "Vui lòng nhập mã phạm nhân", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "Mã phạm nhân phải từ 3-20 ký tự",
      trigger: "blur",
    },
  ],
  full_name: [
    { required: true, message: "Vui lòng nhập họ và tên", trigger: "blur" },
    { min: 2, max: 50, message: "Họ tên phải từ 2-50 ký tự", trigger: "blur" },
  ],
  gender: [
    { required: true, message: "Vui lòng chọn giới tính", trigger: "change" },
  ],
  date_of_birth: [
    { required: true, message: "Vui lòng chọn ngày sinh", trigger: "change" },
  ],
  id_number: [
    {
      pattern: /^[0-9]{9,12}$/,
      message: "Số CCCD/CMND không hợp lệ",
      trigger: "blur",
    },
  ],
  detention_date: [
    { required: true, message: "Vui lòng chọn ngày bắt", trigger: "change" },
  ],
  prison_id: [
    { required: true, message: "Vui lòng chọn trại giam", trigger: "change" },
  ],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
});

// Methods
const loadData = () => {
  if (isEdit.value) {
    const detainee = detaineeStore.getDetaineeById(route.params.id);
    if (detainee) {
      Object.assign(form, detainee);
    } else {
      ElMessage.error("Không tìm thấy thông tin phạm nhân!");
      router.push("/detainees");
    }
  } else {
    // Set default values for new detainee
    form.detention_date = new Date().toISOString().split("T")[0];
    form.status = "DETAINED";
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    // Check if code already exists (for new detainee)
    if (!isEdit.value) {
      const existingDetainee = detaineeStore.detainees.find(
        (d) => d.detainee_code === form.detainee_code
      );
      if (existingDetainee) {
        ElMessage.error("Mã phạm nhân đã tồn tại!");
        return;
      }
    }

    // Validate dates
    if (form.date_of_birth && form.detention_date) {
      const birthDate = new Date(form.date_of_birth);
      const detentionDate = new Date(form.detention_date);

      if (birthDate >= detentionDate) {
        ElMessage.error("Ngày bắt phải sau ngày sinh!");
        return;
      }

      const age = detentionDate.getFullYear() - birthDate.getFullYear();
      if (age < 14) {
        ElMessage.error("Phạm nhân phải từ 14 tuổi trở lên!");
        return;
      }
    }

    submitting.value = true;

    if (isEdit.value) {
      detaineeStore.updateDetainee(parseInt(route.params.id), { ...form });
      ElMessage.success("Cập nhật phạm nhân thành công!");
    } else {
      detaineeStore.addDetainee({ ...form });
      ElMessage.success("Thêm phạm nhân thành công!");
    }

    router.push("/detainees");
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
      detainee_code: "",
      profile_number: "",
      full_name: "",
      alias_name: "",
      gender: "",
      date_of_birth: "",
      place_of_birth: "",
      id_number: "",
      id_issue_date: "",
      id_issue_place: "",
      occupation: "",
      permanent_address: "",
      detention_date: new Date().toISOString().split("T")[0],
      case_number: "",
      cell_number: "",
      prison_id: null,
      status: "DETAINED",
      charges: "",
      notes: "",
    });
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.detainee-form {
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
</style>