import { getSearchList } from "@/api"

// 暴露 search的小仓库
export default {
    // 命名空间
    namespaced: true,
    state: {
        // 因为服务器发的数据是个对象，则默认写个空对象
        SearchList: {}
    },
    actions: {
        // 这里如果dispach没有传参数过来，默认就是空对象 因为至少传个空对象请求才能响应
        async getSearch(context, value = {}) {
            // 调用借口函数并传递参数
            const result = await getSearchList(value)
            // console.log(result)
            if (result.data.code === 200) {
                context.commit("GETSEARCH", result.data.data)
            }
        }
    },
    mutations: {
        GETSEARCH(state, value) {
            state.SearchList = value
        }
    },
    getters: {}
}