<template>
  <el-row
    style="background: #ecf2f9; overflow: auto"
    class="login-window infinite-list-wrapper"
  >
    <div class="login-box">
      <div class="lcname">MK Visitor - Admin</div>
      <div class="lcintro">Visitor Management</div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item label="" style="margin-bottom: 6px">
          <div
            class="input-box"
            :class="{ hover: isUsername }"
            @click.stop="hoverShow('username')"
          >
            <img
              src="../../assets/icon/login-user-select-icon.png"
              class="input-box-icon"
            />
            <input
              type="text"
              v-model="loginForm.username"
              :placeholder="$t('UserName')"
              class="input-box-text"
            />
          </div>
        </el-form-item>
        <el-form-item label="" style="margin-bottom: 6px" prop="password">
          <div
            class="input-box"
            :class="{ hover: isPassword }"
            @click.stop="hoverShow('password')"
          >
            <img
              src="../../assets/icon/login-pwd-select-icon.png"
              class="input-box-icon"
            />
            <input
              :type="!isEyes ? 'password' : 'text'"
              @keyup.enter="doLogin()"
              v-model="loginForm.password"
              :placeholder="$t('Password')"
              class="input-box-text"
            />
            <img
              @click="showPassword"
              v-if="!isEyes"
              src="../../assets/icon/login-eyes-icon.png"
              class="eyes"
              alt=""
            />
            <img
              @click="showPassword"
              v-else
              src="../../assets/icon/login-eyes-select-icon.png"
              class="eyes"
              alt=""
            />
          </div>
        </el-form-item>
        <el-button type="primary" class="login-btn" @click="doLogin()">{{
          $t("login.login")
        }}</el-button>
      </el-form>
      <app-language style="margin: 0" />
    </div>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage, type FormInstance } from "element-plus";
import { useAuthStore } from "@/stores/login";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// Refs
const loginFormRef = ref<FormInstance>();

// Reactive data
const ui = reactive({
  otpVisible: false,
});

const loginForm = reactive({
  username: "",
  password: "",
});

const isPassword = ref(false);
const isUsername = ref(false);
const isEyes = ref(false);

const loginFormRules = reactive({
  username: [
    {
      required: true,
      message: t("login.userIsNull"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("login.passwordIsNull"),
      trigger: "blur",
    },
  ],
});

// Methods
const hoverShow = (type: string) => {
  isPassword.value = false;
  isUsername.value = false;
  if (type === "username") {
    isUsername.value = true;
  } else {
    isPassword.value = true;
  }
};

const showPassword = () => {
  isEyes.value = !isEyes.value;
};

const doLogin = async () => {
  try {
    await loginFormRef.value?.validate();
    const ret = await authStore.login(loginForm);

    if (ret.success) {
      if (ret.code === "0") {
        router.push({ path: "/" });
      } else {
        ui.otpVisible = true;
        ElMessage.info(t("login.OTPtip"));
      }
    } else {
      ElMessage.warning(t("Login info is incorrect"));
    }
  } catch {
    // Validation failed
  }
};

// Lifecycle
onMounted(() => {
  authStore.logout();
});
</script>

<style scoped lang="scss">
input:-webkit-autofill {
  transition: background-color 5000s ease-in-out 0s;
}

.selectLang {
  position: absolute;
  right: 40px;
  top: 40px;
  display: flex;
  align-items: center;

  .langTitle {
    font-size: 14px;
    color: #686868;
    line-height: 16px;
    margin-right: 13px;
    font-family: SourceHanSansCN-ExtraLight;
  }

  .select {
    width: 230px;
    color: #333333;
    height: 40px;
  }

  :deep(.el-input__inner) {
    height: 40px;
    border: 1px solid #e2e2e4;
    color: #333333;
    background: rgba(0, 0, 0, 0);
    font-family: SourceHanSansCN-Regular, Helvetica Neue, Helvetica, Arial,
      PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  }

  :deep(.el-input__suffix) {
    height: 40px;
  }

  :deep(input::-webkit-input-placeholder) {
    color: #333;
  }
}

.copyright {
  font-size: 14px;
  color: #686868;
  line-height: 16px;
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
}

.login-window {
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  height: 100%;
  background-size: 100% 100%;
}

.login-icon {
  width: 128px;
  height: 128px;
  display: block;
  margin: 30px auto 0;
}

.el-button {
  width: 100%;
}

.input-box {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #e2e2e4;
  padding: 0 10px;
  box-sizing: border-box;
}

.input-box .input-box-icon {
  width: 16px;
  height: 18px;
  object-fit: contain;
}

.input-box .input-box-text {
  width: 85%;
  font-size: 14px;
  color: #333333;
  margin-left: 10px;
  border: 0;
  outline: 0;
  font-family: SourceHanSansCN-Regular, Helvetica Neue, Helvetica, Arial,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}

.input-box .eyes {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.input-box input::-webkit-input-placeholder {
  color: #686868;
  font-family: SourceHanSansCN-ExtraLight;
}

.input-box input::-moz-placeholder {
  font-family: SourceHanSansCN-Regular, Helvetica Neue, Helvetica, Arial,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  color: #686868;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  transform: translate(-50%, -50%);
  padding: 25px;
  border-radius: 10px;
  background: #fff;

  .hover {
    transition: 0.5s all;
    border: 1px solid #667fa0;
  }
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 18px;
  background: #23afe3;
  display: block;
  color: #fff;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin-top: 50px;

  &:hover {
    background: #20a8db;
  }
}

.lcname {
  color: #014371;
  text-align: center;
  font-size: 50px;
  line-height: 50px;
  font-weight: bold;
  font-family: SourceHanSansCN-Regular, Helvetica Neue, Helvetica, Arial,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}

.lcintro {
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, Helvetica Neue, Helvetica, Arial,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  color: #014371;
  font-weight: 400;
  letter-spacing: 1px;
  line-height: 16px;
  margin: 20px 0 30px;
  text-align: center;
}

.language {
  text-align: center;
  padding: 5px 0px 0px;
}

.language .language-inner {
  color: #c0ccda;
  cursor: pointer;
}

.logo-login-img {
  width: 200px;
  height: 30px;
  padding-top: 30px;
  object-fit: contain;
  display: block;
  margin: auto;
}
</style>