<template>
  <el-row type="flex" justify="center" class="appfooter-language">
    <el-col :span="24">
      <el-button type="text" @click="changeLanguage('en-US')"><img src="../../assets/flag_eng.png" height="22px"
                                                                   width="35px"/></el-button>
      <el-button type="text" @click="changeLanguage('vi-VN')"><img src="../../assets/flag_vn.png" height="22px"
                                                                   width="35px"/></el-button>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import i18n from '../i18n';

@Component
export default class Language extends Vue {
  async changeLanguage(lang: string) {
    i18n.locale = lang;
    localStorage.setItem("LANG", lang);
    this.$router.go(0)
  };
}
</script>
