// 引入Vue 因为要ues
// 引入仓库获取token和数据
import store from "@/store";
import Vue from "vue";

// 引入路由 需要npm i vue-router@3 下载 （vue2版本使用3 vue3版本使用4）
import VueRouter from 'vue-router'

// 引入封装的配置对象
import routes from "./routes";

// use使用插件
Vue.use(VueRouter)

// 这里是防止连续跳转出现红色报错
// 获取原型对象push函数
const originalPush = VueRouter.prototype.push
// 获取原型对象replace函数
const originalReplace = VueRouter.prototype.replace
// 修改原型对象中的push函数
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 修改原型对象中的replace函数
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

// 创建实例对象
const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 跳转始终滚动到顶部
        return { y: 0 }
    },
})

// 全局路由前置守卫 to是去，from从哪来，next是下一步
router.beforeEach((to, from, next) => {
    // 获取token
    let token = store.state.User.token
    // 获取用户信息里面的name 因为默认是空对象，永远是true 所以选一个值
    let name = store.state.User.userInfo.name
    // 如果有token，就是登入了
    if (token) {
        // 如果登陆还去登陆页面
        if (to.path === '/login') {
            // 返回首页
            next('/home')
        } else {
            // 如果登陆了不去登陆页面 如果有名字，登陆状态就会显示
            if (name) {
                // 直接下一步
                next()
            } else {
                // 如果没有名字，登陆状态不会显示
                // 调用请求获取用户信息
                store.dispatch('User/getInfo')
                next()
            }
        }
    } else {
        // 如果没登陆。直接下一步
        let toPath = to.path
        // 如果去订单中心或者购物车或者支付页面
        let result = toPath.indexOf('/center') !== -1 || toPath.indexOf('/shopcart') !== -1 || toPath.indexOf('/trade') !== -1 || toPath.indexOf('/pay') !== -1
        if (result) {
            // 让他登陆
            alert('请您先登陆')
            router.push(`/login?r=${toPath}`)
        } else {
            // 其他的不管
            next()
        }
    }
})

// 暴露对象
export default router