<template>
  <div>
    <div class="search-form">
      <header>{{ $t('Search') }}</header>
      <el-form :model="queryForm" label-position="right" label-width="180px"
               size="small" ref="queryForm" :inline="true" class="demo-form-inline">
        <el-row>
          <el-form-item :label="$t('visitor')" style="margin-right: 200px">
            <el-input v-model="queryForm.visitorName" clearable size="mini" :placeholder="$t('visitor')"
                      class="query-form-input"></el-input>
          </el-form-item>
          <!--          <el-form-item :label="$t('provider')">-->
          <!--            <el-select v-model="queryForm.providerCode" value-key="queryDeviceForm.providerCode" filterable-->
          <!--                       clearable-->
          <!--                       :placeholder="$t('provider')" size="mini" style="width:109%">-->
          <!--              <el-option-->
          <!--                  v-for="item in provider"-->
          <!--                  :key="item.providerCode"-->
          <!--                  :label="item.providerName"-->
          <!--                  :value="item.providerCode">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item :label="$t('documentType')">
            <el-select v-model="queryForm.documentType" value-key="queryDeviceForm.documentType" filterable
                       clearable
                       :placeholder="$t('documentType')" size="mini" style="width:104%">
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
          <el-form-item :label="$t('common.registerTimeFrom')" style="margin-right: 193px">
            <el-date-picker size="mini" style="width: 96%"
                            v-model="queryForm.dateTime1"
                            type="date"
                            :placeholder="$t('common.registerTimeFrom')"
                            value-format="dd-MM-yyyy">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common.registerTimeTo')">
            <el-date-picker size="mini" style="width: 96%"
                            v-model="queryForm.dateTime2"
                            type="date"
                            :placeholder="$t('common.registerTimeTo')"
                            value-format="dd-MM-yyyy">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="$t('visitorNo')" style="margin-right: 212px">
            <el-input v-model="queryForm.visitorId" :placeholder="$t('visitorNo')" size="mini"
                      style="width:112%">
            </el-input>
          </el-form-item>
          <el-form-item style="margin-left: 180px">
            <el-button type="primary" size="mini" @click="handleSearch()"
                       :disabled="isButtonEnabled('report:visitor:select')"><i
                class="el-icon-search"></i>{{ $t("option.query") }}
            </el-button>
            <el-button type="primary" @click="handleExport" size="mini"
                       :disabled="isButtonEnabled('report:in-out:export')"><i class="el-icon-download"/>{{
                $t('common.export')
              }}
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <!--Table Area-->
    <div class="page-table">
      <el-row :gutter="20">
        <el-table :data="tableData" style="width: 97%;margin-top: 10px;margin-left: 20px;" v-loading="ui.loading"
                  align="center"
                  :row-class-name="tableRowClassName" stripe border>
          <el-table-column type="index" :label="$t('index')" width="70" :index="indexMethod"></el-table-column>
          <el-table-column prop="visitorId" :label="$t('visitorNo')" min-width="90">
          </el-table-column>
          <el-table-column prop="documentType" :label="$t('documentType')" width="170">
            <template slot-scope="scope">
              <span v-for="item in documentTypes" v-show="item.id==scope.row.documentType">{{ item.name }}</span>
              <span v-show="scope.row.documentType==3"> - {{ scope.row.cardName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="visitorName" :label="$t('fullname')" min-width="190">
          </el-table-column>
          <el-table-column prop="dateOfBirth" :label="$t('dateOfBirth')" :formatter="defaultFormatter" width="130">
          </el-table-column>
          <el-table-column prop="statusNDA" :label="$t('signatureNDA')">
            <template slot-scope="scope">
                          <span v-for="item in statusNDAs" v-show="item.id == scope.row.statusNDA"
                                style="font-size: 15px">{{ item.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="expiredNDA" :label="$t('thời hạn')" width="100">
          </el-table-column>
          <el-table-column prop="description" :label="$t('description')" min-width="150">
          </el-table-column>
          <el-table-column prop="createdTime" :label="$t('createdTime')" :formatter="defaultTimeFormatter" width="170">
          </el-table-column>
        </el-table>
        <el-pagination class="pagination" @current-change="loadDeviceTableData"
                       :page-size="pageSize"
                       :current-page.sync="pageNumber" layout="total, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </el-row>
    </div>
    <el-dialog :title="$t('visitor.Info')" :visible.sync="ui.dialogVisible" :close-on-click-modal="false"
               width="750px" class="addDio">
      <el-form :model="info" label-width="180px" style="margin-right: 50px;">
        <el-form-item :label="$t('provider')" prop="providerName">
          <el-input v-model="info.providerName" autofocus readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('documentType')" prop="documentType">
          <el-input v-model="info.documentType" autofocus readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('No')" prop="visitorId">
          <el-input v-model="info.visitorId" autofocus readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fullname')" prop="visitorName">
          <el-input v-model="info.visitorName" autofocus readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dateOfBirth')" prop="dateOfBirth">
          <el-date-picker v-model="info.dateOfBirth" size="mini" style="width: 100%" format="DD-MM-yyyy" type="date">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import * as Utils from '../../utils';
import i18n from '../i18n';
import moment from 'moment';
import Axios from "axios";

@Component
export default class Device extends Vue {
  ui = {
    loading: false,
    dialogVisible: false,
  }

  date = new Date()
  date1 = new Date()
  lastWeek = '' + moment(this.date.setDate(new Date().getDate() - 7)).format('DD-MM-YYYY');
  nextDay = '' + moment(this.date1.setDate(new Date().getDate() + 1)).format('DD-MM-YYYY');

  info = {
    providerName: '',
    documentType: '',
    visitorId: '',
    visitorName: '',
    dateOfBirth: '',
    statusNDA: '',
    expiredNDA: '',
    description: '',
  }

  description = {
    serialNumber: '',
    model: '',
    activatedBy: '',
    dateOfActivation: '',
    description: '',
    lastModifiedDate: '',
    status: '',
    groupName: ''
  };
  provider: []
  defaultPageSize = 10;
  queryForm = {
    visitorName: "",
    documentType: "",
    visitorId: "",
    dateTime1: this.lastWeek,
    dateTime2: this.nextDay,
  } as any;
  tableData = [];
  pageNumber = 1;
  pageSize = this.defaultPageSize;
  total = 0;
  userName = '';
  documentTypes = [
    {id: 1, name: i18n.t('Citizen Identity Card')},
    {id: 2, name: i18n.t('Passport')},
    {id: 3, name: i18n.t('Other Card')},
  ]

  statusNDAs = [
    {id: 0, name: i18n.t("Đã ký")},
    {id: 1, name: i18n.t("Chưa ký")},
    {id: 2, name: i18n.t("Hết hạn")},
  ]

  indexMethod(index: number) {
    return this.pageSize * (this.pageNumber - 1) + index + 1;
  }

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async handleExport() {
    let param = `${Utils.queryFormWrapper(this.queryForm)}`;
    Axios({
      url: `/api/admin/visitor/export?${param}`, //your url
      method: 'POST',
      data: null,
      responseType: 'blob', // important
    }).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      var file = "Thong ke khach.xlsx";
      link.setAttribute('download', file); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  async mounted() {
    let userString = sessionStorage.getItem("user");
    if (userString) {
      let user = JSON.parse(userString);
      this.userName = user.userName;
    }
    await this.loadDeviceTableData();
    await this.loadProvider();
  };

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  handleSearch() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadDeviceTableData()
  }

  async loadDeviceTableData() {
    let param = `pageNo=${this.pageNumber}&pageSize=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`
    let result = await Utils.doGet(this, `/api/admin/visitor?${param}`);
    if (result.success) {
      this.tableData = result.data.content;
      this.total = result.data.totalElements;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  };

  async loadProvider() {
    let result = await Utils.doGet(this, `/api/admin/provider/all`);
    if (result.success) {
      this.provider = result.data;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  };


  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    if (source == null) {
      return '';
    }
    return moment(source).format('YYYY-MM-DD HH:mm:ss');
  };

  defaultFormatter(row: any, column: any) {
    var source = row[column.property];
    if (source == null) {
      return '';
    }
    return moment(source).format('DD-MM-YYYY');
  };

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
