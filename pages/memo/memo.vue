<template>
	<view class="memo">
    <view class="search-wrapper">
      <text class="iconfont icon-search"></text>
      <input type="text" placeholder="搜索备忘录" confirm-type="search" @confirm="searchMemo"/>
    </view>
    <view class="left-right-memo-wrapper">
      <view class="left-memo" ref="leftMemo">
        <view v-for="(memo,index) in leftMemo" :key="index" class="memo-content" @click="handleMemoClick('left', index)">
          <view class="ellipsis">{{memo.content}}</view>
          <view class="memo-time">{{memo.createTime | formattedYear}}</view>
        </view>
      </view>
      <view class="right-memo" ref="rightMemo">
        <view v-for="(memo,index) in rightMemo" :key="index" class="memo-content" @click="handleMemoClick('right', index)">
          <view class="ellipsis">{{memo.content}}</view>
          
          <view class="memo-time">{{memo.createTime | formattedYear}}</view>
        </view>
      </view>
    </view>
    <button class="add-memo" @click="addMemo"><text class="iconfont icon-add"></text></button>
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
				leftMemo: [
          // {
          //   createTime: 1111,
          //   content: '啊实打实大师大师大师大师法山海关打个电话时高时低阿萨德撒点阿萨德撒点撒点撒点撒点阿萨德撒点撒点阿萨德撒',
          // },
          // {
          //   createTime: 1111,
          //   content: '啊实打',
          // }
        ],
        rightMemo: [
          // {
          //   createTime: 1111,
          //   content: '啊实打实大师大师大师大师法山海关打个电话时高时低阿萨德撒点阿萨德撒点撒点撒点撒点阿萨德撒点撒点阿萨德撒',
          // },
          // {
          //   createTime: 1111,
          //   content: '山海关打个电话时高时低阿萨德撒点阿萨德撒点撒点撒点撒点阿萨德撒点撒点阿萨德撒',
          // },
          // {
          //   createTime: 1111,
          //   content: '啊实打实大师大师大师大师法山海关打个电话时高时低阿萨德撒点阿萨德撒点撒点撒点撒点阿萨德撒点撒点阿萨德撒',
          // }
        ],
        leftMemoHeight: 0,
        rightMemoHeight: 0,
        showTextarea: false,
        memoContent: '',
        tabHeight: 0
			}
		},
    computed: {
      ...mapState(['currentMemo', 'isLogin']),
    },
    methods: {
      ...mapMutations(['changeMemo', 'changeMemoCount']),
      searchMemo(e) {
        const value = e.detail.value
        // console.log(e.detail.value)
        const searchedArr = []
        this.leftMemo.forEach(memo => {
          if (memo.content.includes(value)) {
            searchedArr.push(memo)
          }
        })
        this.rightMemo.forEach(memo => {
          if (memo.content.includes(value)) {
            searchedArr.push(memo)
          }
        })
        if (searchedArr.length === 0) {
          uni.showToast({
            title: '没有匹配条件的备忘录~',
            icon: 'none'
          })
        } else {
          uni.navigateTo({
            url: '../memo-search/memo-search?searchMemo=' + encodeURIComponent(JSON.stringify(searchedArr))
          })
        }
      },
      getHeight() {
        return new Promise((resolve, reject) => {
          const query = uni.createSelectorQuery().in(this)
          query.select('.left-memo').boundingClientRect()
          query.select('.right-memo').boundingClientRect()
          query.exec(res => {
            resolve(res)
          })
        })
      },
      addMemo() {
        if (!this.isLogin) {
          uni.showToast({
            title: '请先登录',
            image: '../../static/login.png'
          })
          return
        }
        this.changeMemo('')
        uni.navigateTo({
          url: '../edit-memo/edit-memo?type=add&tabHeight=' + this.tabHeight
        })
      },
      handleMemoClick(leftOrRight, index) {
        const position = `${leftOrRight}Memo`
        this.changeMemo(this[position][index].content)
        uni.navigateTo({
          url: '../edit-memo/edit-memo?type=edit&tabHeight=' + this.tabHeight
        })
        uni.$once('changeMemo', (state) => {
          if (!state) {
            return
          }
          
          const changedMemo = {
            ...this[position][index],
            content: this.currentMemo
          }
          
          // this.changeMemo('') // 这里是我改过的
          
          this.$set(this[position], index, changedMemo)
          
          
          this.$http.put('/memo', changedMemo, {
            header: {
              Cookie: `userId=${uni.getStorageSync('userId')}`
            }
          }).then(res => {
            if (res.data === 'Update Error') {
              uni.showToast({
                title: '服务器更新失败',
              })
              return
            }
            if (res.data === 'Update Success') {
            }
          })
        })
        uni.$once('deleteMemo', (state) => {
          if (!state) {
            return
          }
          const [{createTime}] = this[position].splice(index, 1)
          uni.setStorageSync('memoCount', uni.getStorageSync('memoCount') - 1)
          this.changeMemoCount(-1)
          this.$http.delete('/memo', {
            createTime
          }, {
            header: {
              Cookie: `userId=${uni.getStorageSync('userId')}`
            }
          }).then(res => {
            if (res.data === 'Delete Error') {
              uni.showToast({
                title: '服务器删除失败',
              })
              return
            }
            if (res.data === 'Delete Success') {
            }
          })
        })
      },
      addMemoToDOM(newMemo) {
        this.getHeight().then(res => {
          let { leftMemoHeight, rightMemoHeight } = this
          leftMemoHeight = res[0].height
          rightMemoHeight = res[1].height
          if (leftMemoHeight <= rightMemoHeight) {
            this.leftMemo.push(newMemo)
          } else {
            this.rightMemo.push(newMemo)
          }
        })
      }
    },
    onLoad() {
      const {statusBarHeight, platform, screenHeight, windowHeight} = uni.getSystemInfoSync()
      // 安卓48 ios 44
      if (platform === 'android') {
        this.tabHeight = screenHeight - windowHeight - statusBarHeight - 48
      } else {
        this.tabHeight = screenHeight - windowHeight - statusBarHeight - 44
      }
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.isLogin) {
            this.$http.get('/memo', {
              header: {
                Cookie: `userId=${uni.getStorageSync('userId')}`
              }
            }).then(res => {
              res.data.forEach((item, index) => {
                if (index % 2 === 0) {
                  this.leftMemo.push(item)
                } else {
                  this.rightMemo.push(item)
                }
              })
            })
          }
        }, 100)
      })
      uni.$on('loginFinished', () => {
        this.$http.get('/memo', {
          header: {
            Cookie: `userId=${uni.getStorageSync('userId')}`
          }
        }).then(res => {
          res.data.forEach((item, index) => {
            if (index % 2 === 0) {
              this.leftMemo.push(item)
            } else {
              this.rightMemo.push(item)
            }
          })
        })
      })
      uni.$on('addMemo', () => {
        const newMemo = {
          createTime: Date.now(),
          content: this.currentMemo
        }
        this.addMemoToDOM(newMemo)
        
        uni.setStorageSync('memoCount', uni.getStorageSync('memoCount') + 1)
        this.changeMemoCount(1)
        
        this.$http.post('/memo', newMemo, {
          header: {
            Cookie: `userId=${uni.getStorageSync('userId')}`
          }
        }).then(res => {
          if (res.data === 'Insert Error') {
            uni.showToast({
              title: '服务器新增数据失败',
            })
            return
          }
          if (res.data === 'Authentication Expires') {
            uni.showToast({
              title: '登录已过期,请重新登录'
            })
            return
          }
          if (res.data === '插入成功') {
          }
        })
      })
    },
    onUnload() {
      uni.$off('addMemo')
    },
    onShow() {
      uni.$off('deleteMemo')
      uni.$off('changeMemo')
    }
	}
</script>

<style lang="scss" scoped>
@import '~@/common/icon';
$line-height: 1.32rem;
.memo {
  background-color: rgb(244, 244, 244);
  padding: 10upx 15upx;
  min-height: 100vh;
  .search-wrapper {
    background-color: rgb(229, 229, 229);
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 10px;
    height: 30px;
    padding-left: 1.1rem;
    .icon-search {
      position: absolute;
      left: 3px;
      font-size: 0.8rem;
    }
    input {
      font-size: 1.1rem;
      width: 100%;
    }
  }
  .left-right-memo-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 14upx;
    .left-memo,.right-memo {
      flex-shrink: 0;
      width: calc((100% - 15upx) / 2);
      // height: 100upx;
      // background-color: white;
      // border: 1px solid blue;
    }
    .memo-content {
      border-radius: 10px;
      font-size: 18px;
      margin-bottom: 14upx;
      background-color: white;
      // line-height: $line-height;
      // min-height: $line-height * 3;
      padding: 1rem;
      padding-bottom: $line-height;
      position: relative;
      .ellipsis {
        line-height: $line-height;
        min-height: $line-height * 2;
        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:7;//设置 需要显示的行数
      }
      .memo-time {
        position: absolute;
        color: #aaa;
        font-size: 12px;
        bottom: 0;
        left: 1rem;
      }
    }
  }
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
}
</style>
