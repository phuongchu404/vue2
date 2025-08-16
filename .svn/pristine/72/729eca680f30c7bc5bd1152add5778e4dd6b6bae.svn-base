<template>
  <div>
    <div class="search-form" style="padding-bottom: 19px">
      <header>{{ $t('Search') }}</header>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" label-width="170px">
        <el-form-item :label="$t('cardId')">
          <el-input v-model="queryForm.cardId" :placeholder="$t('cardId')" size="mini"></el-input>
        </el-form-item>
        <el-form-item align="right" style="margin-left: 220px">
          <el-button type="primary" @click="handleSearch" size="mini" :disabled="isButtonEnabled('access-card:select')">
            <i class="el-icon-search"/>{{
              $t('option.query')
            }}
          </el-button>
          <el-button type="primary" @click="handleAdd" :disabled="isButtonEnabled('access-card:insert')" size="mini">
            <i class="el-icon-circle-plus-outline"/><span>{{ $t('option.add') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-table" style="padding-bottom: 40px">
      <el-row :gutter="20">
        <el-table :data="tableData" style="width: 97%;margin-top: 10px;margin-left: 20px;margin-bottom: 20px"
                  :row-class-name="tableRowClassName" align="center" border>
          <el-table-column type="index" prop="id" :label="$t('common.index')" width="80" :index="indexMethod"></el-table-column>
          <el-table-column prop="cardId" :label="$t('cardId')" min-width="150"></el-table-column>
          <el-table-column prop="cardName" :label="$t('cardName')" min-width="150"></el-table-column>
          <el-table-column prop="description" :label="$t('permission.description')" min-width="200"></el-table-column>
          <el-table-column prop="status" :label="$t('status')" min-width="100">
            <template slot-scope="scope">
              <span v-for="item in status" v-show="item.id === scope.row.status">{{ item.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" :label="$t('common.createTime')" min-width="180"
                           :formatter="defaultTimeFormatter"></el-table-column>
          <el-table-column prop="createdUser" :label="$t('common.createUser')" min-width="180"></el-table-column>
          <el-table-column :label="$t('common.option')" :context="_self" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="normal-btn btn-red"
                         :disabled="isButtonEnabled('access-card:delete')"
                         @click="handleDelete(scope.row)">{{ _self.$t('option.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination" @current-change="loadTableData"
                       :page-size="pageSize"
                       :current-page.sync="pageNumber" layout="total, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </el-row>
    </div>

    <div>
      <el-dialog :title="$t('addCard')" :visible.sync="ui.dialogVisible" width="850px" v-loading="ui.loading"
                 :element-loading-text="$t('readerCardId')"
                 class="addDio">
        <el-form :model="editForm" label-width="150px" ref="editForm" style="padding-right: 50px" :rules="editFormRules">
          <el-form-item style="margin: 0px;padding-top: 0px" v-show="this.message.length!=0">
            <h3 style="font-size: 16px;color: #7bcb58;margin: auto;text-align: left;white-space: nowrap;"
                v-if="ui.success">
              {{ this.message }}</h3>
            <h3 style="font-size: 16px;color: red;margin: auto;text-align: left;white-space: nowrap;"
                v-else>
              {{ this.message }}</h3>
          </el-form-item>
          <el-form-item v-show="this.message1.length!=0" style="margin-top: 0px;padding-top: 0px">
            <el-label style="font-size: 16px;color: #7bcb58;margin: auto;text-align: center;white-space: nowrap;">
              {{ this.message1 }}
            </el-label>
          </el-form-item>
          <el-form-item :label="$t('cardId')" prop="cardId" v-show="false">
            <el-input v-model="editForm.cardId" autofocus readonly size="mini"></el-input>
          </el-form-item>
          <el-form-item :label="$t('cardName')" prop="cardName">
            <el-input v-model="editForm.cardName" size="mini"></el-input>
          </el-form-item>
          <el-form-item :label="$t('permission.description')" prop="description">
            <el-input v-model="editForm.description" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click.native="handleSaveOrUpdate()">{{ $t('common.ok') }}</el-button>
        </div>
      </el-dialog>
    </div>
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
    success: false
  };
  Provider: []
  editForm = {cardId: '',cardName:'', description: ''};
  queryForm = {cardId: ''};
  tableData = [];
  active: number
  row: any
  defaultPageSize = 10;
  pageNumber = 1;
  pageSize = this.defaultPageSize;
  total = 1
  socket: any;
  message = "";
  message1 = "";
  status = [
    {id: 0, name: i18n.t('active')},
    {id: 2, name: i18n.t('lost')}
  ]

  async mounted() {
    await this.loadTableData();
  };

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  async handleSearch() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadTableData();
  }

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  editFormRules = {
    cardName: [{required: true, message: i18n.t("inputCardName"), trigger: 'blur'}]
  };

  async handleAdd() {
    Utils.clearValidateForm(this.$refs.editForm);
    this.ui.dialogVisible = true;
    this.message = ""
    this.ui.addRecord = true;
    this.editForm.cardId = '';
    this.editForm.cardName = '';
    this.editForm.description = '';
    this.message1 = String(i18n.t("Vui lòng đặt thẻ visitor cần thêm vào lên đầu đọc và ấn nút 'Xác nhân'"))
  };

  async handleDelete(row: any) {
    let confirmed = await Utils.confirm(this, String(i18n.t('common.deleteConfirm')), String(i18n.t('common.confirm')));
    if (!confirmed) return;
    var cardId = row.cardId;
    var result = await Utils.doDelete(this, '/api/admin/access-card/' + cardId, {});
    if (!result.success)
      Utils.showWarning(String(i18n.t('common.deleteFail')) + String(i18n.t(result.message)));
    else {
      Utils.showSuccess(String(i18n.t('common.deleteSuccess')));
      this.loadTableData();
    }
  };

  async wsDisconnect() {
    this.socket.close();
  }

  async beforeDestroy() {
    this.wsDisconnect();
  }


  async handleSaveOrUpdate() {
    let validated = await utils.validateForm(this.$refs.editForm);
    if (!validated) return;
    this.message = "";
    this.message1 = "";
    this.ui.loading = true;
    this.socket = new WebSocket("ws://localhost:16002/card-id-ws");
    this.socket.onopen = () => {
      console.log("connected");
    };
    this.socket.onerror = () => {
      console.log("connected failed");
      Utils.showWarning(String(i18n.t('connectServiceFailed')));
      this.ui.success = false
      this.message = String(i18n.t('connectServiceFailed'))
      this.ui.loading = false
    };
    this.socket.onmessage = (data: any) => {
      let arr = data.data as any;
      var obj = JSON.parse(arr);
      if (obj.success) {
        this.wsDisconnect()
        let cardId = obj.data
        let record = {} as any
        record = this.editForm;
        record.cardId = cardId
        this.handleSaveData(record)
      } else {
        this.ui.success = false
        this.message = String(i18n.t('Lấy thông tin thẻ thất bại'));
        Utils.showWarning(String(i18n.t('Lấy thông tin thẻ thất bại')));
        this.ui.loading = false;
      }
    };
    // this.ui.dialogVisible = false;
  };

  async handleSaveData(record: any) {
    let result = await Utils.doPost(this, '/api/admin/access-card', record);
    if (!result.success) {
      Utils.showWarning(String(i18n.t('common.insertFail')) + " " + String(i18n.t(result.message)));
      this.ui.success = false
      this.message = String(i18n.t('common.insertFail')) + " " + String(i18n.t(result.message));
      this.message1 = String(i18n.t('Vui lòng đặt thẻ ra/vào khác cần thêm vào lên đầu đọc'));
      this.ui.loading = false;
      this.ui.dialogVisible = true;

    } else {
      this.ui.success = true
      this.message = String(i18n.t('Thẻ')) + " " + record.cardId + " " + String(i18n.t('đã được thêm thành công vào hệ thống'));
      this.message1 = String(i18n.t('Vui lòng đặt thẻ ra/vào khác cần thêm vào lên đầu đọc'));
      Utils.showSuccess(String(i18n.t('common.insertSuccess')) + ". " + String(i18n.t('Thẻ')) + " " + record.cardId + " " + String(i18n.t('đã được thêm thành công vào hệ thống')));
      this.ui.loading = false;
      this.editForm.cardName = '';
      this.editForm.description = '';
      this.loadTableData();
    }
  }

  indexMethod(index: number) {
    return this.pageSize * (this.pageNumber - 1) + index + 1;
  }

  async loadTableData() {
    let param = `pageNo=${this.pageNumber}&pageSize=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`;
    let result = await Utils.doGet(this, `/api/admin/access-card?${param}`);
    if (result.success) {
      this.tableData = result.data.content;
    } else {
      Utils.showWarning(String(i18n.t('common.insertSuccess')));
    }
  };


  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    return Utils.formatDateString(source);
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
