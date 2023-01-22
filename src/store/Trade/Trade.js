import { getUserAddressList, getUserTradeList } from "@/api"
export default {
    namespaced: true,
    state: {
        // 用户收件地址默认值 数组
        userAddress: [],
        userTrade: {}
    },
    actions: {
        // 获取用户收件地址
        async getUserAddress({ commit }) {
            let result = await getUserAddressList()
            // 为200则添加
            if (result.data.code === 200) {
                commit('GETUSERADDRESS', result.data.data)
                return 'ok'
            } else {
                Promise.reject(new Error("获取地址失败"))
            }
        },
        // 获取商品列表
        async getUserTrade({ commit }) {
            let result = await getUserTradeList()
            if (result.data.code === 200) {
                commit('GETUSERTRADE', result.data.data)
                return 'ok'
            } else {
                alert("未登录")
                Promise.reject(new Error("获取列表失败"))
            }
        }
    },
    mutations: {
        GETUSERADDRESS(state, address) {
            state.userAddress = address
        },
        GETUSERTRADE(state, trade) {
            state.userTrade = trade
        }
    },
    getters: {

    }
}