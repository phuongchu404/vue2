<template>
  <div>
    <el-card class="box-card" style="width: 60%">
      <template #header>
        <div class="clearfix">
          <span style="line-height: 36px;color: white">{{ $t("profile.infotitle") }}</span>
        </div>
      </template>
      <el-row>
        <el-col :span="8">
          <img :src="sysUserAvatar" width="128" height="128" alt="Avatar"/>
        </el-col>
        <el-col :span="16">
          <el-row class="text item">
            <el-col :span="6">{{ $t("profile.username") }}</el-col>
            <el-col :span="18">{{ sysUserName }}</el-col>
          </el-row>
          <el-row class="text item">
            <el-col :span="6">{{ $t("profile.roles") }}</el-col>
            <el-col :span="18">{{ sysUserRolesString }}</el-col>
          </el-row>
          <el-row class="text item">
            <el-col :span="6">{{ $t("profile.lastlogin") }}</el-col>
            <el-col :span="18">{{ sysUserLastLogin }}</el-col>
          </el-row>
          <el-row class="text item">
            <el-col :span="6">{{ $t("profile.twostepstatus") }}</el-col>
            <el-col :span="12">{{ twoStepStatus }}</el-col>
            <el-col :span="6">
              <el-button 
                type="primary" 
                style="width:100%" 
                size="small" 
                :disabled="twoStepEnabled" 
                @click="handleActivate">
                {{ $t("common.activate") }}
              </el-button>
            </el-col>
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
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import * as Utils from '../../utils'

const { t } = useI18n()

// Refs
const activateFormRef = ref<FormInstance>()

// Reactive data
const ui = reactive({ 
  activateDialogVisible: false 
})

const sysUserName = ref('')
const sysUserAvatar = ref('')
const sysUserRoles = ref<any[]>([])
const sysUserLastLogin = ref('')
const twoStepEnabled = ref(false)
const twoStepStatus = ref('')
const sysUserQRImage = ref('')

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
const handleActivate = async () => {
  try {
    await ElMessageBox.confirm(
      t('profile.confirmactivatetip'),
      t('common.confirm'),
      { type: 'warning' }
    )
    
    const result = await Utils.doGet({ $router: null }, '/api/sessions/secret')
    if (!result.success) {
      ElMessage.warning(t('profile.activatefaliedtip'))
      return
    }
    sysUserQRImage.value = "/api/sessions/secret/image/" + result.data
    ui.activateDialogVisible = true
  } catch {
    // User cancelled
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
    sysUserName.value = user.realName || user.userName
    sysUserAvatar.value = user.avatar || ''
    sysUserRoles.value = user.roles
    sysUserLastLogin.value = Utils.formatDateString(user.lastLogin)
    twoStepEnabled.value = user.twoStepEnabled
    twoStepStatus.value = user.twoStepEnabled ? t('common.enabled') : t('common.disabled')
    
    if (user.needTwoStep && !user.twoStepEnabled) {
      ElMessageBox.confirm(t('profile.activatetip'))
      handleActivate()
    }
  }
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