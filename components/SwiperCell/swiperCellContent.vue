<template>
  <div class="swiper-cell-content"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    :class="{animate}"
    :style="{transform: `translateX(${translateX}px)`}"
    >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swiperCellContent',
  data() {
    return {
      translateX: 0,
      animate: false,
      touchStartX: 0,
      touchStartY: 0,
      startX: 0, // 组件初始位置
      direction: null, // 手指滑动方向
      moveDis: 0,
      currentX: 0,
      currentY: 0
    }
  },
  methods: {
    handleTouchStart(e) {
      this.animate = false
      this.touchStartX = e.touches[0].pageX
      this.touchStartY = e.touches[0].pageY
      this.startX = this.translateX      // 组件初始位置
      this.direction = null                   // 记录手指滑动方向 X:左右滑动； Y:上下滑动
    },
    handleTouchMove(e) {
      this.currentX = e.touches[0].pageX
      this.currentY = e.touches[0].pageY
      this.moveDis = this.currentX - this.touchStartX

      // 竖直移动距离超过了左右移动距离
      if(Math.abs(this.currentY - this.touchStartY) > Math.abs(this.moveDis)) {
        this.direction = 'Y'
        return
      }
      this.direction = 'X'

      // 以下两种情况不进行移动：1. 在最右边时向右滑动; 2. 在最左边时向左滑动
      if((this.startX === 0 && this.moveDis > 0) || (this.startX === -this.actionWidth && this.moveDis < 0)) {
        return
      } else if(Math.abs(this.moveDis) >= this.actionWidth) {
        // 移动超出删除按钮的宽度时取按钮宽度作为移动距离
        this.moveDis = this.moveDis < 0 ? -this.actionWidth : this.actionWidth
        /* 我一开始写的是this.translateX = this.translateX + this.moveDis
        ** 很明显是不对的，因为在手指抬起之前，起点都应该是上一次结束的位置
        ** 用 translateX 的话，起点就会一直变了
        */
        this.translateX = this.startX + this.moveDis
      } else {  // 其他情况：手指滑动多少就位移多少
        this.translateX = this.startX + this.moveDis
      }
    },
    handleTouchEnd(e) {
      // 非左右滑动时不进行任何操作
      if(this.direction !== 'X') {
        return
      }
      let translateX = 0
      // // 移动超出右滑最大位移
      // if(this.moveDis + this.startX >= 0) {
      //   translateX = 0
      // } else if(this.moveDis + this.startX <= -this.actionWidth) {
      //   // 移动超出左滑最大位移
      //   translateX = -this.actionWidth
      // } else
      if((this.startX === 0 && Math.abs(this.moveDis) < this.actionWidth / 2) || (this.startX === -this.actionWidth && Math.abs(this.moveDis) > this.actionWidth / 2)) {
        // 以下两种情况都滑动到右边起点（即删除按钮隐藏的状态）：
        // 1. 从右边起点左滑但未超过最大位移的一半，回退到右边起点
        // 2. 从左边起点右滑且超过最大位移的一半，继续滑到到右边起点
        translateX = 0
      } else {
        translateX = -this.actionWidth
      }
      this.animate = true
      this.translateX = translateX
    }
  },
  created() {
    this.$parent.$on('width', width => this.actionWidth = width)
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.actionWidth)
    // })
  }
}
</script>

<style lang="scss" scoped>
.swiper-cell-content{
  flex: 1;
  z-index: 0;
  background-color: yellow;
  &.animate {
    transition: all 300ms;
  }
}
</style>