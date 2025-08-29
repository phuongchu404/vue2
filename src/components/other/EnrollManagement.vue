<template>
  <div>
    <div class="search-form">
      <header>{{ $t('Search') }}</header>
      <el-form :model="queryForm" label-position="right" label-width="180px"
               size="small" ref="queryForm" :inline="true" class="demo-form-inline">
        <el-row>
          <el-form-item :label="$t('user.realName')" style="margin-right: 200px">
            <el-input v-model="queryForm.fullName" clearable size="mini"
                      class="query-form-input"
                      style="width:103%">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('common.idcardNo')" style="margin-right: 212px">
            <el-input v-model="queryForm.idNumber" clearable type="number" size="mini"
                      style="width:103%">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="$t('common.from')" style="margin-right: 185px">
            <el-date-picker size="mini" style="width: 96%"
                            v-model="queryForm.createDateFrom"
                            type="date"
                            :placeholder="$t('common.from')"
                            value-format="dd-MM-yyyy">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common.to')">
            <el-date-picker size="mini" style="width: 96%"
                            v-model="queryForm.createDateTo"
                            type="date"
                            :placeholder="$t('common.to')"
                            value-format="dd-MM-yyyy"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item style="margin-left: 180px">
            <el-button type="primary" size="mini" @click="handleSearch()"
                       :disabled="isButtonEnabled('report:enroll:select')"><i
                class="el-icon-search"></i>{{ $t("option.query") }}
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <!--Table Area-->
    <div class="page-table">
      <el-row :gutter="20">
        <el-table :data="tableData" :loading="ui.loading" :row-class-name="tableRowClassName" stripe border>
          <el-table-column type="index" :label="$t('common.index')" width="50" :index="indexMethod"></el-table-column>
          <el-table-column prop="fullName" :label="$t('user.realName')" width="200"></el-table-column>
          <el-table-column prop="idNumber" :label="$t('common.idcardNo')" width="160"></el-table-column>
          <el-table-column prop="dateOfBirth" :label="$t('common.dateOfBirth')" :formatter="defaultFormatter"
                           width="120"></el-table-column>
          <el-table-column prop="gender" :label="$t('common.gender')" width="110"></el-table-column>
          <el-table-column prop="address" :label="$t('citizen-card.address')" width="250"></el-table-column>
          <el-table-column prop="issuedBy" :label="$t('driving.issuedBy')" width="250"></el-table-column>
          <el-table-column prop="dateOfIssuance" :label="$t('driving.dateRange')"
                           :formatter="defaultFormatter" width="120"></el-table-column>
          <el-table-column prop="dateOfExpiry" :label="$t('citizen-card.dateOfExpiry')" :formatter="defaultFormatter"
                           width="130"></el-table-column>
          <el-table-column prop="createDate" :label="$t('enrollment.createDate')" :formatter="defaultFormatter"
                           width="130"></el-table-column>
          <el-table-column :label="$t('common.option')" :context="_self" width="130">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="normal-btn btn-bluelight"
                         @click="handleDetailsInfo(scope.row)" :loading="ui.detailsLoading">{{
                  _self.$t('common.detail')
                }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination" @current-change="loadDeviceTableData"
                       :page-size="pageSize"
                       :current-page.sync="pageNumber" layout="total, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </el-row>
    </div>
    <el-dialog :title="$t('common.information')" :visible.sync="ui.dialogVisible" :close-on-click-modal="false"
               width="1050px" class="addDio">
      <el-form :model="enroll" label-width="130px" ref="editForm">
        <el-row v-if="enroll">
          <el-col style="margin-left:50px; width: 45%;float: left">
            <el-form-item :label="$t('user.realName')" prop="fullName">
              <el-input v-model="enroll.fullName" size="mini" style="width: 70%" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('citizen-card.address')" prop="address">
              <el-input v-model="enroll.address" size="mini" style="width: 70%" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('birth.placeOfBirth')" prop="placeOfBirth">
              <el-input v-model="enroll.placeOfBirth" size="mini" style="width: 70%" readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.gender')" prop="gender">
              <el-select v-model="enroll.gender"
                         filterable
                         size="mini" style="width: 180px"
                         readonly>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.dateOfBirth')" prop="dateOfBirth">
              <el-date-picker size="mini" style="width: 180px"
                              v-model="enroll.dateOfBirth"
                              type="date"
                              value-format="dd-MM-yyyy"
                              readonly>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style=" width: 45%;float: left">
            <el-form-item :label="$t('common.idcardNo')" prop="idNumber">
              <el-input v-model="enroll.idNumber"
                        type="number"
                        maxlength="12"
                        style="width: 70%"
                        size="mini"
                        readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('driving.issuedBy')" prop="issuedBy">
              <el-input v-model="enroll.issuedBy"
                        style="width: 70%"
                        size="mini"
                        readonly></el-input>
            </el-form-item>
            <el-form-item :label="$t('driving.dateRange')" prop="dateOfIssuance">
              <el-date-picker size="mini" style="width: 180px"
                              v-model="enroll.dateOfIssuance"
                              type="date"
                              value-format="dd-MM-yyyy"
                              readonly>
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('citizen-card.dateOfExpiry')" prop="dateOfExpiry">
              <el-date-picker size="mini" style="width: 180px"
                              v-model="enroll.dateOfExpiry"
                              type="date"
                              value-format="dd-MM-yyyy"
                              readonly>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="min-height: 280px">
          <el-col style="width: 48% ; display: flex ; flex-direction: column">
            <h4 style="text-align: center">{{ $t('image') }}</h4>
            <img style="height: 250px ; width: auto ; margin: auto ; border-radius: 10px"
                 :src="enrollImages.length > 0 && getItem(this.enrollImages.find(item => item.index == 11))"/>

          </el-col>
          <el-col style="width: 48%">
            <h4 v-if="this.enrollImages.find(item => item.index == 12)"
                style="text-align: center">{{ $t('enrollment.irisImage') }}</h4>
          </el-col>
        </el-row>
        <el-row v-if="ui.dialogVisible" style="min-height: 280px ; margin-top: 50px">
          <el-col style="width: 46% ; margin: 20px">
            <h4 style="text-align: center">{{ $t('enrollment.leftFingerprint') }}</h4>
            <div style="display: flex; flex-wrap: wrap;  justify-content: center">
              <div v-for="(item, index) in enrollImages" :key="index" style="margin: 10px"
                   v-if="item.index >= 6 && item.index <11">
                <img :src="item.src && convertBase64ToImage(item.src)" height="100" alt="Image">
                <p>{{ item && getNameOfListFinger(item.index) }}</p>
              </div>
            </div>
          </el-col>
          <el-col style="width: 46% ;  margin: 20px">
            <h4 style="text-align: center">{{ $t('enrollment.rightFingerprint') }}</h4>
            <div style="display: flex; flex-wrap: wrap; justify-content: center">
              <div v-for="(item, index) in enrollImages" :key="index" style="margin: 10px"
                   v-if=" item.index >= 1 && item.index < 6 ">
                <img :src="item.src && convertBase64ToImage(item.src)" height="100" alt="Image">
                <p>{{ item && getNameOfListFinger(item.index) }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
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
import {formatDateString} from "../../utils";
import axios from "axios";

@Component({
  methods: {formatDateString}
})
export default class Device extends Vue {
  ui = {
    loading: false,
    detailsLoading: false,
    isDownload: false,
    dialogVisible: false,
  }

  date = new Date()
  date1 = new Date()
  lastWeek = '' + moment(this.date.setDate(new Date().getDate() - 7)).format('DD-MM-YYYY');
  nextDay = '' + moment(this.date1.setDate(new Date().getDate() + 1)).format('DD-MM-YYYY');

  enrollImages: any = []

  enroll: any

  queryForm = {
    fullName: "",
    idNumber: "",
    createDateFrom: this.lastWeek,
    createDateTo: this.nextDay,
  } as any;

  tableData = [];
  pageNumber = 1;
  pageSize = 10;
  total = 0;

  convertBase64ToImage(base64: string) {
    if (base64.trim() !== "") {
      return `data:image/jpeg;base64,${base64}`;
    } else {
      return '';
    }
  }

  getItem(data: any) {
    return this.convertBase64ToImage(data.src)
  }

  getNameOfListFinger(index: number) {
    switch (index) {
      case 1 :
        return String(i18n.t('enrollment.thumbFinger'))
      case 2 :
        return String(i18n.t('enrollment.indexFinger'))
      case 3 :
        return String(i18n.t('enrollment.middleFinger'))
      case 4 :
        return String(i18n.t('enrollment.ringFinger'))
      case 5 :
        return String(i18n.t('enrollment.littleFinger'))
      case 6 :
        return String(i18n.t('enrollment.thumbFinger'))
      case 7 :
        return String(i18n.t('enrollment.indexFinger'))
      case 8 :
        return String(i18n.t('enrollment.middleFinger'))
      case 9 :
        return String(i18n.t('enrollment.ringFinger'))
      case 10 :
        return String(i18n.t('enrollment.littleFinger'))
      default :
        return ""
    }
  }

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  indexMethod(index: number) {
    return this.pageSize * (this.pageNumber - 1) + index + 1;
  }

  formatDate(dateString: any) {
    return moment(dateString, 'YYMMDD').format('DD/MM/YYYY');
  }

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async handleDetailsInfo(data: any) {
    this.ui.detailsLoading = true
    let res = await Utils.doGet(this, `api/admin/enrollment/getEnroll?id=${data.id}`);
    if (res.data) {
      this.ui.dialogVisible = true;
      this.enrollImages = Object.entries(res.data).map(([key, value]) => ({index: parseInt(key), src: value}));
      this.enroll = data;
      this.ui.detailsLoading = false
    } else {
      this.ui.detailsLoading = false
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }
  async mounted() {
    await this.loadDeviceTableData();
  };

  handleSearch() {
    this.loadDeviceTableData()
  }

  async loadDeviceTableData() {
    let param = `page=${this.pageNumber}&size=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`
    let result = await Utils.doGet(this, `/api/admin/enrollment?${param}`);
    if (result.success) {
      this.tableData = result.data.content;
      this.total = result.data.totalElements;
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
    return moment(source).format('YYYY-MM-DD');
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
