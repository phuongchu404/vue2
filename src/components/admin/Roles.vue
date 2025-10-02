<template>
  <div>
    <!--Query Form  -->
    <div class="search-section">
      <!-- <header>{{ t("Search") }}</header> -->
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
        label-width="170px"
      >
        <el-form-item :label="t('role.roleName')">
          <el-input
            v-model="queryForm.roleName"
            :placeholder="t('role.roleName')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch"
            :disabled="isButtonEnabled('system:role:search')"
            :icon="Search"
          >
            {{ t("option.query") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-card">
      <div class="action-bar">
        <div>
          <el-button
            type="primary"
            @click="handleAdd()"
            :icon="Plus"
            :disabled="isButtonEnabled('system:role:insert')"
          >
            {{ t("common.add") }}
          </el-button>
          <el-button
            type="success"
            @click="handleSynchronizePermission()"
            :icon="Refresh"
            :disabled="isButtonEnabled('system:role:sync-permission')"
          >
            {{ t("option.syn") }}
          </el-button>
        </div>
        <div class="result-info">
          {{ t("common.total") }}: {{ roleStore.getTotal }}
          {{ t("common.unit") }}
        </div>
      </div>
    </div>

    <el-table
      :data="roles"
      :row-class-name="tableRowClassName"
      v-loading="roleStore.getLoading"
      align="center"
      border
    >
      <el-table-column
        type="index"
        prop="id"
        :label="t('common.index')"
        width="90"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        :label="t('role.roleName')"
        min-width="80"
      ></el-table-column>
      <el-table-column
        prop="description"
        :label="t('role.description')"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        :label="t('common.createTime')"
        width="230"
        :formatter="defaultTimeFormatter"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        :label="t('common.updateTime')"
        width="230"
        :formatter="defaultTimeFormatter"
      ></el-table-column>
      <el-table-column
        :label="t('common.option')"
        width="200"
        fixed="right"
        class-name="sticky"
      >
        <template #default="{ row }">
          <el-tooltip
            class="item"
            :hide-after="0"
            effect="light"
            :content="t('option.update')"
          >
            <el-button
              type="primary"
              @click="handleEdit(row)"
              :disabled="isButtonEnabledByUser(row, 'system:role:update')"
              icon="Edit"
            >
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            :hide-after="0"
            effect="light"
            :content="t('common.authorize')"
          >
            <el-button
              type="success"
              @click="handleAuthorize(row)"
              :disabled="
                isButtonEnabledByUser(row, 'system:role:assign-permission')
              "
              icon="Finished"
            >
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            :hide-after="0"
            effect="light"
            :content="t('option.delete')"
          >
            <el-button
              type="danger"
              @click="handleDelete(row)"
              :disabled="isButtonEnabledByUser(row, 'system:role:delete')"
              icon="Delete"
            >
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-config-provider :locale="localePagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="size"
        :total="roleStore.getTotal"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="pagination"
      />
    </el-config-provider>
    <el-dialog
      :title="ui.addRecord ? t('role.add') : t('role.update')"
      v-model="ui.dialogVisible"
      width="40%"
      class="dialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        style="padding-right: 50px"
        ref="formRef"
      >
        <el-form-item :label="t('role.roleName')" prop="roleName">
          <el-input
            v-model="form.roleName"
            autofocus
            :disabled="!ui.addRecord"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('role.description')" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.dialogVisible = false">{{
            t("common.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="handleSaveOrUpdate()"
            :disabled="
              isButtonEnabled(
                ui.addRecord ? 'system:role:insert' : 'system:role:update'
              )
            "
            >{{ t("common.ok") }}</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="t('common.authorize')"
      v-model="ui.permsDialogVisible"
      @open="loadPermsDialogData"
      class="dialog"
    >
      <el-row :gutter="20">
        <el-col :push="15" style="margin-bottom: 10px">
          <el-button @click="selectAll()" class="button-no-focus"
            >{{ t("common.select-all") }}
          </el-button>
          <el-button @click="selectNone()" class="button-no-focus"
            >{{ t("common.select-none") }}
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <div class="permsTree">
          <el-tree
            :data="allPermissions"
            show-checkbox
            default-expand-all
            node-key="tag"
            ref="treeRef"
            :props="defaultTreeProps"
            :default-checked-keys="['index', 'session:all']"
          >
          </el-tree>
        </div>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.permsDialogVisible = false">{{
            t("common.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="handlePermsUpdate()"
            :disabled="isButtonEnabled('system:role:assign-permission')"
            >{{ t("common.ok") }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores";
import { useI18n } from "vue-i18n";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import * as Utils from "../../utils";
import * as nav from "../../common/nav";
import {
  Search,
  Refresh,
  Plus,
  Download,
  View,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import type {
  PageQuery,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/types/role";
import type { UpdatePermissionByRoleIdRequest } from "@/types/rolePermission";
import { useRoleStore } from "@/stores/role";
import { useRolePermissionStore } from "@/stores/rolePermission";
import { usePermissionStore } from "@/stores/permission";
import { useBaseMixin } from "@/components/BaseMixin";
import { useLocalePagination } from "@/composables/useLocalePagination";
import { role } from "@/common/menu/system/role";

const { t } = useI18n();
const { isButtonEnabled } = useBaseMixin();
const appStore = useAppStore();
const roleStore = useRoleStore();
const rolePermissionStore = useRolePermissionStore();
const permissionStore = usePermissionStore();
const { localePagination } = useLocalePagination();

// Refs
const formRef = ref<FormInstance>();
const treeRef = ref();
const page = ref(1);
const size = ref(10);
const loading = ref(false);
const roles = ref<Role[]>([]);

// Reactive data
const ui = reactive({
  loading: false,
  dialogVisible: false,
  addRecord: false,
  permsDialogVisible: false,
  authentication: false,
});
const tableData = ref<any[]>([]);
const queryForm = reactive({ roleName: "" });
const form = reactive<Partial<Role>>({
  id: undefined,
  roleName: "",
  description: "",
});
const rules: FormRules = {
  roleName: [
    { required: true, message: t("role.inputRoleName"), trigger: "blur" },
  ],
};

const disablePermissions = ref<any[]>([]);
const authentication = reactive({ password: "" });
const defaultTreeProps = { label: "name", children: "children" };
const allPermissions = ref<any[]>([]);
const permsForm = reactive({
  roleId: undefined,
  oldPerms: [] as string[],
  selectedPermissions: [] as string[],
});
const active = ref<number>(0);
const row = ref<any>(null);
const Permissions = ref<any[]>([]);

// Computed

// Methods
const onPageChange = (p: number) => {
  page.value = p;
  loadTableData();
};
const onSizeChange = (s: number) => {
  size.value = s;
  loadTableData();
};
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 === 0) return "";
  return "warning-row";
};

const isButtonEnabledByUser = (rowData: any, buttonName: string) => {
  if (!rowData.removable && buttonName === "system:role:delete") return true;
  if (!rowData.removable && buttonName === "system:role:assign-permission")
    return true;
  if (!rowData.removable && buttonName === "system:role:update") return true;
  const disabled = appStore.buttons.has(buttonName);
  return !disabled;
};

const selectAll = () => {
  const permissions = nav.getPermissions();
  const data: any[] = [];
  for (const value of permissions) {
    data.push(value.tag);
  }
  treeRef.value?.setCheckedKeys(data);
};

const selectNone = () => {
  treeRef.value?.setCheckedKeys(["session:all"]);
};

const loadTableData = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    const request = {
      pageNo: page.value,
      pageSize: size.value,
      roleName: queryForm.roleName?.trim() ?? null,
      ...extra,
    } as PageQuery;
    await roleStore.listPage(request);

    roles.value = roleStore.getRoles || [];
  } catch (error) {
    ElMessage.error("Có lỗi xảy ra khi tải danh sách người dùng!");
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  page.value = 1;
  loadTableData({ pageNo: 1 });
};

const defaultTimeFormatter = (row: any, column: any) => {
  const source = row[column.property];
  return Utils.formatDateString(source);
};

const handleAdd = async () => {
  ui.dialogVisible = true;
  ui.addRecord = true;
  Object.assign(form, {
    id: undefined,
    roleName: "",
    description: "",
  });
};

const handleEdit = async (rowData: any) => {
  ui.dialogVisible = true;
  ui.addRecord = false;
  Object.assign(form, rowData);
};

const handleDelete = async (rowData: any) => {
  try {
    await ElMessageBox.confirm(t("common.deleteConfirm"), t("common.confirm"), {
      type: "warning",
      confirmButtonText: t("common.confirm"),
      cancelButtonText: t("el.messagebox.cancel"),
    });
    await roleStore.deleteRole(rowData.id as number);
    await loadTableData();
  } catch {
    // User cancelled
  }
};

const handleSaveOrUpdate = async () => {
  try {
    await formRef.value?.validate(async (valid) => {
      if (!valid) return;
      if (ui.addRecord) {
        const payload: CreateRoleRequest = { ...form };
        await roleStore.createRole(payload);
        if (roleStore.getSuccess) {
          ui.dialogVisible = false;
        }
      } else {
        const payload: UpdateRoleRequest = { ...form };
        await roleStore.updateRole(form.id as number, payload);
        if (roleStore.getSuccess) {
          ui.dialogVisible = false;
        }
      }
      await loadTableData();
    });
  } catch {
    // Validation failed
  }
};

const handleAuthorize = async (rowData: any) => {
  permsForm.roleId = rowData.id;
  allPermissions.value = [];
  ui.permsDialogVisible = true;
  authentication.password = "";
};

const loadPermsDialogData = async () => {
  await permissionStore.getAllMenus();
  const permissions: any = nav.getPermissionTree(
    permissionStore.getPermissions
  );
  allPermissions.value = permissions;
  const selectedPermissions = await loadAllPermsByRoleId(permsForm.roleId);
  treeRef.value?.setCheckedKeys(selectedPermissions);
};

const handlePermsUpdate = async () => {
  const checkedKeys = treeRef.value?.getCheckedKeys() || [];
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || [];
  let keys = checkedKeys.concat(halfCheckedKeys);

  const permissionMapping = nav.createMenuPermissionMapping();

  const autoIncludedApiPermissions = [];
  for (const key of keys) {
    if (permissionMapping.has(key)) {
      autoIncludedApiPermissions.push(...permissionMapping.get(key));
    }
  }

  keys = [...new Set([...keys, ...autoIncludedApiPermissions])];

  const oldPerms = permsForm.oldPerms;
  if (keys.length === oldPerms.length) {
    const oldPermsSet = new Set(oldPerms);
    const diffArr = keys.filter((item: any) => {
      return !oldPermsSet.has(item);
    });
    if (diffArr.length === 0) {
      ui.permsDialogVisible = false;
      ElMessage.info(t("common.noChange"));
      return;
    }
  }
  permsForm.selectedPermissions = keys;
  const payload: UpdatePermissionByRoleIdRequest = { ...permsForm };
  if (permsForm.roleId !== undefined && permsForm.roleId !== null) {
    await rolePermissionStore.updatePermissionByRoleId(
      permsForm.roleId as number,
      payload
    );
  }
  if (rolePermissionStore.getSuccess) {
    ElMessage.success(t("common.updateSuccess"));
    ui.permsDialogVisible = false;
  }
  await loadTableData();
};

const handleSynchronizePermission = async () => {
  await permissionStore.synchronize(nav.getPermissions());
  // const result = await Utils.doPost(
  //   "/api/admin/permissions",
  //   nav.getPermissions()
  // );
  // if (result.success) {
  //   ElMessage.success(t("common.updateSuccess"));
  // } else {
  //   ElMessage.warning(t("common.updateFail") + t(result.message));
  // }
};

const loadAllPermsByRoleId = async (roleId: any) => {
  await rolePermissionStore.getPermissionByRoleId(roleId);
  if (rolePermissionStore.getSuccess) {
    const oldPerms = buildOldPerms(rolePermissionStore.getPermissions);
    permsForm.oldPerms = oldPerms;
    disablePermissions.value = buildDisabledPerms(
      rolePermissionStore.getPermissions
    );
    return oldPerms;
  }
  return [];
};

const buildOldPerms = (data: any) => {
  const perms = [];
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      perms.push(data[i].tag);
    }
  }
  if (perms.length === 0) {
    perms.push("session:all");
  }
  return perms;
};

const buildDisabledPerms = (data: any) => {
  const perms = [];
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].removable === 0) {
        perms.push(data[i].tag);
      }
    }
  }
  return perms;
};

// Lifecycle
onMounted(async () => {
  await loadTableData();
});
</script>

<style scoped lang="scss">
.page-container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 20px;
}
.compact-form {
  margin: 0px;
}

.compact-button {
  padding: 0px;
  margin: 0px;
}

.danger {
  color: red;
}

.danger:disabled {
  color: #bfcbd9;
}

.permsTree {
  width: 100%;
  height: 50vh;
  overflow-y: auto; /* auto mượt hơn scroll cứng */
  display: flex;
  justify-content: center; /* Căn giữa ngang */
  padding: 10px 0; /* Tạo khoảng cách trên dưới */
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
