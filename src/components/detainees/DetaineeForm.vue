<template>
  <div class="detainee-form">
    <el-card class="form-card">
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="140px"
          @submit.prevent="handleSubmit"
      >
        <!-- Basic Info -->
        <el-divider content-position="left">{{ $t('detainee.section.basicInfo') }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('detainee.profileNumber')" prop="profileNumber">
              <el-input
                  v-model="form.profileNumber"
                  :placeholder="$t('detainee.placeholder.profileNumber')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item v-if="isEdit" :label="$t('detainee.code')" prop="detaineeCode">
              <el-input
                  v-model="form.detaineeCode"
                  :placeholder="$t('detainee.placeholder.code')"
                  :disabled="isEdit"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('detainee.fullName')" prop="fullName">
              <el-input
                  v-model="form.fullName"
                  :placeholder="$t('detainee.placeholder.fullName')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('detainee.aliasName')">
              <el-input
                  v-model="form.aliasName"
                  :placeholder="$t('detainee.placeholder.aliasName')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.gender')" prop="gender">
              <el-select v-model="form.gender" :placeholder="$t('detainee.placeholder.gender')">
                <el-option
                    v-for="option in genderOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.dateOfBirth')" prop="dateOfBirth">
              <el-date-picker
                  v-model="form.dateOfBirth"
                  type="date"
                  :placeholder="$t('detainee.placeholder.dateOfBirth')"
                  style="width: 100%"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.placeOfBirth')">
              <el-input
                  v-model="form.placeOfBirth"
                  :placeholder="$t('detainee.placeholder.placeOfBirth')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Identity -->
        <el-divider content-position="left">{{ $t('detainee.section.identity') }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.idNumber')" prop="idNumber">
              <el-input
                  v-model="form.idNumber"
                  :placeholder="$t('detainee.placeholder.idNumber')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.idIssueDate')">
              <el-date-picker
                  v-model="form.idIssueDate"
                  type="date"
                  :placeholder="$t('detainee.placeholder.idIssueDate')"
                  style="width: 100%"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.idIssuePlace')">
              <el-input
                  v-model="form.idIssuePlace"
                  :placeholder="$t('detainee.placeholder.idIssuePlace')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.nationality')" prop="nationalityId">
              <el-select
                  v-model="form.nationalityId"
                  filterable
                  clearable
                  :placeholder="$t('detainee.placeholder.nationality')"
              >
                <el-option
                    v-for="option in countries"
                    :key="option.id"
                    :label="option.name"
                    :value="option.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.ethnicity')">
              <el-select
                  v-model="form.ethnicityId"
                  filterable
                  clearable
                  :placeholder="$t('detainee.placeholder.ethnicity')"
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
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.religion')">
              <el-select
                  v-model="form.religionId"
                  filterable
                  clearable
                  :placeholder="$t('detainee.placeholder.religion')"
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
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.fatherName')">
              <el-input v-model="form.fatherName" :placeholder="$t('detainee.placeholder.fatherName')" />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.motherName')">
              <el-input v-model="form.motherName" :placeholder="$t('detainee.placeholder.motherName')" />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.spouseName')">
              <el-input v-model="form.spouseName" :placeholder="$t('detainee.placeholder.spouseName')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('detainee.occupation')">
          <el-input
            v-model="form.occupation"
            :placeholder="$t('detainee.placeholder.occupation')"
          />
        </el-form-item>

        <!-- <el-form-item label="Địa chỉ thường trú">
          <el-input
            v-model="form.permanent_address"
            type="textarea"
            :rows="3"
            placeholder="Nhập địa chỉ thường trú..."
          />
        </el-form-item> -->

        <el-divider content-position="left">{{ $t('detainee.section.permanent') }}</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item :label="$t('detainee.permanentProvince')" prop="permanentProvinceId">
              <el-select
                v-model="form.permanentProvinceId"
                :placeholder="$t('detainee.placeholder.province')"
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
            <el-form-item :label="$t('detainee.permanentWard')" prop="permanentWardId">
              <el-select
                v-model="form.permanentWardId"
                :placeholder="$t('detainee.placeholder.ward')"
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
            <el-form-item :label="$t('permanentAddress')" prop="address">
              <el-input
                v-model="form.permanentAddress"
                :placeholder="$t('detainee.placeholder.permanentAddress')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{ $t('detainee.section.temporary') }}</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item :label="$t('detainee.temporaryProvince')" prop="temporaryProvinceId">
              <el-select
                v-model="form.temporaryProvinceId"
                :placeholder="$t('detainee.placeholder.temporaryProvince')"
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
            <el-form-item :label="$t('detainee.temporaryWard')" prop="temporaryWardId">
              <el-select
                v-model="form.temporaryWardId"
                :placeholder="$t('detainee.placeholder.temporaryWard')"
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
            <el-form-item :label="$t('detainee.temporaryAddress')" prop="address">
              <el-input
                v-model="form.temporaryAddress"
                :placeholder="$t('detainee.placeholder.temporaryAddress')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{ $t('detainee.section.currentAddress') }}</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item :label="$t('detainee.currentProvince')" prop="currentProvinceId">
              <el-select
                v-model="form.currentProvinceId"
                :placeholder="$t('detainee.placeholder.currentProvince')"
                filterable
                clearable
                style="width: 100%"
                @change="onCurrentProvinceChange"
              >
                <el-option
                  v-for="p in currentProvinces"
                  :key="p.code"
                  :label="p.name"
                  :value="p.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Chọn Xã -->
          <el-col :span="7">
            <el-form-item :label="$t('detainee.currentWard')" prop="currentWardId">
              <el-select
                v-model="form.currentWardId"
                :placeholder="$t('detainee.placeholder.currentWard')"
                filterable
                clearable
                style="width: 100%"
                :disabled="!form.currentProvinceId"
              >
                <el-option
                  v-for="w in currentWards"
                  :key="w.code"
                  :label="w.name"
                  :value="w.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- Địa chỉ cụ thể -->
          <el-col :span="10">
            <el-form-item :label="$t('detainee.currentAddress')" prop="address">
              <el-input
                v-model="form.currentAddress"
                :placeholder="$t('detainee.placeholder.currentAddress')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">{{ $t('detainee.section.detention') }}</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.detentionDate')" prop="detentionDate">
              <el-date-picker
                v-model="form.detentionDate"
                type="date"
                :placeholder="$t('detainee.placeholder.detentionDate')"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.expectedReleaseDate')" prop="expectedReleaseDate">
              <el-date-picker
                v-model="form.expectedReleaseDate"
                type="date"
                :placeholder="$t('detainee.placeholder.expectedReleaseDate')"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.actualReleaseDate')">
              <el-date-picker
                v-model="form.actualReleaseDate"
                type="date"
                :placeholder="$t('detainee.placeholder.actualReleaseDate')"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.sentenceDuration')">
              <el-input
                v-model="form.sentenceDuration"
                :placeholder="$t('detainee.placeholder.sentenceDuration')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.caseNumber')">
              <el-input
                v-model="form.caseNumber"
                :placeholder="$t('detainee.placeholder.caseNumber')"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item :label="$t('detainee.cellNumber')">
              <el-input
                v-model="form.cellNumber"
                :placeholder="$t('detainee.placeholder.cellNumber')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('detainee.detentionCenter')" prop="detentionCenterId">
              <el-select v-model="form.detentionCenterId"  :placeholder="$t('detainee.placeholder.detentionCenter')">
                <el-option
                  v-for="prison in prisons"
                  :key="prison.id"
                  :label="prison.name"
                  :value="prison.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="$t('detainee.status')" prop="status">
              <el-select
                v-model="form.status"
                :placeholder="$t('detainee.placeholder.status')"
                clearable
              >
                <el-option
                  v-for="option in DetaineeStatus"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('detainee.charges')">
          <el-input
            v-model="form.charges"
            type="textarea"
            :rows="3"
            :placeholder="$t('detainee.placeholder.charges')"
          />
        </el-form-item>

        <el-form-item :label="$t('detainee.notes')">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            :placeholder="$t('detainee.placeholder.notes')"
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? $t('common.update') : $t('common.add') }}
          </el-button>
          <el-button @click="handleReset">{{ $t('common.reset') }}</el-button>
          <el-button @click="$router.go(-1)">{{ $t('common.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { DetaineeStatus, Gender, Status, genderOptions } from "@/constants";
import { useDetaineeStore } from "@/stores/detainee";
import { useProvinceStore } from "@/stores/province";
import { useWardStore } from "@/stores/ward";
import { usePrisonStore } from "@/stores/prison";
import {useEthnicityStore} from "@/stores/ethnicity"
import { useReligionStore } from "@/stores/religion";
import { useCountryStore } from "@/stores/country";
import { storeToRefs } from "pinia";
import type { Province } from "@/types/province";
import type { Ward } from "@/types/ward";
import type { Detainee, CreateDetaineeRequest, UpdateDetaineeRequest } from "@/types/detainee";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const detaineeStore = useDetaineeStore();
const prisonStore = usePrisonStore();
const provinceStore = useProvinceStore();
const wardStore = useWardStore();
const ethnicityStore = useEthnicityStore();
const religionStore = useReligionStore();
const countryStore = useCountryStore();
const { t } = useI18n();

const { prisons } = storeToRefs(prisonStore);
const { ethnicities } = storeToRefs(ethnicityStore);
const { religions } = storeToRefs(religionStore);
const { countries } = storeToRefs(countryStore);


// Reactive data
const formRef = ref<FormInstance>();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);

const form = reactive<Partial<Detainee>>({
  detaineeCode: "",
  profileNumber: "",
  fullName: "",
  aliasName: "",
  gender: "",
  dateOfBirth: "",
  placeOfBirth: "",
  idNumber: "",
  idIssueDate: "",
  idIssuePlace: "",
  nationalityId: undefined,
  ethnicityId: undefined,
  religionId: undefined,
  permanentAddress: "",
  permanentWardId: "",
  permanentProvinceId: "",
  temporaryAddress: "",
  temporaryWardId: "",
  temporaryProvinceId: "",
  currentAddress: "",
  currentWardId: "",
  currentProvinceId: "",
  occupation: "",
  fatherName: "",
  motherName: "",
  spouseName: "",
  detentionCenterId: undefined,
  detentionDate: "",
  expectedReleaseDate: "",
  actualReleaseDate: "",
  caseNumber: "",
  cellNumber: "",
  status: "DETAINED",
  charges: "",
  sentenceDuration: "",
  notes: "",
});

const permanentProvinces = ref<Province[]>([]);
const permanentWards = ref<Ward[]>([]);

const temporaryProvinces = ref<Province[]>([]);
const temporaryWards = ref<Ward[]>([]);

const currentProvinces = ref<Province[]>([]);
const currentWards = ref<Ward[]>([]);

// Validation rules
const rules: FormRules = {
  detaineeCode: [
    { required: true, message: "Vui lòng nhập mã phạm nhân", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "Mã phạm nhân phải từ 3-20 ký tự",
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
  dateOfBirth: [
    { required: true, message: "Vui lòng chọn ngày sinh", trigger: "change" },
  ],
  idNumber: [
    {
      pattern: /^[0-9]{9,12}$/,
      message: "Số CCCD/CMND không hợp lệ",
      trigger: "blur",
    },
  ],
  detentionDate: [
    { required: true, message: "Vui lòng chọn ngày bắt", trigger: "change" },
  ],
  detentionCenterId: [
    { required: true, message: "Vui lòng chọn trại giam", trigger: "change" },
  ],
  status: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
};

// Methods
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
const onCurrentProvinceChange = async (code: string) => {
  form.currentWardId = "";
  if (!code) {
    wardStore.clear();
    return;
  }
  try {
    await wardStore.getByProvinceCode(code);
    if (wardStore.wards) {
      currentWards.value = wardStore.wards;
    }
  } catch {}
};

const getAllProvinces = async () => {
  await provinceStore.getAll();
  if (provinceStore.getProvinces) {
    permanentProvinces.value = provinceStore.getProvinces;
    temporaryProvinces.value = provinceStore.getProvinces;
    currentProvinces.value = provinceStore.getProvinces;
  }
};
const getAllPrisons = async () => {
  await prisonStore.getAll();
};
const getAllEthnicities = async () => {
  await ethnicityStore.getAll();
};

const getAllReligions = async () => {
  await religionStore.getAll();
};

const getAllCountries = async () => {
  await countryStore.getAll();
}
const loadData = async () => {
  if (isEdit.value) {
    const detainee = await detaineeStore.fetchDetail(Number(route.params.id));
    if (detainee) {
      Object.assign(form, detainee);
    } else {
      ElMessage.error("Không tìm thấy thông tin phạm nhân!");
      router.push("/detainees");
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    // Validate dates
    if (form.dateOfBirth && form.detentionDate) {
      const birthDate = new Date(form.dateOfBirth);
      const detentionDate = new Date(form.detentionDate);

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

    if (isEdit.value && form.id) {
        const payload: UpdateDetaineeRequest = {
          profileNumber: form.profileNumber,
          fullName: form.fullName,
          aliasName: form.aliasName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          placeOfBirth: form.placeOfBirth,
          idNumber: form.idNumber,
          idIssueDate: form.idIssueDate,
          idIssuePlace: form.idIssuePlace,
          ethnicityId: form.ethnicityId,
          religionId: form.religionId,
          nationalityId: form.nationalityId,
          permanentWardId: form.permanentWardId,
          permanentAddress: form.permanentAddress,
          temporaryWardId: form.temporaryWardId,
          temporaryAddress: form.temporaryAddress,
          currentWardId: form.currentWardId,
          currentAddress: form.currentAddress,
          occupation: form.occupation,
          fatherName: form.fatherName,
          motherName: form.motherName,
          spouseName: form.spouseName,
          detentionCenterId: form.detentionCenterId,
          detentionDate: form.detentionDate,
          expectedReleaseDate: form.expectedReleaseDate,
          actualReleaseDate: form.actualReleaseDate,
          caseNumber: form.caseNumber,
          charges: form.charges,
          sentenceDuration: form.sentenceDuration,
          cellNumber: form.cellNumber,
          status: form.status,
          notes: form.notes
        };
        await detaineeStore.updateDetainee(form.id as number, payload);
      } else {
        const payload: CreateDetaineeRequest = {
          profileNumber: form.profileNumber,
          fullName: form.fullName,
          aliasName: form.aliasName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          placeOfBirth: form.placeOfBirth,
          idNumber: form.idNumber,
          idIssueDate: form.idIssueDate,
          idIssuePlace: form.idIssuePlace,
          ethnicityId: form.ethnicityId,
          religionId: form.religionId,
          nationalityId: form.nationalityId,
          permanentWardId: form.permanentWardId,
          permanentAddress: form.permanentAddress,
          temporaryWardId: form.temporaryWardId,
          temporaryAddress: form.temporaryAddress,
          currentWardId: form.currentWardId,
          currentAddress: form.currentAddress,
          occupation: form.occupation,
          fatherName: form.fatherName,
          motherName: form.motherName,
          spouseName: form.spouseName,
          detentionCenterId: form.detentionCenterId,
          detentionDate: form.detentionDate,
          expectedReleaseDate: form.expectedReleaseDate,
          actualReleaseDate: form.actualReleaseDate,
          caseNumber: form.caseNumber,
          charges: form.charges,
          sentenceDuration: form.sentenceDuration,
          cellNumber: form.cellNumber,
          status: form.status,
          notes: form.notes
        };
        await detaineeStore.createDetainee(payload);
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
      profileNumber: "",
      fullName: "",
      aliasName: "",
      gender: "",
      dateOfBirth: "",
      placeOfBirth: "",
      idNumber: "",
      idIssueDate: "",
      idIssuePlace: "",
      ethnicityId: "",
      religionId: "",
      nationalityId: "",
      permanentWardId: "",
      permanentAddress: "",
      temporaryWardId: "",
      temporaryAddress: "",
      currentWardId: "",
      currentAddress: "",
      occupation: "",
      fatherName: "",
      motherName: "",
      spouseName: "",
      detentionCenterId: "",
      detentionDate: "",
      expectedReleaseDate: "",
      actualReleaseDate: "",
      caseNumber: "",
      charges: "",
      sentenceDuration: "",
      cellNumber: "",
      status: "",
      notes: "",
    });
  }
};

onMounted(async() => {
   await nextTick();
  await getAllProvinces();
  getAllPrisons();
  getAllEthnicities();
  getAllReligions();
  getAllCountries();
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
    if (form.currentProvinceId) {
      await wardStore.getByProvinceCode(form.currentProvinceId as string);
      if (wardStore.getWards) {
        currentWards.value = wardStore.getWards;
      }
    }
  }
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