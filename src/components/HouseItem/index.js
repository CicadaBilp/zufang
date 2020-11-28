import React from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'

const HouseItem = ({houseImg,title,desc,tags,price,click,style}) => {
  return (
    <div className={styles.house} onClick={click} style={style}>
      <div className={styles.imgWrap}>
        <img
          className={styles.img}
          src={`${houseImg}`}
          alt=""
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}> {desc} </div>
        <div>
          {
            tags.map((item2, index) => {
              let toggleClass = `tag${index > 2 ? index % 2 + 1 : index + 1}`
              return (
                <span key={index} className={[styles.tag, styles[toggleClass]].join(' ')}>
                  {item2}
                </span>
              )
            })
          }
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}> {price} </span> 元/月
          </div>
      </div>
    </div>
  )
}
HouseItem.propTypes = {
  houseImg:PropTypes.string.isRequired,
  title:PropTypes.string.isRequired,
  desc:PropTypes.string.isRequired,
  tags:PropTypes.array.isRequired,
  price:PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
  click:PropTypes.func.isRequired
}


export default HouseItem