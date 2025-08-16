<template>
  <div>
    <el-row :gutter="16" class="el-row-card" type="flex" style="height: 750px">
      <el-col style="margin: 10px">
        <el-row class="el-row-card" :gutter="20">
          <el-card class="box-card">
            <h1 style="margin-left: 10px;margin-bottom: 35px;padding-bottom:10px;border-bottom: 1px solid #e5e5e5;">
              {{ $t('register.title') }}</h1>
            <div>
              <h2 style="width: 700px;margin: auto;color: red;padding: 40px">{{ $t(this.message) }}</h2>
            </div>
            <div style="width: 100%;padding-top: 50px;margin-bottom: 100px;font-size: 24px">
              <a href="/#/citizen-card" class="div-href">
                <el-button class="button button2" slot="reference" style="position: relative"
                           :disabled="isButtonEnabled('visitor:register:visitor:card')">
                  <img style="float: left;margin: 0px;padding:0px;height: 40px"
                       src="../../assets/smart-id.png"
                  />
                  <span
                      style="float: left;margin: auto;width: 20%;line-height: 70px;text-align: center;position:relative;top: -14px;left: 40px;">{{
                      $t('Căn Cước Công Dân')
                    }}</span>
                </el-button>
              </a>
              <a href="/#/pass-post" class="div-href">
                <el-button class="button button2" slot="reference" style="position: relative"
                           :disabled="isButtonEnabled('visitor:register:visitor:card')">
                  <img style="float: left;margin: 0px;padding:0px;height: 40px"
                       src="../../assets/passport.png"
                  />
                  <span
                      style="float: left;margin: auto;width: 20%;line-height: 70px;text-align: center;position:relative;top: -14px;left: 40px;">{{
                      $t('Hộ Chiếu')
                    }}</span>
                </el-button>
              </a>
              <a href="/#/other-card" class="div-href">
                <el-button class="button button2" slot="reference" style="position: relative"
                           :disabled="isButtonEnabled('visitor:register:visitor:card')">
                  <img style="float: left;margin: 0px;padding:0px;height: 40px"
                       src="../../assets/id-card.png"
                  />
                  <span
                      style="float: left;margin: auto;width: 20%;line-height: 70px;text-align: center;position:relative;top: -14px;left: 40px;">{{
                      $t('Giấy Tờ Khác')
                    }}</span>
                </el-button>
              </a>
              <a href="/#/not-face" class="div-href" v-show="this.show">
                <el-button class="button button2" slot="reference" style="position: relative"
                           :disabled="isButtonEnabled('visitor:register:visitor:card')">
                  <img style="float: left;margin: 0px;padding:0px;height: 40px"
                       src="../../assets/id-card.png"
                  />
                  <span
                      style="float: left;margin: auto;width: 20%;line-height: 70px;text-align: center;position:relative;top: -14px;left: 40px;">{{
                      $t('Khách đã đăng ký')
                    }}</span>
                </el-button>
              </a>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {},
})
export default class indexCard extends Vue {
  message = ""
  show: boolean

  isButtonEnabled(buttonName: string) {
    var state = this.$store.state.buttons.has(buttonName);
    if (state)
      return false;
    return true;
  };

  async mounted() {
    this.message = this.$store.getters.getTitleRegister;
    console.log(this.message)
    this.show = this.$store.getters.getImageData === '' ? false : true;
  };

  async beforeDestroy() {
    console.log("destroy")
    this.$store.commit('setTitleRegister', {titleRegister: ""})
  }
}
</script>
<style>
.el-row-card {
  margin-bottom: 20px;
}

.box-card {
  height: auto;
}

@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

span {
  font-size: 15px;

}

span :hover {
  color: #1F2D3D;
}
</style>
