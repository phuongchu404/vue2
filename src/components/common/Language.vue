<template>
  <el-row type="flex" justify="center" class="appfooter-language">
    <el-col :span="24">
      <el-button text @click="changeLanguage('en-US')">
        <img src="../../assets/flag_eng.png" height="22px" width="35px"/>
      </el-button>
      <el-button text @click="changeLanguage('vi-VN')">
        <img src="../../assets/flag_vn.png" height="22px" width="35px"/>
      </el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { locale } = useI18n()
const router = useRouter()

const changeLanguage = async (lang: string) => {
  locale.value = lang
  localStorage.setItem("LANG", lang)
  router.go(0)
}
</script>