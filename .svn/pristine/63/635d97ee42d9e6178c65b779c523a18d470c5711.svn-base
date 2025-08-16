<template>
  <div>
    <div class="search-form" style="padding-bottom: 19px">
      <header>{{ $t('Search') }}</header>
      <el-form :model="queryDeviceForm" label-width="170px" label-position="right" class="demo-form-inline"
               size="small" ref="queryForm" :inline="true">
        <el-row>
          <el-form-item :label="$t('providerName')">
            <el-input v-model="queryDeviceForm.name" clearable :placeholder="$t('providerName')" size="mini"
                      class="query-form-input"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 200px">
            <el-button type="primary" size="mini" @click="handleSearch()"
                       :disabled="isButtonEnabled('provider:select')">
              <i class="el-icon-search"></i>
              {{ $t("option.query") }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="openUploadDialog" :disabled="isButtonEnabled('provider:add')">
              <i class="el-icon-circle-plus-outline"/>{{ $t('option.add') }}
            </el-button>
          </el-form-item>
        </el-row>

      </el-form>
    </div>
    <!--Table Area-->
    <div class="page-table" style="padding-bottom: 40px">
      <el-row :gutter="20">
        <el-table :data="tableDeviceData" style="width: 97%;margin-top: 10px;margin-left: 20px;"
                  :row-class-name="tableRowClassName" align="center" border>
          <el-table-column type="index" :label="$t('index')" width="65"></el-table-column>
          <el-table-column prop="providerCode" :label="$t('providerCode')" min-width="120">
          </el-table-column>
          <el-table-column prop="providerName" :label="$t('providerName')" min-width="130">
          </el-table-column>
          <el-table-column prop="description" :label="$t('description')" min-width="150">
          </el-table-column>
          <el-table-column prop="createUserId" :label="$t('common.createUser')" min-width="150">
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('common.createTime')" width="200"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column :label="$t('common.action')" width="230">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="normal-btn btn-bluelight"
                         @click="handleDetail(scope.row)" :disabled="isButtonEnabled('provider:update')">
                {{ $t('option.update') }}
              </el-button>
              <el-button size="mini" type="primary" class="normal-btn btn-red"
                         @click="handleDelete(scope.row)" :disabled="isButtonEnabled('provider:delete')">
                {{ $t('option.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="pagination" @current-change="loadDeviceTableData"
                       :page-size="pageSize"
                       :current-page.sync="pageNumber" layout="total, prev, pager, next, jumper"
                       :total="totalDevice"></el-pagination>

      </el-row>
    </div>
    <el-dialog :title="$t('addProvider')" :visible.sync="ui.dialogVisible" width="650px" class="addDio">
      <el-form :model="editForm" label-width="120px" :rules="editFormRule" style="margin-right: 40px" ref="editForm">
        <div>
          <el-form-item :label="$t('providerCode')" prop="code" size="mini">
            <el-input v-model="editForm.code" size="mini" readonly></el-input>
          </el-form-item>
          <el-form-item :label="$t('providerName')" prop="name" size="mini">
            <el-input v-model="editForm.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item :label="$t('description')" prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancellation()">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleUpdate()">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('editProvider')" :visible.sync="ui.uploadDialogVisible" width="700px" class="addDio">
      <el-form :model="addForm" :rules="addFormRule" label-width="130px" ref="addForm" label-position="left"
               style="margin: 20px 40px">
        <el-form-item :label="$t('providerCode')" prop="code" size="mini">
          <el-input v-model="addForm.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('providerName')" prop="name" size="mini">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('description')" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleAddOrUpdate()">{{ $t('common.ok') }}</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import * as Utils from '../../utils';
import i18n from '../i18n';
import moment from 'moment';

@Component
export default class Device extends Vue {
  ui = {
    loading: false,
    dialogVisible: false,
    uploadDialogVisible: false,
    reportDialogVisible: false
  };

  addForm = {
    code: '',
    name: '',
    description: '',
    userCreated: ''
  };

  editForm = {
    id: '',
    code: '',
    name: '',
    description: '',
    userCreated: ''
  };
  defaultPageSize = 10;
  pageNumber = 1;
  pageSize = this.defaultPageSize;
  queryDeviceForm = {
    name: ''
  };
  tableDeviceData = [];
  pageDeviceNumber = 1;
  pageDeviceSize = this.defaultPageSize;
  totalDevice = 0;
  userName = '';
  uploadCancel: any;
  groupId = null as any;

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  addFormRule = {
    code: [{
      required: true,
      message: i18n.t('login.userisnull'),
      trigger: 'blur'
    },
      {validator: this.validateCode, trigger: "blur"}],
    name: [{
      required: true,
      message: i18n.t('login.pwdisnull'),
      trigger: 'blur'
    }],
    description: [{
      required: true,
      message: i18n.t('login.pwdisnull'),
      trigger: 'blur'
    }]
  };

  editFormRule = {
    code: [{
      required: true,
      message: i18n.t('login.userisnull'),
      trigger: 'blur'
    }],
    name: [{
      required: true,
      message: i18n.t('login.pwdisnull'),
      trigger: 'blur'
    }],
    description: [{
      required: true,
      message: i18n.t('login.pwdisnull'),
      trigger: 'blur'
    }]
  };

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  validateCode(rule: any, value: any, callback: any) {
    if (value.length != 5) {
      callback(new Error("Mã chỉ phải đủ 5 ký tự"));
    } else {
      callback();
    }
  }

  async handleUpdate() {
    var result = await Utils.validateForm(this.$refs.editForm);
    if (!result) return;
    this.editForm.userCreated = this.userName
    let record = this.editForm;
    let ret = await Utils.doPut(this, '/api/admin/provider', record);
    if (ret.success) {
      Utils.showSuccess("Cập nhật thành công!");
    } else {
      Utils.showWarning("Cập nhật không thành công: " + ret.message);
    }
    this.ui.dialogVisible = false;
    this.loadDeviceTableData();
  }

  async handleAddOrUpdate() {
    var result = await Utils.validateForm(this.$refs.addForm);
    if (!result) return;
    this.addForm.userCreated = this.userName
    let record = this.addForm;
    let ret = await Utils.doPost(this, '/api/admin/provider', record);
    if (ret.success) {
      Utils.showSuccess("Thêm thành công!");
      this.ui.uploadDialogVisible = false;
    } else {
      Utils.showWarning("Không thành công: " + ret.message);
    }

    this.loadDeviceTableData();
  }

  async mounted() {
    let userString = sessionStorage.getItem("user");
    if (userString) {
      let user = JSON.parse(userString);
      this.userName = user.userName;
      this.groupId = user.groupId;
    }
    await this.loadDeviceTableData();
  };

  handleSearch() {
    this.pageDeviceSize = this.defaultPageSize;
    this.pageDeviceNumber = 1;
    this.loadDeviceTableData()
  }

  async handleDetail(row: any) {
    this.ui.dialogVisible = true;
    this.editForm.name = row.providerName;
    this.editForm.code = row.providerCode;
    this.editForm.description = row.description;
    this.editForm.id = row.id;
  };

  async loadDeviceTableData() {
    let record = {name: ''};
    record.name = this.queryDeviceForm.name;
    let param = `pageNo=${this.pageNumber}&pageSize=${this.pageSize}${Utils.queryFormWrapper(record)}`;
    let result = await Utils.doGet(this, `/api/admin/provider?${param}`)
    if (result.success) {
      this.tableDeviceData = result.data.content;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
    this.totalDevice = result.data.totalElements;
  };

  async handleDelete(row: any) {
    var roleId = row.id;
    let confirmed = await Utils.confirm(this, String(i18n.t('common.deleteConfirm')), String(i18n.t('common.confirm')));
    if (confirmed) {
      var result = await Utils.doDelete(this, '/api/admin/provider/' + roleId, {});
      if (!result.success)
        Utils.showWarning(String(i18n.t('common.deleteFail')) + result.message);
      else {
        Utils.showSuccess(String(i18n.t('common.deleteSuccess')));
        this.loadDeviceTableData();
      }
    } else {
      console.log("canceled.");
    }
  };

  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    if (source == null) {
      return '';
    }
    return moment(source).format('YYYY-MM-DD HH:mm:ss');
  };

  openUploadDialog() {
    this.ui.uploadDialogVisible = true;
    this.addForm.code = '';
    this.addForm.name = '';
    this.addForm.description = '';
  }

  handleCancellation() {
    if (this.uploadCancel != null) {
      this.uploadCancel.cancel();
    }
    this.ui.uploadDialogVisible = false;

  }
};
</script>
<style scoped lang="scss">
.activation-tab {
  text-align: center;
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

.dialog-info {
  text-align: right;
  padding-bottom: 5%;
}

.dialog-content {
  padding-left: 2%;
}
</style>
