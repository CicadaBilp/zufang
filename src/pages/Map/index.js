import React from 'react'

import './index.scss'
//导入顶部栏组件
import NavHeader from '../../components/NavHeader'
//
const BMap = window.BMap
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS

export default class Map extends React.Component {

  componentDidMount() {
    //创建百度地图对象
    //116.404, 39.915
    const map = new BMap.Map('container')
    const point = new BMap.Point(116.331398,39.897445)
    map.centerAndZoom(point, 15) 
  }
  render() {
    return (
      <div className="map" >
        <NavHeader>地图找房</NavHeader>
        <div id="container" className="container"></div>
      </div>
    )
  }
}