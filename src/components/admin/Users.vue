<template>
  <div>
    <div class="search-form" style="padding-bottom: 19px">
      <header>{{ $t('Search') }}</header>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" label-width="170px">
        <el-form-item :label="$t('user.userName')">
          <el-input v-model="queryForm.userName" :placeholder="$t('user.userName')" size="mini"></el-input>
        </el-form-item>
        <el-form-item align="right" style="margin-left: 220px">
          <el-button type="primary" @click="handleAdd" :disabled="isButtonEnabled('system:user:insert')" size="mini">
            <i class="el-icon-circle-plus-outline"/><span>{{ $t('option.add') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-table" style="padding-bottom: 40px">
      <el-row :gutter="20">
        <el-table :data="filteredTableData" style="width: 97%;margin-top: 10px;margin-left: 20px;"
                  :row-class-name="tableRowClassName" align="center" border>
          <el-table-column type="index" prop="id" :label="$t('common.index')" width="80"></el-table-column>
          <el-table-column prop="userName" :label="$t('user.userName')" min-width="100"></el-table-column>
          <el-table-column prop="roles" :label="$t('user.roles')" :formatter="rolesFormatter"></el-table-column>
          <el-table-column prop="realName" :label="$t('user.realName')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('common.createTime')" width="180"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column prop="updateTime" :label="$t('common.updateTime')" width="180"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column :label="$t('common.option')" :context="_self" width="480">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="normal-btn btn-bluelight"
                         :disabled="isButtonEnabled('system:user:update')"
                         @click="handleEdit(scope.row)">{{ _self.$t('option.update') }}
              </el-button>
              <el-button size="mini" type="primary" class="normal-btn btn-greenlight"
                         :disabled="isButtonEnabled('system:user:assign-roles')||scope.row.userName===userNameLogin || scope.row.removable!='1'"
                         @click="handleSelectRoles(scope.row)">{{ _self.$t('user.allocateRole') }}
              </el-button>
              <el-button size="mini" type="primary" class="normal-btn btn-red"
                         :disabled="isButtonEnabled('system:user:reset-password')||scope.row.userName===userNameLogin"
                         @click="resetPassword(scope.row)">{{ _self.$t('user.resetPassword') }}
              </el-button>
              <el-button size="mini" type="primary" class="normal-btn btn-red"
                         :disabled="isButtonEnabled('system:user:delete')||scope.row.userName===userNameLogin || scope.row.removable!='1'"
                         @click="handleDelete(scope.row,3)">{{ _self.$t('option.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <el-dialog :title="ui.addRecord?$t('user.add'):$t('user.update')" :visible.sync="ui.dialogVisible" width="40%"
               class="addDio">
      <el-form :model="editForm" :rules="editFormRules" label-width="130px" ref="editForm" style="padding-right: 50px">
        <input type="hidden" v-model="editForm.id"></input>
        <el-form-item :label="$t('user.userName')" prop="userName">
          <el-input v-model="editForm.userName" autofocus :readonly="!ui.addRecord" size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.realName')" prop="realName">
          <el-input v-model="editForm.realName" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleSaveOrUpdate()">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('ResetPassword')" :visible.sync="ui.resetPassword" width="40%" class="addDio">
      <el-form :model="password" :rules="passwordRules" label-width="130px" ref="editForm" style="padding-right: 50px">
        <input type="hidden" v-model="editForm.id"></input>
        <el-form-item :label="$t('user.password')" prop="password">
          <el-input v-model="password.password" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleResetPassword()">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('user.selectRole')" width="35%" :visible.sync="ui.rolesDialogVisible"
               @open="loadRolesDialogData"
               class="addDio">
      <el-tree
          :data="allRoles"
          show-checkbox
          default-expand-all
          node-key="id"
          :props="defaultTreeProps"
          ref="tree"
          hightlight-current>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.rolesDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleRolesUpdate()">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import * as Utils from '../../utils';
import i18n from '../i18n';
import * as utils from "../../utils";

@Component
export default class Users extends Vue {
  ui = {
    loading: false,
    dialogVisible: false,
    addRecord: false,
    rolesDialogVisible: false,
    authentication: false,
    resetPassword: false
  };
  Provider: []
  editForm = {id: '', userName: '', realName: ''};
  editFormRules = {
    userName: [{required: true, message: i18n.t("user.inputUserName"), trigger: 'blur'}],
    realName: [{required: true, message: i18n.t("user.inputRealName"), trigger: 'blur'}]
  };
  passwordRules = {
    password: [{required: true, message: i18n.t("user.inputUserName"), trigger: 'blur'}],
  }
  password = {password: '', id: ''}
  userNameLogin = ''
  queryForm = {userName: ''};
  tableData = [];
  allRoles = [];
  defaultTreeProps = {label: 'roleName', children: 'children'};
  rolesEditForm: any = {id: '', roles: [], userId: '', oldRoles: ['']};
  authentication = {password: ''};
  authenticationFormRules = {
    password: [{
      required: true,
      message: i18n.t('login.pwdisnull'),
      trigger: 'blur'
    }],
  };
  active: number
  row: any
  isEyes: boolean = false;

  showPassword() {
    this.isEyes = !this.isEyes;
  }

  get filteredTableData() {
    let self = this;
    return self.tableData;
  }

  async resetPassword(row: any) {
    this.ui.resetPassword = true
    this.password.password = ''
    this.password.id = row.id;
  }

  async mounted() {
    await this.loadTableData();
    let userString = sessionStorage.getItem("user");
    if (userString) {
      let user = JSON.parse(userString);
      this.userNameLogin = user.userName;
    }
  };

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async handleAdd() {
    Utils.clearValidateForm(this.$refs.editForm);
    this.ui.dialogVisible = true;
    this.ui.addRecord = true;
    this.editForm.userName = '';
    this.editForm.realName = '';
    this.editForm.id = '';
  };

  async handleEdit(row: any) {
    Utils.clearValidateForm(this.$refs.editForm);
    this.ui.dialogVisible = true;
    this.ui.addRecord = false;
    this.editForm.userName = row.userName;
    this.editForm.realName = row.realName;
    this.editForm.id = row.id;
  };

  async handleDelete(row: any) {
    let confirmed = await Utils.confirm(this, String(i18n.t('common.deleteConfirm')), String(i18n.t('common.confirm')));
    if (confirmed) {
      var roleId = row.id;
      var result = await Utils.doDelete(this, '/api/admin/users/' + roleId, {});
      if (!result.success)
        Utils.showWarning(String(i18n.t('common.deleteFail')) + String(i18n.t(result.message)));
      else {
        Utils.showSuccess(String(i18n.t('common.deleteSuccess')));
        this.loadTableData();
      }
    } else {
      console.log("canceled.");
    }

  };

  async handleSaveOrUpdate() {
    let validated = await Utils.validateForm(this.$refs.editForm);
    if (!validated) return;
    if (this.ui.addRecord) {
      let record = this.editForm;
      let result = await Utils.doPost(this, '/api/admin/users', record);
      if (!result.success) {
        Utils.showWarning(String(i18n.t('common.insertFail')) + String(i18n.t(result.message)));
      } else {
        Utils.showSuccess(String(i18n.t('common.insertSuccess')));
        this.ui.dialogVisible = false;
        this.loadTableData();
      }
    } else {
      let record = this.editForm;
      let result = await Utils.doPut(this, '/api/admin/users/' + record.id, record);
      if (!result.success) {
        Utils.showWarning(String(i18n.t('common.updateFail')) + String(i18n.t(result.message)));
      } else {
        Utils.showSuccess(String(i18n.t('common.updateSuccess')));
        this.ui.dialogVisible = false;
        this.loadTableData();
      }
    }
  };

  async loadTableData() {
    let result = await Utils.doGet(this, '/api/admin/users');
    if (result.success) {
      this.tableData = result.data.records;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  };

  rolesFormatter(row: any, column: any) {
    var roles = row.roles;
    var roleNames = roles.map((item: any) => {
      return item.roleName;
    });
    return roleNames.join(", ");
  };

  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    return Utils.formatDateString(source);
  };

  async handleSelectRoles(row: any) {
    this.rolesEditForm.userId = row.id;
    this.allRoles = [];
    var oldRows = row.roles.map((item: any) => {
      return item.id;
    });
    this.rolesEditForm.oldRoles = oldRows;
    this.ui.rolesDialogVisible = true;
  };

  async handleResetPassword() {
    let confirmed = await Utils.confirm(this, String(i18n.t('user.resetPasswordConfirm')), String(i18n.t('common.confirm')));
    if (!confirmed)
      return;
    let result = await Utils.doPost(this, '/api/admin/users/password', this.password);
    if (result.success) {
      Utils.messageInfo(String(i18n.t('user.resetPasswordSuccess')) + result.data + ']');
      this.ui.resetPassword = false;
    } else {
      Utils.showWarning(String(i18n.t('user.resetPasswordFail')) + String(i18n.t(result.message)));
    }
  };

  async loadAllRoles() {
    let result = await Utils.doGet(this, '/api/admin/roles');
    if (result.success) {
      this.allRoles = result.data.records;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')) + String(i18n.t(result.message)));
    }
  };

  async loadRolesDialogData() {
    await this.loadAllRoles();
    (this.$refs.tree as any).setCheckedKeys(this.rolesEditForm.oldRoles);
  };

  async handleRolesUpdate() {
    var keys = (this.$refs.tree as any).getCheckedKeys();
    var oldRoles = this.rolesEditForm.oldRoles;
    if (keys.length == oldRoles.length) {
      var oldRolesSet = new Set(oldRoles);
      var diffArr = keys.filter((item: any) => {
        return !oldRolesSet.has(item);
      });
      if (diffArr.length == 0) {
        this.ui.rolesDialogVisible = false;
        Utils.showInfo(String(i18n.t('common.noChange')));
        return;
      }
    }
    this.rolesEditForm.selectedRoles = keys;
    var result = await Utils.doPut(this, '/api/admin/userroles/' + this.rolesEditForm.userId, this.rolesEditForm);
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.updateSuccess')));
      this.loadTableData();
      this.ui.rolesDialogVisible = false;
    } else {
      Utils.showWarning(String(i18n.t('common.updateFail')) + String(i18n.t(result.message)));
    }
  };
};
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
