import React from 'react'
import {withRouter} from 'react-router-dom'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import PropTypes from 'prop-types'

//封装函数组件,通过高阶组件后,解构传入的props对象(城市名,路由信息),和传入的className属性,
function SearchHeader({cityName,history,className}) {
  return (
    <Flex className={[styles.search,className].join(' ')}>
      <Flex className={styles.left}>
        <div className={styles.path} onClick={() => history.push('/citylist')}>
          <span> {cityName} </span>
          <i className="iconfont icon-arrow"></i>
        </div>
        <div className={styles.leftSearch} onClick={() => history.push('/search')}>
          <i className="iconfont icon-seach"></i>
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => history.push('/map')}></i>
    </Flex>
  )
}

//组件属性的默认值
SearchHeader.defaultProps = {
  className:''
}
//组件的属性校验规则
SearchHeader.propTypes = {
  cityName:PropTypes.string.isRequired,
  className:PropTypes.string
}


export default withRouter(SearchHeader)