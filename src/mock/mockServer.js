import Mock from "mockjs"

// 图片 json 格式的文件是默认暴露 可以直接引入
import banner from "./banner.json"
import floor from "./floor.json"
import userAddress from "./userAddress.json"

// 提供模拟广告位轮播数据的接口 (第一个参数是请求的地址，第二个是数据)
Mock.mock("/mock/banner", {
    code: 200,
    data: banner
})

// 提供模拟楼层数据的接口
Mock.mock("/mock/floor", {
    code: 200,
    data: floor
})

// 提供用户收件信息
Mock.mock("/mock/address", {
    code: 200,
    data: userAddress
})
