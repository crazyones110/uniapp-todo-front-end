<template>
  <view class="content">
    这是主页面{{title}}

  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello'
      }
    },
    onLoad() {
      // this.checkLogin()
    },
    methods: {
      checkLogin() {
        const userId = uni.getStorageSync('userId')
        if (!userId) {
          getApp().globalData.isLogin = false
          uni.showModal({
            content: '请先登录',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                uni.switchTab({
                  url: 'pages/test-login-cookie/test-login-cookie'
                })
              }
            }
          })
          return
          /*
          正式版可以这样用
          uni.showActionSheet({
            itemList: ['登录'],
            success(res) {
              uni.getUserInfo({
                provider: 'weixin'
              })
            }
          })
          */
        }
        // 有 userId
        uni.request({
          url: 'http://localhost:3000/wxLogin/launchCheck',
          header: {
            Cookie: `userId=${userId}`
          },
          success(res) {
            if (res.data === '已过期') {
              getApp().globalData.isLogin = false
              uni.showModal({
                content: '登录已过期，请先登录',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    uni.switchTab({
                      url: '../test-login-cookie/test-login-cookie'
                    })
                  }
                }
              })
              return
            }
            if (res.data === '登录成功') {
              getApp().globalData.isLogin = true
            }
          }
        })
      }
    },
    onShow() {}
  }
</script>

<style>
</style>
