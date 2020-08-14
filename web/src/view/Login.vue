<template>
  <div class="login-page page">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/logo2.png" alt="">
      </div>
      <Form ref="loginForm" :model="loginInfo" :rules="ruleCustom" :label-width="50">
        <FormItem label="手机" prop="phone">
            <Input v-model="loginInfo.phone" placeholder="请输入手机号"/>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="loginInfo.password" placeholder="请输入密码"/>
        </FormItem>
      </Form>
      <div class="btn-box">
        <Button type="primary" @click="loginFun">登录</Button>
        <Button @click="regiserFun">注册</Button>
      </div>
    </div>
  </div>
</template>

<script>
import {validPhone,validPass} from '../utils/valid'
import pamds from '../utils/pamds'
export default {
  name: 'Login',
  data(){
    // 验证手机号
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请输入手机号'));
      } else {
          if (!validPhone(value)){
              callback(new Error('手机号格式不正确'));
          }else{
            callback();
          }
      }
    };
    // 验证密码
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请输入密码'));
      } else {
          if (!validPass(value)){
              callback(new Error('密码格式为8-16位字母或数字'));
          }else{
            callback();
          }
      }
    };
    return {
      loginInfo:{
        phone:'',
        password:'',
      },
      ruleCustom: {
        phone: [
            { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
            { validator: validatePassword, trigger: 'blur' }
        ],
      }
    }
  },
  created(){
      console.log(this.$store)
  },
  methods: {
    // 登录
    loginFun() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          // 请求登录接口
          let params = this.loginInfo
          pamds.post('./api/login',params).then(res=>{
            if(res.code === '0'){
              this.$Message.success(res.msg);
              this.$store.commit('SET_TOKEN',res.data.token)
              this.$store.commit('SET_USER_INFO',res.data.userData)
              // 以秒为单位，设置1天后失效
              this.$cookies.set("TOKEN",res.data.token,60 * 60 * 24)
              this.$cookies.set("USERINFO",JSON.stringify(res.data.userData),60 * 60 * 24)
              // 登录成功 跳转至首页
              this.$router.push({ name: 'Home', params: res.data.userData})
            }else{
              this.$Message.error(res.msg);
            } 
          })
        }
      })
    },
    // 注册
    regiserFun(){
      this.$router.push({name:'Register'})
    }
  },
}
</script>


<style lang="scss">
.login-page{
  background-image:url('../assets/login_bg.jpg');
  background-size: 100% 100%;
  height: 100vh;
  width: 100%;
  position: relative;
  &:after{
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(1px);
    z-index: 2;
  }
  .login_box{
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    width: 300px;
    padding: 15px;
    box-sizing: border-box;
    transform: translate(-50%,-50%);   
    background-color: none; 
  }
  .logo img{
    max-width: 100px;
    display: block;
    margin: 20px auto;
  }
  .ivu-form .ivu-form-item-label{
    color: #ffffff;
    font-size: 12px;
  }
  .btn-box{
    text-align: center;
    .ivu-btn{
      margin: 0 15px;
    }
  }
}
  
</style>
