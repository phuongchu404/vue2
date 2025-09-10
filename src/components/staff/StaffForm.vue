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
        <el-divider content-position="left">{{ t('staff.basicInfo') }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.profileNumber')" prop="profileNumber">
              <el-input
                  v-model="form.profileNumber"
                  :placeholder="t('staff.profileNumber')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item v-if="isEdit" :label="t('staff.staffCode')">
              <el-input
                  v-model="form.staffCode"
                  :disabled="isEdit"
                  :placeholder="t('staff.staffCode')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.fullName')" prop="fullName">
              <el-input
                  v-model="form.fullName"
                  :placeholder="t('staff.fullName')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.gender')" prop="gender">
              <el-select v-model="form.gender" :placeholder="t('staff.gender')">
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
            <el-form-item :label="t('staff.dateOfBirth')">
              <el-date-picker
                  v-model="form.dateOfBirth"
                  type="date"
                  :placeholder="t('staff.dateOfBirth')"
                  style="width: 100%"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.placeOfBirth')">
              <el-input
                  v-model="form.placeOfBirth"
                  :placeholder="t('staff.placeOfBirth')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.ethnicity')" prop="ethnicityId">
              <el-select
                  v-model="form.ethnicityId"
                  :placeholder="t('staff.ethnicity')"
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
            <el-form-item :label="t('staff.religion')">
              <el-select
                  v-model="form.religionId"
                  :placeholder="t('staff.religion')"
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
            <el-form-item :label="t('staff.idNumber')" prop="idNumber">
              <el-input
                  v-model="form.idNumber"
                  :placeholder="t('staff.idNumber')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.idIssueDate')">
              <el-date-picker
                  v-model="form.idIssueDate"
                  type="date"
                  :placeholder="t('staff.idIssueDate')"
                  style="width: 100%"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('staff.idIssuePlace')">
          <el-input v-model="form.idIssuePlace" :placeholder="t('staff.idIssuePlace')" />
        </el-form-item>

        <!-- Thông tin liên hệ -->
        <el-divider content-position="left">{{ t('staff.contactInfo') }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.phone')" prop="phone">
              <el-input
                  v-model="form.phone"
                  :placeholder="t('staff.phone')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.email')">
              <el-input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('staff.email')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.emergencyContact')">
              <el-input
                  v-model="form.emergencyContact"
                  :placeholder="t('staff.emergencyContact')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('staff.emergencyPhone')">
              <el-input
                  v-model="form.emergencyPhone"
                  :placeholder="t('staff.emergencyPhone')"
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

        <el-divider content-position="left">{{ t('staff.permanentAddress') }}</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item :label="t('staff.province')" prop="permanentProvinceId">
              <el-select
                  v-model="form.permanentProvinceId"
                  :placeholder="t('staff.province')"
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
            <el-form-item :label="t('staff.ward')" prop="permanentWardId">
              <el-select
                  v-model="form.permanentWardId"
                  :placeholder="t('staff.ward')"
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
            <el-form-item :label="t('staff.address')" prop="address">
              <el-input
                  v-model="form.permanentAddress"
                  :placeholder="t('staff.detailAddress')"
                  clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{ t('staff.temporaryAddress') }}</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item :label="t('staff.province')" prop="temporaryProvinceId">
              <el-select
                v-model="form.temporaryProvinceId"
                :placeholder="t('staff.province')"
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
            <el-form-item :label="t('staff.ward')" prop="temporaryWardId">
              <el-select
                v-model="form.temporaryWardId"
                :placeholder="t('staff.ward')"
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
            <el-form-item :label="t('staff.address')" prop="address">
              <el-input
                  v-model="form.temporaryAddress"
                  :placeholder="t('staff.detailAddress')"
                  clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- Thông tin công việc -->
        <el-divider content-position="left">{{ t('staff.jobInfo') }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="t('staff.rank')" prop="rank">
              <el-input v-model="form.rank" :placeholder="t('staff.rank')" />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="t('staff.department')">
              <el-select
                  v-model="form.departmentId"
                  :placeholder="t('staff.department')"
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
            <el-form-item :label="t('staff.position')">
              <el-select
                  v-model="form.positionId"
                  :placeholder="t('staff.position')"
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
            <el-form-item :label="t('staff.prison')">
              <el-select
                  v-model="form.detentionCenterId"
                  :placeholder="t('staff.prison')"
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
            <el-form-item :label="t('staff.educationLevel')">
              <el-select
                  v-model="form.educationLevelId"
                  :placeholder="t('staff.educationLevel')"
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
            <el-form-item v-if="isEdit" :label="t('staff.status')" prop="status">
              <el-select v-model="form.status" :placeholder="t('staff.status')">
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

        <el-form-item v-if="isEdit" :label="t('staff.isActive')">
          <el-switch
              v-model="form.isActive"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
              :active-text="t('staff.active')"
              :inactive-text="t('staff.inactive')"
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
            {{ isEdit ? t('common.update') : t('common.add') }}
          </el-button>
          <el-button @click="handleReset">{{ t('common.reset') }}</el-button>
          <el-button @click="$router.go(-1)">{{ t('common.cancel') }}</el-button>
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
    { required: true, message: t('staff.validation.required.code'), trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: t('staff.validation.length.code'),
      trigger: "blur",
    },
  ],
  fullName: [
    { required: true, message: t('staff.validation.required.name'), trigger: "blur" },
    { min: 2, max: 50, message: t('staff.validation.length.fullName'), trigger: "blur" },
  ],
  gender: [
    { required: true, message: t('staff.validation.required.gender'), trigger: "change" },
  ],
  phone: [
    { required: true, message: t('staff.validation.required.phone'), trigger: "blur" },
    {
      pattern: /^[0-9]{10,11}$/,
      message: t('staff.validation.pattern.phone'),
      trigger: "blur",
    },
  ],
  email: [{ type: "email", message: t('staff.validation.pattern.email'), trigger: "blur" }],
  rank: [{ required: true, message: t('staff.validation.required.rank'), trigger: "blur" }],
  detentionCenterId: [
    { required: true, message: t('staff.validation.required.detentionCenter'), trigger: "change" },
  ],
  status: [
    { required: true, message: t('staff.validation.required.status'), trigger: "change" },
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
      ElMessage.error(t('common.unspecified'));
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
