import React from 'react'
import {Flex} from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import styles from './index.module.scss'

export default class HouseList extends React.Component {
  state = {
    num:12
  }
  render() {
    return (
      <div className={styles.houseList}>
        <Flex className={styles.houseListHeader}>
          <i className="iconfont icon-back" onClick={()=>this.props.history.go(-1)}></i>
          <SearchHeader cityName="上海" className={styles.houseListSearch}></SearchHeader>
        </Flex>
      </div>
    )
  }
}