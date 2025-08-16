import Vue from 'vue'
import VueI18n from 'vue-i18n'
import * as _ from 'lodash';
import enLocale from './eleLang/en'
import viLocale from './eleLang/vi'
import en from './lang/en-US'
import vi from './lang/vi-VN'

Vue.use(VueI18n)

const locales = {};

function addLang(key: string, a: object, b: object) {
    _.assignIn(locales, {
    [key]: _.assignIn({}, a, b),
  });
}

addLang('en-US', en, enLocale);
addLang('vi-VN', vi, viLocale);

// const browserLanguage: string = window.navigator.language;
const browserLanguage: string = localStorage.getItem("LANG") || window.navigator.language;

const lang = browserLanguage in locales ? browserLanguage : 'en-US';

const i18n = new VueI18n({
  locale: lang,
  messages: locales,
})

export default i18n
