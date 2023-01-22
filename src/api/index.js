// 引入axios实例对象
import request from "./request";
import mockRequest from "./mockAjax"

// 三级分类请求 (为什么要写成函数？ 假如很多地方都会用到这个请求，则以后修改不便，直接写成函数，然后暴露)
export const getCategoryList = () => {
    // 要返回出去 axios发请求返回的是对象
    return request({
        // 这里的url不需要写api，因为baseURL已经配置
        url: "/product/getBaseCategoryList",
        method: "get"
    })
}

// 获取轮播图的数据的接口
export const getBannerList = () => {
    return mockRequest({
        // 地址
        url: "/banner",
        method: "get"
    })
}

// 获取floor的数据 (简写)
export const getFloorList = () => mockRequest.get("/floor")

// 获取搜索页的数据 因为请求的时候得携带参数 这里接受一下 而且至少得传一个对象
export const getSearchList = (params) => {
    return request({
        url: "/list",
        method: "post",
        data: params
    })
}

// 获取详情页的数据 发送请求携带id id是dispach的时候传入
export const getDetailList = (id) => {
    return request({
        url: `/item/${id}`,
        method: "get"
    })
}

// 请求购物车接口或修改 是否成功
export const getShopCar = (skuId, skuNum) => request({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })

// 购物车列表接口
export const getShopCarList = () => request({ url: "/cart/cartList", method: "get" })

// 购物车勾选修改接口
export const ChangeisChecked = (skuId, isChecked) => request({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: "get" })

// 删除购物车接口
export const deleteCartList = (skuId) => request({ url: `/cart/deleteCart/${skuId}`, method: 'delete' })

// 获取验证码接口
export const getUserCode = (phone) => request({ url: `/user/passport/sendCode/${phone}`, method: 'get' })

// 注册完毕接口 data是调用函数传来的数据 是一个对象 名字一样，简写
export const getRegister = (data) => request({ url: '/user/passport/register', method: 'post', data })

// 登陆接口
export const getUserLogin = (data) => request({ url: '/user/passport/login', data, method: 'post' })

// 获取用户信息接口 比如展示名字
export const getUserInfo = () => request({ url: '/user/passport/auth/getUserInfo', method: 'get' })

// 退出登陆
export const getUserLogout = () => request({ url: '/user/passport/logout', method: "get" })

// 获取用户收件
export const getUserAddressList = () => mockRequest({ url: '/address', method: 'get' })

// 获取交易信息
export const getUserTradeList = () => request({ url: '/order/auth/trade', method: 'get' })

// 提交订单
export const getUserSubpay = (tradeNo, data) => request({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'post' })

// 获取订单信息
export const getPayInfo = (orderId) => request({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' })

// 订单支付状态
export const getOrderPay = (orderId) => request({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' })

// 我的订单列表
export const getMyOrderList = (page, limit) => request({ url: `/order/auth/${page}/${limit}`, method: 'get' })

