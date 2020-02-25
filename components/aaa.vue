<template>
	<view class="aaa">
		<view class="wrapper1">
		  <slot></slot>
		</view>
    <view class="wrapper2">
      <slot name="wrapper2" class="slot-wrapper2"></slot>
    </view>
	</view>
</template>

<script>
	export default {
    multipleSlots:true,
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.aaa {
  width: 100vw;
  height: 100px;
  .wrapper1,.wrapper2 {
    width: 100%;
    height: 50px;
  }
  .wrapper1 {
    background-color: yellow;
  }
  .wrapper2 {
    background-color: green;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
