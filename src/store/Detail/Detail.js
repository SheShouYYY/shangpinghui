// 引入获取detail接口函数
import { getDetailList, getShopCar } from "@/api"
import { getUUid } from "@/utils/UUid"
export default {
    namespaced: true,
    state: {
        detailList: {},
        // id等于调用uuid文件函数
        user_token: getUUid()
    },
    actions: {
        // 获取传入的id之后，再调用发送请求的函数传入id
        async getDetail(context, id) {
            const result = await getDetailList(id)
            // 判断成功返回则调用commit处理，传入数据
            if (result.data.code === 200) {
                context.commit('GETDETAIL', result.data.data)
            }
        },
        // 被调用的函数，参数是用户传进来的
        async addShopCarSuccess({ commit }, { skuId, skuNum }) {
            // 调用接口函数
            let result = await getShopCar(skuId, skuNum)
            // 如果成功没有异常则正常返回
            if (result.data.code === 200) {
                return "成功"
                // 异常则会出现错误，那边就不会执行
            } else {
                throw new Error("错了")
            }
        }
    },
    mutations: {
        // 存储数据
        GETDETAIL(context, data) {
            context.detailList = data
        }
    },
    getters: {
        //  简化获取数据的操作 就不用一直 ... ,以防数据时机的问题没有获取到 如果是没有则返回空对象/数组
        categoryView(state) {
            return state.detailList.categoryView || {}
        },
        skuInfo(state) {
            return state.detailList.skuInfo || {}
        },
        spuSaleAttrList(state) {
            return state.detailList.spuSaleAttrList || []
        }
    }
}