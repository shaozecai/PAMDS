
import { RouteConfig } from 'vue-router'

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: '/',
        component: () => import(/* webpackChunkName: "webHome" */ '@/modules/web/home/index.vue'),
        meta:{
            title:'首页',
            requireAuth:false
        }
    },
    {
        path: '/home',
        name: '/home',
        component: () => import(/* webpackChunkName: "webHome" */ '@/modules/web/home/index.vue'),
        meta:{
            title:'首页',
            requireAuth:false
        }
    }
]

export default routes 
