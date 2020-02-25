<template>
	<view>
    <image :src="avatarUrl" mode="aspectFit"></image>
    <div>{{nickName}}</div>
		<button type="primary" open-type="getUserInfo" @getuserinfo="wxLogin" withCredentials=true>微信登录</button>
	</view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
	export default {
		data() {
			return {
				nickName: uni.getStorageSync('nickName') || '游客',
        avatarUrl: uni.getStorageSync('avatarUrl') || '../../static/avatar.png'
			}
		},
    computed:{
      ...mapState(['isLogin'])
    },
		methods: {
      ...mapMutations(['changeLoginStatus']),
			wxLogin(e) {
        console.log('我在手机上点了登录啦')
        if (this.isLogin) {
          uni.showToast({
            title: '您已登录'
          })
          return
        }
        if (!e.detail.iv) { // 用户点击了取消授权
          uni.showToast({
            title: '请授权登录',
            icon: 'none'
          })
          this.changeLoginStatus(false)
          return
        }
        const {detail: { userInfo: { nickName, avatarUrl }}} = e
        uni.login({
          provider: 'weixin'
        }).then(res1 => {
          const [, { code }] = res1 // 微信服务器给的 code
          this.$http.post(`/auth/wxlogin/${code}`, {
            nickName,
            avatarUrl
          }, {
            header: {
              Cookie: `userId=${uni.getStorageSync('userId')}`
            }
          }).then(res => {
            if (res.statusCode === 200) {
              if (res.cookies.length !== 0) {
                // ["userId=1580993781705_0.5937802374735008"]
                const [, userId] = res.cookies[0].split('=') // ['userId', '1a2b3f']
                uni.setStorageSync('userId', userId)
              }
              // 这以后其实是登录过的状态
              this.changeLoginStatus(true)
              uni.$emit('loginFinished')
              this.nickName = nickName
              this.avatarUrl = avatarUrl
              uni.setStorageSync('nickName', nickName)
              uni.setStorageSync('avatarUrl', avatarUrl)
              uni.showToast({
                title: '登录成功',
                icon: 'success'
              })
              console.log(res)
            } else {
              this.changeLoginStatus(false)
              uni.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          })
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
image {
  width: 100upx;
  height: 100upx;
}

</style>
