import React from 'react'
import { Flex } from 'antd-mobile'
import { List, AutoSizer, WindowScroller } from 'react-virtualized'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'
import Filter from './components/Filter'
//导入axios的组件
import { Axios, BASE_URL, getLocaCity } from '../../utils'
import HouseItem from '../../components/HouseItem'


export default class HouseList extends React.Component {
  state = {
    //房屋数量
    count: 0,
    //房屋数据列表
    list: []
  }
  //初始化this的filter属性
  filters = {}
  //接收filter子组件传递的最终查询条件对象
  Filters = (data) => {
    //将受到的查询对象保存为this的filters属性
    this.filters = data
    //调用获取房屋列表数据的方法
    this.searchHouseList()
  }
  //根据查询条件对象,获取房屋列表数据
  async searchHouseList() {
    const { value } = getLocaCity()
    const res = await Axios('/houses', {
      params: {
        ...this.filters,
        start: 1,
        end: 20,
        cityId: value
      }
    })
    const { list, count } = res.data.body
    this.setState({
      list,
      count
    })
    console.log(res);
  }
  componentDidMount() {
    this.searchHouseList()
  }
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]
    //注意:列表渲染组件中的rowRenderer属性为一个函数,该函数返回列表每一行的结构
    //且该函数要接收style参数,并添加给每一行的结构中保证列表样式,此处将style给组件再由组件内部添加到行结构中
    return (
      <HouseItem key={key} {...item} houseImg={`${BASE_URL}${item.houseImg}`} style={style}></HouseItem>
    )
  }
  render() {
    return (
      <div className={styles.houseList}>
        <Flex className={styles.houseListHeader}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
          <SearchHeader cityName="上海" className={styles.houseListSearch}></SearchHeader>
        </Flex>
        {/* 条件选择部分 */}
        <Filter Filters={this.Filters}></Filter>
        {/* 房屋列表部分----在原来的List组件加上高阶组件windowScroller,可以让List的列表随着window页面滚动 */}
        <WindowScroller>
          {({height,isScrolling,scrollTop}) => (
            <AutoSizer>
              {({ width }) => (
                <List
                  width={width}
                  autoHeight
                  height={height}
                  rowCount={this.state.count}
                  rowHeight={120}
                  rowRenderer={this.rowRenderer}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </div>
    )
  }
}