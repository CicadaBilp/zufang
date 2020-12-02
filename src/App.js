//抽离的根组件,再导入lazy方法和Suspense组件,实现路由懒加载(访问到的时候再加载)
import React, { lazy, Suspense } from 'react'
//导入路由模块
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import AuthRoute from './components/AuthRoute'
//导入组件
import Home from './pages/Home'
const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const Detail = lazy(() => import('./pages/Detail'))
const Login = lazy(() => import('./pages/Login'))
const Add = lazy(() => import('./pages/Add'))
const Rent = lazy(() => import('./pages/Rent'))
const Search = lazy(() => import('./pages/Search'))




//创建根组件
const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>loading....</div>}>
        <div className="App">
          {/* 使用路由重定向将'/'定向到'home'路由 -----就是render-props模式 */}
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          {/* 首页 */}
          <Route path="/home" component={Home} />
          {/* 地图页 */}
          <Route path="/map" component={Map} />
          {/* 城市列表页 */}
          <Route path="/citylist" component={CityList} />
          {/* 房屋详情页 */}
          <Route path="/detail/:id" component={Detail} />
          {/* 登录页 */}
          <Route path="/login" component={Login} />
          {/* 出租列表页 */}
          <AuthRoute exact path="/rent" component={Rent} />
          {/* 房屋出租页 */}
          <AuthRoute path="/rent/add" component={Add} />
          {/* 添加出租时的搜索小区页 */}
          <AuthRoute path="/rent/search" component={Search} />
        </div>
      </Suspense>
    </Router>
  )
}

//导出根组件
export default App