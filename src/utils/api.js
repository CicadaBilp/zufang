import axios from 'axios'
import {BASE_URL} from './url'

//创建axios实例,设置基础路径
const Axios = axios.create({
  baseURL:BASE_URL
})

//导出这个axios实例
export {Axios}