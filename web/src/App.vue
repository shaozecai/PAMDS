<template>
  <div id="app">
    <Memu v-if="memuFlag"></Memu>
    <Row>
      <Col span="4" v-if="memuFlag">
        <LeftAside ></LeftAside>
      </Col>
      <Col :span="memuFlag ? 20 : 24" style="padding:0;box-size:border-box;">
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view style="padding:15px;box-size:border-box;"></router-view>
      </Col>
    </Row>
  </div>
</template>

<script>
import Memu from './components/Memu'
import LeftAside from './components/LeftAside'
export default {
  name: 'App',
  components:{
    Memu,
    LeftAside
  },
  data(){
    return {
      
    }
  },
  created(){
    const TOKEN = this.$cookies.get('TOKEN')
    const USERINFO = this.$cookies.get('USERINFO')
    if(TOKEN){
      this.$store.commit('SET_TOKEN',TOKEN)
      this.$store.commit('SET_USER_INFO',USERINFO)
    }
  },
  computed:{
    memuFlag(){
      if(this.$store.state.TOKEN){
        return true
      }else{
        return false
      }
    }
  }
}
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
  text-align: left;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 12px;
  .ivu-input{
    font-size: 12px;
  }
}
</style>
