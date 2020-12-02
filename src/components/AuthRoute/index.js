import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import { isLogin } from '../../utils'


//使用示例(和原来的Route一样使用)<AuthRoute path="/rent/add" component={RentAdd} />
//component属性接收到要被渲染的组件,在Route中用render-props模式做判断当登录过后才返回渲染那个组件
//反之就返回重定向组件,重定向到login路由,并用state传递额外数据指定登录后返回来时的页面

const AuthRoute = ({component:Component,...rest})=>{
  return (
    //render-props模式 的函数给Route组件,Route组件可以收到路由信息,并通过参数传给render函数,render再将这些传递到被Route渲染的组件,这就是只有被Route路由渲染的组件才会接收到路由信息
    <Route
    {...rest}
      render={props => {
        if(isLogin()){
          return <Component {...props} />
        }else{
          return (
            <Redirect to={{
              pathname:'/login',
              state:{from:props.location}
            }} />
          )
        }
      }}
    />
      
  )
}

export default AuthRoute