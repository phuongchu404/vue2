<template>
  <div v-loading="ui.loading"
       :element-loading-text="$t('readerCardId')"
  >
    <el-row :gutter="16" class="el-row-card" type="flex">
      <el-col style="margin: 10px">
        <el-row class="el-row-card" :gutter="20">
          <el-card class="box-card">
            <h2 style="width: auto;margin: auto;text-align: left;top:10px;border-bottom: 1px solid #e5e5e5;padding: 0px 0px 10px 0px">
              {{ $t('card.info') }}</h2>
            <h3 class="message-success" v-if="ui.success">{{ this.message }}</h3>
            <h3 class="message-red" v-else>{{ this.message }}</h3>
            <div class="from-text">
              <el-row>
                <el-row class="el-row-card" style="width: 70%;float: left;top: 0px">
                  <el-col style="margin-bottom: 0px;">
                    <el-form label-position="right"
                             label-width="150px"
                             size="mini"
                             :model="other"
                             ref="otherEdit"
                             :rules="otherRules"
                    >
                      <el-form-item for="movie" :label="$t('idVisitorCard')" v-show="cardId!=null">
                        <el-input v-model="cardId" readonly :placeholder="$t('idVisitorCard')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('other.typeCard')" prop="cardType">
                        <el-select :placeholder="$t('other.typeCard')" style="width: 100%" v-model="other.cardType"
                                   value-key="other.cardType">
                          <el-option
                              v-for="item in cardTypes"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('other.no')" prop="noCard">
                        <el-input v-model="other.noCard" :placeholder="$t('other.no')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.fullname')" prop="name">
                        <el-input v-model="other.name" :placeholder="$t('citizen-card.fullname')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.dateOfBirth')" prop="dateOfBirth">
                        <el-date-picker size="mini" style="width: 100%"
                                        v-model="other.dateOfBirth"
                                        type="date"
                                        clearable
                                        :placeholder="$t('citizen-card.dateOfBirth')"
                                        value-format="dd/MM/yyyy"
                                        format="dd/MM/yyyy">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.gender')" prop="gender">
                        <el-select :placeholder="$t('citizen-card.gender')" style="width: 100%" v-model="other.gender">
                          <el-option
                              v-for="item in genders"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.createNDA')" prop="createdNDA"
                                    v-show="other.createdNDA!='NA'">
                        <el-input v-model="other.createdNDA" readonly></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.expiredNDA')" prop="expiredNDA"
                                    v-show="other.expiredNDA!='NA'">
                        <el-input v-model="other.expiredNDA" readonly></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.residenceAddress')" prop="address">
                        <el-input v-model="other.address" :placeholder="$t('citizen-card.residenceAddress')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.nationality')" prop="nationality">
                        <el-select :placeholder="$t('citizen-card.nationality')" value="" size="mini"
                                   style="width: 100%"
                                   v-model="other.nationality" filterable>
                          <el-option
                              v-for="item in nationalitys"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.phone')" prop="phone">
                        <el-input v-model="other.phone" :placeholder="$t('citizen-card.phone')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.email')" prop="email">
                        <el-input v-model="other.email" :placeholder="$t('citizen-card.email')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.description')">
                        <el-input v-model="other.description" :placeholder="$t('citizen-card.description')"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button class="normal-btn btn-greenlight" @click="handleVisitorCard" v-show="this.ui.borrow"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 15px"
                                   :disabled="isButtonEnabled('visitor:register:visitor:card')">
                          {{ $t('Cấp mượn thẻ') }}
                        </el-button>
                        <el-button class="normal-btn btn-greenlight" @click="handleRegistered" v-show="this.ui.register"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;margin-left: 15px"
                                   :disabled="isButtonEnabled('visitor:register:insert')">
                          {{ $t('citizen-card.registered') }}
                        </el-button>
                        <el-button class="normal-btn btn-greenlight" @click="handleNext" v-show="this.ui.next"
                                   style="float: right;margin-bottom: 75px;margin-top: 65px;"
                                   :disabled="isButtonEnabled('visitor:register:insert')">
                          {{ $t('Next') }}
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </el-row>
            </div>
            <div :xl="4" :lg="4" :sm="4" class="image" style="margin-top: -25px">
              <img class="imgDisplayOther" :src="imageDisplay" v-show="this.ui.imageExist"/>
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

@Component
export default class OtherCard extends Vue {
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
    load: false,
    borrow: false,
    addVisitor: true,
    loading: false,
    image: false,
    image2: false,
    register: true,
    next: false,
    success: false,
    showimage: false,
    can: false,
    imageExist: false
  }
  cardTypes = [
    {name: i18n.t('CMND')},
    {name: i18n.t('CCCD Old')},
    {name: i18n.t('CCCD New')},
    {name: i18n.t('GPLX')},
    {name: i18n.t('Passport')}
  ]
  other = {
    cardType: "",
    providerCode: "",
    phone: "",
    email: "",
    noCard: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    address: "",
    description: "",
    createdNDA: "NA",
    expiredNDA: "NA",
    providerName: ""
  };
  otherRules = {
    cardType: [{required: true, message: i18n.t("other.inputCardType"), trigger: 'blur'}],
    noCard: [{required: true, message: i18n.t("other.inputIdCardNumber"), trigger: 'blur'}],
    name: [{required: true, message: i18n.t("other.inputFullName"), trigger: 'blur'}],
    dateOfBirth: [{required: true, message: i18n.t("other.inputDateOfBirth"), trigger: 'blur'}],
    gender: [{required: true, message: i18n.t("other.inputGender"), trigger: 'blur'}],
    nationality: [{required: true, message: i18n.t("other.inputNationality"), trigger: 'blur'}],
  }
  cardId: any = null;
  message = "";
  socket: any;
  socketImage: any;
  nationalitys: any = [];
  providers: any = [];
  imageCard: any = null;
  imageDisplay: any = null;
  fingerLeft: any = null;
  devices: any = [];
  camera: any = null;
  loading = false;
  typeFaceAuthentication = 1;
  image: any = null;
  Card: any = null;
  genders = [
    {id: 0, name: i18n.t('common.male')},
    {id: 1, name: i18n.t('common.female')}
  ]

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  imageWsDisconnect() {
    this.socketImage.close();
    this.ui.image = false;
    this.ui.image2 = true;
    this.ui.register = true;
  }

  async handleCheck() {
    this.ui.borrow = false;
    this.ui.image = false;
    this.ui.image2 = false;
    this.ui.register = false;
    this.other.expiredNDA = "NA";
    this.other.createdNDA = "NA";
    let validate = await Utils.validateForm(this.$refs.otherEdit);
    if (!validate) return;
    let query = {} as any;
    query.documentType = 3;
    query.visitorId = this.other.noCard;
    let param = `${Utils.queryFormWrapper(query)}`;
    let result1 = await Utils.doGet(this, `/api/admin/visitor/getVisitor?${param}`);
    if (result1.success) {
      this.ui.borrow = true;
      this.ui.addVisitor = false;
      this.imageDisplay = result1.data.image;
      this.other.cardType = result1.data.cardName
      this.other.providerCode = result1.data.providerName
      this.other.createdNDA = result1.data.createdNDA
      this.other.expiredNDA = result1.data.expiredNDA
      this.other.name = result1.data.visitorName
      this.other.noCard = result1.data.visitorId
      this.other.gender = result1.data.sex
      this.other.dateOfBirth = result1.data.dateOfBirth
      this.other.address = result1.data.address;
      this.other.phone = result1.data.mobile;
      this.other.email = result1.data.email;
      this.other.nationality = result1.data.nationality;
      this.message = String(i18n.t('citizen-card.registeredVisitor')) + '.' + String(i18n.t('Vui lòng đặt thẻ ra vào lên trên thiết bị'))
      this.ui.success = true
      this.ui.showimage = true;
      return;
    } else {
      this.ui.addVisitor = true;
      this.message = String(i18n.t('citizen-card.unregisteredVisitor'))
      this.ui.success = true
      // this.wsImage()
    }
  }

  async beforeDestroy() {
    this.imageWsDisconnect();
    this.$store.commit('setTitleRegister', {titleRegister: ""})
    this.$router.push({path: `/check-visitor`})
  }

  reset() {
    this.cardId = null;
    this.imageDisplay = null;
    this.imageCard = null;
    this.fingerLeft = null;
    this.other.cardType = "";
    this.other.noCard = "";
    this.other.providerCode = "";
    this.other.phone = "";
    this.other.email = "";
    this.other.address = "";
    this.other.name = "";
    this.other.dateOfBirth = "";
    this.other.gender = "";
    this.other.nationality = "";
    this.other.description = "";
    this.other.expiredNDA = "NA";
    this.other.createdNDA = "NA";
    this.message = "";
    this.devices = [];
    this.typeFaceAuthentication = 1;
    this.ui.showimage = false;
  }

  async clear() {
    this.other.providerCode = "";
    this.other.phone = "";
    this.other.email = "";
    this.other.noCard = "";
    this.other.name = "";
    this.other.dateOfBirth = "";
    this.other.gender = "";
    this.other.nationality = "";
    this.other.description = "";
    this.other.nationality = "";
    this.other.address = "";
    this.other.cardType = "";
  }

  async getProvider() {
    let result = await Utils.doGet(this, `/api/admin/provider/all`);
    if (result.success) {
      this.providers = result.data;
      this.ui.load = true
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async mounted() {
    await this.getProvider();
    await this.getNationality();
    this.imageDisplay = "data:image/jpeg;base64," + this.$store.getters.getImageData
    await this.getCard();
    this.ui.imageExist = this.$store.getters.getImageData.length > 0
  };

  async getCard() {
    let result = await Utils.doGet(this, `/api/admin/access-card/all`);
    if (result.success) {
      this.Card = result.data;
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

  async handleRegistered() {
    let validate = await Utils.validateForm(this.$refs.otherEdit);
    if (!validate) return
    let query = {} as any;
    query.documentType = 3;
    query.visitorId = this.other.noCard;
    query.image = this.$store.getters.getImageData
    query.template = this.$store.getters.getTemplateData
    let param = `${Utils.queryFormWrapper(query)}`;
    let result1 = await Utils.doPost(this, `/api/admin/visitor/getVisitor`,query);
    if (result1.success) {
      this.ui.borrow = true;
      this.ui.addVisitor = false;
      this.imageDisplay = result1.data.image;
      this.other.cardType = result1.data.cardName
      this.other.providerCode = result1.data.providerName
      this.other.createdNDA = result1.data.createdNDA
      this.other.expiredNDA = result1.data.expiredNDA
      this.other.name = result1.data.visitorName
      this.other.noCard = result1.data.visitorId
      this.other.gender = result1.data.sex
      this.other.dateOfBirth = result1.data.dateOfBirth
      this.other.address = result1.data.address;
      this.other.phone = result1.data.mobile;
      this.other.email = result1.data.email;
      this.other.nationality = result1.data.nationality;
      this.message = String(i18n.t('citizen-card.registeredVisitor')) + '.' + String(i18n.t('Vui lòng kiểm tra lại thông tin'))
      this.ui.success = false
      this.ui.showimage = true;
      this.ui.register = false
      return;
    } else {
      let record = {
        documentType: 3,
        providerCode: '',
        phoneNumber: '',
        email: '',
        noCard: '',
        name: '',
        dateOfBirth: '',
        gender: '',
        placeOfBirth: '',
        description: '',
        nationality: '',
        address: '',
        cardName: '',
        image: '',
        template: ''
      }
      record.providerCode = this.other.providerCode;
      record.phoneNumber = this.other.phone;
      record.email = this.other.email;
      record.noCard = this.other.noCard
      record.name = this.other.name
      record.dateOfBirth = this.other.dateOfBirth;
      record.gender = this.other.gender;
      record.placeOfBirth = this.other.nationality
      record.description = this.other.description;
      record.nationality = this.other.nationality;
      record.address = this.other.address
      record.cardName = this.other.cardType
      record.image = this.$store.getters.getImageData
      record.template = this.$store.getters.getTemplateData
      let result = await utils.doPost(
          this,
          "/api/admin/visitor",
          record
      );
      if (!result.success) {
        Utils.showWarning(String(i18n.t('common.insertFail')) + String(i18n.t(result.message)));
        this.message = String(i18n.t('common.insertFail')) + " " + String(i18n.t(result.message))
        this.ui.success = false
      } else {
        Utils.showSuccess(String(i18n.t('common.insertSuccess')));
        this.$store.commit('setTemplate', {image: ""})
        this.$store.commit('setImage', {template: ""})
        this.ui.addVisitor = false
        this.ui.borrow = true;
        this.ui.register = false;
        this.ui.image2 = false;
        this.ui.success = true
        this.message = String(i18n.t('common.insertVisitorSuccess')) + String(i18n.t('Vui lòng đặt thẻ ra vào lên trên thiết bị'))
      }
    }
  }

  async handleVisitorCard() {
    console.log(this.ui.imageExist)
    if (!this.ui.imageExist) {
      this.ui.can = true;
      this.borrowCard.cardId = '';
      this.addCardVisitor.visitorId = this.other.noCard
      return;
    }
    this.ui.loading = true
    this.socket = new WebSocket("ws://localhost:16002/card-id-ws");
    this.socket.onopen = () => {
      console.log("connected");
    };
    this.socket.onerror = () => {
      console.log("connected failed");
      Utils.showWarning(String(i18n.t('connectServiceFailed')));
      this.ui.success = false
      this.ui.image = false
      this.message = String(i18n.t('connectServiceFailed'))
    };
    this.socket.onmessage = (data: any) => {
      let arr = data.data as any;
      var obj = JSON.parse(arr);
      if (obj.success) {
        this.wsDisconnect()
        let cardId = obj.data
        if (cardId != "") {
          let query = {} as any;
          query.visitorId = this.other.noCard
          query.cardId = cardId
          this.handleBorror(query)
        }
      } else {
        this.ui.success = false
        Utils.showWarning(String(i18n.t('getCardIdFailed')));
        this.message = String(i18n.t('getCardIdFailed1')) + String(i18n.t(obj.message));
        this.ui.loading = false
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
      this.ui.next = true;
      this.ui.success = true
      this.ui.borrow = false;
      this.cardId = query.cardId
      this.$router.push({path: `/check-visitor`})
      this.$store.commit('setImage', {image: ''})
      this.$store.commit('setTemplate', {template: ''})

    } else {
      this.ui.success = false
      if (result.code == 230) {
        Utils.showWarning(String(i18n.t('common.CardNotExisted')));
        this.message = String(i18n.t('common.CardNotExisted'));
      } else if (result.code == 338) {
        Utils.showWarning(String(i18n.t('common.cardIsBorrow')));
        this.message = String(i18n.t('common.cardIsBorrow'));
      } else Utils.showWarning(String(i18n.t('common.borrowFail')));
    }
    this.ui.loading = false
  }

  async handleNext() {
    this.reset();
    this.ui.next = false;
    this.message = "";
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

.imgDisplayOther {
  margin: auto;
  width: 426px;
  height: 266px;
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

@media (max-width: 767px) {
  .image {
    width: 100%;
    height: 340px;
    margin-left: 100px;
  }

  .from-text {
    top: 100px;
    width: 100%;
  }
}

@media (max-width: 1024px ) {
  .image {
    width: 100%;
    height: 340px;
    margin-left: 100px;
  }

  .from-text {
    width: 100%;
  }
}

@media (max-width: 320px ) {
  .image {
    width: 100%;
    height: 340px;
    margin: auto;
    margin-left: 100px;
  }

  .from-text {
    width: auto;
    min-width: 400px;
  }
}


@media (max-width: 1380px ) {
  .image {
    width: 320px;
    height: 340px;
    margin: auto;
    margin-left: 70px;
  }

  .from-text {
    top: 100px;
    width: 100%;
    min-width: 500px;
    margin-left: 100px;
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
