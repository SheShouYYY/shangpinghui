// 引入vue
import Vue from 'vue'
// 引入app组件
import App from './App.vue'
// 引入路由文件
import router from "./router/index"
// 引入Vuex的仓库
import store from "./store/index"
// 引入轮播图的css样式 因为几个地方有用到 所以写在main.js
import "swiper/css/swiper.min.css"

// 注册全局组件TypeNav 和轮播图 Carousel 还有分页器
import TypeNav from "./components/TypeNav/TypeNav.vue"
import Carousel from "./components/Carousel/Carousel.vue"
import Pagination from "./components/Pagination/Pagination.vue"
Vue.component("TypeNav", TypeNav)
Vue.component("Carousel", Carousel)
Vue.component("Pagination", Pagination)

// 引入mock文件 让他执行一遍里面的代码
import "./mock/mockServer"

// 引入所有接口函数，方便每个组件都可以使用
import * as API from "@/api/index"

// 引入图片懒加载插件 npm下载的
import VueLazyload from 'vue-lazyload'
import img from "@/assets/images/cr7.jpg"

Vue.use(VueLazyload, {
  loading: img
})


// 引入饿了么ui
import { MessageBox } from 'element-ui';
// Vue.component(MessageBox);
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$msgbox = MessageBox;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 配置router属性 router：router 简写
  router,
  // 配置store属性,这样每个组件实例对象都有$store
  store,
  beforeCreate() {
    Vue.prototype.$bus = this,
      Vue.prototype.$api = API
  }
}).$mount('#app')
