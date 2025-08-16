<template>
  <div>
    <div class="search-form" style="padding-bottom: 19px">
      <header>{{ $t('Search') }}</header>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" label-width="190px">
        <!--        <el-form-item :label="$t('status')">-->
        <!--          <el-select v-model="queryForm.status" value-key="queryForm.status" filterable clearable-->
        <!--                     :placeholder="$t('status')" size="mini" style="width:109%">-->
        <!--            <el-option-->
        <!--                v-for="item in status"-->
        <!--                :key="item.id"-->
        <!--                :label="item.name"-->
        <!--                :value="item.id">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-row>
          <el-form-item :label="$t('common.checkInTimeFrom')" style="margin-right: 171px">
            <el-date-picker size="mini" style="width: 100%"
                            v-model="queryForm.dateTime1"
                            type="date"
                            :placeholder="$t('common.checkInTimeFrom')"
                            value-format="dd-MM-yyyy">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common.checkInTimeTo')">
            <el-date-picker size="mini" style="width: 100%"
                            v-model="queryForm.dateTime2"
                            type="date"
                            :placeholder="$t('common.checkInTimeTo')"
                            value-format="dd-MM-yyyy">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="$t('visitor')" style="margin-right: 200px">
            <el-input v-model="queryForm.visitorName" :placeholder="$t('user.userName')" size="mini"
                      style="width:117%"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 190px">
            <el-button type="primary" @click="handleSearch" size="mini"
                       :disabled="isButtonEnabled('report:in-out:select')"><i class="el-icon-search"/>{{
                $t('option.query')
              }}
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
    <div class="page-table" style="padding-bottom: 40px;margin-bottom: 15px">
      <el-row :gutter="20">
        <el-table :data="tableData" style="width: 97%;margin-top: 10px;margin-left: 20px;"
                  :row-class-name="tableRowClassName" align="center" border>
          <el-table-column type="index" prop="id" :label="$t('common.index')" width="80"
                           :index="indexMethod"></el-table-column>
          <el-table-column prop="visitorId" :label="$t('visitorNo')" min-width="80"></el-table-column>
          <el-table-column prop="visitorName" :label="$t('visitor')" min-width="180"></el-table-column>
          <el-table-column prop="cardId" :label="$t('cardName')"></el-table-column>
          <!--          <el-table-column prop="status" :label="$t('status')" width="120">-->
          <!--            <template slot-scope="scope">-->
          <!--              <span v-for="item in status" v-show="item.id == scope.row.status" style="font-size: 15px">{{-->
          <!--                  item.name-->
          <!--                }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column prop="checkInTime" :label="$t('common.checkInTime')"
                           :formatter="defaultTimeFormatter" width="200"></el-table-column>
          <el-table-column prop="checkOutTime" :label="$t('common.checkOutTime')"
                           :formatter="defaultTimeFormatter" width="200"></el-table-column>
        </el-table>
        <el-pagination class="pagination" @current-change="loadTableData"
                       :page-size="pageSize"
                       :current-page.sync="pageNumber" layout="total, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import * as Utils from '../../utils';
import i18n from '../i18n';
import moment from "moment";
import Axios from "axios/index";

@Component
export default class CheckInCheckOut extends Vue {
  ui = {
    loading: false,
    dialogVisible: false,
  };

  tableData = [];
  total = 0
  date = new Date()
  date1 = new Date()
  lastWeek = '' + moment(this.date.setDate(new Date().getDate() - 7)).format('DD-MM-YYYY');
  nextDay = '' + moment(this.date1.setDate(new Date().getDate() + 1)).format('DD-MM-YYYY');
  queryForm = {
    visitorName: "",
    status: "",
    dateTime1: this.lastWeek,
    dateTime2: this.nextDay,
    // dateTime3: this.lastWeek,
    // dateTime4: this.nextDay,
  }
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

  status = [
    {id: 0, name: i18n.t("Borrow")},
    {id: 1, name: i18n.t("Return")},
    {id: 2, name: i18n.t("lost")}
  ]

  statusNDAs = [
    {id: 0, name: i18n.t("Đã ký")},
    {id: 1, name: i18n.t("Chưa ký")},
    {id: 2, name: i18n.t("Hết hạn")},
  ]

  defaultPageSize = 10;
  pageNumber = 1;
  pageSize = this.defaultPageSize;

  indexMethod(index: number) {
    return this.pageSize * (this.pageNumber - 1) + index + 1;
  }


  async mounted() {
    await this.loadTableData();
    await this.loadVisitorTableData();
    await this.loadProvider();
  };

  private async loadTableData() {
    let param = `pageNo=${this.pageNumber}&pageSize=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`;
    let result = await Utils.doGet(this, `/api/admin/visitor-card?${param}`);
    if (result.success) {
      this.tableData = result.data.content;
      this.total = result.data.totalElements
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async handleDetai(row: any) {
    this.ui.dialogVisible = true;
    this.info = row;
    console.log(this.info)
  }

  async handleSearch() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadTableData();
  }

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

  async handleExport() {
    let record = {} as any;
    record.visitorName = this.queryForm.visitorName;
    record.status = this.queryForm.status;
    record.dateTime1 = this.queryForm.dateTime1;
    record.dateTime2 = this.queryForm.dateTime2;
    let param = `${Utils.queryFormWrapper(record)}`;
    Axios({
      url: `/api/admin/visitor-card/export?${param}`, //your url
      method: 'POST',
      data: null,
      responseType: 'blob', // important
    }).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      var file = "Thong ke khach ra vao.xlsx";
      link.setAttribute('download', file); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    return Utils.formatDateString(source);
  };

  documentTypes = [
    {id: 1, name: i18n.t('Citizen Identity Card')},
    {id: 2, name: i18n.t('Pass post')},
    {id: 3, name: i18n.t('Other')},
  ]

  provider: []
  queryForm2 = {} as any;
  tableData2 = [];
  pageNumber2 = 1;
  pageSize2 = this.defaultPageSize;
  total2 = 0;

  ui2 = {
    loading: false,
    dialogVisible: false,
  }

  handleSearch2() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadVisitorTableData()
  }

  async loadVisitorTableData() {
    let param = `pageNo=${this.pageNumber2}&pageSize=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`
    let result = await Utils.doGet(this, `/api/admin/visitor?${param}`);
    if (result.success) {
      this.tableData2 = result.data.content;
      this.total2 = result.data.totalElements;
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
