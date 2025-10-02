<template>
  <div class="infinite-list-wrapper">
    <el-container class="layout-container">
      <!-- Header -->
      <el-header class="header">
        <div class="header-content">
          <div class="logo-section">
            <img
              src="../../assets/mk-logo.png"
              alt="MK Logo"
              class="logo-img"
            />
            <span class="logo-text">MK - Visitor Management</span>
          </div>

          <div class="header-right">
            <div class="userinfo">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link userinfo-inner">
                  <img
                    src="../../assets/user2.png"
                    alt="User Avatar"
                    class="user-avatar"
                  />
                  {{ sysUserName }}
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleChangePassword">
                      <el-icon><Edit /></el-icon>{{ $t("home.funPassword") }}
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="logout">
                      <el-icon><SwitchButton /></el-icon
                      >{{ $t("home.funLogout") }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div class="language-section">
              <app-language></app-language>
            </div>
          </div>
        </div>
      </el-header>

      <el-container class="main-container">
        <!-- Sidebar -->
        <el-aside width="auto" class="sidebar">
          <el-menu
            :default-active="activeMenu"
            unique-opene
            text-color="#7f8c8d"
            router
            class="sidebar-menu"
          >
            <template v-for="(item, index) in allMenus" :key="item.tag">
              <el-sub-menu
                :index="String(index)"
                v-if="!item.leaf && !item.hidden"
              >
                <template #title>
                  <el-icon v-if="item.icon">
                    <component :is="item.icon" />
                  </el-icon>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :index="child.path"
                  :key="child.tag"
                >
                  <el-icon v-if="child.icon">
                    <component :is="child.icon" />
                  </el-icon>
                  <template #title>{{ child.name }}</template>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item
                v-if="item.leaf && !item.hidden"
                :index="item.path"
                :key="item.tag"
              >
                <el-icon v-if="item.icon">
                  <component :is="item.icon" />
                </el-icon>
                <template #title>{{ item.name }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <!-- Main Content -->
        <el-main class="main-content">
          <div class="content-wrapper">
            <!-- Breadcrumb -->
            <!-- <div class="breadcrumb-section">
              {{ $route.name }}
            </div> -->
            <!-- Router View -->
            <div class="router-view-container">
              <el-page-header @back="$router.go(-1)" :title="t('common.back')">
                <template #content>
                  <span class="text-large font-600 mr-3">
                    {{ $t(`route.${$route.meta?.title || $route.name}`) }}
                  </span>
                </template>
              </el-page-header>
              <RouterView v-slot="{ Component }">
                <Transition name="fade" mode="out-in">
                  <component :is="Component" />
                </Transition>
              </RouterView>
            </div>

            <!-- Footer -->
            <div class="footer-section">
              <app-footer />
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- Change Password Dialog -->
    <el-dialog
      :title="$t('home.funPassword')"
      v-model="ui.dialogVisible"
      width="650px"
      center
      class="change-password-dialog dialog"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="190px"
        label-position="right"
        size="default"
        ref="editFormRef"
      >
        <el-form-item :label="$t('home.passwordOld')" prop="oldPassword">
          <el-input
            type="password"
            v-model="editForm.oldPassword"
            clearable
            class="edit-form-input"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('home.passwordNew')" prop="newPassword">
          <el-input
            type="password"
            v-model="editForm.newPassword"
            clearable
            class="edit-form-input"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('home.passwordRepeat')"
          prop="newPasswordAgain"
        >
          <el-input
            type="password"
            v-model="editForm.newPasswordAgain"
            clearable
            class="edit-form-input"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.dialogVisible = false">
            {{ $t("common.cancel") }}
          </el-button>
          <el-button type="primary" @click="changePassword()">
            {{ $t("common.ok") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import {
  Edit,
  SwitchButton,
  HomeFilled,
  User,
  Setting,
  Document,
  Avatar,
  List,
} from "@element-plus/icons-vue";
import * as utils from "../../utils";
import * as nav from "../../common/nav";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

// Refs
const editFormRef = ref<FormInstance>();

// Reactive data
const allMenus = ref<any[]>([]);
const sysUserName = ref("");
const sysUserAvatar = ref("");

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const editForm = reactive<any>({});

const editFormRules = reactive({
  oldPassword: [
    { required: true, message: t("home.oldIsNull"), trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: t("home.newIsNull"), trigger: "blur" },
  ],
  newPasswordAgain: [
    { required: true, message: t("home.repeatNew"), trigger: "blur" },
    { validator: validatePasswordAgain, trigger: "blur" },
  ],
});

const ui = reactive({
  dialogVisible: false,
});

// Methods
function validatePasswordAgain(rule: any, value: any, callback: any) {
  if (value === "") {
    callback(new Error(t("home.repeatNew")));
  } else if (value !== editForm.newPassword) {
    callback(new Error(t("home.notSame")));
  } else if (value === editForm.oldPassword) {
    callback(new Error(t("home.isSame")));
  } else {
    callback();
  }
}

const getIconComponent = (iconClass: string) => {
  const iconMap: { [key: string]: any } = {
    "el-icon-fa-home": HomeFilled,
    "el-icon-fa-user": User,
    "el-icon-fa-users": User,
    "el-icon-fa-cogs": Setting,
    "el-icon-s-custom": User,
    "el-icon-s-data": Document,
    "el-icon-postcard": Document,
  };
  return iconMap[iconClass] || Document;
};

const activeMenu = computed(() => route.meta.activeMenu || route.path)

const handleChangePassword = async () => {
  editFormRef.value?.resetFields();
  Object.assign(editForm, {});
  ui.dialogVisible = true;
};

const changePassword = async () => {
  try {
    await editFormRef.value?.validate();

    try {
      await ElMessageBox.confirm(
        t("home.changePasswordConfirm"),
        t("home.confirmTip"),
        {
          type: "warning",
          confirmButtonText: t("common.confirm"),
          cancelButtonText: t("el.messagebox.cancel"),
        }
      );

      const record = editForm;
      const result = await utils.doPost("/api/sessions/passwordchange", record);

      if (!result.success) {
        if (result.code === 302) {
          ElMessage.warning(t("user.incorrectpassword"));
        } else {
          ElMessage.warning(t("home.passwordFail") + result.message);
        }
      } else {
        ElMessage.success(t("home.passwordSuccess"));
        ui.dialogVisible = false;
        forceLogout();
      }
    } catch {
      // User cancelled confirmation
    }
  } catch {
    // Form validation failed
  }
};

const forceLogout = async () => {
  sessionStorage.removeItem("TOKEN");
  sessionStorage.removeItem("user");
  router.push("/login");
};

const logout = async () => {
  try {
    await ElMessageBox.confirm(t("home.logoutMessage"), t("home.confirmTip"), {
      type: "warning",
      confirmButtonText: t("common.confirm"),
      cancelButtonText: t("el.messagebox.cancel"),
    });

    sessionStorage.removeItem("TOKEN");
    sessionStorage.removeItem("user");
    router.push("/login");
  } catch {
    // User cancelled
  }
};

const loadAllMenus = async () => {
  const result = await utils.doGet("/api/sessions/permissions");
  if (result.success) {
    allMenus.value = result.data;
  }

  const availButtons: string[] = [];
  for (let i = 0; i < allMenus.value.length; i++) {
    const menu: any = allMenus.value[i];
    if (menu.children) {
      const buttons = menu.children;
      for (let k = 0; k < buttons.length; k++) {
        availButtons.push(buttons[k].tag);
      }
    }
    if (menu.children) {
      for (let j = 0; j < menu.children.length; j++) {
        const child = menu.children[j];
        if (child.children) {
          const buttons = child.children;
          for (let k = 0; k < buttons.length; k++) {
            availButtons.push(buttons[k].tag);
          }
        }
      }
    }
  }
  appStore.setButtons(new Set(availButtons));
};

const availButtons = async () => {
  const result = await utils.doGet("/api/sessions/permission/tag");
  let availableTags: string[] = [];

  if (result.success) {
    availableTags = result.data;
    const menus: any = nav.getNavData();
    hiddenMenus(menus, availableTags);
    allMenus.value = menus;
  }

  appStore.setButtons(new Set(availableTags));
};

const hiddenMenus = (menus: any[], tags: string[]) => {
  for (const menu of menus) {
    if (menu.isWhiteList) {
      menu.hidden = false;
    } else {
      menu.hidden = !compareTag(menu.tag, tags);
    }
    if (menu.children) {
      hiddenMenus(menu.children, tags);
    }
  }
};

const compareTag = (tag: string, tags: string[]) => {
  return tags.includes(tag);
};

// Lifecycle
onMounted(() => {
  const userString = sessionStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString);
    sysUserName.value = user.realname || user.userName;
    sysUserAvatar.value = user.avatar || "";
  }
  availButtons();
});
</script>

<style scoped>
/* Container chính */
.infinite-list-wrapper {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100vh;
}

/* Header */
.header {
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  height: 60px !important;
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  color: #115484;
}

.logo-img {
  height: 40px;
  width: 130px;
  margin-right: 15px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.userinfo-inner {
  color: #115484;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

/* Main Container */
.main-container {
  height: calc(100vh - 60px);
  background: var(--linear-primary-color);
}

/* Sidebar */
.el-menu {
  background: var(--light-primary-color) !important;
  color: var(--text-color);
  padding: 10px;
  border-right: none;
  margin: 20px 0 0 10px;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Normal menu items & submenu titles */
.el-menu-item,
.el-sub-menu {
  color: var(--text-color) !important;
  border-radius: 10px;
  font-weight: 600 !important;
}

/* Active state */
.el-menu-item.is-active,
.el-submenu__title.is-active {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--dark-primary-color) 100%
  ) !important;
  color: var(--white) !important;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Icon colors */
.el-menu-item i,
.el-submenu__title i {
  color: var(--text-color) !important;
}

.el-menu-item.is-active i,
.el-submenu__title.is-active i {
  color: var(--white) !important;
}

/* Main Content */
.main-content {
  background: transparent;
  padding: 0;
  overflow-y: auto;
}

.content-wrapper {
  padding: 20px;
  min-height: calc(100vh - 60px);
  background: transparent;
}

.breadcrumb-section {
  background: #ffffff;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.router-view-container {
  background: #ffffff;
  border-radius: 10px;
  min-height: 60vh;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.footer-section {
  text-align: center;
  padding: 20px 0;
  color: #9ea7b4;
  margin-top: 20px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dialog */
.change-password-dialog {
  .el-dialog__header {
    padding: 15px 20px;
    background: #115484;
  }

  .el-dialog__title {
    color: #ffffff;
    font-size: 17px;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
}

.edit-form-input {
  width: 350px;
}

/* Responsive */
@media (max-width: 768px) {
  .logo-text {
    display: none;
  }

  .header-content {
    padding: 0 10px;
  }

  .content-wrapper {
    padding: 10px;
  }
}
</style>
