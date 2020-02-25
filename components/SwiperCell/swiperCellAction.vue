<template>
  <div class="swiper-cell-action">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swiperCellAction',
  data() {
    return {
    }
  },
  methods: {
    getWidth() {
      return new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this)
        query.select('.swiper-cell-action').boundingClientRect(data => {
          resolve(data.width)
        }).exec()
      })
    },
  },
  mounted() {
    // this.getWidth()
    //   .then(width => this.$parent.$emit('width', width)) 
    this.getWidth()
      .then(width => console.log(width)) 
  }
}
</script>

<style lang="scss" scoped>
.swiper-cell-action {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  background-color: green;
  z-index: -1;
 }
</style>