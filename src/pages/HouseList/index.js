import React from 'react'
import { Flex, Toast } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
import Filter from './components/Filter'
//导入axios的组件
import { Axios, BASE_URL, getLocaCity } from '../../utils'
//导入单个房屋项结构组件
import HouseItem from '../../components/HouseItem'
//导入吸顶功能组件
import Sticky from '../../components/Sticky'
//导入没有房源时展示的组件
import NoHouse from '../../components/NoHouse'


export default class HouseList extends React.Component {
  state = {
    //房屋数量
    count: 0,
    //房屋数据列表
    list: [],
    //数据是否获取完成
    isLoaded: false
  }
  //初始化this的filter属性
  filters = {}
  //初始化label值
  label = ''
  //当子组件点击确定按钮触发这个函数,接收filter子组件传递的最终查询条件对象
  Filters = (data) => {
    //将受到的查询对象保存为this的filters属性
    this.filters = data
    //调用获取房屋列表数据的方法
    this.searchHouseList()
    //当筛选子组件点击确定按钮后,发请求获取新数据更新列表渲染,此时需要让页面回到顶部 
    window.scrollTo(0,0)
  }
  //根据查询条件对象,获取房屋列表数据
  async searchHouseList() {
    Toast.loading('', 0, null, false)
    const res = await Axios('/houses', {
      params: {
        ...this.filters,
        start: 1,
        end: 20,
        cityId: this.value
      }
    })
    Toast.hide()
    const { list, count } = res.data.body
    Toast.info(`一共有${count}个房源`, 1, null, false)
    this.setState({
      list,
      count,
      isLoaded: true
    })
    //console.log(res);
  }
  componentDidMount() {
    const { label, value } = getLocaCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }
  //每一行的渲染结构
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]
    //当滚动快时会没有拿到最新的list值取不到item,需要在此做判断item是否存在,不存在就渲染一个div占位
    if (!item) {
      return (
        <div key={key} style={style} >
          <p className={styles.loading}></p>
        </div>
      )
    }
    //注意:列表渲染组件中的rowRenderer属性为一个函数,该函数返回列表每一行的结构
    //且该函数要接收style参数,并添加给每一行的结构中保证列表样式,此处将style给组件再由组件内部添加到行结构中
    return (
      <HouseItem key={key}
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
        style={style}
        click={() => this.props.history.push(`/detail/${item.houseCode}`)}
      ></HouseItem>
    )
  }
  //InfiniteLoader组件需要的属性,是一个函数返回布尔值,表示index行是否加载完成(在不在列表数据中)
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  //InfiniteLoader组件需要的属性,一个函数,返回promise,里面根据函数接收的起始索引和结束索引发送请求获取新数据,
  //在获取到新数据后调用resolve,并把数据合并更新到渲染数据源list数组中
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      let res = await Axios('/houses', {
        params: {
          ...this.filters,
          start: startIndex,
          end: stopIndex,
          cityId: this.value
        }
      })
      console.log('loadMoreRows执行', startIndex, stopIndex);
      resolve()
      this.setState({
        list: [...this.state.list, ...res.data.body.list]
      })
    })
  }
  renderHouseList() {
    const { isLoaded, count } = this.state
    if (isLoaded && count== 0) {
      return <NoHouse>没有找到房源,请您换个筛选条件吧</NoHouse>
    }
    return (
      <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={count}
          minimumBatchSize={21}
        >
          {({onRowsRendered,registerChild})=>(
            //在原来的List组件加上高阶组件windowScroller,可以让List的列表随着window页面滚动
            <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    width={width}
                    autoHeight
                    height={height}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
          )}
        </InfiniteLoader>
    )

  }
  render() {
    return (
      <div className={styles.houseList}>
        {/* 顶部 */}
        <Flex className={styles.houseListHeader}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
          <SearchHeader cityName={this.label} className={styles.houseListSearch}></SearchHeader>
        </Flex>
        {/* 条件选择部分 ,使用封装的吸顶组件包裹*/}
        <Sticky height={40}>
          <Filter Filters={this.Filters}></Filter>
        </Sticky>
        {/* 房屋列表部分---- */}
        <div className={styles.houselist}>{this.renderHouseList()}</div>
      </div>
    )
  }
}