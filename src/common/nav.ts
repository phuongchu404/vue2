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
// import i18n from "@/components/i18n";
import { t } from "@/components/i18n";
import user from "./menu/user";
import role from "./menu/role";
import detainee from "./menu/detainee";
import staff from "./menu/staff";
import identity from "./menu/identity";
import fingerprint from "./menu/fingerprint";
import prison from "./menu/prison";
import report from "./menu/report";

export const getNavData = () => [
  {
    tag: "index",
    leaf: true,
    path: "/",
    type: "menu",
    whiteList: true,
    name: t("menu.index"),
    icon: "el-icon-fa-home",
    children: [],
    disabled: true,
    options: [
      {
        tag: "session:all",
        type: "button",
        whiteList: true,
        name: t("option.query"),
        pattern: "/api/sessions/**",
        method: null,
        disabled: true,
      },
    ],
  },
  {
    tag: "system",
    leaf: false,
    path: "",
    type: "menu",
    whiteList: false,
    name: t("menu.system"),
    icon: "el-icon-fa-cogs",
    options: [],
    children: [user, role],
  },
  detainee,
  staff,
  identity,
  fingerprint,
  prison,
  report,
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
};

const processPermissions = (permissions: any, list: any[]) => {
  for (let permission of permissions) {
    let backPermission: any = {};
    backPermission.tag = permission.tag;
    backPermission.type = permission.type;
    backPermission.whiteList = permission.whiteList;
    list.push(backPermission);
    if (permission.leaf && permission.options) {
      for (let option of permission.options) {
        let backPermission: any = { ...option };
        list.push(backPermission);
      }
    } else {
      processPermissions(permission.children, list);
    }
  }
};

function getTree(values: any) {
  console.log("vao chua");
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
