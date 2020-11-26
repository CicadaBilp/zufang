import React from 'react'

import './index.scss'
import styles from './index.module.css'
//导入顶部栏组件
import NavHeader from '../../components/NavHeader'
//导入获取本地缓存中城市信息的组价
import { getLocaCity } from '../../utils/locaCity'
import axios from 'axios'

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
    isShowHouseList: false,
    houseList: []
  }

  componentDidMount() {
    this.initMap()
    //this.getHouseByArea()
  }
  //初始化地图展示,获取缓存中的城市信息,解析显示地图
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
      label);

  }
  //给地图添加覆盖物的方法
  async renderOver(id) {
    let res = await axios('http://localhost:8080/area/map', { params: { id } })
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
      res.data.body.forEach(item => {
        this.createRect(item)
      })
    } else {
      //说明是区或镇的覆盖物
      res.data.body.forEach(item => {
        this.createCircle(item, nextZoom)
      })
    }
  }
  //生成圆形覆盖物的函数
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
      this.getCommunity(item.value)
      console.log(item.value);
    })
    //重置label默认样式
    label.setStyle(labelStyle);
    this.map.addOverlay(label);
  }
  //点击小区label,获取小区里的房源
  async getCommunity(id) {
    let res = await axios('http://localhost:8080/houses', { params: { cityId: id } })
    console.log(res);
    this.setState({
      isShowHouseList: true
    })
  }
  //渲染每间房的列表项
  renderHouseList() {
    return this.state.houseList.map(item => (
      <div className={styles.house} >
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className={styles.content}>
    <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>个体大人的过一个月夫人夫人的</div>
          <div>
            <span

              className={[styles.tag, styles.tag1].join(' ')}
            >
              近地铁
                      </span>
                    )
                </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>1500</span> 元/月
                </div>
        </div>
      </div>
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
            {this.renderHouseList()}
          </div>
        </div>
      </div>
    )
  }
}