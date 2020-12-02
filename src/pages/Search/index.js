import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getLocaCity ,Axios} from '../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getLocaCity().value
  timerId = 0
  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={this.handleClick.bind(this,item)}>
        {item.communityName}
      </li>
    ))
  }
  //输入框change事件处理函数
  handleChange = (val)=>{

    //如果输入框的值变为空
    if(val.trim()===''){
      return this.setState({
        tipsList:[],
        //此处当输入框值为空时必须也要更新searchTxt的值为空,才能返回,
        searchTxt:val
      })
    }
    this.setState({searchTxt:val})
    //加定时器防止每次输入就发送请求
    clearTimeout(this.timerId)
    this.timerId = setTimeout(async ()=>{
      let res = await Axios.get('/area/community',{
        params:{
          name:val,
          id:this.cityId
        }
      })
      const {body} = res.data
      this.setState({tipsList:body})
    },500)
  }
  //点击提示的小区列表项,拿到选择的小区名和id返回添加出租的路由,并将选择的小区也返回
  handleClick({community,communityName}){
    this.props.history.replace('/rent/add',{
      community,communityName
    })
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleChange}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
