<template>
	<view>
		<button class="add-memo" @click="hancleClick"><text class="iconfont icon-add"></text></button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    methods: {
      handleClick() {
        // uni
      }
    }
	}
</script>

<style lang="scss">
.add-memo {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 5px -6px rgba(0,0,0,0.75);
    &::after {
      border: none;
    }
    .icon-add {
      font-size: 24px;
    }
  }
</style>
