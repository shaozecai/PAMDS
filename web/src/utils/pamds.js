import axios from 'axios'
import store from '@/store'

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    config => {
        if (store.state.TOKEN) {
            config.headers['X-Token'] = store.state.TOKEN // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        console.log('拦截请求',config)
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)
// response 拦截器
service.interceptors.response.use(
    response => {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      const res = response.data
      const codeReg = /^20\d+/
      if (!codeReg.test(response.status)) {
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            console.log('err' + res) // for debug
        }
        return Promise.reject('error')
      } else {
          console.log('拦截响应',response.data)
        return response.data
      }
    },
    error => {
      console.log('err' + error) // for debug
      return Promise.reject(error)
    }
)



export default {
  post(url, data, config) {
    return service.post(url, data, config)
  },

  get(url, params, config) {
    const getConfig = {}
    if (params) {
      Object.assign(getConfig, {
        params
      })
    }
    if (config) Object.assign(getConfig, config)

    return service.get(url, getConfig)
  },

  put(url, data, config) {
    return service.put(url, data, config)
  },

  delete(url, params, config) {
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