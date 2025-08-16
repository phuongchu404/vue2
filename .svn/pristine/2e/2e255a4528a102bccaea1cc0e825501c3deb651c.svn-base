// @ts-ignore
import i18n from '@/components/i18n';

export default {
    tag: "report:in-out",
    leaf: true,
    path: "/report-in-out",
    type: "menu",
    whiteList: false,
    name: i18n.t("menu.inout"),
    options: [
        {
            tag: "report:in-out:select",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/visitor-card",
            method: "GET"
        },
        {
            tag: "report:in-out:export",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/visitor-card/export",
            method: "GET"
        },
    ]
}
