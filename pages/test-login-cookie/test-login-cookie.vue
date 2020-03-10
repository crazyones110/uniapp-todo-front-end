<template>
	<view class="page" :style="{paddingBottom: isLogin?'50px':0}">
    <view class="header">
      <image :src="avatarUrl" mode="aspectFit"></image>
      <div class="nickname">{{nickName}}</div>
      <view class="online" :class="{'not-login': !isLogin}">{{online}}</view>
    </view>
    <view class="body">
      <view class="memo-wrapper" @click="switchTab('memo')">
        <view class="memo-count">{{memoCount}}</view>
        备忘录
      </view>
      <view class="todo-wrapper" @click="switchTab('todo')">
        <view class="todo-count">{{todoCount}}</view>
        全部代办
      </view>
      <view class="todo-wrapper" @click="switchTab('todo')">
        <view class="todo-count">{{restTodoCount}}</view>
        未完成代办
      </view>
    </view>
		<button type="primary" open-type="getUserInfo" @getuserinfo="wxLogin" withCredentials=true v-if="!isLogin" class="login-button">
      <text class="iconfont icon-weixin"></text>
    </button>
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
      ...mapState(['isLogin', 'todoCount', 'memoCount', 'restTodoCount']),
      online() {
        return this.isLogin ? '在线中' : '已下线'
      }
    },
		methods: {
      ...mapMutations(['changeLoginStatus', 'assignMemoCount', 'assignTodoCount', 'assignRestTodoCount']),
      switchTab(tab) {
        const switchOption = {
          memo: '../memo/memo',
          todo: '../todo/todo'
        }
        uni.switchTab({
          url: switchOption[tab]
        })
      },
			wxLogin(e) {
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
              uni.setStorageSync('memoCount', res.data.data.memoCount)
              uni.setStorageSync('todoCount', res.data.data.todoCount)
              uni.setStorageSync('restTodoCount', res.data.data.restTodoCount)
              this.assignMemoCount(res.data.data.memoCount)
              this.assignTodoCount(res.data.data.todoCount)
              this.assignRestTodoCount(res.data.data.restTodoCount)
              
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
            } else if (res.statusCode === 500) {
              this.changeLoginStatus(false)
              uni.showToast({
                title: '登录失败, 后台出了一点问题',
                icon: '../../static/大哭.png'
              })
            }
          })
        })
      }
		},
    onPullDownRefresh() {
      if (!this.isLogin) {
        uni.showToast({
          title: '请先登录',
          image: '../../static/login.png'
        })
        uni.stopPullDownRefresh()
        return
      }
      // 这里开始一定是登录过的！所以必然是授权过的
      uni.getUserInfo({
        provider: 'weixin',
        withCredentials: true,
        success: (res) => {
          const { nickName, avatarUrl } = res.userInfo
          this.nickName = nickName
          this.avatarUrl = avatarUrl
          uni.setStorageSync('nickName', nickName)
          uni.setStorageSync('avatarUrl', avatarUrl)
          uni.login({
            provider: 'weixin'
          }).then(res1 => {
            const [, { code }] = res1 // 微信服务器给的 code
            this.$http.post(`/auth/updateUserInfo`, {
              nickName,
              avatarUrl
            }, {
              header: {
                Cookie: `userId=${uni.getStorageSync('userId')}`
              }
            }).then(res => {
              if (res.statusCode === 200) {
                uni.stopPullDownRefresh()
                const {memoCount, todoCount, restTodoCount} = res.data.data
                uni.setStorageSync('memoCount', memoCount)
                uni.setStorageSync('todoCount', todoCount)
                uni.setStorageSync('restTodoCount', restTodoCount)
                this.assignMemoCount(memoCount)
                this.assignTodoCount(todoCount)
                this.assignRestTodoCount(restTodoCount)
              } else if (res.statusCode === 500) {
                uni.showToast({
                  title: '数据更新失败, 后台出了一点问题',
                  icon: '../../static/大哭.png'
                })
              }
            })
          })
        }
      })
    }
	}
</script>

<style lang="scss" scoped>
.page {
  background-color: rgb(248, 248, 248);
  // color: rgb(230, 230, 230);
}
.header {
  display: flex;
  padding: 20px;
  image {
    width: 100upx;
    height: 100upx;
    border-radius: 50%;
    border: 1px solid rgb(230, 230, 230);
  }
  .nickname {
    margin-left: 10px;
  }
  .online {
    margin-left: auto;
    &.not-login {
      color: red;
    }
  }
}
.body {
  display: flex;
  justify-content: space-around;
  .memo-wrapper, .todo-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgb(155, 155, 155);
  }
  .memo-count, .todo-count {
    color: black;
  }
}
.login-button {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: relative;
  top: 70px;
  margin: 0 auto;
  .iconfont {
    font-size: 20px;
  }
}

</style>
