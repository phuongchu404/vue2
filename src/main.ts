import { createApp } from "vue";
import axios from "axios";

// Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// Styles
import "./assets/css/global.scss";
import "./assets/css/icon-font.scss";
import "./assets/style/index.scss";

// Components
import App from "./App.vue";
import AppFooter from "@/components/common/Footer.vue";
import AppLanguage from "@/components/common/Language.vue";

// Routes and i18n
import router from "./router";
import { i18n } from "./i18n";

// ✅ Pinia
import { createPinia, setActivePinia } from "pinia";
// import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// import { set } from "lodash";

// Create Vue app
const app = createApp(App);

// ✅ Create Pinia (thay cho Vuex)
const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);

// Axios interceptors
axios.interceptors.request.use((config: any) => {
  config.headers["lang"] =
    localStorage.getItem("LANG") || window.navigator.language;
  const token = localStorage.getItem("TOKEN");
  if (token) {
    console.log("token", token);
    config.headers["x-access-token"] = token;
  }
  return config;
});

axios.interceptors.response.use((response) => {
  const token = response.headers["x-access-token"];
  const oldToken = localStorage.getItem("TOKEN");
  if (token && token !== oldToken) {
    localStorage.setItem("TOKEN", token);
  }
  return response;
});

// Router guards (giữ nguyên)
router.beforeEach((to, from, next) => {
  setActivePinia(pinia);
  if (to.path === "/login") {
    sessionStorage.removeItem("user");
    localStorage.removeItem("TOKEN");
  }

  const userString = sessionStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString);
    if (!user && to.path !== "/login") {
      next();
    } else {
      next();
    }
  } else {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

// Register Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component as any);
}

// Register global components
app.component("AppFooter", AppFooter);
app.component("AppLanguage", AppLanguage);

// Use plugins
app.use(ElementPlus);
app.use(pinia); // ✅ dùng Pinia thay vì store Vuex
app.use(router);
app.use(i18n);
// Mount app
app.mount("#app");
