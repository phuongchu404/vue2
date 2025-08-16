<template>
  <div v-loading="ui.loading"
       :element-loading-text=this.title
  >
    <el-row :gutter="16" class="el-row-card" type="flex">
      <el-col style="margin: 10px">
        <el-row class="el-row-card" :gutter="20">
          <el-card class="box-card">
            <h2 style="width: auto;margin: auto;text-align: left;top:30px;border-bottom: 1px solid #e5e5e5;padding: 0px 0px 10px 0px">
              {{ $t('pass-post.info') }}</h2>
            <h3 class="message-success" v-if="ui.success">{{ this.message }}</h3>
            <h3 class="message-red" v-else>{{ this.message }}</h3>
            <div class="from-text">
              <el-row>
                <el-row class="el-row-card" style="width: 70%;float: left">
                  <el-col style="margin-top: 0px;">
                    <el-form label-position="right" label-width="150px" size="mini" :model="passport" ref="passportEdit"
                             :rules="passportRules" style="margin-left: 0px">
                      <el-form-item :label="$t('idVisitorCard')" v-show="cardId!=null">
                        <el-input v-model="cardId" readonly :placeholder="$t('idVisitorCard')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('pass-post.no')" prop="docNumber">
                        <el-input v-model="passport.docNumber" :placeholder="$t('pass-post.no')" readonly
                                  disabled="disabled"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.fullname')" prop="fullName">
                        <el-input v-model="passport.fullName" :placeholder="$t('citizen-card.fullname')" readonly
                                  disabled="disabled"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.dateOfBirth')" prop="dateOfBirth">
                        <el-input v-model="passport.dateOfBirth" readonly :placeholder="$t('citizen-card.dateOfBirth')"
                                  disabled="disabled"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.gender')" prop="ShortSex">
                        <el-select :placeholder="$t('citizen-card.gender')" v-model="passport.ShortSex"
                                   size="mini" style="width: 100%" filterable readonly="readonly" autocomplete="off"
                                   disabled="disabled">
                          <el-option
                              v-for="item in gender"
                              :key="item.name"
                              :label="item.name"
                              :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.createNDA')" prop="createdNDA"
                                    v-show="readerSuceess && passport.createdNDA!='NA'">
                        <el-input v-model="passport.createdNDA" readonly></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.expiredNDA')" prop="expiredNDA"
                                    v-show="readerSuceess && passport.expiredNDA!='NA'">
                        <el-input v-model="passport.expiredNDA" readonly></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.phone')" prop="phone">
                        <el-input v-model="passport.phone" :placeholder="$t('citizen-card.phone')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.email')" prop="email">
                        <el-input v-model="passport.email" :placeholder="$t('citizen-card.email')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.nationality')" prop="nationality">
                        <el-select :placeholder="$t('citizen-card.nationality')" size="mini"
                                   style="width: 100%" v-model="passport.nationality" readonly="readonly"
                                   autocomplete="off" disabled="disabled" filterable>
                          <el-option
                              v-for="item in nationalitys"
                              :key="item.name"
                              :label="item.name"
                              :value="item.code3">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.description')">
                        <el-input v-model="passport.description"
                                  :placeholder="$t('citizen-card.description')"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button class="normal-btn btn-greenlight" @click="handleRegistered"
                                   :disabled="isButtonEnabled('visitor:register:insert')"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 15px"
                                   v-show="readerSuceess"> {{ $t('citizen-card.registered') }}
                        </el-button>

                        <el-button class="normal-btn btn-greenlight" @click="handleVisitorCard" v-show="this.ui.borrow"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 20px"
                                   :disabled="isButtonEnabled('visitor:register:visitor:card')">
                          {{ $t('Cấp mượn thẻ') }}
                        </el-button>
                        <!--                        <el-button class="normal-btn btn-blue" @click="wsImage" v-show="this.ui.image2"-->
                        <!--                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 15px">-->
                        <!--                          {{ $t('Chụp lại') }}-->
                        <!--                        </el-button>-->
                        <el-button class="normal-btn btn-greenlight" @click="handleNext" size="mini"
                                   v-show="this.ui.next"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 15px">
                          {{ $t('Next') }}
                        </el-button>
                        <el-button class="normal-btn btn-blue" @click="wsMRZ" v-show="this.ui.mrz"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 15px">
                          {{ $t('pass-post.readerPassport') }}
                        </el-button>

                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </el-row>
            </div>
            <div class="image" style="margin-top: -60px" v-show="this.ui.imageExist">
              <img class="imgDisplayPassport" :src="imageDisplay"/>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog :title="$t('Cấp mượn thẻ')" :visible.sync="ui.can" width="40%"
               class="addDio">
      <el-form :model="addCardVisitor" :rules="borrowCardRules" label-width="150px" style="padding-right: 50px"
               ref="addCardVisitor">
        <el-form-item :label="$t('cardName')" prop="roleName">
          <el-select v-model="addCardVisitor.cardId" value-key="editForm.providerCode" filterable clearable
                     :placeholder="$t('cardName')" size="mini" style="width: 95%">
            <el-option
                v-for="item in Card"
                :key="item.cardId"
                :label="item.cardName"
                :value="item.cardId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 60px">
        <el-button @click.native="ui.can = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click.native="handleBorror(addCardVisitor)">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as Utils from "../../utils";
import * as utils from "../../utils";
import i18n from "../i18n";

@Component({
  components: {},
})
export default class PassPort extends Vue {
  info = {
    docNumber: "",
  };
  borrowCardRules = {
    cardId: [{required: true, message: i18n.t("citizen-card.inputVisitor"), trigger: 'blur'}]
  }
  addCardVisitor = {
    visitorId: '',
    cardId: ''
  }
  borrowCard = {
    cardId: ''
  }
  ui = {
    mrz: true,
    load: false,
    loading: false,
    newVisitor: false,
    borrow: false,
    show: false,
    image: false,
    image2: false,
    next: false,
    success: false,
    showimage: false,
    imageExist: false,
    can: false
  }
  cardId: any = null;
  readerSuceess = false
  socketMRZ: any;

  passport = {
    provider: "",
    phone: "",
    email: "",
    docNumber: "",
    fullName: "",
    dateOfBirth: "",
    ShortSex: "",
    nationality: "",
    description: "",
    createdNDA: "NA",
    expiredNDA: "NA"
  };

  message = ""

  passportRules = {
    docNumber: [{required: true, message: i18n.t("pass-post.inputPassportNo"), trigger: 'blur'}],
    fullName: [{required: true, message: i18n.t("pass-post.inputFullName"), trigger: 'blur'}],
    dateOfBirth: [{required: true, message: i18n.t("pass-post.inputDateOfBirth"), trigger: 'blur'}],
    nationality: [{required: true, message: i18n.t("pass-post.inputNationality"), trigger: 'blur'}],
    ShortSex: [{required: true, message: i18n.t("pass-post.inputGender"), trigger: 'blur'}],
  }

  imageDisplay: any = null;
  image: any = null;
  title = ""
  socket: any;
  socketImage: any;
  nationalitys: any = [];
  providers: any = [];
  devices: any = [];
  camera: any = null;
  loading = false;
  typeFaceAuthentication = 1;
  Card: any = null;

  gender = [
    {id: 'M', name: i18n.t('Male')},
    {id: 'F', name: i18n.t('Female')}
  ]

  async getCard() {
    let result = await Utils.doGet(this, `/api/admin/access-card/all`);
    if (result.success) {
      this.Card = result.data;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  clear() {
    this.passport.provider = "";
    this.passport.phone = "";
    this.passport.email = "";
    this.passport.docNumber = "";
    this.passport.fullName = "";
    this.passport.dateOfBirth = "";
    this.passport.ShortSex = "";
    this.passport.nationality = "";
    this.passport.description = ""
  }

  async mounted() {
    await this.getProvider();
    await this.getNationality();
    this.imageDisplay = "data:image/jpeg;base64," + this.$store.getters.getImageData
    this.ui.imageExist = this.$store.getters.getImageData.length > 0
    await this.getCard();
  };

  async handleNext() {
    this.reset();
    this.ui.next = false;
    this.ui.mrz = true;
    this.message = "";
  }


  reset() {
    this.ui.showimage = false
    this.cardId = null;
    this.passport.provider = "";
    this.passport.phone = "";
    this.passport.email = "";
    this.passport.docNumber = "";
    this.passport.fullName = "";
    this.passport.dateOfBirth = "";
    this.passport.ShortSex = "";
    this.passport.nationality = "";
    this.passport.description = "";
    this.passport.createdNDA = "NA";
    this.passport.expiredNDA = "NA";
    this.devices = [];
    this.typeFaceAuthentication = 1;
    this.readerSuceess = false;
    this.imageDisplay = null;
  }

  async handleRegistered() {
    let validate = await Utils.validateForm(this.$refs.passportEdit);
    if (!validate) return
    let record = {
      documentType: 2,
      providerCode: '',
      phoneNumber: '',
      email: '',
      noCard: '',
      name: '',
      dateOfBirth: '',
      gender: '',
      description: '',
      nationality: '',
      image: '',
      template: ''
    }
    record.providerCode = this.passport.provider
    record.phoneNumber = this.passport.phone
    record.email = this.passport.email
    record.noCard = this.passport.docNumber
    record.name = this.passport.fullName
    record.dateOfBirth = this.passport.dateOfBirth
    record.gender = this.passport.ShortSex
    record.description = this.passport.description
    record.nationality = this.passport.nationality
    record.image = this.$store.getters.getImageData
    record.template = this.$store.getters.getTemplateData
    let result = await utils.doPost(
        this,
        "/api/admin/visitor",
        record
    );
    if (!result.success) {
      Utils.showWarning(String(i18n.t('common.insertFail')) + String(i18n.t(result.message)).toLowerCase());
      this.message = String(i18n.t('common.insertFail')) + " " + String(i18n.t(result.message)).toLowerCase()
      this.ui.success = false;
    } else {
      Utils.showSuccess(String(i18n.t('common.insertSuccess')));
      this.$store.commit('setImage', {image: ''})
      this.$store.commit('setTemplate', {template: ''})
      this.readerSuceess = false
      this.ui.borrow = true
      this.ui.image2 = false;
      this.ui.mrz = true;
      this.message = String(i18n.t('common.insertVisitorSuccess')) + ". " + String(i18n.t('Vui lòng đặt thẻ ra vào lên trên thiết bị')).toLowerCase()
      this.ui.success = true;
    }
  }

  async getProvider() {
    let result = await Utils.doGet(this, `/api/admin/provider/all`);
    if (result.success) {
      this.providers = result.data;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async getNationality() {
    let result = await Utils.doGet(this, `/api/admin/nationality`);
    if (result.success) {
      this.nationalitys = result.data;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  // wsImage() {
  //   this.readerSuceess = false;
  //   try {
  //     this.ui.image2 = false
  //     this.title = String(i18n.t('readerPassport'));
  //     this.socketImage = new WebSocket("ws://localhost:16002/face-ws");
  //     this.socketImage.onopen = () => {
  //       console.log("connected websocket");
  //     };
  //     this.socketImage.onerror = () => {
  //       console.log("connected failed");
  //       this.ui.image = false
  //       this.ui.success = false
  //       this.message = String(i18n.t('connectServiceFailed'))
  //       Utils.showWarning(String(i18n.t('connectServiceFailed')));
  //       this.ui.loading = false
  //     };
  //     this.socketImage.onmessage = (data: any) => {
  //       let arr = data.data as any;
  //       var obj = JSON.parse(arr);
  //       if (obj !== null) {
  //         if (obj.verifyResponse == null) {
  //
  //         } else if (obj.verifyResponse != null && obj.verifyResponse.code == 1015) {
  //           this.message = String(i18n.t('Camera not found'))
  //           this.ui.success = false
  //           this.imageWsDisconnect()
  //         } else if (obj.verifyResponse != null && obj.verifyResponse.code == 123) {
  //           console.log("123")
  //           this.message = String(i18n.t('Face not found'))
  //           this.ui.success = false
  //           this.ui.image = false
  //           console.log(this.ui.image)
  //         } else if (obj.verifyResponse != null || obj.verifyResponse.code == 0) {
  //           console.log("0")
  //           if (!this.ui.image)
  //             this.ui.image = true;
  //           this.message = ""
  //         }
  //         if (obj.image != null)
  //           this.imageDisplay = "data:image/jpeg;base64," + obj.image;
  //         this.image = obj.image;
  //       }
  //     };
  //   } catch (err) {
  //     this.imageWsDisconnect()
  //   }
  // }

  async beforeDestroy() {
    this.imageWsDisconnect();
    this.imageWsDisconnect2();
    this.$store.commit('setTitleRegister', {titleRegister: ""})
    this.$router.push({path: `/check-visitor`})
  }

  wsMRZ() {
    this.ui.showimage = false;
    this.message = "";
    this.ui.borrow = false
    this.readerSuceess = false
    this.imageWsDisconnect2();
    try {
      this.ui.loading = true
      this.title = String(i18n.t('readerPassport'));
      this.clear();
      this.socketMRZ = new WebSocket("ws://localhost:16002/mrz-ws");
      this.socketMRZ.onopen = () => {
      };
      this.socketMRZ.onerror = () => {
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
        this.message = String(i18n.t('connectServiceFailed'));
        this.ui.success = false
        this.message = String(i18n.t('connectServiceFailed'))
        this.ui.success = false;
        this.ui.loading = false
      };
      this.socketMRZ.onmessage = (data: any) => {
        let arr = data.data as any;
        var obj = JSON.parse(arr);
        if (obj.code == '201') {
          this.message = String(i18n.t('readerMrzNotFound'));
          this.ui.success = false;
          this.wsDisconnect()
          this.ui.loading = false
          return;
        } else if (obj.success) {
          this.wsDisconnect()
          this.passport = obj.data
          Utils.showSuccess(String(i18n.t('getInfoSuccess')));
          this.ui.success = true;
          let query = {} as any;
          query.documentType = 2;
          query.visitorId = this.passport.docNumber;
          query.image = this.$store.getters.getImageData
          query.template = this.$store.getters.getTemplateData
          this.handCheckVisitor(query);
        } else {
          this.message = String(i18n.t('readerMrzFailed'));
          this.ui.success = false;
          Utils.showWarning(String(i18n.t('getInfoFailed')));
          this.ui.loading = false
        }
      };
    } catch (err) {
      console.log(err)
      this.wsDisconnect()
      this.ui.loading = false
    }
  }

  async handleVisitorCard() {
    if (!this.ui.imageExist) {
      this.ui.can = true;
      this.borrowCard.cardId = '';
      this.addCardVisitor.visitorId = this.passport.docNumber
      return;
    }
    this.title = String(i18n.t('readerCardId'));
    this.ui.loading = true
    this.socket = new WebSocket("ws://localhost:16002/card-id-ws");
    this.socket.onopen = () => {
      console.log("connected");
    };
    this.socket.onerror = () => {
      console.log("connected failed");
      Utils.showWarning(String(i18n.t('connectServiceFailed')));
      this.ui.success = false
      this.message = String(i18n.t('connectServiceFailed'))
    };
    this.socket.onmessage = (data: any) => {
      let arr = data.data as any;
      var obj = JSON.parse(arr);
      if (obj.success) {
        this.wsDisconnect1()
        let cardId = obj.data
        if (cardId != "") {
          let query = {} as any;
          query.visitorId = this.passport.docNumber;
          query.cardId = cardId
          this.handleBorror(query)
        }
      } else {
        Utils.showWarning(String(i18n.t('getCardIdFailed')));
        this.message = String(i18n.t('getCardIdFailed'));
        this.ui.success = false;
        this.ui.loading = false
      }
    };
  }

  wsDisconnect1() {
    this.socket.close();
  }

  async handleBorror(query: any) {
    this.ui.loading = false
    let result = await Utils.doPost(this, `/api/admin/visitor-card`, query);
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.borrowSuccess')));
      this.ui.success = true;
      this.cardId = query.cardId;
      this.ui.borrow = false;
      this.ui.mrz = false;
      this.ui.next = true;
      this.message = String(i18n.t('common.borrowSuccess'));
      this.$router.push({path: `/check-visitor`})
      this.$store.commit('setImage', {image: ''})
      this.$store.commit('setTemplate', {template: ''})
    } else {
      if (result.code == 230) {
        Utils.showWarning(String(i18n.t('common.CardNotExisted')));
        this.message = String(i18n.t('common.CardNotExisted'));
        this.ui.success = false;
      } else if (result.code == 338) {
        Utils.showWarning(String(i18n.t('common.cardIsBorrow')));
        this.message = String(i18n.t('common.cardIsBorrow'));
        this.ui.success = false;
      } else {
        Utils.showWarning(String(i18n.t('common.borrowFail')));
        this.ui.success = false;
      }
    }
    await this.getCard();
  }

  async handCheckVisitor(query: any) {
    this.passport.createdNDA = "NA"
    this.passport.expiredNDA = "NA"
    this.ui.loading = false
    this.ui.show = true
    this.ui.showimage = true
    // let param = `${Utils.queryFormWrapper(query)}`;

    let result = await utils.doPost(this, `/api/admin/visitor/getVisitor`,query);
    if (result.success) {
      this.ui.borrow = true;
      this.ui.newVisitor = false;
      if (result.data.image != null)
        this.imageDisplay = result.data.image;
      this.passport.createdNDA = result.data.createdNDA
      this.passport.expiredNDA = result.data.expiredNDA
      // this.message = String(i18n.t('citizen-card.registeredVisitor')) + ". " + String(i18n.t('Vui lòng đặt thẻ ra vào lên trên thiết bị'))
      this.message = String(i18n.t('citizen-card.registeredVisitor')) + ". " + String(i18n.t('Vui lòng kiểm tra lại thông tin'))
      this.ui.success = false;
    } else {
      this.ui.newVisitor = true;
      this.ui.image = true;
      this.message = String(i18n.t('citizen-card.unregisteredVisitor'))
      this.ui.success = true;
      this.readerSuceess = true;
    }
  }

  imageWsDisconnect() {
    this.socketImage.close();
    this.readerSuceess = true;
    this.ui.image = false;
    this.ui.image2 = true;
  }

  imageWsDisconnect2() {
    try {
      this.socketImage.close();
      this.ui.image = false;
      this.ui.image2 = true;
    } catch (err) {
      console.log(err)
    }
  }

  wsDisconnect() {
    this.socketMRZ.close();
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
  margin-bottom: 20px;
}

.imgDisplayPassport {
  margin: auto;
  width: 426px;
  height: 266px;
  padding: 10px;
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

@media (max-width: 767px) {
  .image {
    width: 100%;
    height: 350px;
    margin-left: 100px;
  }

  .from-text {
    top: 100px;
    width: 100%;
    margin-left: 100px;
  }
}

@media (max-width: 1024px ) {
  .image {
    width: 100%;
    height: 350px;
    margin-left: 100px;
  }

  .from-text {
    width: 100%;
    margin-left: 100px;
  }
}

@media (max-width: 320px ) {
  .image {
    width: 100%;
    margin: auto;
    margin-left: 100px;
  }

  .from-text {
    width: auto;
    min-width: 400px;
    margin-left: 100px;
  }
}


@media (max-width: 1380px ) {
  .image {
    height: 350px;
    width: 600px;
    margin: auto;
    margin-left: 70px;
  }

  .from-text {
    top: 100px;
    width: 100%;
    min-width: 400px;
    margin-left: 150px;
  }
}

@media (max-width: 2000px ) {
  .image {
    margin: auto;
    width: 320px;
    height: 340px;
    padding-top: 50px;
    margin-left: 70px;
    float: left;
  }

  .from-text {
    width: auto;
    min-width: 750px;
    margin-left: 100px;
    float: left;
  }
}

.message-success {
  text-align: center;
  color: #7bcb58;
  white-space: normal;
  height: 40px;
  width: auto;
  text-align: center;
  font-size: 17px;
  padding: 20px 0px;
}

.message-red {
  text-align: center;
  color: red;
  white-space: normal;
  height: 40px;
  width: auto;
  text-align: center;
  font-size: 17px;
  padding: 20px 0px;
}
</style>
