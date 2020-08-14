<template>
  <div class="register-page page">
    <div class="register_box">
      <div class="logo">
        <img src="../assets/logo2.png" alt="">
      </div>
      <Form ref="registerForm" :model="registerInfo" :rules="ruleCustom" :label-width="50">
        <FormItem label="手机" prop="phone">
            <Input v-model="registerInfo.phone" placeholder="请输入手机号"/>
        </FormItem>
        <FormItem label="验证码" prop="code">
            <Input v-model="registerInfo.code" placeholder="请输入验证码">
              <Button :disabled="send.flag" slot="append" @click="sendCode">{{ send.msg }}</Button>
            </Input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="registerInfo.password" placeholder="请输入密码"/>
        </FormItem>
      </Form>
      <div class="btn-box">
        <Button type="primary" @click="registerFun">注册</Button>
      </div>
    </div>
  </div>
</template>

<script>
import {validPhone,validCode, validPass} from '../utils/valid'
import pamds from '../utils/pamds'

export default {
  name:'Register',
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
    // 验证手机验证码
    const validateCode = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请输入验证码'));
      } else {
          if (!validCode(value)){
              callback(new Error('验证码为6位数字'));
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
      registerInfo:{
        phone:'',
        code:'',
        password:''
      },
      ruleCustom: {
        phone: [
            { validator: validatePhone, trigger: 'blur' }
        ],
        code: [
            { validator: validateCode, trigger: 'blur' }
        ],
        password: [
            { validator: validatePassword, trigger: 'blur' }
        ],
      },
      send:{
        flag:false,
        msg:'发送验证码'
      }
    }
  },
  methods: {
    // 发送验证码
    sendCode(){
      // 验证手机号
      this.$refs['registerForm'].validateField('phone',(valid) => {
        if (valid === '') {
          pamds.post('./api/send',{phone:this.registerInfo.phone}).then(res=>{
            if(res.code == '0'){
              this.$Message.success('验证码已发送，请注意查收');
              this.send.msg = 60
              this.send.flag = true
              let countDown = setInterval(()=>{
                if(this.send.msg === 0){
                  clearInterval(countDown)
                  this.send.msg = '发送验证码'
                  this.send.flag = false
                }else{
                  this.send.msg--
                }
              },1000)
            }else{
              this.$Message.error(res.msg);
            }
          })
        }
      })
    }, 
    // 注册  
    registerFun() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          let params = {
            phone:this.registerInfo.phone,
            phoneCode:this.registerInfo.code,
            password:this.registerInfo.password
          }
          pamds.post('./api/register',params).then(res=>{
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
    // 返回登录页
    gotoLogin(){
      this.$router.push({name:'Login'})
    }
  }
}


// export default {
//   name: 'Login',
//   data(){
//     return {
//       phone:'',
//       phoneError:'',
//       password:'',
//       passwordError:'',
//       phoneCode:'',
//       phoneCodeError:'',
//       send:{
//         msg:'发送验证码',
//         flag:false
//       }
//     }
//   },
//   created(){
//       console.log(this.$store)
//   },
//   methods: {
//     sendCode(){
//       // 验证手机号
//       if(validPhone(this.phone)){
//           this.phoneError = ''  
//           pamds.post('./api/send',{phone:this.phone}).then(res=>{
//             if(res.code == '0'){
//               this.$toast('验证码已发送，请注意查收');
//               this.send.msg = 60
//               this.send.flag = true
//               let countDown = setInterval(()=>{
//                 if(this.send.msg === 0){
//                   clearInterval(countDown)
//                   this.send.msg = '发送验证码'
//                   this.send.flag = false
//                 }else{
//                   this.send.msg--
//                 }
//               },1000)
//             }else{
//               this.$toast(res.msg);
//             }
//           })
//       }else{
//         this.phoneError = '手机号格式不正确'
//       }
//     },   
//     registerFun() {
//       // 验证手机号
//       if(!validPhone(this.phone)){
//           this.phoneError = '手机号格式不正确'
//           return
//       }
//       this.phoneError = ''
//       // 验证验证码
//       if(!validCode(this.phoneCode)){
//           this.phoneCodeError = '请输入验证码'
//           return
//       }
//       this.phoneCodeError = ''
//       // 验证密码
//       if(!validPass(this.password)){
//           this.passwordError = '密码为8-16为英文字母或数字'
//           return
//       }
//       this.passwordError = ''
//       // 注册
//       let params = {
//         phone:this.phone,
//         phoneCode:this.phoneCode,
//         password:this.password
//       }
//       pamds.post('./api/register',params).then(res=>{
//         if(res.code === '0'){
//           this.$toast(res.msg);
//           this.$store.commit('SET_TOKEN',res.data.token)
//           this.$store.commit('SET_USER_INFO',res.data.userData)
//           // 以秒为单位，设置1天后失效
//           this.$cookies.set("TOKEN",res.data.token,60 * 60 * 24)
          
//           // 登录成功 跳转至首页
//           this.$router.push({ name: 'Home', params: res.data.userData})
//         }else{
//           this.$toast(res.msg);
//         } 
//       })
//     },
//     gotoLogin(){
//       this.$router.push({name:'Login'})
//     }
//   },
// }
</script>


<style lang="scss">
  .register-page{
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
    .register_box{
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