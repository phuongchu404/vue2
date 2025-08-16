import VueRouter from "vue-router";

import Login from "@/components/system/Login.vue";
import Home from "@/components/system/Home.vue";
import Users from "@/components/admin/Users.vue";
import Roles from "@/components/admin/Roles.vue";
import Permissions from "@/components/admin/Permissions.vue";
import i18n from "../components/i18n";
import DashBoard from "../components/system/DashBoard.vue";
import CitizenCard from "../components/biometrics/CitizenIdCard.vue";
import PassPort from "../components/biometrics/PassPost.vue";
import Provider from "../components/provider/Provider.vue";
import Other from "../components/biometrics/Other.vue";
import Register from "../components/biometrics/index.vue";
import ReturnCard from "../components/return/ReturnCard.vue"
import report from "../components/report/InOut.vue"
import AccessCard from "../components/access-card/AccessCard.vue"
import Visitor from "../components/report/Visitor.vue"
import VisitorInfo from "../components/report/Visitor-Info.vue"
import CheckFace from "../components/check-face/CheckFace.vue"
import NoFace from "../components/biometrics/NoFace.vue"
import RegisterNoFace from "../components/biometrics/RegisterNoFace.vue"
import CheckVisitor from "../components/check-visitor/CheckVisitor.vue"

let routes = [
    {
        path: "/login",
        component: Login
    },
    {
        name: String(i18n.t("menu.index")),
        path: "/",
        component: Home, // Home
        children: [
            {
                name: String(i18n.t("menu.index")),
                path: "/",
                component: DashBoard
            },
            {
                name: String(i18n.t("menu.user")),
                path: "/users",
                component: Users
            },
            {
                name: String(i18n.t("menu.role")),
                path: "/roles",
                component: Roles
            },
            {
                name: String(i18n.t("menu.menu")),
                path: "/permissions",
                component: Permissions
            },
            {
                name: String(i18n.t("menu.provider")),
                path: "/provider",
                component: Provider
            },
            {
                name: String(i18n.t("menu.citizenCard")),
                path: "/citizen-card",
                component: CitizenCard
            },
            {
                name: String(i18n.t("menu.passPort")),
                path: "/pass-post",
                component: PassPort
            },
            {
                name: String(i18n.t('Giấy Tờ Khác')),
                path: "/other-card",
                component: Other
            },
            {
                name: String(i18n.t('')),
                path: "/register-no-face",
                component: RegisterNoFace
            },
            {
                name: String(i18n.t('Khách đã đăng ký')),
                path: "/not-face",
                component: NoFace
            },
            {
                name: String(i18n.t("menu.register")),
                path: "/register",
                component: Register
            },
            {
                name: String(i18n.t("menu.returnCard")),
                path: `/return-card`,
                component: ReturnCard
            },
            {
                name: String(i18n.t("menu.inout")),
                path: `/report-in-out`,
                component: report
            },
            {
                name: String(i18n.t("menu.card")),
                path: `/access-card`,
                component: AccessCard
            },
            {
                name: String(i18n.t("menu.visitor")),
                path: `/report-visitor`,
                component: VisitorInfo
            },
            {
                name: String(i18n.t("menu.check-visitor")),
                path: `/check-visitor`,
                component: CheckVisitor
            },
        ]
    }
];
export default new VueRouter({
    routes: routes
});
