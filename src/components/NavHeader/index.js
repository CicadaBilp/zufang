//将顶部navbar封装为组件,可传入children改变展示标题
import React from 'react';
import { NavBar } from 'antd-mobile'
//导入react路由提供的高阶组件,使这个组件能拿到路由信息从而跳转
import {withRouter} from 'react-router-dom'
//导入属性校验包
import ProTypes from 'prop-types'
import styles from  './index.module.scss';


//导出一个函数组件,顶部栏,从传入的props对象中解构出children属性的值,就是要展示的标题
 function NavHeader({children,history,className,rightContent}) {
  return (
    <NavBar
      className={[styles.navbar,className].join(' ')}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => history.go(-1)}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}

//属性校验
NavHeader.prototype = {
  children:ProTypes.string.isRequired,
  className:ProTypes.string
}

//导出被高阶组件处理后的组件,可以拿到路由信息,进行跳转
export default withRouter(NavHeader)