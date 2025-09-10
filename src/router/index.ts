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
        meta: { title: "dashboard" },
      },
      {
        name: "Users",
        path: "/users",
        component: Users,
        meta: { title: "users" }
      },
      {
        name: "Roles",
        path: "/roles",
        component: Roles,
        meta: { title: "roles" }
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
        meta: { title: "prisonList" }
      },
      {
        path: "/prisons/add",
        name: "PrisonAdd",
        component: PrisonForm,
        meta: { title: "prisonAdd" }
      },
      {
        path: "/prisons/edit/:id",
        name: "PrisonEdit",
        component: PrisonForm,
        meta: { title: "prisonEdit" }
      },
      {
        path: "/detainees",
        name: "DetaineeList",
        component: DetaineeList,
        meta: { title: "detaineeList" },
      },
      {
        path: "/detainees/add",
        name: "DetaineeAdd",
        component: DetaineeForm,
        meta: { title: "detaineeAdd" }
      },
      {
        path: "/detainees/edit/:id",
        name: "DetaineeEdit",
        component: DetaineeForm,
        meta: { title: "detaineeEdit" }
      },
      {
        path: "/staff",
        name: "StaffList",
        component: StaffList,
        meta: { title: "staffList" }

      },
      {
        path: "/staff/add",
        name: "StaffAdd",
        component: StaffForm,
        meta: { title: "staffAdd" },
      },
      {
        path: "/staff/edit/:id",
        name: "StaffEdit",
        component: StaffForm,
         meta: { title: "staffEdit" },
      },
      {
        path: "/identity",
        name: "IdentityList",
        component: IdentityList,
         meta: { title: "identityList" },
      },
      {
        path: "/identity/add",
        name: "IdentityAdd",
        component: IdentityForm,
         meta: { title: "identityAdd" },
      },
      {
        path: "/identity/edit/:id",
        name: "IdentityEdit",
        component: IdentityForm,
        meta: { title: "identityEdit" },
      },
      {
        path: "/fingerprint",
        name: "Fingerprint",
        component: Fingerprint,
        meta: { title: "fingerprint" },
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
        meta: { title: "reports" },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
