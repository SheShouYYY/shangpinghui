<template>
  <div class="pagination">
    <!-- 上一页 按钮 如果当前页数等于 1 则不能点击 , 其他情况点击按钮 返回数据,当前页数减一 -->
    <button :disabled="pageNo === 1" @click="$emit('getPagin', pageNo - 1)">
      上一页
    </button>
    <!-- 第一页的按钮，如果start大于等于2 也就是 2 - 6 才显示 -->
    <button v-if="startAndEnd.start >= 2" @click="$emit('getPagin', 1)">
      1
    </button>
    <!-- ...当start大于等于3 才显示 也就是3 - 7 -->
    <button v-if="startAndEnd.start >= 3">···</button>

    <!-- 循环start到end之间的五个数字 -->
    <button
      v-for="(num, index) in startAndEnd.arr"
      :key="index"
      @click="$emit('getPagin', num)"
      :class="{ active: num === pageNo }"
    >
      {{ num }}
    </button>

    <!-- ...按钮 当end小于等于最大页数 -2 比如最大31页 显示的就是 25 - 29 -->
    <button v-if="startAndEnd.end <= totalPage - 2">···</button>

    <!-- 总页数 -->
    <button
      v-if="startAndEnd.end !== totalPage"
      @click="$emit('getPagin', totalPage)"
      :class="{ active: totalPage === pageNo }"
    >
      {{ totalPage }}
    </button>

    <!-- 下一页 当和当前页数一样，则锁定 -->
    <button
      :disabled="pageNo === totalPage"
      @click="$emit('getPagin', pageNo + 1)"
    >
      下一页
    </button>

    <!-- 数据个数 -->
    <button style="margin-left: 30px">已为您展示 {{ total }} 条数据</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  // 父传过来的数据 1.当前页数  2.一页展示的个数  3.数据总数  4.连续显示几页的按钮
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    // 获取总页数 数据总数除以每页显示的数量 向上取整
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },

    // 计算
    startAndEnd() {
      // 这里continues是连续显示几页的按钮 这里是5
      // start等于当前页面 -2
      // end等于当前页面 +2
      let start = this.pageNo - Math.floor(this.continues / 2)
      let end = this.pageNo + Math.floor(this.continues / 2)

      // 空数组记录要遍历的数字
      let arr = []

      //判断，如果连续显示的页面比总页数都要大
      if (this.continues > this.totalPage) {
        // 则start就是第一页
        start = 1
        // end就是最大页数
        end = this.totalPage

        // 如果start小于1的话 因为不能等于0或者负数
      } else if (start < 1) {
        // start就是第一页
        start = 1
        // end就是连续页数5
        end = this.continues

        //如果end比最大页数都大
      } else if (end > this.totalPage) {
        // 比如是最大31页 则start是 31 - 5是 26 这样多了一页 所以要加1
        start = this.totalPage - this.continues + 1
        // end就是最大页数
        end = this.totalPage
      }
      // 从start到end遍历，添加到数组
      for (let i = start; i <= end; i++) {
        arr.push(i)
      }
      // 计算属性返回
      return { start, end, arr }
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
