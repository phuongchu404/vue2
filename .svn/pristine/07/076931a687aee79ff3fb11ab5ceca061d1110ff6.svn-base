<template>
  <div class="infinite-list-wrapper" style="overflow:auto">
    <el-row class="container">
      <el-col :span="24" class="header">
        <el-col :span="19" class="logo" style="color: #115484">
          <img src="../../assets/mk-logo.png"
               style="height: 40px; width: 130px; padding-left: 50px;padding-right: 30px"/>
          <span style="margin-top:5px;color: #115484;font-size: 26px;font-family: Roboto-Bold;">MK - Visitor Management
					</span>
        </el-col>
        <el-col :span="2" class="userinfo">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link userinfo-inner" style="color: #115484;font-size: 16px"><img
                src="../../assets/user2.png" style="width: 35px; height: 35px;"> {{ sysUserName }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleChangePassword">
                <i class="el-icon-fa-edit"/>{{ $t("home.funpwd") }}
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">
                <i class="el-icon-fa-sign-out-alt" style="width: 15px"/>{{ $t("home.funlogout") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="2" class="language">
          <app-language></app-language>
        </el-col>
      </el-col>

      <el-col :span="24" class="main">
        <aside>
          <el-menu :default-active="$route.path" unique-opened @open="handleopen" @close="handleclose"
                   @select="handleselect" background-color="#09446d"
                   text-color="#D6E4E5" active-text-color="#fd6d21" router>
            <template v-for="(item,index) in allMenus" v-if="!item.hidden">
              <el-submenu :index="index+''" v-if="!item.leaf" :key="item.tag">
                <template slot="title">
                  <i :class="item.icon"/>{{ item.name }}
                </template>
                <el-menu-item v-for="child in item.children" :index="child.path" v-if="!child.hidden" :key="child.tag">
                  <i :class="child.icon"/>{{ child.name }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-if="item.leaf" :index="item.path" :key="item.tag">
                <i :class="item.icon"/>{{ item.name }}
              </el-menu-item>
            </template>
          </el-menu>
        </aside>
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="Breadcrumb">
             {{ $route.name }}
            </el-col>
            <el-col :span="24" class="content-wrapper">
              <transition>
                <router-view>
                  {{ $t("home.userinfo") }}
                </router-view>
              </transition>
            </el-col>
            <el-col :span="24" class="footer">
              <app-footer></app-footer>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
    <el-dialog :title="$t('home.funpwd')" :visible.sync="ui.dialogVisible" width="650px" center class="addDio">
      <el-form :model="editForm" :rules="editFormRules" label-width="190px" label-position="right" size="small"
               ref="editForm">
        <el-form-item :label="$t('home.pwdold')" prop="oldPassword">
          <el-input type="password" v-model="editForm.oldPassword" clearable class="edit-form-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('home.pwdnew')" prop="newPassword">
          <el-input type="password" v-model="editForm.newPassword" clearable class="edit-form-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('home.pwdrpt')" prop="newPasswordAgain">
          <el-input type="password" v-model="editForm.newPasswordAgain" clearable class="edit-form-input"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ui.dialogVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" @click.native="changePassword()">{{ $t("common.ok") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import i18n from "../i18n";
import * as   utils from "../../utils";
import * as nav from "../../common/nav";
import Language from "../common/Language.vue";

@Component({
  components: {
    'app-language': Language
  }
})

@Component
export default class Home extends Vue {
  allMenus = [];
  sysUserName = "";
  sysUserAvatar = "";
  form = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: ""
  };
  editForm = {} as any;
  editFormRules = {
    oldPassword: [
      {required: true, message: i18n.t("home.oldisnull"), trigger: "blur"}
    ],
    newPassword: [
      {required: true, message: i18n.t("home.newisnull"), trigger: "blur"}
    ],
    newPasswordAgain: [
      {required: true, message: i18n.t("home.repeatnew"), trigger: "blur"},
      {validator: this.validatePasswordAgain, trigger: "blur"}
    ]
  };

  ui = {
    dialogVisible: false
  };

  validatePasswordAgain(rule: any, value: any, callback: any) {
    if (value == "") {
      callback(new Error(String(i18n.t("home.repeatnew"))));
    } else if (value != this.editForm.newPassword) {
      callback(new Error(String(i18n.t("home.notsame"))));
    } else if (value == this.editForm.oldPassword) {
      callback(new Error(String(i18n.t("home.issame"))));
    } else {
      callback();
    }
  }

  handleopen() {
    console.log('handleopen');
  }

  handleclose() {
    console.log('handleclose');
  }

  handleselect(a: any, b: any) {
  }

  async handleChangePassword() {
    let el: any = this.$refs.editForm;
    if (el) {
      el.resetFields();
    }
    this.editForm = {};
    this.ui.dialogVisible = true;
  }

  async changePassword() {
    let validated = await utils.validateForm(this.$refs.editForm);
    if (!validated) return;
    let confirmed = await utils.confirm(
        this,
        String(i18n.t("home.change-pwd-confirm")),
        String(i18n.t("home.confirmTip"))
    );
    if (!confirmed) return;
    let record = this.editForm;
    let result = await utils.doPost(
        this,
        "/api/sessions/passwordchange",
        record
    );
    if (!result.success) {
      if (result.code = 302) {
        utils.showWarning(String(i18n.t('user.incorrectpassword')));
      } else {
        utils.showWarning(String(i18n.t('home.funpwdfal')) + result.message);
      }
    } else {
      utils.showSuccess(String(i18n.t("home.funpwdsuc")));
      this.ui.dialogVisible = false;
      this.forceLogout();
    }
  }

  async forceLogout() {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("user");
    this.$router.push("/login");
  }

  async logout() {
    let confirmed = await utils.confirm(
        this,
        String(i18n.t("home.logoutmessage")),
        String(i18n.t("home.confirmTip"))
    );
    if (confirmed) {
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  }

  async loadAllMenus() {
    let result = await utils.doGet(this, "/api/sessions/permissions");
    if (result.success) {
      this.allMenus = result.data;
    }
    var availButtons = [];
    for (var i = 0; i < this.allMenus.length; i++) {
      var menu: any = this.allMenus[i];
      if (menu.children) {
        var buttons = menu.children;
        for (var k = 0; k < buttons.lenght; k++)
          availButtons.push(buttons[k].tag);
      }
      if (menu.children) {
        for (var j = 0; j < menu.children.length; j++) {
          var child = menu.children[j];
          if (child.children) {
            var buttons = child.children;
            for (var k = 0; k < buttons.length; k++)
              availButtons.push(buttons[k].tag);
          }
        }
      }
    }
    this.$store.commit("setButtons", {
      buttons: new Set(availButtons)
    });
  }

  async availButtons() {
    let result = await utils.doGet(this, "/api/sessions/permission/tag");
    let availableTags = [];
    if (result.success) {
      availableTags = result.data;
      let menus: any = nav.getNavData();
      this.hiddenMenus(menus, availableTags);
      this.allMenus = menus;
    }
    this.$store.commit("setButtons", {
      buttons: new Set(availableTags)
    });
  }

  hiddenMenus(menus: any, tags: any) {
    for (let menu of menus) {
      if (menu.whiteList) {
        menu.hidden == false;
      } else {
        menu.hidden = !this.compareTag(menu.tag, tags);
      }
      if (menu.children) {
        this.hiddenMenus(menu.children, tags);
      }
    }
  }

  compareTag(tag: string, tags: Array<string>) {
    let flag = false;
    for (let t of tags) {
      if (t == tag) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  mounted() {
    let userString = sessionStorage.getItem("user");
    if (userString) {
      let user = JSON.parse(userString);
      this.sysUserName = user.realname || user.userName;
      this.sysUserAvatar = user.avatar || "";
    }
    this.availButtons();
  }
}
</script>
<style scoped>
.container {
  position: absolute;
  margin: 0px;
  padding: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.container .header {
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  color: #c0ccda;
}

.container .header .userinfo {
  text-align: right;
  padding-right: 10px;
}

.container .header .userinfo .userinfo-inner {
  color: #c0ccda;
  cursor: pointer;
}

.container .header .userinfo .userinfo-inner img {
  width: 32px;
  height: 32px;
  border-radius: 20px;
  margin: 5px 0px 5px 10px;
  float: right;
}

.container .logo {
  font-size: 18px;
  height: 60px;
}

.container .logo img {
  width: auto;
  height: 32px;
  float: left;
  margin: 5px 10px 5px 18px;
  background: white;
}

.container .logo .txt {
  color: #20a0ff;
}

.container .main {
  background: #09446d;
  position: absolute;
  top: 50px;
  bottom: 0px;
  overflow: hidden;
}

.container .main aside {
  width: 250px;
}

.container .content-container {
  /*min-width: 1200px;*/
  background: #f3f5f7;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  left: 249px;
  overflow-y: scroll;
  overflow-x: scroll;
  padding: 20px;
}

.container .content-container .breadcrumb-container {
  margin-bottom: 15px;
}

.container .content-container .breadcrumb-container.title {
  width: 200px;
  float: left;
  color: #475669;
}

.container .content-container .breadcrumb-container .breadcrumb-inner {
  float: right;
}

.container .content-container .breadcrumb-container .content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
  min-height: 70vh;
}

.container .content-container .breadcrumb-container .footer {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}

.container .icon {
  width: 16px;
  height: 14px;
  margin-right: 5px;
  vertical-align: center;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 120px;
  min-height: 400px;
  border-right: none;
}

.language {
  color: white;
}
</style>
