<template>
  <div style="justify-content: center;"
       v-loading="ui.loading"
       :element-loading-text="$t('readerCardId')"
       element-loading-spinner="el-icon-loading"
  >
    <el-row class="el-row-card">
      <div class="from-text"
           style="padding-bottom: 10px;margin: 0px;width: 51%;float: left;min-width: 650px;margin-right: 15px">
        <el-row class="el-row-card" style="width: 100%">
          <el-card class="box-card">
            <h2 style="margin-left: 10px;margin-bottom: 40px;border-bottom: 1px solid #e5e5e5;">
              {{ $t('citizen-card.info') }}</h2>
            <div style="height: 80px">
              <h3 style="text-align: center;color: #7bcb58;white-space: normal;height: 50px;width: auto;text-align: center;font-size: 17px"
                  v-if="ui.success">
                {{ this.message }}</h3>
              <h3 style="text-align: center;color: red;white-space: normal;height: 50px;width: auto;text-align: center;font-size: 17px"
                  v-else>
                {{ this.message }}</h3>
            </div>
            <el-row style="width: auto;float: left;padding-left: 20px;width: 100%">
              <el-row
                  :gutter="20"
                  class="el-row-card"
                  type="flex"
                  style="margin-bottom: 0px"
              >
                <el-col :xl="6" :lg="6" :sm="18">
                  <img class="imgDisplay" :src="imageCard"
                       style="padding-top: 10px;min-width: 180px;min-height: 240px;"/>
                </el-col>
                <el-col style="width:67%;max-width:600px;min-width:350px;margin-left: 20px">
                  <el-form label-width="150px" size="mini" :model="card" ref="editForm1" :rules="cardRules1">
                    <el-form-item :label="$t('idVisitorCard')" v-show="cardId!=null">
                      <el-input v-model="cardId" readonly :placeholder="$t('idVisitorCard')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('citizen-card.idCardNo')" prop="idCardNo">
                      <el-input v-model="card.idCardNo" readonly :placeholder="$t('citizen-card.idCardNo')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('citizen-card.fullname')" prop="name">
                      <el-input v-model="card.name" readonly :placeholder="$t('citizen-card.fullname')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('citizen-card.dateOfBirth')" prop="dateOfBirth">
                      <el-input v-model="card.dateOfBirth" readonly
                                :placeholder="$t('citizen-card.dateOfBirth')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('citizen-card.gender')" prop="gender">
                      <el-input v-model="card.gender" readonly :placeholder="$t('citizen-card.gender')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('citizen-card.nationality')" prop="nationality" style="margin-bottom: 0px">
                      <el-input v-model="card.nationality" readonly
                                :placeholder="$t('citizen-card.nationality')"></el-input>
                    </el-form-item>
                    <div style="height: 45px;margin-top: 15px">
                      <el-form-item :label="$t('citizen-card.createNDA')" prop="createdNDA"
                                    v-show="!this.ui.newVisitor && this.card.createdNDA!=''">
                        <el-input v-model="card.createdNDA" readonly></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.expiredNDA')" prop="expiredNDA"
                                    v-show="!this.ui.newVisitor && this.card.expiredNDA!=''">
                        <el-input v-model="card.expiredNDA" readonly></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.phone')"
                                    v-show="this.ui.newVisitor" prop="phone">
                        <el-input v-model="card.phone" :placeholder="$t('citizen-card.phone')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('citizen-card.email')" v-show="this.ui.newVisitor"
                                    prop="email">
                        <el-input v-model="card.email" :placeholder="$t('citizen-card.email')"></el-input>
                      </el-form-item>
                    </div>
                  </el-form>
                </el-col>
              </el-row>
              <el-form ref="editForm2" :model="card" :rules="cardRules2" label-position="left" style="width: 94.5%">
                <el-form-item style="margin: 0px;padding-top: 10px;"
                              :label="$t('citizen-card.residenceAddress')"
                              prop="residenceAddress"
                >
                  <el-input v-model="card.residenceAddress" readonly
                            :placeholder="$t('citizen-card.residenceAddress')"></el-input>
                </el-form-item>
                <el-form-item
                    :label="$t('citizen-card.description')"
                >
                  <el-input v-model="card.description" :placeholder="$t('citizen-card.description')"></el-input>
                </el-form-item>
                <div style="height: 82px" v-if="this.ui.newVisitor"></div>
                <div style="height: 87px" v-else-if="this.ui.borrow"></div>
                <div style="height: 40px" v-else-if="this.ui.next"></div>
                <div style="height: 137px" v-else></div>
                <el-form-item>
                  <el-row>
                    <el-button class="normal-btn btn-greenlight" @click="handleRegistered" size="mini"
                               v-show="this.ui.newVisitor" :disabled="isButtonEnabled('visitor:register:insert')"
                               style="float: right;height: 40px;font-size: 17px">
                      {{ $t('citizen-card.registered') }}
                    </el-button>
                    <el-button class="normal-btn btn-greenlight" @click="handleVisitorCard" size="mini"
                               v-show="this.ui.borrow" :disabled="isButtonEnabled('visitor:register:visitor:card')"
                               style="float: right;margin-right: 20px;height: 40px;font-size: 17px">
                      {{ $t('Cấp mượn thẻ') }}
                    </el-button>
                    <el-button class="normal-btn btn-greenlight" @click="handleNext" size="mini" v-show="this.ui.next"
                               style="float: right;margin-right: 20px;height: 40px;font-size: 17px">
                      {{ $t('Next') }}
                    </el-button>
                  </el-row>
                </el-form-item>
                <div style="height: 30px;margin: 0px"></div>
              </el-form>
            </el-row>
          </el-card>
        </el-row>
      </div>
      <div class="from-face" style="width: 47%;float: left;min-width: 470px">
        <el-row>
          <el-col>
            <el-row class="el-row-card">
              <el-card class="box-card" align="center" style="height: 520px">
                <h2>{{ $t('citizen-card.authenticationFace') }}</h2>
                <el-row style="margin: 0px;padding: 0px">
                  <div style="margin-top: 10px; height: 300px" v-if="this.ui.imageExist">
                    <img
                        v-if="imageDisplay == null"
                        src="../../assets/faceId1.png"
                        size="mini"
                        height="203"
                    />
                    <img v-else v-bind:src="imageDisplay" size="medium" width="320"/>
                  </div>
                  <div style="margin-top: 10px; height: 150px;margin-right: 90px" v-else>
                    <el-form label-position="right" label-width="150px" size="mini" :model="get" ref="CanRules"
                             :rules="CanRules"
                             style="margin-left: 0px">
                      <el-form-item :label="$t('CAN')" prop="can">
                        <el-input v-model="get.can"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-row>
                <el-row
                    style="width: 90%; background-color: rgba(246,162,162,0.41);bottom: 60px;padding-top:10px;padding-bottom: 10px;border-radius: 10px;padding-left:30px;font-size: 18px;line-height: 30px;text-align: left;">
                  <b>{{ $t('Lưu ý:') }} </b><span> + {{ $t('Đặt thẻ CCCD lên trên đầu đọc') }}</span><br/>
                </el-row>
                <el-row style="bottom: 40px;">
                  <el-button style="padding: 12px 20px;"
                             type="primary"
                             v-show="!ui.next"
                             @click="getInformation()"
                             size="small"
                  >{{ $t('citizen-card.getInfo') }}
                  </el-button>
                </el-row>
              </el-card>
            </el-row>
          </el-col>
        </el-row>
        <el-col style="margin-top: 20px">
          <el-row>
            <el-card class="box-card" align="center">
              <el-button
                  type="primary"
                  @click="getDevices()"
                  size="mini"
                  style="font-size: 15px"
              >{{ $t('citizen-card.getDeviceInfo') }}
              </el-button>
              <el-button
                  type="primary"
                  @click="reset"
                  size="mini"
                  style="font-size: 15px"
              >{{ $t('citizen-card.reset') }}
              </el-button>
              <el-row class="el-row-card" style="margin-left: 50px;margin-top: 12px">
                <el-form
                    label-width="143px"
                    size="mini"
                    v-model="devices"
                    label-position="right"
                    style="margin-top: 20px"
                >
                  <el-form-item :label="$t('citizen-card.time')">
                    <span v-model="time">{{ this.time }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('citizen-card.reader')">
                  <span v-model="devices.reader">{{
                      this.devices.reader
                    }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('citizen-card.camera')">
                  <span v-model="devices.camera">{{
                      this.devices.camera
                    }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('citizen-card.finger')" style="margin-bottom: 20px">
                  <span v-model="devices.scanner">{{
                      this.devices.scanner
                    }}</span>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
      </div>
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
import i18n from "../i18n";
import Axios from "axios/index";
import https from "https";
import * as utils from "../../utils";

@Component({
  components: {},
})
export default class CitizenIdCard extends Vue {
  ui = {
    load: false,
    newVisitor: false,
    loading: false,
    borrow: false,
    show: false,
    next: false,
    success: false,
    can: false,
    imageExist: false
  }

  message = "";
  info = {
    docNumber: "",
  };
  image: any = null;
  socket: any;
  cardId: any = null;
  card = {
    providerCode: "",
    phone: "",
    email: "",
    idCardNo: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    placeOfOrigin: "",
    residenceAddress: "",
    description: "",
    expiredNDA: "",
    createdNDA: ""
  }
  get = {
    can: ''
  }
  borrowCard = {
    cardId: ''
  }
  addCardVisitor = {
    visitorId: '',
    cardId: ''
  }
  cardRules1 = {
    idCardNo: [{required: true, message: i18n.t("citizen-card.inputIdCardNumber"), trigger: 'blur'}],
    name: [{required: true, message: i18n.t("citizen-card.inputFullName"), trigger: 'blur'}],
    dateOfBirth: [{required: true, message: i18n.t("citizen-card.inputDateOfBirth"), trigger: 'blur'}],
    nationality: [{required: true, message: i18n.t("citizen-card.inputNationality"), trigger: 'blur'}],
    gender: [{required: true, message: i18n.t("citizen-card.inputGender"), trigger: 'blur'}],
  }

  borrowCardRules = {
    cardId: [{required: true, message: i18n.t("citizen-card.inputVisitor"), trigger: 'blur'}]
  }

  cardRules2 = {
    placeOfOrigin: [{required: true, message: i18n.t("citizen-card.inputPlaceOfOrigin"), trigger: 'blur'}],
    residenceAddress: [{required: true, message: i18n.t("citizen-card.inputResidenceAddress"), trigger: 'blur'}],
  }

  CanRules = {
    can: [{required: true, message: i18n.t("citizend.canInput"), trigger: 'blur'},
      {validator: this.validateCan, trigger: "blur"}],
  }

  Provider: any = null
  imageCard: any = null;
  imageDisplay: any = null;
  fingerLeft: any = null;
  devices: any = [];
  camera: any = null;
  loading = false;
  socketIcaoFace: any;
  identifying = false;
  typeFaceAuthentication = 1;
  imageFace = "";
  time = "";
  Card: any = null

  validateCan(rule: any, value: any, callback: any) {
    console.log()
    var letters = /^[0-9]+$/;
    if (value.length != 6 || !value.match(letters)) {
      callback(new Error(String(i18n.t("citizend.canLength"))));
    } else {
      callback();
    }
  }

  async handleRegistered() {
    let validate1 = await Utils.validateForm(this.$refs.editForm1);
    let validate2 = await Utils.validateForm(this.$refs.editForm2);
    if (!(validate1 && validate2)) return;
    let record = {
      documentType: 1,
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
    record.providerCode = this.card.providerCode;
    record.phoneNumber = this.card.phone;
    record.email = this.card.email;
    record.noCard = this.card.idCardNo
    record.name = this.card.name
    record.dateOfBirth = this.card.dateOfBirth;
    record.gender = this.card.gender;
    record.placeOfBirth = this.card.nationality
    record.description = this.card.description;
    record.nationality = this.card.nationality;
    record.address = this.card.residenceAddress
    record.image = this.$store.getters.getImageData;
    record.template = this.$store.getters.getTemplateData;
    let result = await utils.doPost(
        this,
        "/api/admin/visitor",
        record
    );
    if (!result.success) {
      Utils.showWarning(String(i18n.t('common.insertFail')) + String(i18n.t(result.message)).toLowerCase())
      this.message = String(i18n.t('common.insertFail')) + " " + String(i18n.t(result.message)).toLowerCase()
      this.ui.success = false
    } else {
      Utils.showSuccess(String(i18n.t('common.insertSuccess')));
      this.message = String(i18n.t('common.insertVisitorSuccess')) + String(i18n.t('Vui lòng lấy thẻ CCCD ra')) + " " + String(i18n.t('Vui lòng đặt thẻ ra vào lên trên thiết bị')).toLowerCase()
      this.ui.newVisitor = false;
      this.ui.borrow = true;
      this.ui.success = true
      // this.$store.commit('setImage', {image: ""})
    }
  }

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  async handleVisitorCard() {
    if (!this.ui.imageExist) {
      this.ui.can = true;
      this.borrowCard.cardId = '';
      this.addCardVisitor.visitorId = this.card.idCardNo
      return;
    }
    this.ui.loading = true
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
          query.visitorId = this.card.idCardNo
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

  wsDisconnect() {
    this.socket.close();
  }

  async handleBorror(query: any) {
    let result = await Utils.doPost(this, `/api/admin/visitor-card`, query);
    if (result.success) {
      Utils.showSuccess(String(i18n.t('common.borrowSuccess')));
      this.cardId = query.cardId;
      this.ui.borrow = false;
      this.ui.next = true;
      this.message = String(i18n.t('common.borrowSuccess'));
      this.ui.success = true
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
    await this.getCard();
  }

  async handleNext() {
    this.reset();
    this.ui.next = false;
  }

  async beforeDestroy() {
    this.wsDisconnect();
    this.$store.commit('setTitleRegister', {titleRegister: ""})
    this.$router.push({path: `/check-visitor`})
  }

  async getProvider() {
    let result = await Utils.doGet(this, `/api/admin/provider/all`);
    if (result.success) {
      this.Provider = result.data;
      this.ui.load = true
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async getCard() {
    let result = await Utils.doGet(this, `/api/admin/access-card/all`);
    if (result.success) {
      this.Card = result.data;
    } else {
      Utils.showWarning(String(i18n.t('common.loadFail')));
    }
  }

  async mounted() {
    this.ui.borrow = false;
    this.ui.newVisitor = false;
    await this.getProvider();
    await this.getCard();
    this.imageDisplay = "data:image/jpeg;base64," + this.$store.getters.getImageData;
    console.log(this.$store.getters.getImageData)
    this.ui.imageExist = this.$store.getters.getImageData.length > 0
  };

  getInformation() {
    if (this.ui.imageExist) {
      if (this.typeFaceAuthentication === 1) {
        this.clearText();
        this.wsICAOFace();
      }
    } else this.getCan();
  }

  async getCan() {
    let validated = await Utils.validateForm(this.$refs.CanRules);
    if (!validated) return;
    let result = await this.getDataToCan();
    let obj = result.data;
    if (obj.success) {
      // const {data} = obj.data;
      this.card = obj.data.dg13;
      this.imageCard = "data:image/jpeg;base64," + obj.data.faceImage;
      Utils.showSuccess(String(i18n.t('authenticationGetInfoSuccess')));
      this.ui.success = true
      this.ui.show = true
      console.log(this.card)
      let query = {} as any;
      query.documentType = 1;
      query.visitorId = this.card.idCardNo;
      this.handCheckVisitor(query);
    } else {
      Utils.showWarning(String(i18n.t('authenticationGetInfoFailed')));
      this.message = String(i18n.t('authenticationGetInfoFailed'));
      this.ui.success = false
      return;
    }
  }

  getDataToCan() {
    return Axios.post("http://localhost:16002/moc/readinfo", this.get, {
      httpsAgent: this.httpsAgent,
    });
  }

  getTypeLinkDevice() {
    return Axios.get("http://localhost:16002/devices", {
      httpsAgent: this.httpsAgent,
    });
  }

  httpsAgent = new https.Agent({rejectUnauthorized: false});

  async getDevices() {
    let timeStampInMs = Date.now();
    let result = await this.getTypeLinkDevice();
    if (result.data.success) {
      this.devices = result.data.data;
      this.time = ((Date.now() - timeStampInMs) / 1000).toString() + "(s)";
    } else {
      Utils.showWarning(String(i18n.t("common.loadFail")));

    }
  }

  reset() {
    this.cardId = null;
    this.ui.show = false;
    this.ui.newVisitor = false;
    this.imageDisplay = null;
    this.imageCard = null;
    this.fingerLeft = null;
    this.message = "";
    this.card.providerCode = "";
    this.card.phone = "";
    this.card.email = "";
    this.card.idCardNo = "";
    this.card.name = "";
    this.card.dateOfBirth = "";
    this.card.gender = "";
    this.card.nationality = "";
    this.card.placeOfOrigin = "";
    this.card.residenceAddress = "";
    this.card.description = "";
    this.devices = [];
    this.typeFaceAuthentication = 1;
    this.card.createdNDA = "";
    this.card.expiredNDA = "";
    this.image = "";
    this.time = "";
    this.socketIcaoFace.close();
  }

  clearText() {
    this.ui.show = false;
    this.ui.newVisitor = false;
    // this.imageDisplay = this.$store.getters.getImageData;
    this.imageCard = null;
    this.fingerLeft = null;
    this.card.providerCode = "";
    this.card.phone = "";
    this.card.email = "";
    this.card.idCardNo = "";
    this.card.name = "";
    this.card.dateOfBirth = "";
    this.card.gender = "";
    this.card.nationality = "";
    this.card.placeOfOrigin = "";
    this.card.residenceAddress = "";
    this.card.description = "";
    this.card.createdNDA = "";
    this.card.expiredNDA = "";
    this.devices = [];
    Utils.clearValidateForm(this.$refs.editForm1);
    Utils.clearValidateForm(this.$refs.editForm2);
  }

  wsICAOFace() {
    this.ui.borrow = false;
    this.ui.show = false;
    this.ui.newVisitor = false;
    this.imageCard = null;
    this.loading = true;
    this.message = "";
    Utils.clearValidateForm(this.$refs.editForm1);
    Utils.clearValidateForm(this.$refs.editForm2);
    try {
      this.socketIcaoFace = new WebSocket("ws://localhost:16002/face-icao-ws");
      let timeStampInMs = Date.now();
      // let image = this.$store.getters.getImageData;
      let tempalte = this.$store.getters.getTemplateData;
      this.socketIcaoFace.onopen = () => {
        console.log("connected");
        // this.socketIcaoFace.send(image)
        this.socketIcaoFace.send(tempalte)
      };
      this.socketIcaoFace.onerror = () => {
        console.log("connected failed");
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
        this.ui.success = false
        this.message = String(i18n.t('connectServiceFailed'))
      };
      this.socketIcaoFace.onmessage = (data: any) => {
        let arr = data.data as any;
        var obj = JSON.parse(arr);
        if (obj.image !== null)
          this.imageDisplay = "data:image/jpeg;base64," + obj.image;
        if (obj) {
          if (obj.verifyResponse != null && obj.verifyResponse.code == 1015) {
            this.message = String(i18n.t('Camera not found'))
            this.ui.success = false
            this.wsDisconnect();
          } else if (obj.verifyResponse != null && obj.verifyResponse.code == 202) {
            this.message = String(i18n.t('Vui lòng đặt thẻ CCCD lên trên đầu đọc'))
            this.ui.success = false
          } else if (obj.verifyResponse != null && obj.verifyResponse.code == 123) {
            this.message = String(i18n.t('Face not found'))
            this.ui.success = false
          } else if (obj.verifyResponse != null && (obj.verifyResponse.code == 201 || obj.verifyResponse.code == 208)) {
            this.message = String(i18n.t('Reader not found'))
            this.ui.success = false
          } else if (obj.verifyResponse != null && obj.verifyResponse.code == 210) {
            this.message = String(i18n.t('Card not found'))
            this.ui.success = false
          } else if (obj.verifyResponse != null || obj.verifyResponse.code !== 0) {
            this.message = String(i18n.t('citizen-card.authenticationFaile'))
            this.ui.success = false
          } else {
            // this.message = String(i18n.t('Vui lòng nhìn vào camera'))
            this.ui.success = true
          }
          if (obj.quality > 0) {
            this.wsDisconnectIcaoFace();
            this.identifying = false;
            if (obj.verifyResponse.code == 0) {
              const {data} = obj.icaoResponse;
              console.log(data);
              this.card = data.dg13;
              this.imageCard = "data:image/jpeg;base64," + data.faceImage;
              this.imageFace = obj.image
              Utils.showSuccess(String(i18n.t('authenticationGetInfoSuccess')));
              this.ui.success = true
              this.ui.show = true
              console.log(this.card)
            } else {
              Utils.showWarning(String(i18n.t('authenticationGetInfoFailed')));
              this.message = String(i18n.t('authenticationGetInfoFailed'));
              this.ui.success = false
              return;
            }
            this.time = ((Date.now() - timeStampInMs) / 1000).toString() + "(s)";
            let query = {} as any;
            query.documentType = 1;
            query.visitorId = this.card.idCardNo;
            query.image = this.$store.getters.getImageData;
            query.template = this.$store.getters.getTemplateData;
            this.handCheckVisitor(query);
          }
        } else {
          timeStampInMs = Date.now();
        }
        this.loading = false
      };
    } catch (e) {
      console.log("connected failed");
    }
  }

  async handCheckVisitor(query: any) {
    let result = await utils.doPost(this, `/api/admin/visitor/getVisitor`,query);
    if (result.success) {
      this.ui.borrow = true
      this.ui.newVisitor = false;
      this.ui.success = false
      this.card.createdNDA = result.data.createdNDA
      this.card.expiredNDA = result.data.expiredNDA
      this.message = String(i18n.t('citizen-card.registeredVisitor')) + ". " + String(i18n.t('Vui lòng kiểm tra lại thông tin'))
    } else {
      this.ui.newVisitor = true;
      this.ui.borrow = false;
      this.ui.success = true
      this.message = String(i18n.t('citizen-card.unregisteredVisitor2'))
    }
  }

  wsDisconnectIcaoFace() {
    console.log("disconnect")
    this.socketIcaoFace.close();
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
  /*height: 1000px;*/
}

.imgDisplay {
  display: inline-block;
  height: 256px;
  width: 160px;
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
  .from-text {
    width: 100%;
  }

  .from-face {
    width: 100%;
  }
}

@media (max-width: 1024px ) {
  .from-text {
    width: 100%;
  }

  .from-face {
    width: 100%;
  }
}

@media (max-width: 320px ) {
  .from-text {
    width: 100%;
  }

  .from-face {
    width: 100%;
  }
}


@media (max-width: 1380px ) {
  .from-text {
    width: 50%;
    float: left;
  }

  .from-face {
    width: 40%;
    float: left;
  }
}

@media (max-width: 1600px ) {
  .from-text {
    width: 50%;
    float: left;
  }

  .from-face {
    width: 40%;
    float: left;
  }
}
</style>
