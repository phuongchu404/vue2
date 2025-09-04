<template>
  <div>
    <!--Query Form  -->
    <div class="box-card search-section">
      <div class="grid-title">
        <i class="el-icon-search"></i>
        {{ $t('Search') }}
      </div>
      <el-form :inline="true" :model="queryForm" class="form-grid" label-position="top">
        <el-form-item :label="$t('role.roleName')">
          <el-input v-model="queryForm.roleName" :placeholder="$t('role.roleName')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" :disabled="isButtonEnabled('system:role:insert')" size="mini">
            <i class="el-icon-circle-plus-outline"/><span>{{ $t('option.add') }}</span>
          </el-button>
          <el-button type="primary" @click="handleSynchronizePermission"
                     :disabled="isButtonEnabled('system:role:insert')" size="mini">
            <i class="el-icon-circle-plus-outline"/><span>{{ $t('option.syn') }}</span>
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
                  align="center" border>
          <el-table-column type="index" prop="id" :label="$t('common.index')" width="80"></el-table-column>
          <el-table-column prop="roleName" :label="$t('role.roleName')" min-width="80"></el-table-column>
          <el-table-column prop="description" :label="$t('role.description')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('common.createTime')" width="230"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column prop="updateTime" :label="$t('common.updateTime')" width="230"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column :label="$t('common.option')" width="350">
            <template slot-scope="scope">
              <template v-if="scope.row.roleName !== 'admin'">
                <el-button size="mini" type="primary" class="normal-btn btn-bluelight" @click="handleEdit(scope.row)"
                           :disabled="isButtonEnabledByUser(scope.row,'system:role:update')">{{ _self.$t('option.update') }}
                </el-button>
                <el-button size="mini" type="primary" class="normal-btn btn-greenlight"
                           @click="handleAuthorize(scope.row)"
                           :disabled="isButtonEnabledByUser(scope.row,'system:role:assign-permission')">
                  {{ _self.$t('common.authorize') }}
                </el-button>
                <el-button size="mini" type="primary" class="normal-btn btn-red"
                           @click="handleDelete(scope.row)"
                           :disabled="isButtonEnabledByUser(scope.row,'system:role:delete')">{{
                    _self.$t('option.delete')
                  }}
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>

    <el-pagination class="pagination" @current-change="loadTableData" :page-size="pageSize"
                       :current-page.sync="pageNumber" layout="total, prev, pager, next, jumper"
                       :total="total"></el-pagination>

    <el-dialog :title="ui.addRecord ? $t('role.add') : $t('role.update')" :visible.sync="ui.dialogVisible" width="40%"
               class="addDio">
      <el-form :model="editForm" :rules="editFormRules" label-width="150px" label-position="left" ref="editForm1">
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <el-input v-model="editForm.roleName" autofocus disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('role.description')" prop="description">
          <el-input v-model="editForm.description" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleSaveOrUpdate()">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('common.authorize')" :visible.sync="ui.permsDialogVisible" @open="loadPermsDialogData"
               class="addDio">
      <el-row :gutter="20">
        <el-col :push="15" style="margin-bottom: 10px">
          <el-button size="mini" @click="selectAll()" class="button-no-focus">{{ $t('common.select-all') }}
          </el-button>
          <el-button size="mini" @click="selectNone()" class="button-no-focus">{{ $t('common.select-none') }}
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
              ref="tree"
              :props="defaultTreeProps"
              :default-checked-keys="['index','session:all']"
          >
          </el-tree>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.permsDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handlePermsUpdate()">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import i18n from '../../i18n';
import * as Utils from '../../utils';
import * as utils from '../../utils';
import * as nav from '../../common/nav';

@Component
export default class Roles extends Vue {
  ui = {
    loading: false,
    dialogVisible: false,
    addRecord: false,
    permsDialogVisible: false,
    authentication: false
  };
  tableData = [];
  queryForm = {roleName: ''};
  editForm = {id: '', roleName: '', description: ''};
  editFormRules = {
    roleName: [{required: true, message: i18n.t('role.inputRoleName'), trigger: 'blur'}],
  };
  disablePermissions: any = [];
  authentication = {password: ''};
  defaultTreeProps = {label: 'name', children: 'children'};
  allPermissions = [];
  permsEditForm = {roleId: '', oldPerms: [''], selectedPermissions: ['']};
  active: number
  row: any
  Permissions = [] as any;

  defaultPageSize = 10;
  pageNumber = 1;
  pageSize = this.defaultPageSize;
  total = 0;

  get filteredTableData() {
    let self = this;
    var roleName = this.queryForm.roleName;
    if (roleName == '') return self.tableData;
    return self.tableData.filter(function (item: any) {
      return item.roleName.indexOf(roleName) != -1;
    });
  };

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async handleAuthentication(row: any, active: number) {
    if (active == 2) {
      let confirmed = await Utils.confirm(this, String(i18n.t('common.deleteConfirm')), String(i18n.t('common.confirm')));
      if (!confirmed)
        return;
    }
    await utils.clearValidateForm(this.$refs.authentication)
    this.ui.authentication = true
    this.authentication.password = ''
    this.row = row;
    this.active = active;
  }

  async mounted() {
    await this.loadTableData();
    // await this.getPermission();
    // await this.handleSynchronizePermission();
  };

  isButtonEnabledByUser(row: any, buttonName: string) {
    if (!row.removable && buttonName == 'system:role:delete') {
      return true;
    }
    if (!row.removable && buttonName == 'system:role:assign-permission') {
      return true;
    }
    if (!row.removable && buttonName == 'system:role:update') {
      return true;
    }
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };


  selectAll() {
    // let permissions = nav.getPermissionTree();
    // (this.$refs.tree as any).setCheckedNodes(permissions);
    let permissions = nav.getPermissions();
    let data = [] as any;
    for (let value of permissions) {
      data.push(value.tag)
    }
    (this.$refs.tree as any).setCheckedKeys(data);
  }

  selectNone() {
    (this.$refs.tree as any).setCheckedKeys(['session:all']);
  }

  async handleSearch() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadTableData();
  }

  async loadTableData() {
    this.ui.loading = true;
    let param = `roleName=${this.queryForm.roleName}&pageNo=${this.pageNumber}&pageSize=${this.pageSize}`
    let result = await Utils.doGet(this, `/api/admin/roles?${param}`);
    if (result.success) {
      this.tableData = result.data.content;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
    this.ui.loading = false;
  };

  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    return Utils.formatDateString(source);
  };

  async handleAdd() {
    Utils.clearValidateForm(this.$refs.editForm1);
    this.ui.dialogVisible = true;
    this.ui.addRecord = true;
    this.editForm.roleName = '';
    this.editForm.description = '';
    this.editForm.id = '';
  };

  async handleEdit(row: any) {
    Utils.clearValidateForm(this.$refs.editForm1);
    this.ui.dialogVisible = true;
    this.ui.addRecord = false;
    this.editForm.roleName = row.roleName;
    this.editForm.description = row.description;
    this.editForm.id = row.id;
  };

  async handleDelete(row: any) {
    let confirmed = await Utils.confirm(this, String(i18n.t('common.deleteConfirm')), String(i18n.t('common.confirm')));
    if (!confirmed) return;
    var roleId = row.id;
    var result = await Utils.doDelete(this, '/api/admin/roles/' + roleId, {});
    if (!result.success)
      Utils.showWarning(String(i18n.t('common.deleteFail')) + String(i18n.t(result.message)));
    else {
      Utils.showSuccess(String(i18n.t('common.deleteSuccess')));
      this.loadTableData();
    }
  };

  async handleSaveOrUpdate() {
    let validated = await Utils.validateForm(this.$refs.editForm1);
    if (!validated) return;
    if (this.ui.addRecord) {
      let record = this.editForm;
      let result = await Utils.doPost(this, '/api/admin/roles', record);
      if (!result.success) {
        Utils.showWarning(String(i18n.t('common.insertFail')) + String(i18n.t(result.message)));
      } else {
        Utils.showSuccess(String(i18n.t('common.insertSuccess')));
        this.ui.dialogVisible = false;
        this.loadTableData();
      }
    } else {
      let record = this.editForm;
      let result = await Utils.doPut(this, '/api/admin/roles/' + record.id, record);
      if (!result.success) {
        Utils.showWarning(String(i18n.t('common.updateFail')) + String(i18n.t(result.message)));
      } else {
        Utils.showSuccess(String(i18n.t('common.updateSuccess')));
        this.ui.dialogVisible = false;
        this.loadTableData();
      }
    }
  };

  async handleAuthorize(row: any) {
    this.permsEditForm.roleId = row.id;
    this.allPermissions = [];
    this.ui.permsDialogVisible = true;
    this.authentication.password = '';
  };

  async loadPermsDialogData() {
    let permissins: any = nav.getPermissionTree()
    this.allPermissions = permissins
    let selectedPermissions = await this.loadAllPermsByRoleId(this.permsEditForm.roleId);
    (this.$refs.tree as any).setCheckedKeys(selectedPermissions);
  };

  // async getPermission() {
  //   let permissins: any = nav.getPermissionTree()
  //   for (let i in permissins) {
  //     await this.addPermission(permissins[i])
  //   }
  //   // console.log(this.Permissions)
  // }
  //
  // async addPermission(permissins: any) {
  //   let permissinMenu = {} as any
  //   permissinMenu.tag = permissins.tag
  //   permissinMenu.type = permissins.type
  //   if (permissins.pattern !== undefined)
  //     permissinMenu.pattern = permissins.pattern
  //   permissinMenu.whiteList = permissins.whiteList
  //   if (permissins.method !== undefined)
  //     permissinMenu.method = permissins.method
  //   this.Permissions.push(permissinMenu)
  //   for (let i in permissins.children) {
  //     await this.addPermission(permissins.children[i])
  //   }
  // }

  async handlePermsUpdate() {
    let keys = (this.$refs.tree as any).getCheckedKeys().concat((this.$refs.tree as any).getHalfCheckedKeys());
    let oldPerms = this.permsEditForm.oldPerms;
    if (keys.length == oldPerms.length) {
      var oldPermsSet = new Set(oldPerms);
      var diffArr = keys.filter((item: any) => {
        return !oldPermsSet.has(item);
      });
      if (diffArr.length == 0) {
        this.ui.permsDialogVisible = false;
        Utils.showInfo(String(i18n.t('common.noChange')));
        return;
      }
    }
    this.permsEditForm.selectedPermissions = keys;
    var result = await Utils.doPut(this, '/api/admin/roleperms/' + this.permsEditForm.roleId, this.permsEditForm);
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.updateSuccess')));
      this.ui.permsDialogVisible = false;
    } else {
      Utils.showWarning(String(i18n.t('common.updateFail')) + i18n.t(result.message));
    }
  }

  async handleSynchronizePermission() {
    let result = await Utils.doPost(this, '/api/admin/permissions', nav.getPermissions());
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.updateSuccess')));
    } else {
      Utils.showWarning(String(i18n.t('common.updateFail')) + i18n.t(result.message));
    }
  }

  async loadAllPermsByRoleId(roleId: any) {
    let result = await Utils.doGet(this, '/api/admin/roleperms/' + roleId);
    if (result.success) {
      let oldPerms = this.buildOldPerms(result.data);
      // console.log(oldPerms)
      this.permsEditForm.oldPerms = oldPerms;
      this.disablePermissions = this.buildDisabledPerms(result.data);
      return oldPerms;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')) + i18n.t(result.message));
    }
    return [];
  };

  buildOldPerms(data: any) {
    let perms = [];
    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        perms.push(data[i].tag);
      }
    }
    if (perms.length === 0) {
      perms.push("session:all");
    }
    return perms;
  }

  buildDisabledPerms(data: any) {
    let perms = [];
    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].removable == 0) {
          perms.push(data[i].tag);
        }
      }
    }
    return perms;
  }

  // toggleTreeNodeCheckbox(permissions: any, disablePermission: any) {
  //   let length = permissions.length;
  //   for (let i = 0; i < length; i++) {
  //     let permission = permissions[i];
  //     if (disablePermission.includes(permission.tag)) {
  //       permission.disable = true;
  //     }
  //     if (permission.children != null) {
  //       let children = permission.children;
  //       let childrenLength = children.length;
  //       for (let j = 0; j < childrenLength; j++) {
  //         let child = children[j];
  //         if (disablePermission.includes(child.tag)) {
  //           console.log(child.tag)
  //           child.disabled = true;
  //         }
  //         if (child.options != null) {
  //           let options = child.options;
  //           let optionsLength = options.length;
  //           for (let k = 0; k < optionsLength; k++) {
  //             let option = options[k];
  //             if (disablePermission.includes(option.tag)) {
  //               console.log(option.tag)
  //               option.disabled = true;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

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

.permsTree {
  height: 50vh;
  overflow-y: scroll;
}
</style>
