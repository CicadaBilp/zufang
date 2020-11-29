import React from 'react'

import './index.scss'
//导入module.css
import styles from './index.module.css'
//导入顶部栏组件
import NavHeader from '../../components/NavHeader'
//导入获取本地缓存中城市信息的组件
import { getLocaCity,BASE_URL,Axios } from '../../utils/index'
//导入ant-d mobile中的toast组件
import {Toast} from 'antd-mobile'
//导入每间房的渲染组件
import HouseItem from '../../components/HouseItem'


const BMap = window.BMap
// 重置label实例的样式,因为已经把label内容设为需要的html结构,不需要原来的内容和样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {
  state = {
    //是否展示小区房源列表
    isShowHouseList: false,
    // 小区房源列表数据
    houseList: []
  }

  componentDidMount() {
    this.initMap()
    //this.getHouseByArea()
  }
  //初始化地图展示,获取缓存中的城市信息,解析显示城市地图
  initMap() {
    let { label, value } = getLocaCity()
    label = label + '市'
    //创建百度地图对象
    //设置展示地图的容器
    const map = new BMap.Map('container')
    this.map = map
    //利用地址解析器,解析获取到的缓存城市信息的经纬度,展示在地图中
    let myGeo = new BMap.Geocoder();
    // 将地址解析的城市显示在地图上    
    myGeo.getPoint(label, async point => {
      if (point) {
        map.centerAndZoom(point, 11);
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());     
        this.renderOver(value)
      }
    },
      label)
      map.addEventListener('movestart',()=>{
        console.log('地图移动')
        this.setState({
          isShowHouseList:false
        })
      })
  }
  //给地图添加覆盖物的方法
  async renderOver(id) {
    Toast.loading('',0, null,false)
    let res = await Axios('/area/map', { params: { id } })
    Toast.hide()
    //console.log(res);
    let { type, nextZoom } = this.getTypeZoom()
    this.createOver(type, nextZoom, res)
  }

  //返回下一级区域的缩放级别和当前要添加覆盖物的类型(圆或矩形)
  getTypeZoom() {
    let type = ''
    let nextZoom = ''
    let currZoom = this.map.getZoom()
    if (currZoom >= 10 && currZoom < 12) {
      //城市地图初始化时Zoom为11,说明此时在给区加覆盖物,当点击后,下一次地图缩放应该为13
      type = 'circle'
      nextZoom = 13
    } else if (currZoom >= 12 && currZoom < 14) {
      //缩放为13说明此时在给镇加覆盖物,当点击后,下一次地图缩放应该为15
      type = 'circle'
      nextZoom = 15
    } else {
      //除此之外,说明此时在给小区添加覆盖物,覆盖物类型为矩形
      type = 'rect'
    }
    return { type, nextZoom }
  }
  //根据type判断是哪种覆盖物,再调用对应的方法
  createOver(type, nextZoom, res) {
    if (type === 'rect') {
      //说明是小区覆盖物,遍历res中的小区房源数组,调用添加覆盖物函数,为每个小区添加
      res.data.body.forEach(item => {
        this.createRect(item)
      })
    } else {
      //说明是区或镇的覆盖物,遍历res中的房源数组,调用添加圆形覆盖物函数,为每个区或镇添加覆盖物
      res.data.body.forEach(item => {
        this.createCircle(item, nextZoom)
      })
    }
  }
  //给区或镇添加圆形覆盖物的函数
  createCircle(item, nextZoom) {
    //从每个地点的房源数据中解构出经纬坐标,生成point实例,在后面生成覆盖物时用到
    let { coord: { longitude, latitude } } = item
    let point = new BMap.Point(longitude, latitude)
    //地图覆盖物设置
    let opts = {
      position: point, // 指定覆盖物所在的地理位置
      offset: new BMap.Size(-35, -35) // 设置覆盖物结构的偏移
    };
    let label = new BMap.Label('', opts);
    //房源覆盖物的html结构(这里面类似innerhtml ,而不是jsx所以这里用class属性)
    label.setContent(`
         <div class="${styles.bubble}">
           <p class="${styles.name}">${item.label}</p>
           <p>${item.count}套</p>
         </div>
       `)
    //给每个label绑定点击事件
    label.addEventListener('click', () => {
      this.renderOver(item.value)
      this.map.clearOverlays()
      this.map.centerAndZoom(point, nextZoom)
    })
    //重置label默认样式
    label.setStyle(labelStyle);
    this.map.addOverlay(label);
  }
  //给每个小区添加矩形覆盖物
  createRect(item) {
    //从每个地点的房源数据中解构出经纬坐标,生成point实例,在后面生成覆盖物时用到
    let { coord: { longitude, latitude } } = item
    let point = new BMap.Point(longitude, latitude)
    //地图覆盖物设置
    let opts = {
      position: point, // 指定覆盖物所在的地理位置
      offset: new BMap.Size(-50, -25) // 设置覆盖物结构的偏移
    };
    let label = new BMap.Label('', opts);
    //房源覆盖物的html结构(这里面类似innerhtml ,而不是jsx所以这里用class属性)
    label.setContent(`
    <div class="${styles.rect}">
      <span class="${styles.housename}">${item.label}</span>
      <span class="${styles.housenum}">${item.count}套</span>
      <i class="${styles.arrow}"></i>
    </div>
   `)
    //给每个label绑定点击事件
    label.addEventListener('click', () => {
      this.map.centerAndZoom(point,15)
      //调用地图移动方法,将
      this.map.panBy(0,-146)
      this.getCommunity(item.value)
      console.log(item.value);
    })
    //重置label默认样式
    label.setStyle(labelStyle);
    this.map.addOverlay(label);
  }
  //点击小区label,获取小区里的房源,展示为列表
  async getCommunity(id) {
    Toast.loading('',0, null,false)
    let res = await Axios('/houses', { params: { cityId: id } })
    Toast.hide()
    console.log(res);
    this.setState({
      isShowHouseList: true,
      houseList: res.data.body.list
    })
  }
  //渲染每间房的列表项
  renderHouseList() {
    return this.state.houseList.map(item => (
      <HouseItem {...item} 
        key={item.houseCode} 
        houseImg={`${BASE_URL}${item.houseImg}`}
        click={()=>this.props.history.push('/detail')}
      >
      </HouseItem>
    ))
  }


  render() {
    return (
      <div className="map" >
        <NavHeader>地图找房</NavHeader>
        <div id="container" className="container"></div>
        {/* 小区房源列表 */}
        <div
          className={[styles.houseList, this.state.isShowHouseList && styles.show].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            {/* 具体每间房的列表 */}
            {this.renderHouseList()}
          </div>
        </div>
      </div>
    )
  }
}