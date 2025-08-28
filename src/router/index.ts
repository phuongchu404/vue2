import { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/system/Login.vue";
import Home from "@/components/system/Home.vue";
import Users from "@/components/admin/Users.vue";
import Roles from "@/components/admin/Roles.vue";
import Permissions from "@/components/admin/Permissions.vue";
import DashBoard from "../components/system/DashBoard.vue";

import PrisonList from "@/components/prisons/PrisonList.vue";
import PrisonForm from "@/components/prisons/PrisonForm.vue";
import DetaineeList from "@/components/detainees/DetaineeList.vue";
import DetaineeForm from "@/components/detainees/DetaineeForm.vue";
import StaffList from "@/components/staff/StaffList.vue";
import StaffForm from "@/components/staff/StaffForm.vue";
import IdentityList from "@/components/identity/IdentityList.vue";
import IdentityForm from "@/components/identity/IdentityForm.vue";
import Fingerprint from "@/components/fingerprint/Fingerprint.vue";
// import FingerprintForm from '@/components/fingerprint/FingerprintForm.vue'
import Reports from "@/components/report/ReportsStatistics.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: Login,
  },
  {
    name: "Home",
    path: "/",
    component: Home,
    children: [
      {
        name: "Dashboard",
        path: "/",
        component: DashBoard,
      },
      {
        name: "Users",
        path: "/users",
        component: Users,
      },
      {
        name: "Roles",
        path: "/roles",
        component: Roles,
      },
      {
        name: "Permissions",
        path: "/permissions",
        component: Permissions,
      },
      {
        path: "/prisons",
        name: "PrisonList",
        component: PrisonList,
      },
      {
        path: "/prisons/add",
        name: "PrisonAdd",
        component: PrisonForm,
      },
      {
        path: "/prisons/edit/:id",
        name: "PrisonEdit",
        component: PrisonForm,
      },
      {
        path: "/detainees",
        name: "DetaineeList",
        component: DetaineeList,
      },
      {
        path: "/detainees/add",
        name: "DetaineeAdd",
        component: DetaineeForm,
      },
      {
        path: "/detainees/edit/:id",
        name: "DetaineeEdit",
        component: DetaineeForm,
      },
      {
        path: "/staff",
        name: "StaffList",
        component: StaffList,
      },
      {
        path: "/staff/add",
        name: "StaffAdd",
        component: StaffForm,
      },
      {
        path: "/staff/edit/:id",
        name: "StaffEdit",
        component: StaffForm,
      },
      {
        path: "/identity",
        name: "IdentityList",
        component: IdentityList,
      },
      {
        path: "/identity/add",
        name: "IdentityAdd",
        component: IdentityForm,
      },
      {
        path: "/identity/edit/:id",
        name: "IdentityEdit",
        component: IdentityForm,
      },
      {
        path: "/fingerprint",
        name: "Fingerprint",
        component: Fingerprint,
      },
      // {
      //   path: "/fingerprint/add",
      //   name: "FingerprintAdd",
      //   component: FingerprintForm,
      // },
      // {
      //   path: "/fingerprint/edit/:id",
      //   name: "FingerprintEdit",
      //   component: FingerprintForm,
      // },
      {
        path: "/report",
        name: "Reports",
        component: Reports,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
