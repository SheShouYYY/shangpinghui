<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
      <div class="address clearFix" v-for="item in userAddress" :key="item.id">
        <span class="username" :class="{ selected: item.isChecked === '1' }">{{
          item.consignnee
        }}</span>
        <p @click="changeIsChecked(item, userAddress)">
          <span class="s1">地址：{{ item.fullAddress }}</span>
          <span class="s2">电话号码：{{ item.phoneNum }}</span>
          <span class="s3" v-show="item.isDefault === '1'">默认地址</span>
        </p>
      </div>
      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left: 5px">货到付款</span>
      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
        <ul
          class="list clearFix"
          v-for="item in userTrade.detailArrayList"
          :key="item.skuId"
        >
          <li>
            <img :src="item.imgUrl" alt="" />
          </li>
          <li>
            <p>
              {{ item.skuName }}
            </p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>{{ item.orderPrice }}</h3>
          </li>
          <li>
            <p class="num">{{ item.skuNum }}</p>
          </li>
          <li><p class="have">有货</p></li>
        </ul>
      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea
          placeholder="建议留言前先与商家沟通确认"
          class="remarks-cont"
          v-model="orderComment"
        ></textarea>
      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b
            ><i>{{ userTrade.length }}</i
            >件商品，总商品金额</b
          >
          <span>¥{{ totalPrice }}</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">
        应付金额:　<span>¥{{ totalPrice }}</span>
      </div>
      <div class="receiveInfo">
        寄送至:
        <span>{{ address.fullAddress }}</span>
        收货人:<span>{{ address.consignnee }}</span> 电话:<span>{{
          address.phoneNum
        }}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <a href="javascript:;" class="subBtn" @click="subPay">提交订单</a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Trade',
  data() {
    return {
      // 用户留言
      orderComment: '',
      // 订单编号
      orderNum: ''
    }
  },
  mounted() {
    // 发送获取收件地址请求
    this.$store.dispatch('Trade/getUserAddress')
    // 发送获取商品列表请求
    this.$store.dispatch('Trade/getUserTrade')
  },
  computed: {
    // 获取仓库的数据
    ...mapState('Trade', ['userAddress', 'userTrade']),

    // 总价
    totalPrice() {
      let result = 0
      // 如果有这个数据才遍历 以防红色报错
      if (this.userTrade.detailArrayList) {
        this.userTrade.detailArrayList.forEach((element) => {
          result += element.orderPrice * element.skuNum
        })
        return result
      }
    },

    // 最终显示地址
    address() {
      return this.userAddress.find((item) => item.isChecked === '1') || {}
    }
  },
  methods: {
    // 改变选择的状态
    changeIsChecked(item, userAddress) {
      // 把所有变成0
      userAddress.forEach((element) => {
        element.isChecked = '0'
      })
      // 选中的变成1
      item.isChecked = '1'
    },

    async subPay() {
      // 参数 编号
      let tradeNo = this.userTrade.tradeNo
      // 要传的数据
      let data = {
        // 最终的收件地址 姓名，电话....
        consignee: this.address.consignee,
        consigneeTel: this.address.phoneNum,
        deliveryAddress: this.address.fullAddress,
        paymentWay: 'ONLINE',
        orderComment: this.orderComment,
        orderDetailList: this.userTrade.detailArrayList
      }
      let result = await this.$api.getUserSubpay(tradeNo, data)

      // 请求成功，存入订单编号，跳转路由，携带订单编号过去，下一个组件发请求要用
      if (result.data.code === 200) {
        this.orderNum = result.data.data
        this.$router.push(`/pay?orderId=${this.orderNum}`)
      } else {
        throw new Error('错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.trade-container {
  .title {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 21px;
  }

  .content {
    width: 1200px;
    margin: 10px auto 0;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    box-sizing: border-box;

    .receive,
    .pay {
      line-height: 36px;
      margin: 18px 0;
    }

    .address {
      padding-left: 20px;
      margin-bottom: 15px;

      .username {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        position: relative;
      }

      .username::after {
        content: '';
        display: none;
        width: 13px;
        height: 13px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url(./images/choosed.png) no-repeat;
      }

      .username.selected {
        border-color: #e1251b;
      }

      .username.selected::after {
        display: block;
      }

      p {
        width: 610px;
        float: left;
        line-height: 30px;
        margin-left: 10px;
        padding-left: 5px;
        cursor: pointer;

        .s1 {
          float: left;
          padding-right: 20px;
        }

        .s2 {
          float: left;
          margin: 0 5px;
        }

        .s3 {
          float: left;
          width: 56px;
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          background-color: #878787;
          color: #fff;
          margin-top: 3px;
          text-align: center;
        }
      }

      p:hover {
        background-color: #ddd;
      }
    }

    .line {
      height: 1px;
      background-color: #ddd;
    }

    .way {
      width: 1080px;
      height: 110px;
      background: #f4f4f4;
      padding: 15px;
      margin: 0 auto;

      h5 {
        line-height: 50px;
      }

      .info {
        margin-top: 20px;

        .s1 {
          float: left;
          border: 1px solid #ddd;
          width: 120px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-right: 10px;
        }

        p {
          line-height: 30px;
        }
      }
    }

    .detail {
      width: 1080px;

      background: #feedef;
      padding: 15px;
      margin: 2px auto 0;

      h5 {
        line-height: 50px;
      }

      .list {
        display: flex;
        justify-content: space-around;

        li {
          // width: 200px;
          flex: 1;
          line-height: 30px;

          p {
            margin-bottom: 5px;
          }

          h4 {
            color: #c81623;
            font-weight: 400;
          }

          h3 {
            text-align: center;
            color: #e12228;
          }

          img {
            width: 100px;
            height: 100px;
          }
        }

        .num {
          text-align: center;
        }

        .have {
          text-align: center;
        }
      }
    }

    .bbs {
      margin-bottom: 15px;

      h5 {
        line-height: 50px;
      }

      textarea {
        width: 100%;
        border-color: #e4e2e2;
        line-height: 1.8;
        outline: none;
        resize: none;
      }
    }

    .bill {
      h5 {
        line-height: 50px;
      }

      div {
        padding-left: 15px;
      }
    }
  }

  .money {
    width: 1200px;
    margin: 20px auto;

    ul {
      width: 220px;
      float: right;

      li {
        line-height: 30px;
        display: flex;
        justify-content: space-between;

        i {
          color: red;
        }
      }
    }
  }

  .trade {
    box-sizing: border-box;
    width: 1200px;
    padding: 10px;
    margin: 10px auto;
    text-align: right;
    background-color: #f4f4f4;
    border: 1px solid #ddd;

    div {
      line-height: 30px;
    }

    .price span {
      color: #e12228;
      font-weight: 700;
      font-size: 14px;
    }

    .receiveInfo {
      color: #999;

      span {
        padding-right: 20px;
      }
    }
  }

  .sub {
    width: 1200px;
    margin: 0 auto 10px;

    .subBtn {
      float: right;
      width: 164px;
      height: 56px;
      font: 700 18px '微软雅黑';
      line-height: 56px;
      text-align: center;
      color: #fff;
      background-color: #e1251b;
    }
  }
}
</style>