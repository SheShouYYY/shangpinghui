import { getShopCarList } from "@/api"
export default {
    namespaced: true,
    state: {
        // 设置空数组
        shoppingList: []
    },
    // 调用请求函数
    actions: {
        // 调用接口函数获取数据
        async getShoppingCartList({ commit }) {
            const result = await getShopCarList()
            if (result.data.code === 200) {
                commit("GETSHOPPINGLIST", result.data.data)
            }
        }
    },
    mutations: {
        // 赋值
        GETSHOPPINGLIST(state, result) {
            state.shoppingList = result
        }
    },
    getters: {
        shoppingList(state) {
            return state.shoppingList[0] || {}
        }
    }
}