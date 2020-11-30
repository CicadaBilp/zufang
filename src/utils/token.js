const ZF_TOKEN = 'zf_token'

export const getToken = ()=>localStorage.getItem(ZF_TOKEN)

export const setToken = (token)=>localStorage.setItem(ZF_TOKEN,token)

export const removeToken = ()=>localStorage.removeItem(ZF_TOKEN)
//判断是否登陆过
export const isLogin = ()=>!!getToken()