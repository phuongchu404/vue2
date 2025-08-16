// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Axios from 'axios';

import * as Utils from './utils';
import './assets/css/font-awesome.scss';
import './assets/css/global.scss';
import './assets/css/icon-font.scss';

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import i18n from './components/i18n';
import VCharts from 'v-charts'
// import './assets/style/index.scss'

import AppFooter from '@/components/common/Footer.vue';
import AppLanguage from '@/components/common/Language.vue';
import App from './App.vue';
import router from './router';
import '../src/assets/style/index.scss';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(ElementUI, {
    i18n: (key: string, value: any) => i18n.t(key, value)
});
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VCharts)

Axios.interceptors.request.use(function (config) {
    config.headers['lang'] = localStorage.getItem("LANG") || window.navigator.language
    //access-token
    let oldToken = localStorage.getItem("TOKEN");
    if (oldToken) {
        config.headers['x-access-token'] = oldToken;
    }
    return config;
});
Axios.interceptors.response.use(function (config) {
    // access-token
    let oldToken = localStorage.getItem("TOKEN");
    let token = config.headers['x-access-token'];
    if (token && token != oldToken)
        localStorage.setItem("TOKEN", token);
    return config;
});

Vue.component('AppFooter', AppFooter);
Vue.component('AppLanguage', AppLanguage);
Vue.config.productionTip = true;

var availButtons = new Set();
const store = new Vuex.Store({
    state: {
        buttons: availButtons,
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
            state.buttons = payload.buttons;
        },
        setImage(state, payload) {
            state.image = payload.image;
        },
        setTemplate(state, payload) {
            state.template = payload.template;
        },
        setTitleRegister(state, payload) {
            state.titleRegister = payload.titleRegister;
        },
        setFingerData(state, fingerData) {
            state.fingerData = fingerData;
        },
        setFaceData(state, faceData) {
            state.faceData = faceData;
        },
        toggleSubjectDetailDialog(state, value) {
            state.subjectDetailDialog = value;
        },
        setIdCardData(state, idCardData) {
            state.idCardData = idCardData;
        },
        clearBioData(state, data) {
            state.idCardData = {};
            state.faceData = {};
            state.fingerData = {};
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
});

// use sessionStorage to keep current user object. If there is no user object, redirect to login
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('TOKEN');
    }
    let tempString = sessionStorage.getItem('user');
    if (tempString) {
        let user = JSON.parse(tempString);
        if (!user && to.path != '/login') { // login
            next(); //{path: '/profile'});
        } else {
            next();
        }
    } else {
        if (to.path != '/login')
            next({path: '/login'});
        else
            next();
    }
});

// const app = new Vue({
//   router: router,
//   store: store,
//   render: h => h(App),
// }).$mount("#app");

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store: store,
    router,
    i18n,
    template: '<App/>',
    components: {App}
});
