<template>
  <div id="login_page" class="login">
    <a-form :form="form" class="login_form" @submit="loginSubmit">
      <a-form-item has-feedback>
        <a-input
          v-decorator="['phone',{
            rules: [{validator: validatePhone}]
          }]"
          placeholder="手机号"
        >
          <a-icon slot="prefix" type="phone" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item has-feedback>
        <a-input
          v-decorator="['password',{
            rules: [{validator: validatePassword}]
          }]"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[ 'remember', { valuePropName: 'checked', initialValue: true, }, ]"
          style="color: rgba(255,255,255,1)"
        > 记住我 </a-checkbox>
        <a class="login-form-forgot" href="javascript:void(0)" @click="showDrawer" style="color: rgba(255,255,255,1)">
          游客点击这里
          <a-icon type="question-circle" />
        </a>
        <a-button type="primary" html-type="submit" class="login-form-button" style="color: rgba(255,255,255,1)">
          登录
        </a-button>
      </a-form-item>
    </a-form>
    <a-drawer
      title="后台管理系统"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <p>游客账号：</p>
      <p>账号：18866666666</p>
      <p>密码：admin12345</p>
    </a-drawer>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import http from '@/public/javascript/http'
import { EXPIREDTIME } from '@/public/javascript/config'
import {validPhone,validPass} from '@/public/javascript/valid'


// 引入组件
@Component({})
export default class AdminLogin extends Vue{
  visible = false
  // data
  form: any
  // method
  showDrawer() {
    this.visible = true;
  }
  onClose() {
    this.visible = false;
  }

  validatePhone(rule: any, value: string, callback: any) {
    if (value == null || value === '') {
      callback('请输入手机号');
    } else {
      if (!validPhone(value)){
        callback('手机号格式不正确');
      }else{
        callback();
      }
    }
  }
  // 校验密码
  validatePassword(rule: any, value: string, callback: any) {
    if (value == null || value === '') {
      callback('请输入密码');
    } else {
      if (!validPass(value)){
        callback(new Error('密码格式为8-16位字母或数字'));
      }else{
        callback();
      }
    }
  }
  /**
     * 登录接口
     * @param payload 
     * @param callback 
    */
    loginSubmit(e: any) {
      e.preventDefault();
      this.form.validateFields((err: any, values: any) => {
        if (!err) {
          const params = {
            phone: values.phone,
            password:values.password
          }
          http.post('/api/login/login',params).then(res=>{
            if(res.data.code && res.data.code === '0'){
              // 登录成功
              this.$message.success(res.data.msg);
              this.$store.commit('setToken',res.data.data.token)
              this.$store.commit('setUserInfo',res.data.data.userData)
              // 以秒为单位，设置1天后失效
              this.$cookies.set("token",res.data.data.token, EXPIREDTIME)
              this.$cookies.set("userInfo",JSON.stringify(res.data.data.userData), 60*60*24) 
              // 登录成功 跳转至管理系统首页
              this.$router.push({
                name: '/admin/home',
                params: {},
                query: {}    
              }).catch(err=>err)
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch(e=>{
              console.log(e)
          })        
        }
      });
    }
  // 生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'login_form' })
  }
    
}
</script>

<style lang="scss">
#login_page{
  background-image:url('../../../assets/login_bg.jpg');
  background-size: 100% 100%;
  height: 100vh;
  width: 100%;
  position: relative;

  .login_form {
    width: 360px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .login-form-forgot {
    float: right;
  }
  .login-form-button {
    width: 100%;
  }
  .ant-form-item{
    margin-bottom: 15px;
  }
}
</style>