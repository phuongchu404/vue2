import VueRouter from "vue-router";

import Login from "@/components/system/Login.vue";
import Home from "@/components/system/Home.vue";
import Users from "@/components/admin/Users.vue";
import Roles from "@/components/admin/Roles.vue";
import Permissions from "@/components/admin/Permissions.vue";
import i18n from "../components/i18n";
import DashBoard from "../components/system/DashBoard.vue";

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
        ]
    }
];
export default new VueRouter({
    routes: routes
});
