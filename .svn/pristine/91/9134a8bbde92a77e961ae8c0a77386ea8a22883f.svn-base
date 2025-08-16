// @ts-ignore
import i18n from '@/components/i18n';

export default {
    tag: "provider",
    leaf: true,
    path: "/provider",
    type: "menu",
    whiteList: false,
    name: i18n.t("menu.provider"),
    icon: "el-icon-fa-users",
    options: [
        {
            tag: "provider:select",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/provider",
            method: "GET"
        },
        {
            tag: "provider:add",
            type: "button",
            whiteList: false,
            name: i18n.t("option.add"),
            pattern: "/api/admin/provider",
            method: "POST"
        },
        {
            tag: "provider:update",
            type: "button",
            whiteList: false,
            name: i18n.t("option.update"),
            pattern: "/api/admin/provider",
            method: "PUT"
        },
        {
            tag: "provider:delete",
            type: "button",
            whiteList: false,
            name: i18n.t("option.delete"),
            pattern: "/api/admin/provider",
            method: "DELETE"
        }
    ]
}
