// @ts-ignore
import i18n from '@/components/i18n';

export default {
    tag: "visitor:return-card",
    leaf: true,
    path: "/return-card",
    type: "menu",
    whiteList: false,
    name: i18n.t("menu.returnCard"),
    // icon: "el-icon-postcard",
    options: [
        {
            tag: "visitor:return-card:select",
            type: "button",
            whiteList: false,
            name: i18n.t("option.query"),
            pattern: "/api/admin/visitor-card/getVisitorBorrowCard",
            method: "GET"
        },
        {
            tag: "visitor:return-card:return",
            type: "button",
            whiteList: false,
            name: i18n.t("option.return"),
            pattern: "/api/admin/visitor-card/getVisitorCardByCardId",
            method: "GET"
        },
    ]
}
