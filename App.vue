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
      ...mapMutations(['changeLoginStatus', 'changeOpenid']),
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
          if (res.data === '登录成功') {
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
