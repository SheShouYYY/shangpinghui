<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 因为要离开全部分类才取消样式。给他们父元素绑定样式 (儿子触发事件，父亲也会触发)-->
      <div @mouseleave="leaveIndex" @mouseenter="enterShowSort">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <div class="sort" v-show="sortShow">
            <!-- 给父亲元素绑定跳转search路由的方法（事件委派冒泡） 因为如果给每个a标签绑定内存占用过大-->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 这里是一级列表，循环for -->
              <!-- slice(0,15)是因为服务器传来的数据多了 -->
              <!-- 给div绑定事件，鼠标进入的时候调用函数并且添加样式判断 -->
              <div
                class="item bo"
                :class="{ cur: currentIndex === index }"
                v-for="(c1, index) in CategoryList.slice(0, 15)"
                :key="c1.categoryId"
                @mouseenter="changeIndex(index)"
              >
                <h3>
                  <!-- 给三个级别的a标签都设置data属性 name和id 方便确定a标签和传递数据 -->
                  <a
                    href="javascript:;"
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 这里用js来控制显示隐藏，没有用css的hover -->
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex === index ? 'block' : 'none'
                  }"
                >
                  <div class="subitem">
                    <!-- 这里是二级列表 -->
                    <dl
                      class="fore"
                      v-for="c2 in c1.categoryChild"
                      :key="c2.categoryId"
                    >
                      <dt>
                        <a
                          href="javascript:;"
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 这里是三级列表 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            href="javascript:;"
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
// 引入lodash 节流函数
import throttle from 'lodash/throttle'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // 设置变量为一个没有的index （这里用js来实现hover效果）
      currentIndex: -1,

      sortShow: true
    }
  },
  mounted() {
    // 如果不是home组件，就不让他显示
    if (this.$route.path != '/home') {
      this.sortShow = false
    }
  },
  computed: {
    // 展开 命名空间叫Home, 计算属性名字和要获取的名字都写成一样(简写)
    ...mapState('Home', ['CategoryList'])
  },
  methods: {
    // 鼠标进入的时候，传了他的index过来 然后修改变量
    // 因为用户如果移动速度快的话，并且业务逻辑很多的话浏览器可能出现卡顿现象，这里需要设置一个节流
    changeIndex: throttle(function (index) {
      this.currentIndex = index
      // console.log('执行了', index)
    }, 30),

    // 鼠标离开的时候 变量改为-1 并且判断，如果不是在home组件 显示就为false
    leaveIndex() {
      this.currentIndex = -1
      if (this.$route.path != '/home') {
        this.sortShow = false
      }
    },
    // 鼠标进入变成true
    enterShowSort() {
      this.sortShow = true
    },

    // 设置搜索路由的跳转 (这里不能用router-link声明导航 因为标签循环太多 router-link是组件 会卡顿)
    // 采用编程式导航
    goSearch(event) {
      // 用data-绑定的属性 可以通过元素标签身上的dataset获取到 （这里是对象解构）
      const { categoryname, category1id, category2id, category3id } =
        event.target.dataset

      // 如果有名字 则进入判断
      if (categoryname) {
        // 创建一个对象 用来存储跳转路由的配置对象
        const result = {
          name: 'search',
          query: {
            categoryName: categoryname
          },
          // 获取当前本来就存在的params
          params: this.$route.params
        }

        // 如果有如下这些id,就在query中添加
        if (category1id) {
          result.query.category1Id = category1id
        } else if (category2id) {
          result.query.category2Id = category2id
        } else if (category3id) {
          result.query.category3Id = category3id
        }

        // 跳转路由
        this.$router.push(result)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }

        .cur {
          background-color: skyblue;
        }
      }
    }

    .sort-enter {
      height: 0;
    }

    .sort-enter-to {
      height: 461px;
    }

    .sort-enter-active {
      overflow: hidden;
      transition: all 0.5s;
    }
  }
}
</style>