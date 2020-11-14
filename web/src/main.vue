<template>
  <div id="app">
    <div v-if="requireAuth" class="admin_page">
      <a-layout>
        <a-layout-header>
          <!-- header -->
          <div class="header clearfix">
            <div class="left app-left">
              <div class="logo left">
                <img src="./assets/logo2.png" alt="">
              </div>
              <h1 class="right">{{ appName }}</h1>
            </div>
            <div class="right app-right">
              <span>{{ userInfo.userName }} ( {{userInfo.roleList[0].roleName}} )</span>
              <a-button type="primary" class="login-out" @click="loginOut">退出</a-button>
            </div>
          </div>
        </a-layout-header>
        <a-layout>
          <a-layout-sider>
            <a-menu
              style="width:200px"
              :default-selected-keys="['1']"
              :default-open-keys="['sub1']"
              mode="inline"
              theme="dark"
              :inline-collapsed="collapsed"
            >
            <template v-for="(item) in memuLists">
              <a-sub-menu v-if="item.children" v-bind:key="item.menuId">
                <span slot="title"><a-icon type="tags" /><span>{{ item.menuName }}</span></span>
                <a-menu-item v-for="(child) in item.children" :key="child.menuId" @click="clickMenu(child)">
                  {{ child.menuName }}
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item v-else v-bind:key="item.menuId" @click="clickMenu(item)">
                <a-icon type="tags" />
                {{ item.menuName }}
              </a-menu-item>
            </template>

            </a-menu>
          </a-layout-sider>
          <a-layout-content>
            <router-view  class="main-content" style="padding:15px;"></router-view>
            <a-layout-footer>©版权所有</a-layout-footer>
          </a-layout-content>
        </a-layout>
      </a-layout>
      <!-- 退出登录弹窗 -->
      <a-modal v-model="visible" title="提示" on-ok="handleOk">
        <template slot="footer">
          <a-button key="back" @click="loginOutCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary" @click="loginOutOk">
            确认
          </a-button>
        </template>
        <p>确认退出当前登录？</p>
      </a-modal>
    </div>
    <div v-else class="web_page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator'
import { GlobalRouter } from '@/public/javascript/Interfaces'
import { APPNAME } from '@/public/javascript/config'
import http from '@/public/javascript/http'

interface MenuType {
  menuId: string;
  menuName: string;
  parentId: string;
  itemUrl: string;
  itemId: string;
  children: Array<MenuType>;
}

// 引入组件
@Component({
  components:{

  }
})

export default class Main extends Vue {
  // data
  @Provide() msg = 'Welcome'
  appName = APPNAME
  visible = false
  collapsed =  false
  memuLists = []
  
  // computed
  get globalRouter () {
    return this.$store.state.globalRouter
  }
  get requireAuth () {
    return this.$route.meta.requireAuth
  }
  get token () {
    return this.$store.state.token
  }
  get userInfo () {
    return this.$store.state.userInfo
  }
  // methods
  // 菜单统一点击事件
  clickMenu (item: MenuType): void {
    this.$router.push({
      name: item.itemUrl,
      params: {},
      query: {}    
    }).catch(err=>err)
  }
  // 退出登录
  loginOut (): void {
    this.visible = true
  } 
  // 取消退出登录
  loginOutCancel (): void {
    this.visible = false
  }
  // 确认退出登录
  loginOutOk(): void{
    //清除cookies
    this.$cookies.remove('token')   
    this.$cookies.remove('userInfo')
    this.$store.commit('setToken','')
    this.$store.commit('setUserInfo',{ id:'',userName:'',phone:'', email:''})
    this.visible = false
    // 跳转至登录页
    this.$router.push({
      name: '/admin/login',
      params: {},
      query: {}    
    }).catch(err=>err)
  }
  // 后台菜单查询
  adminInit (): void {
    // 查询菜单
    const getMenuParams = {
      phone: this.$store.state.userInfo.phone,
    }
    http.post('/api/user/getMenu',getMenuParams).then(res=>{
      if(res.data.code && res.data.code === '0'){
        this.memuLists = res.data.data
      }else{
        this.$message.error(res.data.msg);
      }
    }).catch(e=>{
      console.log(e)
    })
  }
  
  // watch
  @Watch('globalRouter')
  onGlobalRouterChanged (newVal: GlobalRouter, oldVal: GlobalRouter) {
    console.log('GlobalRouterChange')
    if(newVal != oldVal){
      if(newVal.go){
        this.$router.go(parseInt(newVal.go))
      }else if(newVal.url != oldVal.url || newVal.params != oldVal.params){
        if(newVal.replace == true){
          this.$router.replace({
            name: newVal.url,
            params:{...newVal.params}
          })
        }else{
          this.$router.push({
            name: newVal.url,
            params:{...newVal.params}
          })
        }
      }
    }
  }
  @Watch('requireAuth')
  onRequireAuthChanged (newVal: boolean, oldVal: boolean) {
    if(newVal !== oldVal && newVal){
      this.adminInit()
    }
  }

  // 生命周期
  created () {
    //取cookie数据赋值给store.state,防止页面属性登录数据丢失
    const token = this.$cookies.get('token')
    if(token){
      this.$store.commit('setToken',token)
    }
    const userInfo = this.$cookies.get('userInfo')
    if(userInfo){
      this.$store.commit('setUserInfo',userInfo)
    }
  }

}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  .sub_title{
    padding: 0 0 10px 0;
  }
 
  .left{
    float: left;
  }
  .right{
    float: right;
  }
  .ant-layout-header{
    line-height: 1;
    padding: 0;
  }
  .header{
    background-color: #03b871;
    padding:0 15px;
    height: 64px;
    color: #ffffff;
    .app-left{
      padding: 8px 0;
      h1{
        font-size: 18px;
        padding: 16px 0;
        color: #ffffff;
      }
      .logo{
        width: 50px;
        img{
          width: 100%;
        }
      }
    }
    .app-right{
      padding: 15px 0;
      .login-out{
        margin-left: 10px;
        padding: 5px 10px;
      }

    }
    
  }
  .main-content{
    min-height:calc(100vh - 96px);
    
  }
  .ant-layout-footer{
    height: 32px;
    background-color: #d9d9d9;
    text-align: center;
    line-height: 32px;
    font-size: 12px;
    padding: 0;
  }

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
div.ant-select-dropdown{
  z-index: 99999;
}
.ant-page-header{
  padding: 15px 0;
}
div.ant-form-item{
  margin-bottom: 10px;
}
</style>
