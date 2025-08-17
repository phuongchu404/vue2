<template>
  <div>
    <!--Query Form  -->
    <div class="search-form">
      <header>{{ $t('Search') }}</header>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" label-width="170px">
        <el-form-item :label="$t('role.roleName')">
          <el-input v-model="queryForm.roleName" :placeholder="$t('role.roleName')" size="small"></el-input>
        </el-form-item>
        <el-form-item align="right" style="margin-left: 220px">
          <el-button type="primary" @click="handleAdd" :disabled="isButtonEnabled('system:role:insert')" size="small">
            <el-icon><Plus /></el-icon><span>{{ $t('option.add') }}</span>
          </el-button>
          <el-button type="primary" @click="handleSynchronizePermission"
                     :disabled="isButtonEnabled('system:role:insert')" size="small">
            <el-icon><Plus /></el-icon><span>{{ $t('option.syn') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-table">
      <el-row :gutter="20">
        <el-table :data="filteredTableData"
                  style="width: 97%; margin-top: 10px; margin-left: 20px;"
                  :row-class-name="tableRowClassName"
                  v-loading="ui.loading"
                  align="center" 
                  border>
          <el-table-column type="index" prop="id" :label="$t('common.index')" width="80"></el-table-column>
          <el-table-column prop="roleName" :label="$t('role.roleName')" min-width="80"></el-table-column>
          <el-table-column prop="description" :label="$t('role.description')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('common.createTime')" width="230"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column prop="updateTime" :label="$t('common.updateTime')" width="230"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column :label="$t('common.option')" width="350">
            <template #default="{ row }">
              <el-button size="small" type="primary" class="normal-btn btn-bluelight" @click="handleEdit(row)"
                         :disabled="isButtonEnabledByUser(row,'system:role:update')">{{ $t('option.update') }}
              </el-button>
              <el-button size="small" type="primary" class="normal-btn btn-greenlight"
                         @click="handleAuthorize(row)"
                         :disabled="isButtonEnabledByUser(row,'system:role:assign-permission')">
                {{ $t('common.authorize') }}
              </el-button>
              <el-button size="small" type="primary" class="normal-btn btn-red"
                         @click="handleDelete(row)"
                         :disabled="isButtonEnabledByUser(row,'system:role:delete')">{{
                  $t('option.delete')
                }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <el-dialog :title="ui.addRecord ? $t('role.add') : $t('role.update')" v-model="ui.dialogVisible" width="40%"
               class="addDio">
      <el-form :model="editForm" :rules="editFormRules" label-width="100px" style="padding-right: 50px" ref="editFormRef">
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <el-input v-model="editForm.roleName" autofocus size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('role.description')" prop="description">
          <el-input v-model="editForm.description" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSaveOrUpdate()">{{ $t('common.ok') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="$t('common.authorize')" v-model="ui.permsDialogVisible" @open="loadPermsDialogData"
               class="addDio">
      <el-row :gutter="20">
        <el-col :push="15" style="margin-bottom: 10px">
          <el-button size="small" @click="selectAll()" class="button-no-focus">{{ $t('common.select-all') }}
          </el-button>
          <el-button size="small" @click="selectNone()" class="button-no-focus">{{ $t('common.select-none') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <div class="permsTree">
          <el-tree
              :data="allPermissions"
              show-checkbox
              default-expand-all
              node-key="tag"
              ref="treeRef"
              :props="defaultTreeProps"
              :default-checked-keys="['index','session:all']"
          >
          </el-tree>
        </div>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ui.permsDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handlePermsUpdate()">{{ $t('common.ok') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as Utils from '../../utils'
import * as nav from '../../common/nav'

const { t } = useI18n()
const appStore = useAppStore()

// Refs
const editFormRef = ref<FormInstance>()
const treeRef = ref()

// Reactive data
const ui = reactive({
  loading: false,
  dialogVisible: false,
  addRecord: false,
  permsDialogVisible: false,
  authentication: false
})

const tableData = ref<any[]>([])
const queryForm = reactive({ roleName: '' })
const editForm = reactive({ id: '', roleName: '', description: '' })
const editFormRules = reactive({
  roleName: [{ required: true, message: t('role.inputRoleName'), trigger: 'blur' }],
})

const disablePermissions = ref<any[]>([])
const authentication = reactive({ password: '' })
const defaultTreeProps = { label: 'name', children: 'children' }
const allPermissions = ref<any[]>([])
const permsEditForm = reactive({ roleId: '', oldPerms: [''], selectedPermissions: [''] })
const active = ref<number>(0)
const row = ref<any>(null)
const Permissions = ref<any[]>([])

// Computed
const filteredTableData = computed(() => {
  const roleName = queryForm.roleName
  if (roleName === '') return tableData.value
  return tableData.value.filter((item: any) => {
    return item.roleName.indexOf(roleName) !== -1
  })
})

// Methods
const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 === 0) return ''
  return 'warning-row'
}

const isButtonEnabledByUser = (rowData: any, buttonName: string) => {
  if (!rowData.removable && buttonName === 'system:role:delete') return true
  if (!rowData.removable && buttonName === 'system:role:assign-permission') return true
  if (!rowData.removable && buttonName === 'system:role:update') return true
  const disabled = appStore.buttons.has(buttonName)
  return !disabled
}

const isButtonEnabled = (buttonName: string) => {
  const disabled = appStore.buttons.has(buttonName)
  return !disabled
}

const selectAll = () => {
  const permissions = nav.getPermissions()
  const data: any[] = []
  for (const value of permissions) {
    data.push(value.tag)
  }
  treeRef.value?.setCheckedKeys(data)
}

const selectNone = () => {
  treeRef.value?.setCheckedKeys(['session:all'])
}

const loadTableData = async () => {
  ui.loading = true
  const result = await Utils.doGet({ $router: null }, '/api/admin/roles')
  if (result.success) {
    tableData.value = result.data.records
  } else {
    ElMessage.warning(t('common.loadFail'))
  }
  ui.loading = false
}

const defaultTimeFormatter = (row: any, column: any) => {
  const source = row[column.property]
  return Utils.formatDateString(source)
}

const handleAdd = async () => {
  Utils.clearValidateForm(editFormRef.value)
  ui.dialogVisible = true
  ui.addRecord = true
  editForm.roleName = ''
  editForm.description = ''
  editForm.id = ''
}

const handleEdit = async (rowData: any) => {
  Utils.clearValidateForm(editFormRef.value)
  ui.dialogVisible = true
  ui.addRecord = false
  editForm.roleName = rowData.roleName
  editForm.description = rowData.description
  editForm.id = rowData.id
}

const handleDelete = async (rowData: any) => {
  try {
    await ElMessageBox.confirm(t('common.deleteConfirm'), t('common.confirm'), { type: 'warning' })
    const roleId = rowData.id
    const result = await Utils.doDelete({ $router: null }, '/api/admin/roles/' + roleId, {})
    if (!result.success) {
      ElMessage.warning(t('common.deleteFail') + t(result.message))
    } else {
      ElMessage.success(t('common.deleteSuccess'))
      loadTableData()
    }
  } catch {
    // User cancelled
  }
}

const handleSaveOrUpdate = async () => {
  try {
    await editFormRef.value?.validate()
    if (ui.addRecord) {
      const record = editForm
      const result = await Utils.doPost({ $router: null }, '/api/admin/roles', record)
      if (!result.success) {
        ElMessage.warning(t('common.insertFail') + t(result.message))
      } else {
        ElMessage.success(t('common.updateSuccess'))
        ui.dialogVisible = false
        loadTableData()
      }
    }
  } catch {
    // Validation failed
  }
}

const handleAuthorize = async (rowData: any) => {
  permsEditForm.roleId = rowData.id
  allPermissions.value = []
  ui.permsDialogVisible = true
  authentication.password = ''
}

const loadPermsDialogData = async () => {
  const permissions: any = nav.getPermissionTree()
  allPermissions.value = permissions
  const selectedPermissions = await loadAllPermsByRoleId(permsEditForm.roleId)
  treeRef.value?.setCheckedKeys(selectedPermissions)
}

const handlePermsUpdate = async () => {
  const keys = treeRef.value?.getCheckedKeys().concat(treeRef.value?.getHalfCheckedKeys())
  const oldPerms = permsEditForm.oldPerms
  if (keys.length === oldPerms.length) {
    const oldPermsSet = new Set(oldPerms)
    const diffArr = keys.filter((item: any) => {
      return !oldPermsSet.has(item)
    })
    if (diffArr.length === 0) {
      ui.permsDialogVisible = false
      ElMessage.info(t('common.noChange'))
      return
    }
  }
  permsEditForm.selectedPermissions = keys
  const result = await Utils.doPut({ $router: null }, '/api/admin/roleperms/' + permsEditForm.roleId, permsEditForm)
  if (result.success) {
    ElMessage.success(t('common.updateSuccess'))
    ui.permsDialogVisible = false
  } else {
    ElMessage.warning(t('common.updateFail') + t(result.message))
  }
}

const handleSynchronizePermission = async () => {
  const result = await Utils.doPost({ $router: null }, '/api/admin/permissions', nav.getPermissions())
  if (result.success) {
    ElMessage.success(t('common.updateSuccess'))
  } else {
    ElMessage.warning(t('common.updateFail') + t(result.message))
  }
}

const loadAllPermsByRoleId = async (roleId: any) => {
  const result = await Utils.doGet({ $router: null }, '/api/admin/roleperms/' + roleId)
  if (result.success) {
    const oldPerms = buildOldPerms(result.data)
    permsEditForm.oldPerms = oldPerms
    disablePermissions.value = buildDisabledPerms(result.data)
    return oldPerms
  } else {
    ElMessage.warning(t('common.loadFail') + t(result.message))
  }
  return []
}

const buildOldPerms = (data: any) => {
  const perms = []
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      perms.push(data[i].tag)
    }
  }
  if (perms.length === 0) {
    perms.push("session:all")
  }
  return perms
}

const buildDisabledPerms = (data: any) => {
  const perms = []
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].removable === 0) {
        perms.push(data[i].tag)
      }
    }
  }
  return perms
}

// Lifecycle
onMounted(async () => {
  await loadTableData()
})
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

.permsTree {
  height: 50vh;
  overflow-y: scroll;
}
</style>