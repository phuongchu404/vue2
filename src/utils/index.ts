import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import { t } from "@/i18n";
import { Codes } from "./Codes";
import router from "@/router";

export async function confirm(
  message: string,
  title?: string
): Promise<boolean> {
  try {
    await ElMessageBox.confirm(message, title, { type: "warning" });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function validateForm(formRef: any): Promise<boolean> {
  if (!formRef) return false;
  try {
    await formRef.validate();
    return true;
  } catch {
    return false;
  }
}

export async function axiosAction(
  method: string,
  url: string,
  data?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
    })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function confirmRelogin(
  message: string,
  title?: string
): Promise<string> {
  const finalTitle = title || "Error";
  return new Promise((resolve) => {
    ElMessageBox.alert(message, finalTitle, {
      type: "error",
      confirmButtonText: "Re-login",
      callback: (action: any) => {
        console.log(action);
        resolve("confirmed");
      },
    });
  });
}
export async function handleSessionExpiration(code: any): Promise<boolean> {
  if (
    code &&
    (code === Codes.INVALID_ACCESS_TOKEN.code ||
      code === Codes.EXPIRED_TOKEN.code)
  ) {
    sessionStorage.removeItem("TOKEN");
    sessionStorage.removeItem("user");
    await confirmRelogin(String(t("common.session-expired-message")));
    router.push({ path: "/login" });

    return true;
  }
  return false;
}

export async function doPost(url: string, data?: any): Promise<any> {
  try {
    const result = await axiosAction("POST", url, data);
    if (await handleSessionExpiration(result.code)) {
      // Pass router from context if available
      return { success: false, message: "" };
    }
    return result;
  } catch (e: any) {
    console.log(e);
    const ret = { success: false, message: "Failed to execute POST." };
    if (e.status) {
      ret.message = ret.message + "HTTP return code：" + e.status;
    }
    return ret;
  }
}

export async function doGet(url: string): Promise<any> {
  try {
    if (sessionStorage.getItem("TOKEN") === null) {
      // Handle case where token is missing before the request
      // Consider redirecting to login here if necessary
      return { success: false, message: "No token found" };
    }
    const result = await axiosAction("GET", url);
    if (await handleSessionExpiration(result.code)) {
      // Pass router from context if available
      return { success: false, message: "" };
    }
    return result;
  } catch (e: any) {
    console.log(e);
    const ret = { success: false, message: "Failed to execute GET." };
    if (e.status) {
      ret.message = ret.message + "HTTP return code：" + e.status;
    }
    return ret;
  }
}

export async function doDelete(url: string, data?: any): Promise<any> {
  try {
    const result = await axiosAction("DELETE", url, data);
    if (await handleSessionExpiration(result.code)) {
      // Pass router from context if available
      return { success: false, message: "" };
    }
    return result;
  } catch (e: any) {
    console.log(e);
    const ret = { success: false, message: "Failed to execute DELETE." };
    if (e.status) {
      ret.message = ret.message + "HTTP return code：" + e.status;
    }
    return ret;
  }
}

export async function doPut(url: string, data?: any): Promise<any> {
  try {
    const result = await axiosAction("PUT", url, data);
    if (await handleSessionExpiration(result.code)) {
      // Pass router from context if available
      return { success: false, message: "" };
    }
    return result;
  } catch (e: any) {
    console.log(e);
    const ret = { success: false, message: "Failed to execute PUT." };
    if (e.status) {
      ret.message = ret.message + "HTTP return code：" + e.status;
    }
    return ret;
  }
}

export async function doDownload(
  method: string,
  url: string,
  data?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      responseType: "blob",
    })
      .then(function (res) {
        console.log("excel download data");
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const filename =
          res.headers["content-disposition"]?.match(/filename=(.*)/)?.[1];
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = filename || "download";
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        resolve({ success: true });
      })
      .catch(function (error) {
        console.log(error);
        reject({ success: false });
      });
  });
}

export function showWarning(message: string, title?: string) {
  ElMessage.warning({ message: message, title: title || "Warning" } as any);
}

export function showInfo(message: string, title?: string) {
  ElMessage.info({ message: message, title: title || "Warning" } as any);
}

export function showSuccess(message: string, title?: string) {
  ElMessage.success({ message: message, title: title || "Warning" } as any);
}

export async function messageInfo(message: string, title?: string) {
  return ElMessageBox.alert(message, title || "Message", {
    confirmButtonText: "Confirm",
    callback: (action: any) => {
      console.log(action);
    },
  });
}
export function formatDateTimeString(source: Date, formatStr: string): string {
  if (!formatStr) return "";
  return source ? moment(source).format(formatStr) : "";
}

export function formatDateString(source: Date): string {
  const format = "DD-MM-YYYY HH:mm:ss";
  return source ? moment(source).format(format) : "";
}

export function formatDateString1(source: Date): string {
  const format = "DD-MM-YYYY";
  return source ? moment(source).format(format) : "";
}

export function formatTimeString(source: Date): string {
  const format = "HH:mm:ss";
  return source ? moment(source).format(format) : "";
}

export function blobToString(blob: any): Promise<string | boolean> {
  return new Promise((resolve) => {
    try {
      const reader: any = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        resolve(false);
      };
      reader.readAsText(blob);
    } catch (e) {
      resolve(false);
    }
  });
}

export function formatDateOnlyString(source: Date): string {
  const format = "DD/MM/YYYY";
  return source ? moment(source, "DD/MM/YYYY").format(format) : "";
}

export function stringToDate(source: string): string {
  const format = "DD/MM/YYYY";
  return source ? moment(source, format).format(format) : "";
}

export function formatUnixTimestamp(source: string): string {
  const format = "YYYY-MM-DD HH:mm:ss";
  return source ? moment(Number(source)).format(format) : "";
}

export function clearValidateForm(formObj: any) {
  if (formObj) {
    formObj.clearValidate();
  }
}

export function getLocal(): string {
  return localStorage.getItem("LANG") || window.navigator.language;
}
export function queryFormWrapper(queryForm: any): string {
  let param = "";
  for (const key in queryForm) {
    if (queryForm[key] || queryForm[key] === 0) {
      param = `${param}&${key}=${queryForm[key]}`;
    }
  }
  return param;
}
// export function queryFormWrapper(queryForm: any): string {
//   let param = "";
//   for (const key in queryForm) {
//     if (queryForm[key] !== undefined && queryForm[key] !== null) {
//       param += `&${key}=${encodeURIComponent(queryForm[key])}`;
//     }
//   }
//   return param.substring(1);
// }
export function urlEncode(param: any): string {
  if (param == null) return "";
  let paramStr = "";
  for (const key in param) {
    if (Object.prototype.hasOwnProperty.call(param, key)) {
      const element = param[key];
      paramStr += key + "=" + element + "&";
    }
  }
  return paramStr;
}
export function getUser(): string | undefined {
  const userString = sessionStorage.getItem("user");
  if (userString) {
    const user = JSON.parse(userString);
    return user.userName;
  }
  return undefined;
}
export async function performUpload(
  url: any,
  data: any,
  updateProgress: any,
  cancel: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: url,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: any) => {
        const totalLength = progressEvent.lengthComputable
          ? progressEvent.total
          : progressEvent.target?.getResponseHeader("content-length") ||
            progressEvent.target?.getResponseHeader(
              "x-decompressed-content-length"
            );
        console.log("onUploadProgress", totalLength);
        if (totalLength !== null) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / totalLength
          );
          updateProgress(percentage);
        }
      },
      cancelToken: cancel,
    })
      .then((res: any) => {
        resolve(res.data);
      })
      .catch((error: any) => {
        console.log(error);
        reject({ success: false });
      });
  });
}
export async function doUpload(
  url: any,
  data: any,
  updateProgress: any,
  cancel: any
): Promise<any> {
  try {
    const result = await performUpload(url, data, updateProgress, cancel);
    if (await handleSessionExpiration(result.code, null)) {
      // Pass router from context if available
      return { success: false, message: "" };
    }
    return result;
  } catch (e: any) {
    console.log(e);
    const ret = { success: false, message: "Failed to execute POST." };
    if (e.status) {
      ret.message = ret.message + "HTTP return code：" + e.status;
    }
    return ret;
  }
}
