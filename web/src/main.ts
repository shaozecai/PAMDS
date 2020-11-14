import Vue from 'vue'
import Main from './main.vue'
import router from './router'
import store from '@/store'

// 引用组件库 Ant
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd);
// 引入依赖 vue-cookies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
// 引入依赖 echarts
import Echart from 'echarts';
Vue.prototype.$echarts = Echart
// 其他配置
Vue.config.productionTip = false

// 实现全局路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.title){
    document.title = to.meta.title;
  }

  if (to.meta.requireAuth === true){
    // 需登录的路由
    if(Vue.$cookies.get('token') && Vue.$cookies.get('token') !== ''){
      if (to.path === '/admin'  || to.path === '/admin/') {
        next('/admin/home');
      } else {
        next()
      }
    }else{
      next('/admin/login');
    }
  }else{
    // 无需登录的路由
    if(Vue.$cookies.get('token') && Vue.$cookies.get('token') !== ''){
      if (to.path === '/admin/login' || to.path === '/admin/login/') {
        next('/admin/home');
      } else {
        next()
      }
    }else{
      if (to.path === '/admin/login') {
        next();
      } else {
        next('/admin/login');
      }
    }
  }
});


new Vue({
  router,
  store,
  render: h => h(Main)
}).$mount('#app')
