<template>
  <div class="memu-box">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <MenuItem name="0" style="color:#ffffff">
        <img class="logo" src="../assets/logo2.png" alt="">
         项目自动管理部署系统
      </MenuItem>
      <MenuItem name="0" style="color:#ffffff;float:right">
        <Icon type="md-person" />
        <span class="user_name">{{ userInfo.username ?  userInfo.username : userInfo.phone }}</span>
        <Button type="info" class="login_out" @click="loginOut">退出</Button>
      </MenuItem>
      
    </Menu>
    <Modal
      v-model="loginOutModal"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      确认退出登录？
  </Modal>
  </div>
</template>

<script>
// import pamds from '../utils/pamds'
export default {
  name: 'Memu',
  data(){
    return {
      userInfo:{},
      loginOutModal:false
    }
  },
  created(){
    this.userInfo = this.$store.state.USERINFO
  },
  methods:{
    // 退出登录
    loginOut(){
      this.loginOutModal = true      
    },
    ok(){
      this.$cookies.set('TOKEN','')
      this.$cookies.set('USERINFO','')
      this.$store.commit('SET_TOKEN','')
      this.$store.commit('SET_USER_INFO','')
      this.$router.push({name:'Login'})
    },
    cancel(){
      this.loginOutModal = false   
    }
    
  }
}
</script>


<style lang="scss">
.memu-box{
  .ivu-menu-dark{
    background: #31343c;
  }
  .logo{
    width:50px;
    float: left;
    margin: 5px 0;
  }
  .van-list .van-cell{
    background-color: #1cc194;
    color: #ffffff;
  }
  .ivu-menu-horizontal{
    line-height: 60px;
    height: 60px;
  }
  .ivu-menu-item,.ivu-menu{
    font-size: 18px;
    font-weight: bold;
  }
  .user_name{
    font-weight: normal;
    font-size: 14px;
  }
  .login_out{
    margin-left: 10px;
    font-size: 14px;
  }
}

</style>
