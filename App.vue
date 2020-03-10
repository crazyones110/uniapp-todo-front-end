<script>
  import { http as $http } from './js_sdk/luch-request/index.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
	export default {
    computed: {
      ...mapState(['isLogin']),
    },
    globalData: {
      isLogin: false,
      expires: false
    },
    methods:{
      ...mapMutations(['changeLoginStatus', 'changeOpenid', 'assignMemoCount', 'assignTodoCount']),
      checkLogin() {
        const userId = uni.getStorageSync('userId')
        if (!userId) {
          this.changeLoginStatus(false)
          uni.showToast({
            title: '请先登录',
            image: './static/login.png'
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
        this.$http.get('/auth/launchCheck', {
          header: {
            Cookie: `userId=${userId}`
          }
        }).then(res => {
          if (res.data === '已过期') {
            this.changeLoginStatus(false)
            uni.showToast({
              title: '请重新登录',
              image: './static/login.png'
            })
            return
          }
          if (res.data === '登录成功') { // 使用redis登录成功
            if (res.cookies.length !== 0) {
              // ["userId=1580993781705_0.5937802374735008"]
              const [, userId] = res.cookies[0].split('=') // ['userId', '1a2b3f']
              uni.setStorageSync('userId', userId)
            }
            this.assignMemoCount(uni.getStorageSync('memoCount'))
            this.assignTodoCount(uni.getStorageSync('todoCount'))
            this.changeLoginStatus(true)
          }
        })
      }
    },
		onShow: function() {
		},
		onHide: function() {
		},
    onLaunch() {
      this.checkLogin()
    }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  @import '~@/common/icon';
  :not(not) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
</style>
