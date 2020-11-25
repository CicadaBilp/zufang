//抽离的根组件
import React from 'react'

//导入路由模块
import {BrowserRouter as Router,Redirect,Route} from 'react-router-dom'
//导入组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

//创建根组件
const App = () =>{
  return (
    <Router>
      <div className="App">
        {/* 使用路由重定向将'/'定向到'home'路由 -----就是render-props模式 */}
        <Route exact path="/" render={()=> <Redirect to="/home"/>} />
        {/* 首页 */}
        <Route path="/home" component={Home} />
        {/* 地图页 */}
        <Route path="/map" component={Map} />
        {/* 城市列表页 */}
        <Route path="/citylist" component={CityList} />
      </div>
    </Router>
  )
}

//导出根组件
export default App