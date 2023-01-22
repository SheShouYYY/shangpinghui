// 引入路由组件
// import Home from "../pages/Home/Home.vue"
// import Login from "../pages/Login/Login.vue"
// import Register from "../pages/Register/Register.vue"
// import Search from "../pages/Search/Search.vue"
// import Detail from "../pages/Detail/Detail.vue"
// import AddCartSuccess from "../pages/AddCartSuccess/AddCartSuccess.vue"
// import ShopCart from "../pages/ShopCart/ShopCart.vue"
// import Trade from "../pages/Trade/Trade.vue"
// import Pay from "../pages/Pay/Pay.vue"
// import PaySuccess from "../pages/PaySuccess/PaySuccess.vue"
// import Center from "../pages/Center/Center.vue"
// import MyOrder from "../pages/Center/MyOrder/MyOrder.vue"
// import GroupOrder from "../pages/Center/GroupOrder/GroupOrder.vue"

// 使用路由懒加载，就不用上面这些引入了
export default [
    // 配置规则
    {
        // 路径
        path: "/home",
        // 跳转显示的组件
        component: () => import('@/pages/Home/Home.vue'),
        // 配置元信息，在app中，判断要不要渲染footer
        meta: { isShow: true }
    },
    {
        path: "/login",
        component: () => import('@/pages/Login/Login.vue'),
        meta: { isShow: false }
    },
    {
        path: "/register",
        component: () => import('../pages/Register/Register.vue'),
        meta: { isShow: false }
    },
    {
        name: "search",
        path: '/search/:keyword?',
        component: () => import('../pages/Search/Search.vue'),
        meta: { isShow: true }
    },
    // 此处是重定向。访问根目录时，跳转/home
    {
        path: "/",
        redirect: "/home"
    },
    {
        name: "detail",
        path: "/detail/:id",
        component: () => import('../pages/Detail/Detail.vue'),
        meta: { isShow: true }
    },
    {
        path: '/addcartsuccess',
        component: () => import('../pages/AddCartSuccess/AddCartSuccess.vue'),
        meta: { isShow: true }
    },
    {
        path: '/shopcart',
        component: () => import('../pages/ShopCart/ShopCart.vue'),
        meta: { isShow: true }
    },
    {
        path: '/trade',
        component: () => import('../pages/Trade/Trade.vue'),
        meta: { isShow: true }
    },
    {
        path: '/pay',
        component: () => import('../pages/Pay/Pay.vue'),
        meta: { isShow: true },
        beforeEnter: (to, from, next) => {
            // 当从trade页面过来，才能跳转，或者在自己页面刷新
            if (from.path === '/trade' || from.path === '/') {
                next()
            } else {
                // 否则回去
                next(false)
            }
        }
    },
    {
        path: '/paysuccess',
        component: () => import('../pages/PaySuccess/PaySuccess.vue'),
        meta: { isShow: true },
        beforeEnter: (to, from, next) => {
            if (from.path === '/pay' || from.path === '/') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: '/center',
        redirect: '/center/myorder',
        component: () => import('../pages/Center/Center.vue'),
        meta: { isShow: true },
        children: [
            {
                path: 'myorder',
                component: () => import('../pages/Center/MyOrder/MyOrder.vue'),
                meta: { isShow: true },
            },
            {
                path: "grouporder",
                component: () => import('../pages/Center/GroupOrder/GroupOrder.vue'),
                meta: { isShow: true },
            }
        ]
    },
]