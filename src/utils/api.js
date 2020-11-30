import axios from 'axios'
import { removeToken } from './token'
import {BASE_URL} from './url'

//创建axios实例,设置基础路径
const Axios = axios.create({
  baseURL:BASE_URL
})
//给Axios加请求拦截器,config获取到当前请求的路径url,判断是否是以/user开头,并且不是登录或注册的接口地址
//此时需要加上请求头authorization
Axios.interceptors.request.use(config => {
  const {url} = config
  if(url.startsWith('/user') && !(url.startsWith('/user/registered') || url.startwith('/user/login'))){
    config.headers.authorization = getToken()
  }
  return config
})

//添加响应拦截器,首先拿到响应的数据进行判断设置
Axios.interceptors.response.use(res => {
  if(res.data.status===400){
    removeToken()
  }
  return res
})

//导出这个axios实例
export {Axios}