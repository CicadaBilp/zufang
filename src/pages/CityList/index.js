//城市列表组件
import React from 'react'
//引入Toast组件
import { Toast } from 'antd-mobile';
import axios from 'axios'
//引入本页样式
import './index.scss'
//导入获取当前选择城市组件和把选择的城市信息写入本地缓存组件
import { getCurrentCity,setLocaCity } from '../../utils'
//导入组件库中的两个组件
import { List, AutoSizer } from 'react-virtualized'
//导入顶部栏组件
import NavHeader from '../../components/NavHeader'

const INDEX_HEIGHT = 36
const CITY_HEIGHT = 50
const HAS_HOUSE = ['北京','上海','广州','深圳']

//处理获取的城市列表数据的函数
function handleList(list) {
  //此方法返回两个变量数据,根据城市首字母分类的对象,和根据城市首字母生成的字母数组
  let citysObject = {}
  let indexList = []
  let firstLitter = ''
  //遍历获取的原始列表数组
  list.forEach(item => {
    firstLitter = item.short[0]
    if (firstLitter in citysObject) {
      citysObject[firstLitter].push(item)
    } else {
      citysObject[firstLitter] = [item]
    }
  })
  indexList = Object.keys(citysObject).sort()

  return { citysObject, indexList }
}
//处理列表每行的标题(将首字母转化一下返回)
function handleTitle(letter) {
  switch (letter) {
    case '#':
      return '当前城市';
    case 'hot':
      return '热门城市';
    default:
      return letter.toUpperCase()
  }
}




export default class CityList extends React.Component {
  state = {
    //城市列表(按字母分类的对象和所有首字母的数组)
    citysObject: {},
    indexList: [],
    //右侧索引栏字母高亮的索引
    activeIndex: 0
  }
  //创建一个ref对象,可将List组件绑定到该对象上,使用时可获取List组件的实例
  listRef = React.createRef()

  //获取城市列表数据
  async getCityList() {
    //发请求获取所有城市列表
    let res = await axios.get('http://localhost:8080/area/city?level=1')
    //console.log(res)
    //调用处理列表数据的方法
    let { citysObject, indexList } = handleList(res.data.body)
    //其他城市列表处理完后,发送请求获取热门城市数据,将其作为一组,插入上面两个中
    let hot = await axios.get('http://localhost:8080/area/hot')
    indexList.unshift('hot')
    citysObject.hot = hot.data.body
    //console.log(citysObject,indexList);
    //调用方法获取当前城市信息
    let curr = await getCurrentCity()
    indexList.unshift('#')
    citysObject['#'] = [curr]
    //更新state
    this.setState({
      citysObject,
      indexList
    }, () => {
      //在更新完需要的列表数据后,中从ref中拿到List实例,调用它的方法提前计算每一行的高度,为右侧直接跳转做准备
      this.listRef.current.measureAllRows()
    })
  }
  //每一组数据(行)列表的渲染结构(该方法由组件内部调用所以在使用this是写成箭头函数)
  rowRenderer = ({ key, index, style }) => {
    //该函数调用时会根据指定的indexList数组长度返回索引,收到索引去indexList中拿到对应的元素(首字母)
    const letter = this.state.indexList[index]
    //再根据拿到的首字母去citysObject中拿到这一组城市数据
    const rowList = this.state.citysObject[letter]

    return (
      <div key={key} style={style} className="city">
        <div className="title"> {handleTitle(letter)} </div>
        {rowList.map(item => (
          <div key={item.value} className="name" onClick={()=>this.changeCity(item)} >
            {item.label}
          </div>
        ))}
      </div>
    );
  }
  //点击城市进行跳转(先拿到点击的城市信息,去判断是否有房源,有再跳转,没有只提示)
  changeCity({label,value}){
    //点击的城市有房源
    if(HAS_HOUSE.indexOf(label) > -1){
      //更新本地缓存的城市信息,并返回上一页
      setLocaCity({label,value})
      this.props.history.go(-1)
    }else{
      Toast.info('该城市暂无房源',1)
    }
  }
  //点击右侧字母索引跳转到该索引的列表项(需要调用List组件的)
  toCity(index) {
    console.log(index, this.listRef);
    //通过this的ref属性拿到里面的List组件实例,调用其提供的跳转方法到index索引的列表项去
    this.listRef.current.scrollToRow(index)
  }
  //渲染右侧导航索引结构()
  renderCityIndex() {
    const { indexList, activeIndex } = this.state
    return indexList.map((item, index) => (
      <li key={item} className="city-index-item" onClick={() => this.toCity(index)} >
        {/* 判断当前字母框索引是否等于activeindex,相同就加上高亮类名 */}
        <span className={index === activeIndex ? "index-active" : ''}> {item === 'hot' ? '热' : item.toUpperCase()} </span>
      </li>
    ))
  }
  //计算每行高度的函数(该方法由组件内部调用,所以用this时需要写成箭头函数)
  computHeight = ({ index }) => {
    //该函数被调用时会接收到一个对象,结构出里面的index为每一行的索引值,根据它去indexList
    const letter = this.state.indexList[index]
    //再根据拿到的首字母去citysObject中拿到这一组城市数组
    const rowList = this.state.citysObject[letter]
    return INDEX_HEIGHT + CITY_HEIGHT * (rowList.length)
  }
  //list组件的属性,是一个函数,它会接收到一些数据包括列表区域最上方列表的索引等,
  //(该方法也会被组件内部调用,所以要用this得写成箭头函数)
  onRowsRendered = ({ startIndex }) => {
    //判断区域现在最上方的列表索引是否与activeIndex相同,如果不同再更新赋值
    this.setState({
      activeIndex: startIndex
    })
  }

  componentDidMount() {
    this.getCityList()
  }

    render() {
      return (
        <div className="citylist">
          <NavHeader>城市选择</NavHeader>
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={this.listRef}
                width={width}
                height={height}
                rowCount={this.state.indexList.length}
                rowHeight={this.computHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment={'start'}
              />
            )}
          </AutoSizer>
          <ul className="city-index">
            {this.renderCityIndex()}
          </ul>
        </div>
      )
    }
  }