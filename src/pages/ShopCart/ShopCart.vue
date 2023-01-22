<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="item in cartInfoList" :key="item.skuId">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="item.isChecked === 1"
              @change="changeChecked($event, item)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl" />
            <div class="item-msg">
              {{ item.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ item.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:;"
              class="mins"
              @click="changeSkuNum('minus', -1, item)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="item.skuNum"
              minnum="1"
              class="itxt"
              @change="changeSkuNum('inValue', $event.target.value * 1, item)"
            />
            <a
              href="javascript:;"
              class="plus"
              @click="changeSkuNum('add', 1, item)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ item.skuNum * item.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <div>
              <a
                href="javascript:;"
                class="sindelet"
                @click="deleteCart(item.skuId)"
                >删除</a
              >
            </div>
            <br />
            <a href="javascript:;">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllchecked && cartInfoList.length > 0"
          @change="changeAllBtn"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:;" @click="deleteChecked">删除选中的商品</a>
        <a href="javascript:;">移到我的关注</a>
        <a href="javascript:;">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ allPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" href="javascript:;" to="/trade"
            >结算</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入修改选中状态的接口和删除购物车接口
import { ChangeisChecked, deleteCartList } from '@/api/index'
// 引入lodash 节流函数
import throttle from 'lodash/throttle'
export default {
  name: 'ShopCart',
  mounted() {
    // 调用请求
    this.getDispach()
  },
  computed: {
    // 获取仓库的数据
    ...mapGetters('ShoppingCart', ['shoppingList']),
    cartInfoList() {
      return this.shoppingList.cartInfoList || []
    },
    // 全选按钮如果全为1自动选中`
    isAllchecked() {
      return this.cartInfoList.every((item) => item.isChecked === 1)
    },
    // 总价
    allPrice() {
      let result = 0
      this.cartInfoList.forEach((element) => {
        result += element.skuPrice * element.skuNum
      })
      return result
    }
  },
  methods: {
    // 封装请求获取数据
    getDispach() {
      this.$store.dispatch('ShoppingCart/getShoppingCartList')
    },

    // 改变复选框的状态 获取事件对象和item数组
    async changeChecked(event, item) {
      // 选中了就是true返回1，反之0
      let isChecked = event.target.checked ? '1' : '0'
      // 发送请求
      const result = await ChangeisChecked(item.skuId, isChecked)
      if (result.data.code === 200) {
        this.getDispach()
      } else {
        throw new Error('报错啦')
      }
    },

    // 全选框状态
    changeAllBtn() {
      // 如果当前全选状态是选中的
      if (this.isAllchecked) {
        // 点击完就是取消全选 就遍历全部的数组改为0
        this.cartInfoList.forEach(async (ele) => {
          const result = await ChangeisChecked(ele.skuId, 0)
          // 是200就重新渲染
          if (result.data.code === 200) {
            this.getDispach()
          }
        })
        // 这时候当前状态不是全选
      } else {
        // 点击完就是全选 就遍历全部的数组改为1
        this.cartInfoList.forEach(async (ele) => {
          const result = await ChangeisChecked(ele.skuId, 1)
          // 是200就重新渲染
          if (result.data.code === 200) {
            this.getDispach()
          }
        })
      }
    },

    // 修改商品数量 minus的value是-1，add是1，input的是当前输入的value
    // 设置一个节流函数以防点击过快
    changeSkuNum: throttle(async function (flag, value, item) {
      // 如果点击的是减
      if (flag === 'minus') {
        // 如果item的数量大于1 value就是-1 不然就是0
        value = item.skuNum > 1 ? -1 : 0
      }

      // 如果点击的是加
      if (flag === 'add') {
        value = 1
      }

      // 如果是输入框
      if (flag === 'inValue') {
        // 如果是nan或者小于1，则不动
        if (isNaN(value) || value < 1) {
          value = 0
          // 正常情况，最新整数减去之前的数量
        } else {
          value = Math.floor(value) - item.skuNum
        }
      }

      try {
        // 调用借口渲染页面
        await this.$store.dispatch('Detail/addShopCarSuccess', {
          skuId: item.skuId,
          skuNum: value
        })
        this.getDispach()
      } catch (error) {
        console.log(error)
      }
    }, 500),

    // 删除购物车商品
    async deleteCart(skuId) {
      if (confirm('您要删除这个商品吗？')) {
        // 调用接口函数
        const result = await deleteCartList(skuId)
        if (result.data.code === 200) {
          this.getDispach()
        } else {
          throw new Error('报错啦')
        }
      }
    },

    // 删除选中的商品
    deleteChecked() {
      // 执行操作之前确认一下
      if (confirm('您要删除您所选中的商品吗')) {
        // 过滤所有数组里面选中的 也就是isChecked为1的
        const result = this.cartInfoList.filter((item) => {
          return item.isChecked === 1
        })
        // 然后再循环上面的数组删除
        result.forEach(async (ele) => {
          const del = await deleteCartList(ele.skuId)
          if (del.data.code === 200) {
            this.getDispach()
          } else {
            throw new Error('报错啦')
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 15%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 35%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            // display: block;
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>