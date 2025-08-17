import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import axios from 'axios'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// Styles
import './assets/css/global.scss'
import './assets/css/icon-font.scss'
import './assets/style/index.scss'

// Components
import App from './App.vue'
import AppFooter from '@/components/common/Footer.vue'
import AppLanguage from '@/components/common/Language.vue'

// Routes and Store
import { routes } from './router'
import { i18n } from './components/i18n'

// Create Vue app
const app = createApp(App)

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// Create store
const store = createStore({
  state: {
    buttons: new Set(),
    fingerData: {},
    faceData: {},
    idCardData: {},
    subjectDetailDialog: false,
    image: '',
    template: '',
    titleRegister: ''
  },
  mutations: {
    setButtons(state, payload) {
      state.buttons = payload.buttons
    },
    setImage(state, payload) {
      state.image = payload.image
    },
    setTemplate(state, payload) {
      state.template = payload.template
    },
    setTitleRegister(state, payload) {
      state.titleRegister = payload.titleRegister
    },
    setFingerData(state, fingerData) {
      state.fingerData = fingerData
    },
    setFaceData(state, faceData) {
      state.faceData = faceData
    },
    toggleSubjectDetailDialog(state, value) {
      state.subjectDetailDialog = value
    },
    setIdCardData(state, idCardData) {
      state.idCardData = idCardData
    },
    clearBioData(state) {
      state.idCardData = {}
      state.faceData = {}
      state.fingerData = {}
    }
  },
  getters: {
    getFingerData: state => state.fingerData,
    getFaceData: state => state.faceData,
    getSubjectDetailDialogStatus: state => state.subjectDetailDialog,
    getIdCardData: state => state.idCardData,
    getImageData: state => state.image,
    getTemplateData: state => state.template,
    getTitleRegister: state => state.titleRegister,
  }
})

// Axios interceptors
axios.interceptors.request.use(function (config) {
  config.headers['lang'] = localStorage.getItem("LANG") || window.navigator.language
  const token = localStorage.getItem("TOKEN")
  if (token) {
    config.headers['x-access-token'] = token
  }
  return config
})

axios.interceptors.response.use(function (response) {
  const token = response.headers['x-access-token']
  const oldToken = localStorage.getItem("TOKEN")
  if (token && token !== oldToken) {
    localStorage.setItem("TOKEN", token)
  }
  return response
})

// Router guards
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('TOKEN')
  }
  
  const userString = sessionStorage.getItem('user')
  if (userString) {
    const user = JSON.parse(userString)
    if (!user && to.path !== '/login') {
      next()
    } else {
      next()
    }
  } else {
    if (to.path !== '/login') {
      next({ path: '/login' })
    } else {
      next()
    }
  }
})

// Use plugins
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(i18n)

// Register Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}



// Register global components
app.component('AppFooter', AppFooter)
app.component('AppLanguage', AppLanguage)

// Mount app
app.mount('#app')