import { RouteConfig } from 'vue-router'

const routes: Array<RouteConfig> = [
  {
    path: '/admin/system/user',
    name: '/admin/system/user',
    component: () => import(/* webpackChunkName: "adminSystemUser" */ '@/modules/admin/system/user/index.vue'),
    meta:{
      title:'用户管理',
      requireAuth: true
    }
  }
]

export default routes 
