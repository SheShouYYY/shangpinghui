// 引入axios
import axios from "axios";

// 引入进度条
import nprogress from "nprogress"; // start() 进度条开始 done() 进度条结束
import "nprogress/nprogress.css"

//  创建一个实例
const instance = axios.create({
    // 基础默认路径
    baseURL: "/mock",
    // 限时四秒
    timeout: 4000
})

// 请求拦截器
instance.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    // console.log("请求成功了", config)

    // 请求开始的时候进度条开始
    nprogress.start()

    return config
}, (err) => {
    // 对请求错误做些什么
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use((res) => {
    // 2xx 范围内的状态码都会触发该函数  对响应数据做点什么
    // console.log("成功响应了", res)

    // 响应返回成功进度条结束
    nprogress.done()

    return res
}, (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    return Promise.reject("出错", err)
})

export default instance