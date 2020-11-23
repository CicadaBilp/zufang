//首页组件
import React from 'react'
import { Route } from 'react-router-dom'
//导入蚂蚁移动组件库的tabbar组件
import { TabBar } from 'antd-mobile';

//导入home页中的四个组件
import Profile from '../Profile'
import Index from '../Index'
import News from '../News'
import HouseList from '../HouseList'
//导入该页面样式
import './index.css'

//tabbaritem的数据,抽成数组
const TABBARITEM = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/houselist' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' },
]

export default class Home extends React.Component {
  state = {
    selectedTab: '/home',
  }
  //封装函数根据item的数据遍历返回tabbaritem组件
  renderTabbarItem() {
    return TABBARITEM.map(item => {
      return (<TabBar.Item
        title={item.title}
        key={item.path}
        icon={<i className={`iconfont ${item.icon}`}></i>}
        selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.props.history.push(item.path)
          this.setState({ selectedTab: item.path })
        }}
        >
        </TabBar.Item>)
      })
  }


  render() {
    return (
      <div className="home">
        <Route path="/home/profile" component={Profile} />
        <Route exact path="/home" component={Index} />
        <Route path="/home/news" component={News} />
        <Route path="/home/houselist" component={HouseList} />
        {/* 组件库中的tabbar组件 */}
        <div className="tabbar">
          {/* /未选中的tabbar文字颜色 / 选中的颜色 / 不渲染内容*/}
          <TabBar unselectedTintColor="#949494" tintColor="#21b97a" noRenderContent={true}>
            {/* 调用函数渲染tabbaritem组件 */}
            {this.renderTabbarItem()}
          </TabBar>
        </div>
      </div>

    )
  }
}