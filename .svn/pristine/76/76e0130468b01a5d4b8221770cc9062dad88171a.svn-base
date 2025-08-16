<template>
  <div style="width: 100%;height: 100%"
  >
    <el-row :gutter="16" class="el-row-card" type="flex" style="height: 100%" v-loading="ui.loading"
            :element-loading-text="$t('readerCardId')">
      <el-col>
        <el-row class="el-row-card">
          <el-card class="box-card">
            <h1 style="margin-left: 10px;margin-bottom: 35px;padding-bottom:10px;border-bottom: 1px solid #e5e5e5;">
              {{ $t('return.title') }}</h1>
            <div style="width: 100%;padding-top: 20px;margin-bottom: 30px;font-size: 24px">
              <h3 style="text-align: center;color: #7bcb58;white-space: normal;height: 50px;width: auto;text-align: center;font-size: 17px;margin-left: -150px"
                  v-if="ui.success">
                {{ this.message }}</h3>
              <h3 style="text-align: center;color: red;white-space: normal;height: 50px;width: auto;text-align: center;font-size: 17px;margin-left: -150px"
                  v-else>
                {{ this.message }}</h3>
              <div style="width: 30%;margin: auto;">
                <el-button class="button button2" slot="reference" @click="handleReturnCard"
                           :disabled="isButtonEnabled('visitor:return-card:return')">
                  <img style="float: left;margin: 0px;padding:0px;height: 38px"
                       src="../../assets/card-return.png"
                  />
                  <span
                      style="float: right;margin: auto;width: 180px;line-height: 70px;text-align: center;position:relative;top: -14px;right: 0px;font-size: 18px">{{
                      $t('return.title')
                    }}</span>
                </el-button>
              </div>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-show="ui.showdata">
      <el-col>
        <el-row class="el-row-card">
          <el-card class="box-card" style="padding-bottom: 60px;margin-bottom: 10px">
            <h1 style="margin-left: 10px;margin-bottom: 35px;">{{ $t('returnCard') }}</h1>
            <div style="width: 100%">
              <el-table :data="dataVisitor" style="width: 97%;margin-top: 10px;margin-left: 20px;"
                        align="center"
                        :row-class-name="tableRowClassName" stripe border>
                <el-table-column type="index" :label="$t('index')" width="80"></el-table-column>
                <el-table-column prop="documentType" :label="$t('documentType')" min-width="120">
                  <template slot-scope="scope">
                    <span v-for="item in documentTypes" v-show="item.id==scope.row.documentType">{{ item.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="visitorId" :label="$t('No')" min-width="130">
                </el-table-column>
                <el-table-column prop="visitorName" :label="$t('fullname')" min-width="190">
                </el-table-column>
                <el-table-column prop="cardId" :label="$t('cardId')" min-width="130">
                </el-table-column>
                <el-table-column prop="checkInTime" :label="$t('common.checkInTime')" :formatter="defaultTimeFormatter"
                                 min-width="120">
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
    <div class="page-table" style="padding-left: 15px">
      <el-row :gutter="20">
        <h1 style="margin-left: 20px;margin-bottom: 35px;margin-top: 30px">{{ $t('return.listVisitorBorrow') }}</h1>
        <el-form :model="queryForm" label-position="right" label-width="170px"
                 size="small" ref="queryForm" :inline="true" class="demo-form-inline">
          <el-row>
            <el-form-item :label="$t('visitor')" style="margin-right: 200px">
              <el-input v-model="queryForm.visitorName" clearable size="mini" :placeholder="$t('visitor')"
                        class="query-form-input"></el-input>
            </el-form-item>
            <el-form-item :label="$t('documentType')">
              <el-select v-model="queryForm.documentType" value-key="queryDeviceForm.documentType" filterable
                         clearable
                         :placeholder="$t('documentType')" size="mini" style="width:103%">
                <el-option
                    v-for="item in documentTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('No')" style="margin-right: 222px">
              <el-input v-model="queryForm.visitorId" :placeholder="$t('No')" size="mini"
                        style="width:112%">
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('common.checkInDate')">
              <el-date-picker size="mini" style="width: 96%"
                              v-model="queryForm.dateTime1"
                              type="date"
                              clearable
                              :placeholder="$t('common.checkInDate')"
                              value-format="dd-MM-yyyy"
                              format="dd-MM-yyyy">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-form-item style="margin-left: 170px">
              <el-button type="primary" size="mini" @click="handleSearch()" style="width: 100px"
                         :disabled="isButtonEnabled('visitor:return-card:select')"><i
                  class="el-icon-search"></i>{{ $t("option.query") }}
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>

        <el-table :data="dataVisitorBorrow" style="width: 97%;margin-top: 10px;margin-left: 20px; margin-bottom: 50px"
                  align="center"
                  :row-class-name="tableRowClassName" stripe border>
          <el-table-column type="index" :label="$t('index')" width="80" :index="indexMethod"></el-table-column>
          <el-table-column prop="documentType" :label="$t('documentType')" min-width="120">
            <template slot-scope="scope">
              <span v-for="item in documentTypes" v-show="item.id==scope.row.documentType">{{ item.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="visitorId" :label="$t('No')" min-width="130">
          </el-table-column>
          <el-table-column prop="visitorName" :label="$t('fullname')" min-width="190">
          </el-table-column>
          <el-table-column prop="cardId" :label="$t('cardName')" min-width="130">
          </el-table-column>
          <el-table-column prop="checkInTime" :label="$t('common.checkInTime')" :formatter="defaultTimeFormatter"
                           min-width="120">
          </el-table-column>
          <el-table-column :label="$t('common.option')" :context="_self" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="normal-btn btn-red"
                         @click="handleLost1(scope.row)">{{ _self.$t('option.lost') }}
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
      <el-dialog :title="$t('option.lost')" :visible.sync="ui.dialogVisible" width="650px"
                 class="addDio">
        <el-form :model="editForm" label-width="130px" ref="editForm" style="padding-right: 50px">
          <!--          <el-form-item :label="$t('permission.description')" prop="description">-->
          <!--            <el-input v-model="editForm.id" size="mini"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item :label="$t('permission.description')" prop="description">
            <el-input v-model="editForm.description" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click.native="handleLost()">{{ $t('common.ok') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as Utils from "../../utils";
import i18n from "../i18n";
import moment from "moment";

@Component({
  components: {},
})
export default class returnCard extends Vue {
  ui = {
    loading: false,
    showdata: false,
    dialogVisible: false,
    success: false
  }
  message = ""
  socket: any;
  dataVisitor = [] as any;
  dataVisitorBorrow = [] as any;
  documentTypes = [
    {id: 1, name: i18n.t('Căn Cước Công Dân')},
    {id: 2, name: i18n.t('Hộ Chiếu')},
    {id: 3, name: i18n.t('Giấy Tờ Khác')},
  ]
  editForm = {
    id: "",
    description: ""
  }
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  queryForm = {} as any;
  defaultPageSize = 10;

  async handleReturnCard() {
    this.message = ""
    this.ui.loading = true;
    this.ui.showdata = false;
    this.socket = new WebSocket("ws://localhost:16002/card-id-ws");
    this.socket.onopen = () => {
      console.log("connected");
    };
    this.socket.onerror = () => {
      console.log("connected failed");
      Utils.showWarning(String(i18n.t('connectServiceFailed')));
      this.message = String(i18n.t('connectServiceFailed'))
      this.ui.success = false
      this.ui.loading = false
    };

    this.socket.onmessage = (data: any) => {
      let arr = data.data as any;
      var obj = JSON.parse(arr);
      if (obj.success) {
        this.wsDisconnect()
        let cardId = obj.data
        let query = {} as any
        query.cardId = cardId
        this.handleReturn(query)
      } else {
        Utils.showWarning(String(i18n.t('Lấy thông tin thẻ thất bại')));
        this.message = String(i18n.t('Lấy thông tin thẻ thất bại'))
        this.ui.success = false
      }
    };
  }

  indexMethod(index: number) {
    return this.pageSize * (this.pageNumber - 1) + index + 1;
  }

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  async handleSearch() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadTableData()
  }

  async handleLost1(row: any) {
    this.message = ""
    this.ui.dialogVisible = true;
    this.editForm.id = row.id
    this.editForm.description = ""
  }

  async handleLost() {
    let confirmed = await Utils.confirm(this, String(i18n.t('common.lostConfirm')), String(i18n.t('common.confirm')));
    if (!confirmed) return;
    let record = {} as any;
    record = this.editForm
    var result = await Utils.doPost(this, '/api/admin/visitor-card/lost', record);
    if (!result.success) {
      Utils.showWarning(String(i18n.t('common.lostFail')) + String(i18n.t(result.message)));
      this.message = String(i18n.t('common.lostFail')) + String(i18n.t(result.message))
      this.ui.success = false
    } else {
      Utils.showSuccess(String(i18n.t('common.lostSuccess')));
      this.message = String(i18n.t('common.lostSuccess'))
      this.ui.success = true
      this.ui.dialogVisible = false;
      this.loadTableData();
    }
  }

  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    if (source == null) {
      return '';
    }
    return moment(source).format('YYYY-MM-DD HH:mm:ss');
  };

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async handleReturn(query: any) {
    let param = `cardId=${query.cardId}`;
    let result1 = await Utils.doGet(this, `/api/admin/visitor-card/getVisitorCardByCardId?${param}`);
    if (result1.success) {
      this.dataVisitor = result1.data
      this.ui.showdata = true;
      await Utils.showSuccess(String(i18n.t('common.returnSuccess')));
      this.message = String(i18n.t('common.returnSuccess'))
      this.ui.success = true
    } else {
      await Utils.showWarning(String(i18n.t('common.returnFail')) + i18n.t(result1.message));
      this.ui.loading = false;
      this.message = String(i18n.t('common.returnFail')) + i18n.t(result1.message)
      this.ui.success = false
      return
    }
    // let result = await Utils.doPut(this, `/api/admin/visitor-card`, query);
    // if (result.success) {
    //   Utils.showSuccess(String(i18n.t('common.returnSuccess')));
    // } else {
    //   if (result.code == 218) {
    //     Utils.showWarning(String(i18n.t('common.cardNotBorrow')));
    //   } else Utils.showWarning(String(i18n.t('common.returnFail')));
    // }
    this.ui.loading = false
  }

  wsDisconnect() {
    this.socket.close();
  }

  async loadTableData() {
    let param = `pageNo=${this.pageNumber}&pageSize=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`
    let result = await Utils.doGet(this, `/api/admin/visitor-card/getVisitorBorrowCard?${param}`);
    if (result.success) {
      this.dataVisitorBorrow = result.data.content;
      this.total = result.data.totalElements;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async mounted() {
    await this.loadTableData();
  }
}
</script>
<style>
.el-row-card {
  margin-bottom: 10px;
}

@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/*.box-access-card {*/
/*  height: 250px;*/
/*}*/
</style>
