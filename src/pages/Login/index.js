import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { withFormik } from 'formik'
import { Link } from 'react-router-dom'
//导入表单校验包
import * as Yup from 'yup'

import NavHeader from '../../components/NavHeader'
import { Axios, setToken } from '../../utils'

import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  render() {
    //高阶组件会传递过来values对象其中属性就是对各个表单值管理的状态,
    //handleChange是所有表单的change事件处理函数,统一到一个函数中
    //handleSubmit是表单提交的处理函数
    const { values, handleSubmit, handleChange, errors, touched, handleBlur } = this.props

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                value={values.username}
                onChange={handleChange}
                className={styles.input}
                onBlur={handleBlur}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 组件会接收到外部传入的handleBlur表示表单失去焦点的处理函数,touched是否访问过,当失去焦点后touched变为true,errors为验证的错误信息对象 */}
            {touched.username && errors.username && (<div className={styles.error}>{errors.username}</div>)}

            <div className={styles.formItem}>
              <input
                value={values.password}
                onChange={handleChange}
                className={styles.input}
                onBlur={handleBlur}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {touched.password && errors.password && (<div className={styles.error}>{errors.password}</div>)}

            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

//使用withformik高阶组件
//一个配置对象,mapPropsToValues表示初始化状态值相当于原始的state中写管理表单数据的状态
//handleSubmit表示表单提交的处理函数,
Login = withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }),
  //当表单被提交时触发该函数,可接收到此时的表单值,再发请求确认登录状态
  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    let res = await Axios.post('/user/login', {
      username, password
    })
    console.log(res);
    const { status, description, body: { token } } = res.data
    if (status === 200) {
      setToken(token)
      props.history.go(-1)
    } else {
      Toast.info(description, 2, null, false)
    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '用户名长度为5`8位的数字,字母,下划线')
    , password: Yup.string().required('密码为必填项').matches(REG_UNAME, '密码长度为5`12位的数字,字母,下划线')
  })
})(Login)

export default Login
