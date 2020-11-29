import React from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'

class Sticky extends React.Component{
  //给this添加两个属性,值为ref对象
  contentRef = React.createRef()
  placeholdRef = React.createRef()

  //页面滚动的处理函数
  handleScroll = ()=>{
    //从属性中拿到外界传入的要吸顶元素的高度
    const {height} = this.props
    //从ref对象中拿到两个dom元素
    const placeholdEle = this.placeholdRef.current
    const contentEle = this.contentRef.current
    //调用占位元素的方法获取它的top值
    let {top} = placeholdEle.getBoundingClientRect()
    //因为占位元素现在宽高为0在组件元素上方,判断它的top值是否<0,表示组件元素到达顶部需要开启吸顶
    if(top < 0){
      placeholdEle.style.height = `${height}px`
      contentEle.classList.add(styles.fixed)
    }else{
      placeholdEle.style.height = '0px'
      contentEle.classList.remove(styles.fixed)
    }
  }
  //监听浏览器滚动事件
  componentDidMount(){
    window.addEventListener('scroll',this.handleScroll)
  }
  //组件卸载时销毁监听事件
  componentWillUnmount(){
    window.removeEventListener('scroll',this.handleScroll)
  }


  render(){
    return (
      <div>
        {/* 上面组件吸顶后的占位元素 */}
        <div ref={this.placeholdRef}></div>
        {/* 渲染需要贴顶的组件/元素 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </div>
      
    )
  }
}

Sticky.propTypes = {
  height:PropTypes.number.isRequired,
  children:PropTypes.element.isRequired
}


export default Sticky