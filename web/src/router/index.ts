import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 后台路由
import adminRouters from './admin'
// 前台路由
import webRouters from './web'

const routes = [
  ...webRouters, ...adminRouters
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router 
