<template>
  <div class="spec-preview" ref="spec">
    <!-- 得到轮播传来的索引值，动态展示图片 -->
    <img :src="skuImageList[index].imgUrl" />
    <!-- 放大镜放大事件 -->
    <div class="event" @mousemove="move"></div>
    <div class="big">
      <img :src="skuImageList[index].imgUrl" ref="big" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  props: {
    // 设置默认值，以防数据没有到出现红色报错
    skuImageList: {
      default: () => [{}]
    }
  },
  name: 'Zoom',
  data() {
    return {
      // 设置初始值为0，展示第一张图
      index: 0
    }
  },
  mounted() {
    // 收到事件返回的索引，重新赋值
    this.$bus.$on('getImgIndex', (index) => {
      this.index = index
    })
  },
  methods: {
    move(event) {
      let mask = this.$refs.mask
      let big = this.$refs.big
      // 左右距离等于鼠标离框的距离减去绿色盒子的一半
      let left = event.offsetX - mask.offsetWidth / 2
      let top = event.offsetY - mask.offsetHeight / 2
      // 如果小于0 等于0
      if (left <= 0) {
        left = 0
      }
      // 因为两个绿色盒子等于大盒子 如果left大于一个盒子的宽度 就是超过边了
      if (left >= mask.offsetWidth) {
        left = mask.offsetWidth
      }
      if (top <= 0) {
        top = 0
      }
      // 同上
      if (top >= mask.offsetHeight) {
        top = mask.offsetHeight
      }
      // 赋值
      mask.style.left = left + 'px'
      mask.style.top = top + 'px'
      // 放大后的图片 方向相反，并且是两倍
      big.style.left = -left * 2 + 'px'
      big.style.top = -top * 2 + 'px'
    }
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>