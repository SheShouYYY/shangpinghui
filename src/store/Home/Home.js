// 暴露 home的小仓库

// 引入调用List数据接口的函数
import { getCategoryList, getBannerList, getFloorList } from "@/api/index"

export default {
    // 命名空间
    namespaced: true,
    state: {
        CategoryList: [],
        BannerList: [],
        FloorList: []
    },
    actions: {
        // 获取到的第一个参数是vue自带的 能调用commit这些方法 第二个参数是你传过来的值
        async getList(context) {
            // 用await函数返回值可以直接获取到，相当于then了
            const result = await getCategoryList()
            // 如果code码等于两百就调用commit，并且返回数据
            if (result.data.code === 200) {
                // GETLIST是mutations的名，后面是传的数据
                context.commit("GETLIST", result.data.data)
            } else {
                console.log("请求失败")
            }
        },
        // banner
        async getBanner(context) {
            const result = await getBannerList()
            if (result.data.code === 200) {
                context.commit("GETBANNER", result.data.data)
            }
        },
        // floor
        async getFloor(context) {
            const result = await getFloorList()
            if (result.data.code === 200) {
                context.commit("GETFLOOR", result.data.data)
            }
        }
    },
    mutations: {
        // 获取到的第一个参数是vue自带的 能调用commit这些方法 第二个参数是你传过来的值,或者是actions传的值
        GETLIST(context, value) {
            context.CategoryList = value
        },
        GETBANNER(context, value) {
            context.BannerList = value
        },
        GETFLOOR(context, value) {
            context.FloorList = value
        }
    },
    getters: {

    }
}