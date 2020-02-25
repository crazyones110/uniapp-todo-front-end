<template>
	<view>
		<text v-if="login">我登录啦</text>
    <button type="primary" v-else @click="clickLogin">点击登录</button>
    <button type="primary" v-if="login" @click="clickQuit">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login: getApp().globalData.isLogin
			};
		},
    onLoad() {
      console.log(this.login)
    },
    methods: {
      clickLogin() {
        this.login = getApp().globalData.isLogin = true
        console.log(this.login)
        uni.setStorage({
          key: 'isLogin',
          data: this.login
        })
      },
      clickQuit() {
        this.login = getApp().globalData.isLogin = false
        console.log(this.login)
        uni.setStorage({
          key: 'isLogin',
          data: this.login
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
text {
  display: block;
  text-align: center;
}
</style>
