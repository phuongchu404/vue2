<template>
  <div  v-loading="ui.loadingCard"
        :element-loading-text="$t('readerCardId')">
    <div class="search-form" style="padding-bottom: 19px">
      <header>{{ $t('Search') }}</header>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline" label-width="160px">
        <el-row style="width: 50%;margin: auto;margin-bottom: 50px">
          <img class="imgDisplay1" :src="imageDisplay"/>
        </el-row>
        <el-row>
          <el-form-item :label="$t('visitorNo')">
            <el-input v-model="queryForm.visitorId" :placeholder="$t('visitorNo')" size="mini"
                      style="width:117%"></el-input>
          </el-form-item>
          <el-form-item :label="$t('visitor')" style="margin-left: 200px">
            <el-input v-model="queryForm.visitorName" :placeholder="$t('visitor')" size="mini"
                      style="width:117%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item style="margin-left: 160px">
            <el-button type="primary" @click="handleSearch" size="mini"><i class="el-icon-search"/>{{
                $t('option.query')
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
          <el-table-column type="index" prop="id" :label="$t('common.index')" width="70"
                           :index="indexMethod"></el-table-column>
          <el-table-column prop="cardName" :label="$t('cardName')" min-width="80"></el-table-column>
          <el-table-column prop="visitorId" :label="$t('visitorNo')" min-width="80"></el-table-column>
          <el-table-column prop="visitorName" :label="$t('visitor')" min-width="180"></el-table-column>
          <el-table-column prop="sex" :label="$t('sex')" min-width="190">
            <template slot-scope="scope">
              <span v-if="scope.row.sex===0">{{ $t('Nam') }}</span>
              <span v-else>{{ $t('Nữ') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dateOfBirth" :label="$t('dateOfBirth')" min-width="180"
                           :formatter="defaultTimeFormatter1"></el-table-column>
          <el-table-column :label="$t('common.option')" :context="_self" width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="normal-btn btn-bluelight" v-if="ui.addFace"
                         @click="handleAddFace(scope.row)">{{ _self.$t('addFace') }}
              </el-button>
              <el-button type="primary" @click="handleVisitorCard" size="mini" v-else>{{
                  $t('Cấp mượn thẻ')
                }}
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
  </div>
</template>

<script lang='ts'>
import Component from "vue-class-component";
import Vue from "vue";
import * as Utils from "../../utils";
import i18n from "../i18n";
import * as utils from "../../utils";

@Component
export default class NoFace extends Vue {
  ui = {
    loading: false,
    addFace: true,
    loadingCard: false
  }
  defaultPageSize = 10;
  pageNumber = 1;
  pageSize = this.defaultPageSize;
  tableData = [] as any
  total = 0
  queryForm = {} as any
  imageDisplay = ''
  message = ''
  idCardNo = ''
  socket: any;

  async handleVisitorCard() {
    this.ui.loadingCard = true
    this.socket = new WebSocket("ws://localhost:16002/card-id-ws");
    this.socket.onopen = () => {
      console.log("connected");
    };
    this.socket.onerror = () => {
      console.log("connected failed");
      this.message = String(i18n.t('connectServiceFailed'));
      Utils.showWarning(String(i18n.t('connectServiceFailed')));
      this.ui.loadingCard = false
    };
    this.socket.onmessage = (data: any) => {
      let arr = data.data as any;
      var obj = JSON.parse(arr);
      if (obj.success) {
        this.wsDisconnect()
        let cardId = obj.data
        if (cardId != "") {
          let query = {} as any;
          query.visitorId = this.idCardNo
          query.cardId = cardId
          this.handleBorror(query)
        }
      } else {
        Utils.showWarning(String(i18n.t('getCardIdFailed')));
        this.message = String(i18n.t('getCardIdFailed'));
        this.ui.loadingCard = false
      }
    };
  }

  wsDisconnect() {
    this.socket.close();
  }

  async handleBorror(query: any) {
    let result = await Utils.doPost(this, `/api/admin/visitor-card`, query);
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.borrowSuccess')));
      this.message = String(i18n.t('common.borrowSuccess'));
      this.$router.push({path: `/check-visitor`})
      this.$store.commit('setImage', {image: ''})
      this.$store.commit('setTemplate', {template: ''})
    } else {
      if (result.code == 230) {
        Utils.showWarning(String(i18n.t('common.CardNotExisted')));
        this.message = String(i18n.t('common.CardNotExisted'));
      } else if (result.code == 338) {
        Utils.showWarning(String(i18n.t('common.cardIsBorrow')));
        this.message = String(i18n.t('common.cardIsBorrow'));
      } else Utils.showWarning(String(i18n.t('common.borrowFail')));
    }
    this.ui.loadingCard = false
  }

  private async loadTableData() {
    let param = `pageNo=${this.pageNumber}&pageSize=${this.pageSize}${Utils.queryFormWrapper(this.queryForm)}`;
    let result = await Utils.doGet(this, `/api/admin/visitor/not-face?${param}`);
    if (result.success) {
      this.tableData = result.data.content;
      this.total = result.data.totalElements
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async handleAddFace(row: any) {
    let record = {} as any
    record.id = row.id;
    record.image = this.$store.getters.getImageData;
    record.template = this.$store.getters.getTemplateData;
    let result = await utils.doPost(
        this,
        "/api/admin/visitor/add-image",
        record
    );
    if (!result.success) {
      Utils.showWarning(String(i18n.t('common.insertFail')) + String(i18n.t(result.message)).toLowerCase());
    } else {
      this.$store.commit('setImage', {image: ''})
      this.$store.commit('setTemplate', {template: ''})
      Utils.showSuccess(String(i18n.t('common.insertVisitorSuccess')) + ". " + String(i18n.t('Vui lòng đặt thẻ ra vào lên trên thiết bị')).toLowerCase())
      // this.tableData = row;
      // console.log(this.tableData)
      this.tableData = [];
      this.tableData.push(row)
      this.idCardNo = row.visitorId
      this.ui.addFace = false
    }
  }

  indexMethod(index: number) {
    return this.pageSize * (this.pageNumber - 1) + index + 1;
  }

  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async mounted() {
    await this.loadTableData();
    this.imageDisplay = "data:image/jpeg;base64," + this.$store.getters.getImageData
  }

  defaultTimeFormatter(row: any, column: any) {
    var source = row[column.property];
    return Utils.formatDateString(source);
  };

  defaultTimeFormatter1(row: any, column: any) {
    var source = row[column.property];
    return Utils.formatDateString1(source);
    ;
  };


  async handleSearch() {
    this.pageSize = this.defaultPageSize;
    this.pageNumber = 1;
    this.loadTableData();
  }
}
</script>

<style scoped>
.imgDisplay1 {
  margin: auto;
  width: 512px;
  height: 320px;
}
</style>
