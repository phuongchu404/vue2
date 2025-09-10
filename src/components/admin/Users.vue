<template>
  <div>
    <div class="search-section">
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
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch"
            :disabled="isButtonEnabled('system:user:select')"
            size="mini"
            :icon="Search"
          >
            {{ $t("option.query") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleAdd"
            :disabled="isButtonEnabled('system:user:insert')"
          >
            <el-icon><Plus /></el-icon><span>{{ $t("option.add") }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="users"
      align="center"
      border
    >
      <el-table-column
        type="index"
        prop="id"
        :label="$t('common.index')"
        width="85"
      ></el-table-column>
      <el-table-column
        prop="userName"
        :label="$t('user.userName')"
        min-width="80" show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="roles"
        :label="$t('user.roles')"
        :formatter="rolesFormatter" show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="realName"
        :label="$t('user.realName')" show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        :label="$t('common.createTime')"
        width="180"
        :formatter="defaultTimeFormatter" show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        :label="$t('common.updateTime')"
        width="180"
        :formatter="defaultTimeFormatter" show-overflow-tooltip
      ></el-table-column>
      <el-table-column fixed="right" :label="$t('common.option')" width="500">
        <template #default="scope">
          <el-button
            type="primary"
            :disabled="isButtonEnabled('system:user:update')"
            @click="handleEdit(scope.row)"
            >{{ $t("option.update") }}
          </el-button>
          <el-button
            type="success"
            :disabled="
              isButtonEnabled('system:user:assign-roles') ||
              scope.row.userName === userNameLogin ||
              scope.row.removable != '1'
            "
            @click="handleSelectRoles(scope.row)"
            >{{ $t("user.allocateRole") }}
          </el-button>
          <el-button
            type="warning"
            :disabled="
              isButtonEnabled('system:user:reset-password') ||
              scope.row.userName === userNameLogin
            "
            @click="resetPassword(scope.row)"
            >{{ $t("user.resetPassword") }}
          </el-button>
          <el-button
            type="danger"
            :disabled="
              isButtonEnabled('system:user:delete') ||
              scope.row.userName === userNameLogin ||
              scope.row.removable != '1'
            "
            @click="handleDelete(scope.row.id)"
            >{{ $t("option.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="userStore.getTotal"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="pagination"
    />

    <el-dialog
      :title="ui.addRecord ? $t('user.add') : $t('user.update')"
      v-model="ui.dialogVisible"
      width="40%"
      class="dialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="130px"
        ref="formRef"
      >
        <el-form-item :label="$t('user.userName')" prop="userName">
          <el-input
            v-model="form.userName"
            autofocus
            :readonly="!ui.addRecord"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.realName')" prop="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.email')" prop="mail">
          <el-input v-model="form.mail" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.phoneNumber')" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.description')" >
          <el-input type="textarea" v-model="form.description" ></el-input>
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
      class="dialog"
    >
      <el-form
        :model="password"
        :rules="passwordRules"
        label-width="130px"
        ref="passwordFormRef"
      >
        <el-form-item :label="$t('user.password')" prop="password">
          <el-input v-model="password.password" type="password" show-password></el-input>
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
      class="dialog"
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
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import * as Utils from "../../utils";
import {
  Search,
  Refresh,
  Plus,
  Download,
  View,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import type { PageQuery, User, ResetPassword, CreateUserRequest, UpdateUserRequest } from "@/types/user";
import type { Role } from "@/types/role";
import type {UpdateRoleByUserIdRequest} from "@/types/userRole";
import { useRoleStore } from "@/stores/role";
import { useUserRoleStore } from "@/stores/userRole";
import { useMessage } from '@/composables/useMessage';

const { messageInfoPassword } = useMessage();

const { t } = useI18n();
const appStore = useAppStore();
const userStore = useUserStore();
const roleStore = useRoleStore();
const userRoleStore = useUserRoleStore();

// Refs
const formRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const rolesTreeRef = ref();
const users = ref<User[]>([]);
const page = ref(1);
const size = ref(10);
const loading = ref(false);
const userNameLogin = ref("");
const allRoles = ref<Partial<Role>[]>([]);

// Reactive data
const ui = reactive({
  loading: false,
  dialogVisible: false,
  addRecord: false,
  rolesDialogVisible: false,
  authentication: false,
  resetPassword: false,
});
const password = reactive<Partial<ResetPassword>>({
  password: "",
  id: "",
});
const queryForm = reactive({ userName: "" });
const defaultTreeProps = { label: "roleName", children: "children" };
const rolesForm = reactive({
  id: "",
  roles: [],
  userId: undefined,
  oldRoles: [""],
  selectedRoles: [],
});
const form = reactive<Partial<User>>({ 
  id: undefined, 
  userName: "", 
  realName: "",
  mail: "",
  phoneNumber: "",
  description: "", });

  // Rules
const rules:FormRules = {
  userName: [
    { required: true, message: t("user.inputUserName"), trigger: "blur" },
  ],
  realName: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
};

const passwordRules:FormRules = {
  password: [
    { required: true, message: t("user.inputUserName"), trigger: "blur" },
  ],
};

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

const resetPassword = async (rowData: any) => {
  ui.resetPassword = true;
  password.password = "";
  password.id = rowData.id;
};

const isButtonEnabled = (buttonName: string) => {
  const state = appStore.buttons.has(buttonName);
  return !state;
};


const handleAdd = async () => {
  // Utils.clearValidateForm(formRef.value);
  ui.dialogVisible = true;
  ui.addRecord = true;
  Object.assign(form, {
    id: undefined,
    userName: "",
    realName: "",
    mail: "",
    phoneNumber: "",
    description: "",
  });
};

const handleEdit = async (rowData: any) => {
  ui.dialogVisible = true;
  ui.addRecord = false;
  Object.assign(form, rowData);
};
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(t("common.deleteConfirm"), t("common.confirm"), {
      type: "warning",
    });
    await userStore.deleteUser(id);
    await loadTableData();
  } catch {
    console.log("canceled.");
  }
};

const handleSaveOrUpdate = async () => {
  try {
    await formRef.value?.validate(async (valid) => {
      if (!valid) return;
      if (ui.addRecord) {
        const payload: CreateUserRequest = { ...form };
        let result:string | undefined = await userStore.createUser(payload);
        if(userStore.getSuccess) {
          messageInfoPassword(
            `<span>${t(
              "user.resetPasswordSuccess"
            )} <span style="color: red;">${result}</span></span>`
          );
          ui.dialogVisible = false;
        }
    } else {
      const payload: UpdateUserRequest = { ...form };
      await userStore.updateUser(form.id as number, payload);
      if(userStore.getSuccess) {
        ui.dialogVisible = false;
      }
    }
    await  loadTableData();
    });
    
  } catch {
    // Validation failed
  }
};

const loadTableData = async (extra?: Partial<PageQuery>) => {
  try {
    loading.value = true;

    const request = {
      pageNo: page.value,
      pageSize: size.value,
      userName: queryForm.userName?.trim() ?? null,
      ...extra,
    } as PageQuery;
    console.log(request);
    await userStore.listPage(request);

    users.value = userStore.getUsers || [];
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
  rolesForm.userId = rowData.id;
  allRoles.value = [];
  const oldRows = rowData.roles.map((item: any) => {
    return item.id;
  });
  rolesForm.oldRoles = oldRows;
  ui.rolesDialogVisible = true;
};

const handleResetPassword = async () => {
  try {
    await ElMessageBox.confirm(
      t("user.resetPasswordConfirm"),
      t("common.confirm"),
      { type: "warning" }
    );
    await userStore.resetPassword(password);
    if (userStore.getSuccess) {
      ui.resetPassword = false;
    }
  } catch {
    // User cancelled
  }
};

const loadAllRoles = async () => {
  await roleStore.getAll();
  if(roleStore.getRoles) {
    allRoles.value = roleStore.getRoles;
  }
};

const loadRolesDialogData = async () => {
  await loadAllRoles();
  rolesTreeRef.value?.setCheckedKeys(rolesForm.oldRoles);
};

const handleRolesUpdate = async () => {
  const keys = rolesTreeRef.value?.getCheckedKeys();
  const oldRoles = rolesForm.oldRoles;
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
  rolesForm.selectedRoles = keys;
  const payload: UpdateRoleByUserIdRequest = { ...rolesForm };
  if (rolesForm.userId !== undefined && rolesForm.userId !== null) {
  await userRoleStore.updateRoleByUserId(rolesForm.userId as number, payload);
} 
  if (userRoleStore.getSuccess) {
    
    ui.rolesDialogVisible = false;
  } 
  await loadTableData();
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
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
