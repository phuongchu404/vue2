/**
 *
 *
 * tag: [string]
 * leaf: [boolean]
 * name: [string]
 * icon: [string]
 * path: [string] url
 * type: [stirng]
 * whiteList: [boolean]
 * children: [array]  leaf == false
 * options: [array]
 * ** option
 * ** ** tag: [string]
 * ** ** name: [string]
 * ** ** pattern: [string] url pattern
 * ** ** method: [string]
 * ** ** whiteList: [boolean]
 */
// @ts-ignore
import i18n from "@/components/i18n";
import user from "./menu/user";
import role from "./menu/role";

export const getNavData = () => [
    {
        tag: "index",
        leaf: true,
        path: "/",
        type: "menu",
        whiteList: true,
        name: i18n.t("menu.index"),
        icon: "el-icon-fa-home",
        children: [],
        disabled: true,
        options: [{
            tag: "session:all",
            type: "button",
            whiteList: true,
            name: i18n.t("option.query"),
            pattern: "/api/sessions/**",
            method: null,
            disabled: true,
        }]
    },
    {
        tag: "system",
        leaf: false,
        path: "",
        type: "menu",
        whiteList: false,
        name: i18n.t("menu.system"),
        icon: "el-icon-fa-cogs",
        options: [],
        children: [user, role]
    },

];

export const getPermissionTree = () => {
    let data = getNavData();
    getTree(data);
    return data;
};

export const getPermissions = () => {
    let list: any[] = [];
    processPermissions(getNavData(), list);
    return list;
}

const processPermissions = (permissions: any, list: any[]) => {
    for (let permission of permissions) {
        let backPermission: any = {};
        backPermission.tag = permission.tag;
        backPermission.type = permission.type;
        backPermission.whiteList = permission.whiteList;
        list.push(backPermission);
        if (permission.leaf && permission.options) {
            for (let option of permission.options) {
                let backPermission: any = {...option};
                list.push(backPermission);
            }
        } else {
            processPermissions(permission.children, list);
        }
    }
};

function getTree(values: any) {
    console.log("vao chua")
    for (let value of values) {
        if (value.leaf) {
            value.label = value.name;
            if (value.options) {
                for (let option of value.options) {
                    option.label = option.name;
                }
                value.children = value.options;
            }
        } else {
            getTree(value.children);
        }
    }
}


