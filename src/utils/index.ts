import Axios from 'axios';
import {Message} from 'element-ui';
import {MessageBox} from 'element-ui';
import * as moment from 'moment';
import {Codes} from './Codes';
import i18n from "../components/i18n";


export async function confirm(context: any, message: string, title?: string) {
    try {
        let result = await context.$confirm(message, title, {type: "warning"});
        return true;
    } catch (e) {
        console.log(e);
    }
    return false;
};

export async function validateForm(thisForm: any) {
    let promise = new Promise((resolve, reject) => {
        thisForm.validate((valid: boolean) => {
            resolve(valid);
        });
    });
    return promise;
};

export async function axiosAction(method: string, url: string, data?: any): Promise<any> {
    let promise = new Promise((resolve, reject) => {
        Axios({
            method: method,
            url: url,
            data: data
        }).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })
    });
    return promise;
}

export async function doPost(context: any, url: string, data?: any) {
    try {
        console.log(data)
        let result = await axiosAction('POST', url, data);
        let code = result.code;
        if (code && (code == Codes.INVALID_ACCESS_TOKEN.code || code == Codes.EXPIRED_TOKEN.code)) { // Token无效或者超时
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("user");
            await confirmRelogin(String(i18n.t("common.session-expired-message")));
            context.$router.push({path: "/login"});
            return {success: false, message: ""};
        }
        return result;
    } catch (e) {
        console.log(e);
        var ret = {success: false, message: 'Failed to execute POST.'};
        if (e.status)
            ret.message = ret.message + "HTTP return code：" + e.status;
        return ret;
    }
};

export async function doGet(context: any, url: string) {
    try {
        let result = await axiosAction('GET', url);
        let code = result.code;
        if (localStorage.getItem("TOKEN") === null) {
            context.$router.push({path: "/login"});
            return;
        }
        if (code && (code == Codes.INVALID_ACCESS_TOKEN.code || code == Codes.EXPIRED_TOKEN.code)) { // Token无效或者超时
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("user");
            await confirmRelogin(String(i18n.t("common.session-expired-message")));
            context.$router.push({path: "/login"});
            return {success: false, message: ""};
        }
        return result;
    } catch (e) {
        console.log(e);
        var ret = {success: false, message: 'Failed to execute GET.'};
        if (e.status)
            ret.message = ret.message + "HTT return code：" + e.status;
        return ret;
    }
};

export async function doDelete(context: any, url: string, data?: any) {
    try {
        let result = await axiosAction('DELETE', url, data);
        let code = result.code;
        if (code && (code == Codes.INVALID_ACCESS_TOKEN.code || code == Codes.EXPIRED_TOKEN.code)) { // Token无效或者超时
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("user");
            await confirmRelogin(String(i18n.t("common.session-expired-message")));
            context.$router.push({path: "/login"});
            return {success: false, message: ""};
        }
        return result;
    } catch (e) {
        console.log(e);
        var ret = {success: false, message: 'Failed to execute DELETE'};
        if (e.status)
            ret.message = ret.message + "HTTP return code：" + e.status;
        return ret;
    }
};

export async function doPut(context: any, url: string, data?: any) {
    try {
        let result = await axiosAction('PUT', url, data);
        let code = result.code;
        if (code && (code == Codes.INVALID_ACCESS_TOKEN.code || code == Codes.EXPIRED_TOKEN.code)) { // Token无效或者超时
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("user");
            await confirmRelogin(String(i18n.t("common.session-expired-message")));
            context.$router.push({path: "/login"});
            return {success: false, message: ""};
        }
        return result;
    } catch (e) {
        console.log(e);
        var ret = {success: false, message: 'Failed to execute PUT.'};
        if (e.status)
            ret.message = ret.message + "HTTP return code：" + e.status;
        return ret;
    }
};

export async function doDownload(method: string, url: string, data?: any) {
    let promise = new Promise((resolve, reject) => {
        Axios({
            method: method,
            url: url,
            data: data,
            responseType: 'blob'
        }).then(function (res) {
            console.log("excel download data")
                let blob = new Blob([res.data], {type: res.headers['content-type']});
                let filename = res.headers['content-disposition'].match(/filename=(.*)/)[1];
                let downloadElement = document.createElement('a');
                let href = window.URL.createObjectURL(blob);
                downloadElement.href = href;
                downloadElement.download = filename;
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);
                resolve({success: true});
        }).catch(function (error) {
            console.log(error);
            reject({success: false});
        })
    });
    return promise;
}

export async function showWarning(message: string, title?: string) {
    if (!title) title = 'Warning';
    Message.warning({message: message, title: title});
};

export async function showInfo(message: string, title?: string) {
    if (!title) title = 'Message';
    Message.info({message: message, title: title});
};

export async function showSuccess(message: string, title?: string) {
    if (!title) title = 'Message';
    Message.success({message: message, title: title});
};

export async function messageInfo(message: string, title?: string) {
    if (!title) title = 'Message';
    MessageBox.alert(message, title, {
        confirmButtonText: 'Confirm',
        callback: (action: any) => {
            console.log(action);
        }
    });
};

export async function confirmRelogin(message: string, title?: string) {
    if (!title) title = "Error";
    let promise = new Promise((resolve, reject) => {
        MessageBox.alert(message, title, {
            type: "error",
            confirmButtonText: 'Re-login',
            callback: (action: any) => {
                console.log(action);
                resolve("confirmed");
            }
        })
    });
    return promise;
};

export function formatDateTimeString(source: Date, formatStr: string) {
    if (!formatStr) return '';
    if (source)
        return moment(source).format(formatStr);
    else
        return '';
};

export function formatDateString(source: Date) {
    var format = 'DD-MM-YYYY HH:mm:ss';

    if (source)
        return moment(source).format(format);
    else
        return '';
};


export function formatDateString1(source: Date) {
    var format = 'DD-MM-YYYY';

    if (source)
        return moment(source).format(format);
    else
        return '';
};

export function formatTimeString(source: Date) {
    var format = 'HH:mm:ss';
    if (source)
        return moment(source).format(format);
    else
        return '';
};

export function blobToString(blob: any) {
    return new Promise((resolve, reject) => {
        try {
            let reader: any = new FileReader();
            reader.onload = function() {
                resolve(reader.result);
            };
            reader.onerror = function() {
                resolve(false);
            };
            reader.readAsText(blob);
        } catch (e) {
            resolve(false);
        }
    });
}

export function formatDateOnlyString(source: Date) {
    var format = 'DD/MM/YYYY';
    if (source)
        return moment(source, 'DD/MM/YYYY').format(format);
    else
        return '';
};

export function stringToDate(source: string) {
    var format = 'DD/MM/YYYY';
    if (source)
        return moment(source, format).format(format);
    else
        return '';
};


export function formatUnixTimestamp(source: string) {
    var format = 'YYYY-MM-DD HH:mm:ss';
    if (source)
        return moment(Number(source)).format(format);
    else
        return '';
}

export function clearValidateForm(formObj: any) {
    if (formObj) {
        formObj.clearValidate();
    }
}

export function getLocal() {
    return localStorage.getItem("LANG") || window.navigator.language;
}

export function queryFormWrapper(queryForm: any) {
    let param = "";
    for (let key in queryForm) {
        if (queryForm[key] || queryForm[key] === 0) {
            param = `${param}&${key}=${queryForm[key]}`
        }
    }
    return param;
}

export function urlEncode(param: any) {
    if (param == null) return '';
    let paramStr = '';
    for (const key in param) {
        if (param.hasOwnProperty(key)) {
            const element = param[key];
            paramStr += key + '=' + element + '&';
        }
    }
    return paramStr;
}

export function getUser() {
    let userString = sessionStorage.getItem('user');
    if (userString) {
        let user = JSON.parse(userString);
        return user.userName;
    }
}

export async function doUpload(context: any, url: any, data: any, updateProgress: any, cancel: any) {
    try {
        let result = await performUpload(context, url, data, updateProgress, cancel);
        let code = result.code;
        if (code && (code == Codes.INVALID_ACCESS_TOKEN.code || code == Codes.EXPIRED_TOKEN.code)) {
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("user");
            await confirmRelogin(String(i18n.t("common.session-expired-message")));
            context.$router.push({path: "/login"});
            return {success: false, message: ""};
        }
        return result;
    } catch (e) {
        console.log(e);
        var ret = {success: false, message: 'Failed to execute POST.'};
        if (e.status)
            ret.message = ret.message + "HTTP return code：" + e.status;
        return ret;
    }


}

async function performUpload(context: any, url: any, data: any, updateProgress: any, cancel: any): Promise<any> {
    let promise = new Promise((resolve, reject) => {
        Axios({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress : (progressEvent: any) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                console.log("onUploadProgress", totalLength);
                if (totalLength !== null) {
                    let percentage = Math.round((progressEvent.loaded * 100) / totalLength);
                    updateProgress(percentage);
                }
            },
            cancelToken: cancel
        }).then((res: any) => {
            resolve(res.data);

        }).catch((error: any) => {
            console.log(error);
            reject({success: false});
        })
    });
    return promise;
};
