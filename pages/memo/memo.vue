<template>
	<view class="memo">
    <view class="search-wrapper">
      <text class="iconfont icon-search"></text>
      <input type="text" placeholder="搜索备忘录" confirm-type="search"/>
    </view>
    <view class="left-right-memo-wrapper">
      <view class="left-memo" ref="leftMemo">
        <view v-for="(memo,index) in leftMemo" :key="index" class="memo-content" @click="handleMemoClick('left', index)">
          {{memo.content}}
          <view class="memo-time">{{memo.createTime | formattedYear}}</view>
        </view>
      </view>
      <view class="right-memo" ref="rightMemo">
        <view v-for="(memo,index) in rightMemo" :key="index" class="memo-content" @click="handleMemoClick('right', index)">
          {{memo.content}}
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
				leftMemo: [],
        rightMemo: [],
        leftMemoHeight: 0,
        rightMemoHeight: 0,
        showTextarea: false,
        memoContent: ''
			}
		},
    computed: {
      ...mapState(['currentMemo', 'isLogin']),
    },
    methods: {
      ...mapMutations(['changeMemo']),
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
        this.changeMemo('')
        uni.navigateTo({
          url: '../edit-memo/edit-memo?type=add'
        })
        uni.$once('addMemo', () => {
          const newMemo = {
            createTime: Date.now(),
            content: this.currentMemo
          }
          this.addMemoToDOM(newMemo)
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
              console.log('插入成功')
            }
          })
        })
      },
      handleMemoClick(leftOrRight, index) {
        const position = `${leftOrRight}Memo`
        this.changeMemo(this[position][index].content)
        uni.navigateTo({
          url: '../edit-memo/edit-memo?type=edit'
        })
        uni.$once('changeMemo', () => {
          const changedMemo = {
            ...this[position][index],
            content: this.currentMemo
          }
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
              console.log('更新成功')
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
      console.log('memo loginStatus', this.isLogin)
      if (this.isLogin) {
        this.$http.get('/memo', {
          header: {
            Cookie: `userId=${uni.getStorageSync('userId')}`
          }
        }).then(res => {
          console.log(res.data)
          // res.data.forEach(this.addMemoToDOM)
          // res.data.forEach(item => this.addMemoToDOM(item))
          res.data.forEach((item, index) => {
            if (index % 2 === 0) {
              this.leftMemo.push(item)
            } else {
              this.rightMemo.push(item)
            }
          })
        })
      }
      uni.$once('loginFinished', () => {
        this.$http.get('/memo', {
          header: {
            Cookie: `userId=${uni.getStorageSync('userId')}`
          }
        }).then(res => {
          console.log(res.data)
          // res.data.forEach(this.addMemoToDOM)
          // res.data.forEach(item => this.addMemoToDOM(item))
          res.data.forEach((item, index) => {
            if (index % 2 === 0) {
              this.leftMemo.push(item)
            } else {
              this.rightMemo.push(item)
            }
          })
        })
      })
    }
	}
</script>

<style lang="scss" scoped>
@import '~@/common/icon';
$line-height: 1.2rem;
.memo {
  background-color: rgb(244, 244, 244);
  padding: 10upx 15upx;
  min-height: 100vh;
  .search-wrapper {
    background-color: white;
    position: relative;
    display: flex;
    align-items: center;
    .icon-search {
      position: absolute;
      left: 0;
      // top: 0.5rem;
      // font-size: 0.5rem;
    }
    input {
      padding: 0.2rem 1.1rem;
      font-size: 0.8rem;

    }
  }
  .left-right-memo-wrapper {
    border: 1px solid red;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 10upx;
    .left-memo,.right-memo {
      flex-shrink: 0;
      width: calc((100% - 15upx) / 2);
      // height: 100upx;
      // background-color: white;
      // border: 1px solid blue;
    }
    .memo-content {
      margin-bottom: 10upx;
      background-color: white;
      line-height: $line-height;
      min-height: $line-height * 3;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box; -webkit-line-clamp: 7; -webkit-box-orient: vertical;
      padding-bottom: $line-height;
      position: relative;
      .memo-time {
        position: absolute;
        color: #aaa;
        font-size: 12px;
        bottom: 0;
        left: 0;
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
