<template>
  <div class="infinite-list-wrapper" style="overflow:auto">
    <el-row class="container">
      <el-col :span="24" class="header">
        <el-col :span="19" class="logo" style="color: #115484">
          <img src="../../assets/mk-logo.png"
               style="height: 40px; width: 130px; padding-left: 50px;padding-right: 30px"/>
          <span style="margin-top:5px;color: #115484;font-size: 26px;font-family: Roboto-Bold;">MK - Visitor Management</span>
        </el-col>
        <el-col :span="2" class="userinfo">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link userinfo-inner" style="color: #115484;font-size: 16px">
              <img src="../../assets/user2.png" style="width: 35px; height: 35px;"> {{ sysUserName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleChangePassword">
                  <el-icon><Edit /></el-icon>{{ $t("home.funpwd") }}
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <el-icon><SwitchButton /></el-icon>{{ $t("home.funlogout") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
        <el-col :span="2" class="language">
          <app-language></app-language>
        </el-col>
      </el-col>

      <el-col :span="24" class="main">
        <aside>
          <el-menu 
            :default-active="$route.path" 
            unique-opened 
            @open="handleopen" 
            @close="handleclose"
            @select="handleselect" 
            background-color="#09446d"
            text-color="#D6E4E5" 
            active-text-color="#fd6d21" 
            router>
            <template v-for="(item,index) in allMenus" :key="item.tag">
              <el-sub-menu :index="String(index)" v-if="!item.leaf && !item.hidden">
                <template #title>
                  <el-icon v-if="item.icon"><component :is="getIconComponent(item.icon)" /></el-icon>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item 
                  v-for="child in item.children" 
                  :index="child.path" 
                  v-if="!child.hidden" 
                  :key="child.tag">
                  <el-icon v-if="child.icon"><component :is="getIconComponent(child.icon)" /></el-icon>
                  <template #title>{{ child.name }}</template>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-if="item.leaf && !item.hidden" :index="item.path" :key="item.tag">
                <el-icon v-if="item.icon"><component :is="getIconComponent(item.icon)" /></el-icon>
                <template #title>{{ item.name }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </aside>
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="Breadcrumb">
              {{ $route.name }}
            </el-col>
            <el-col :span="24" class="content-wrapper">
              <transition>
                <router-view>
                  {{ $t("home.userinfo") }}
                </router-view>
              </transition>
            </el-col>
            <el-col :span="24" class="footer">
              <app-footer></app-footer>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
    
    <el-dialog :title="$t('home.funpwd')" v-model="ui.dialogVisible" width="650px" center class="addDio">
      <el-form :model="editForm" :rules="editFormRules" label-width="190px" label-position="right" size="default"
               ref="editFormRef">
        <el-form-item :label="$t('home.pwdold')" prop="oldPassword">
          <el-input type="password" v-model="editForm.oldPassword" clearable class="edit-form-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('home.pwdnew')" prop="newPassword">
          <el-input type="password" v-model="editForm.newPassword" clearable class="edit-form-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('home.pwdrpt')" prop="newPasswordAgain">
          <el-input type="password" v-model="editForm.newPasswordAgain" clearable class="edit-form-input"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.dialogVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button type="primary" @click="changePassword()">{{ $t("common.ok") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Edit, SwitchButton, HomeFilled, User, Setting, Document } from '@element-plus/icons-vue'
import * as utils from "../../utils"
import * as nav from "../../common/nav"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// Refs
const editFormRef = ref<FormInstance>()

// Reactive data
const allMenus = ref<any[]>([])
const sysUserName = ref("")
const sysUserAvatar = ref("")

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
})

const editForm = reactive<any>({})

const editFormRules = reactive({
  oldPassword: [
    { required: true, message: t("home.oldisnull"), trigger: "blur" }
  ],
  newPassword: [
    { required: true, message: t("home.newisnull"), trigger: "blur" }
  ],
  newPasswordAgain: [
    { required: true, message: t("home.repeatnew"), trigger: "blur" },
    { validator: validatePasswordAgain, trigger: "blur" }
  ]
})

const ui = reactive({
  dialogVisible: false
})

// Methods
function validatePasswordAgain(rule: any, value: any, callback: any) {
  if (value === "") {
    callback(new Error(t("home.repeatnew")))
  } else if (value !== editForm.newPassword) {
    callback(new Error(t("home.notsame")))
  } else if (value === editForm.oldPassword) {
    callback(new Error(t("home.issame")))
  } else {
    callback()
  }
}

const getIconComponent = (iconClass: string) => {
  // Map Element UI icon classes to Element Plus icons
  const iconMap: { [key: string]: any } = {
    'el-icon-fa-home': HomeFilled,
    'el-icon-fa-user': User,
    'el-icon-fa-users': User,
    'el-icon-fa-cogs': Setting,
    'el-icon-s-custom': User,
    'el-icon-s-data': Document,
    'el-icon-postcard': Document,
  }
  return iconMap[iconClass] || Document
}

const handleopen = () => {
  console.log('handleopen')
}

const handleclose = () => {
  console.log('handleclose')
}

const handleselect = (a: any, b: any) => {
  // Handle menu select
}

const handleChangePassword = async () => {
  editFormRef.value?.resetFields()
  Object.assign(editForm, {})
  ui.dialogVisible = true
}

const changePassword = async () => {
  try {
    await editFormRef.value?.validate()
    
    try {
      await ElMessageBox.confirm(
        t("home.change-pwd-confirm"),
        t("home.confirmTip"),
        { type: 'warning' }
      )
      
      const record = editForm
      const result = await utils.doPost(
        { $router: router },
        "/api/sessions/passwordchange",
        record
      )
      
      if (!result.success) {
        if (result.code === 302) {
          ElMessage.warning(t('user.incorrectpassword'))
        } else {
          ElMessage.warning(t('home.funpwdfal') + result.message)
        }
      } else {
        ElMessage.success(t("home.funpwdsuc"))
        ui.dialogVisible = false
        forceLogout()
      }
    } catch {
      // User cancelled confirmation
    }
  } catch {
    // Form validation failed
  }
}

const forceLogout = async () => {
  localStorage.removeItem("TOKEN")
  localStorage.removeItem("user")
  router.push("/login")
}

const logout = async () => {
  try {
    await ElMessageBox.confirm(
      t("home.logoutmessage"),
      t("home.confirmTip"),
      { type: 'warning' }
    )
    
    localStorage.removeItem("TOKEN")
    localStorage.removeItem("user")
    router.push("/login")
  } catch {
    // User cancelled
  }
}

const loadAllMenus = async () => {
  const result = await utils.doGet({ $router: router }, "/api/sessions/permissions")
  if (result.success) {
    allMenus.value = result.data
  }
  
  const availButtons: string[] = []
  for (let i = 0; i < allMenus.value.length; i++) {
    const menu: any = allMenus.value[i]
    if (menu.children) {
      const buttons = menu.children
      for (let k = 0; k < buttons.length; k++) {
        availButtons.push(buttons[k].tag)
      }
    }
    if (menu.children) {
      for (let j = 0; j < menu.children.length; j++) {
        const child = menu.children[j]
        if (child.children) {
          const buttons = child.children
          for (let k = 0; k < buttons.length; k++) {
            availButtons.push(buttons[k].tag)
          }
        }
      }
    }
  }
  appStore.setButtons(new Set(availButtons))
}

const availButtons = async () => {
  const result = await utils.doGet({ $router: router }, "/api/sessions/permission/tag")
  let availableTags: string[] = []
  
  if (result.success) {
    availableTags = result.data
    const menus: any = nav.getNavData()
    hiddenMenus(menus, availableTags)
    allMenus.value = menus
  }
  
  appStore.setButtons(new Set(availableTags))
}

const hiddenMenus = (menus: any[], tags: string[]) => {
  for (const menu of menus) {
    if (menu.whiteList) {
      menu.hidden = false
    } else {
      menu.hidden = !compareTag(menu.tag, tags)
    }
    if (menu.children) {
      hiddenMenus(menu.children, tags)
    }
  }
}

const compareTag = (tag: string, tags: string[]) => {
  return tags.includes(tag)
}

// Lifecycle
onMounted(() => {
  const userString = sessionStorage.getItem("user")
  if (userString) {
    const user = JSON.parse(userString)
    sysUserName.value = user.realname || user.userName
    sysUserAvatar.value = user.avatar || ""
  }
  availButtons()
})
</script>

<style scoped>
.container {
  position: absolute;
  margin: 0px;
  padding: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.container .header {
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  color: #c0ccda;
}

.container .header .userinfo {
  text-align: right;
  padding-right: 10px;
}

.container .header .userinfo .userinfo-inner {
  color: #c0ccda;
  cursor: pointer;
}

.container .header .userinfo .userinfo-inner img {
  width: 32px;
  height: 32px;
  border-radius: 20px;
  margin: 5px 0px 5px 10px;
  float: right;
}

.container .logo {
  font-size: 18px;
  height: 60px;
}

.container .logo img {
  width: auto;
  height: 32px;
  float: left;
  margin: 5px 10px 5px 18px;
  background: white;
}

.container .logo .txt {
  color: #20a0ff;
}

.container .main {
  background: #09446d;
  position: absolute;
  top: 50px;
  bottom: 0px;
  overflow: hidden;
}

.container .main aside {
  width: 250px;
}

.container .content-container {
  background: #f3f5f7;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  left: 249px;
  overflow-y: scroll;
  overflow-x: scroll;
  padding: 20px;
}

.container .content-container .breadcrumb-container {
  margin-bottom: 15px;
}

.container .content-container .breadcrumb-container.title {
  width: 200px;
  float: left;
  color: #475669;
}

.container .content-container .breadcrumb-container .breadcrumb-inner {
  float: right;
}

.container .content-container .breadcrumb-container .content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
  min-height: 70vh;
}

.container .content-container .breadcrumb-container .footer {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.container .icon {
  width: 16px;
  height: 14px;
  margin-right: 5px;
  vertical-align: center;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 120px;
  min-height: 400px;
  border-right: none;
}

.language {
  color: white;
}
</style>