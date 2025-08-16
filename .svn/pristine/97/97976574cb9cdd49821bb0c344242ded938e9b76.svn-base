<template>
    <div>
        <el-card class="box-card" style="width: 60%">
            <div slot="header" class="clearfix">
                <span style="line-height: 36px;color: white">{{ $t("profile.infotitle") }}</span>
            </div>
            <el-row>
                <el-col :span="8"><img :src="this.sysUserAvatar" width="128" height="128"/></el-col>
                <el-col :span="16">
                    <el-row class="text item">
                        <el-col :span="6">{{ $t("profile.username") }}</el-col>
                        <el-col :span="18">{{sysUserName}}</el-col>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="6">{{ $t("profile.roles") }}</el-col>
                        <el-col :span="18">{{sysUserRolesString}}</el-col>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="6">{{ $t("profile.lastlogin") }}</el-col>
                        <el-col :span="18">{{sysUserLastLogin}}</el-col>
                    </el-row>
                    <el-row class="text item">
                        <el-col :span="6">{{ $t("profile.twostepstatus") }}</el-col>
                        <el-col :span="12">{{twoStepStatus}}</el-col>
                        <el-col :span="6">
                            <el-button type="primary" style="width:100%" size="small" :disabled="twoStepEnabled" @click.native="handleActivate">{{ $t("common.activate") }}</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>

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
    ui = {activateDialogVisible:false};
    sysUserName = '';
    sysUserAvatar = '';
    sysUserRoles = [];
    sysUserLastLogin = '';
    twoStepEnabled = false;
    twoStepStatus = '';
    sysUserQRImage = '';
    activateForm = {otp: ''};
    activateFormRules = {
        otp: [{required: true, message: i18n.t('profile.otpisnull'), trigger: 'blur'}]
    };


    get sysUserRolesString() {
            let names = new Array();
            this.sysUserRoles.map((item: any)=>{
                names.push(item.roleName);
            });
            return names.join(",");
    };

	mounted() {
		let userString = sessionStorage.getItem('user');
		if (userString) {
			let user = JSON.parse(userString);
			this.sysUserName = user.realName || user.userName;
			this.sysUserAvatar = user.avatar || '';
            this.sysUserRoles = user.roles;
            this.sysUserLastLogin = Utils.formatDateString(user.lastLogin);
            this.twoStepEnabled = user.twoStepEnabled;
            this.twoStepStatus = user.twoStepEnabled? String(i18n.t('common.enabled')) :  String(i18n.t('common.disabled')) ;
            if (user.needTwoStep && !user.twoStepEnabled) {
                Utils.confirm(this, String(i18n.t('profile.activatetip')));
                this.handleActivate();
            }
		}
    };

    async handleActivate() {
        let confirmed = await Utils.confirm(this, String(i18n.t('profile.confirmactivatetip')));
        if (!confirmed) return;
        let result = await Utils.doGet(this, '/api/sessions/secret');
        if (!result.success) {
            Utils.showWarning(String(i18n.t('profile.activatefaliedtip')));
            return;
        }
        this.sysUserQRImage = "/api/sessions/secret/image/"+result.data;
        this.ui.activateDialogVisible = true;
    };

    async handleEnableTwoStep() {
        let validate = await Utils.validateForm(this.$refs.activateForm);
        if (!validate) return;
        let otp = this.activateForm.otp;
        let result = await Utils.doPost(this, '/api/sessions/twostep/'+otp);
        if (!result.success) {
            Utils.showWarning(String(i18n.t('profile.activatefalieddetailtip'))+result.message);
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
