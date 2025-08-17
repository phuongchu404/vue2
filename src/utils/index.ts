import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as moment from 'moment'
import { Codes } from './Codes'
import { i18n } from "../components/i18n"

export async function confirm(context: any, message: string, title?: string) {
  try {
    await ElMessageBox.confirm(message, title, { type: "warning" })
    return true
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function validateForm(formRef: any) {
  if (!formRef) return false
  try {
    await formRef.validate()
    return true
  } catch {
    return false
  }
}

export async function axiosAction(method: string, url: string, data?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data
    }).then(function (response) {
      resolve(response.data)
    }).catch(function (error) {
      console.log(error)
      reject(error)
    })
  })
}

export async function doPost(context: any, url: string, data?: any) {
  try {
    console.log(data)
    const result = await axiosAction('POST', url, data)
    const code = result.code
    if (code && (code === Codes.INVALID_ACCESS_TOKEN.code || code === Codes.EXPIRED_TOKEN.code)) {
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      await confirmRelogin(String(i18n.global.t("common.session-expired-message")))
      if (context.$router) {
        context.$router.push({ path: "/login" })
      }
      return { success: false, message: "" }
    }
    return result
  } catch (e) {
    console.log(e)
    const ret = { success: false, message: 'Failed to execute POST.' }
    if ((e as any).status) {
      ret.message = ret.message + "HTTP return code：" + (e as any).status
    }
    return ret
  }
}

export async function doGet(context: any, url: string) {
  try {
    const result = await axiosAction('GET', url)
    const code = result.code
    if (localStorage.getItem("TOKEN") === null) {
      if (context.$router) {
        context.$router.push({ path: "/login" })
      }
      return
    }
    if (code && (code === Codes.INVALID_ACCESS_TOKEN.code || code === Codes.EXPIRED_TOKEN.code)) {
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      await confirmRelogin(String(i18n.global.t("common.session-expired-message")))
      if (context.$router) {
        context.$router.push({ path: "/login" })
      }
      return { success: false, message: "" }
    }
    return result
  } catch (e) {
    console.log(e)
    const ret = { success: false, message: 'Failed to execute GET.' }
    if ((e as any).status) {
      ret.message = ret.message + "HTTP return code：" + (e as any).status
    }
    return ret
  }
}

export async function doDelete(context: any, url: string, data?: any) {
  try {
    const result = await axiosAction('DELETE', url, data)
    const code = result.code
    if (code && (code === Codes.INVALID_ACCESS_TOKEN.code || code === Codes.EXPIRED_TOKEN.code)) {
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      await confirmRelogin(String(i18n.global.t("common.session-expired-message")))
      if (context.$router) {
        context.$router.push({ path: "/login" })
      }
      return { success: false, message: "" }
    }
    return result
  } catch (e) {
    console.log(e)
    const ret = { success: false, message: 'Failed to execute DELETE' }
    if ((e as any).status) {
      ret.message = ret.message + "HTTP return code：" + (e as any).status
    }
    return ret
  }
}

export async function doPut(context: any, url: string, data?: any) {
  try {
    const result = await axiosAction('PUT', url, data)
    const code = result.code
    if (code && (code === Codes.INVALID_ACCESS_TOKEN.code || code === Codes.EXPIRED_TOKEN.code)) {
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      await confirmRelogin(String(i18n.global.t("common.session-expired-message")))
      if (context.$router) {
        context.$router.push({ path: "/login" })
      }
      return { success: false, message: "" }
    }
    return result
  } catch (e) {
    console.log(e)
    const ret = { success: false, message: 'Failed to execute PUT.' }
    if ((e as any).status) {
      ret.message = ret.message + "HTTP return code：" + (e as any).status
    }
    return ret
  }
}

export async function doDownload(method: string, url: string, data?: any) {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      responseType: 'blob'
    }).then(function (res) {
      console.log("excel download data")
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const filename = res.headers['content-disposition'].match(/filename=(.*)/)?.[1]
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = filename || 'download'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
      resolve({ success: true })
    }).catch(function (error) {
      console.log(error)
      reject({ success: false })
    })
  })
}

export async function showWarning(message: string, title?: string) {
  if (!title) title = 'Warning'
  ElMessage.warning({ message: message })
}

export async function showInfo(message: string, title?: string) {
  if (!title) title = 'Message'
  ElMessage.info({ message: message })
}

export async function showSuccess(message: string, title?: string) {
  if (!title) title = 'Message'
  ElMessage.success({ message: message })
}

export async function messageInfo(message: string, title?: string) {
  if (!title) title = 'Message'
  return ElMessageBox.alert(message, title, {
    confirmButtonText: 'Confirm',
    callback: (action: any) => {
      console.log(action)
    }
  })
}

export async function confirmRelogin(message: string, title?: string) {
  if (!title) title = "Error"
  return new Promise((resolve) => {
    ElMessageBox.alert(message, title, {
      type: "error",
      confirmButtonText: 'Re-login',
      callback: (action: any) => {
        console.log(action)
        resolve("confirmed")
      }
    })
  })
}

export function formatDateTimeString(source: Date, formatStr: string) {
  if (!formatStr) return ''
  if (source) {
    return moment(source).format(formatStr)
  } else {
    return ''
  }
}

export function formatDateString(source: Date) {
  const format = 'DD-MM-YYYY HH:mm:ss'
  if (source) {
    return moment(source).format(format)
  } else {
    return ''
  }
}

export function formatDateString1(source: Date) {
  const format = 'DD-MM-YYYY'
  if (source) {
    return moment(source).format(format)
  } else {
    return ''
  }
}

export function formatTimeString(source: Date) {
  const format = 'HH:mm:ss'
  if (source) {
    return moment(source).format(format)
  } else {
    return ''
  }
}

export function blobToString(blob: any) {
  return new Promise((resolve) => {
    try {
      const reader: any = new FileReader()
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        resolve(false)
      }
      reader.readAsText(blob)
    } catch (e) {
      resolve(false)
    }
  })
}

export function formatDateOnlyString(source: Date) {
  const format = 'DD/MM/YYYY'
  if (source) {
    return moment(source, 'DD/MM/YYYY').format(format)
  } else {
    return ''
  }
}

export function stringToDate(source: string) {
  const format = 'DD/MM/YYYY'
  if (source) {
    return moment(source, format).format(format)
  } else {
    return ''
  }
}

export function formatUnixTimestamp(source: string) {
  const format = 'YYYY-MM-DD HH:mm:ss'
  if (source) {
    return moment(Number(source)).format(format)
  } else {
    return ''
  }
}

export function clearValidateForm(formObj: any) {
  if (formObj) {
    formObj.clearValidate()
  }
}

export function getLocal() {
  return localStorage.getItem("LANG") || window.navigator.language
}

export function queryFormWrapper(queryForm: any) {
  let param = ""
  for (const key in queryForm) {
    if (queryForm[key] || queryForm[key] === 0) {
      param = `${param}&${key}=${queryForm[key]}`
    }
  }
  return param
}

export function urlEncode(param: any) {
  if (param == null) return ''
  let paramStr = ''
  for (const key in param) {
    if (param.hasOwnProperty(key)) {
      const element = param[key]
      paramStr += key + '=' + element + '&'
    }
  }
  return paramStr
}

export function getUser() {
  const userString = sessionStorage.getItem('user')
  if (userString) {
    const user = JSON.parse(userString)
    return user.userName
  }
}

export async function doUpload(context: any, url: any, data: any, updateProgress: any, cancel: any) {
  try {
    const result = await performUpload(context, url, data, updateProgress, cancel)
    const code = result.code
    if (code && (code === Codes.INVALID_ACCESS_TOKEN.code || code === Codes.EXPIRED_TOKEN.code)) {
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      await confirmRelogin(String(i18n.global.t("common.session-expired-message")))
      if (context.$router) {
        context.$router.push({ path: "/login" })
      }
      return { success: false, message: "" }
    }
    return result
  } catch (e) {
    console.log(e)
    const ret = { success: false, message: 'Failed to execute POST.' }
    if ((e as any).status) {
      ret.message = ret.message + "HTTP return code：" + (e as any).status
    }
    return ret
  }
}

async function performUpload(context: any, url: any, data: any, updateProgress: any, cancel: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: url,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progressEvent: any) => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length')
        console.log("onUploadProgress", totalLength)
        if (totalLength !== null) {
          const percentage = Math.round((progressEvent.loaded * 100) / totalLength)
          updateProgress(percentage)
        }
      },
      cancelToken: cancel
    }).then((res: any) => {
      resolve(res.data)
    }).catch((error: any) => {
      console.log(error)
      reject({ success: false })
    })
  })
}