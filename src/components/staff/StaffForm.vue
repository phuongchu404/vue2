<template>
  <div class="staff-form">
    <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ isEdit ? "Chỉnh sửa cán bộ" : "Thêm cán bộ mới" }}
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
            <el-form-item label="Mã cán bộ" prop="staff_code">
              <el-input
                v-model="form.staff_code"
                placeholder="Nhập mã cán bộ..."
                :disabled="isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Số hồ sơ">
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
            <el-form-item label="Giới tính" prop="gender">
              <el-select v-model="form.gender" placeholder="Chọn giới tính">
                <el-option label="Nam" value="Nam" />
                <el-option label="Nữ" value="Nữ" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Ngày sinh">
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
          <el-col :md="12" :span="24">
            <el-form-item label="Số CCCD/CMND">
              <el-input
                v-model="form.id_number"
                placeholder="Nhập số CCCD/CMND..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Thông tin liên hệ</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Số điện thoại" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="Nhập số điện thoại..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Email">
              <el-input
                v-model="form.email"
                type="email"
                placeholder="Nhập email..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Địa chỉ thường trú">
          <el-input
            v-model="form.permanent_address"
            type="textarea"
            :rows="3"
            placeholder="Nhập địa chỉ thường trú..."
          />
        </el-form-item>

        <el-divider content-position="left">Thông tin công việc</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Cấp bậc" prop="rank">
              <el-input v-model="form.rank" placeholder="Nhập cấp bậc..." />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Phòng ban">
              <el-input
                v-model="form.department"
                placeholder="Nhập phòng ban..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Chức vụ">
              <el-input v-model="form.position" placeholder="Nhập chức vụ..." />
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
                <el-option label="Đang làm việc" value="ACTIVE" />
                <el-option label="Nghỉ phép" value="INACTIVE" />
                <el-option label="Nghỉ hưu" value="RETIRED" />
                <el-option label="Chuyển công tác" value="TRANSFERRED" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Ngày vào làm">
              <el-date-picker
                v-model="form.start_date"
                type="date"
                placeholder="Chọn ngày vào làm"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Mức lương">
              <el-input-number
                v-model="form.salary"
                :min="0"
                :precision="0"
                placeholder="Nhập mức lương..."
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

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
import { useStaffStore, usePrisonStore } from "@/stores";

const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();
const prisonStore = usePrisonStore();

// Reactive data
const formRef = ref();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);

const form = reactive({
  staff_code: "",
  profile_number: "",
  full_name: "",
  gender: "",
  date_of_birth: "",
  id_number: "",
  phone: "",
  email: "",
  permanent_address: "",
  rank: "",
  department: "",
  position: "",
  prison_id: null,
  status: "ACTIVE",
  start_date: "",
  salary: null,
  notes: "",
});

// Validation rules
const rules = reactive({
  staff_code: [
    { required: true, message: "Vui lòng nhập mã cán bộ", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "Mã cán bộ phải từ 3-20 ký tự",
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
  phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
    {
      pattern: /^[0-9]{10,11}$/,
      message: "Số điện thoại không hợp lệ",
      trigger: "blur",
    },
  ],
  email: [{ type: "email", message: "Email không hợp lệ", trigger: "blur" }],
  rank: [{ required: true, message: "Vui lòng nhập cấp bậc", trigger: "blur" }],
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
    const staff = staffStore.getStaffById(route.params.id);
    if (staff) {
      Object.assign(form, staff);
    } else {
      ElMessage.error("Không tìm thấy thông tin cán bộ!");
      router.push("/staff");
    }
  } else {
    // Set default values for new staff
    form.status = "ACTIVE";
    form.start_date = new Date().toISOString().split("T")[0];
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    // Check if code already exists (for new staff)
    if (!isEdit.value) {
      const existingStaff = staffStore.staff.find(
        (s) => s.staff_code === form.staff_code
      );
      if (existingStaff) {
        ElMessage.error("Mã cán bộ đã tồn tại!");
        return;
      }
    }

    // Validate dates
    if (form.date_of_birth && form.start_date) {
      const birthDate = new Date(form.date_of_birth);
      const startDate = new Date(form.start_date);

      if (birthDate >= startDate) {
        ElMessage.error("Ngày vào làm phải sau ngày sinh!");
        return;
      }

      const age = startDate.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        ElMessage.error("Cán bộ phải từ 18 tuổi trở lên!");
        return;
      }
    }

    submitting.value = true;

    if (isEdit.value) {
      staffStore.updateStaff(parseInt(route.params.id), { ...form });
      ElMessage.success("Cập nhật cán bộ thành công!");
    } else {
      staffStore.addStaff({ ...form });
      ElMessage.success("Thêm cán bộ thành công!");
    }

    router.push("/staff");
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
      staff_code: "",
      profile_number: "",
      full_name: "",
      gender: "",
      date_of_birth: "",
      id_number: "",
      phone: "",
      email: "",
      permanent_address: "",
      rank: "",
      department: "",
      position: "",
      prison_id: null,
      status: "ACTIVE",
      start_date: new Date().toISOString().split("T")[0],
      salary: null,
      notes: "",
    });
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.staff-form {
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