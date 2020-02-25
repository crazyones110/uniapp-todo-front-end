<template>
  <view class="swiper-wrapper" :style="{width}">
    <movable-area class="movable-area" :style="{width:`calc(100% - ${actionWidth})`, height}">
      <movable-view
        direction="horizontal"
        :out-of-bounds="true"
        @change="handleChange"
        @touchend="handleTouchEnd"
        @touchstart="handleTouchStart"
        :animation="true"
        :x="xmove"
        :inertia="true"
        class="movable-view"
        :style="{width: wrapperWidth, height}"
      >
        <view class="swiper-content"><!--高度是撑满movable-view的-->
          <slot name="swiper-content"></slot>
        </view>
      </movable-view>
    </movable-area>
    <view class="swiper-action"><!--高度是撑满movable-view的-->
      <slot name="swiper-action"></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: ["width"],
  data() {
    return {
      xmove: 0,
      startX: 0,
      oldxMove: 0,
      content: "abcde",
      // height: "1.2rem",
      height: "50px",
      actionWidth: '0px',
      actionWidthNum: 0,
      wrapperWidth: '0px',
      actionVisible: false
    }
  },
  methods: {
    /**
     * 显示删除按钮
     */
    showDeleteButton: function() {
      // let productIndex = e.currentTarget.dataset.productindex
      this.setXmove(-this.actionWidthNum);
    },

    /**
     * 隐藏删除按钮
     */
    hideDeleteButton: function() {
      // let productIndex = e.currentTarget.dataset.productindex

      this.setXmove(0);
    },

    /**
     * 设置movable-view位移
     */
    setXmove: function(xmove) {
      this.xmove = this.oldxMove;
      this.$nextTick(() => {
        this.xmove = xmove;
      });
    },
    handleChange(e) {
      this.oldxMove = e.detail.x;
      if (e.detail.source === "friction") {
        // 只有在inertia开启的情况下才有
        if (e.detail.x < -this.actionWidthNum/2) {
          console.log("friction show");
          this.showDeleteButton();
        } else {
          console.log("friction hide");
          this.hideDeleteButton();
        }
      } else if (e.detail.source === "out-of-bounds" && e.detail.x === 0) {
        console.log(e.detail.source, e.detail.x);
        this.hideDeleteButton();
      }
    },
    handleTouchStart(e) {
      this.startX = e.touches[0].pageX;
    },
    handleTouchEnd(e) {
      if (
        e.changedTouches[0].pageX < this.startX &&
        e.changedTouches[0].pageX - this.startX <= -this.actionWidthNum/2
      ) {
        // 左滑且滑动超出30px
        this.showDeleteButton();
      } else if (
        e.changedTouches[0].pageX > this.startX &&
        e.changedTouches[0].pageX - this.startX < this.actionWidthNum/2
      ) {
        // 右滑且滑动没超过30px
        this.showDeleteButton();
      } else {
        // 其余情况皆隐藏
        this.hideDeleteButton();
      }
    },
    handleDelete() {
      this.list.splice(index, 1);
    },
    getDOM() {
      return new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        // query.select('.swiper-content2').boundingClientRect()
        
        
        
        // 这里list循环query，或者直接actionflex布局
        
        
        query.select('.swiper-content').fields({
          computedStyle: ['height']
        })
        query.select('.swiper-action').boundingClientRect()
        query.select('.swiper-wrapper').boundingClientRect()
        query.exec(res => {
          resolve(res);
        });
      });
    },
    writeDOM() {
      this.getDOM().then(data => {
        console.log('Promise data', data)
        this.height = data[0].height
        this.actionWidth = data[1].width + 'px'
        this.actionWidthNum = data[1].width
        this.wrapperWidth = data[2].width + 'px'
      })
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.writeDOM()
    // }, 1100)
    this.writeDOM()

  },
  created() {
    uni.$on('writeDOM', (height) => {
      this.height = height
      // this.writeDOM()
    })
  }
};
</script>

<style lang="scss" scoped>
.swiper-wrapper {
  position: relative;
  movable-area {
    // width: calc(100% - 50px);
    // height: 80px;
    // background-color: blue;

    movable-view {
      // height: 80px;
      // background-color: yellow;
      z-index: 99;
    }
  }
  .swiper-action {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    // height: 100%;
    margin: auto;
    // background-color: red;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }
}
</style>
