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
            <el-form-item v-if="isEdit" label="Mã phạm nhân" prop="detaineeCode">
              <el-input
                v-model="form.detaineeCode"
                placeholder="Nhập mã phạm nhân..."
                :disabled="isEdit"
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
            <el-form-item label="Tên gọi khác">
              <el-input
                v-model="form.aliasName"
                placeholder="Nhập tên gọi khác..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
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
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày sinh" prop="dateOfBirth">
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
          <el-col :md="8" :span="24">
            <el-form-item label="Nơi sinh">
              <el-input
                v-model="form.placeOfBirth"
                placeholder="Nhập nơi sinh..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Giấy tờ tùy thân</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Số CCCD/CMND" prop="idNumber">
              <el-input
                v-model="form.idNumber"
                placeholder="Nhập số CCCD/CMND..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
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
          <el-col :md="8" :span="24">
            <el-form-item label="Nơi cấp">
              <el-input
                v-model="form.idIssuePlace"
                placeholder="Nhập nơi cấp..."
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Quốc tịch" prop="nationalityId">
              <el-select
              filterable
                clearable
                v-model="form.nationalityId"
                placeholder="Chọn quốc tịch"
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
            <el-form-item label="Dân tộc">
              <el-select
              filterable
                clearable
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
          <el-col :md="8" :span="24">
            <el-form-item label="Tôn giáo">
              <el-select
              filterable
                clearable
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
          <el-col :md="8" :span="24">
            <el-form-item label="Họ tên cha">
              <el-input
                v-model="form.fatherName"
                placeholder="Nhập họ tên cha"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Họ tên mẹ">
              <el-input
                v-model="form.motherName"
                placeholder="Nhập họ tên mẹ"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Họ tên vợ/chồng">
              <el-input
                v-model="form.spouseName"
                placeholder="Nhập họ tên vợ/chồng"
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

        <!-- <el-form-item label="Địa chỉ thường trú">
          <el-input
            v-model="form.permanent_address"
            type="textarea"
            :rows="3"
            placeholder="Nhập địa chỉ thường trú..."
          />
        </el-form-item> -->

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

        <el-divider content-position="left">Nơi ở hiện tại</el-divider>
        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item label="Tỉnh/Thành" prop="currentProvinceId">
              <el-select
                v-model="form.currentProvinceId"
                placeholder="Chọn tỉnh"
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
            <el-form-item label="Xã/Phường" prop="currentWardId">
              <el-select
                v-model="form.currentWardId"
                placeholder="Chọn xã/phường"
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
            <el-form-item label="Địa chỉ" prop="address">
              <el-input
                v-model="form.currentAddress"
                placeholder="Số nhà, đường, thôn/xóm..."
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">Thông tin giam giữ</el-divider>

        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày bắt" prop="detentionDate">
              <el-date-picker
                v-model="form.detentionDate"
                type="date"
                placeholder="Chọn ngày bắt"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày thả dự kiến" prop="expectedReleaseDate">
              <el-date-picker
                v-model="form.expectedReleaseDate"
                type="date"
                placeholder="Chọn ngày thả dự kiến"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Ngày thả thực tế">
              <el-date-picker
                v-model="form.actualReleaseDate"
                type="date"
                placeholder="Chọn ngày thả thực tế"
                style="width: 100%"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Thời hạn tù" >
              <el-input
                v-model="form.sentenceDuration"
                placeholder="Nhập thời hạn tù"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Số án">
              <el-input
                v-model="form.caseNumber"
                placeholder="Nhập số án..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Số buồng giam">
              <el-input
                v-model="form.cellNumber"
                placeholder="Nhập số buồng giam..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Trại giam" prop="detentionCenterId">
              <el-select v-model="form.detentionCenterId" placeholder="Chọn trại giam">
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
            <el-form-item label="Trạng thái" prop="status">
              <el-select
                v-model="form.status"
                placeholder="Chọn trạng thái"
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