import React from 'react'
import ReactDOM from 'react-dom'
//组件库的样式
import 'antd-mobile/dist/antd-mobile.css'
//图标库样式
import './assets/fonts/iconfont.css'
//react-virtualized的样式
import 'react-virtualized/styles.css'
//自己的全局样式
import './index.css'
import App from './App'

ReactDOM.render(<App></App>,document.getElementById('root'))