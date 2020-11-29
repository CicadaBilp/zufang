import React, { Component } from 'react'
import {Spring} from 'react-spring/renderprops'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { Axios, getLocaCity } from '../../../../utils'

import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    //筛选栏四个标题是否高亮(该状态提升到filter组件中由它来统一控制,因为多个组件都可以操作这个状态)
    isTitleSelected: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    //四个标题栏对应的详细筛选框和遮罩层是否展示(该状态提升到filter组件中,由filter来管理状态值)
    openType: '',
    //所有的筛选条件数据
    filterData: {},
    //四个标题对应的筛选条件的选中值数组(默认值为这个,当选择后会更新这个数组)由fliter组件来管理这个状态
    selectedValue: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }
  //点击标题触发函数
  //每个标题栏是否高亮和是否展示遮罩层,详细筛选框的方法(传递给子组件接收要修改的数据,由filter组件来修改)
  changeTitleSelected = (type) => {
    //点击标题后,给body加类名让其overfloow=hidden
    this.Body.classList.add('hidden')
    //console.log(type);
    //标题点击的处理函数中,先拿到state中的两个状态对象
    const {isTitleSelected,selectedValue} = this.state
    //要更新引用类型的状态需要新建对象
    const newisTitleSelected = {...isTitleSelected}
    //使用Object.keys()将newisTitleSelected的键组成数组
    Object.keys(newisTitleSelected).forEach(key => {
      //取出每个标题对应的选中值数组
      const everyValue = selectedValue[key]
      //遍历四个标题栏,让点击的那个高亮,
      //并判断其余的标题是否高亮(根据每个标题栏对应的选中值数组,看是否是默认的那些值,如果不是就让该标题页高亮)
      if(key===type){
        newisTitleSelected[type] = true
      }else {
        //非当前标题,就调用get方法判断它们是否应该高亮,并把判断结果整合更新到创建的新对象
        const oneTypeSelected = this.getIsTitleSelected(key,everyValue)
        Object.assign(newisTitleSelected,oneTypeSelected)
      }
    })
    console.log(newisTitleSelected);
    this.setState({
      openType:type,
      isTitleSelected:newisTitleSelected
    })
  }
  //封装判断标题类型是否应该高亮的函数,返回标题高亮状态对象
  getIsTitleSelected(type,everyValue){
    const newisTitleSelected = {}
    if(type==='area' && (everyValue.length===3 || everyValue[0]==='subway')){
      newisTitleSelected[type] = true
    }else if(type==='price' && everyValue[0]!=='null'){
      newisTitleSelected[type] = true
    }else if(type==='mode' && everyValue[0]!=='null'){
      newisTitleSelected[type] = true
    }
    else if(type==='more' && everyValue.length > 0){
      newisTitleSelected[type] = true
    }else{
      newisTitleSelected[type] = false        
    }
    return newisTitleSelected
  }
  //子组件中点击取消或点击遮罩层
  //取消filterpick和遮罩层的展示,取消时也要判断当前这个标题是否应该高亮(有没有选中值)
  cancel = (type) => {
    //取消展示筛选组件时移除body的hidden类名
    this.body.remove('hidden')
    //
    const {selectedValue,isTitleSelected} = this.state
    //拿到当前type的选中值数组
    const everyValue = selectedValue[type]
    const newisTitleSelected = this.getIsTitleSelected(type,everyValue)
    this.setState({
      openType: '',
      isTitleSelected:{
        ...isTitleSelected,
        ...newisTitleSelected
      }
    })
  }
  //filterpick中确认按钮需要的方法,可取消filterpick和遮罩层的展示,并且收集选择的条件
  save = (value, type) => {
    const {isTitleSelected} = this.state
    //传入的type标题是否应该高亮(一个对象)
    const newisTitleSelected = this.getIsTitleSelected(type,value)
    //拿到传入的type的选中值数组,与原来的合并,形成最新的所有type选中值的一个对象(其中存储了所有type下的选中值数组)
    const newSelected = {
      ...this.state.selectedValue,
      [type]: value
    }


    //接口需要的查询条件对象
    const filters = {}
    //区域键
    const area = newSelected.area
    const areaKey = area[0]
    let areaValue
    if(area.length===2){
      areaValue = 'null'
    }else{
      areaValue = area[2]==='null' ? area[1] : area[2]
    }
    filters[areaKey] = areaValue
    //方式键
    filters.rentType = newSelected.mode[0]
    //价格键
    filters.price = newSelected.price[0]
    //筛选键
    filters.more = newSelected.more.join(',')
    //调用父组件传递的方法,将查询需要的对象传递过去
    this.props.Filters(filters)


    //save方法在点击确定按钮时调用,并传递来本次的type值和该类型选中的条件值数组,更新state中的这两个数据
    this.setState({
      openType: '',
      isTitleSelected:{...isTitleSelected,...newisTitleSelected},
      selectedValue: newSelected
    })
  }
  //发送请求获取所有的筛选条件(详细筛选组件中需要展示)
  async getFilterData() {
    let { value } = getLocaCity()
    let res = await Axios('/houses/condition/', {
      params: {
        id: value
      }
    })
    console.log(res);
    this.setState({
      filterData: res.data.body
    })
  }

  //判断并生成前三个标题对应的filterpick结构
  renderFilterPicker() {
    let { openType, filterData: { area, subway, rentType, price }, selectedValue } = this.state
    if (openType === 'more' || openType == "") {
      return null
    }
    //从state中结构请求到保存的各个筛选条件的数据
    let data = ''
    //根据类型返回渲染时的展示列数
    let cols = 1
    //根据标题类型从选中状态中取出对应的数组,传递给filterpick组件,让它在渲染的时候选中这些项
    let defaultValue = selectedValue[openType]
    //渲染分级筛选框的组件需要传入一个数组,对openType判断将筛选类型对应的数组传入组件去渲染
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        break;
      case 'price':
        data = price
        break;
      default:
        break;
    }
    //方式2:解决不关闭pick组件时切换走更新阶段的问题,给filterpick组件加key属性,其每次在调用时都会有不同的key属性,从而不会复用更新
    return <FilterPicker
          key={openType}
          defaultValue={defaultValue}
          type={openType}
          data={data}
          cols={cols}
          cancel={this.cancel}
          save={this.save} />
  }
  //判断生成第四个标题对应的filterpick结构
  renderFilterMore(){
    const {openType,filterData:{roomType,oriented,floor,characteristic},selectedValue} = this.state
    if(openType!=='more'){
      return null
    }
    const data = {roomType,oriented,floor,characteristic}
    const defaultValue = selectedValue['more']
    return  <FilterMore data={data} cancel={this.cancel} save={this.save} type={openType} defaultValue={defaultValue}/>
  }
  //遮罩层是否展示,并加上动画效果
  renderMask(){
    const {openType} = this.state
    //把openType是否为more或''当做一个状态来控制传入Spring组件的透明度值,
    //当状态为true时透明度为0,为false时透明度为1,这样Spring组件一直存在可以更新to的状态,旧to=>新to
    //并且在renderprops传入的函数中判断opacity的值为0时直接返回null不渲染,可避免遮罩层透明度为0时再页面中干扰其他元素点击
    const ishide =  openType==='more' || openType===''
    return (
      <Spring from={{opacity:0}} to={{opacity:ishide ? 0 : 1}}>
        {props => {
          if(props.opacity === 0){
            return null
          }
          return (
            <div style={props} className={styles.mask} onClick={this.cancel} />
          )
        }}
      </Spring>
    )
  }

  componentDidMount() {
    this.getFilterData()
    //在这获取到body元素保存起来,后面当弹出pick筛选框的时候给它加overfloow=hidden,
    this.Body = document.body
  }
  render() {

    let { isTitleSelected, openType } = this.state
    return (
      <div className={styles.root}>
          {/* 遮罩层 */}
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle isTitleSelected={isTitleSelected} click={this.changeTitleSelected} />

          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
