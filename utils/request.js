import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getParkId } from '@/utils/auth'
import { filterParams } from '@/utils'
import mixin from '../mixin'
// const env = process.env.NODE_ENV
// create an axios instance
const service = axios.create({
  baseURL: window.location.origin, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 10 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    store.commit('app/CHANGE_IS_LOADING', true)
    // do something before request is sent
    if (store.getters.accessToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['iot-token'] = getToken()
      config.headers['parkGuid'] = getParkId()
      if (config.params && !config.notFilter) {
        // notFilter 不过滤空字符串参数，需要传空字符串参数时设置notFilter true
        config.params = filterParams(config.params)
      }
      if (config.data && !config.notFilter) {
        config.data = filterParams(config.data)
      }
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
    const authenErrorCode = ['401', '403']
    const res = response.data
    store.commit('app/CHANGE_IS_LOADING', false)
    if (authenErrorCode.includes(res.errorCode)) {
      mixin.methods.showConfirm({
        promiseCallBack: () => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        },
        title: '提示',
        showCancelButton: false,
        confirmButtonText: '重新登录',
        confirmText: 'token过期，请重新登录',
        confirmButtonClass: 'self-confirm-warn'
      })
    } else if (res.errorCode !== '0') {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res
  },
  error => {
    store.commit('app/CHANGE_IS_LOADING', false)
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
