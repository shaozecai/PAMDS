import Vue from 'vue';
import Router from 'vue-router';
import Home from '../view/Home.vue';
import Login from '../view/Login.vue';
import Register from '../view/Register.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        title:'项目自动管理部署系统-首页',
        requireLogin:true
      },
      component: Home,
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        title:'项目自动管理部署系统-登陆页',
        requireLogin:false
      },
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      meta: {
        title:'项目自动管理部署系统-注册页',
        requireLogin:false
      },
      component: Register,
    },
    
  ],
});
