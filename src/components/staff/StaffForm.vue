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
            <el-form-item label="Dân tộc" prop="ethnicityId">
              <el-select
                v-model="form.ethnicityId"
                placeholder="Chọn dân tộc"
              >
                <el-option
                  v-for="option in ethnicities"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Tôn giáo">
              <el-select
                v-model="form.religionId"
                placeholder="Chọn tôn giáo"
              >
                <el-option
                  v-for="option in religions"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                />
              </el-select>
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
              <el-select
                v-model="form.departmentId"
                placeholder="Chọn phòng ban"
                filterable
                clearable
                style="width: 100%"
                :disabled="!form.detentionCenterId"
              >
                <el-option
                  v-for="d in departments"
                  :key="d.id"
                  :label="d.name"
                  :value="d.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Chức vụ">
              <el-select
                v-model="form.positionId"
                placeholder="Chọn chức vụ"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="d in positions"
                  :key="d.id"
                  :label="d.name"
                  :value="d.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Trại giam">
              <el-select
                v-model="form.detentionCenterId"
                placeholder="Chọn trại giam"
                @change="onDetentionCenterChange"
              >
                <el-option
                  v-for="prison in prisons"
                  :key="prison.id"
                  :label="prison.name"
                  :value="prison.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Trình độ học vấn">
              <el-select
                v-model="form.educationLevelId"
                placeholder="Chọn trình độ"
              >
                <el-option
                  v-for="option in educationLevels"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                />
              </el-select>
            </el-form-item>
            
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item v-if="isEdit" label="Trạng thái" prop="status">
              <el-select v-model="form.status" placeholder="Chọn trạng thái">
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="isEdit" label="Hoạt động">
          <el-switch
            v-model="form.isActive"
            class="ml-2"
            inline-prompt
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            active-text="Đang hoạt động"
            inactive-text="Không hoạt động"
          />
          <!-- <el-switch
            v-model="form.isActive"
            active-text="Đang hoạt động"
            inactive-text="Không hoạt động"
          /> -->
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
import { statusOptions, Gender, Status, genderOptions } from "@/constants";
import type { FormInstance, FormRules } from "element-plus";
import { Staff, CreateStaffRequest, UpdateStaffRequest } from "@/types/staff";
import { useProvinceStore } from "@/stores/province";
import { useWardStore } from "@/stores/ward";
import { usePrisonStore } from "@/stores/prison";
import { useDepartmentStore } from "@/stores/department";
import { usePositionStore } from "@/stores/position";
import { useEducationLevelStore } from "@/stores/educationLevel";
import {useEthnicityStore} from "@/stores/ethnicity"
import { useReligionStore } from "@/stores/religion";
import { useI18n } from "vue-i18n";

import { storeToRefs } from "pinia";
import type { Province } from "@/types/province";
import type { Ward } from "@/types/ward";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();
const prisonStore = usePrisonStore();
const provinceStore = useProvinceStore();
const wardStore = useWardStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();
const educationLevelStore = useEducationLevelStore();
const ethnicityStore = useEthnicityStore();
const religionStore = useReligionStore();

const { prisons } = storeToRefs(prisonStore);
const { departments } = storeToRefs(departmentStore);
const { positions } = storeToRefs(positionStore);
const { educationLevels } = storeToRefs(educationLevelStore);
const { ethnicities } = storeToRefs(ethnicityStore);
const { religions } = storeToRefs(religionStore);

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
  placeOfBirth: "",
  ethnicityId: undefined,
  religionId: undefined,
  idNumber: "",
  idIssueDate: "",
  idIssuePlace: "",
  phone: "",
  email: "",
  emergencyContact: "",
  emergencyPhone: "",
  permanentProvinceId: "",
  permanentWardId: "",
  permanentAddress: "",
  temporaryProvinceId: "",
  temporaryWardId: "",
  temporaryAddress: "",
  rank: "",
  departmentId: undefined,
  positionId: undefined,
  detentionCenterId: undefined,
  status: "ACTIVE",
  educationLevelId: undefined,
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

const onDetentionCenterChange = async (code: number) => {
  form.departmentId = undefined;
  if (!code) {
    departmentStore.clear();
    return;
  }
  try {
    await departmentStore.getByDetentionCenterId(code);
  } catch {}
};

const getAllProvinces = async () => {
  await provinceStore.getAll();
  if (provinceStore.getProvinces) {
    permanentProvinces.value = provinceStore.getProvinces;
    temporaryProvinces.value = provinceStore.getProvinces;
  }
};

const getAllPositions = async () => {
  await positionStore.getAll();
};

const getAllPrisons = async () => {
  await prisonStore.getAll();
};

const getAllEducationLevels = async () => {
  await educationLevelStore.getAll();
};

const getAllEthnicities = async () => {
  await ethnicityStore.getAll();
};

const getAllReligions = async () => {
  await religionStore.getAll();
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
          placeOfBirth: form.placeOfBirth,
          ethnicityId: form.ethnicityId,
          religionId: form.religionId,
          idNumber: form.idNumber,
          idIssueDate: form.idIssueDate,
          idIssuePlace: form.idIssuePlace,
          phone: form.phone,
          email: form.email,
          emergencyContact: form.emergencyContact,
          emergencyPhone: form.emergencyPhone,
          permanentWardId: form.permanentWardId,
          permanentAddress: form.permanentAddress,
          temporaryWardId: form.temporaryWardId,
          temporaryAddress: form.temporaryAddress,
          rank: form.rank,
          departmentId: form.departmentId,
          positionId: form.positionId,
          detentionCenterId: form.detentionCenterId,
          educationLevelId: form.educationLevelId,
          status: form.status,
        };
        await staffStore.updateStaff(form.id as number, payload);
      } else {
        const payload: CreateStaffRequest = {
          profileNumber: form.profileNumber,
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          placeOfBirth: form.placeOfBirth,
          ethnicityId: form.ethnicityId,
          religionId: form.religionId,
          idNumber: form.idNumber,
          idIssueDate: form.idIssueDate,
          idIssuePlace: form.idIssuePlace,
          phone: form.phone,
          email: form.email,
          emergencyContact: form.emergencyContact,
          emergencyPhone: form.emergencyPhone,
          permanentWardId: form.permanentWardId,
          permanentAddress: form.permanentAddress,
          temporaryWardId: form.temporaryWardId,
          temporaryAddress: form.temporaryAddress,
          rank: form.rank,
          departmentId: form.departmentId,
          positionId: form.positionId,
          detentionCenterId: form.detentionCenterId,
          educationLevelId: form.educationLevelId,
          isActive: form.isActive,
        };
        console.log(payload);
        await staffStore.createStaff(payload);
      }
      router.push("/staff");
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
      staffCode: "",
      profileNumber: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      placeOfBirth: "",
      idNumber: "",
      ethnicityId: undefined,
      religionId: undefined,
      idIssueDate: "",
      idIssuePlace: "",
      phone: "",
      email: "",
      emergencyContact: "",
      emergencyPhone: "",
      permanentProvinceId: "",
      permanentWardId: "",
      permanentAddress: "",
      temporaryProvinceId: "",
      temporaryWardId: "",
      temporaryAddress: "",
      rank: "",
      departmentId: undefined,
      positionId: undefined,
      detentionCenterId: undefined,
      status: "ACTIVE",
      educationLevelId: undefined,
    });
  }
};
onMounted(async () => {
  await getAllProvinces();
  getAllPositions();
  getAllPrisons();
  getAllEducationLevels();
  getAllEthnicities();
  getAllReligions();
  await loadData();
  if (isEdit.value) {
    if (form.permanentProvinceId) {
      await wardStore.getByProvinceCode(form.permanentProvinceId as string);
      if (wardStore.getWards) {
        permanentWards.value = wardStore.getWards;
      }
    }
    if (form.temporaryProvinceId) {
      await wardStore.getByProvinceCode(form.temporaryProvinceId as string);
      if (wardStore.getWards) {
        temporaryWards.value = wardStore.getWards;
      }
    }
    if (form.detentionCenterId) {
      await departmentStore.getByDetentionCenterId(
        form.detentionCenterId as number
      );
    }
  }
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
