import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

// 引用组件库
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
// cookie
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// 实现全局路由拦截
router.beforeEach((to, from, next)=>{
  const TOKEN = window.$cookies.get("TOKEN")
  if (to.meta.title){
    document.title = to.meta.title;
  }
  if (to.meta.requireLogin) {     
    if (TOKEN) {
      if (to.path == '/login') {
        next('/');
      } else {
        next();
      }
    } else {
      console.log('当前用户未登录，自动劫持至登录页')
      next('/login');
    }
  }else {
    if (TOKEN) {
      next('/');
    } else {
      next();
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
