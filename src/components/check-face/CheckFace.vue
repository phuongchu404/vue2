<template>
  <div v-loading="ui.loading"
       :element-loading-text="$t('readerCardId')"
  >
    <el-row :gutter="16" class="el-row-card" type="flex">
      <el-col style="margin: 10px">
        <el-row class="el-row-card" :gutter="20">
          <el-card class="box-card">
            <h2 style="width: auto;margin: auto;text-align: left;top:30px;border-bottom: 1px solid #e5e5e5;padding: 0px 0px 10px 0px">
              {{ $t('check.info') }}</h2>
            <h3 class="message-success" v-if="ui.success">{{ this.message }}</h3>
            <h3 class="message-red" v-else>{{ this.message }}</h3>
            <div style="width: 600px;margin: auto">
              <img class="imgDisplay2" src="../../assets/face-recognition.png" v-if="this.imageDisplay==null"/>
              <img class="imgDisplay2" :src="imageDisplay" v-else/>
              <div style="margin-left: 150px;margin-top: 50px;margin-bottom: 50px">
                <el-button class="normal-btn btn-greenlight" @click="wsImage">{{ $t('Check Visitor') }}
                </el-button>
                <el-button class="normal-btn btn-blue" @click="next">{{ $t('Bỏ qua') }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

    <el-row v-show="this.tableData.length!==0">
      <el-col>
        <el-row>
          <div class="page-table">
            <el-row :gutter="20">
              <el-table :data="tableData" style="width: 97%;margin-top: 50px;margin-left: 20px;margin-bottom: 10px"
                        v-loading="ui.loading"
                        align="center"
                        :row-class-name="tableRowClassName" stripe border>
                <el-table-column type="index" :label="$t('index')" width="70"></el-table-column>
                <el-table-column prop="visitorId" :label="$t('IdVisitor')" min-width="90">
                </el-table-column>
                <el-table-column prop="documentName" :label="$t('documentType')" width="170">
                  <!--                  <template slot-scope="scope">-->
                  <!--                    <span v-for="item in documentTypes" v-show="item.id==scope.row.documentType">{{ item.name }}</span>-->
                  <!--                    <span v-show="scope.row.documentType==3"> - {{ scope.row.cardName }}</span>-->
                  <!--                  </template>-->
                </el-table-column>
                <el-table-column prop="image" :label="$t('image')" width="180px">
                  <template slot-scope="scope">
                    <el-image
                        style="width: 150px; height: 150px"
                        :src=scope.row.image
                        fit="contain"></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="visitorName" :label="$t('fullname')" min-width="190">
                </el-table-column>

                <el-table-column prop="dateOfBirth" :label="$t('dateOfBirth')" :formatter="defaultFormatter"
                                 width="130">
                </el-table-column>
                <el-table-column prop="description" :label="$t('description')" min-width="150">
                </el-table-column>
                <el-table-column :label="$t('common.option')" :context="_self" width="300">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" class="normal-btn btn-bluelight"
                               @click="handleDetail(scope.row)">{{ _self.$t('option.Detail') }}
                    </el-button>
                    <el-button class="normal-btn btn-greenlight" @click="handleVisitorCard(scope.row)" size="mini"
                               :disabled="isButtonEnabled('visitor:register:visitor:card')">
                      {{ $t('Cấp mượn thẻ') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog :title="$t('option.Detail')" :visible.sync="ui.dialogVisible" width="60%" class="addDio">
      <el-form :model="editForm" label-width="200px" ref="editForm" style="padding-right: 50px">
        <el-form-item :label="$t('IdVisitor')">
          <el-input v-model="editForm.visitorId" autofocus readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('documentType')">
          <el-input v-model="editForm.documentName" readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fullname')">
          <el-input v-model="editForm.visitorName" readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('image')">
          <el-image
              style="width: 450px; height: 450px"
              :src=editForm.image
              fit="contain"></el-image>
        </el-form-item>
        <el-form-item :label="$t('image')">
          <el-date-picker size="mini" readonly style="width: 100%"
                          v-model="editForm.dateOfBirth"
                          type="date"
                          value-format="dd-MM-yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('description')">
          <el-input v-model="editForm.description" readonly size="mini"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createTime')">
          <el-date-picker size="mini" readonly style="width: 100%"
                          v-model="editForm.createdTime"
                          type="date"
                          value-format="dd-MM-yyyy HH:mm"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 50px;margin-bottom: 40px">
        <el-button @click.native="ui.dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button class="normal-btn btn-greenlight" @click="handleVisitorCard(scope.row)"
                   :disabled="isButtonEnabled('visitor:register:visitor:card')"
                   style="float: right;margin-right: 20px;height: 40px;font-size: 17px;margin-left: 30px">
          {{ $t('Cấp mượn thẻ') }}
        </el-button>
      </div>
    </el-dialog>

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
export default class PassPort extends Vue {
  info = {
    docNumber: "",
  };
  title = ""
  ui = {
    success: false,
    dialogVisible: false,
    loading: false
  }

  editForm = {} as any

  tableData = [] as any;

  imageDisplay: any = null;
  socketImage: any;
  socket: any;
  message = ""

  sentData = false

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  next() {
    this.$store.commit('setTemplate', {template: ""})
    this.$store.commit('setImage', {image: ""})
    this.$router.push({path: `/register`})
  }

  async handleVisitorCard(row: any) {

    this.ui.loading = true;
    this.socket = new WebSocket("ws://localhost:16002/card-id-ws");
    this.socket.onopen = () => {
      console.log("connected");
    };
    this.socket.onerror = () => {
      console.log("connected failed");
      this.ui.success = false
      this.message = String(i18n.t('connectServiceFailed'));
      Utils.showWarning(String(i18n.t('connectServiceFailed')));
      this.ui.loading = false
    };
    this.socket.onmessage = (data: any) => {
      let arr = data.data as any;
      var obj = JSON.parse(arr);
      if (obj.success) {
        this.wsDisconnect()
        let cardId = obj.data
        if (cardId != "") {
          let query = {} as any;
          query.visitorId = row.visitorId
          query.cardId = cardId
          this.handleBorror(query)
        }
      } else {
        Utils.showWarning(String(i18n.t('getCardIdFailed')));
        this.message = String(i18n.t('getCardIdFailed'));
        this.ui.success = false
        this.ui.loading = false
      }
    };
  }

  async handleBorror(query: any) {
    let result = await Utils.doPost(this, `/api/admin/visitor-card`, query);
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.borrowSuccess')));
      this.message = String(i18n.t('common.borrowSuccess'));
      this.ui.success = true
      this.ui.loading = false
    } else {
      this.ui.success = false
      if (result.code == 230) {
        Utils.showWarning(String(i18n.t('common.CardNotExisted')));
        this.message = String(i18n.t('common.CardNotExisted'));
      } else if (result.code == 338) {
        Utils.showWarning(String(i18n.t('common.cardIsBorrow')));
        this.message = String(i18n.t('common.cardIsBorrow'));
      } else Utils.showWarning(String(i18n.t('common.borrowFail')));
      this.ui.loading = false
    }
  }

  defaultFormatter(row: any, column: any) {
    var source = row[column.property];
    if (source == null) {
      return '';
    }
    return moment(source).format('DD-MM-YYYY');
  };


  tableRowClassName(rowIndex: any) {
    if (rowIndex.rowIndex % 2 === 0)
      return '';
    return 'warning-row';
  }

  async mounted() {
    this.$store.commit('setTemplate', {template: ""})
    this.$store.commit('setImage', {image: ""})
  };

  async wsImage() {
    this.message = ''
    this.sentData = true
    this.tableData = []
    try {
      this.socketImage = new WebSocket("ws://localhost:16002/face-check");
      this.socketImage.onopen = () => {
        console.log("connected websocket");
      };
      this.socketImage.onerror = () => {
        console.log("connected failed");
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
        this.message = String(i18n.t('connectServiceFailed'))
      };
      this.socketImage.onmessage = (data: any) => {
        let arr = data.data as any;
        var obj = JSON.parse(arr);
        if (obj !== null) {
          if (obj.verifyResponse == null) {
          } else if (obj.verifyResponse != null && obj.verifyResponse.code == 1015) {
            this.message = String(i18n.t('Camera not found'))
            this.ui.success = false;
            this.imageWsDisconnect()
          } else if (obj.verifyResponse != null && obj.verifyResponse.code == 123) {
            console.log("123")
            this.message = String(i18n.t('Face not found'))
            this.ui.success = false;
          } else if (obj.verifyResponse != null || obj.verifyResponse.code == 0) {
            this.message = ""
            this.ui.success = true;
          }
          if (obj.image != null)
            this.imageDisplay = "data:image/jpeg;base64," + obj.image;
          if (obj.quality > 40 && this.sentData) {
            let record = {
              type: "1",
              image: obj.image,
              data: obj.template
            };
            this.getData(record)
            this.sentData = false
          }
        }
      };
    } catch (err) {
      this.imageWsDisconnect()
    }
  }

  async getData(record: any) {
    let result = await Utils.doPost(this, '/api/admin/biometric-service/identify', record);
    if (result.success) {
      this.imageWsDisconnect()
      this.tableData = result.data
      this.ui.success = true;
      this.message = "Thông tin khách đã được đăng ký"
    } else {
      this.imageWsDisconnect();
      this.$store.commit('setImage', {image: record.image})
      this.$store.commit('setTemplate', {template: record.data})
      this.$store.commit('setTitleRegister', {titleRegister: 'citizen-card.register'})
      this.$router.push({path: `/register`})
    }
  }

  async beforeDestroy() {
    this.imageWsDisconnect();
    this.wsDisconnect();
  }

  imageWsDisconnect() {
    this.socketImage.close();
  }

  wsDisconnect() {
    this.socket.close();
  }

  async handleDetail(row: any) {
    this.ui.dialogVisible = true
    this.editForm = row;
  }
}
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  padding: 12px 0;
}

.el-row-card {
  margin-bottom: 0px;
}

.imgDisplay2 {
  margin: auto;
  /*width: 576px;*/
  /*height: 706px;*/
  width: 512px;
  height: 320px;
  padding: 10px;
  border: 1px solid black;
}

.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
  color: #FFFFFF;
  cursor: not-allowed;
  background-image: none;
  background-color: #FFF;
  border-color: #9ea7b4;
}

.Blink {
  animation: blinker 0.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
}

@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.div-fingerprint-view {
  align-content: center;
  /*height: 20%;*/
  display: inline-block;
  align-items: center;
}

.el-input.is-disabled .el-input__inner {
  background-color: #FFF;
  border-color: #DCDFE6;
  color: #606266;
  cursor: not-allowed;
}

</style>
