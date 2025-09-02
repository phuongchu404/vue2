<template>
  <div class="prison-form">
    <!-- <el-page-header @back="$router.go(-1)">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ isEdit ? "Chỉnh sửa trại giam" : "Thêm trại giam mới" }}
        </span>
      </template>
    </el-page-header> -->

    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <el-row :gutter="20">
          <el-col :md="8" :span="24">
            <el-form-item label="Mã trại giam" prop="code">
              <el-input
                v-model="form.code"
                placeholder="Nhập mã trại giam..."
                :disabled="isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Tên trại giam" prop="name">
              <el-input
                v-model="form.name"
                placeholder="Nhập tên trại giam..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="8" :span="24">
            <el-form-item label="Số điện thoại" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="Nhập số điện thoại..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <!-- Chọn Tỉnh -->
          <el-col :span="7">
            <el-form-item label="Tỉnh/Thành" prop="provinceId">
              <el-select
                v-model="form.provinceId"
                placeholder="Chọn tỉnh"
                filterable
                clearable
                style="width: 100%"
                @change="onProvinceChange"
              >
                <el-option
                  v-for="p in provinces"
                  :key="p.code"
                  :label="p.name"
                  :value="p.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Chọn Xã -->
          <el-col :span="7">
            <el-form-item label="Xã/Phường" prop="wardId">
              <el-select
                v-model="form.wardId"
                placeholder="Chọn xã/phường"
                filterable
                clearable
                style="width: 100%"
                :disabled="!form.provinceId"
              >
                <el-option
                  v-for="w in wards"
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
                v-model="form.address"
                placeholder="Số nhà, đường, thôn/xóm..."
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Giám thị" prop="director">
              <el-input
                v-model="form.director"
                placeholder="Nhập tên giám thị..."
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item label="Phó giám thị" prop="deputyDirector">
              <el-input
                v-model="form.deputyDirector"
                placeholder="Nhập tên phó giám thị..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item label="Sức chứa tối đa" prop="capacity">
              <el-input-number
                v-model="form.capacity"
                :min="1"
                :max="10000"
                placeholder="Nhập sức chứa..."
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item
              label="Số phạm nhân hiện tại"
              prop="currentPopulation"
            >
              <el-input-number
                v-model="form.currentPopulation"
                :min="0"
                :max="form.capacity || 10000"
                placeholder="Nhập số phạm nhân hiện tại..."
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Trạng thái" prop="isActive">
          <el-radio-group v-model="form.isActive">
            <el-radio label="ACTIVE" :value="true">Hoạt động</el-radio>
            <el-radio label="INACTIVE" :value="false">Tạm dừng</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="Mô tả">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="Nhập mô tả về trại giam..."
          />
        </el-form-item> -->

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
import { ref, reactive, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { usePrisonStore } from "@/stores/prison";
import type { FormInstance, FormRules } from "element-plus";
import type {
  Prison,
  CreatePrisonRequest,
  UpdatePrisonRequest,
} from "@/types/prison";
import { useProvinceStore } from "@/stores/province";
import { useWardStore } from "@/stores/ward";

const route = useRoute();
const router = useRouter();
const prisonStore = usePrisonStore();
const provinceStore = useProvinceStore();
const wardStore = useWardStore();

// Reactive data
const formRef = ref<FormInstance>();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);

// const provinces = ref<Province[]>([]);
// const wards = ref<Ward[]>([]);

const { provinces, loading: loadingProvinces } = storeToRefs(provinceStore);
const { wards, loading: loadingWards } = storeToRefs(wardStore);

// const provinces = computed(() => provinceStore.provinces || []);
const form = reactive<Partial<Prison>>({
  code: "",
  name: "",
  address: "",
  capacity: 1,
  phone: "",
  isActive: true,
  currentPopulation: 0,
  deputyDirector: "",
  director: "",
  email: "",
  establishedDate: "",
  provinceId: "",
  updatedAt: "",
  wardId: "",
});

// Validation rules
const rules: FormRules = {
  code: [
    { required: true, message: "Vui lòng nhập mã trại giam", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "Mã trại giam phải từ 3-20 ký tự",
      trigger: "blur",
    },
  ],
  name: [
    { required: true, message: "Vui lòng nhập tên trại giam", trigger: "blur" },
    {
      min: 5,
      max: 100,
      message: "Tên trại giam phải từ 5-100 ký tự",
      trigger: "blur",
    },
  ],
  address: [
    { required: true, message: "Vui lòng nhập địa chỉ", trigger: "blur" },
  ],
  provinceId: [
    { required: true, message: "Vui lòng chọn tỉnh/thành", trigger: "change" },
  ],
  wardId: [
    { required: true, message: "Vui lòng chọn xã/phường", trigger: "change" },
  ],
  director: [
    { required: true, message: "Vui lòng nhập tên giám thị", trigger: "blur" },
  ],
  deputyDirector: [
    {
      required: true,
      message: "Vui lòng nhập tên phó giám thị",
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
    {
      pattern: /^[0-9]{10,11}$/,
      message: "Số điện thoại không hợp lệ",
      trigger: "blur",
    },
  ],
  capacity: [
    { required: true, message: "Vui lòng nhập sức chứa", trigger: "blur" },
    {
      type: "number",
      min: 1,
      message: "Sức chứa phải lớn hơn 0",
      trigger: "blur",
    },
  ],
  currentPopulation: [
    {
      required: true,
      message: "Vui lòng nhập số phạm nhân hiện tại",
      trigger: "blur",
    },
    {
      type: "number",
      min: 0,
      message: "Số phạm nhân không thể âm",
      trigger: "blur",
    },
  ],
  isActive: [
    { required: true, message: "Vui lòng chọn trạng thái", trigger: "change" },
  ],
};

const onProvinceChange = async (code: string) => {
  form.wardId = "";
  if (!code) {
    wardStore.clear();
    return;
  }
  try {
    await wardStore.getByProvinceCode(code);
  } catch {}
};

// Methods
const loadData = async () => {
  if (isEdit.value) {
    console.log(route.params.id);
    const prison = await prisonStore.fetchDetail(Number(route.params.id));
    console.log(prison);
    if (prison) {
      Object.assign(form, prison);
      console.log(form);
    } else {
      ElMessage.error("Không tìm thấy thông tin trại giam!");
      router.push("/prisons");
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

const getAllProvinces = async () => {
  await provinceStore.getAll();
};

const handleSubmit = async () => {
  try {
    // Check current inmates doesn't exceed capacity
    if ((form?.currentPopulation || 0) > (form?.capacity || 0)) {
      ElMessage.error("Số phạm nhân hiện tại không thể vượt quá sức chứa!");
      return;
    }

    formRef.value?.validate(async (valid) => {
      if (!valid) return;
      if (isEdit.value && form.id) {
        const payload: UpdatePrisonRequest = {
          code: form.code!,
          name: form.name!,
          address: form.address,
          capacity: form.capacity,
          currentPopulation: form.currentPopulation,
          deputyDirector: form.deputyDirector,
          director: form.director,
          phone: form.phone,
          isActive: form.isActive as any,
          provinceId: form.provinceId,
          wardId: form.wardId,
        };
        await prisonStore.updatePrison(form.id as number, payload);
      } else {
        const payload: CreatePrisonRequest = {
          code: form.code!,
          name: form.name!,
          address: form.address,
          capacity: form.capacity,
          currentPopulation: form.currentPopulation,
          deputyDirector: form.deputyDirector,
          director: form.director,
          phone: form.phone,
          isActive: form.isActive as any,
          provinceId: form.provinceId,
          wardId: form.wardId,
        };
        console.log(payload);
        await prisonStore.createPrison(payload);
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
      provinceId: "",
      wardId: "",
    });
  }
};

// watch(
//   () => form.provinceId,
//   async (code) => {
//     form.wardId = "";
//     if (!code) {
//       wardStore.clear();
//       return;
//     }
//     try {
//       await wardStore.getByProvinceCode(code);
//     } catch {}
//   }
// );
// watch(
//   () => form.provinceId,
//   async (code) => {
//     const prevWard = form.wardId;
//     form.wardId = "";

//     if (!code) {
//       wardStore.clear();
//       return;
//     }

//     try {
//       await wardStore.getByProvinceCode(code);
//       // Nếu đang edit và ward cũ hợp lệ trong danh sách mới → khôi phục
//       if (prevWard) {
//         const found = wardStore.wards?.find((w) => w.code === prevWard);
//         if (found) form.wardId = prevWard;
//       }
//     } catch {}
//   }
// );

onMounted(async () => {
  await getAllProvinces();

  await loadData();
  if (isEdit.value) {
    // Load wards for the selected province
    if (form.provinceId) {
      await wardStore.getByProvinceCode(form.provinceId);
    }
  }
});
</script>

<style scoped>
.prison-form {
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
