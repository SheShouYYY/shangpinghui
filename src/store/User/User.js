import { getUserCode, getRegister, getUserLogin, getUserInfo, getUserLogout } from "@/api"
import { sendToken, getToken, removeToken } from "@/utils/token"
export default {
    namespaced: true,
    state: {
        code: '',
        // token的默认值就是调用函数的返回值 也就是本地存储的token 如果没有登陆就是null
        token: getToken(),
        userInfo: {}
    },
    actions: {
        // 获取验证码
        async getServeCode({ commit }, phone) {
            let result = await getUserCode(phone)
            if (result.data.code === 200) {
                commit("GETUSERCODE", result.data.data)
                return "ok"
            } else {
                return Promise.reject(new Error("错误"))
            }
        },

        // 注册完毕 data是传过来的数据，是一个对象
        async register({ commit }, data) {
            let result = await getRegister(data)
            if (result.data.code === 200) {
                return 'ok'
            } else {
                // 传递错误信息
                return Promise.reject(new Error(result.data.message))
            }
        },

        // 登陆按钮请求 data是一个对象，是数据
        async getLogin({ commit }, data) {
            let result = await getUserLogin(data)
            // 用户登陆成功
            if (result.data.code === 200) {
                // 存储token
                commit("GETLOGIN", result.data.data.token)
                // 调用函数，本地也存储一个token
                sendToken(result.data.data.token)
                return 'ok'
            } else {
                // 返回错误信息
                return Promise.reject(new Error(result.data.message))
            }
        },

        // 获取用户信息接口
        async getInfo({ commit, dispatch }) {
            let result = await getUserInfo()
            // 获取成功返回数据
            if (result.data.code === 200) {
                commit('GETINFO', result.data.data)
            } else {
                // 失败了因为token失效让他相当于退出登录，token全部删掉
                dispatch('getLogout')
            }
        },

        // 退出登陆
        async getLogout({ commit }) {
            // 这里只是通知服务器清除token
            let result = await getUserLogout()
            // 但是还要清除本地的
            if (result.data.code === 200) {
                commit('CLEARINFO')
                return 'ok'
            } else {
                return Promise.reject(new Error("退出失败"));
            }
        }
    },
    mutations: {
        GETUSERCODE(state, code) {
            state.code = code
        },
        GETLOGIN(state, token) {
            // token重新赋值
            state.token = token
        },
        GETINFO(state, userInfo) {
            state.userInfo = userInfo
        },
        CLEARINFO(state) {
            // 删除仓库数据
            state.userInfo = ''
            state.token = ''
            // 删除本地token
            removeToken()
        }
    },
    getters: {

    }
}