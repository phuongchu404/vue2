<template>
  <div>
    <el-card class="box-card title" style="width: 100%; margin-top: 10px;padding-bottom: 100px">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;font-size:20px;color: black;font-weight: 500;margin-left: 10px">{{$t('home.userinfo')}}</span>
      </div>
      <el-row>
        <el-col :span="8"><img src="../../assets/user2.png" width="178" height="178"/></el-col>
        <el-col :span="16" >
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.username") }}</el-col>
            <el-col :span="18">{{ sysUserName }}</el-col>
          </el-row>
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.realname") }}</el-col>
            <el-col :span="18">{{ sysRealName }}</el-col>
          </el-row>
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.roles") }}</el-col>
            <el-col :span="18">{{ sysUserRolesString }}</el-col>
          </el-row>
          <el-row class="text item" style="font-size: 16px">
            <el-col :span="6">{{ $t("profile.lastlogin") }}</el-col>
            <el-col :span="18">{{ sysUserLastLogin }}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
<!--    <el-report class="box-report title" style="width: 100%; margin-top:30px">-->
<!--      <div slot="header" class="clearfix" style="width: 100%; height: 100%">-->
<!--        <span style="line-height: 36px;font-size:17px;color: white;font-weight:500">{{-->
<!--            $t('device.statistic')-->
<!--          }} </span>-->
<!--      </div>-->
<!--      <el-row>-->
<!--        <el-col :span="8">-->
<!--          <el-report class="box-report total" style="margin: 20px" align="center">-->
<!--            <div slot="header" class="clearfix">-->
<!--              <span style="font-weight: 500;font-size:16px;">{{ $t('device.total') }}</span>-->
<!--            </div>-->
<!--            <div class="text item" align="center" @click="gotoDevice()">-->
<!--              <h2 style="margin: 0px 20px;">{{ totalDevice }}</h2>-->
<!--            </div>-->
<!--          </el-report>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-report class="box-report total" style="margin: 20px;" align="center">-->
<!--            <div slot="header" class="clearfix">-->
<!--              <span style="font-weight: 500;font-size:16px;">{{ $t('reader.total') }}</span>-->
<!--            </div>-->
<!--            <div class="text item" align="center" @click="gotoReader()">-->
<!--              <h2 style="margin: 0px 20px;">{{ totalReader }}</h2>-->
<!--            </div>-->
<!--          </el-report>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-report>-->

    <el-dialog :title="$t('profile.twosteptitle')" :visible.sync="ui.activateDialogVisible">
      <el-row>
        <el-col :span="10"><img :src="this.sysUserQRImage"></img></el-col>
        <el-col :span="14">
          <el-row>
            <el-col :span="24">{{ $t("profile.tiprow1") }}</el-col>
            <el-col :span="24">{{ $t("profile.tiprow2") }}</el-col>
            <el-col :span="24">&nbsp;</el-col>
            <el-col :span="24">&nbsp;</el-col>
            <el-col :span="24">&nbsp;</el-col>
            <el-col :span="24">{{ $t("profile.otp") }}</el-col>
            <el-col :span="24">
              <el-form :model="activateForm" :rules="activateFormRules" label-width="100px" ref="activateForm" inline>
                <el-form-item label="" prop="otp">
                  <el-input v-model="activateForm.otp"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ui.activateDialogVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" @click="handleEnableTwoStep">{{ $t("common.ok") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as Utils from '../../utils';
import i18n from '../i18n';

@Component
export default class Profile extends Vue {
  ui = {activateDialogVisible: false};
  sysUserName = '';
  sysRealName = '';
  sysUserAvatar = '';
  sysUserRoles = [];
  sysUserLastLogin = '';
  twoStepEnabled = false;
  twoStepStatus = '';
  sysUserQRImage = '';
  activateForm = {otp: ''};
  totalDevice = 0;
  totalReader = 0;
  activateFormRules = {
    otp: [{required: true, message: i18n.t('profile.otpisnull'), trigger: 'blur'}]
  };


  get sysUserRolesString() {
    let names = new Array();
    this.sysUserRoles.map((item: any) => {
      names.push(item.roleName);
    });
    return names.join(",");
  };

  mounted() {
    let userString = sessionStorage.getItem('user');
    if (userString) {
      let user = JSON.parse(userString);
      this.sysUserName = user.userName;
      this.sysRealName = user.realName;
      this.sysUserAvatar = user.avatar || '';
      this.sysUserRoles = user.roles;
      this.sysUserLastLogin = Utils.formatDateString(user.lastLogin);
      this.twoStepEnabled = user.twoStepEnabled;
      this.twoStepStatus = user.twoStepEnabled ? String(i18n.t('common.enabled')) : String(i18n.t('common.disabled'));
    }
    this.countDevice();
    this.countReader();
  };

  async countDevice() {
    let result = await Utils.doGet(this, '/api/device/count');
    this.totalDevice = result.data;
  }

  async countReader() {
    let result = await Utils.doGet(this, '/api/reader/count');
    this.totalReader = result.data;
  }

  async handleEnableTwoStep() {
    let validate = await Utils.validateForm(this.$refs.activateForm);
    if (!validate) return;
    let otp = this.activateForm.otp;
    let result = await Utils.doPost(this, '/api/sessions/twostep/' + otp);
    if (!result.success) {
      Utils.showWarning(String(i18n.t('profile.activatefalieddetailtip')) + result.message);
      return;
    } else {
      Utils.showSuccess(String(i18n.t('profile.activatesuccesstip')));
      this.twoStepEnabled = true;
      this.twoStepStatus = '已激活';
      let user = JSON.parse(sessionStorage.getItem('user') as string);
      user.twoStepEnabled = true;
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    this.ui.activateDialogVisible = false;
  };
}
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  padding: 12px 0;
}
</style>
