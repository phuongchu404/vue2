import { createI18n, type Composer } from 'vue-i18n'
import * as _ from 'lodash'
import enLocale from './eleLang/en'
import viLocale from './eleLang/vi'
import en from './lang/en-US'
import vi from './lang/vi-VN'

const locales: { [key: string]: any } = {}

function addLang(key: string, a: object, b: object) {
  _.assignIn(locales, {
    [key]: _.assignIn({}, a, b),
  })
}

addLang('en-US', en, enLocale)
addLang('vi-VN', vi, viLocale)

const browserLanguage: string = localStorage.getItem("LANG") || window.navigator.language
const lang = browserLanguage in locales ? browserLanguage : 'en-US'

export const i18n = createI18n({
  legacy: false, // Enable Composition API mode
  locale: lang,
  fallbackLocale: 'en-US',
  messages: locales,
})

const composer = i18n.global as unknown as Composer
export const t = composer.t.bind(composer)


export default i18n