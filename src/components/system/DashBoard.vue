<template>
  <div>
    <el-card class="box-card title" style="width: 100%; margin-top: 10px;padding-bottom: 100px">
      <template #header>
        <div class="clearfix">
          <span style="line-height: 36px;font-size:20px;color: black;font-weight: 500;margin-left: 10px">
            {{ $t('home.userinfo') }}
          </span>
        </div>
      </template>
      <el-row>
        <el-col :span="8">
          <img src="../../assets/user2.png" :width="178" height="178"/>
        </el-col>
        <el-col :span="16">
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.username") }}</el-col>
            <el-col :span="18">{{ sysUserName }}</el-col>
          </el-row>
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.realname") }}</el-col>
            <el-col :span="18">{{ sysRealName }}</el-col>
          </el-row>
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.roles") }}</el-col>
            <el-col :span="18">{{ sysUserRolesString }}</el-col>
          </el-row>
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.lastlogin") }}</el-col>
            <el-col :span="18">{{ sysUserLastLogin }}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog :title="$t('profile.twosteptitle')" v-model="ui.activateDialogVisible">
      <el-row>
        <el-col :span="10">
          <img :src="sysUserQRImage" alt="QR Code"/>
        </el-col>
        <el-col :span="14">
          <el-row>
            <el-col :span="24">{{ $t("profile.tiprow1") }}</el-col>
            <el-col :span="24">{{ $t("profile.tiprow2") }}</el-col>
            <el-col :span="24">&nbsp;</el-col>
            <el-col :span="24">&nbsp;</el-col>
            <el-col :span="24">&nbsp;</el-col>
            <el-col :span="24">{{ $t("profile.otp") }}</el-col>
            <el-col :span="24">
              <el-form :model="activateForm" :rules="activateFormRules" label-width="100px" ref="activateFormRef" inline>
                <el-form-item label="" prop="otp">
                  <el-input v-model="activateForm.otp"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.activateDialogVisible = false">{{ $t("common.cancel") }}</el-button>
          <el-button type="primary" @click="handleEnableTwoStep">{{ $t("common.ok") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance } from 'element-plus'
import * as Utils from '../../utils'

const { t } = useI18n()

// Refs
const activateFormRef = ref<FormInstance>()

// Reactive data
const ui = reactive({ 
  activateDialogVisible: false 
})

const sysUserName = ref('')
const sysRealName = ref('')
const sysUserAvatar = ref('')
const sysUserRoles = ref<any[]>([])
const sysUserLastLogin = ref('')
const twoStepEnabled = ref(false)
const twoStepStatus = ref('')
const sysUserQRImage = ref('')
const totalDevice = ref(0)
const totalReader = ref(0)

const activateForm = reactive({ 
  otp: '' 
})

const activateFormRules = reactive({
  otp: [{ required: true, message: t('profile.otpisnull'), trigger: 'blur' }]
})

// Computed
const sysUserRolesString = computed(() => {
  const names: string[] = []
  sysUserRoles.value.map((item: any) => {
    names.push(item.roleName)
  })
  return names.join(",")
})

// Methods
const countDevice = async () => {
  const result = await Utils.doGet({ $router: null }, '/api/device/count')
  if (result?.data) {
    totalDevice.value = result.data
  }
}

const countReader = async () => {
  const result = await Utils.doGet({ $router: null }, '/api/reader/count')
  if (result?.data) {
    totalReader.value = result.data
  }
}

const handleEnableTwoStep = async () => {
  try {
    await activateFormRef.value?.validate()
    const otp = activateForm.otp
    const result = await Utils.doPost({ $router: null }, '/api/sessions/twostep/' + otp)
    
    if (!result.success) {
      ElMessage.warning(t('profile.activatefalieddetailtip') + result.message)
      return
    } else {
      ElMessage.success(t('profile.activatesuccesstip'))
      twoStepEnabled.value = true
      twoStepStatus.value = '已激活'
      const user = JSON.parse(sessionStorage.getItem('user') as string)
      user.twoStepEnabled = true
      sessionStorage.setItem('user', JSON.stringify(user))
    }
    ui.activateDialogVisible = false
  } catch {
    // Validation failed
  }
}

// Lifecycle
onMounted(() => {
  const userString = sessionStorage.getItem('user')
  if (userString) {
    const user = JSON.parse(userString)
    sysUserName.value = user.userName
    sysRealName.value = user.realName
    sysUserAvatar.value = user.avatar || ''
    sysUserRoles.value = user.roles
    sysUserLastLogin.value = Utils.formatDateString(user.lastLogin)
    twoStepEnabled.value = user.twoStepEnabled
    twoStepStatus.value = user.twoStepEnabled ? t('common.enabled') : t('common.disabled')
  }
  countDevice()
  countReader()
})
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 12px 0;
}
</style>