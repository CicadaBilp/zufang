import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

function FilterFooter({ style, className, cancel, save ,clear}) {
  return (
    <Flex style={style} className={[styles.root, className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={cancel}
      >
        {clear}
      </span>

      {/* 确定按钮 */}
      <span className={[styles.btn, styles.ok].join(' ')} onClick={save}>
        确定
      </span>
    </Flex>
  )
}
//设置clear属性默认值为取消
FilterFooter.defaultProps = {
  clear:'取消'
}

export default FilterFooter
