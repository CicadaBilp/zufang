//将顶部navbar封装为组件,可传入children改变展示标题

import React from 'react';
import './index.scss';

import { NavBar } from 'antd-mobile'
//导出一个函数组件,顶部栏,从传入的props对象中解构出children属性的值,就是要展示的标题
export default function NavHeader({children}) {
  return (
    <NavBar
      className="navbar"
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => this.props.history.go(-1)}
    >{children}</NavBar>
  )
}