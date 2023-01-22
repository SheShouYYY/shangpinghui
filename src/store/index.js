// 引入vue
// 引入vue
import Vue from "vue"
// 引入vuex
import Vuex from "vuex"
// 使用
Vue.use(Vuex)

// 引入模块
import Home from "./Home/Home"
import Search from "./Search/Search"
import Detail from "./Detail/Detail"
import ShoppingCart from "./ShoppingCart/ShoppingCart"
import User from "./User/User"
import Trade from "./Trade/Trade"

// 创建实例
const store = new Vuex.Store({
    // 引入模块
    modules: {
        Home,
        Search,
        Detail,
        ShoppingCart,
        User,
        Trade
    }
})

export default store