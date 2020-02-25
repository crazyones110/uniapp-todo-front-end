<template>
	<view class="wrapper" v-if="showTextarea">
		<textarea
		  placeholder="请输入新的待办事项"
		  v-if="showTextarea"
		  focus
		  :cursor-spacing="10"
		  class="todo-textarea"
      @confirm="uni.$emit('confirm-pop', $event)"
		/>
		<view class="click-hide" v-if="showTextarea" @click="uni.$emit('hideTextarea')"></view>
	</view>
</template>

<script>
	export default {
    props: {
      show: {
        type: Boolean
      }
    },
    computed: {
      showTextarea() {
        return this.show
      }
    },
    methods: {
      handleClick() {
        
      }
    },
    mounted() {
      console.log(this.showTextarea)
    }
	}
</script>

<style lang="scss" scoped>
.todo-textarea {
  border: 1px solid red;
  padding: 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100vw;
  background-color: #FFFFFF;
  height: 60px;
  z-index: 11;
}
.click-hide {
  $height: calc(100vh - 60px);
  position: fixed;
  height: $height;
  width: 100vw;
  bottom: $height;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0);
}
</style>
