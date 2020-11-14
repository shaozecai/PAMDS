import Vue from 'vue'
import axios from 'axios'
import store from '@/store/index.ts'
import { EXPIREDTIME } from '@/public/javascript/config'


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_WEB,
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if(store.state.token){
      //让每个请求携带自定义token
      config.headers.authorization = store.state.token 
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)
// response响应器
service.interceptors.response.use(
  response => {
    const res = response
    console.log('拦截响应---',res)
    // 更新token
    if(res.data.token){
      store.commit('setToken',res.data.token)
      Vue.$cookies.set("token",res.data.token, EXPIREDTIME)
    }
    return Promise.resolve(res)
  },
  error => {
      // 处理错误的http响应
      // 跳转至错误页面
      store.commit('gotoPage',{url:'/admin/permission',params:error.response})
      return Promise.reject(error);
  }
)



export default {
  post(url: string, params: object, config?: object) {
    return service.post(url, params, config)
  },

  get(url: string, params: object, config?: object) {
    const getConfig = {}
    if (params) {
      Object.assign(getConfig, {
        params
      })
    }
    if (config) Object.assign(getConfig, config)
    return service.get(url, getConfig)
  },

  put(url: string, params: object, config?: object) {
    return service.put(url, params, config)
  },
  delete(url: string, params: object, config?: object) {
    const delConfig = {}
    if (params) {
      Object.assign(delConfig, {
        params
      })
    }
    if (config) Object.assign(delConfig, config)
    return service.delete(url, delConfig)
  }
}