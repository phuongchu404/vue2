<template>
  <div>
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="180px"
        @submit.prevent="handleSubmit"
      >
        <!-- Thông tin cơ bản -->
        <el-divider content-position="left">Thông tin cơ bản</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Số hồ sơ" prop="profileNumber">
              <el-input
                v-model="form.profileNumber"
                placeholder="Nhập số hồ sơ..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item v-if="isEdit" label="Mã cán bộ">
              <el-input
                v-model="form.staffCode"
                :disabled="isEdit"
                placeholder="Nhập mã cán bộ..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Họ và tên" prop="fullName">
              <el-input
                v-model="form.fullName"
                placeholder="Nhập họ và tên..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Giới tính" prop="gender">
              <el-select v-model="form.gender" placeholder="Chọn giới tính">
                <el-option
                  v-for="option in genderOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Ngày sinh">
              <el-date-picker
                v-model="form.dateOfBirth"
                type="date"
                placeholder="Chọn ngày sinh"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Nơi sinh">
              <el-input
                v-model="form.placeOfBirth"
                placeholder="Nhập nơi sinh..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Số CCCD/CMND" prop="idNumber">
              <el-input
                v-model="form.idNumber"
                placeholder="Nhập số CCCD/CMND..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Ngày cấp">
              <el-date-picker
                v-model="form.idIssueDate"
                type="date"
                placeholder="Chọn ngày cấp"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Nơi cấp">
          <el-input v-model="form.idIssuePlace" placeholder="Nhập nơi cấp..." />
        </el-form-item>

        <!-- Thông tin liên hệ -->
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

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Người liên hệ khẩn cấp">
              <el-input
                v-model="form.emergencyContact"
                placeholder="Nhập tên người liên hệ..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="SĐT liên hệ khẩn cấp">
              <el-input
                v-model="form.emergencyPhone"
                placeholder="Nhập số điện thoại..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Địa chỉ thường trú">
              <el-input
                v-model="form.permanentAddress"
                type="textarea"
                :rows="2"
                placeholder="Nhập địa chỉ thường trú..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Địa chỉ tạm trú">
              <el-input
                v-model="form.temporaryAddress"
                type="textarea"
                :rows="2"
                placeholder="Nhập địa chỉ tạm trú..."
              />
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-divider content-position="left">Địa chỉ thường trú</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item label="Tỉnh/Thành" prop="permanentProvinceId">
              <el-select
                v-model="form.permanentProvinceId"
                placeholder="Chọn tỉnh"
                filterable
                clearable
                style="width: 100%"
                @change="onPermanentProvinceChange"
              >
                <el-option
                  v-for="p in permanentProvinces"
                  :key="p.code"
                  :label="p.name"
                  :value="p.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Chọn Xã -->
          <el-col :span="7">
            <el-form-item label="Xã/Phường" prop="permanentWardId">
              <el-select
                v-model="form.permanentWardId"
                placeholder="Chọn xã/phường"
                filterable
                clearable
                style="width: 100%"
                :disabled="!form.permanentProvinceId"
              >
                <el-option
                  v-for="w in permanentWards"
                  :key="w.code"
                  :label="w.name"
                  :value="w.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- Địa chỉ cụ thể -->
          <el-col :span="10">
            <el-form-item label="Địa chỉ" prop="address">
              <el-input
                v-model="form.permanentAddress"
                placeholder="Số nhà, đường, thôn/xóm..."
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Địa chỉ tạm trú</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item label="Tỉnh/Thành" prop="temporaryProvinceId">
              <el-select
                v-model="form.temporaryProvinceId"
                placeholder="Chọn tỉnh"
                filterable
                clearable
                style="width: 100%"
                @change="onTemporaryProvinceChange"
              >
                <el-option
                  v-for="p in temporaryProvinces"
                  :key="p.code"
                  :label="p.name"
                  :value="p.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Chọn Xã -->
          <el-col :span="7">
            <el-form-item label="Xã/Phường" prop="temporaryWardId">
              <el-select
                v-model="form.temporaryWardId"
                placeholder="Chọn xã/phường"
                filterable
                clearable
                style="width: 100%"
                :disabled="!form.temporaryProvinceId"
              >
                <el-option
                  v-for="w in temporaryWards"
                  :key="w.code"
                  :label="w.name"
                  :value="w.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- Địa chỉ cụ thể -->
          <el-col :span="10">
            <el-form-item label="Địa chỉ" prop="address">
              <el-input
                v-model="form.temporaryAddress"
                placeholder="Số nhà, đường, thôn/xóm..."
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- Thông tin công việc -->
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
                v-model="form.departmentName"
                placeholder="Nhập phòng ban..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Chức vụ">
              <el-input
                v-model="form.positionName"
                placeholder="Nhập chức vụ..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Trại giam">
              <el-select
                v-model="form.detentionCenterId"
                placeholder="Chọn trại giam"
              >
                <el-option
                  v-for="prison in prisonStore.prisons"
                  :key="prison.id"
                  :label="prison.name"
                  :value="prison.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Trạng thái" prop="status">
              <el-select v-model="form.status" placeholder="Chọn trạng thái">
                <el-option label="Đang làm việc" value="ACTIVE" />
                <el-option label="Nghỉ phép" value="INACTIVE" />
                <el-option label="Nghỉ hưu" value="RETIRED" />
                <el-option label="Chuyển công tác" value="TRANSFERRED" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Trình độ học vấn">
              <el-select
                v-model="form.educationLevelId"
                placeholder="Chọn trình độ"
              >
                <el-option label="Đại học" :value="1" />
                <el-option label="Cao đẳng" :value="2" />
                <el-option label="Trung cấp" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="isEdit" label="Hoạt động">
          <el-switch
            v-model="form.isActive"
            active-text="Đang hoạt động"
            inactive-text="Không hoạt động"
          />
        </el-form-item>

        <!-- Buttons -->
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

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStaffStore } from "@/stores/staff";
import { usePrisonStore } from "@/stores/prison";
import { statusOptions, Gender, Status, genderOptions } from "@/constants";
import type { FormInstance, FormRules } from "element-plus";
import { Staff, CreateStaffRequest, UpdateStaffRequest } from "@/types/staff";
import { useProvinceStore } from "@/stores/province";
import { useWardStore } from "@/stores/ward";
import { storeToRefs } from "pinia";
import type { Province } from "@/types/province";
import type { Ward } from "@/types/ward";

const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();
const prisonStore = usePrisonStore();
const provinceStore = useProvinceStore();
const wardStore = useWardStore();

// Reactive data
const formRef = ref<FormInstance>();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);
const form = reactive<Partial<Staff>>({
  staffCode: "",
  profileNumber: "",
  fullName: "",
  gender: "",
  dateOfBirth: "",
  idNumber: "",
  phone: "",
  email: "",
  permanentAddress: "",
  rank: "",
  departmentId: undefined,
  positionId: undefined,
  detentionCenterId: undefined,
  status: "ACTIVE",
});
const permanentProvinces = ref<Province[]>([]);
const permanentWards = ref<Ward[]>([]);

const temporaryProvinces = ref<Province[]>([]);
const temporaryWards = ref<Ward[]>([]);

// Validation rules
const rules: FormRules = {
  staffCode: [
    { required: true, message: "Vui lòng nhập mã cán bộ", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "Mã cán bộ phải từ 3-20 ký tự",
      trigger: "blur",
    },
  ],
  fullName: [
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
  detentionCenterId: [
    { required: true, message: "Vui lòng chọn trại giam", trigger: "change" },
  ],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
};

const onPermanentProvinceChange = async (code: string) => {
  form.permanentWardId = "";
  if (!code) {
    wardStore.clear();
    return;
  }
  try {
    await wardStore.getByProvinceCode(code);
    if (wardStore.wards) {
      permanentWards.value = wardStore.wards;
    }
  } catch {}
};

const getAllProvinces = async () => {
  await provinceStore.getAll();
  if (provinceStore.getProvinces) {
    permanentProvinces.value = provinceStore.getProvinces;
    temporaryProvinces.value = provinceStore.getProvinces;
  }
};

const onTemporaryProvinceChange = async (code: string) => {
  form.temporaryWardId = "";
  if (!code) {
    wardStore.clear();
    return;
  }
  try {
    await wardStore.getByProvinceCode(code);
    if (wardStore.wards) {
      temporaryWards.value = wardStore.wards;
    }
  } catch {}
};
// Methods
const loadData = async () => {
  if (isEdit.value) {
    console.log(route.params.id);
    const staff = await staffStore.fetchDetail(Number(route.params.id));
    console.log(staff);
    if (staff) {
      Object.assign(form, staff);
    } else {
      ElMessage.error("Không tìm thấy thông tin trại giam!");
      router.push("/staff");
    }
  }
  // const idParam = route.params.id as string | undefined
  // if (idParam) {
  //   isEdit.value = true
  //   const id = Number(idParam)
  //   const detail = await store.fetchDetail(id)
  //   Object.assign(form, detail)
  // }
};

const handleSubmit = async () => {
  try {
    formRef.value?.validate(async (valid: any) => {
      if (!valid) return;
      if (isEdit.value && form.id) {
        const payload: UpdateStaffRequest = {
          profileNumber: form.profileNumber,
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          idNumber: form.idNumber,
          phone: form.phone,
          email: form.email,
          permanentAddress: form.permanentAddress,
          rank: form.rank,
          departmentId: form.departmentId,
          positionId: form.positionId,
          detentionCenterId: form.detentionCenterId,
          status: form.status,
        };
        await staffStore.updateStaff(form.id as number, payload);
      } else {
        const payload: CreateStaffRequest = {
          profileNumber: form.profileNumber,
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          idNumber: form.idNumber,
          phone: form.phone,
          email: form.email,
          permanentAddress: form.permanentAddress,
          rank: form.rank,
          departmentId: form.departmentId,
          positionId: form.positionId,
          detentionCenterId: form.detentionCenterId,
          status: form.status,
        };
        console.log(payload);
        await staffStore.createStaff(payload);
      }
      router.push("/prisons");
    });
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
      code: "",
      name: "",
      address: "",
      director: "",
      deputyDirector: "",
      phone: "",
      capacity: null,
      currentPopulation: 0,
      isActive: true,
    });
  }
};
onMounted(async () => {
  await getAllProvinces();
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
