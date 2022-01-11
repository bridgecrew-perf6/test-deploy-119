import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'terminalType': 'manage' }
  // headers: { 'terminalType': 'manage' }
})
// eslint-disable-next-line no-unused-vars
let loading = null
// request interceptor
service.interceptors.request.use(
  config => {
    loading = Loading.service({
      lock: false,
      // body: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.2)'
    })
    // do something before request is sent
    // config.data = qs.stringify(config.data) // 转为formdata数据格式
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer  ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    loading.close()
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && res.code !== 10006) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 1002 || res.code === 50012 || res.code === 50014) {
        // to re-login
        Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
        router.push({ name: 'login' })
        // MessageBox.confirm(res.msg, {
        //   confirmButtonText: '取消',
        //   cancelButtonText: '重新登录',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     router.push({ name: 'login' })
        //   })
        // })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    loading.close()
    console.log('err' + error) // for debug
    Message({
      message: error.mes,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
