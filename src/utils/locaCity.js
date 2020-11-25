const ZF_CITY = 'zf_city'

export const getLocaCity = ()=>JSON.parse(localStorage.getItem(ZF_CITY))

export const setLocaCity = (curr)=>
  localStorage.setItem(ZF_CITY,JSON.stringify(curr))