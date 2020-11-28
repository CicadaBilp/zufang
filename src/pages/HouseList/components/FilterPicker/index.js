import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'



export default class FilterPicker extends Component {
  state = {
    //从props中拿到父组件传递来的该类型条件的默认选中值数组,赋值给value(绑定着选择器的value控制其展示)
    value:this.props.defaultValue
  }
  //给pickview组件绑定onchange事件将选择的值与状态同步,管理这个选择器,
  changePick = (val)=>{
    this.setState({
      value:val
    })
  }
  // //方式1:默认下,在不关闭filterpick组件时点击上方title组件切换展示时,其实是filterpick组件走的更新阶段,
  // //并不会再更新value值了,所以可以在更新的钩子函数中判断更新前后type值,再去更新一下value
  // componentDidUpdate(prevProps){
  //   if(prevProps.type !== this.props.type){
  //     this.setState({
  //       value:this.props.defaultValue
  //     })
  //   }
  // }
  render() {
    const {cancel,save,data,cols,type} = this.props
    const {value} = this.state
    return (
      <>
        {/* 选择器组件： data表示pickerview组件需要的数组数据*/}
        <PickerView data={data} onChange={this.changePick} value={value} cols={cols} />

        {/* 底部按钮 */}
        <FilterFooter cancel={()=>cancel(type)} save={()=>save(value,type)}/>
      </>
    )
  }
}
