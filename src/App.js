//抽离的根组件
import React from 'react'

//导入路由模块
import {BrowserRouter as Router,Redirect,Route} from 'react-router-dom'
//导入组件
import Home from './pages/Home'
import CityList from './pages/CityList'

//创建根组件
const App = () =>{
  return (
    <Router>
      <div>
        {/* 使用路由重定向将'/'定向到'home'路由 -----就是render-props模式 */}
        <Route exact path="/" render={()=> <Redirect to="/home"/>} />
        {/* 首页 */}
        <Route path="/home" component={Home} />
        {/* 城市列表页 */}
        <Route path="/citylist" component={CityList} />
      </div>
    </Router>
  )
}

//导出根组件
export default App