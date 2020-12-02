import React from 'react'
import { Carousel, Flex, Modal, Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.scss'

import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'
import { BASE_URL, Axios, isLogin } from '../../utils'



// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseImg: "http://localhost:8080/img/news/2.png",
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseImg: "http://localhost:8080/img/news/2.png",
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseImg: "http://localhost:8080/img/news/2.png",
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}


export default class Detail extends React.Component {
  state = {
    isLoading: true,

    houseInfo: {
      // // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 89,
      // // 装修类型
      // renovation: '',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // // 地理位置
      coord: {
        latitude: '',
        longitude: ''
      },
      // 房屋配套
      supporting: [],
      // // 房屋标识
      // houseCode: '',
      // 房屋描述
      description: ''
    },
    isFavorite: false
  }

  async componentDidMount() {
    let { id } = this.props.match.params
    this.id = id
    //console.log(id);
    //根据id发请求获取房屋详情
    let res = await Axios(`/houses/${id}`)
    const { community, coord } = res.data.body
    //根据返回的信息渲染地图
    this.renderMap(community, coord)
    //调用查询房屋是否被收藏
    this.checkFavorite(id)
    // 更新房屋数据和加载状态
    this.setState({
      houseInfo: res.data.body,
      isLoading: false
    })
  }

  // 渲染轮播图结构
  renderSwipers() {
    const { houseInfo: { houseImg } } = this.state

    return houseImg.map((item, index) => (
      <a
        key={index}
        href="http://itcast.cn"
      >
        <img
          src={BASE_URL + item}
          alt=""
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
  //查询房屋是否收藏过
  async checkFavorite(id) {
    if (!isLogin) {
      return
    }
    //当登录后再发送请求查询房屋是否被收藏
    let res = await Axios.get(`/user/favorites/${id}`)
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        isFavorite: body.isFavorite
      })
    }
  }
  //点击收藏按钮的处理函数
  handleFavorite = async () => {

    if (!isLogin()) {
      Modal.alert('提示', '登录后才能收藏房源,是否去登录?', [
        { text: '取消' },
        {
          text: '去登录',
          onPress: () => {
            this.props.history.push('/login')
          }
        }
      ])
    }
    //如果已登录(本地缓存中存在token值)
    else {
      //如果已收藏就发请求删除
      if (this.state.isFavorite) {
        let res = await Axios.delete(`/user/favorite/${this.id}`)
        const { status } = res.data
        if (status === 200) {
          //删除成功
          Toast.info('已取消', 1)
          this.setState({ isFavorite: false })
        }
        else {
          Modal.alert('提示', '登录失效,是否去登录?', [
            { text: '取消' },
            {
              text: '去登录',
              onPress: () => {
                this.props.history.push('/login')
              }
            }
          ])
          this.setState({ isFavorite: false })
        }
      }
      //如果未收藏,就发请求收藏
      else {
        let res = Axios.post(`/user/favorite/${this.id}`)
        const { status } = res.data
        if (status === 200) {
          Toast.info('收藏成功', 1)
          this.setState({ isFavorite: true })
        }
        else {
          Modal.alert('提示', '登录失效,是否去登录?', [
            { text: '取消' },
            {
              text: '去登录',
              onPress: () => {
                this.props.history.push('/login')
              }
            }
          ])
          this.setState({ isFavorite: false })
        }
      }
    }
  }

  render() {
    const { isLoading, houseInfo, isFavorite } = this.state
    return (
      <div className={styles.root}>
        <NavHeader
          className={styles.detailHead}
          rightContent={[<i key="share" className="iconfont icon-share"></i>]}
        >
          房屋
        </NavHeader>
        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
              ''
            )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            {houseInfo.title}
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {
                houseInfo.tags.map((item, index) => {
                  let tagClass = index <= 2 ? `tag${index + 1}` : `tag${index % 2 + 1}`
                  return (
                    <span className={[styles.tag, styles[tagClass]].join(' ')} key={index}>
                      {item}
                    </span>
                  )
                })
              }
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {houseInfo.price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{houseInfo.roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{houseInfo.size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {houseInfo.floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>{houseInfo.oriented[0]}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{houseInfo.community}</span>
          </div>
          <div className={styles.mapContainer} id="map"></div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          <HousePackage
            list={houseInfo.supporting}
          />
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {/* {description || '暂无房屋描述'} */}
              {houseInfo.description}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} click={() => { }} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handleFavorite}>
            {
              isFavorite
                ? <>
                  <img
                    src={BASE_URL + '/img/star.png'}
                    className={styles.favoriteImg}
                    alt="收藏"
                  />
                  <span className={styles.favorite}>已收藏</span>
                </>
                : <>
                  <img
                    src={BASE_URL + '/img/unstar.png'}
                    className={styles.favoriteImg}
                    alt="收藏"
                  />
                  <span className={styles.favorite}>收藏</span>
                </>
            }
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>

    )
  }
}