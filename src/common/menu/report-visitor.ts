// @ts-ignore
import i18n from '@/components/i18n';

export default {
    tag: "report:visitor",
    leaf: true,
    path: "/report-visitor",
    type: "menu",
    whiteList: false,
    name: i18n.t("menu.visitor"),
    options: [
        {
            tag: "report:visitor:select",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/visitor/get-visitor-info",
            method: "GET"
        },
        {
            tag: "report:visitor:export",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/visitor/export",
            method: "GET"
        },
        {
            tag: "report:visitor",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/find-visitor-info-by-id",
            method: "GET"
        },
        {
            tag: "report:visitor",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/visitor/save-visitor-info",
            method: "POST"
        },
    ]
}
