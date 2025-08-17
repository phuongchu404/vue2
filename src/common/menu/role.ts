// @ts-ignore
import i18n from '@/components/i18n';
const { t } = i18n.global;
export default {
  tag: "system:role",
  leaf: true,
  path: "/roles",
  type: "menu",
  whiteList: false,
  name: t("menu.role"),
  // icon: "el-icon-fa-users",
  options: [
    {
      tag: "system:role:select",
      type: "button",
      whiteList: false,
      name: t("option.query"),
      pattern: "/api/admin/roles",
      method: "GET"
    },
    {
      tag: "system:role:insert",
      type: "button",
      whiteList: false,
      name: t("option.add"),
      pattern: "/api/admin/roles",
      method: "POST"
    },
    {
      tag: "system:role:update",
      type: "button",
      whiteList: false,
      name: t("option.update"),
      pattern: "/api/admin/roles/{roleId}",
      method: "PUT"
    },
    {
      tag: "system:role:delete",
      type: "button",
      whiteList: false,
      name: t("option.delete"),
      pattern: "/api/admin/roles/{roleId}",
      method: "DELETE"
    },
    {
      tag: "system:role:assign-permission",
      type: "button",
      whiteList: false,
      name: t("option.assignPermission"),
      pattern: "/api/admin/roleperms/{roleId}",
      method: "PUT"
    },
    {
      tag: "system:role:select-role-permission",
      type: "button",
      whiteList: false,
      name: t("role.selectRolePermission"),
      pattern: "/api/admin/roleperms/{roleId}",
      method: "GET"
    }
    // {
    //   tag: "system:role:sync-permission",
    //   type: "button",
    //   whiteList: false,
    //   name: t("role.syncPermission"),
    //   pattern: "/api/admin/permissions",
    //   method: "POST"
    // }
  ]
}
