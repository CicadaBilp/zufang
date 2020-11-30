import React from 'react'
import {Route} from 'react-router-dom'
import { isLogin } from '../../utils'

const AuthRoute = ({component:Component})=>{
  return (
    <Route
      render={props => {
        if(isLogin()){
          return <Component />
        }else{
          return (
            
          )
        }
      }}
    >
      
    </Route>
  )
}