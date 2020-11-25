import React from 'react'
//导入轮播图组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
//导入路由组件
import { Link } from 'react-router-dom'
//导入axios包
import axios from 'axios'
//导入页面css样式
import './index.scss'
//导入导航图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

import {getCurrentCity} from '../../utils/index'






export default class Index extends React.Component {
  state = {
    //图片数据
    swiper: [],
    //轮播图数据是否加载中
    swiperLoading: true,
    groups: [],
    news: [],
    city:''
  }

  //发送请求获取轮播图数据
  async getSwiper() {
    let res = await axios.get('http://localhost:8080/home/swiper')
    //console.log(res)
    //获取数据后更新state,并更新轮播数据加载完成,
    this.setState({ swiper: res.data.body, swiperLoading: false })
  }
  //发请求获取租房小组数据
  async getGroups() {
    let res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    //console.log(res);
    this.setState({
      groups: res.data.body
    })
  }
  //发请求获取资讯
  async getNews() {
    let res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    //console.log(res);
    this.setState({
      news: res.data.body
    })
  }
  //渲染轮播图数据到结构中
  renderSwiper() {
    return this.state.swiper.map(item => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            // 触发 window 的 resize 事件，来改变图片高度
            window.dispatchEvent(new Event('resize'))
            this.setState({ imgHeight: 'auto' })
          }}
        />
      </a>
    ))
  }
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
        <Flex className="item-info" direction="column" justify="between" align="start">
          <p> {item.title} </p>
          <Flex justify="between" className="item-time">
            <span> {item.from} </span>
            <span> {item.date} </span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  async componentDidMount() {
    console.log(this);
    //在此调用方法获取轮播图数据
    this.getSwiper()
    //在此调用获取租房小组数据
    this.getGroups()
    //调用获取资讯数据
    this.getNews()
    // axios.get('http://api.map.baidu.com/location/ip?ak=OgyRyC1xxebF69omnXBMyjxMNsIN5LGD&coor=bd09ll')
    // .then((res)=>console.log(res))
    let {label} = await getCurrentCity()
    this.setState({
      city:label
    })
    //console.log(getCurrentCity())
  }
    


  render() {
    return (
      <div>
        {/*对swiperLoading进行判断,确保在获取到轮播图数据后再渲染轮播组件
        第一次render时渲染内容为空,当数据加载完成后再次渲染会展示,之间该区域高度会变化,加div */}
        <div className="swiper">
          {/* 搜索栏 */}
          <Flex className="search">
            <Flex className="left">
              <div className="path" onClick={()=>this.props.history.push('/citylist')}>
                <span> {this.state.city}  </span>
                <i className="iconfont icon-arrow"></i>
              </div>
              <div className="left-search" onClick={()=>this.props.history.push('/search')}>
                <i className="iconfont icon-seach"></i>
                <span>请输入小区或地址</span>
              </div>
            </Flex>
            <i className="iconfont icon-map" onClick={()=>this.props.history.push('/map')}></i>
          </Flex>
          {
            !this.state.swiperLoading && (<Carousel
              autoplay={true}
              infinite
              autoplayInterval={2000}
            >
              {this.renderSwiper()}
            </Carousel>)
          }
        </div>
        {/* 导航菜单 */}
        <Flex className="navbarList">
          <Flex.Item>
            <Link to="/home/houselist">
              <img src={nav1} alt="" />
              <p>整租</p>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/home/houselist">
              <img src={nav2} alt=""/>
              <p>合租</p>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/map">
              <img src={nav3} alt=""/>
              <p>地图找房</p>
            </Link>
          </Flex.Item>
          <Flex.Item>
            <Link to="/rent/add">
              <img src={nav4} alt=""/>
              <p>去出租</p>
            </Link>
          </Flex.Item>
        </Flex>
        {/* 租房小组 */}
        <div className="groups">
          {/* 标题 */}
          <Flex justify="between" className="groups-title">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/* 九宫格 
            data数据源 , activestyle为点击是否有反馈效果*/}
          <Grid className="gird" data={this.state.groups} columnNum={2} a
            ctiveStyle={true} square={false} hasLine={false}
            renderItem={(item) => (
              <Flex className="gird-item" justify="between">
                <div>
                  <p> {item.title} </p>
                  <span>{item.desc}  </span>
                </div>
                <div>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </div>
              </Flex>
            )} />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3>最新资讯</h3>
          <WingBlank>
              {this.renderNews()}
          </WingBlank>
        </div>
      </div>
    )
  }
}
