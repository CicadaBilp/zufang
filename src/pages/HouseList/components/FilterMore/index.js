import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    //保存所有选中的标签的value值
    selectedValue: this.props.defaultValue
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const {selectedValue} = this.state
      const isSelected = selectedValue.indexOf(item.value) > -1

      return (
        <span onClick={() => { this.handleClick(item.value) }} 
              key={item.value} 
              className={[styles.tag,isSelected ? styles.tagActive : ''].join(' ')}
        >
        {item.label}
        </span>
      )
    })
  }
  //点击每个标签后处理函数
  handleClick(id) {
    let { selectedValue } = this.state
    //对于数组引用类型,要修改状态需要创建新数组
    let newSelectedValue = [...selectedValue]
    if (selectedValue.indexOf(id) > -1) {
      newSelectedValue = selectedValue.filter(item => item !== id)
    } else {
      newSelectedValue.push(id)
    }

    this.setState({
      selectedValue: newSelectedValue
    })
    console.log(newSelectedValue)
  }

  render() {
    const { data: { roomType, oriented, floor, characteristic },save,type,cancel } = this.props
    const {selectedValue} = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={()=>cancel(type)}/>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} clear={'清除'} 
          cancel={()=>this.setState({selectedValue:[]})}
          save={()=>save(selectedValue,type)}
        />
      </div>
    )
  }
}
