import { RouteConfig } from 'vue-router'

// 系统管理
import systemRouters from './admin/sytem'

let routes: Array<RouteConfig> = [
  {
    path: '/admin',
    name: '/admin',
    component: () => import(/* webpackChunkName: "adminHome" */ '@/modules/admin/home/index.vue'),
    meta:{
      title:'首页',
      requireAuth:true
    }
  },
  {
    path: '/admin/home',
    name: '/admin/home',
    component: () => import(/* webpackChunkName: "adminHome" */ '@/modules/admin/home/index.vue'),
    meta:{
      title:'首页',
      requireAuth:true
    }
  },
  {
    path: '/admin/login',
    name: '/admin/login',
    component: () => import(/* webpackChunkName: "adminLogin" */ '@/modules/admin/login/index.vue'),
    meta:{
      title:'登录页',
      requireAuth:false
    }
  },
  {
    path: '/admin/userCenter',
    name: '/admin/userCenter',
    component: () => import(/* webpackChunkName: "adminUserCenter" */ '@/modules/admin/userCenter/index.vue'),
    meta:{
      title:'个人中心',
      requireAuth: true
    }
  },
  {
    path: '/admin/permission',
    name: '/admin/permission',
    component: () => import(/* webpackChunkName: "adminPermission" */ '@/modules/admin/permission/index.vue'),
    meta:{
      title:'系统错误',
      requireAuth: true
    }
  },
  // 新闻管理
  {
    path: '/admin/news/add',
    name: '/admin/news/add',
    component: () => import(/* webpackChunkName: "adminNewsAdd" */ '@/modules/admin/news/add/index.vue'),
    meta:{
      title:'新闻新增',
      requireAuth: true
    }
  },
  {
    path: '/admin/news/update',
    name: '/admin/news/update',
    component: () => import(/* webpackChunkName: "adminNewsAdd" */ '@/modules/admin/news/update/index.vue'),
    meta:{
      title:'新闻修改',
      requireAuth: true
    }
  },
  {
    path: '/admin/news/list',
    name: '/admin/news/list',
    component: () => import(/* webpackChunkName: "adminNewsList" */ '@/modules/admin/news/list/index.vue'),
    meta:{
      title:'新闻列表',
      requireAuth: true
    }
  },
  {
    path: '/admin/news/search',
    name: '/admin/news/search',
    component: () => import(/* webpackChunkName: "adminNewsSearch" */ '@/modules/admin/news/search/index.vue'),
    meta:{
      title:'新闻查询',
      requireAuth: true
    }
  },
  // 文章管理
  {
    path: '/admin/article/add',
    name: '/admin/article/add',
    component: () => import(/* webpackChunkName: "adminArticleAdd" */ '@/modules/admin/article/add/index.vue'),
    meta:{
      title:'文章新增',
      requireAuth: true
    }
  },
  {
    path: '/admin/article/list',
    name: '/admin/article/list',
    component: () => import(/* webpackChunkName: "adminArticleList" */ '@/modules/admin/article/list/index.vue'),
    meta:{
      title:'文章列表',
      requireAuth: true
    }
  },
  {
    path: '/admin/article/search',
    name: '/admin/article/search',
    component: () => import(/* webpackChunkName: "adminArticleSearch" */ '@/modules/admin/article/search/index.vue'),
    meta:{
      title:'文章查询',
      requireAuth: true
    }
  },
  // 系统管理
  {
    path: '/admin/system/user',
    name: '/admin/system/user',
    component: () => import(/* webpackChunkName: "adminSystemUser" */ '@/modules/admin/system/user/index.vue'),
    meta:{
      title:'用户管理',
      requireAuth: true
    }
  },
  {
    path: '/admin/system/journal',
    name: '/admin/system/journal',
    component: () => import(/* webpackChunkName: "adminSystemJournal" */ '@/modules/admin/system/journal/index.vue'),
    meta:{
      title:'日志管理',
      requireAuth: true
    }
  },
  {
    path: '/admin/system/parameter',
    name: '/admin/system/parameter',
    component: () => import(/* webpackChunkName: "adminSystemParameter" */ '@/modules/admin/system/parameter/index.vue'),
    meta:{
      title:'参数管理',
      requireAuth: true
    }
  },
  // 公告管理
  {
    path: '/admin/notice',
    name: '/admin/notice',
    component: () => import(/* webpackChunkName: "adminNotice" */ '@/modules/admin/notice/index.vue'),
    meta:{
      title:'公告管理',
      requireAuth: true
    }
  },
  {
    path: '/admin/notice/add',
    name: '/admin/notice/add',
    component: () => import(/* webpackChunkName: "adminNoticeAdd" */ '@/modules/admin/notice/add.vue'),
    meta:{
      title:'公告新增',
      requireAuth: true
    }
  },
  {
    path: '/admin/notice/upd',
    name: '/admin/notice/upd',
    component: () => import(/* webpackChunkName: "adminNoticeUpd" */ '@/modules/admin/notice/upd.vue'),
    meta:{
      title:'公告更新',
      requireAuth: true
    }
  },
  // 设置
  {
    path: '/admin/install',
    name: '/admin/install',
    component: () => import(/* webpackChunkName: "adminInstall" */ '@/modules/admin/install/index.vue'),
    meta:{
      title:'设置',
      requireAuth: true
    }
  },
]

routes = [
  ...routes, ...systemRouters
]


export default routes 
