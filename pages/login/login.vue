<template>
	<view>
		<button type="primary" open-type="getUserInfo" @getuserinfo="wxLogin" withCredentials="true">微信登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    methods: {
      Login(e) {
        const { detail: { userInfo } } = e
        
        uni.login({
          provider: 'weixin',
        }).then(res1 => {
          const [, {code}] = res1 // 获得微信授权码
          uni.request({
            url: 'http://localhost:3000/mpLogin' + code,
            data: {
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            },
            method: 'POST'
          }).then(res2 => {
            const [, result] = res2
            if (result.data.status === 200) {
              const userInfo = result.data.data // 后端返回的用户信息，包括uniqueToken
              
              // 保存用户信息到全局缓存中
              uni.setStorageSync('globalUser', userInfo)
              
              uni.redirectTo({
                url: '../index/index'
              })
            }
          })
        })       
      },
      wxLogin(e) {
        const { detail } = e
        console.log(detail)
      }
    },
	}
</script>

<style lang="scss">

</style>
