// @ts-ignore
import i18n from '@/components/i18n';

export default {
    tag: "access-card",
    leaf: true,
    path: "/access-card",
    type: "menu",
    whiteList: false,
    name: i18n.t("menu.card"),
    icon: "el-icon-postcard",
    options: [
        {
            tag: "access-card:select",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/access-card",
            method: "GET"
        },
        {
            tag: "access-card:insert",
            type: "button",
            whiteList: false,
            name: i18n.t("option.add"),
            pattern: "/api/admin/access-card",
            method: "POST"
        },
        {
            tag: "access-card:delete",
            type: "button",
            whiteList: false,
            name: i18n.t("option.delete"),
            pattern: "/api/admin/access-card",
            method: "DELETE"
        },
    ]
}
