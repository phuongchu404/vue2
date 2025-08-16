// @ts-ignore
import i18n from '@/components/i18n';

export default {
    tag: "visitor:check",
    leaf: true,
    path: "/register-visitor",
    type: "menu",
    whiteList: false,
    name: i18n.t("menu.register"),
    options: [
        {
            tag: "visitor:register:insert",
            type: "button",
            whiteList: false,
            name: i18n.t("option.addVisitor"),
            pattern: "/api/admin/visitor",
            method: "POST"
        },
        {
            tag: "visitor:register:visitor:card",
            type: "button",
            whiteList: false,
            name: i18n.t("option.checkIn"),
            pattern: "/api/admin/visitor-card",
            method: "POST"
        },
    ]
}
