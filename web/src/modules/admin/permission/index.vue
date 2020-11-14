<template>
  <div id="error-page" class="error">
      <a-row style="text-align:Center;padding:300px 0 0">
        <a-col :span="24" style="padding:20px 0">
            {{ errCode }} : {{ errMsg }}
        </a-col>
        <a-button v-if="errCode == '401'" type="danger" @click="relogin()">重新登陆</a-button>
        <a-button v-else type="danger"  @click="gotoHome()">首页</a-button>
    </a-row>
  </div>
</template>

<script>

export default {
    name: 'ErrorPage',
    data(){
      return {
          errMsg:'',
          errCode:''
      }
    },
    created(){
      const params = this.$route.params
      if(params && params.data){
        this.errCode = params.status
        this.errMsg = params.data.msg
      }else{
        this.errCode = 'error'
        this.errMsg = '页面错误'
      }
    },
    methods: {
        relogin(){
            this.$cookies.remove('token')   
            this.$cookies.remove('userInfo')
            this.$store.commit('setToken','')
            this.$store.commit('setUserInfo',{ id:'',userName:'',phone:'', email:''})
            // 跳转至登录页
            this.$router.push({
                name: '/admin/login',
                params: {},
                query: {}    
            }).catch(err=>err)
        },
        gotoHome(){
          // 跳转至首页
          this.$router.push({
              name: '/admin/home',
              params: {},
              query: {}
          }).catch(err=>err)
        }
    },
}
</script>

<style lang="scss">

</style>