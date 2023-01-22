<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Tbody></Tbody>
    <Rank></Rank>
    <Like></Like>
    <!-- 循环 -->
    <Floor v-for="item in FloorList" :key="item.id" :list="item"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from './ListContainer/ListContainer.vue'
import Today from './Today/Today.vue'
import Rank from './Rank/Rank.vue'
import Like from './Like/Like.vue'
import Floor from './Floor/Floor.vue'
import Brand from './Brand/Brand.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      arr: undefined
    }
  },
  components: { ListContainer, Today, Rank, Like, Floor, Brand },
  mounted() {
    // 在这里调用dispach，因为floor要根据这些数据循环
    this.$store.dispatch('Home/getFloor')
  },
  computed: {
    // 获取数据
    ...mapState('Home', ['FloorList'])
  }
}
</script>

<style>
</style>