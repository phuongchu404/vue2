import { RouteRecordRaw } from 'vue-router'

import Login from '@/components/system/Login.vue'
import Home from '@/components/system/Home.vue'
import Users from '@/components/admin/Users.vue'
import Roles from '@/components/admin/Roles.vue'
import Permissions from '@/components/admin/Permissions.vue'
import DashBoard from '../components/system/DashBoard.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login
  },
  {
    name: 'Home',
    path: '/',
    component: Home,
    children: [
      {
        name: 'Dashboard',
        path: '/',
        component: DashBoard
      },
      {
        name: 'Users',
        path: '/users',
        component: Users
      },
      {
        name: 'Roles',
        path: '/roles',
        component: Roles
      },
      {
        name: 'Permissions',
        path: '/permissions',
        component: Permissions
      }
    ]
  }
]
export default routes;