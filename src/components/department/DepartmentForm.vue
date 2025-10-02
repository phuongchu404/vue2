<template>
  <div class="department-form">
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="150px"
        @submit.prevent="handleSubmit"
      >
        <el-divider content-position="left">{{
          t("department.section.basicInfo")
        }}</el-divider>
        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item :label="t('department.code')" prop="code">
              <el-input
                v-model="form.code"
                :placeholder="t('department.placeholder.code')"
                :disabled="isEdit"
                :maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12" :span="24">
            <el-form-item :label="t('department.name')" prop="name">
              <el-input
                v-model="form.name"
                :placeholder="t('department.placeholder.name')"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12" :span="24">
            <el-form-item
              :label="t('department.detentionCenter')"
              prop="detentionCenterId"
            >
              <el-select
                v-model="form.detentionCenterId"
                :placeholder="t('department.placeholder.detentionCenter')"
                filterable
                clearable
                @visible-change="onPrisonVisibleChange"
                remote
                :remote-method="remoteSearchPrison"
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
          <el-col :md="12" :span="24">
            <el-form-item :label="t('prison.status')" prop="isActive">
              <el-radio-group v-model="form.isActive">
                <el-radio label="ACTIVE" :value="true">{{
                  t("prison.active")
                }}</el-radio>
                <el-radio label="INACTIVE" :value="false">{{
                  t("prison.inactive")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('department.notes')">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            :placeholder="t('department.placeholder.notes')"
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitting"
            :disabled="
              isButtonEnabled(
                isEdit ? 'department:update' : 'department:insert'
              )
            "
          >
            {{ isEdit ? t("common.update") : t("common.add") }}
          </el-button>
          <el-button @click="handleReset">{{ t("common.reset") }}</el-button>
          <el-button @click="$router.go(-1)">{{
            t("common.cancel")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useDepartmentStore } from "@/stores/department";
import { usePrisonStore } from "@/stores/prison";
import { storeToRefs } from "pinia";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/types/department";
import { useI18n } from "vue-i18n";
import { useBaseMixin } from "@/components/BaseMixin.ts";
import {debounce} from "lodash";
import {useInfiniteSelect} from "@/composables/useInfiniteSelect.ts";

const route = useRoute();
const router = useRouter();
const departmentStore = useDepartmentStore();
const prisonStore = usePrisonStore();
const { prisons } = storeToRefs(prisonStore);
const { t } = useI18n();
const { isButtonEnabled } = useBaseMixin();

const formRef = ref<FormInstance>();
const submitting = ref(false);
const isEdit = computed(() => !!route.params.id);
const prisonPage = ref(1);
const prisonName = ref("");

const form = reactive<Partial<Department>>({
  code: "",
  name: "",
  detentionCenterId: undefined,
  description: "",
  isActive: true,
});

// Validation
const rules: FormRules = {
  // code: [{ required: true, message: "Vui lòng nhập mã phòng ban", trigger: "blur" }],
  name: [
    { required: true, message: t("department.validation.required.name"), trigger: "blur" },
  ],
  detentionCenterId: [
    { required: true, message: t("department.validation.required.detentionCenterId"), trigger: "change" },
  ],};

// Load prisons
onMounted(async () => {
  if (isEdit.value) {
    await loadData();
    if (form.detentionCenterId) {
      await prisonStore.loadForSelect({
        pageNo: prisonPage.value,
        pageSize: 10,
        name: prisonName.value,
      }, form.detentionCenterId, form.detentionCenterName);
    }
  } else {
    await getAllPrisons();
  }
});

const getAllPrisons = async () => {
  await prisonStore.fetchList({
    pageNo: prisonPage.value,
    pageSize: 10,
    name: prisonName.value,
  });
}

const loadMorePrison = () => {
  prisonPage.value = prisonPage.value + 1;
  prisonStore.fetchList({
    pageNo: prisonPage.value,
    pageSize: 10,
    name: prisonName.value,
  }, true);
};

const remoteSearchPrison = debounce(((text: string) => {
  if (!text && !prisonName.value) {
    return;
  }
  prisonPage.value = 1;
  prisonName.value = text;
  getAllPrisons();
}), 300);

const { onVisibleChange: onPrisonVisibleChange } = useInfiniteSelect(loadMorePrison);

const loadData = async () => {
  const department = await departmentStore.fetchDetail(Number(route.params.id));
  if (department) {
    Object.assign(form, department);
  } else {
    ElMessage.error(t("department.message.notFound"));
    router.push("/departments");
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    submitting.value = true;

    if (isEdit.value && form.id) {
      const payload: UpdateDepartmentRequest = {
        name: form.name,
        detentionCenterId: form.detentionCenterId,
        description: form.description,
        isActive: form.isActive,
      };
      await departmentStore.updateDepartment(form.id as number, payload);
    } else {
      const payload: CreateDepartmentRequest = {
        code: form.code,
        name: form.name,
        detentionCenterId: form.detentionCenterId,
        description: form.description,
        isActive: form.isActive,
      };
      await departmentStore.createDepartment(payload);
    }

    router.push("/department");
  } catch (error) {
    console.error(error);
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
      detentionCenterId: undefined,
      description: "",
      isActive: undefined,
    });
  }
};
</script>

<style scoped>
.department-form {
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}
</style>