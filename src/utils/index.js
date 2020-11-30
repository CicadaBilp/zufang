import axios from 'axios'
import {getLocaCity,setLocaCity} from './locaCity'


const getCurrentCity = () => {
  //先从缓存中获取城市信息
  let currCity = getLocaCity()

  if (!currCity) {
    //如果缓存中没有城市信息,就返回一个promise,里面就是借用百度ip定位,再发送城市名到后端接口返回项目中有的这个城市具体信息
    return new Promise((resolve) => {
      var myCity = new window.BMap.LocalCity()
      myCity.get(async (result) => {
        //console.log(result);
        //将百度地图api的ip定位到的城市,发送到后端接口在城市列表中查找返回这个城市在本项目中的信息
        const res = await axios.get('http://localhost:8080/area/info', {
          params: {
            name: result.name
          }
        })
        //console.log(res)
        const { label, value } = res.data.body
        resolve({ label, value })
        //存入缓存
        setLocaCity({label,value})
      });
    })
  } else {
    return Promise.resolve(currCity)
  }
}

export { getCurrentCity,getLocaCity,setLocaCity }
//导入再导出读取的开发时期的url
export {BASE_URL} from './url'
//导入再导出设置了基础路径的axios
export {Axios} from './api'
//导出读写登录token的方法
export {setToken,getToken,isLogin,removeToken} from './token'