<template>
	<view class="wrapper">
    <uni-nav-bar 
      left-icon="back" 
      left-text="返回" 
      title="编辑备忘录"
      fixed
      statusBar
      shadow
      @clickLeft="back"
    ></uni-nav-bar>
    <view class="bar">
      <view class="delete" @click="textValue = ''">
        清空<text class="icon-eraser iconfont"></text>
      </view>
      <view class="finish" @click="saveMemo">
        完成<text class="icon-check iconfont"></text>
      </view>
    </view>
    <textarea :value="textValue" @input="textValue = $event.detail.value" class="textarea" @confirm="handleConfirm"/>
	</view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
  const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
  // textarea高度就是100vw-上面两个加起来，再加个透明背景图片
  const navBarHeight = '44px'
	export default {
    components: {
      uniNavBar
    },
		data() {
			return {
				todo: null,
        textValue: '',
        originalText: '',
        type: ''
			};
		},
    computed: {
      ...mapState(['currentMemo']),
    },
    created() {
      uni.$on('edit-todo', todo => {
        this.todo = todo
      })
    },
    methods: {
      ...mapMutations(['changeMemo']),
      eraseMemo() {
        this.textValue = ''
      },
      handleConfirm() {
        this.saveMemo()
      },
      back() {
        uni.showModal({
          title: '是否保存修改',
          confirmText: '保存修改',
          cancelText: '取消修改',
          success: (res) => {
            if (res.confirm) {
              // 写保存修改的代码
              this.saveMemo()
              return
            }
            if (res.cancel) {
              // 不保存的代码
              uni.navigateBack()
              return
            }
          }
        })
      },
      saveMemo() {
        if (this.textValue === '') {
          uni.showToast({
            title: '内容不可以为空',
            icon: 'none'
          })
          return
        }
        this.changeMemo(this.textValue)
        if (this.type === 'edit') {
          uni.$emit('changeMemo')
        } else if (this.type === 'add') {
          uni.$emit('addMemo')
        }
        uni.navigateBack()
      }
    },
    onHide() {
      uni.$off('edit-todo') // 可要可不要的功能
    },
    onLoad(option) {
      this.type = option.type // edit/add
      this.textValue = this.currentMemo
      this.originalText = this.currentMemo
    }
	}
</script>

<style lang="scss" scoped>
.bar {
  display: flex;
  justify-content: space-between;
  color: white;
  .delete,.finish {
    padding: 10px;
    border-radius: 15%;
  }
  .delete {
    background-color: red;
  }
  .finish {
    background-color: blue;
  }
}
.textarea {
  background-color: rgb(244, 244, 244);
  width: 100vw;
}
</style>
