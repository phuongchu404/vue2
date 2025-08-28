<template>
  <div>
    <div class="search-form" style="padding-bottom: 19px">
      <header>{{ $t("Search") }}</header>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
        label-width="170px"
      >
        <el-form-item :label="$t('user.userName')">
          <el-input
            v-model="queryForm.userName"
            :placeholder="$t('user.userName')"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item align="right" style="margin-left: 220px">
          <el-button
            type="primary"
            @click="handleAdd"
            :disabled="isButtonEnabled('system:user:insert')"
            size="small"
          >
            <el-icon><Plus /></el-icon><span>{{ $t("option.add") }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-table" style="padding-bottom: 40px">
      <el-row :gutter="20">
        <el-table
          :data="filteredTableData"
          style="width: 97%; margin-top: 10px; margin-left: 20px"
          :row-class-name="tableRowClassName"
          align="center"
          border
        >
          <el-table-column
            type="index"
            prop="id"
            :label="$t('common.index')"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="userName"
            :label="$t('user.userName')"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="roles"
            :label="$t('user.roles')"
            :formatter="rolesFormatter"
          ></el-table-column>
          <el-table-column
            prop="realName"
            :label="$t('user.realName')"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('common.createTime')"
            width="180"
            :formatter="defaultTimeFormatter"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            :label="$t('common.updateTime')"
            width="180"
            :formatter="defaultTimeFormatter"
          ></el-table-column>
          <el-table-column :label="$t('common.option')" width="480">
            <template #default="{ row }">
              <el-button
                size="small"
                type="primary"
                class="normal-btn btn-bluelight"
                :disabled="isButtonEnabled('system:user:update')"
                @click="handleEdit(row)"
                >{{ $t("option.update") }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                class="normal-btn btn-greenlight"
                :disabled="
                  isButtonEnabled('system:user:assign-roles') ||
                  row.userName === userNameLogin ||
                  row.removable != '1'
                "
                @click="handleSelectRoles(row)"
                >{{ $t("user.allocateRole") }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                class="normal-btn btn-red"
                :disabled="
                  isButtonEnabled('system:user:reset-password') ||
                  row.userName === userNameLogin
                "
                @click="resetPassword(row)"
                >{{ $t("user.resetPassword") }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                class="normal-btn btn-red"
                :disabled="
                  isButtonEnabled('system:user:delete') ||
                  row.userName === userNameLogin ||
                  row.removable != '1'
                "
                @click="handleDelete(row)"
                >{{ $t("option.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <el-dialog
      :title="ui.addRecord ? $t('user.add') : $t('user.update')"
      v-model="ui.dialogVisible"
      width="40%"
      class="addDio"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="130px"
        ref="editFormRef"
        style="padding-right: 50px"
      >
        <input type="hidden" v-model="editForm.id" />
        <el-form-item :label="$t('user.userName')" prop="userName">
          <el-input
            v-model="editForm.userName"
            autofocus
            :readonly="!ui.addRecord"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.realName')" prop="realName">
          <el-input v-model="editForm.realName" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.dialogVisible = false">{{
            $t("common.cancel")
          }}</el-button>
          <el-button type="primary" @click="handleSaveOrUpdate()">{{
            $t("common.ok")
          }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="$t('ResetPassword')"
      v-model="ui.resetPassword"
      width="40%"
      class="addDio"
    >
      <el-form
        :model="password"
        :rules="passwordRules"
        label-width="130px"
        ref="passwordFormRef"
        style="padding-right: 50px"
      >
        <input type="hidden" v-model="editForm.id" />
        <el-form-item :label="$t('user.password')" prop="password">
          <el-input v-model="password.password" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.resetPassword = false">{{
            $t("common.cancel")
          }}</el-button>
          <el-button type="primary" @click="handleResetPassword()">{{
            $t("common.ok")
          }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="$t('user.selectRole')"
      width="35%"
      v-model="ui.rolesDialogVisible"
      @open="loadRolesDialogData"
      class="addDio"
    >
      <el-tree
        :data="allRoles"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultTreeProps"
        ref="rolesTreeRef"
        hightlight-current
      >
      </el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.rolesDialogVisible = false">{{
            $t("common.cancel")
          }}</el-button>
          <el-button type="primary" @click="handleRolesUpdate()">{{
            $t("common.ok")
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import * as Utils from "../../utils";

const { t } = useI18n();
const appStore = useAppStore();

// Refs
const editFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const rolesTreeRef = ref();

// Reactive data
const ui = reactive({
  loading: false,
  dialogVisible: false,
  addRecord: false,
  rolesDialogVisible: false,
  authentication: false,
  resetPassword: false,
});

const Provider = ref<any[]>([]);
const editForm = reactive({ id: "", userName: "", realName: "" });

const editFormRules = reactive({
  userName: [
    { required: true, message: t("user.inputUserName"), trigger: "blur" },
  ],
  realName: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
});

const passwordRules = reactive({
  password: [
    { required: true, message: t("user.inputUserName"), trigger: "blur" },
  ],
});

const password = reactive({ password: "", id: "" });
const userNameLogin = ref("");
const queryForm = reactive({ userName: "" });
const tableData = ref<any[]>([]);
const allRoles = ref<any[]>([]);
const defaultTreeProps = { label: "roleName", children: "children" };
const rolesEditForm = reactive({
  id: "",
  roles: [],
  userId: "",
  oldRoles: [""],
  selectedRoles: [],
});
const authentication = reactive({ password: "" });
const active = ref<number>(0);
const row = ref<any>(null);
const isEyes = ref(false);

// Computed
const filteredTableData = computed(() => {
  return tableData.value;
});

// Methods
const showPassword = () => {
  isEyes.value = !isEyes.value;
};

const resetPassword = async (rowData: any) => {
  ui.resetPassword = true;
  password.password = "";
  password.id = rowData.id;
};

const isButtonEnabled = (buttonName: string) => {
  const state = appStore.buttons.has(buttonName);
  return !state;
};

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 === 0) return "";
  return "warning-row";
};

const handleAdd = async () => {
  Utils.clearValidateForm(editFormRef.value);
  ui.dialogVisible = true;
  ui.addRecord = true;
  editForm.userName = "";
  editForm.realName = "";
  editForm.id = "";
};

const handleEdit = async (rowData: any) => {
  Utils.clearValidateForm(editFormRef.value);
  ui.dialogVisible = true;
  ui.addRecord = false;
  editForm.userName = rowData.userName;
  editForm.realName = rowData.realName;
  editForm.id = rowData.id;
};

const handleDelete = async (rowData: any) => {
  try {
    await ElMessageBox.confirm(t("common.deleteConfirm"), t("common.confirm"), {
      type: "warning",
    });
    const roleId = rowData.id;
    const result = await Utils.doDelete("/api/admin/users/" + roleId, {});
    if (!result.success) {
      ElMessage.warning(t("common.deleteFail") + t(result.message));
    } else {
      ElMessage.success(t("common.deleteSuccess"));
      loadTableData();
    }
  } catch {
    console.log("canceled.");
  }
};

const handleSaveOrUpdate = async () => {
  try {
    await editFormRef.value?.validate();
    if (ui.addRecord) {
      const record = editForm;
      const result = await Utils.doPost("/api/admin/users", record);
      if (!result.success) {
        ElMessage.warning(t("common.insertFail") + t(result.message));
      } else {
        ElMessage.success(t("common.insertSuccess"));
        ui.dialogVisible = false;
        loadTableData();
      }
    } else {
      const record = editForm;
      const result = await Utils.doPut("/api/admin/users/" + record.id, record);
      if (!result.success) {
        ElMessage.warning(t("common.updateFail") + t(result.message));
      } else {
        ElMessage.success(t("common.updateSuccess"));
        ui.dialogVisible = false;
        loadTableData();
      }
    }
  } catch {
    // Validation failed
  }
};

const loadTableData = async () => {
  const result = await Utils.doGet("/api/admin/users");
  if (result.success) {
    tableData.value = result.data.content;
  } else {
    ElMessage.warning(t("common.loadFail"));
  }
};

const rolesFormatter = (row: any, column: any) => {
  const roles = row.roles;
  const roleNames = roles.map((item: any) => {
    return item.roleName;
  });
  return roleNames.join(", ");
};

const defaultTimeFormatter = (row: any, column: any) => {
  const source = row[column.property];
  return Utils.formatDateString(source);
};

const handleSelectRoles = async (rowData: any) => {
  rolesEditForm.userId = rowData.id;
  allRoles.value = [];
  const oldRows = rowData.roles.map((item: any) => {
    return item.id;
  });
  rolesEditForm.oldRoles = oldRows;
  ui.rolesDialogVisible = true;
};

const handleResetPassword = async () => {
  try {
    await ElMessageBox.confirm(
      t("user.resetPasswordConfirm"),
      t("common.confirm"),
      { type: "warning" }
    );
    const result = await Utils.doPost("/api/admin/users/password", password);
    if (result.success) {
      ElMessage.info(t("user.resetPasswordSuccess") + result.data + "]");
      ui.resetPassword = false;
    } else {
      ElMessage.warning(t("user.resetPasswordFail") + t(result.message));
    }
  } catch {
    // User cancelled
  }
};

const loadAllRoles = async () => {
  const result = await Utils.doGet("/api/admin/roles");
  if (result.success) {
    allRoles.value = result.data.records;
  } else {
    ElMessage.warning(t("common.loadFail") + t(result.message));
  }
};

const loadRolesDialogData = async () => {
  await loadAllRoles();
  rolesTreeRef.value?.setCheckedKeys(rolesEditForm.oldRoles);
};

const handleRolesUpdate = async () => {
  const keys = rolesTreeRef.value?.getCheckedKeys();
  const oldRoles = rolesEditForm.oldRoles;
  if (keys.length === oldRoles.length) {
    const oldRolesSet = new Set(oldRoles);
    const diffArr = keys.filter((item: any) => {
      return !oldRolesSet.has(item);
    });
    if (diffArr.length === 0) {
      ui.rolesDialogVisible = false;
      ElMessage.info(t("common.noChange"));
      return;
    }
  }
  rolesEditForm.selectedRoles = keys;
  const result = await Utils.doPut(
    "/api/admin/userroles/" + rolesEditForm.userId,
    rolesEditForm
  );
  if (result.success) {
    ElMessage.success(t("common.updateSuccess"));
    loadTableData();
    ui.rolesDialogVisible = false;
  } else {
    ElMessage.warning(t("common.updateFail") + t(result.message));
  }
};

// Lifecycle
onMounted(async () => {
  await loadTableData();
  const userString = sessionStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString);
    userNameLogin.value = user.userName;
  }
});
</script>

<style scoped lang="scss">
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
</style>