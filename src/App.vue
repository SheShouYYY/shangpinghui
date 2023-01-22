<template>
  <div>
    <MyHeader></MyHeader>
    <router-view></router-view>
    <!-- 判断要不要展示footer -->
    <MyFooter v-show="$route.meta.isShow"></MyFooter>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader/MyHeader.vue'
import MyFooter from './components/MyFooter/MyFooter.vue'
export default {
  name: 'App',
  components: {
    MyHeader,
    MyFooter
  },
  mounted() {
    // 因为app的mounted只会触发一次，避免多次请求，所以写在app
    // 挂载完毕调用actions函数发请求 Home名字的 actions名字叫getList
    this.$store.dispatch('Home/getList')
  }
}
</script>

<style>
</style>
