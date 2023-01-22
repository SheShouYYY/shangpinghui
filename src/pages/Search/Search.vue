<template>
  <div>
    <!-- search组件也需要有typeNav -->
    <TypeNav></TypeNav>
    <div class="main">
      <div class="py-container">
        <!--面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果：</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 第一个面包屑 商品名称-->
            <li class="with-x" v-if="resSearchList.categoryName">
              {{ resSearchList.categoryName }}
              <!-- 删除商品名称面包屑 -->
              <a @click="removeCategoryName">X</a>
            </li>

            <!-- 第二个面包屑 搜索名称-->
            <!-- 并且判断，得有搜索名称，且不能和品牌名称一样 面包屑才显示-->
            <li
              class="with-x"
              v-if="
                resSearchList.keyword &&
                resSearchList.keyword !== resSearchList.trademark.split(':')[1]
              "
            >
              {{ resSearchList.keyword }}
              <!-- 删除搜索名称面包屑 -->
              <a @click="removeKeyword">X</a>
            </li>

            <!-- 第三个面包屑 品牌名称-->
            <li class="with-x" v-if="resSearchList.trademark">
              {{ resSearchList.trademark.split(':')[1] }}
              <!-- 删除品牌名称面包屑 -->
              <a @click="removeTrademark">X</a>
            </li>

            <!-- 第四个面包屑 商品参数名称 因为格式是["属性ID:属性值:属性名"] 所以要截取 -->
            <!-- 这里是数组，所以遍历 -->
            <li
              class="with-x"
              v-for="(item, index) in resSearchList.props"
              :key="item.split(':')[0]"
            >
              {{ item.split(':')[1] }}
              <!-- 删除商品参数名称面包屑 -->
              <a @click="removeAttr(index)">X</a>
            </li>
          </ul>
        </div>

        <!--子组件-->
        <!-- 自定义事件传递事件，获取数据 -->
        <SearchSelector @getTrademark="getTrademark" @getAttr="getAttr" />

        <!-- 按钮排序 -->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 判断有没有一，有就激活红底样式 -->
                <!-- 点击事件，并且传1 -->
                <li :class="{ active: orderHasOne }" @click="oneAscOrDesc('1')">
                  <!-- 判断有没有一，有才显示箭头 接着判断样式 -->
                  <a href="javascript:;">
                    综合<i v-show="orderHasOne" :class="[iconfontShow]"></i
                  ></a>
                </li>
                <!-- 判断 成功后激活 -->
                <!-- 点击事件 传2 -->
                <li :class="{ active: orderHasTwoAsc }" @click="twoAsc('2')">
                  <a href="javascript:;">价格⬆</a>
                </li>
                <!-- 判断 成功后激活 -->
                <!-- 点击事件 传2 -->
                <li :class="{ active: orderHasTwoDesc }" @click="twoDesc('2')">
                  <a href="javascript:;">价格⬇</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <!-- 给父组件绑定事件委派 跳转详情页路由 -->
            <ul class="yui3-g" @click="sendDetail">
              <!-- 循环遍历searchList里面的goodList 商品列表-->
              <li
                class="yui3-u-1-5"
                v-for="item in SearchList.goodsList"
                :key="item.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 绑定一个自定义属性，用来判断事件委派 并且传入id-->
                    <a href="javascript:;"
                      ><img v-lazy="item.defaultImg" :data-listId="item.id"
                    /></a>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ item.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ item.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <!-- 1.当前页数  2.一页展示的个数  3.数据总数  4.连续显示几页的按钮 5.自定义事件获取数据 -->
          <Pagination
            :pageNo="resSearchList.pageNo"
            :pageSize="resSearchList.pageSize"
            :total="SearchList.total"
            :continues="5"
            @getPagin="getPagin"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector.vue'
import { mapState } from 'vuex'
export default {
  name: 'Search',
  data() {
    return {
      // 服务器需要传的数据
      resSearchList: {
        // 商品的id
        category1Id: '',
        category2Id: '',
        category3Id: '',
        // 商品的名称
        categoryName: '',
        // 搜索名称
        keyword: '',
        // 排序方式
        order: '1:desc',
        // 当前页数
        pageNo: 1,
        // 一页显示的数量
        pageSize: 3,
        // 商品参数
        props: [],
        // 商品品牌
        trademark: ''
      }
    }
  },
  components: {
    // 注册子组件
    SearchSelector
  },
  beforeMount() {
    // 在挂载完成前将用户点击跳转发送的路由数据query与params和需要传的信息进行合并
    Object.assign(this.resSearchList, this.$route.query, this.$route.params)
  },
  mounted() {
    // 调用dispach发送请求函数(函数被封装)
    this.getSearch()
  },
  computed: {
    // 获取仓库的数据
    ...mapState('Search', ['SearchList']),

    // 判断排序里面有没有一 有就是true
    orderHasOne() {
      return this.resSearchList.order.includes('1')
    },

    // 判断排序里面有没有二并且有没有升序 有就是true
    orderHasTwoAsc() {
      return (
        this.resSearchList.order.includes('2') &&
        this.resSearchList.order.includes('asc')
      )
    },

    // 判断排序里面有没有二并且有没有降序 有就是true
    orderHasTwoDesc() {
      return (
        this.resSearchList.order.includes('2') &&
        this.resSearchList.order.includes('desc')
      )
    },

    // 控制iconfont的样式，如果有asc就是升序 没有就是降序
    iconfontShow() {
      return this.resSearchList.order.includes('asc')
        ? 'iconfont icon-shengxu'
        : 'iconfont icon-jiangxu'
    }
  },
  methods: {
    // 封装请求
    getSearch() {
      // 发送dispach请求
      this.$store.dispatch('Search/getSearch', this.resSearchList)
    },

    // 点击删除按钮，删除商品名称面包屑
    removeCategoryName() {
      // 名称设置为undefined
      this.resSearchList.categoryName = undefined
      // 重新跳转页面 下面watch监听到 保留params参数
      this.$router.push({
        name: 'search',
        params: this.$route.params
      })
    },

    // 点击删除按钮，删除搜索名称面包屑
    removeKeyword() {
      // 设置为undefined
      this.resSearchList.keyword = undefined
      // 重新跳转页面 下面watch监听到 保留query参数
      this.$router.push({
        name: 'search',
        query: this.$route.query
      })
    },

    // 自定义事件函数 获取子传过来的品牌数据
    getTrademark(item) {
      // 判断如果品牌名称如果和搜索名称不一样，才保存并且发送请求 也就才能添加面包屑 要不然是空值
      if (item.tmName !== this.resSearchList.keyword) {
        // 品牌参数格式:  "ID:品牌名称"
        this.resSearchList.trademark = `${item.tmId}:${item.tmName}`
        // 判断完成发送请求
        this.getSearch()
      } else {
        alert('您当前选择的就是该分类')
      }
    },

    // 点击删除按钮 删除品牌面包屑
    removeTrademark() {
      this.resSearchList.trademark = undefined
      // 保留其他参数
      this.$router.push({
        name: 'search',
        query: this.query,
        params: this.params
      })
    },

    // 自定义事件函数 获取子传过来的物品参数
    getAttr(id, attr, attrName) {
      // 商品参数格式  ["属性ID:属性值:属性名"]
      const result = `${id}:${attr}:${attrName}`
      // 判断props数组里面有没有这个result 如果没有 才添加进去
      if (!this.resSearchList.props.includes(result)) {
        // 添加进入数组，并且请求数据
        this.resSearchList.props.push(result)
        this.getSearch()
      } else {
        alert('您选择过了')
      }
    },

    // 删除商品参数的面包屑
    removeAttr(index) {
      // 点击删除按钮 获取到索引 删除当前索引
      this.resSearchList.props.splice(index, 1)
      this.getSearch()
    },

    // 第一个综合排序按钮，点击传入1
    oneAscOrDesc(flag) {
      // 存储
      let result = ''
      // 当1和order里面一样时
      if (flag === this.resSearchList.order.split(':')[0]) {
        // 再判断desc和dec如果一样则 1:desc 或者 1:asc
        result =
          this.resSearchList.order.split(':')[1] === 'desc' ? 'asc' : 'desc'
      } else {
        // 如果1和order里面不一样 则默认是desc降序
        result = 'desc'
      }
      // 保存变量
      this.resSearchList.order = `${flag}:${result}`
      // 发送请求
      this.getSearch()
    },

    // 价格升序排序
    twoAsc(flag) {
      // 赋值 发送请求
      this.resSearchList.order = `${flag}:asc`
      this.getSearch()
    },

    // 价格降序排序
    twoDesc(flag) {
      // 赋值 发送请求
      this.resSearchList.order = `${flag}:desc`
      this.getSearch()
    },

    // 获取子组件传来的页数
    getPagin(index) {
      // 重新赋值发送请求
      this.resSearchList.pageNo = index
      this.getSearch()
    },

    // 跳转到详情页路由
    sendDetail(event) {
      // 判断有没有如下属性，如果有才会跳转
      const { listid } = event.target.dataset
      if (listid) {
        this.$router.push({
          name: 'detail',
          params: {
            id: listid
          }
        })
      }
    }
  },
  watch: {
    // 监视$route，如果发生了query和params发生了改变，则执行代码
    $route() {
      console.log('调用了')
      // 将id先清零，以防同时存在两个id
      this.resSearchList.category1Id = undefined
      this.resSearchList.category2Id = undefined
      this.resSearchList.category3Id = undefined
      // 再次合并
      Object.assign(this.resSearchList, this.$route.query, this.$route.params)
      // 调用请求
      this.getSearch()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          a {
            font-size: 12px;
            padding: 0 5px;
          }

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;

                .iconfont {
                  font-size: 12px;
                }
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>